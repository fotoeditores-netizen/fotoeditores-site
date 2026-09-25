import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env/server";
import { expireDrafts } from "@/lib/orders/service";
import { getAdminSupabase } from "@/lib/supabase/admin";

// GET /api/cron/expire-drafts — Vercel Cron (vercel.json), una vez al día.
// Borra archivos de borradores sin enviar con más de 7 días y los marca expired.
export async function GET(request: Request) {
  const secret = getServerEnv().CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const result = await expireDrafts(getAdminSupabase(), 7);
    console.log("Borradores expirados:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("expire-drafts:", error);
    return NextResponse.json({ error: "Falló la limpieza" }, { status: 500 });
  }
}
