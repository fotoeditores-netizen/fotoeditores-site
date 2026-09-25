import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderStatusView from "@/components/pedido/OrderStatusView";
import { getOrderByToken } from "@/lib/orders/service";
import { getWompiConfig } from "@/lib/payments/config";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
};

// Siempre fresco: muestra el estado actual del pedido.
export const dynamic = "force-dynamic";

export default async function PedidoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const order = await getOrderByToken(getAdminSupabase(), token);
  if (!order) notFound();
  if (order.status === "draft") redirect(`/pedido/nuevo?pedido=${token}`);

  return <OrderStatusView order={order} token={token} paymentsEnabled={getWompiConfig() !== null} />;
}
