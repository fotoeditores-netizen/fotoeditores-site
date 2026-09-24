import { NextResponse } from "next/server";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { publicOrder } from "@/lib/orders/public";
import { changePackage, getOrderByToken } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

type Params = { params: Promise<{ token: string }> };

// GET /api/orders/[token] — estado del borrador (para retomarlo tras recargar).
export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  try {
    const order = await getOrderByToken(getAdminSupabase(), token);
    if (!order) return NextResponse.json({ error: "No encontramos ese pedido." }, { status: 404 });
    return NextResponse.json(publicOrder(order));
  } catch (error) {
    return errorResponse(error);
  }
}

// PATCH /api/orders/[token] — cambiar de paquete mientras es borrador.
export async function PATCH(request: Request, { params }: Params) {
  const { token } = await params;
  const body = await readJson(request);
  if (!body || typeof body.packageSlug !== "string") return badRequest();
  try {
    const sb = getAdminSupabase();
    await changePackage(sb, token, body.packageSlug);
    return NextResponse.json(publicOrder((await getOrderByToken(sb, token))!));
  } catch (error) {
    return errorResponse(error);
  }
}
