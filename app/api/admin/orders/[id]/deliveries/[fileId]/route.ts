import { NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/admin/auth";
import { deleteDelivery } from "@/lib/admin/service";
import { errorResponse } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// DELETE /api/admin/orders/[id]/deliveries/[fileId] — quitar un archivo final.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; fileId: string }> }) {
  const staff = await requireStaffApi();
  if (staff instanceof NextResponse) return staff;
  const { id, fileId } = await params;
  try {
    await deleteDelivery(getAdminSupabase(), id, fileId, staff);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
