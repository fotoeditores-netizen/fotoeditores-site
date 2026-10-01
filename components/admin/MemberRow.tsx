"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { randomPassword } from "@/lib/admin/password";
import { api, ApiError } from "@/lib/orders/client";

type Member = {
  id: string;
  email: string;
  name: string;
  role: "editor" | "admin";
  disabled: boolean;
  last_sign_in_at: string | null;
};

const dateFmt = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "numeric", month: "short", year: "numeric" });

// Un miembro del equipo: editar nombre, rol y contraseña; quitar o devolver el acceso.
export default function MemberRow({ member, isSelf }: { member: Member; isSelf: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function patch(key: string, json: Record<string, unknown>, done: string) {
    setBusy(key);
    setError(null);
    setSaved(null);
    try {
      await api(`/api/admin/team/${member.id}`, { method: "PATCH", json });
      setSaved(done);
      setEditing(false);
      setPassword("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el cambio.");
    } finally {
      setBusy(null);
    }
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const json: Record<string, unknown> = {};
    if (name.trim() !== member.name) json.name = name;
    if (role !== member.role) json.role = role;
    if (password) json.password = password;
    if (Object.keys(json).length === 0) return setEditing(false);
    patch("save", json, password ? `Cambios guardados. Nueva contraseña: ${password}` : "Cambios guardados.");
  }

  function toggleAccess() {
    const msg = member.disabled
      ? `¿Devolverle el acceso al panel a ${member.name}?`
      : `¿Quitarle el acceso al panel a ${member.name}? No podrá entrar, pero su historial en los pedidos se conserva.`;
    if (window.confirm(msg)) patch("access", { disabled: !member.disabled }, member.disabled ? "Acceso devuelto." : "Acceso quitado.");
  }

  return (
    <li className={`rounded-2xl border border-white/10 p-4 ${member.disabled ? "bg-white/[0.01] opacity-70" : "bg-white/[0.03]"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-bold text-white">
            {member.name}
            {isSelf && <span className="ml-2 text-xs font-normal text-white/45">(tú)</span>}
          </p>
          <p className="truncate text-sm text-white/60">{member.email}</p>
          <p className="mt-1 flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-2 py-0.5 ${member.role === "admin" ? "bg-gold/15 text-gold" : "bg-electric/20 text-cyan-digital"}`}>
              {member.role === "admin" ? "Administrador" : "Editor"}
            </span>
            {member.disabled && <span className="rounded-full bg-coral/15 px-2 py-0.5 text-coral">Sin acceso</span>}
            <span className="text-white/40">
              {member.last_sign_in_at ? `Último ingreso: ${dateFmt.format(new Date(member.last_sign_in_at))}` : "Aún no ha entrado"}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!editing && (
            <Button variant="secondary" onClick={() => setEditing(true)} disabled={busy !== null}>
              <Pencil size={15} /> Editar
            </Button>
          )}
          {!isSelf && (
            <Button variant="secondary" onClick={toggleAccess} disabled={busy !== null} className={member.disabled ? "" : "!text-coral"}>
              {busy === "access" && <Loader2 size={15} className="animate-spin" />}
              {member.disabled ? "Devolver acceso" : "Quitar acceso"}
            </Button>
          )}
        </div>
      </div>

      {editing && (
        <form onSubmit={save} className="mt-4 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-3">
          <Field id={`n-${member.id}`} label="Nombre">
            <Input id={`n-${member.id}`} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} required />
          </Field>
          <Field id={`r-${member.id}`} label="Rol" hint={isSelf ? "No puedes cambiar tu propio rol." : undefined}>
            <Select id={`r-${member.id}`} value={role} onChange={(e) => setRole(e.target.value as Member["role"])} disabled={isSelf}>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </Select>
          </Field>
          <Field id={`p-${member.id}`} label="Nueva contraseña" hint="Déjala vacía para no cambiarla.">
            <div className="flex gap-2">
              <Input id={`p-${member.id}`} value={password} onChange={(e) => setPassword(e.target.value)} minLength={10} maxLength={72} autoComplete="new-password" className="font-mono" />
              <Button variant="secondary" onClick={() => setPassword(randomPassword())} aria-label="Generar contraseña" title="Generar contraseña">
                <KeyRound size={16} />
              </Button>
            </div>
          </Field>
          <div className="flex justify-end gap-2 sm:col-span-3">
            <Button
              variant="secondary"
              onClick={() => {
                setEditing(false);
                setName(member.name);
                setRole(member.role);
                setPassword("");
                setError(null);
              }}
              disabled={busy !== null}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={busy !== null}>
              {busy === "save" && <Loader2 size={15} className="animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-coral">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="mt-3 text-sm text-emerald-300">
          {saved}
        </p>
      )}
    </li>
  );
}
