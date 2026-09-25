import { NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/admin/auth";
import { addNote } from "@/lib/admin/service";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/admin/orders/[id]/notes — nota interna (el cliente no la ve).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffApi();
  if (staff instanceof NextResponse) return staff;
  const { id } = await params;
  const body = await readJson(request);
  if (!body || typeof body.text !== "string") return badRequest();
  try {
    await addNote(getAdminSupabase(), id, staff, body.text);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
