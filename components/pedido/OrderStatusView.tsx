import { AlertCircle, CheckCircle2, Clock, MessageCircle } from "lucide-react";
import PayButton from "@/components/pedido/PayButton";
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
 * Estado del pedido para el cliente (/pedido/[token] y /gracias). La Fase 5
 * agrega línea de tiempo, entregas y ajustes.
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

  const icon = paid ? (
    <CheckCircle2 size={40} className="text-emerald-400" />
  ) : order.status === "payment_failed" ? (
    <AlertCircle size={40} className="text-coral" />
  ) : checking ? (
    <Clock size={40} className="text-cyan-digital animate-pulse" />
  ) : (
    <CheckCircle2 size={40} className="text-cyan-digital" />
  );

  const title = paid
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
