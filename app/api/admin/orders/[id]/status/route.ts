import { NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/admin/auth";
import { changeStatus } from "@/lib/admin/service";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/admin/orders/[id]/status — cambiar el estado (solo transiciones permitidas).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffApi();
  if (staff instanceof NextResponse) return staff;
  const { id } = await params;
  const body = await readJson(request);
  if (!body || typeof body.to !== "string") return badRequest();
  try {
    await changeStatus(getAdminSupabase(), id, body.to, staff);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
