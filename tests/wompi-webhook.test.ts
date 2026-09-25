/*
 * Ruta POST /api/wompi/events tal como la llama Wompi. Usa las llaves de
 * Sandbox de .env.local (sin imprimirlas) para firmar eventos de prueba.
 */
import { createHash } from "node:crypto";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

const SECRET = process.env.WOMPI_EVENTS_SECRET;
const FORWARD = "https://otro-sitio.fotoeditores.test/wompi/eventos";

function signedEvent(reference: string, status = "APPROVED", amount = 1_000_000) {
  const tx = { id: `vitest-${Date.now()}`, reference, status, amount_in_cents: amount, currency: "COP" };
  const timestamp = Math.floor(Date.now() / 1000);
  const checksum = createHash("sha256").update(`${tx.id}${tx.status}${tx.amount_in_cents}${timestamp}${SECRET}`).digest("hex");
  return {
    event: "transaction.updated",
    data: { transaction: tx },
    environment: "test",
    signature: { properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"], checksum },
    timestamp,
    sent_at: new Date().toISOString(),
  };
}

const post = (body: string, checksum?: string) =>
  new Request("https://fotoeditores.test/api/wompi/events", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(checksum ? { "X-Event-Checksum": checksum } : {}) },
    body,
  });

describe.skipIf(!SECRET)("POST /api/wompi/events", () => {
  let POST: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    process.env.WOMPI_EVENTS_FORWARD_URL = FORWARD;
    ({ POST } = await import("@/app/api/wompi/events/route"));
  });

  afterEach(() => vi.restoreAllMocks());

  it("rechaza con 401 un evento con firma inválida", async () => {
    const event = signedEvent("FE-2609-9999-1");
    event.data.transaction.amount_in_cents = 1; // alterado después de firmar
    const res = await POST(post(JSON.stringify(event), event.signature.checksum));
    expect(res.status).toBe(401);
  });

  it("rechaza si el encabezado X-Event-Checksum no coincide con el cuerpo", async () => {
    const event = signedEvent("FE-2609-9999-1");
    const res = await POST(post(JSON.stringify(event), "f".repeat(64)));
    expect(res.status).toBe(401);
  });

  it("rechaza JSON inválido", async () => {
    expect((await POST(post("{no es json"))).status).toBe(400);
  });

  it("acepta un evento válido de este sitio con referencia desconocida sin romper nada", async () => {
    const event = signedEvent("FE-0000-0000-1");
    const res = await POST(post(JSON.stringify(event), event.signature.checksum));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ result: "unknown_reference" });
  });

  it("reenvía sin modificar los eventos del otro sitio (misma firma)", async () => {
    const realFetch = globalThis.fetch;
    const calls: { url: string; body: string; checksum: string | null }[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      if (String(input) === FORWARD) {
        calls.push({ url: String(input), body: String(init?.body), checksum: new Headers(init?.headers).get("x-event-checksum") });
        return new Response("ok", { status: 200 });
      }
      return realFetch(input, init);
    });

    const event = signedEvent("ORDEN-OTRO-SITIO-123");
    const raw = JSON.stringify(event);
    const res = await POST(post(raw, event.signature.checksum));
    expect(res.status).toBe(200);
    expect(calls).toEqual([{ url: FORWARD, body: raw, checksum: event.signature.checksum }]);
  });

  it("si el otro sitio no responde, contesta 502 para que Wompi reintente", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("caído", { status: 500 }));
    const event = signedEvent("ORDEN-OTRO-SITIO-456");
    const res = await POST(post(JSON.stringify(event), event.signature.checksum));
    expect(res.status).toBe(502);
  });

  it("no reenvía eventos con firma inválida", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    const event = signedEvent("ORDEN-OTRO-SITIO-789");
    event.data.transaction.status = "DECLINED";
    const res = await POST(post(JSON.stringify(event), event.signature.checksum));
    expect(res.status).toBe(401);
    expect(spy.mock.calls.some(([u]) => String(u) === FORWARD)).toBe(false);
  });
});
