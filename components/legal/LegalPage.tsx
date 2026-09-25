import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { LEGAL } from "@/lib/legal";

// Marco común de /privacidad y /terminos: encabezado, aviso de borrador e índice.
export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: ReactNode;
  sections: { id: string; title: string; body: ReactNode }[];
}) {
  return (
    <div className="pt-28 pb-20" style={{ background: "#0A1628" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {!LEGAL.reviewed && (
          <p
            role="note"
            className="mb-8 flex gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-white/85"
          >
            <AlertTriangle size={18} className="shrink-0 text-gold" />
            Documento en revisión: este texto es un borrador preparado para cumplir la normativa colombiana y está
            pendiente de revisión jurídica. Los datos resaltados se completarán antes de su versión definitiva.
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
          {title}
        </h1>
        <p className="text-sm text-white/50 mb-8">Vigente desde el {LEGAL.effectiveDate}</p>
        <div className="prose-fotoeditores !max-w-none mb-10">{intro}</div>

        <nav aria-label="Contenido" className="mb-12 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-white/45 mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
            Contenido
          </p>
          <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-white/70 hover:text-cyan-digital">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="prose-fotoeditores !max-w-none">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2>
                {i + 1}. {s.title}
              </h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dato pendiente de completar: se ve resaltado para que nadie lo pase por alto.
export function Pending({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-gold/20 px-1 text-gold" title="Dato pendiente de completar">
      [pendiente: {children}]
    </mark>
  );
}

export function Value({ value, pending }: { value: string | number | null; pending: string }) {
  return value == null ? <Pending>{pending}</Pending> : <strong>{value}</strong>;
}
