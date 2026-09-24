import type { ReactNode } from "react";

// Encabezado de sección con el patrón del home: pastilla de color + h2 + bajada.
export default function SectionHeading({
  badge,
  color = "#00D4FF",
  title,
  subtitle,
}: {
  badge: string;
  color?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="text-center mb-12">
      <div
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border mb-5"
        style={{ color, borderColor: `${color}4D`, background: `${color}0F`, fontFamily: "var(--font-montserrat)" }}
      >
        {badge}
      </div>
      <h2
        className="text-3xl sm:text-4xl font-extrabold text-white mb-4 text-balance"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
