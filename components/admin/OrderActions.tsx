"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api, ApiError } from "@/lib/orders/client";

const ACTION_LABEL: Record<string, string> = {
  paid: "Marcar como pagado",
  in_progress: "Empezar a editar",
  closed: "Cerrar pedido",
  cancelled: "Cancelar pedido",
  refunded: "Marcar reembolsado",
};

const CONFIRM: Record<string, string> = {
  paid: "¿Confirmas que el cliente ya pagó? Úsalo solo si el pago se hizo por fuera de la página.",
  cancelled: "¿Cancelar este pedido? El cliente verá el pedido como cancelado.",
  refunded: "¿Marcar como reembolsado? Hazlo después de devolver el dinero desde Wompi.",
};

// Botones de estado del pedido (solo los permitidos) y la acción Entregar.
export default function OrderActions({
  orderId,
  transitions,
  canDeliver,
  deliveries,
  status,
}: {
  status: string;
  orderId: string;
  transitions: string[];
  canDeliver: boolean;
  deliveries: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(key: string, url: string, json?: unknown) {
    if (CONFIRM[key] && !window.confirm(CONFIRM[key])) return;
    setBusy(key);
    setError(null);
    try {
      await api(url, { method: "POST", json: json ?? {} });
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No se pudo completar la acción.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      {canDeliver && (
        <Button
          size="lg"
          className="w-full"
          disabled={busy !== null || deliveries === 0}
          onClick={() => run("deliver", `/api/admin/orders/${orderId}/deliver`)}
        >
          {busy === "deliver" ? <Loader2 size={18} className="animate-spin" /> : <PackageCheck size={18} />}
          Entregar al cliente
        </Button>
      )}
      {canDeliver && deliveries === 0 && <p className="text-xs text-white/50">Sube los archivos finales para poder entregar.</p>}

      <div className="flex flex-wrap gap-2">
        {transitions.map((to) => (
          <Button
            key={to}
            variant="secondary"
            disabled={busy !== null}
            onClick={() => run(to, `/api/admin/orders/${orderId}/status`, { to })}
            className={to === "cancelled" || to === "refunded" ? "!text-coral" : ""}
          >
            {busy === to && <Loader2 size={16} className="animate-spin" />}
            {to === "in_progress" && status === "revision_requested" ? "Empezar el ajuste" : to === "in_progress" && status === "delivered" ? "Reabrir para editar" : (ACTION_LABEL[to] ?? to)}
          </Button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
