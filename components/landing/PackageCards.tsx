import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { turnaroundLabel, type Package } from "@/lib/packages";
import { formatUsd, packageWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

/*
 * Tarjetas de paquetes leídas de la tabla packages.
 * Mientras no exista el asistente de pedido (Fase 3), el CTA abre WhatsApp con
 * el paquete ya escrito. En la Fase 3: href → /pedido/nuevo?paquete=<slug>.
 */
export default function PackageCards({ packages }: { packages: Package[] }) {
  // El más barato con precio se destaca como puerta de entrada.
  const entry = packages.filter((p) => p.price_usd != null).sort((a, b) => a.price_usd! - b.price_usd!)[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {packages.map((pkg) => {
        const highlighted = pkg.id === entry?.id;
        const features = [
          pkg.max_files > 0 && (pkg.max_files === 1 ? "1 archivo" : `Hasta ${pkg.max_files} archivos`),
          pkg.accepts_video && "Acepta video",
          pkg.price_usd != null && `Entrega en ${turnaroundLabel(pkg.turnaround_hours)}`,
          pkg.revisions_included > 0 &&
            (pkg.revisions_included === 1 ? "1 ronda de ajustes" : `${pkg.revisions_included} rondas de ajustes`),
          "Hablas directo con tu editor",
        ].filter(Boolean) as string[];

        return (
          <div
            key={pkg.id}
            className="relative rounded-2xl p-6 flex flex-col"
            style={{
              background: highlighted ? "rgba(0,102,255,0.10)" : "rgba(255,255,255,0.025)",
              border: highlighted ? "1px solid rgba(0,212,255,0.45)" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: highlighted ? "0 0 40px rgba(0,102,255,0.18)" : "none",
            }}
          >
            {highlighted && (
              <span
                className="absolute -top-3 left-6 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: "#FFB800", color: "#0A1628", fontFamily: "var(--font-montserrat)" }}
              >
                Para empezar
              </span>
            )}
            <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "var(--font-montserrat)" }}>
              {pkg.name}
            </h3>
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
              {pkg.description}
            </p>

            <p className="mb-5" style={{ fontFamily: "var(--font-montserrat)" }}>
              {pkg.price_usd == null ? (
                <span className="text-2xl font-extrabold text-white">A cotizar</span>
              ) : (
                <>
                  <span className="text-4xl font-extrabold gradient-text">{formatUsd(pkg.price_usd)}</span>
                  <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                    pago único
                  </span>
                </>
              )}
            </p>

            <ul className="space-y-2 mb-6 flex-1">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: "#00D4FF" }} />
                  {f}
                </li>
              ))}
            </ul>

            <ButtonLink
              href={whatsappLink(packageWhatsappMessage(pkg))}
              variant={highlighted ? "primary" : "secondary"}
              className="w-full"
            >
              <WhatsAppIcon size={16} />
              {pkg.price_usd == null ? "Cotizar por WhatsApp" : "Empieza tu pedido"}
            </ButtonLink>
          </div>
        );
      })}
    </div>
  );
}
