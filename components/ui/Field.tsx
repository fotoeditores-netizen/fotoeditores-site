import type { ComponentProps, ReactNode } from "react";

/*
 * Campos de formulario compartidos (decisión 4 de docs/AUDITORIA.md §9).
 * Mismo estilo que el Cotizador: fondo translúcido, borde sutil, foco azul.
 * Accesibles: label asociado, aria-invalid y mensaje de error enlazado.
 */

const control =
  "w-full rounded-[10px] border bg-white/5 px-3.5 py-3 text-[15px] text-white/90 placeholder:text-white/25 " +
  "outline-none transition-colors focus:border-electric/70 focus:bg-electric/5 disabled:opacity-50";

const borderFor = (error?: string) => (error ? "border-coral/70" : "border-white/15");

export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-1.5 text-[11px] font-bold uppercase tracking-widest text-white/55"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {label}
        {required && <span className="ml-1 text-cyan-digital">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-white/45">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

type WithError = { error?: string };

export function Input({ error, className = "", ...rest }: ComponentProps<"input"> & WithError) {
  return (
    <input
      className={`${control} ${borderFor(error)} ${className}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && rest.id ? `${rest.id}-error` : undefined}
      {...rest}
    />
  );
}

export function Textarea({ error, className = "", ...rest }: ComponentProps<"textarea"> & WithError) {
  return (
    <textarea
      className={`${control} ${borderFor(error)} min-h-[96px] resize-y ${className}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && rest.id ? `${rest.id}-error` : undefined}
      {...rest}
    />
  );
}

export function Select({ error, className = "", children, ...rest }: ComponentProps<"select"> & WithError) {
  return (
    <select
      className={`${control} ${borderFor(error)} bg-midnight cursor-pointer ${className}`}
      aria-invalid={error ? true : undefined}
      {...rest}
    >
      {children}
    </select>
  );
}

// Casilla o radio con aspecto de tarjeta seleccionable (como las del Cotizador).
export function ChoiceCard({
  type = "checkbox",
  label,
  description,
  className = "",
  ...rest
}: Omit<ComponentProps<"input">, "type"> & { type?: "checkbox" | "radio"; label: ReactNode; description?: ReactNode }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors
        hover:border-white/25 has-[:checked]:border-electric/60 has-[:checked]:bg-electric/10 has-[:focus-visible]:ring-2
        has-[:focus-visible]:ring-cyan-digital ${className}`}
    >
      <input type={type} className="mt-0.5 h-4 w-4 shrink-0 accent-[#0066FF]" {...rest} />
      <span>
        <span className="block text-sm font-semibold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
          {label}
        </span>
        {description && <span className="mt-0.5 block text-xs text-white/55">{description}</span>}
      </span>
    </label>
  );
}
