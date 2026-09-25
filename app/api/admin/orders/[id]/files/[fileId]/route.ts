import { NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/admin/auth";
import { signedDownloadUrl } from "@/lib/admin/service";
import { errorResponse } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// GET /api/admin/orders/[id]/files/[fileId] — redirige a una URL firmada de 5 minutos.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  const staff = await requireStaffApi();
  if (staff instanceof NextResponse) return staff;
  const { id, fileId } = await params;
  try {
    return NextResponse.redirect(await signedDownloadUrl(getAdminSupabase(), id, fileId), 302);
  } catch (error) {
    return errorResponse(error);
  }
}
