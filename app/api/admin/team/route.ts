import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { createMember } from "@/lib/admin/team";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/admin/team — crea un editor o administrador (solo administradores).
export async function POST(request: Request) {
  const staff = await requireAdminApi();
  if (staff instanceof NextResponse) return staff;
  const body = await readJson(request);
  if (!body) return badRequest();
  try {
    const member = await createMember(getAdminSupabase(), body);
    return NextResponse.json({ ok: true, id: member.id }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
