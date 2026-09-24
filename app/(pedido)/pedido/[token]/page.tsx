import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { ButtonLink } from "@/components/ui/Button";
import { getOrderByToken } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { formatUsd, whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
};

// Siempre fresco: muestra el estado actual del pedido.
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  awaiting_payment: "Recibido · pendiente de pago",
  payment_failed: "Pago no completado",
  paid: "Pagado",
  in_progress: "En edición",
  delivered: "Entregado",
  revision_requested: "Ajuste solicitado",
  closed: "Cerrado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  expired: "Borrador vencido",
};

/*
 * Seguimiento del pedido. Versión mínima de la Fase 3: confirma el envío y
 * lleva a WhatsApp. La Fase 5 agrega línea de tiempo, entregas y ajustes.
 */
export default async function PedidoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByToken(getAdminSupabase(), token);
  if (!order) notFound();
  if (order.status === "draft") redirect(`/pedido/nuevo?pedido=${token}`);

  const wa = whatsappLink(`Hola, soy ${order.customer_name ?? ""}. Mi pedido es ${order.code}.`);
  const justSent = order.status === "awaiting_payment";

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-digital bg-cyan-digital/10">
        {justSent ? <CheckCircle2 size={40} className="text-cyan-digital" /> : <Clock size={40} className="text-cyan-digital" />}
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
        {justSent ? `¡Recibimos tu pedido, ${order.customer_name?.split(" ")[0] ?? ""}!` : `Pedido ${order.code}`}
      </h1>
      <p className="text-white/60 mb-8">
        Pedido <strong className="text-white">{order.code}</strong> · {order.package.name} · {formatUsd(order.amount_usd)}
      </p>

      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-white/45 mb-1" style={{ fontFamily: "var(--font-montserrat)" }}>
          Estado
        </p>
        <p className="text-lg font-bold text-white mb-5">{STATUS_LABEL[order.status] ?? order.status}</p>
        {justSent && (
          <ol className="space-y-3 text-sm text-white/75">
            <li className="flex gap-3">
              <MessageCircle size={18} className="shrink-0 text-cyan-digital" />
              Tu editor revisa tus {order.files.length || ""} archivos y te escribe por WhatsApp para coordinar el pago.
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="shrink-0 text-cyan-digital" />
              Cuando se confirme el pago empieza la edición.
            </li>
          </ol>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <ButtonLink href={wa} variant="whatsapp" size="lg">
          <WhatsAppIcon size={20} /> Hablar con mi editor por WhatsApp
        </ButtonLink>
        <p className="text-xs text-white/45">Guarda esta página: con este enlace puedes ver el estado de tu pedido.</p>
      </div>
    </div>
  );
}
