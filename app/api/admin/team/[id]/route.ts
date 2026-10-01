import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/auth";
import { updateMember } from "@/lib/admin/team";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// PATCH /api/admin/team/[id] — nombre, rol, contraseña o acceso (solo administradores).
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireAdminApi();
  if (staff instanceof NextResponse) return staff;
  const { id } = await params;
  const body = await readJson(request);
  if (!body) return badRequest();
  try {
    await updateMember(getAdminSupabase(), staff, id, {
      name: body.name,
      role: body.role,
      disabled: body.disabled,
      password: body.password,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
