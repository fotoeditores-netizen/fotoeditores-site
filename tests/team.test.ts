/*
 * Salvaguardas de la gestión del equipo con un Supabase falso: nadie se cambia
 * su propio rol ni se quita su acceso, y siempre queda un administrador activo.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import type { Staff } from "@/lib/admin/auth";
import { createMember, listTeam, updateMember } from "@/lib/admin/team";

type P = { id: string; role: string; name: string; disabled?: boolean };

function fakeSb(people: P[]) {
  const updateUserById = vi.fn(async () => ({ data: {}, error: null }));
  const profileUpdates: unknown[] = [];
  const sb = {
    from: () => ({
      select: async () => ({ data: people.map(({ id, role, name }) => ({ id, role, name, created_at: "2026-10-01" })), error: null }),
      update: (values: unknown) => ({
        eq: async () => {
          profileUpdates.push(values);
          return { error: null };
        },
      }),
    }),
    auth: {
      admin: {
        listUsers: async () => ({
          data: { users: people.map((p) => ({ id: p.id, email: `${p.id}@x.co`, app_metadata: { disabled: p.disabled ?? false } })) },
          error: null,
        }),
        updateUserById,
      },
    },
  } as unknown as SupabaseClient;
  return { sb, updateUserById, profileUpdates };
}

const actor = (id: string): Staff => ({ id, email: `${id}@x.co`, name: id, role: "admin" });

describe("equipo: salvaguardas", () => {
  it("lista solo a quien tiene perfil, con su estado", async () => {
    const { sb } = fakeSb([
      { id: "ana", role: "admin", name: "Ana" },
      { id: "beto", role: "editor", name: "Beto", disabled: true },
    ]);
    const team = await listTeam(sb);
    expect(team.map((m) => [m.id, m.role, m.disabled])).toEqual([
      ["ana", "admin", false],
      ["beto", "editor", true],
    ]);
  });

  it("nadie cambia su propio rol ni se quita su acceso", async () => {
    const { sb, updateUserById } = fakeSb([
      { id: "ana", role: "admin", name: "Ana" },
      { id: "carla", role: "admin", name: "Carla" },
    ]);
    await expect(updateMember(sb, actor("ana"), "ana", { role: "editor" })).rejects.toMatchObject({ status: 409 });
    await expect(updateMember(sb, actor("ana"), "ana", { disabled: true })).rejects.toMatchObject({ status: 409 });
    expect(updateUserById).not.toHaveBeenCalled();
  });

  it("pero sí puede cambiar su propio nombre y contraseña", async () => {
    const { sb, updateUserById, profileUpdates } = fakeSb([{ id: "ana", role: "admin", name: "Ana" }]);
    await updateMember(sb, actor("ana"), "ana", { name: "Ana María", password: "una-clave-larga" });
    expect(updateUserById).toHaveBeenCalledWith("ana", { password: "una-clave-larga" });
    expect(profileUpdates).toEqual([{ name: "Ana María", role: "admin" }]);
  });

  it("no deja el panel sin administradores activos", async () => {
    const { sb, updateUserById } = fakeSb([
      { id: "ana", role: "admin", name: "Ana" },
      { id: "dora", role: "admin", name: "Dora", disabled: true },
      { id: "beto", role: "editor", name: "Beto" },
    ]);
    // Beto no podría llegar aquí (la ruta exige admin), pero la regla se sostiene sola.
    await expect(updateMember(sb, actor("beto"), "ana", { role: "editor" })).rejects.toMatchObject({ status: 409 });
    await expect(updateMember(sb, actor("beto"), "ana", { disabled: true })).rejects.toMatchObject({ status: 409 });
    expect(updateUserById).not.toHaveBeenCalled();
  });

  it("con dos administradores activos, uno puede quitarle el acceso al otro", async () => {
    const { sb, updateUserById } = fakeSb([
      { id: "ana", role: "admin", name: "Ana" },
      { id: "carla", role: "admin", name: "Carla" },
    ]);
    await updateMember(sb, actor("ana"), "carla", { disabled: true });
    expect(updateUserById).toHaveBeenCalledWith("carla", { ban_duration: "876000h", app_metadata: { disabled: true } });
  });

  it("devolver el acceso levanta el bloqueo", async () => {
    const { sb, updateUserById } = fakeSb([
      { id: "ana", role: "admin", name: "Ana" },
      { id: "beto", role: "editor", name: "Beto", disabled: true },
    ]);
    await updateMember(sb, actor("ana"), "beto", { disabled: false });
    expect(updateUserById).toHaveBeenCalledWith("beto", { ban_duration: "none", app_metadata: { disabled: false } });
  });

  it("rechaza datos inválidos y usuarios fuera del equipo", async () => {
    const { sb } = fakeSb([{ id: "ana", role: "admin", name: "Ana" }, { id: "beto", role: "editor", name: "Beto" }]);
    await expect(updateMember(sb, actor("ana"), "nadie", { name: "X Y" })).rejects.toMatchObject({ status: 404 });
    await expect(updateMember(sb, actor("ana"), "beto", { role: "dueño" })).rejects.toMatchObject({ status: 422 });
    await expect(updateMember(sb, actor("ana"), "beto", { password: "corta" })).rejects.toMatchObject({ status: 422 });
    await expect(updateMember(sb, actor("ana"), "beto", { name: " " })).rejects.toMatchObject({ status: 422 });
    await expect(updateMember(sb, actor("ana"), "beto", { disabled: "sí" })).rejects.toMatchObject({ status: 400 });
    await expect(createMember(sb, { email: "no-es-correo", name: "Eva", role: "editor", password: "una-clave-larga" })).rejects.toMatchObject({ status: 422 });
    await expect(createMember(sb, { email: "eva@x.co", name: "Eva", role: "root", password: "una-clave-larga" })).rejects.toMatchObject({ status: 422 });
  });
});
