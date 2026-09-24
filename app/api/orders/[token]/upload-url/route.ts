import { NextResponse } from "next/server";
import { badRequest, errorResponse, readJson } from "@/lib/http";
import { issueUploadUrl } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

// POST /api/orders/[token]/upload-url — autoriza UNA subida directa a Supabase
// Storage (el archivo nunca pasa por Vercel). Valida tipo, peso y cantidad.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await readJson(request);
  if (!body || typeof body.filename !== "string" || typeof body.size !== "number") return badRequest();
  try {
    const signed = await issueUploadUrl(getAdminSupabase(), token, { filename: body.filename, size: body.size });
    return NextResponse.json(signed);
  } catch (error) {
    return errorResponse(error);
  }
}
