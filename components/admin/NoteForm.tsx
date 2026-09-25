"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { api, ApiError } from "@/lib/orders/client";

// Nota interna del equipo: queda en la bitácora, el cliente no la ve.
export default function NoteForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await api(`/api/admin/orders/${orderId}/notes`, { method: "POST", json: { text } });
      setText("");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar la nota.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-2">
      <label htmlFor="nota" className="sr-only">
        Nota interna
      </label>
      <Textarea id="nota" rows={3} maxLength={2000} placeholder="Nota interna (el cliente no la ve)" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex items-center justify-between gap-2">
        {error ? <p className="text-xs text-coral">{error}</p> : <span />}
        <Button type="submit" variant="secondary" disabled={busy || !text.trim()}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          Guardar nota
        </Button>
      </div>
    </form>
  );
}
