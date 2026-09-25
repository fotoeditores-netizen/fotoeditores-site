"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/orders/client";

// Pide al servidor un intento de pago y lleva al cliente al Web Checkout de Wompi.
export default function PayButton({ token, label = "Pagar ahora" }: { token: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const { url } = await api<{ url: string }>(`/api/orders/${token}/checkout`, { method: "POST" });
      window.location.assign(url);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No pudimos iniciar el pago. Intenta de nuevo.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button size="lg" onClick={pay} disabled={busy} className="w-full sm:w-auto">
        {busy ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
        {busy ? "Abriendo el pago seguro…" : label}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-coral text-center">
          {error}
        </p>
      )}
      <p className="text-xs text-white/45">Tarjeta, PSE, Nequi o Bancolombia · pago procesado por Wompi</p>
    </div>
  );
}
