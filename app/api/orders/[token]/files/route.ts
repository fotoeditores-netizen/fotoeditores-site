import { NextResponse } from "next/server";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { confirmUpload } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/orders/[token]/files — confirma una subida terminada: revisa tamaño
// real y contenido (primeros bytes) y la registra en order_files.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await readJson(request);
  if (!body || typeof body.path !== "string" || typeof body.filename !== "string") return badRequest();
  try {
    const file = await confirmUpload(getAdminSupabase(), token, { path: body.path, filename: body.filename });
    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
