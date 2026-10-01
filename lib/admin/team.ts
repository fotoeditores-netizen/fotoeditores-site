import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Staff } from "@/lib/admin/auth";
import { OrderError } from "@/lib/orders/service";

/*
 * Gestión del equipo del panel (solo administradores).
 *
 * - Un miembro = usuario de Supabase Auth + fila en public.profiles (rol).
 * - Nunca se borra a nadie: "quitar acceso" bloquea el usuario en Auth
 *   (ban) y marca app_metadata.disabled, que staffForUser revisa en cada
 *   petición. Así la bitácora de los pedidos conserva quién hizo qué, y el
 *   acceso se puede devolver.
 * - Salvaguardas: nadie se cambia su propio rol ni se quita su propio acceso,
 *   y siempre queda al menos un administrador activo.
 */

export type Role = "editor" | "admin";
export type Member = {
  id: string;
  email: string;
  name: string;
  role: Role;
  disabled: boolean;
  last_sign_in_at: string | null;
  created_at: string;
};

export const PASSWORD_MIN = 10;
const BAN_FOREVER = "876000h"; // ~100 años
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isRole = (v: unknown): v is Role => v === "editor" || v === "admin";

function cleanName(v: unknown): string {
  const name = typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 80) throw new OrderError("Escribe un nombre de 2 a 80 caracteres.", 422, { name: "Nombre inválido" });
  return name;
}

function cleanPassword(v: unknown): string {
  const password = typeof v === "string" ? v : "";
  if (password.length < PASSWORD_MIN || password.length > 72) {
    throw new OrderError(`La contraseña debe tener entre ${PASSWORD_MIN} y 72 caracteres.`, 422, { password: "Contraseña inválida" });
  }
  return password;
}

function authError(error: { code?: string; message: string }): OrderError {
  if (error.code === "email_exists" || /already been registered/i.test(error.message)) {
    return new OrderError("Ya existe un usuario con ese correo.", 409, { email: "Correo en uso" });
  }
  if (error.code === "weak_password") {
    return new OrderError("Supabase rechazó la contraseña por débil: usa letras, números y símbolos.", 422, { password: "Contraseña débil" });
  }
  return new OrderError(`Supabase no aceptó el cambio: ${error.message}`, 422);
}

export async function listTeam(sb: SupabaseClient): Promise<Member[]> {
  const [{ data: profiles, error: pe }, { data: users, error: ue }] = await Promise.all([
    sb.from("profiles").select("id, role, name, created_at"),
    sb.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  if (pe) throw pe;
  if (ue) throw ue;
  const byId = new Map(users.users.map((u) => [u.id, u]));
  return (profiles ?? [])
    .filter((p) => byId.has(p.id) && isRole(p.role))
    .map((p) => {
      const u = byId.get(p.id)!;
      return {
        id: p.id,
        email: u.email ?? "",
        name: p.name || u.email || "",
        role: p.role as Role,
        disabled: u.app_metadata?.disabled === true,
        last_sign_in_at: u.last_sign_in_at ?? null,
        created_at: p.created_at,
      };
    })
    .sort((a, b) => Number(a.disabled) - Number(b.disabled) || a.name.localeCompare(b.name, "es"));
}

export async function createMember(sb: SupabaseClient, input: Record<string, unknown>): Promise<Member> {
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 200) throw new OrderError("Escribe un correo válido.", 422, { email: "Correo inválido" });
  const name = cleanName(input.name);
  const password = cleanPassword(input.password);
  if (!isRole(input.role)) throw new OrderError("Elige un rol: editor o administrador.", 422, { role: "Rol inválido" });

  const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) throw authError(error);

  const { error: pe } = await sb.from("profiles").insert({ id: data.user.id, role: input.role, name });
  if (pe) {
    await sb.auth.admin.deleteUser(data.user.id); // deshacer: no dejar usuarios sin perfil
    throw pe;
  }
  return { id: data.user.id, email, name, role: input.role, disabled: false, last_sign_in_at: null, created_at: new Date().toISOString() };
}

export async function updateMember(
  sb: SupabaseClient,
  actor: Staff,
  id: string,
  input: { name?: unknown; role?: unknown; disabled?: unknown; password?: unknown },
): Promise<void> {
  const team = await listTeam(sb);
  const target = team.find((m) => m.id === id);
  if (!target) throw new OrderError("Ese usuario no es parte del equipo.", 404);

  const self = actor.id === id;
  const role = input.role === undefined ? target.role : input.role;
  const disabled = input.disabled === undefined ? target.disabled : input.disabled;
  if (!isRole(role)) throw new OrderError("Elige un rol: editor o administrador.", 422, { role: "Rol inválido" });
  if (typeof disabled !== "boolean") throw new OrderError("Petición inválida.", 400);

  if (self && role !== target.role) throw new OrderError("No puedes cambiar tu propio rol. Pídeselo a otro administrador.", 409);
  if (self && disabled) throw new OrderError("No puedes quitarte el acceso a ti mismo.", 409);

  const staysActiveAdmin = role === "admin" && !disabled;
  if (target.role === "admin" && !target.disabled && !staysActiveAdmin) {
    const activeAdmins = team.filter((m) => m.role === "admin" && !m.disabled).length;
    if (activeAdmins <= 1) throw new OrderError("Debe quedar al menos un administrador activo.", 409);
  }

  const name = input.name === undefined ? undefined : cleanName(input.name);
  const password = input.password === undefined ? undefined : cleanPassword(input.password);

  if (password !== undefined || disabled !== target.disabled) {
    const { error } = await sb.auth.admin.updateUserById(id, {
      ...(password !== undefined ? { password } : {}),
      ...(disabled !== target.disabled
        ? { ban_duration: disabled ? BAN_FOREVER : "none", app_metadata: { disabled } }
        : {}),
    });
    if (error) throw authError(error);
  }

  if (name !== undefined || role !== target.role) {
    const { error } = await sb
      .from("profiles")
      .update({ ...(name !== undefined ? { name } : {}), role })
      .eq("id", id);
    if (error) throw error;
  }
}
