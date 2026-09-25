import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Film, ImageIcon } from "lucide-react";
import DeliveryUploader from "@/components/admin/DeliveryUploader";
import DownloadAll from "@/components/admin/DownloadAll";
import NoteForm from "@/components/admin/NoteForm";
import OrderActions from "@/components/admin/OrderActions";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ButtonLink } from "@/components/ui/Button";
import { requireStaffPage } from "@/lib/admin/auth";
import { STATUS_LABEL, allowedTransitions, getOrderDetail } from "@/lib/admin/service";
import { GOALS, USAGES } from "@/lib/orders/brief";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { formatUsd } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Pedido" };
export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
const size = (b: number) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const goalLabel = (id: string) => [...GOALS.producto, ...GOALS.recuerdos].find((g) => g.id === id)?.label ?? id;

const EVENT_LABEL: Record<string, string> = {
  draft_created: "Borrador creado",
  package_changed: "Cambió de paquete",
  file_uploaded: "Subió un archivo",
  file_deleted: "Quitó un archivo",
  submitted: "Envió el pedido",
  checkout_started: "Abrió el pago",
  paid: "Pago confirmado",
  payment_failed: "Pago rechazado",
  payment_mismatch: "⚠️ Monto del pago no coincide",
  duplicate_payment: "⚠️ Pago doble (reembolsar)",
  payment_voided: "Pago anulado",
  status_changed: "Cambio de estado",
  note: "Nota interna",
  delivery_uploaded: "Subió archivo final",
  delivery_deleted: "Quitó archivo final",
  delivered: "Entregado al cliente",
  revision_requested: "Cliente pidió ajuste",
  expired: "Borrador vencido",
};

function eventDetail(e: { type: string; payload: Record<string, unknown> }): string {
  const p = e.payload ?? {};
  if (e.type === "note") return String(p.text ?? "");
  if (e.type === "revision_requested") return `«${String(p.comment ?? "")}»`;
  if (e.type === "status_changed") return `${STATUS_LABEL[String(p.from)] ?? p.from} → ${STATUS_LABEL[String(p.to)] ?? p.to}`;
  if (e.type === "paid") return p.source === "manual" ? "marcado a mano (pago por fuera de la página)" : `${p.method ?? "Wompi"} · ${p.reference ?? ""}`;
  if (e.type === "payment_failed") return `${p.status ?? ""} · ${p.reference ?? ""}`;
  if (["file_uploaded", "delivery_uploaded", "delivery_deleted"].includes(e.type)) return String(p.filename ?? "");
  return "";
}

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffPage();
  const { id } = await params;
  const order = await getOrderDetail(getAdminSupabase(), id);
  if (!order) notFound();

  const brief = (order.brief ?? {}) as { goals?: string[]; usage?: string; references?: string; notes?: string; externalLink?: string };
  const fileUrl = (fileId: string) => `/api/admin/orders/${order.id}/files/${fileId}`;
  const wa = order.customer_whatsapp
    ? `https://wa.me/${order.customer_whatsapp}?text=${encodeURIComponent(`Hola ${order.customer_name ?? ""}, soy tu editor de Fotoeditores. Tu pedido es ${order.code}.`)}`
    : null;
  const canDeliver = ["paid", "in_progress", "revision_requested"].includes(order.status);
  const paidOnline = order.payments?.find((p) => p.status === "APPROVED");

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-white/55 hover:text-white">
        <ArrowLeft size={15} /> Pedidos
      </Link>

      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
            {order.code}
          </h1>
          <p className="text-sm text-white/60">
            {order.package?.name} · {formatUsd(order.amount_usd)}
            {paidOnline && ` · COP ${(paidOnline.amount_cents / 100).toLocaleString("es-CO")} (${paidOnline.payment_method ?? "Wompi"})`}
          </p>
        </div>
        <div className="text-sm text-white/60 sm:text-right">
          <p className="text-lg font-bold text-white">{STATUS_LABEL[order.status] ?? order.status}</p>
          {order.due_at && <p>Entregar antes de: {dateFmt.format(new Date(order.due_at))}</p>}
          <p>
            Ajustes: {order.revisions_used} de {order.package?.revisions_included ?? 0}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Columna principal */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              Lo que pide el cliente
            </h2>
            <dl className="grid gap-3 text-sm sm:grid-cols-[130px_1fr]">
              <dt className="text-white/50">Quiere</dt>
              <dd className="text-white">{(brief.goals ?? []).map(goalLabel).join(", ") || "—"}</dd>
              <dt className="text-white/50">Para</dt>
              <dd className="text-white">{USAGES.find((u) => u.id === brief.usage)?.label ?? "—"}</dd>
              {brief.references && (
                <>
                  <dt className="text-white/50">Referencias</dt>
                  <dd className="whitespace-pre-wrap text-white">{brief.references}</dd>
                </>
              )}
              {brief.notes && (
                <>
                  <dt className="text-white/50">Notas</dt>
                  <dd className="whitespace-pre-wrap text-white">{brief.notes}</dd>
                </>
              )}
              {brief.externalLink && (
                <>
                  <dt className="text-white/50">Enlace externo</dt>
                  <dd>
                    <a href={brief.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all text-cyan-digital underline">
                      {brief.externalLink} <ExternalLink size={13} />
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                Originales del cliente ({order.originals.length})
              </h2>
              <DownloadAll urls={order.originals.map((f) => fileUrl(f.id))} />
            </div>
            {order.originals.length === 0 ? (
              <p className="text-sm text-white/50">Sin archivos subidos{brief.externalLink ? ": revisa el enlace externo." : "."}</p>
            ) : (
              <ul className="space-y-1.5">
                {order.originals.map((f) => (
                  <li key={f.id}>
                    <a href={fileUrl(f.id)} className="flex items-center gap-3 rounded-lg p-2 text-sm hover:bg-white/5">
                      {f.mime.startsWith("video/") ? <Film size={16} className="text-cyan-digital" /> : <ImageIcon size={16} className="text-cyan-digital" />}
                      <span className="min-w-0 flex-1 truncate text-white">{f.filename}</span>
                      <span className="text-xs text-white/45">{size(f.size_bytes)}</span>
                      <Download size={15} className="text-white/50" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              Archivos finales para el cliente
            </h2>
            {canDeliver || order.status === "delivered" ? (
              <DeliveryUploader orderId={order.id} initial={order.deliveries} />
            ) : (
              <p className="text-sm text-white/50">Podrás subir entregas cuando el pedido esté pagado.</p>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              Bitácora
            </h2>
            <ol className="space-y-2.5 text-sm">
              {[...order.events].reverse().map((e) => (
                <li key={e.id} className={`rounded-lg p-2 ${e.type === "note" ? "bg-gold/10" : ""}`}>
                  <span className="text-white">{EVENT_LABEL[e.type] ?? e.type}</span>
                  {eventDetail(e) && <span className="text-white/60"> · {eventDetail(e)}</span>}
                  <span className="block text-xs text-white/40">
                    {dateFmt.format(new Date(e.created_at))} · {e.actor === "editor" ? (e.actor_name ?? "Editor") : e.actor === "customer" ? "Cliente" : "Sistema"}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Columna lateral */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              Acciones
            </h2>
            <OrderActions
              orderId={order.id}
              status={order.status}
              transitions={allowedTransitions(order.status, staff.role)}
              canDeliver={canDeliver}
              deliveries={order.deliveries.length}
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm">
            <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              Cliente
            </h2>
            <p className="text-white">{order.customer_name ?? "—"}</p>
            {order.customer_email && (
              <a href={`mailto:${order.customer_email}`} className="block break-all text-cyan-digital">
                {order.customer_email}
              </a>
            )}
            {order.customer_whatsapp && <p className="text-white/70">+{order.customer_whatsapp}</p>}
            {wa && (
              <ButtonLink href={wa} variant="whatsapp" className="mt-3 w-full">
                <WhatsAppIcon size={16} /> Escribir por WhatsApp
              </ButtonLink>
            )}
            <p className="mt-3 text-xs text-white/45">
              Autorizó datos: {order.consent_at ? dateFmt.format(new Date(order.consent_at)) : "—"}
              {(order.utm as Record<string, string> | null)?.utm_source && ` · Llegó por: ${(order.utm as Record<string, string>).utm_source}`}
            </p>
            <a href={`/pedido/${order.public_token}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-white/55 underline">
              Ver lo que ve el cliente <ExternalLink size={12} />
            </a>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              Notas internas
            </h2>
            <NoteForm orderId={order.id} />
          </section>
        </aside>
      </div>
    </div>
  );
}
