import { NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/admin/auth";
import { confirmDelivery } from "@/lib/admin/service";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/admin/orders/[id]/deliveries — registra un archivo final ya subido.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffApi();
  if (staff instanceof NextResponse) return staff;
  const { id } = await params;
  const body = await readJson(request);
  if (!body || typeof body.path !== "string" || typeof body.filename !== "string") return badRequest();
  try {
    const file = await confirmDelivery(getAdminSupabase(), id, staff, { path: body.path, filename: body.filename });
    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
