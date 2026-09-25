import { after, NextResponse } from "next/server";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { notifyTeamNewOrder } from "@/lib/email/order-notification";
import { submitOrder } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/orders/[token]/submit — guarda brief y datos; el pedido pasa a
// awaiting_payment. El correo al equipo se envía después de responder.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await readJson(request);
  if (!body) return badRequest();
  try {
    const order = await submitOrder(getAdminSupabase(), token, body);
    after(() => notifyTeamNewOrder(order));
    return NextResponse.json({ code: order.code, status: order.status });
  } catch (error) {
    return errorResponse(error);
  }
}
