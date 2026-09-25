/*
 * Pagos (Fase 4) contra el Supabase de .env.local, sin llamar a Wompi: la tasa
 * del dólar es fija y las transacciones se simulan con la forma exacta que
 * envía Wompi. Pedidos marcados utm_source=vitest y borrados al final.
 *
 * Criterios del plan: aprobado → paid; rechazado → reintento con nueva
 * referencia; evento duplicado no duplica; monto distinto no altera nada; el
 * monto no depende del navegador.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDraft, getOrderByToken, OrderError, submitOrder } from "@/lib/orders/service";
import { applyTransaction, startCheckout, type CheckoutConfig } from "@/lib/payments/service";
import { integritySignature, type WompiTransaction } from "@/lib/payments/wompi";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = Boolean(url && serviceKey);

const RATE = 4000;
const config: CheckoutConfig = {
  publicKey: "pub_test_vitest",
  integritySecret: "test_integrity_vitest",
  siteUrl: "https://fotoeditores.test",
  getRate: async () => ({ rate: RATE, source: "trm", date: "2026-09-25" }),
};

const submitBody = {
  brief: { goals: ["nitidez"], usage: "album", externalLink: "https://drive.google.com/drive/folders/vitest" },
  customer: { name: "Prueba Pagos", email: "pruebas@fotoeditores.com", whatsapp: "3001234567" },
  consent: true,
};

describe.skipIf(!configured)("Pagos con Wompi (Fase 4) contra Supabase", () => {
  let sb: SupabaseClient;
  const tokens: string[] = [];

  async function submittedOrder(slug = "rescate-pack-10") {
    const { public_token } = await createDraft(sb, { packageSlug: slug, utm: { utm_source: "vitest" } });
    tokens.push(public_token);
    await submitOrder(sb, public_token, submitBody);
    return public_token;
  }

  const tx = (reference: string, status: WompiTransaction["status"], amount: number, id = `vitest-${Math.random()}`): WompiTransaction => ({
    id,
    reference,
    status,
    amount_in_cents: amount,
    currency: "COP",
    payment_method_type: "CARD",
  });

  async function events(token: string) {
    const order = await getOrderByToken(sb, token);
    const { data } = await sb.from("order_events").select("type").eq("order_id", order!.id).order("id");
    return (data ?? []).map((e) => e.type);
  }

  beforeAll(() => {
    sb = createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } });
  });

  afterAll(async () => {
    for (const token of tokens) {
      const order = await getOrderByToken(sb, token);
      if (!order) continue;
      await sb.from("payments").delete().eq("order_id", order.id);
      await sb.from("orders").delete().eq("id", order.id);
    }
  });

  it("calcula el cobro desde la base y la tasa, y firma la URL", async () => {
    const token = await submittedOrder(); // USD 59
    const checkout = await startCheckout(sb, token, config);
    const order = await getOrderByToken(sb, token);

    expect(checkout.reference).toBe(`${order!.code}-1`);
    expect(checkout.amountCop).toBe(59 * RATE);
    const params = new URL(checkout.url).searchParams;
    expect(params.get("amount-in-cents")).toBe(String(59 * RATE * 100));
    expect(params.get("redirect-url")).toBe(`https://fotoeditores.test/pedido/${token}/gracias`);
    expect(params.get("signature:integrity")).toBe(
      integritySignature({ reference: checkout.reference, amountInCents: 59 * RATE * 100, currency: "COP", integritySecret: config.integritySecret }),
    );

    const { data: payment } = await sb.from("payments").select("*").eq("wompi_reference", checkout.reference).single();
    expect(payment).toMatchObject({ status: "PENDING", amount_cents: 59 * RATE * 100, fx_source: "trm", attempt: 1 });
    expect(Number(payment.fx_rate)).toBe(RATE);
    expect(Number(payment.amount_usd)).toBe(59);
  });

  it("no inicia pagos de borradores ni si no hay tasa del dólar", async () => {
    const { public_token } = await createDraft(sb, { packageSlug: "rescate-1-foto", utm: { utm_source: "vitest" } });
    tokens.push(public_token);
    await expect(startCheckout(sb, public_token, config)).rejects.toMatchObject({ status: 409 });

    const token = await submittedOrder();
    const error = await startCheckout(sb, token, { ...config, getRate: async () => null }).catch((e) => e);
    expect(error).toBeInstanceOf(OrderError);
    expect(error.status).toBe(503);
  });

  it("aprobado → pedido pagado, y el mismo evento dos veces no duplica nada", async () => {
    const token = await submittedOrder();
    const { reference } = await startCheckout(sb, token, config);
    const approved = tx(reference, "APPROVED", 59 * RATE * 100, "vitest-aprobada");

    expect((await applyTransaction(sb, approved, { source: "webhook" })).result).toBe("applied");
    const order = await getOrderByToken(sb, token);
    expect(order!.status).toBe("paid");

    // Reenvío del mismo evento (Wompi reintenta) y llegada por /gracias: sin efectos.
    expect((await applyTransaction(sb, approved, { source: "webhook" })).result).toBe("duplicate");
    expect((await applyTransaction(sb, approved, { source: "redirect", expectedOrderId: order!.id })).result).toBe("duplicate");
    expect((await events(token)).filter((t) => t === "paid")).toHaveLength(1);

    const { data: payment } = await sb.from("payments").select("status, wompi_transaction_id, payment_method").eq("wompi_reference", reference).single();
    expect(payment).toEqual({ status: "APPROVED", wompi_transaction_id: "vitest-aprobada", payment_method: "CARD" });
    await expect(startCheckout(sb, token, config)).rejects.toMatchObject({ status: 409 });
  });

  it("monto distinto al registrado: no cambia nada y queda en la bitácora", async () => {
    const token = await submittedOrder();
    const { reference } = await startCheckout(sb, token, config);
    const tampered = tx(reference, "APPROVED", 100); // alguien pagó 1 peso

    expect((await applyTransaction(sb, tampered, { source: "webhook" })).result).toBe("mismatch");
    expect((await getOrderByToken(sb, token))!.status).toBe("awaiting_payment");
    const { data: payment } = await sb.from("payments").select("status").eq("wompi_reference", reference).single();
    expect(payment!.status).toBe("PENDING");
    expect(await events(token)).toContain("payment_mismatch");

    const otraMoneda = { ...tx(reference, "APPROVED", 59 * RATE * 100), currency: "USD" };
    expect((await applyTransaction(sb, otraMoneda, { source: "webhook" })).result).toBe("mismatch");
  });

  it("rechazado → payment_failed y reintento con nueva referencia que sí se aprueba", async () => {
    const token = await submittedOrder();
    const first = await startCheckout(sb, token, config);
    await applyTransaction(sb, tx(first.reference, "DECLINED", 59 * RATE * 100), { source: "webhook" });
    expect((await getOrderByToken(sb, token))!.status).toBe("payment_failed");

    const second = await startCheckout(sb, token, config);
    expect(second.reference).not.toBe(first.reference);
    expect(second.reference.endsWith("-2")).toBe(true);

    await applyTransaction(sb, tx(second.reference, "APPROVED", 59 * RATE * 100), { source: "webhook" });
    expect((await getOrderByToken(sb, token))!.status).toBe("paid");
  });

  it("un segundo pago aprobado del mismo pedido se registra como cobro doble", async () => {
    const token = await submittedOrder();
    const a = await startCheckout(sb, token, config);
    const b = await startCheckout(sb, token, config); // dos pestañas abiertas
    await applyTransaction(sb, tx(a.reference, "APPROVED", 59 * RATE * 100), { source: "webhook" });
    await applyTransaction(sb, tx(b.reference, "APPROVED", 59 * RATE * 100), { source: "webhook" });
    expect((await getOrderByToken(sb, token))!.status).toBe("paid");
    expect(await events(token)).toContain("duplicate_payment");
  });

  it("ignora referencias desconocidas y transacciones de otro pedido en /gracias", async () => {
    expect((await applyTransaction(sb, tx("FE-0000-0000-1", "APPROVED", 1), { source: "webhook" })).result).toBe("unknown_reference");

    const token = await submittedOrder();
    const other = await submittedOrder();
    const { reference } = await startCheckout(sb, token, config);
    const otherOrder = await getOrderByToken(sb, other);
    const result = await applyTransaction(sb, tx(reference, "APPROVED", 59 * RATE * 100), {
      source: "redirect",
      expectedOrderId: otherOrder!.id,
    });
    expect(result.result).toBe("unknown_reference");
    expect((await getOrderByToken(sb, token))!.status).toBe("awaiting_payment");
  });

  it("un estado PENDING solo guarda el id de la transacción", async () => {
    const token = await submittedOrder();
    const { reference } = await startCheckout(sb, token, config);
    expect((await applyTransaction(sb, tx(reference, "PENDING", 59 * RATE * 100, "vitest-pse"), { source: "redirect" })).result).toBe("pending");
    const { data } = await sb.from("payments").select("status, wompi_transaction_id").eq("wompi_reference", reference).single();
    expect(data).toEqual({ status: "PENDING", wompi_transaction_id: "vitest-pse" });
  });
});
