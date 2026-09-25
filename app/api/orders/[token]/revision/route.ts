import { NextResponse } from "next/server";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { requestRevision } from "@/lib/orders/customer";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/orders/[token]/revision — el cliente pide un ajuste de su entrega.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await readJson(request);
  if (!body) return badRequest();
  try {
    return NextResponse.json(await requestRevision(getAdminSupabase(), token, body.comment));
  } catch (error) {
    return errorResponse(error);
  }
}
