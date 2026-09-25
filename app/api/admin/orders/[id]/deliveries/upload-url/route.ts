import { NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/admin/auth";
import { issueDeliveryUpload } from "@/lib/admin/service";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/admin/orders/[id]/deliveries/upload-url — firma la subida de un archivo final.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaffApi();
  if (staff instanceof NextResponse) return staff;
  const { id } = await params;
  const body = await readJson(request);
  if (!body || typeof body.filename !== "string" || typeof body.size !== "number") return badRequest();
  try {
    return NextResponse.json(await issueDeliveryUpload(getAdminSupabase(), id, { filename: body.filename, size: body.size }));
  } catch (error) {
    return errorResponse(error);
  }
}
