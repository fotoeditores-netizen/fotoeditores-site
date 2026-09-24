import { z } from "zod";

/*
 * Esquema de variables de entorno.
 *
 * Cada variable pasa a ser obligatoria en la fase del funnel que la empieza a
 * usar (ver docs/FUNNEL_PLAN.md). Las opcionales se validan igual cuando tienen
 * valor, para detectar errores de formato antes de que lleguen a producción.
 *
 * Este módulo no importa "server-only" para poder probarlo y usarlo desde
 * instrumentation.ts; el acceso desde la app va por lib/env/server.ts y
 * lib/env/public.ts.
 */

const WOMPI_API_BASES = {
  sandbox: "https://sandbox.wompi.co/v1",
  production: "https://production.wompi.co/v1",
} as const;

// "" en un .env equivale a no definir la variable.
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

const required = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema);

// zod 4: "error" personaliza también el caso de variable ausente (undefined).
const url = z.url({ error: (issue) => (issue.input === undefined ? "es obligatoria" : "debe ser una URL válida") });
const nonEmpty = z.string({ error: "es obligatoria" }).min(1, "es obligatoria");
const pattern = (re: RegExp, message: string) =>
  z.string({ error: "es obligatoria" }).regex(re, message);

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optional(url),
  NEXT_PUBLIC_SUPABASE_URL: required(
    url.regex(/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/, "debe tener la forma https://<proyecto>.supabase.co"),
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: required(nonEmpty),
  NEXT_PUBLIC_WOMPI_PUBLIC_KEY: optional(
    pattern(/^pub_(test|prod)_/, "debe empezar por pub_test_ o pub_prod_"),
  ),
  // Obligatoria desde la Fase 2: los CTA de las landings abren WhatsApp.
  NEXT_PUBLIC_WHATSAPP_NUMBER: required(
    pattern(/^\d{10,15}$/, "solo dígitos en formato internacional, sin + ni espacios (ej. 573001234567)"),
  ),
  NEXT_PUBLIC_GA_ID: optional(nonEmpty),
  NEXT_PUBLIC_META_PIXEL_ID: optional(nonEmpty),
  // Obligatorias desde la Fase 3: protegen la creación de pedidos contra bots.
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: required(nonEmpty),
});

export const serverEnvSchema = publicEnvSchema
  .extend({
    SUPABASE_SERVICE_ROLE_KEY: required(nonEmpty),
    WOMPI_INTEGRITY_SECRET: optional(nonEmpty),
    WOMPI_EVENTS_SECRET: optional(nonEmpty),
    WOMPI_API_BASE: optional(
      z.enum([WOMPI_API_BASES.sandbox, WOMPI_API_BASES.production], {
        message: `debe ser ${WOMPI_API_BASES.sandbox} o ${WOMPI_API_BASES.production}`,
      }),
    ),
    RESEND_API_KEY: optional(nonEmpty),
    EMAIL_FROM: optional(nonEmpty),
    N8N_WEBHOOK_BASE_URL: optional(url),
    N8N_WEBHOOK_SECRET: optional(nonEmpty),
    META_CAPI_TOKEN: optional(nonEmpty),
    TURNSTILE_SECRET_KEY: required(nonEmpty),
    // Vercel Cron la envía como "Authorization: Bearer <CRON_SECRET>" a /api/cron/*.
    CRON_SECRET: optional(z.string().min(16, "mínimo 16 caracteres")),
    // Existentes antes del funnel
    ANTHROPIC_API_KEY: optional(nonEmpty),
    ELEVENLABS_API_KEY: optional(nonEmpty),
    PAYMENT_URL: optional(url),
  })
  .superRefine((env, ctx) => {
    const wompi = {
      NEXT_PUBLIC_WOMPI_PUBLIC_KEY: env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY,
      WOMPI_INTEGRITY_SECRET: env.WOMPI_INTEGRITY_SECRET,
      WOMPI_EVENTS_SECRET: env.WOMPI_EVENTS_SECRET,
      WOMPI_API_BASE: env.WOMPI_API_BASE,
    };
    const defined = Object.values(wompi).filter(Boolean).length;

    // Wompi va completo o no va: una configuración a medias cobra sin poder confirmar.
    if (defined > 0 && defined < 4) {
      for (const [key, value] of Object.entries(wompi)) {
        if (!value) {
          ctx.addIssue({ code: "custom", path: [key], message: "falta: las 4 variables de Wompi van juntas" });
        }
      }
      return;
    }

    // Llave de pruebas con API de producción (o al revés) = pagos que nunca se confirman.
    if (defined === 4) {
      const keyIsTest = env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY!.startsWith("pub_test_");
      const expectedBase = keyIsTest ? WOMPI_API_BASES.sandbox : WOMPI_API_BASES.production;
      if (env.WOMPI_API_BASE !== expectedBase) {
        ctx.addIssue({
          code: "custom",
          path: ["WOMPI_API_BASE"],
          message: keyIsTest
            ? `la llave pública es de pruebas (pub_test_), así que debe ser ${WOMPI_API_BASES.sandbox}`
            : `la llave pública es de producción (pub_prod_), así que debe ser ${WOMPI_API_BASES.production}. Si estás en pruebas, cambia las 3 llaves por las de Sandbox`,
        });
      }
    }
  });

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export class EnvError extends Error {
  constructor(public readonly issues: { variable: string; message: string }[]) {
    super(
      "Variables de entorno inválidas o faltantes:\n" +
        issues.map((i) => `  - ${i.variable}: ${i.message}`).join("\n") +
        "\nRevisa .env.local (en local) o Project → Settings → Environment Variables (en Vercel). Plantilla: .env.example",
    );
    this.name = "EnvError";
  }
}

// Nunca incluye valores en el mensaje: solo nombres de variables y el problema.
function parseOrThrow<T extends z.ZodType>(schema: T, source: Record<string, string | undefined>): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new EnvError(
      result.error.issues.map((issue) => ({
        variable: String(issue.path[0] ?? "(general)"),
        message: issue.message,
      })),
    );
  }
  return result.data;
}

export const parsePublicEnv = (source: Record<string, string | undefined>): PublicEnv =>
  parseOrThrow(publicEnvSchema, source);

export const parseServerEnv = (source: Record<string, string | undefined>): ServerEnv =>
  parseOrThrow(serverEnvSchema, source);
