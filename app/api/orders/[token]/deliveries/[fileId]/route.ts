import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/http";
import { customerDeliveryUrl } from "@/lib/orders/customer";
import { getAdminSupabase } from "@/lib/supabase/admin";

// GET /api/orders/[token]/deliveries/[fileId] — descarga de un archivo final
// del propio pedido (URL firmada de 5 minutos).
export async function GET(_request: Request, { params }: { params: Promise<{ token: string; fileId: string }> }) {
  const { token, fileId } = await params;
  try {
    return NextResponse.redirect(await customerDeliveryUrl(getAdminSupabase(), token, fileId), 302);
  } catch (error) {
    return errorResponse(error);
  }
}
