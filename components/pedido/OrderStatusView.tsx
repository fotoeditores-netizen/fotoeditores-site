import { AlertCircle, Check, CheckCircle2, Clock, Download, Film, ImageIcon, MessageCircle } from "lucide-react";
import PayButton from "@/components/pedido/PayButton";
import RevisionForm from "@/components/pedido/RevisionForm";
import { revisionState } from "@/lib/orders/customer";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ButtonLink } from "@/components/ui/Button";
import type { OrderView } from "@/lib/orders/service";
import { formatUsd, whatsappLink } from "@/lib/whatsapp";

const STATUS_LABEL: Record<string, string> = {
  awaiting_payment: "Recibido · pendiente de pago",
  payment_failed: "El pago no se completó",
  paid: "Pagado · en cola de edición",
  in_progress: "En edición",
  delivered: "Entregado",
  revision_requested: "Ajuste solicitado",
  closed: "Cerrado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  expired: "Borrador vencido",
};

/*
 * Estado del pedido para el cliente (/pedido/[token] y /gracias): línea de
 * avance, fecha estimada, pago, descargas de la entrega y solicitud de ajustes.
 */
export default function OrderStatusView({
  order,
  token,
  paymentsEnabled,
  checking = false,
}: {
  order: OrderView;
  token: string;
  paymentsEnabled: boolean;
  /** true en /gracias mientras Wompi aún no confirma. */
  checking?: boolean;
}) {
  const firstName = order.customer_name?.split(" ")[0] ?? "";
  const wa = whatsappLink(`Hola, soy ${order.customer_name ?? ""}. Mi pedido es ${order.code}.`);
  const payable = order.status === "awaiting_payment" || order.status === "payment_failed";
  const paid = ["paid", "in_progress", "delivered", "revision_requested", "closed"].includes(order.status);
  const ready = order.status === "delivered" || order.status === "closed";
  const due = order.paid_at ? new Date(new Date(order.paid_at).getTime() + order.package.turnaround_hours * 3_600_000) : null;
  const revision = revisionState(order);

  const icon = paid ? (
    <CheckCircle2 size={40} className="text-emerald-400" />
  ) : order.status === "payment_failed" ? (
    <AlertCircle size={40} className="text-coral" />
  ) : checking ? (
    <Clock size={40} className="text-cyan-digital animate-pulse" />
  ) : (
    <CheckCircle2 size={40} className="text-cyan-digital" />
  );

  const title = ready
    ? `¡Tu pedido está listo${firstName ? `, ${firstName}` : ""}!`
    : order.status === "revision_requested"
      ? "Recibimos tu solicitud de ajuste"
      : paid
    ? `¡Pago confirmado${firstName ? `, ${firstName}` : ""}!`
    : checking
      ? "Estamos confirmando tu pago…"
      : order.status === "payment_failed"
        ? "Tu pago no se completó"
        : `¡Recibimos tu pedido${firstName ? `, ${firstName}` : ""}!`;

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/15 bg-white/5">
        {icon}
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
        {title}
      </h1>
      <p className="text-white/60 mb-8">
        Pedido <strong className="text-white">{order.code}</strong> · {order.package.name} · {formatUsd(order.amount_usd)}
      </p>

      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-white/45 mb-1" style={{ fontFamily: "var(--font-montserrat)" }}>
          Estado
        </p>
        <p className="text-lg font-bold text-white mb-5">{checking ? "Confirmando el pago con el banco" : (STATUS_LABEL[order.status] ?? order.status)}</p>

        {paid && (
          <ol className="space-y-3 text-sm text-white/75">
            <li className="flex gap-3">
              <MessageCircle size={18} className="shrink-0 text-cyan-digital" />
              Tu editor ya tiene tus archivos y te escribirá por WhatsApp si necesita algo.
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="shrink-0 text-cyan-digital" />
              Te avisaremos cuando tu pedido esté listo para descargar.
            </li>
          </ol>
        )}
        {checking && (
          <p className="text-sm text-white/70">
            Algunos pagos (como PSE) tardan unos minutos en confirmarse. Esta página se actualiza sola; también puedes
            cerrarla: te avisaremos cuando se confirme.
          </p>
        )}
        {!checking && order.status === "payment_failed" && (
          <p className="text-sm text-white/70">
            El banco o el medio de pago rechazó la transacción. No se hizo ningún cobro. Puedes intentarlo de nuevo con
            el mismo u otro medio de pago.
          </p>
        )}
        {!checking && order.status === "awaiting_payment" && (
          <p className="text-sm text-white/70">
            {paymentsEnabled
              ? "Completa el pago para que tu editor empiece. Si prefieres, escríbenos por WhatsApp y te ayudamos."
              : "Tu editor revisa tus archivos y te escribe por WhatsApp para coordinar el pago."}
          </p>
        )}
      </div>

      {/* Línea de avance */}
      {!checking && !["cancelled", "refunded", "expired"].includes(order.status) && (
        <ol className="mx-auto mt-6 grid max-w-md grid-cols-4 gap-2 text-[11px] sm:text-xs" aria-label="Avance del pedido">
          {[
            { label: "Recibido", done: true },
            { label: "Pagado", done: paid },
            { label: "En edición", done: ["in_progress", "delivered", "revision_requested", "closed"].includes(order.status) },
            { label: "Entregado", done: ready },
          ].map((step) => (
            <li key={step.label}>
              <span className={`block h-1.5 rounded-full ${step.done ? "bg-gradient-energy" : "bg-white/10"}`} />
              <span className={`mt-1.5 flex items-center justify-center gap-1 font-semibold ${step.done ? "text-white" : "text-white/40"}`}>
                {step.done && <Check size={11} className="text-cyan-digital" />}
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      )}
      {due && !ready && ["paid", "in_progress", "revision_requested"].includes(order.status) && (
        <p className="mt-3 text-sm text-white/60">
          Entrega estimada:{" "}
          <strong className="text-white">
            {new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", weekday: "long", day: "numeric", month: "long" }).format(due)}
          </strong>
        </p>
      )}

      {/* Entrega: descargas y ajustes */}
      {order.deliveries.length > 0 && (ready || order.status === "revision_requested") && (
        <section className="mx-auto mt-8 max-w-md rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5 text-left">
          <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
            Tus archivos finales
          </h2>
          <ul className="space-y-1.5">
            {order.deliveries.map((file) => (
              <li key={file.id}>
                <a href={`/api/orders/${token}/deliveries/${file.id}`} className="flex items-center gap-3 rounded-lg p-2 text-sm hover:bg-white/5">
                  {file.mime.startsWith("video/") ? <Film size={16} className="text-cyan-digital" /> : <ImageIcon size={16} className="text-cyan-digital" />}
                  <span className="min-w-0 flex-1 truncate text-white">{file.filename}</span>
                  <Download size={16} className="text-white/60" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-white/50">Descárgalos pronto: guardamos tus archivos por tiempo limitado.</p>
          {revision.allowed && (
            <div className="mt-5 border-t border-white/10 pt-5">
              <RevisionForm
                token={token}
                remaining={revision.remaining}
                deadline={new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(revision.deadline)}
              />
            </div>
          )}
          {!revision.allowed && order.status === "delivered" && (
            <p className="mt-4 text-xs text-white/50">
              {revision.reason === "none_left"
                ? "Ya usaste los ajustes de tu paquete. Si necesitas otro cambio, escríbenos por WhatsApp."
                : "Pasó el plazo para pedir ajustes. Si necesitas algo, escríbenos por WhatsApp."}
            </p>
          )}
        </section>
      )}

      <div className="mt-8 flex flex-col items-center gap-4">
        {payable && paymentsEnabled && !checking && (
          <PayButton token={token} label={order.status === "payment_failed" ? "Reintentar pago" : "Pagar ahora"} />
        )}
        <ButtonLink href={wa} variant={payable && paymentsEnabled ? "secondary" : "whatsapp"} size={payable && paymentsEnabled ? "md" : "lg"}>
          <WhatsAppIcon size={18} /> Hablar con mi editor por WhatsApp
        </ButtonLink>
        <p className="text-xs text-white/45">Guarda esta página: con este enlace puedes ver el estado de tu pedido.</p>
      </div>
    </div>
  );
}
