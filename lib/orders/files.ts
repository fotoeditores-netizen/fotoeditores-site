/*
 * Reglas de archivos del pedido (docs/FUNNEL_PLAN.md §5.2 y Fase 3).
 *
 * La extensión manda: el tipo que declara el navegador es poco confiable
 * (Windows no reconoce HEIC, algunos móviles no mandan nada). Después de subir,
 * el servidor lee los primeros bytes (sniffFamily) y exige que coincidan con la
 * extensión: un .exe renombrado a .jpg se rechaza.
 */

export const ALLOWED_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  heic: "image/heic",
  heif: "image/heif",
  webp: "image/webp",
  tif: "image/tiff",
  tiff: "image/tiff",
  mp4: "video/mp4",
  mov: "video/quicktime",
} as const;

export type AllowedExt = keyof typeof ALLOWED_TYPES;
export type AllowedMime = (typeof ALLOWED_TYPES)[AllowedExt];

// Familia = formato real del archivo según sus primeros bytes.
export type FileFamily = "jpeg" | "png" | "webp" | "tiff" | "heif" | "video";

const FAMILY_BY_MIME: Record<AllowedMime, FileFamily> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
  "image/tiff": "tiff",
  "image/heic": "heif",
  "image/heif": "heif",
  // MP4 y MOV comparten contenedor (ISO BMFF); muchos celulares los intercambian.
  "video/mp4": "video",
  "video/quicktime": "video",
};

export const ACCEPT_ATTRIBUTE = Object.keys(ALLOWED_TYPES)
  .map((ext) => `.${ext}`)
  .concat([...new Set(Object.values(ALLOWED_TYPES))])
  .join(",");

export function extensionOf(filename: string): string {
  const match = /\.([A-Za-z0-9]+)$/.exec(filename.trim());
  return match ? match[1].toLowerCase() : "";
}

export function mimeFromFilename(filename: string): AllowedMime | null {
  const ext = extensionOf(filename);
  return ext in ALLOWED_TYPES ? ALLOWED_TYPES[ext as AllowedExt] : null;
}

export const isVideoMime = (mime: string) => mime.startsWith("video/");

export function familyOfMime(mime: AllowedMime): FileFamily {
  return FAMILY_BY_MIME[mime];
}

// Nombre original saneado para mostrar y guardar en order_files.filename.
export function displayFileName(filename: string): string {
  const clean = filename
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, "")
    .trim();
  if (clean.length <= 120) return clean || "archivo";
  const ext = extensionOf(clean);
  return `${clean.slice(0, 110)}…${ext ? "." + ext : ""}`;
}

export type PackageLimits = { max_files: number; max_file_mb: number; accepts_video: boolean };

export type UploadCheck =
  | { ok: true; mime: AllowedMime; ext: string }
  | { ok: false; error: string };

// Validación antes de firmar la subida. Se repite (con el tamaño real) al confirmarla.
export function checkUpload(
  file: { filename: string; size: number },
  limits: PackageLimits,
  filesAlreadyInOrder: number,
): UploadCheck {
  const mime = mimeFromFilename(file.filename);
  if (!mime) {
    return {
      ok: false,
      error: "Formato no permitido. Sube fotos JPG, PNG, HEIC, WEBP o TIFF, o videos MP4 o MOV.",
    };
  }
  if (isVideoMime(mime) && !limits.accepts_video) {
    return { ok: false, error: "Este paquete es solo para fotos. Para video elige el paquete de video." };
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    return { ok: false, error: "El archivo está vacío." };
  }
  const maxBytes = limits.max_file_mb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `El archivo pesa más de ${limits.max_file_mb} MB. Compártelo con un enlace de Google Drive o WeTransfer en el siguiente paso.`,
    };
  }
  if (filesAlreadyInOrder >= limits.max_files) {
    return {
      ok: false,
      error: `Este paquete admite hasta ${limits.max_files} ${limits.max_files === 1 ? "archivo" : "archivos"}.`,
    };
  }
  return { ok: true, mime, ext: extensionOf(file.filename) };
}

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, start + length));

// Reconoce el formato real por sus primeros bytes ("números mágicos").
export function sniffFamily(bytes: Uint8Array): FileFamily | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes[0] === 0x89 && ascii(bytes, 1, 3) === "PNG") return "png";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") return "webp";
  if (ascii(bytes, 0, 4) === "II*\u0000" || ascii(bytes, 0, 4) === "MM\u0000*") return "tiff";
  if (ascii(bytes, 4, 4) === "ftyp") {
    const brand = ascii(bytes, 8, 4);
    if (["heic", "heix", "heim", "heis", "hevc", "hevx", "mif1", "msf1", "avif"].includes(brand)) return "heif";
    return "video"; // isom, mp41, mp42, avc1, M4V, "qt  " (MOV)…
  }
  // MOV antiguos sin caja ftyp al inicio.
  if (["moov", "mdat", "wide", "free"].includes(ascii(bytes, 4, 4))) return "video";
  return null;
}

// ── Entregas del editor (Fase 5) ─────────────────────────────────────────────
// El editor es de confianza (sesión con rol), pero igual se limitan los tipos:
// son archivos que el cliente descargará.
export const DELIVERY_TYPES: Record<string, string> = {
  ...ALLOWED_TYPES,
  gif: "image/gif",
  zip: "application/zip",
  pdf: "application/pdf",
  psd: "image/vnd.adobe.photoshop",
};

export const DELIVERY_ACCEPT = Object.keys(DELIVERY_TYPES)
  .map((ext) => `.${ext}`)
  .join(",");

// Máximo por archivo del plan actual de Supabase Storage.
export const DELIVERY_MAX_MB = 50;

export function checkDeliveryUpload(file: { filename: string; size: number }): UploadCheck | { ok: true; mime: string; ext: string } {
  const ext = extensionOf(file.filename);
  const mime = DELIVERY_TYPES[ext];
  if (!mime) return { ok: false, error: "Formato no permitido para entregas (usa JPG, PNG, TIFF, MP4, MOV, ZIP, PDF o PSD)." };
  if (!Number.isFinite(file.size) || file.size <= 0) return { ok: false, error: "El archivo está vacío." };
  if (file.size > DELIVERY_MAX_MB * 1024 * 1024) {
    return { ok: false, error: `Máximo ${DELIVERY_MAX_MB} MB por archivo. Divide el ZIP o comparte un enlace por WhatsApp.` };
  }
  return { ok: true, mime, ext };
}
