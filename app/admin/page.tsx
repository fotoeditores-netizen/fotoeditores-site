import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Clock, Search } from "lucide-react";
import { requireStaffPage } from "@/lib/admin/auth";
import { STATUS_LABEL, listOrders, metrics } from "@/lib/admin/service";
import { getAdminSupabase } from "@/lib/supabase/admin";
import { formatUsd } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Pedidos" };
export const dynamic = "force-dynamic";

const TABS = [
  { id: "activos", label: "Por trabajar" },
  { id: "awaiting_payment", label: "Pendientes de pago" },
  { id: "delivered", label: "Entregados" },
  { id: "todos", label: "Todos" },
];

const STATUS_COLOR: Record<string, string> = {
  awaiting_payment: "bg-gold/15 text-gold",
  payment_failed: "bg-coral/15 text-coral",
  paid: "bg-electric/20 text-cyan-digital",
  in_progress: "bg-electric/20 text-cyan-digital",
  revision_requested: "bg-coral/15 text-coral",
  delivered: "bg-emerald-400/15 text-emerald-300",
  closed: "bg-white/10 text-white/60",
  cancelled: "bg-white/10 text-white/40",
  refunded: "bg-white/10 text-white/40",
};

const dateFmt = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default async function AdminInboxPage({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string }> }) {
  await requireStaffPage();
  const { estado = "activos", q = "" } = await searchParams;
  const sb = getAdminSupabase();
  const [orders, stats] = await Promise.all([
    listOrders(sb, { status: estado === "todos" ? undefined : estado, q }),
    metrics(sb),
  ]);
  const maxWeek = Math.max(1, ...stats.revenueByWeek.map((w) => w.usd));
  const active = (stats.byStatus.paid ?? 0) + (stats.byStatus.in_progress ?? 0) + (stats.byStatus.revision_requested ?? 0);

  return (
    <div className="space-y-8">
      {/* Cifras */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Por trabajar", value: active },
          { label: "Pendientes de pago", value: (stats.byStatus.awaiting_payment ?? 0) + (stats.byStatus.payment_failed ?? 0) },
          { label: "Entregados", value: (stats.byStatus.delivered ?? 0) + (stats.byStatus.closed ?? 0) },
          {
            label: "Entrega promedio",
            value: stats.avgDeliveryHours == null ? "—" : stats.avgDeliveryHours < 48 ? `${Math.round(stats.avgDeliveryHours)} h` : `${(stats.avgDeliveryHours / 24).toFixed(1)} días`,
          },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-widest text-white/45" style={{ fontFamily: "var(--font-montserrat)" }}>
              {card.label}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-xs uppercase tracking-widest text-white/45" style={{ fontFamily: "var(--font-montserrat)" }}>
          Ingresos por semana (USD, últimas 8)
        </p>
        <div className="flex h-28 items-end gap-2">
          {stats.revenueByWeek.map((w) => (
            <div key={w.week} className="flex flex-1 flex-col items-center gap-1" title={`Semana del ${w.week}: ${formatUsd(w.usd)}`}>
              <span className="text-[10px] text-white/60">{w.usd ? Math.round(w.usd) : ""}</span>
              <div className="w-full rounded-t bg-gradient-energy" style={{ height: `${Math.max(2, (w.usd / maxWeek) * 80)}px` }} />
              <span className="text-[10px] text-white/40">{w.week.slice(5).replace("-", "/")}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filtros */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-2" aria-label="Filtrar pedidos">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              href={`/admin?estado=${tab.id}`}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${estado === tab.id ? "bg-electric/20 text-cyan-digital" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <form className="relative" action="/admin">
          <input type="hidden" name="estado" value="todos" />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Código, nombre o correo"
            className="w-full sm:w-64 rounded-lg border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-electric/70"
          />
        </form>
      </section>

      {/* Bandeja */}
      <section>
        {orders.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-white/50">No hay pedidos en esta vista.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/pedidos/${o.id}`}
                  className={`grid grid-cols-1 gap-2 rounded-xl border p-4 transition-colors hover:bg-white/[0.05] sm:grid-cols-[1.2fr_1fr_auto_auto] sm:items-center ${
                    o.due_state === "late" ? "border-coral/50 bg-coral/5" : o.due_state === "soon" ? "border-gold/40 bg-gold/5" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span>
                    <span className="font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {o.code}
                    </span>
                    <span className="ml-2 text-sm text-white/60">{o.customer_name ?? "—"}</span>
                    <span className="block text-xs text-white/45">
                      {o.package?.name} · {formatUsd(o.amount_usd)} · {o.files} archivo{o.files === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span className="text-xs text-white/55">
                    {o.due_at ? (
                      <span className="flex items-center gap-1">
                        {o.due_state === "late" ? <AlertTriangle size={13} className="text-coral" /> : <Clock size={13} />}
                        {o.due_state === "late" ? "Vencido: " : "Entregar: "}
                        {dateFmt.format(new Date(o.due_at))}
                      </span>
                    ) : (
                      <>Creado {dateFmt.format(new Date(o.created_at))}</>
                    )}
                  </span>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLOR[o.status] ?? "bg-white/10 text-white/60"}`}>
                    {STATUS_LABEL[o.status] ?? o.status}
                  </span>
                  <span className="hidden text-cyan-digital sm:inline">›</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
