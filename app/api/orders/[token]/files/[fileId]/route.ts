import { NextResponse } from "next/server";
import { badRequest, errorResponse } from "@/lib/http";
import { deleteFile } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

// DELETE /api/orders/[token]/files/[fileId] — quitar un archivo del borrador.
export async function DELETE(_request: Request, { params }: { params: Promise<{ token: string; fileId: string }> }) {
  const { token, fileId } = await params;
  if (!/^[0-9a-f-]{36}$/.test(fileId)) return badRequest();
  try {
    await deleteFile(getAdminSupabase(), token, fileId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
