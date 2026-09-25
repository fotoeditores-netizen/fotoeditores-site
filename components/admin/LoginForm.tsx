"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

// Login del equipo con correo y contraseña (Supabase Auth). La sesión queda en cookies.
export default function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(notice ?? null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) {
      setError("Correo o contraseña incorrectos.");
      setBusy(false);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <p role="alert" className="rounded-lg border border-coral/40 bg-coral/10 p-3 text-sm text-white/90">
          {error}
        </p>
      )}
      <Field id="email" label="Correo">
        <Input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field id="password" label="Contraseña">
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
        Entrar
      </Button>
    </form>
  );
}
