import type { SupabaseClient } from "@supabase/supabase-js";
import { LEGAL } from "@/lib/legal";
import { OrderError, getOrderByToken } from "@/lib/orders/service";

/*
 * Acciones del cliente sobre un pedido entregado (Fase 5). El cliente se
 * identifica solo con el public_token de su enlace.
 */

export type RevisionState =
  | { allowed: true; remaining: number; deadline: Date }
  | { allowed: false; reason: "not_delivered" | "none_left" | "expired"; remaining: number; deadline: Date | null };

export function revisionState(
  order: { status: string; delivered_at: string | null; revisions_used: number; package: { revisions_included: number } },
  now = new Date(),
  windowDays = LEGAL.adjustmentWindowDays ?? 3,
): RevisionState {
  const remaining = Math.max(0, order.package.revisions_included - order.revisions_used);
  const deadline = order.delivered_at ? new Date(new Date(order.delivered_at).getTime() + windowDays * 86_400_000) : null;
  if (order.status !== "delivered" || !deadline) return { allowed: false, reason: "not_delivered", remaining, deadline };
  if (remaining <= 0) return { allowed: false, reason: "none_left", remaining, deadline };
  if (now > deadline) return { allowed: false, reason: "expired", remaining, deadline };
  return { allowed: true, remaining, deadline };
}

export async function requestRevision(sb: SupabaseClient, token: string, comment: unknown, now = new Date()) {
  const order = await getOrderByToken(sb, token);
  if (!order) throw new OrderError("No encontramos ese pedido.", 404);

  const text = typeof comment === "string" ? comment.trim().slice(0, 2000) : "";
  if (text.length < 5) throw new OrderError("Cuéntanos qué quieres cambiar.", 422, { comment: "Describe el ajuste" });

  const state = revisionState(order, now);
  if (!state.allowed) {
    const message =
      state.reason === "none_left"
        ? "Ya usaste los ajustes incluidos en tu paquete. Escríbenos por WhatsApp y te cotizamos el cambio."
        : state.reason === "expired"
          ? "Pasó el plazo para pedir ajustes. Escríbenos por WhatsApp y te ayudamos."
          : "Podrás pedir ajustes cuando recibas tu entrega.";
    throw new OrderError(message, 409);
  }

  // Condicionado a los valores leídos: dos solicitudes simultáneas no gastan dos ajustes.
  const { data, error } = await sb
    .from("orders")
    .update({ status: "revision_requested", revisions_used: order.revisions_used + 1 })
    .eq("id", order.id)
    .eq("status", "delivered")
    .eq("revisions_used", order.revisions_used)
    .select("id");
  if (error) throw new Error(`orders.update: ${error.message}`);
  if (!data?.length) throw new OrderError("Tu solicitud ya fue registrada.", 409);

  await sb.from("order_events").insert({
    order_id: order.id,
    type: "revision_requested",
    actor: "customer",
    payload: { comment: text, number: order.revisions_used + 1 },
  });
  return { remaining: state.remaining - 1 };
}

// Descarga de un archivo FINAL por el cliente: solo entregas de su propio pedido.
export async function customerDeliveryUrl(sb: SupabaseClient, token: string, fileId: string) {
  const order = await getOrderByToken(sb, token);
  if (!order) throw new OrderError("No encontramos ese pedido.", 404);
  if (!/^[0-9a-f-]{36}$/.test(fileId)) throw new OrderError("Archivo no encontrado.", 404);

  // Primero la pertenencia (404 igual para "no existe" y "es de otro pedido"), luego el estado.
  const { data: file } = await sb
    .from("order_files")
    .select("storage_path, filename")
    .eq("id", fileId)
    .eq("order_id", order.id)
    .eq("kind", "delivery")
    .maybeSingle();
  if (!file) throw new OrderError("Archivo no encontrado.", 404);
  if (!["delivered", "revision_requested", "closed"].includes(order.status)) throw new OrderError("Tu entrega aún no está lista.", 409);
  const { data, error } = await sb.storage.from("deliveries").createSignedUrl(file.storage_path, 300, { download: file.filename });
  if (error) throw new Error(`createSignedUrl: ${error.message}`);
  return data.signedUrl;
}
