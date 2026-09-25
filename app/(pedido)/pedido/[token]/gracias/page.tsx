import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderStatusView from "@/components/pedido/OrderStatusView";
import PaymentPoller from "@/components/pedido/PaymentPoller";
import { getOrderByToken } from "@/lib/orders/service";
import { getWompiConfig } from "@/lib/payments/config";
import { applyTransaction, fetchWompiTransaction } from "@/lib/payments/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Resultado del pago",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/*
 * Retorno desde Wompi (/pedido/[token]/gracias?id=<transacción>).
 * NO se confía en la URL: si el pedido sigue pendiente, el servidor consulta la
 * transacción a la API de Wompi y la aplica con las mismas reglas del webhook
 * (referencia de ESTE pedido, monto exacto, idempotencia).
 */
export default async function GraciasPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const [{ token }, { id }] = await Promise.all([params, searchParams]);
  const sb = getAdminSupabase();
  let order = await getOrderByToken(sb, token);
  if (!order) notFound();
  if (order.status === "draft") redirect(`/pedido/nuevo?pedido=${token}`);

  const wompi = getWompiConfig();
  let checking = false;

  if (wompi && typeof id === "string" && (order.status === "awaiting_payment" || order.status === "payment_failed")) {
    const tx = await fetchWompiTransaction(wompi.apiBase, id);
    if (tx) {
      const { result } = await applyTransaction(sb, tx, { source: "redirect", raw: { transaction: tx }, expectedOrderId: order.id });
      if (result === "applied") order = (await getOrderByToken(sb, token))!;
      checking = tx.status === "PENDING";
    } else {
      checking = true; // Wompi aún no la reporta: se reintenta con el sondeo
    }
  }

  return (
    <>
      <PaymentPoller active={checking} />
      <OrderStatusView order={order} token={token} paymentsEnabled={wompi !== null} checking={checking} />
    </>
  );
}
