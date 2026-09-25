import { after, NextResponse } from "next/server";
import { notifyTeamPaid } from "@/lib/email/order-notification";
import { getWompiConfig } from "@/lib/payments/config";
import { applyTransaction } from "@/lib/payments/service";
import { verifyEvent, type WompiEvent } from "@/lib/payments/wompi";
import { getAdminSupabase } from "@/lib/supabase/admin";

/*
 * POST /api/wompi/events — webhook de Wompi (fuente de verdad de los pagos).
 *
 * 1. Lee el cuerpo sin modificar y valida el checksum con el secreto de eventos.
 *    Firma inválida → 401 y no se toca nada.
 * 2. Referencias "FE-…" son de este sitio: se aplican de forma idempotente.
 * 3. El comercio de Wompi es compartido con otro sitio de Fotoeditores: los
 *    demás eventos se reenvían tal cual (mismo cuerpo y X-Event-Checksum) a
 *    WOMPI_EVENTS_FORWARD_URL. Si el reenvío falla se responde 502 para que
 *    Wompi reintente.
 * Wompi reintenta hasta 3 veces en 24 h si no recibe 200.
 */
export async function POST(request: Request) {
  const wompi = getWompiConfig();
  if (!wompi) return NextResponse.json({ error: "Wompi no configurado" }, { status: 503 });

  const raw = await request.text();
  if (raw.length > 100_000) return NextResponse.json({ error: "Evento demasiado grande" }, { status: 413 });

  let event: WompiEvent;
  try {
    event = JSON.parse(raw) as WompiEvent;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const headerChecksum = request.headers.get("x-event-checksum");
  if (!verifyEvent(event, wompi.eventsSecret, headerChecksum)) {
    console.warn("Evento de Wompi con firma inválida:", event?.data?.transaction?.reference ?? "(sin referencia)");
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  const tx = event.data?.transaction;
  if (event.event !== "transaction.updated" || !tx?.reference) {
    return NextResponse.json({ ok: true, ignored: event.event });
  }

  // Evento de otro sitio del mismo comercio: reenviar sin tocar.
  if (!tx.reference.startsWith("FE-")) {
    if (!wompi.forwardUrl) {
      console.warn("Evento de Wompi ajeno y sin WOMPI_EVENTS_FORWARD_URL:", tx.reference);
      return NextResponse.json({ ok: true, ignored: "referencia ajena" });
    }
    try {
      const res = await fetch(wompi.forwardUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(headerChecksum ? { "X-Event-Checksum": headerChecksum } : {}) },
        body: raw,
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return NextResponse.json({ ok: true, forwarded: true });
    } catch (error) {
      console.error("Reenvío de evento de Wompi falló:", tx.reference, error);
      return NextResponse.json({ error: "Reenvío falló" }, { status: 502 });
    }
  }

  try {
    const sb = getAdminSupabase();
    const { result, orderId } = await applyTransaction(sb, tx, { source: "webhook", raw: event });
    if (result === "unknown_reference") console.warn("Evento de Wompi con referencia FE- desconocida:", tx.reference);
    if (result === "mismatch") console.error("⚠️ Monto o moneda no coinciden en", tx.reference);
    if (result === "applied" && tx.status === "APPROVED" && orderId) after(() => notifyTeamPaid(sb, orderId));
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    // 500 → Wompi reintenta; el manejo es idempotente.
    console.error("Error aplicando evento de Wompi:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
