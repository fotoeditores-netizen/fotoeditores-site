/*
 * Pruebas de integración de la Fase 3 contra el Supabase de .env.local.
 * Crean pedidos reales con la llave de servicio y los borran al final.
 *
 * Criterios del plan: tipo inválido, exceso de peso, exceso de cantidad,
 * subida a un pedido que no está en draft, y que nadie pueda leer archivos de
 * otro pedido.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  ORIGINALS_BUCKET,
  OrderError,
  changePackage,
  confirmUpload,
  createDraft,
  deleteFile,
  expireDrafts,
  getOrderByToken,
  issueUploadUrl,
  submitOrder,
} from "@/lib/orders/service";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = Boolean(url && anonKey && serviceKey);

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1]);
const EXE = new Uint8Array([0x4d, 0x5a, 0x90, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0xff, 0xff, 0, 0]);

const validSubmit = {
  brief: { goals: ["nitidez"], usage: "album", references: "", notes: "prueba automática", externalLink: "" },
  customer: { name: "Prueba Automática", email: "pruebas@fotoeditores.com", whatsapp: "3001234567" },
  consent: true,
};

async function expectOrderError(promise: Promise<unknown>, status: number, text?: RegExp) {
  const error = await promise.then(
    () => null,
    (e) => e,
  );
  expect(error, "se esperaba un OrderError").toBeInstanceOf(OrderError);
  expect((error as OrderError).status).toBe(status);
  if (text) expect((error as OrderError).message).toMatch(text);
}

describe.skipIf(!configured)("Pedidos (Fase 3) contra Supabase", () => {
  let admin: SupabaseClient;
  let anon: SupabaseClient;
  const tokens: string[] = [];

  // Sube como lo haría el navegador: con la URL firmada que emite el servidor.
  async function upload(token: string, filename: string, bytes: Uint8Array<ArrayBuffer>, declaredSize = bytes.length) {
    const signed = await issueUploadUrl(admin, token, { filename, size: declaredSize });
    const { error } = await anon.storage
      .from(ORIGINALS_BUCKET)
      .uploadToSignedUrl(signed.path, signed.token, new Blob([bytes], { type: signed.mime }), { contentType: signed.mime });
    if (error) throw new Error(`subida: ${error.message}`);
    return signed.path;
  }

  async function newDraft(slug: string) {
    const draft = await createDraft(admin, { packageSlug: slug, utm: { utm_source: "vitest" } });
    tokens.push(draft.public_token);
    return draft;
  }

  beforeAll(() => {
    admin = createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } });
    anon = createClient(url!, anonKey!, { auth: { persistSession: false } });
  });

  afterAll(async () => {
    for (const token of tokens) {
      const order = await getOrderByToken(admin, token);
      if (!order) continue;
      const listed = await admin.storage.from(ORIGINALS_BUCKET).list(order.id);
      const paths = (listed.data ?? []).map((o) => `${order.id}/${o.name}`);
      if (paths.length) await admin.storage.from(ORIGINALS_BUCKET).remove(paths);
      await admin.from("orders").delete().eq("id", order.id);
    }
  });

  it("crea un borrador con código, token, precio del paquete y UTM", async () => {
    const draft = await newDraft("rescate-pack-10");
    const order = await getOrderByToken(admin, draft.public_token);
    expect(order?.status).toBe("draft");
    expect(order?.code).toMatch(/^FE-\d{4}-\d{4,}$/);
    expect(order?.amount_usd).toBe(order?.package.price_usd);
    expect(order?.package.slug).toBe("rescate-pack-10");
  });

  it("no crea pedidos de paquetes inexistentes ni de los que se cotizan", async () => {
    await expectOrderError(createDraft(admin, { packageSlug: "no-existe" }), 404);
    await expectOrderError(createDraft(admin, { packageSlug: "a-la-medida" }), 422, /WhatsApp/);
  });

  it("un token inválido o ajeno no revela nada", async () => {
    expect(await getOrderByToken(admin, "x".repeat(32))).toBeNull();
    expect(await getOrderByToken(admin, "' or 1=1 --")).toBeNull();
    await expectOrderError(issueUploadUrl(admin, "A".repeat(32), { filename: "a.jpg", size: 10 }), 404);
  });

  describe("subidas", () => {
    let token: string;
    let orderId: string;

    beforeAll(async () => {
      token = (await newDraft("rescate-pack-10")).public_token;
      orderId = (await getOrderByToken(admin, token))!.id;
    });

    it("sube y confirma una foto válida", async () => {
      const path = await upload(token, "boda.jpg", JPEG);
      const file = await confirmUpload(admin, token, { path, filename: "boda.jpg" });
      expect(file.mime).toBe("image/jpeg");
      expect(file.size_bytes).toBe(JPEG.length);
      // Confirmar dos veces no duplica.
      const again = await confirmUpload(admin, token, { path, filename: "boda.jpg" });
      expect(again.id).toBe(file.id);
      expect((await getOrderByToken(admin, token))!.files).toHaveLength(1);
    });

    it("rechaza en el servidor un tipo inválido (.exe)", async () => {
      await expectOrderError(issueUploadUrl(admin, token, { filename: "virus.exe", size: 100 }), 422, /Formato/);
    });

    it("rechaza en el servidor un archivo que excede el peso", async () => {
      await expectOrderError(issueUploadUrl(admin, token, { filename: "enorme.jpg", size: 51 * 1024 * 1024 }), 422, /50 MB/);
    });

    it("rechaza video en un paquete solo de fotos", async () => {
      await expectOrderError(issueUploadUrl(admin, token, { filename: "clip.mp4", size: 1000 }), 422, /solo para fotos/);
    });

    it("rechaza un .exe disfrazado de .jpg y borra el objeto", async () => {
      const path = await upload(token, "falsa.jpg", EXE);
      await expectOrderError(confirmUpload(admin, token, { path, filename: "falsa.jpg" }), 422, /no corresponde/);
      const listed = await admin.storage.from(ORIGINALS_BUCKET).list(orderId, { search: path.split("/")[1] });
      expect(listed.data ?? []).toHaveLength(0);
    });

    it("no confirma rutas de otro pedido ni rutas inventadas", async () => {
      const other = (await newDraft("rescate-pack-10")).public_token;
      const path = await upload(other, "ajena.jpg", JPEG);
      await expectOrderError(confirmUpload(admin, token, { path, filename: "ajena.jpg" }), 403);
      await expectOrderError(confirmUpload(admin, token, { path: `${orderId}/../../x.jpg`, filename: "x.jpg" }), 403);
    });

    it("un visitante anónimo no lista ni descarga archivos de ningún pedido", async () => {
      const { data: listing } = await anon.storage.from(ORIGINALS_BUCKET).list(orderId);
      expect(listing ?? []).toHaveLength(0);
      const order = await getOrderByToken(admin, token);
      const { data: row } = await admin.from("order_files").select("storage_path").eq("id", order!.files[0].id).single();
      const download = await anon.storage.from(ORIGINALS_BUCKET).download(row!.storage_path);
      expect(download.data).toBeNull();
      const signed = await anon.storage.from(ORIGINALS_BUCKET).createSignedUrl(row!.storage_path, 60);
      expect(signed.data).toBeNull();
    });

    it("borra un archivo del borrador", async () => {
      const path = await upload(token, "borrar.png", new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d, 0x49, 0x48, 0x44, 0x52]));
      const file = await confirmUpload(admin, token, { path, filename: "borrar.png" });
      await deleteFile(admin, token, file.id);
      expect((await getOrderByToken(admin, token))!.files.map((f) => f.id)).not.toContain(file.id);
    });
  });

  it("rechaza exceso de cantidad (paquete de 1 foto)", async () => {
    const token = (await newDraft("rescate-1-foto")).public_token;
    const path = await upload(token, "una.jpg", JPEG);
    await confirmUpload(admin, token, { path, filename: "una.jpg" });
    await expectOrderError(issueUploadUrl(admin, token, { filename: "dos.jpg", size: 100 }), 422, /hasta 1 archivo/);
  });

  it("no deja cambiar a un paquete con menos cupo del que ya se usó", async () => {
    const token = (await newDraft("rescate-pack-10")).public_token;
    for (const n of [1, 2]) {
      const path = await upload(token, `f${n}.jpg`, JPEG);
      await confirmUpload(admin, token, { path, filename: `f${n}.jpg` });
    }
    await expectOrderError(changePackage(admin, token, "rescate-1-foto"), 409);
    await changePackage(admin, token, "producto-pack-5");
    expect((await getOrderByToken(admin, token))!.package.slug).toBe("producto-pack-5");
  });

  describe("envío", () => {
    it("exige archivos o enlace", async () => {
      const token = (await newDraft("rescate-pack-10")).public_token;
      await expectOrderError(submitOrder(admin, token, validSubmit), 422, /al menos un archivo/);
    });

    it("devuelve errores por campo", async () => {
      const token = (await newDraft("rescate-pack-10")).public_token;
      const error = await submitOrder(admin, token, { ...validSubmit, consent: false }).catch((e) => e);
      expect((error as OrderError).fields?.consent).toBeDefined();
    });

    it("envía con un enlace externo, pasa a awaiting_payment y ya no acepta subidas", async () => {
      const token = (await newDraft("rescate-pack-10")).public_token;
      const order = await submitOrder(admin, token, {
        ...validSubmit,
        brief: { ...validSubmit.brief, externalLink: "https://drive.google.com/drive/folders/prueba" },
      });
      expect(order.status).toBe("awaiting_payment");
      expect(order.customer_whatsapp).toBe("573001234567");
      await expectOrderError(issueUploadUrl(admin, token, { filename: "tarde.jpg", size: 100 }), 409, /ya fue enviado/);
      await expectOrderError(submitOrder(admin, token, validSubmit), 409);
    });
  });

  it("expira borradores viejos y borra sus archivos", async () => {
    const token = (await newDraft("rescate-pack-10")).public_token;
    const path = await upload(token, "vieja.jpg", JPEG);
    await confirmUpload(admin, token, { path, filename: "vieja.jpg" });
    const order = (await getOrderByToken(admin, token))!;
    await admin.from("orders").update({ created_at: new Date(Date.now() - 8 * 86400_000).toISOString() }).eq("id", order.id);

    const result = await expireDrafts(admin, 7);
    expect(result.expired).toBeGreaterThanOrEqual(1);
    expect((await getOrderByToken(admin, token))!.status).toBe("expired");
    const listed = await admin.storage.from(ORIGINALS_BUCKET).list(order.id);
    expect(listed.data ?? []).toHaveLength(0);
  });
});
