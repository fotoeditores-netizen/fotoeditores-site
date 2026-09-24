import "server-only";
import { Resend } from "resend";
import { getServerEnv } from "@/lib/env/server";
import { GOALS, USAGES } from "@/lib/orders/brief";
import type { OrderView } from "@/lib/orders/service";
import { escapeHtml as e } from "@/lib/email/escape";
import { formatUsd } from "@/lib/whatsapp";

const TEAM_EMAIL = "editorgeneral@fotoeditores.com";
const DEFAULT_FROM = "Fotoeditores <contacto@fotoeditores.com>";

const labelOf = (list: readonly { id: string; label: string }[], id: string) => list.find((x) => x.id === id)?.label ?? id;

/*
 * Aviso al equipo cuando un cliente envía su pedido. Mientras no exista el pago
 * con Wompi (Fase 4), el editor coordina el pago por WhatsApp. En la Fase 6 lo
 * reemplazan las plantillas de emails/ y los flujos de n8n.
 * Si falla, el pedido igual queda guardado: el error solo se registra.
 */
export async function notifyTeamNewOrder(order: OrderView): Promise<void> {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY no configurada: no se envió el aviso del pedido", order.code);
    return;
  }

  const brief = order.brief as { goals?: string[]; usage?: string; references?: string; notes?: string; externalLink?: string };
  const goals = (brief.goals ?? []).map((g) => labelOf([...GOALS.producto, ...GOALS.recuerdos], g));
  const wa = order.customer_whatsapp ?? "";
  const waText = encodeURIComponent(`Hola ${order.customer_name ?? ""}, soy tu editor de Fotoeditores. Tu pedido es ${order.code}.`);
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;color:#0066FF;font-weight:700;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#1a1a2e">${value}</td></tr>` : "";

  const html = `<!DOCTYPE html><html lang="es"><body style="font-family:Arial,sans-serif;background:#f5f7fa;padding:20px">
<div style="max-width:620px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0A1628,#0066FF);padding:24px 28px;color:#fff">
    <div style="font-size:13px;opacity:.7">Nuevo pedido · pendiente de pago</div>
    <div style="font-size:24px;font-weight:800">${e(order.code)} — ${e(order.package.name)} (${e(formatUsd(order.amount_usd))})</div>
  </div>
  <div style="padding:24px 28px">
    <table style="border-collapse:collapse;font-size:14px;width:100%">
      ${row("Cliente", e(order.customer_name))}
      ${row("Correo", `<a href="mailto:${e(order.customer_email)}">${e(order.customer_email)}</a>`)}
      ${row("WhatsApp", wa ? `<a href="https://wa.me/${e(wa)}?text=${waText}">+${e(wa)} · escribirle</a>` : "")}
      ${row("Quiere", e(goals.join(", ")))}
      ${row("Para", e(brief.usage ? labelOf(USAGES, brief.usage) : ""))}
      ${row("Referencias", e(brief.references))}
      ${row("Notas", e(brief.notes).replace(/\n/g, "<br>"))}
      ${row("Archivos", `${order.files.length} subido${order.files.length === 1 ? "" : "s"}${order.files.length ? ": " + order.files.map((f) => e(f.filename)).join(", ") : ""}`)}
      ${row("Enlace externo", brief.externalLink ? `<a href="${e(brief.externalLink)}">${e(brief.externalLink)}</a>` : "")}
    </table>
    <p style="font-size:13px;color:#666;margin-top:20px">Los archivos están en Supabase → Storage → originals → carpeta del pedido. El pago todavía se coordina por WhatsApp (Wompi llega en la Fase 4).</p>
  </div>
</div></body></html>`;

  try {
    const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
      from: env.EMAIL_FROM ?? DEFAULT_FROM,
      to: TEAM_EMAIL,
      replyTo: order.customer_email ?? undefined,
      subject: `[Pedido] ${order.code} · ${order.package.name} · ${order.customer_name ?? ""}`,
      html,
    });
    if (error) console.error("Resend (aviso de pedido):", error);
  } catch (error) {
    console.error("Resend (aviso de pedido):", error);
  }
}
