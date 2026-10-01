"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { randomPassword } from "@/lib/admin/password";
import { api, ApiError } from "@/lib/orders/client";

// Alta de un editor o administrador. Muestra los datos para pasárselos a la persona.
export default function NewMemberForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", role: "editor", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ message: string; fields?: Record<string, string> } | null>(null);
  const [created, setCreated] = useState<{ name: string; email: string; password: string } | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/admin/team", { method: "POST", json: form });
      setCreated({ name: form.name, email: form.email.trim().toLowerCase(), password: form.password });
      setForm({ name: "", email: "", role: "editor", password: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? { message: err.message, fields: err.fields } : { message: "No se pudo crear el usuario." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {created && (
        <div role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4 text-sm">
          <p className="mb-2 font-bold text-white">Listo, {created.name} ya puede entrar. Pásale estos datos por un medio privado:</p>
          <p className="text-white/80">
            Dirección: <span className="font-mono">www.fotoeditores.com/admin</span>
            <br />
            Correo: <span className="font-mono">{created.email}</span>
            <br />
            Contraseña: <span className="font-mono">{created.password}</span>
          </p>
          <p className="mt-2 text-xs text-white/50">Esta contraseña no se vuelve a mostrar. Si se pierde, asígnale una nueva desde la lista.</p>
        </div>
      )}

      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        <Field id="m-name" label="Nombre" required error={error?.fields?.name}>
          <Input id="m-name" value={form.name} onChange={set("name")} maxLength={80} required autoComplete="off" />
        </Field>
        <Field id="m-email" label="Correo" required error={error?.fields?.email}>
          <Input id="m-email" type="email" value={form.email} onChange={set("email")} maxLength={200} required autoComplete="off" />
        </Field>
        <Field id="m-role" label="Rol" required hint="El editor trabaja pedidos. El administrador además cancela, reembolsa y maneja el equipo." error={error?.fields?.role}>
          <Select id="m-role" value={form.role} onChange={set("role")}>
            <option value="editor">Editor</option>
            <option value="admin">Administrador</option>
          </Select>
        </Field>
        <Field id="m-password" label="Contraseña inicial" required hint="Mínimo 10 caracteres." error={error?.fields?.password}>
          <div className="flex gap-2">
            <Input id="m-password" value={form.password} onChange={set("password")} minLength={10} maxLength={72} required autoComplete="new-password" className="font-mono" />
            <Button variant="secondary" onClick={() => setForm((f) => ({ ...f, password: randomPassword() }))} aria-label="Generar contraseña" title="Generar contraseña">
              <KeyRound size={16} />
            </Button>
          </div>
        </Field>
        <div className="flex items-center justify-between gap-3 sm:col-span-2">
          {error && !error.fields ? <p role="alert" className="text-sm text-coral">{error.message}</p> : <span />}
          <Button type="submit" disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Crear usuario
          </Button>
        </div>
      </form>
    </div>
  );
}
