/*
 * Fase 5 contra el Supabase de .env.local: roles del panel, transiciones,
 * entregas, descargas y ajustes del cliente. Crea un usuario de Auth de prueba
 * y pedidos marcados utm_source=vitest; todo se borra al final.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { staffForUser, type Staff } from "@/lib/admin/auth";
import {
  addNote,
  allowedTransitions,
  changeStatus,
  confirmDelivery,
  deliver,
  getOrderDetail,
  issueDeliveryUpload,
  listOrders,
  signedDownloadUrl,
} from "@/lib/admin/service";
import { customerDeliveryUrl, requestRevision } from "@/lib/orders/customer";
import { createDraft, getOrderByToken, OrderError, submitOrder } from "@/lib/orders/service";
import { proxy } from "@/proxy";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = Boolean(url && anonKey && serviceKey);

const submitBody = {
  brief: { goals: ["nitidez"], usage: "album", externalLink: "https://drive.google.com/drive/folders/vitest" },
  customer: { name: "Prueba Panel", email: "pruebas@fotoeditores.com", whatsapp: "3001234567" },
  consent: true,
};
const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1]);

describe.skipIf(!configured)("Panel del editor y seguimiento (Fase 5)", () => {
  let sb: SupabaseClient;
  let anon: SupabaseClient;
  let userId: string;
  let editor: Staff;
  const tokens: string[] = [];

  async function paidOrder(slug = "rescate-pack-10") {
    const { public_token } = await createDraft(sb, { packageSlug: slug, utm: { utm_source: "vitest" } });
    tokens.push(public_token);
    await submitOrder(sb, public_token, submitBody);
    const order = (await getOrderByToken(sb, public_token))!;
    await changeStatus(sb, order.id, "paid", editor); // pago coordinado por WhatsApp
    return { token: public_token, id: order.id };
  }

  async function uploadDelivery(orderId: string, filename = "final.jpg") {
    const signed = await issueDeliveryUpload(sb, orderId, { filename, size: JPEG.length });
    const { error } = await anon.storage
      .from(signed.bucket)
      .uploadToSignedUrl(signed.path, signed.token, new Blob([JPEG], { type: signed.mime }), { contentType: signed.mime });
    if (error) throw new Error(error.message);
    return confirmDelivery(sb, orderId, editor, { path: signed.path, filename });
  }

  beforeAll(async () => {
    sb = createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } });
    anon = createClient(url!, anonKey!, { auth: { persistSession: false } });
    const { data, error } = await sb.auth.admin.createUser({
      email: `vitest-${Date.now()}@fotoeditores.test`,
      password: `Vitest-${crypto.randomUUID()}`,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  });

  afterAll(async () => {
    for (const token of tokens) {
      const order = await getOrderByToken(sb, token);
      if (!order) continue;
      for (const bucket of ["originals", "deliveries"]) {
        const listed = await sb.storage.from(bucket).list(order.id);
        const paths = (listed.data ?? []).map((f) => `${order.id}/${f.name}`);
        if (paths.length) await sb.storage.from(bucket).remove(paths);
      }
      await sb.from("payments").delete().eq("order_id", order.id);
      await sb.from("orders").delete().eq("id", order.id);
    }
    if (userId) await sb.auth.admin.deleteUser(userId); // borra también su profile (cascade)
  });

  describe("acceso al panel", () => {
    it("un usuario autenticado SIN rol no tiene acceso", async () => {
      expect(await staffForUser(sb, { id: userId, email: "x@y.z" })).toBeNull();
      expect(await staffForUser(sb, null)).toBeNull();
    });

    it("con rol editor sí tiene acceso", async () => {
      await sb.from("profiles").insert({ id: userId, role: "editor", name: "Editor Vitest" });
      editor = (await staffForUser(sb, { id: userId, email: "editor@vitest" }))!;
      expect(editor).toMatchObject({ id: userId, role: "editor", name: "Editor Vitest" });
    });

    it("sin sesión, /api/admin responde 401 y /admin redirige al login", async () => {
      const api = await proxy(new NextRequest("https://fotoeditores.test/api/admin/orders/x/status", { method: "POST" }));
      expect(api.status).toBe(401);
      const page = await proxy(new NextRequest("https://fotoeditores.test/admin/pedidos/abc"));
      expect(page.status).toBe(307);
      expect(page.headers.get("location")).toContain("/admin/login?next=%2Fadmin%2Fpedidos%2Fabc");
      const login = await proxy(new NextRequest("https://fotoeditores.test/admin/login"));
      expect(login.status).toBe(200);
    });

    it("con una cookie de sesión falsa tampoco entra", async () => {
      const req = new NextRequest("https://fotoeditores.test/api/admin/orders/x/deliver", { method: "POST" });
      req.cookies.set("sb-lapgnaxyxlwecruehdjp-auth-token", "base64-eyJmYWxzbyI6dHJ1ZX0");
      expect((await proxy(req)).status).toBe(401);
    });
  });

  describe("estados", () => {
    it("un editor marca pagado a mano, pero no puede cancelar ni saltarse pasos", async () => {
      const { id } = await paidOrder();
      const detail = await getOrderDetail(sb, id);
      expect(detail!.status).toBe("paid");
      expect(detail!.events.find((e) => e.type === "paid")).toMatchObject({ actor: "editor", actor_name: "Editor Vitest" });
      expect(allowedTransitions("paid", "editor")).toEqual(["in_progress"]);
      await expect(changeStatus(sb, id, "cancelled", editor)).rejects.toMatchObject({ status: 409 });
      await expect(changeStatus(sb, id, "delivered", editor)).rejects.toMatchObject({ status: 409 });
      await expect(changeStatus(sb, id, "closed", editor)).rejects.toMatchObject({ status: 409 });
    });

    it("no entrega sin archivos finales", async () => {
      const { id } = await paidOrder();
      await expect(deliver(sb, id, editor)).rejects.toMatchObject({ status: 422 });
    });

    it("guarda notas internas con el nombre del editor", async () => {
      const { id } = await paidOrder();
      await addNote(sb, id, editor, "Revisar el tono de piel");
      const detail = await getOrderDetail(sb, id);
      expect(detail!.events.at(-1)).toMatchObject({ type: "note", actor_name: "Editor Vitest", payload: { text: "Revisar el tono de piel" } });
    });

    it("la bandeja muestra el pedido con su fecha límite", async () => {
      const { id } = await paidOrder();
      const inbox = await listOrders(sb, { status: "activos" });
      const row = inbox.find((o) => o.id === id);
      expect(row?.due_at).toBeTruthy();
      expect(row?.due_state).toBe("ok");
    });
  });

  describe("entrega → descarga del cliente → ajustes", () => {
    let order: { token: string; id: string };
    let fileId: string;

    beforeAll(async () => {
      order = await paidOrder(); // rescate-pack-10: 1 ajuste incluido
      await changeStatus(sb, order.id, "in_progress", editor);
      fileId = (await uploadDelivery(order.id)).id;
      await deliver(sb, order.id, editor);
    });

    it("queda entregado y el cliente descarga su archivo final", async () => {
      const view = (await getOrderByToken(sb, order.token))!;
      expect(view.status).toBe("delivered");
      expect(view.deliveries.map((f) => f.id)).toEqual([fileId]);
      const signed = await customerDeliveryUrl(sb, order.token, fileId);
      const res = await fetch(signed);
      expect(res.status).toBe(200);
      expect(new Uint8Array(await res.arrayBuffer())).toEqual(JPEG);
    });

    it("un token equivocado o un archivo de otro pedido no revelan nada", async () => {
      await expect(customerDeliveryUrl(sb, "A".repeat(32), fileId)).rejects.toMatchObject({ status: 404 });
      const other = await paidOrder();
      await expect(customerDeliveryUrl(sb, other.token, fileId)).rejects.toMatchObject({ status: 404 });
      await expect(signedDownloadUrl(sb, other.id, fileId)).rejects.toMatchObject({ status: 404 });
    });

    it("pide un ajuste y no puede pedir más de los incluidos", async () => {
      await expect(requestRevision(sb, order.token, "ok")).rejects.toMatchObject({ status: 422 }); // comentario muy corto
      expect(await requestRevision(sb, order.token, "Más brillo en el rostro, por favor")).toEqual({ remaining: 0 });
      expect((await getOrderByToken(sb, order.token))!.status).toBe("revision_requested");

      // El editor lo corrige y lo vuelve a entregar.
      await changeStatus(sb, order.id, "in_progress", editor);
      await deliver(sb, order.id, editor);

      const error = await requestRevision(sb, order.token, "Otro cambio más").catch((e) => e);
      expect(error).toBeInstanceOf(OrderError);
      expect(error.status).toBe(409);
      expect(error.message).toMatch(/ajustes incluidos/);
      expect((await getOrderByToken(sb, order.token))!.revisions_used).toBe(1);
    });

    it("no permite ajustes fuera del plazo", async () => {
      const late = await paidOrder();
      await uploadDelivery(late.id);
      await deliver(sb, late.id, editor);
      await sb.from("orders").update({ delivered_at: new Date(Date.now() - 4 * 86_400_000).toISOString() }).eq("id", late.id);
      await expect(requestRevision(sb, late.token, "Un cambio tardío")).rejects.toMatchObject({ status: 409 });
    });

    it("no permite pedir ajustes antes de la entrega", async () => {
      const pending = await paidOrder();
      await expect(requestRevision(sb, pending.token, "Todavía no me entregan")).rejects.toMatchObject({ status: 409 });
    });
  });
});
