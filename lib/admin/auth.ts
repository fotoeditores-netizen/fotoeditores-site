import "server-only";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { getAuthSupabase } from "@/lib/supabase/auth";

export type Staff = { id: string; email: string; name: string; role: "editor" | "admin" };

// Rol del equipo para un usuario ya autenticado. Sin fila en profiles = sin acceso.
export async function staffForUser(
  sb: SupabaseClient,
  user: { id: string; email?: string | null } | null,
): Promise<Staff | null> {
  if (!user) return null;
  const { data } = await sb.from("profiles").select("role, name").eq("id", user.id).maybeSingle();
  if (!data || (data.role !== "editor" && data.role !== "admin")) return null;
  return { id: user.id, email: user.email ?? "", name: data.name || user.email || "Editor", role: data.role };
}

// Usuario de la sesión actual (cookies), validado contra Supabase.
export async function getStaff(): Promise<Staff | null> {
  const auth = await getAuthSupabase();
  const {
    data: { user },
  } = await auth.auth.getUser();
  return staffForUser(getAdminSupabase(), user);
}

// Páginas del panel: sin rol → al login.
export async function requireStaffPage(): Promise<Staff> {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login?error=sin-acceso");
  return staff;
}

// Rutas /api/admin: devuelve el editor o una respuesta 401/403 lista para retornar.
export async function requireStaffApi(): Promise<Staff | NextResponse> {
  const auth = await getAuthSupabase();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const staff = await staffForUser(getAdminSupabase(), user);
  if (!staff) return NextResponse.json({ error: "Tu usuario no tiene acceso al panel" }, { status: 403 });
  return staff;
}
