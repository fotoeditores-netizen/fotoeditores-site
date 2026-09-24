import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/*
 * Botón compartido del sitio (decisión 4 de docs/AUDITORIA.md §9).
 * Reúne los estilos de CTA que antes se copiaban en cada página:
 *   primary   → gradiente azul-cian con brillo (CTA principal)
 *   secondary → borde blanco translúcido (CTA secundario)
 *   whatsapp  → verde WhatsApp
 * Sin estado ni hooks: sirve en componentes de servidor y de cliente.
 */

type Variant = "primary" | "secondary" | "whatsapp";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-digital focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-midnight disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-energy shadow-[0_0_28px_rgba(0,102,255,0.45)] " +
    "hover:shadow-[0_0_40px_rgba(0,102,255,0.75),0_6px_24px_rgba(0,0,0,0.35)] hover:scale-[1.03]",
  secondary: "text-white/85 border border-white/15 hover:bg-white/10 hover:border-white/30 hover:text-white",
  whatsapp: "text-white bg-[#1FAF53] hover:bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:scale-[1.03]",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

const fontStyle = { fontFamily: "var(--font-montserrat)" };

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

// Enlace con aspecto de botón. Los externos (http…) abren en otra pestaña.
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"a">, "className">) {
  const classes = buttonClasses({ variant, size, className });
  if (href?.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} style={fontStyle} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href ?? "/"} className={classes} style={fontStyle} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className">) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} style={fontStyle} {...rest}>
      {children}
    </button>
  );
}
