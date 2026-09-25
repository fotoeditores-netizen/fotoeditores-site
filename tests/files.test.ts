import { describe, expect, it } from "vitest";
import { checkUpload, displayFileName, mimeFromFilename, sniffFamily } from "@/lib/orders/files";

const photoPack = { max_files: 10, max_file_mb: 50, accepts_video: false };
const videoPack = { max_files: 1, max_file_mb: 50, accepts_video: true };
const MB = 1024 * 1024;

describe("checkUpload", () => {
  it("acepta una foto JPG dentro de los límites", () => {
    expect(checkUpload({ filename: "boda.JPG", size: 5 * MB }, photoPack, 0)).toEqual({
      ok: true,
      mime: "image/jpeg",
      ext: "jpg",
    });
  });

  it.each(["foto.heic", "foto.HEIF", "foto.webp", "scan.tiff", "scan.tif", "foto.png"])("acepta %s", (name) => {
    expect(checkUpload({ filename: name, size: MB }, photoPack, 0).ok).toBe(true);
  });

  it.each(["virus.exe", "documento.pdf", "foto.jpg.exe", "sin-extension", "script.svg", "archivo.zip"])(
    "rechaza tipo inválido: %s",
    (name) => {
      const result = checkUpload({ filename: name, size: MB }, photoPack, 0);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain("Formato no permitido");
    },
  );

  it("rechaza video en un paquete solo de fotos", () => {
    const result = checkUpload({ filename: "clip.mp4", size: MB }, photoPack, 0);
    expect(result.ok).toBe(false);
  });

  it("acepta video en el paquete de video", () => {
    expect(checkUpload({ filename: "clip.MOV", size: 40 * MB }, videoPack, 0).ok).toBe(true);
  });

  it("rechaza exceso de peso y sugiere compartir un enlace", () => {
    const result = checkUpload({ filename: "grande.jpg", size: 50 * MB + 1 }, photoPack, 0);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/50 MB.*Drive/);
  });

  it("rechaza exceso de cantidad", () => {
    expect(checkUpload({ filename: "11.jpg", size: MB }, photoPack, 10).ok).toBe(false);
    expect(checkUpload({ filename: "10.jpg", size: MB }, photoPack, 9).ok).toBe(true);
  });

  it("rechaza archivos vacíos o con tamaño inválido", () => {
    expect(checkUpload({ filename: "a.jpg", size: 0 }, photoPack, 0).ok).toBe(false);
    expect(checkUpload({ filename: "a.jpg", size: Number.NaN }, photoPack, 0).ok).toBe(false);
  });
});

describe("mimeFromFilename", () => {
  it("usa la extensión y no distingue mayúsculas", () => {
    expect(mimeFromFilename("IMG_0001.HEIC")).toBe("image/heic");
    expect(mimeFromFilename("video.mov")).toBe("video/quicktime");
    expect(mimeFromFilename("nada")).toBeNull();
  });
});

describe("displayFileName", () => {
  it("quita caracteres peligrosos para rutas y HTML", () => {
    expect(displayFileName('../<script>"a".jpg')).toBe("..scripta.jpg");
  });

  it("recorta nombres muy largos conservando la extensión", () => {
    const name = displayFileName("x".repeat(300) + ".jpeg");
    expect(name.length).toBeLessThanOrEqual(120);
    expect(name.endsWith(".jpeg")).toBe(true);
  });
});

describe("sniffFamily", () => {
  const bytes = (...parts: (number[] | string)[]) => {
    const out: number[] = [];
    for (const p of parts) out.push(...(typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p));
    while (out.length < 16) out.push(0);
    return new Uint8Array(out);
  };

  it("reconoce los formatos permitidos", () => {
    expect(sniffFamily(bytes([0xff, 0xd8, 0xff, 0xe0]))).toBe("jpeg");
    expect(sniffFamily(bytes([0x89], "PNG", [0x0d, 0x0a]))).toBe("png");
    expect(sniffFamily(bytes("RIFF", [0, 0, 0, 0], "WEBP"))).toBe("webp");
    expect(sniffFamily(bytes("II*", [0]))).toBe("tiff");
    expect(sniffFamily(bytes([0, 0, 0, 0x18], "ftypheic"))).toBe("heif");
    expect(sniffFamily(bytes([0, 0, 0, 0x18], "ftypisom"))).toBe("video");
    expect(sniffFamily(bytes([0, 0, 0, 0x14], "ftypqt  "))).toBe("video");
  });

  it("no reconoce un ejecutable de Windows ni un PDF", () => {
    expect(sniffFamily(bytes("MZ", [0x90, 0]))).toBeNull();
    expect(sniffFamily(bytes("%PDF-1.7"))).toBeNull();
  });
});
