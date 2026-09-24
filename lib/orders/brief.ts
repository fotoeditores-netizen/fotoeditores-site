import { z } from "zod";

/*
 * Brief guiado (Fase 3, paso 3). En vez de un cuadro de texto vacío, opciones
 * cortas según el segmento: la app traduce lo que el cliente quiere a lo que el
 * editor necesita, sin que el cliente tenga que saber de planos ni encuadres.
 */

export const GOALS = {
  producto: [
    { id: "fondo", label: "Quitar o cambiar el fondo" },
    { id: "luz-color", label: "Mejorar luz y color" },
    { id: "catalogo", label: "Que se vea de catálogo profesional" },
    { id: "escena", label: "Poner el producto en un ambiente o escena" },
    { id: "redes", label: "Variantes para redes sociales" },
    { id: "animar", label: "Darle movimiento (video)" },
  ],
  recuerdos: [
    { id: "nitidez", label: "Mejorar nitidez o enfoque" },
    { id: "color", label: "Recuperar o corregir el color" },
    { id: "danos", label: "Restaurar daños (rayones, manchas, roturas)" },
    { id: "encuadre", label: "Mejorar el encuadre" },
    { id: "reconstruir", label: "Reconstruir un momento con varias fotos" },
    { id: "animar", label: "Darle movimiento a la foto" },
  ],
} as const;

export const USAGES = [
  { id: "redes", label: "Redes sociales" },
  { id: "tienda", label: "Tienda en línea o catálogo" },
  { id: "impresion", label: "Impresión o cuadro" },
  { id: "album", label: "Álbum o regalo" },
  { id: "otro", label: "Otro" },
] as const;

export type BriefSegment = keyof typeof GOALS;

const allGoalIds = [...new Set(Object.values(GOALS).flatMap((list) => list.map((g) => g.id)))];

// Acepta "+57 300 123 4567", "300 123 4567", "573001234567"… y lo normaliza.
export function normalizeWhatsapp(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (/^3\d{9}$/.test(digits)) return `57${digits}`; // celular colombiano sin indicativo
  if (/^\d{10,15}$/.test(digits)) return digits;
  return null;
}

const trimmed = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres`);

export const briefSchema = z.object({
  goals: z
    .array(z.enum(allGoalIds as [string, ...string[]]))
    .min(1, "Elige al menos una opción")
    .max(allGoalIds.length),
  usage: z.enum(USAGES.map((u) => u.id) as [string, ...string[]], { error: "Elige para qué lo usarás" }),
  references: trimmed(1000).optional().default(""),
  notes: trimmed(2000).optional().default(""),
  // Enlace de Drive/WeTransfer para archivos que superan el límite de subida.
  externalLink: z
    .union([z.literal(""), z.url({ protocol: /^https$/, error: "Debe ser un enlace que empiece por https://" })])
    .optional()
    .default(""),
});

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre").max(100, "Máximo 100 caracteres"),
  email: z.email({ error: "Revisa tu correo" }).max(200),
  whatsapp: z
    .string()
    .transform((v, ctx) => {
      const normalized = normalizeWhatsapp(v);
      if (!normalized) {
        ctx.addIssue({ code: "custom", message: "Escribe tu WhatsApp con indicativo, por ejemplo +57 300 123 4567" });
        return z.NEVER;
      }
      return normalized;
    }),
});

export const submitSchema = z.object({
  brief: briefSchema,
  customer: customerSchema,
  consent: z.literal(true, { error: "Debes aceptar la política de tratamiento de datos" }),
});

export type Brief = z.infer<typeof briefSchema>;
export type SubmitInput = z.input<typeof submitSchema>;

// Errores de zod → { "customer.email": "Revisa tu correo", … } para mostrar junto a cada campo.
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    out[key] ??= issue.message;
  }
  return out;
}
