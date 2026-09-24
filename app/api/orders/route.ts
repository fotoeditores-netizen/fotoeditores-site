import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { badRequest, clientIp, errorResponse, readJson } from "@/lib/http";
import { createDraft } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { UTM_COOKIE, parseUtmCookie } from "@/lib/utm";

// POST /api/orders — crea el pedido en borrador. Protegido con Turnstile.
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body || typeof body.packageSlug !== "string") return badRequest();

  if (!(await verifyTurnstile(body.turnstileToken, clientIp(request)))) {
    return NextResponse.json(
      { error: "No pudimos verificar que eres una persona. Recarga la página e intenta de nuevo." },
      { status: 403 },
    );
  }

  try {
    const utm = parseUtmCookie((await cookies()).get(UTM_COOKIE)?.value);
    const draft = await createDraft(getAdminSupabase(), { packageSlug: body.packageSlug, utm });
    return NextResponse.json(draft, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
