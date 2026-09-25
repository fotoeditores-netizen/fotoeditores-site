import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
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
 * Aviso al equipo cuando un cliente envía su pedido (queda pendiente de pago:
 * el cliente paga en línea con Wompi o, si no lo hace, se le escribe por
 * WhatsApp). En la Fase 6 lo reemplazan las plantillas de emails/ y n8n.
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
    <p style="font-size:13px;color:#666;margin-top:20px">Los archivos están en Supabase → Storage → originals → carpeta del pedido. Recibirás otro correo cuando el pago en línea se apruebe. Si no llega, escríbele por WhatsApp para ayudarle a pagar.</p>
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

type PaidOrderRow = {
  code: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_whatsapp: string | null;
  amount_usd: number;
  package: { name: string } | null;
  payments: { status: string; amount_cents: number; payment_method: string | null; wompi_reference: string }[];
};

// Aviso al equipo cuando Wompi aprueba el pago (se llama desde el webhook).
export async function notifyTeamPaid(sb: SupabaseClient, orderId: string): Promise<void> {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY) return;
  const { data } = await sb
    .from("orders")
    .select(
      "code, customer_name, customer_email, customer_whatsapp, amount_usd, package:packages(name), payments(status, amount_cents, payment_method, wompi_reference)",
    )
    .eq("id", orderId)
    .maybeSingle();
  const order = data as unknown as PaidOrderRow | null;
  if (!order) return;
  const payment = order.payments.find((p) => p.status === "APPROVED");
  const cop = payment ? `COP ${(payment.amount_cents / 100).toLocaleString("es-CO")}` : "";

  const html = `<!DOCTYPE html><html lang="es"><body style="font-family:Arial,sans-serif;background:#f5f7fa;padding:20px">
<div style="max-width:620px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0A1628,#0066FF);padding:24px 28px;color:#fff">
    <div style="font-size:13px;opacity:.7">Pago aprobado · listo para editar</div>
    <div style="font-size:24px;font-weight:800">${e(order.code)} — ${e(order.package?.name)} (${e(formatUsd(order.amount_usd))})</div>
  </div>
  <div style="padding:24px 28px;font-size:14px;color:#1a1a2e;line-height:1.6">
    <p><strong>${e(order.customer_name)}</strong> pagó ${e(cop)} con ${e(payment?.payment_method ?? "Wompi")} (referencia ${e(payment?.wompi_reference)}).</p>
    <p>Correo: ${e(order.customer_email)} · WhatsApp: +${e(order.customer_whatsapp)}</p>
    <p>El pedido quedó en estado <strong>pagado</strong>: ya puedes empezar a editar.</p>
  </div>
</div></body></html>`;

  try {
    const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
      from: env.EMAIL_FROM ?? DEFAULT_FROM,
      to: TEAM_EMAIL,
      subject: `[Pagado] ${order.code} · ${order.package?.name ?? ""} · ${order.customer_name ?? ""}`,
      html,
    });
    if (error) console.error("Resend (pago aprobado):", error);
  } catch (error) {
    console.error("Resend (pago aprobado):", error);
  }
}

// Aviso al CLIENTE cuando el editor entrega su pedido (Fase 5).
export async function notifyCustomerDelivered(
  sb: SupabaseClient,
  orderId: string,
  siteUrl: string,
): Promise<void> {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY) return;
  const { data } = await sb
    .from("orders")
    .select("code, public_token, customer_name, customer_email, package:packages(name, revisions_included)")
    .eq("id", orderId)
    .maybeSingle();
  const order = data as unknown as {
    code: string;
    public_token: string;
    customer_name: string | null;
    customer_email: string | null;
    package: { name: string; revisions_included: number } | null;
  } | null;
  if (!order?.customer_email) return;

  const link = `${siteUrl}/pedido/${order.public_token}`;
  const firstName = (order.customer_name ?? "").split(" ")[0];
  const html = `<!DOCTYPE html><html lang="es"><body style="font-family:Arial,sans-serif;background:#f0f4f8;padding:20px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#0A1628,#0066FF);padding:32px 28px;text-align:center;color:#fff">
    <div style="font-size:26px;font-weight:800">Foto<span style="color:#00D4FF">editores</span></div>
    <div style="font-size:13px;opacity:.7;margin-top:6px">Tu pedido está listo</div>
  </div>
  <div style="padding:32px 28px;font-size:15px;color:#333;line-height:1.6">
    <p>Hola${firstName ? `, ${e(firstName)}` : ""}.</p>
    <p>Tu editor terminó tu pedido <strong>${e(order.code)}</strong> (${e(order.package?.name)}). Ya puedes ver y descargar tus archivos:</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${e(link)}" style="display:inline-block;background:linear-gradient(135deg,#0066FF,#00D4FF);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:700">Ver mi entrega</a>
    </p>
    <p style="font-size:13px;color:#666">¿Quieres un cambio? Desde esa misma página puedes pedir un ajuste (tu paquete incluye ${e(order.package?.revisions_included ?? 0)}). Descarga tus archivos pronto: los guardamos por tiempo limitado.</p>
  </div>
</div></body></html>`;

  try {
    const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
      from: env.EMAIL_FROM ?? DEFAULT_FROM,
      to: order.customer_email,
      replyTo: TEAM_EMAIL,
      subject: `Tu pedido ${order.code} está listo`,
      html,
    });
    if (error) console.error("Resend (entrega al cliente):", error);
  } catch (error) {
    console.error("Resend (entrega al cliente):", error);
  }
}
