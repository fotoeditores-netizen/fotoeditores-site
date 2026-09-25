"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Field";
import { api, ApiError } from "@/lib/orders/client";

// El cliente pide un ajuste de su entrega (descuenta de los incluidos en el paquete).
export default function RevisionForm({ token, remaining, deadline }: { token: string; remaining: number; deadline: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(`/api/orders/${token}/revision`, { method: "POST", json: { comment } });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos enviar tu solicitud.");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className="text-center">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <RotateCcw size={16} /> Solicitar un ajuste
        </Button>
        <p className="mt-2 text-xs text-white/45">
          Te {remaining === 1 ? "queda 1 ajuste" : `quedan ${remaining} ajustes`} · puedes pedirlo hasta el {deadline}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="space-y-3 text-left">
      <Field id="comment" label="¿Qué quieres cambiar?" hint="Sé específico: qué foto y qué cambio (más brillo, otro fondo, recorte…)." error={error ?? undefined}>
        <Textarea id="comment" rows={4} maxLength={2000} required value={comment} onChange={(e) => setComment(e.target.value)} error={error ?? undefined} />
      </Field>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
          Cancelar
        </Button>
        <Button type="submit" disabled={busy || comment.trim().length < 5}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          Enviar solicitud
        </Button>
      </div>
    </form>
  );
}
