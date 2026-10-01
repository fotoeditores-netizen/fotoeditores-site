/*
 * Gestión del equipo contra el Supabase de .env.local: alta real en Auth,
 * bloqueo de acceso y permisos de la API. Los usuarios de prueba usan el
 * dominio fotoeditores.test y se borran al final.
 */
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// La sesión de la API se simula: getUser() devuelve el usuario que diga cada prueba.
const session = vi.hoisted(() => ({ user: null as User | null }));
vi.mock("@/lib/supabase/auth", () => ({
  getAuthSupabase: async () => ({ auth: { getUser: async () => ({ data: { user: session.user } }) } }),
}));

import { staffForUser } from "@/lib/admin/auth";
import { createMember, listTeam, updateMember } from "@/lib/admin/team";
import { POST as createRoute } from "@/app/api/admin/team/route";
import { PATCH as patchRoute } from "@/app/api/admin/team/[id]/route";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = Boolean(url && anonKey && serviceKey);

const stamp = Date.now();
const mail = (who: string) => `vitest-equipo-${who}-${stamp}@fotoeditores.test`;
const password = `Vitest-${crypto.randomUUID().slice(0, 18)}`;

describe.skipIf(!configured)("Equipo del panel (integración)", () => {
  let sb: SupabaseClient;
  let anon: SupabaseClient;
  const created: string[] = [];
  let adminId: string;
  let editorId: string;

  const fresh = async (id: string) => (await sb.auth.admin.getUserById(id)).data.user!;
  const login = (email: string, pw = password) => anon.auth.signInWithPassword({ email, password: pw });
  const json = (body: unknown) => new Request("https://fotoeditores.test/api/admin/team", { method: "POST", body: JSON.stringify(body) });

  beforeAll(async () => {
    sb = createClient(url!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } });
    anon = createClient(url!, anonKey!, { auth: { persistSession: false, autoRefreshToken: false } });
    adminId = (await createMember(sb, { email: mail("admin"), name: "Admin Vitest", role: "admin", password })).id;
    created.push(adminId);
  });

  afterAll(async () => {
    for (const id of created) await sb.auth.admin.deleteUser(id); // borra también el perfil (cascade)
  });

  it("crea un editor que puede entrar y tiene su rol", async () => {
    editorId = (await createMember(sb, { email: mail("editor"), name: "  Editor   Vitest ", role: "editor", password })).id;
    created.push(editorId);
    const staff = await staffForUser(sb, await fresh(editorId));
    expect(staff).toMatchObject({ role: "editor", name: "Editor Vitest" });
    const { error } = await login(mail("editor"));
    expect(error).toBeNull();
    expect((await listTeam(sb)).find((m) => m.id === editorId)).toMatchObject({ role: "editor", disabled: false });
  });

  it("no repite correos", async () => {
    await expect(createMember(sb, { email: mail("editor").toUpperCase(), name: "Otro", role: "editor", password })).rejects.toMatchObject({ status: 409 });
  });

  it("quitar el acceso bloquea el login y el panel; devolverlo los restablece", async () => {
    const admin = (await staffForUser(sb, await fresh(adminId)))!;
    await updateMember(sb, admin, editorId, { disabled: true });
    expect(await staffForUser(sb, await fresh(editorId))).toBeNull();
    expect((await login(mail("editor"))).error).not.toBeNull();
    // El perfil sigue ahí: la bitácora conserva su nombre.
    expect((await sb.from("profiles").select("name").eq("id", editorId).single()).data).toEqual({ name: "Editor Vitest" });

    await updateMember(sb, admin, editorId, { disabled: false });
    expect(await staffForUser(sb, await fresh(editorId))).toMatchObject({ role: "editor" });
    expect((await login(mail("editor"))).error).toBeNull();
  });

  it("cambia rol y contraseña", async () => {
    const admin = (await staffForUser(sb, await fresh(adminId)))!;
    const nueva = `Nueva-${crypto.randomUUID().slice(0, 12)}`;
    await updateMember(sb, admin, editorId, { role: "admin", password: nueva });
    expect(await staffForUser(sb, await fresh(editorId))).toMatchObject({ role: "admin" });
    expect((await login(mail("editor"), password)).error).not.toBeNull();
    expect((await login(mail("editor"), nueva)).error).toBeNull();
    await updateMember(sb, admin, editorId, { role: "editor" });
  });

  describe("API", () => {
    it("sin sesión responde 401", async () => {
      session.user = null;
      expect((await createRoute(json({}))).status).toBe(401);
    });

    it("un editor no puede crear ni editar usuarios (403)", async () => {
      session.user = await fresh(editorId);
      expect((await createRoute(json({ email: mail("x"), name: "X", role: "admin", password }))).status).toBe(403);
      const res = await patchRoute(new Request("https://x/", { method: "PATCH", body: JSON.stringify({ role: "admin" }) }), {
        params: Promise.resolve({ id: editorId }),
      });
      expect(res.status).toBe(403);
      expect(await staffForUser(sb, await fresh(editorId))).toMatchObject({ role: "editor" });
    });

    it("un usuario sin acceso tampoco, aunque sea administrador", async () => {
      const admin = (await staffForUser(sb, await fresh(adminId)))!;
      await updateMember(sb, admin, editorId, { role: "admin" });
      await updateMember(sb, admin, editorId, { disabled: true });
      session.user = await fresh(editorId);
      expect((await createRoute(json({ email: mail("y"), name: "Y", role: "editor", password }))).status).toBe(403);
      await updateMember(sb, admin, editorId, { disabled: false, role: "editor" });
    });

    it("un administrador crea otro administrador y no puede quitarse su propio acceso", async () => {
      session.user = await fresh(adminId);
      const res = await createRoute(json({ email: mail("admin2"), name: "Admin Dos", role: "admin", password }));
      expect(res.status).toBe(201);
      const { id } = (await res.json()) as { id: string };
      created.push(id);
      expect(await staffForUser(sb, await fresh(id))).toMatchObject({ role: "admin" });

      const self = await patchRoute(new Request("https://x/", { method: "PATCH", body: JSON.stringify({ disabled: true }) }), {
        params: Promise.resolve({ id: adminId }),
      });
      expect(self.status).toBe(409);
    });
  });
});
