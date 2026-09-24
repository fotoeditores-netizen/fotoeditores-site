import { describe, expect, it } from "vitest";
import { EnvError, parseServerEnv } from "@/lib/env/schema";

const base = {
  NEXT_PUBLIC_SUPABASE_URL: "https://abcdefghijklmnop.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key-secreta",
};

const wompiSandbox = {
  NEXT_PUBLIC_WOMPI_PUBLIC_KEY: "pub_test_abc",
  WOMPI_INTEGRITY_SECRET: "test_integrity_secreto",
  WOMPI_EVENTS_SECRET: "test_events_secreto",
  WOMPI_API_BASE: "https://sandbox.wompi.co/v1",
};

function issuesOf(source: Record<string, string | undefined>) {
  try {
    parseServerEnv(source);
  } catch (error) {
    if (error instanceof EnvError) return error.issues;
    throw error;
  }
  return [];
}

describe("parseServerEnv", () => {
  it("acepta la configuración mínima de la Fase 1 (solo Supabase)", () => {
    expect(() => parseServerEnv(base)).not.toThrow();
  });

  it("exige las tres variables de Supabase", () => {
    const vars = issuesOf({}).map((i) => i.variable);
    expect(vars).toEqual(
      expect.arrayContaining([
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
      ]),
    );
  });

  it("trata una variable vacía como faltante", () => {
    const vars = issuesOf({ ...base, SUPABASE_SERVICE_ROLE_KEY: "" }).map((i) => i.variable);
    expect(vars).toEqual(["SUPABASE_SERVICE_ROLE_KEY"]);
  });

  it("rechaza una URL de Supabase que no es del proyecto", () => {
    const vars = issuesOf({ ...base, NEXT_PUBLIC_SUPABASE_URL: "https://supabase.com/dashboard/project/x" }).map(
      (i) => i.variable,
    );
    expect(vars).toEqual(["NEXT_PUBLIC_SUPABASE_URL"]);
  });

  it("nunca incluye valores secretos en el mensaje de error", () => {
    try {
      parseServerEnv({ ...base, ...wompiSandbox, WOMPI_API_BASE: "https://production.wompi.co/v1" });
      expect.unreachable();
    } catch (error) {
      const message = (error as Error).message;
      expect(message).not.toContain("service-role-key-secreta");
      expect(message).not.toContain("test_integrity_secreto");
      expect(message).not.toContain("test_events_secreto");
    }
  });

  describe("Wompi", () => {
    it("acepta sandbox completo y coherente", () => {
      expect(() => parseServerEnv({ ...base, ...wompiSandbox })).not.toThrow();
    });

    it("acepta producción completa y coherente", () => {
      expect(() =>
        parseServerEnv({
          ...base,
          ...wompiSandbox,
          NEXT_PUBLIC_WOMPI_PUBLIC_KEY: "pub_prod_abc",
          WOMPI_API_BASE: "https://production.wompi.co/v1",
        }),
      ).not.toThrow();
    });

    it("rechaza llave de producción con la API de sandbox", () => {
      const issues = issuesOf({ ...base, ...wompiSandbox, NEXT_PUBLIC_WOMPI_PUBLIC_KEY: "pub_prod_abc" });
      expect(issues).toHaveLength(1);
      expect(issues[0].variable).toBe("WOMPI_API_BASE");
      expect(issues[0].message).toContain("producción");
    });

    it("rechaza llave de pruebas con la API de producción", () => {
      const issues = issuesOf({ ...base, ...wompiSandbox, WOMPI_API_BASE: "https://production.wompi.co/v1" });
      expect(issues.map((i) => i.variable)).toEqual(["WOMPI_API_BASE"]);
    });

    it("rechaza una configuración a medias y dice qué falta", () => {
      const vars = issuesOf({ ...base, NEXT_PUBLIC_WOMPI_PUBLIC_KEY: "pub_test_abc" }).map((i) => i.variable);
      expect(vars.sort()).toEqual(["WOMPI_API_BASE", "WOMPI_EVENTS_SECRET", "WOMPI_INTEGRITY_SECRET"]);
    });

    it("rechaza una llave pública con formato desconocido", () => {
      const vars = issuesOf({ ...base, ...wompiSandbox, NEXT_PUBLIC_WOMPI_PUBLIC_KEY: "prv_test_abc" }).map(
        (i) => i.variable,
      );
      expect(vars).toContain("NEXT_PUBLIC_WOMPI_PUBLIC_KEY");
    });
  });

  it("valida el número de WhatsApp en formato internacional", () => {
    expect(() => parseServerEnv({ ...base, NEXT_PUBLIC_WHATSAPP_NUMBER: "573001234567" })).not.toThrow();
    expect(issuesOf({ ...base, NEXT_PUBLIC_WHATSAPP_NUMBER: "+57 300 123 4567" }).map((i) => i.variable)).toEqual([
      "NEXT_PUBLIC_WHATSAPP_NUMBER",
    ]);
  });
});
