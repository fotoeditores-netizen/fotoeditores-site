import type { SupabaseClient } from "@supabase/supabase-js";
import { OrderError, getOrderByToken } from "@/lib/orders/service";
import { usdToCopCents, type FxQuote } from "@/lib/payments/fx";
import { FINAL_STATUSES, checkoutUrl, integritySignature, type WompiStatus, type WompiTransaction } from "@/lib/payments/wompi";

/*
 * Pagos con Wompi (Fase 4). Reglas de oro del plan (§5.3):
 *   1. El pedido se marca pagado SOLO con el evento validado o consultando la
 *      transacción a Wompi; nunca por lo que diga la URL de retorno.
 *   2. Monto y moneda del evento deben coincidir con el intento registrado.
 *   3. Todo es idempotente: el mismo evento dos veces no duplica nada.
 * El monto sale de orders.amount_usd (copiado de packages al crear el pedido)
 * y de la tasa del día; el navegador no envía montos.
 */

export type CheckoutConfig = {
  publicKey: string;
  integritySecret: string;
  siteUrl: string;
  marginPercent?: number;
  getRate: () => Promise<FxQuote | null>;
};

const PAYABLE = ["awaiting_payment", "payment_failed"];

async function logEvent(
  sb: SupabaseClient,
  orderId: string,
  type: string,
  payload: Record<string, unknown>,
  actor: "system" | "customer" = "system",
) {
  const { error } = await sb.from("order_events").insert({ order_id: orderId, type, actor, payload });
  if (error) console.error("order_events:", error.message);
}

// ── Iniciar el pago ───────────────────────────────────────────────────────────

export async function startCheckout(
  sb: SupabaseClient,
  token: string,
  config: CheckoutConfig,
): Promise<{ url: string; reference: string; amountCop: number; rate: number }> {
  const order = await getOrderByToken(sb, token);
  if (!order) throw new OrderError("No encontramos ese pedido.", 404);
  if (order.status === "draft") throw new OrderError("Primero termina y envía tu pedido.", 409);
  if (!PAYABLE.includes(order.status)) throw new OrderError("Este pedido ya está pagado o no admite pagos.", 409);

  const quote = await config.getRate();
  if (!quote) {
    throw new OrderError(
      "No pudimos consultar la tasa del dólar en este momento. Intenta en unos minutos o escríbenos por WhatsApp.",
      503,
    );
  }
  const amountCents = usdToCopCents(order.amount_usd, quote.rate, config.marginPercent ?? 0);

  // Cada intento tiene su propia referencia: Wompi no permite reutilizarlas.
  for (let tries = 0; tries < 3; tries++) {
    const { data: last } = await sb
      .from("payments")
      .select("attempt")
      .eq("order_id", order.id)
      .order("attempt", { ascending: false })
      .limit(1)
      .maybeSingle();
    const attempt = (last?.attempt ?? 0) + 1;
    const reference = `${order.code}-${attempt}`;

    const { error } = await sb.from("payments").insert({
      order_id: order.id,
      attempt,
      wompi_reference: reference,
      status: "PENDING",
      amount_usd: order.amount_usd,
      fx_rate: quote.rate,
      fx_source: quote.source,
      fx_date: quote.date,
      amount_cents: amountCents,
      currency: "COP",
    });
    if (error?.code === "23505") continue; // otro intento simultáneo tomó ese número
    if (error) throw new Error(`payments.insert: ${error.message}`);

    await logEvent(sb, order.id, "checkout_started", { reference, amount_cents: amountCents, fx_rate: quote.rate, fx_source: quote.source }, "customer");
    const url = checkoutUrl({
      publicKey: config.publicKey,
      reference,
      amountInCents: amountCents,
      signature: integritySignature({ reference, amountInCents: amountCents, currency: "COP", integritySecret: config.integritySecret }),
      redirectUrl: `${config.siteUrl}/pedido/${token}/gracias`,
      customer: { email: order.customer_email, fullName: order.customer_name, phone: order.customer_whatsapp },
    });
    return { url, reference, amountCop: amountCents / 100, rate: quote.rate };
  }
  throw new OrderError("No pudimos iniciar el pago. Intenta de nuevo.", 409);
}

// ── Aplicar el resultado de una transacción ──────────────────────────────────

export type ApplyResult =
  | "applied"
  | "pending"
  | "duplicate"
  | "unknown_reference"
  | "mismatch"
  | "ignored";

export async function applyTransaction(
  sb: SupabaseClient,
  tx: WompiTransaction,
  meta: { source: "webhook" | "redirect"; raw?: unknown; expectedOrderId?: string },
): Promise<{ result: ApplyResult; orderId?: string }> {
  const { data: payment, error } = await sb
    .from("payments")
    .select("id, order_id, status, amount_cents, currency, wompi_transaction_id")
    .eq("wompi_reference", tx.reference)
    .maybeSingle();
  if (error) throw new Error(`payments.select: ${error.message}`);
  if (!payment) return { result: "unknown_reference" };
  // Desde /gracias: la transacción debe ser de ESTE pedido.
  if (meta.expectedOrderId && payment.order_id !== meta.expectedOrderId) return { result: "unknown_reference" };

  const orderId = payment.order_id as string;
  if (tx.currency !== "COP" || Number(tx.amount_in_cents) !== Number(payment.amount_cents)) {
    await logEvent(sb, orderId, "payment_mismatch", {
      reference: tx.reference,
      expected_cents: payment.amount_cents,
      received_cents: tx.amount_in_cents,
      currency: tx.currency,
      source: meta.source,
    });
    return { result: "mismatch", orderId };
  }

  const newStatus = tx.status as WompiStatus;
  if (!(FINAL_STATUSES as readonly string[]).includes(newStatus)) {
    if (!payment.wompi_transaction_id) {
      await sb.from("payments").update({ wompi_transaction_id: tx.id }).eq("id", payment.id).is("wompi_transaction_id", null);
    }
    return { result: "pending", orderId };
  }
  if (payment.status === newStatus) return { result: "duplicate", orderId };

  // Transiciones válidas: PENDING → final; APPROVED → VOIDED (anulación).
  const allowed = payment.status === "PENDING" || (payment.status === "APPROVED" && newStatus === "VOIDED");
  if (!allowed) return { result: "ignored", orderId };

  // Condicionado al estado anterior: si dos eventos llegan a la vez, solo uno aplica.
  const { data: updated, error: updError } = await sb
    .from("payments")
    .update({
      status: newStatus,
      wompi_transaction_id: tx.id,
      payment_method: tx.payment_method_type ?? null,
      raw_event: meta.raw ?? tx,
    })
    .eq("id", payment.id)
    .eq("status", payment.status)
    .select("id");
  if (updError) throw new Error(`payments.update: ${updError.message}`);
  if (!updated?.length) return { result: "duplicate", orderId };

  const eventPayload = { reference: tx.reference, transaction: tx.id, method: tx.payment_method_type, source: meta.source };

  if (newStatus === "APPROVED") {
    const { data: paid } = await sb
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", orderId)
      .in("status", PAYABLE)
      .select("id");
    // Si el pedido ya estaba pagado por otro intento, hay un cobro doble: se registra para reembolsarlo.
    await logEvent(sb, orderId, paid?.length ? "paid" : "duplicate_payment", eventPayload);
  } else if (newStatus === "DECLINED" || newStatus === "ERROR") {
    await sb.from("orders").update({ status: "payment_failed" }).eq("id", orderId).eq("status", "awaiting_payment");
    await logEvent(sb, orderId, "payment_failed", { ...eventPayload, status: newStatus });
  } else {
    // VOIDED: anulación de un pago; queda en la bitácora para revisión manual.
    await logEvent(sb, orderId, "payment_voided", eventPayload);
  }
  return { result: "applied", orderId };
}

// Consulta directa a Wompi (respaldo del webhook desde la página /gracias).
export async function fetchWompiTransaction(apiBase: string, id: string, fetchImpl: typeof fetch = fetch): Promise<WompiTransaction | null> {
  if (!/^[\w-]{5,80}$/.test(id)) return null;
  try {
    const res = await fetchImpl(`${apiBase}/transactions/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: WompiTransaction };
    return body.data ?? null;
  } catch {
    return null;
  }
}
