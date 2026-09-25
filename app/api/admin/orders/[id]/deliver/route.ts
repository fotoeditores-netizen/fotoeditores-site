import { after, NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/admin/auth";
import { deliver } from "@/lib/admin/service";
import { notifyCustomerDelivered } from "@/lib/email/order-notification";
import { errorResponse } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/admin/orders/[id]/deliver — marca entregado y avisa al cliente por correo.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffApi();
  if (staff instanceof NextResponse) return staff;
  const { id } = await params;
  try {
    const sb = getAdminSupabase();
    await deliver(sb, id, staff);
    const siteUrl = new URL(request.url).origin;
    after(() => notifyCustomerDelivered(sb, id, siteUrl));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
