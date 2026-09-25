import type { SupabaseClient } from "@supabase/supabase-js";
import { submitSchema, fieldErrors } from "@/lib/orders/brief";
import { checkUpload, displayFileName, familyOfMime, mimeFromFilename, sniffFamily } from "@/lib/orders/files";
import { isValidPublicToken } from "@/lib/orders/token";

/*
 * Lógica de pedidos del lado del servidor (Fase 3). Recibe el cliente de
 * Supabase por parámetro para poder probarla contra la base real; los Route
 * Handlers solo validan la petición (Turnstile, formato) y llaman aquí.
 *
 * El cliente se identifica con public_token (32 caracteres aleatorios): quien
 * tiene el token es el dueño del pedido. Nunca se usa el id interno en la URL.
 */

export const ORIGINALS_BUCKET = "originals";

export class OrderError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 403 | 404 | 409 | 422 | 503 = 400,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "OrderError";
  }
}

type PackageRow = {
  id: string;
  slug: string;
  name: string;
  segment: "producto" | "recuerdos" | "ambos";
  price_usd: number | null;
  max_files: number;
  max_file_mb: number;
  accepts_video: boolean;
  turnaround_hours: number;
  revisions_included: number;
};

export type OrderFile = { id: string; filename: string; mime: string; size_bytes: number; created_at: string };

export type OrderView = {
  id: string;
  code: string;
  public_token: string;
  status: string;
  amount_usd: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_whatsapp: string | null;
  brief: Record<string, unknown>;
  created_at: string;
  paid_at: string | null;
  delivered_at: string | null;
  revisions_used: number;
  package: PackageRow;
  /** Originales que subió el cliente. */
  files: OrderFile[];
  /** Archivos finales que subió el editor (Fase 5). */
  deliveries: OrderFile[];
};

const PACKAGE_COLUMNS =
  "id, slug, name, segment, price_usd, max_files, max_file_mb, accepts_video, turnaround_hours, revisions_included";

async function logEvent(sb: SupabaseClient, orderId: string, type: string, payload: Record<string, unknown> = {}) {
  const { error } = await sb.from("order_events").insert({ order_id: orderId, type, actor: "customer", payload });
  if (error) console.error("order_events:", error.message); // la bitácora no debe tumbar el pedido
}

async function getActivePackage(sb: SupabaseClient, slug: string): Promise<PackageRow> {
  const { data, error } = await sb.from("packages").select(PACKAGE_COLUMNS).eq("slug", slug).eq("active", true).maybeSingle();
  if (error) throw new Error(`packages: ${error.message}`);
  if (!data) throw new OrderError("Ese paquete no existe o ya no está disponible.", 404);
  if (data.price_usd == null) throw new OrderError("Este servicio se cotiza por WhatsApp.", 422);
  return { ...data, price_usd: Number(data.price_usd) } as PackageRow;
}

// ── Crear y leer ──────────────────────────────────────────────────────────────

export async function createDraft(
  sb: SupabaseClient,
  input: { packageSlug: string; utm?: Record<string, string> },
): Promise<{ code: string; public_token: string }> {
  const pkg = await getActivePackage(sb, input.packageSlug);
  const { data, error } = await sb
    .from("orders")
    .insert({ package_id: pkg.id, amount_usd: pkg.price_usd, utm: input.utm ?? {} })
    .select("id, code, public_token")
    .single();
  if (error) throw new Error(`orders.insert: ${error.message}`);
  await logEvent(sb, data.id, "draft_created", { package: pkg.slug });
  return { code: data.code, public_token: data.public_token };
}

export async function getOrderByToken(sb: SupabaseClient, token: string): Promise<OrderView | null> {
  if (!isValidPublicToken(token)) return null;
  const { data, error } = await sb
    .from("orders")
    .select(
      `id, code, public_token, status, amount_usd, customer_name, customer_email, customer_whatsapp, brief, created_at,
       paid_at, delivered_at, revisions_used,
       package:packages(${PACKAGE_COLUMNS}),
       files:order_files(id, filename, mime, size_bytes, created_at, kind)`,
    )
    .eq("public_token", token)
    .maybeSingle();
  if (error) throw new Error(`orders.select: ${error.message}`);
  if (!data) return null;
  const pkg = data.package as unknown as PackageRow;
  const all = (data.files ?? []) as (OrderFile & { kind: string })[];
  const ofKind = (kind: string) =>
    all
      .filter((f) => f.kind === kind)
      .map(({ kind: _kind, ...f }) => f)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  return {
    ...data,
    amount_usd: Number(data.amount_usd),
    package: { ...pkg, price_usd: pkg.price_usd == null ? null : Number(pkg.price_usd) },
    files: ofKind("original"),
    deliveries: ofKind("delivery"),
  } as OrderView;
}

async function requireDraft(sb: SupabaseClient, token: string): Promise<OrderView> {
  const order = await getOrderByToken(sb, token);
  if (!order) throw new OrderError("No encontramos ese pedido.", 404);
  if (order.status !== "draft") throw new OrderError("Este pedido ya fue enviado y no se puede modificar.", 409);
  return order;
}

// ── Cambiar de paquete (solo en borrador) ─────────────────────────────────────

export async function changePackage(sb: SupabaseClient, token: string, packageSlug: string) {
  const order = await requireDraft(sb, token);
  const pkg = await getActivePackage(sb, packageSlug);
  if (order.files.length > pkg.max_files) {
    throw new OrderError(
      `Ya subiste ${order.files.length} archivos y "${pkg.name}" admite ${pkg.max_files}. Borra algunos antes de cambiar.`,
      409,
    );
  }
  if (!pkg.accepts_video && order.files.some((f) => f.mime.startsWith("video/"))) {
    throw new OrderError(`"${pkg.name}" es solo para fotos. Borra los videos antes de cambiar.`, 409);
  }
  const { error } = await sb.from("orders").update({ package_id: pkg.id, amount_usd: pkg.price_usd }).eq("id", order.id);
  if (error) throw new Error(`orders.update: ${error.message}`);
  await logEvent(sb, order.id, "package_changed", { from: order.package.slug, to: pkg.slug });
}

// ── Subidas ───────────────────────────────────────────────────────────────────

export async function issueUploadUrl(
  sb: SupabaseClient,
  token: string,
  file: { filename: string; size: number },
): Promise<{ path: string; token: string; mime: string }> {
  const order = await requireDraft(sb, token);
  const check = checkUpload(file, order.package, order.files.length);
  if (!check.ok) throw new OrderError(check.error, 422);

  // Nombre interno aleatorio: el original solo se guarda como texto (order_files.filename).
  const path = `${order.id}/${crypto.randomUUID()}.${check.ext}`;
  const { data, error } = await sb.storage.from(ORIGINALS_BUCKET).createSignedUploadUrl(path);
  if (error) throw new Error(`createSignedUploadUrl: ${error.message}`);
  return { path, token: data.token, mime: check.mime };
}

// Lee solo los primeros bytes del objeto subido (no lo descarga entero).
async function readHead(sb: SupabaseClient, path: string, bytes = 64): Promise<Uint8Array> {
  const { data, error } = await sb.storage.from(ORIGINALS_BUCKET).createSignedUrl(path, 60);
  if (error) throw new Error(`createSignedUrl: ${error.message}`);
  const res = await fetch(data.signedUrl, { headers: { Range: `bytes=0-${bytes - 1}` } });
  if (!res.ok) throw new Error(`lectura de cabecera: HTTP ${res.status}`);
  return new Uint8Array(await res.arrayBuffer()).subarray(0, bytes);
}

async function removeObject(sb: SupabaseClient, path: string) {
  const { error } = await sb.storage.from(ORIGINALS_BUCKET).remove([path]);
  if (error) console.error("storage.remove:", error.message);
}

export async function confirmUpload(
  sb: SupabaseClient,
  token: string,
  input: { path: string; filename: string },
): Promise<OrderFile> {
  const order = await requireDraft(sb, token);

  // La ruta debe ser de este pedido y tener la forma que emitimos.
  const prefix = `${order.id}/`;
  const objectName = input.path.startsWith(prefix) ? input.path.slice(prefix.length) : "";
  if (!/^[0-9a-f-]{36}\.[a-z0-9]{2,5}$/.test(objectName)) throw new OrderError("Archivo inválido.", 403);

  const existing = await sb.from("order_files").select("id, filename, mime, size_bytes, created_at").eq("storage_path", input.path).maybeSingle();
  if (existing.data) return existing.data as OrderFile; // confirmación repetida: idempotente

  const listed = await sb.storage.from(ORIGINALS_BUCKET).list(order.id, { search: objectName, limit: 1 });
  const object = listed.data?.find((o) => o.name === objectName);
  if (listed.error || !object) throw new OrderError("No encontramos el archivo subido. Intenta de nuevo.", 404);
  const size = Number(object.metadata?.size ?? 0);

  // Se revalida con el tamaño REAL y el conteo actual; si no pasa, el objeto se borra.
  const fail = async (message: string, status: 403 | 409 | 422 = 422): Promise<never> => {
    await removeObject(sb, input.path);
    throw new OrderError(message, status);
  };

  const filename = displayFileName(input.filename);
  const mime = mimeFromFilename(filename);
  if (!mime || mimeFromFilename(input.path) !== mime) await fail("El tipo de archivo no coincide con lo autorizado.", 403);
  const check = checkUpload({ filename, size }, order.package, order.files.length);
  if (!check.ok) await fail(check.error);

  const family = sniffFamily(await readHead(sb, input.path));
  if (family !== familyOfMime(mime!)) {
    await fail("El contenido del archivo no corresponde a una foto o video válido.");
  }

  const { data, error } = await sb
    .from("order_files")
    .insert({ order_id: order.id, kind: "original", storage_path: input.path, filename, mime, size_bytes: size })
    .select("id, filename, mime, size_bytes, created_at")
    .single();
  if (error) {
    await removeObject(sb, input.path);
    throw new Error(`order_files.insert: ${error.message}`);
  }
  await logEvent(sb, order.id, "file_uploaded", { filename, size });
  return data as OrderFile;
}

export async function deleteFile(sb: SupabaseClient, token: string, fileId: string) {
  const order = await requireDraft(sb, token);
  const { data } = await sb.from("order_files").select("id, storage_path").eq("id", fileId).eq("order_id", order.id).maybeSingle();
  if (!data) throw new OrderError("No encontramos ese archivo.", 404);
  await removeObject(sb, data.storage_path);
  await sb.from("order_files").delete().eq("id", data.id);
  await logEvent(sb, order.id, "file_deleted", { file: data.id });
}

// ── Enviar ────────────────────────────────────────────────────────────────────

export async function submitOrder(sb: SupabaseClient, token: string, input: unknown): Promise<OrderView> {
  const order = await requireDraft(sb, token);
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) throw new OrderError("Revisa los campos marcados.", 422, fieldErrors(parsed.error));
  const { brief, customer } = parsed.data;

  if (order.files.length === 0 && !brief.externalLink) {
    throw new OrderError("Sube al menos un archivo o comparte un enlace con tus archivos.", 422, {
      files: "Sube al menos un archivo o comparte un enlace",
    });
  }

  const { error } = await sb
    .from("orders")
    .update({
      status: "awaiting_payment",
      brief,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_whatsapp: customer.whatsapp,
      consent_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("status", "draft"); // evita doble envío concurrente
  if (error) throw new Error(`orders.update: ${error.message}`);
  await logEvent(sb, order.id, "submitted", { files: order.files.length });

  return (await getOrderByToken(sb, token))!;
}

// ── Limpieza de borradores abandonados (tarea programada) ────────────────────

export async function expireDrafts(sb: SupabaseClient, olderThanDays = 7): Promise<{ expired: number; files: number }> {
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();
  const { data: drafts, error } = await sb.from("orders").select("id").eq("status", "draft").lt("created_at", cutoff).limit(200);
  if (error) throw new Error(`orders.select: ${error.message}`);

  let files = 0;
  for (const { id } of drafts ?? []) {
    // Borra todo lo que haya en la carpeta del pedido, confirmado o no.
    const listed = await sb.storage.from(ORIGINALS_BUCKET).list(id, { limit: 1000 });
    const paths = (listed.data ?? []).map((o) => `${id}/${o.name}`);
    if (paths.length) {
      await sb.storage.from(ORIGINALS_BUCKET).remove(paths);
      files += paths.length;
    }
    await sb.from("order_files").delete().eq("order_id", id);
    await sb.from("orders").update({ status: "expired" }).eq("id", id).eq("status", "draft");
    await sb.from("order_events").insert({ order_id: id, type: "expired", actor: "system", payload: { files: paths.length } });
  }
  return { expired: drafts?.length ?? 0, files };
}
