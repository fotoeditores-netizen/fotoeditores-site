"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload as TusUpload } from "tus-js-client";
import { AlertCircle, CheckCircle2, Film, ImageIcon, Loader2, RotateCcw, UploadCloud, X } from "lucide-react";
import { ACCEPT_ATTRIBUTE, checkUpload, isVideoMime } from "@/lib/orders/files";

/*
 * Destino de las subidas: dónde se firma, en qué bucket queda, cómo se confirma
 * y qué reglas aplica. El cliente sube originales; el editor, entregas (Fase 5).
 */
export type UploadTarget = {
  uploadUrl: string;
  confirmUrl: string;
  deleteUrl: (fileId: string) => string;
  bucket: "originals" | "deliveries";
  accept: string;
  maxFiles: number;
  check: (file: { filename: string; size: number }, used: number) => { ok: true } | { ok: false; error: string };
  title: string;
  hint: string;
};

export function customerTarget(token: string, limits: PublicOrder["package"]): UploadTarget {
  return {
    uploadUrl: `/api/orders/${token}/upload-url`,
    confirmUrl: `/api/orders/${token}/files`,
    deleteUrl: (id) => `/api/orders/${token}/files/${id}`,
    bucket: "originals",
    accept: ACCEPT_ATTRIBUTE,
    maxFiles: limits.max_files,
    check: (file, used) => checkUpload(file, limits, used),
    title: `Sube tus ${limits.accepts_video ? "fotos o videos" : "fotos"}`,
    hint: `Hasta ${limits.max_files} ${limits.max_files === 1 ? "archivo" : "archivos"} de máximo ${limits.max_file_mb} MB cada uno · JPG, PNG, HEIC, WEBP, TIFF${limits.accepts_video ? ", MP4, MOV" : ""}`,
  };
}
import { api, ApiError, type PublicOrder } from "@/lib/orders/client";

/*
 * Subida directa del navegador a Supabase Storage con TUS (reanudable):
 *   1. el servidor valida y firma la subida (/upload-url)
 *   2. el archivo va directo a Storage en bloques de 6 MB (no pasa por Vercel)
 *   3. el servidor confirma tamaño real y contenido (/files)
 * Si se cae la conexión, tus-js-client reintenta y continúa desde el último
 * bloque ya recibido (no empieza de cero). Tras una recarga, lo confirmado queda
 * guardado en el pedido; las subidas a medias se vuelven a elegir (cada una usa
 * una firma nueva del servidor, así que no se retoman entre recargas).
 */

type ServerFile = PublicOrder["files"][number];

type Item = {
  key: string;
  file: File;
  preview?: string;
  status: "queued" | "uploading" | "confirming" | "done" | "error";
  progress: number;
  error?: string;
};

const CHUNK_SIZE = 6 * 1024 * 1024; // exigido por Supabase para TUS
const PARALLEL = 2;

function storageEndpoint(): string {
  // Host directo de Storage (recomendado para archivos grandes). Con token firmado
  // (x-signature) la ruta es /resumable/sign; /resumable exige un JWT de usuario.
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  const ref = url.hostname.split(".")[0];
  return `https://${ref}.storage.supabase.co/storage/v1/upload/resumable/sign`;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default function FileUploader({
  token,
  limits,
  files,
  onFilesChange,
  onBusyChange,
  target: targetProp,
}: {
  token?: string;
  limits?: PublicOrder["package"];
  /** Si no se indica, se sube como cliente (originales) con token y limits. */
  target?: UploadTarget;
  files: ServerFile[];
  onFilesChange: (files: ServerFile[]) => void;
  /** true mientras haya subidas en cola o en curso (el asistente no deja avanzar). */
  onBusyChange?: (busy: boolean) => void;
}) {
  const target = targetProp ?? customerTarget(token!, limits!);
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const started = useRef(new Set<string>()); // evita iniciar dos veces la misma subida

  const patch = useCallback((key: string, change: Partial<Item>) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...change } : it)));
  }, []);

  // Libera las vistas previas al salir.
  useEffect(() => () => itemsRef.current.forEach((it) => it.preview && URL.revokeObjectURL(it.preview)), []);

  const uploadOne = useCallback(
    async (item: Item) => {
      patch(item.key, { status: "uploading", progress: 0, error: undefined });
      try {
        const signed = await api<{ path: string; token: string; mime: string }>(target.uploadUrl, {
          method: "POST",
          json: { filename: item.file.name, size: item.file.size },
        });

        await new Promise<void>((resolve, reject) => {
          const upload = new TusUpload(item.file, {
            endpoint: storageEndpoint(),
            retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
            chunkSize: CHUNK_SIZE,
            storeFingerprintForResuming: false,
            headers: {
              "x-signature": signed.token,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            },
            metadata: {
              bucketName: target.bucket,
              objectName: signed.path,
              contentType: signed.mime,
              cacheControl: "3600",
            },
            onProgress: (sent, total) => patch(item.key, { progress: total ? Math.round((sent / total) * 100) : 0 }),
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
          upload.start();
        });

        patch(item.key, { status: "confirming", progress: 100 });
        const file = await api<ServerFile>(target.confirmUrl, {
          method: "POST",
          json: { path: signed.path, filename: item.file.name },
        });
        onFilesChange([...filesRef.current.filter((f) => f.id !== file.id), file]);
        patch(item.key, { status: "done" });
        // Ya está en la lista del servidor: se quita de la cola local.
        setTimeout(() => {
          setItems((prev) => prev.filter((it) => it.key !== item.key));
          if (item.preview) URL.revokeObjectURL(item.preview);
        }, 600);
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Se interrumpió la subida. Revisa tu conexión y toca «Reintentar».";
        patch(item.key, { status: "error", error: message });
      }
    },
    [target.uploadUrl, target.confirmUrl, target.bucket, patch, onFilesChange],
  );

  // Cola: como máximo PARALLEL subidas a la vez.
  useEffect(() => {
    const active = items.filter((it) => it.status === "uploading" || it.status === "confirming").length;
    const next = items
      .filter((it) => it.status === "queued" && !started.current.has(it.key))
      .slice(0, Math.max(0, PARALLEL - active));
    for (const it of next) {
      started.current.add(it.key);
      void uploadOne(it);
    }
  }, [items, uploadOne]);

  const busy = items.some((it) => it.status === "queued" || it.status === "uploading" || it.status === "confirming");
  useEffect(() => onBusyChange?.(busy), [busy, onBusyChange]);

  // Aviso del navegador si intentan cerrar la pestaña con subidas en curso.
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  function addFiles(list: FileList | File[]) {
    setNotice(null);
    const incoming = Array.from(list);
    const pending = itemsRef.current.filter((it) => it.status !== "error").length;
    const accepted: Item[] = [];
    const rejected: string[] = [];
    for (const file of incoming) {
      const used = filesRef.current.length + pending + accepted.length;
      const check = target.check({ filename: file.name, size: file.size }, used);
      if (!check.ok) {
        rejected.push(`${file.name}: ${check.error}`);
        continue;
      }
      accepted.push({
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        preview: file.type.startsWith("image/") && !/heic|heif|tiff/i.test(file.type) ? URL.createObjectURL(file) : undefined,
        status: "queued",
        progress: 0,
      });
    }
    if (accepted.length) setItems((prev) => [...prev, ...accepted]);
    if (rejected.length) setNotice(rejected.slice(0, 3).join(" · ") + (rejected.length > 3 ? ` · y ${rejected.length - 3} más` : ""));
  }

  async function removeServerFile(file: ServerFile) {
    try {
      await api(target.deleteUrl(file.id), { method: "DELETE" });
      onFilesChange(filesRef.current.filter((f) => f.id !== file.id));
    } catch (error) {
      setNotice(error instanceof ApiError ? error.message : "No se pudo borrar el archivo.");
    }
  }

  const used = files.length + items.filter((it) => it.status !== "error").length;
  const full = used >= target.maxFiles;

  return (
    <div>
      {/* Zona para soltar / elegir */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!full) addFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors ${
          dragging ? "border-cyan-digital bg-cyan-digital/10" : "border-white/15 bg-white/[0.02]"
        } ${full ? "opacity-60" : ""}`}
      >
        <UploadCloud size={36} className="mx-auto mb-3 text-cyan-digital" />
        <p className="font-semibold text-white mb-1" style={{ fontFamily: "var(--font-montserrat)" }}>
          {full ? "Ya alcanzaste el máximo de este paquete" : target.title}
        </p>
        <p className="text-sm text-white/55 mb-5">
          {target.hint}
        </p>
        <button
          type="button"
          disabled={full}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-energy px-6 py-3 text-sm font-bold text-white disabled:opacity-40"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          <ImageIcon size={16} />
          Elegir desde mi {typeof navigator !== "undefined" && /Mobi/i.test(navigator.userAgent) ? "galería" : "computador"}
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple={target.maxFiles > 1}
          accept={target.accept}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {notice && (
        <p role="alert" className="mt-3 flex gap-2 rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-white/85">
          <AlertCircle size={18} className="shrink-0 text-coral" />
          {notice}
        </p>
      )}

      {/* Lista */}
      <ul className="mt-5 space-y-2" aria-live="polite">
        {files.map((file) => (
          <li key={file.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-digital">
              {isVideoMime(file.mime) ? <Film size={20} /> : <ImageIcon size={20} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-white">{file.filename}</span>
              <span className="flex items-center gap-1 text-xs text-white/50">
                <CheckCircle2 size={12} className="text-emerald-400" /> Subido · {formatSize(file.size_bytes)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => removeServerFile(file)}
              className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
              aria-label={`Quitar ${file.filename}`}
            >
              <X size={18} />
            </button>
          </li>
        ))}

        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            {item.preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:), no se optimiza
              <img src={item.preview} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-digital">
                {item.file.type.startsWith("video/") ? <Film size={20} /> : <ImageIcon size={20} />}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-white">{item.file.name}</span>
              {item.status === "error" ? (
                <span className="block text-xs text-coral">{item.error}</span>
              ) : (
                <>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-gradient-energy transition-[width] duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </span>
                  <span className="mt-1 block text-xs text-white/50">
                    {item.status === "queued" && "En espera…"}
                    {item.status === "uploading" && `Subiendo ${item.progress}% · ${formatSize(item.file.size)}`}
                    {item.status === "confirming" && "Verificando…"}
                    {item.status === "done" && "Listo"}
                  </span>
                </>
              )}
            </span>
            {item.status === "error" ? (
              <span className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    started.current.delete(item.key);
                    patch(item.key, { status: "queued", progress: 0, error: undefined });
                  }}
                  className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label={`Reintentar ${item.file.name}`}
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((it) => it.key !== item.key))}
                  className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
                  aria-label={`Descartar ${item.file.name}`}
                >
                  <X size={18} />
                </button>
              </span>
            ) : item.status !== "done" ? (
              <Loader2 size={18} className="animate-spin text-white/40" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-400" />
            )}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-white/45">
        {files.length} de {target.maxFiles} {target.maxFiles === 1 ? "archivo" : "archivos"} ·{" "}
        {items.some((it) => it.status === "uploading" || it.status === "queued" || it.status === "confirming")
          ? "no cierres esta página mientras se suben"
          : "puedes cerrar y volver: lo subido queda guardado"}
      </p>
    </div>
  );
}
