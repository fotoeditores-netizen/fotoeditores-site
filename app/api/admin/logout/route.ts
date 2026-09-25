import { NextResponse } from "next/server";
import { getAuthSupabase } from "@/lib/supabase/auth";

// POST /api/admin/logout — cierra la sesión y vuelve al login.
export async function POST(request: Request) {
  const supabase = await getAuthSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}
