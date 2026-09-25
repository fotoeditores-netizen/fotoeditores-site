import { describe, expect, it } from "vitest";
import { fieldErrors, normalizeWhatsapp, submitSchema } from "@/lib/orders/brief";

const valid = {
  brief: { goals: ["nitidez"], usage: "album", references: "", notes: "Es la boda de mis papás", externalLink: "" },
  customer: { name: "Ana Pérez", email: "ana@example.com", whatsapp: "+57 300 123 4567" },
  consent: true,
};

describe("normalizeWhatsapp", () => {
  it.each([
    ["+57 300 123 4567", "573001234567"],
    ["300 123 4567", "573001234567"],
    ["573001234567", "573001234567"],
    ["+1 (305) 555-0100", "13055550100"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeWhatsapp(input)).toBe(expected);
  });

  it.each(["123", "abc", ""])("rechaza %s", (input) => {
    expect(normalizeWhatsapp(input)).toBeNull();
  });
});

describe("submitSchema", () => {
  it("acepta un pedido completo y normaliza el WhatsApp", () => {
    const result = submitSchema.parse(valid);
    expect(result.customer.whatsapp).toBe("573001234567");
  });

  it("exige consentimiento", () => {
    const result = submitSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) expect(fieldErrors(result.error).consent).toContain("tratamiento de datos");
  });

  it("exige al menos un objetivo y un uso válidos", () => {
    const result = submitSchema.safeParse({ ...valid, brief: { ...valid.brief, goals: [], usage: "hackear" } });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors["brief.goals"]).toBeDefined();
      expect(errors["brief.usage"]).toBeDefined();
    }
  });

  it("rechaza objetivos inventados", () => {
    expect(submitSchema.safeParse({ ...valid, brief: { ...valid.brief, goals: ["<script>"] } }).success).toBe(false);
  });

  it("solo acepta enlaces https para archivos pesados", () => {
    const ok = { ...valid, brief: { ...valid.brief, externalLink: "https://drive.google.com/drive/folders/abc" } };
    expect(submitSchema.safeParse(ok).success).toBe(true);
    for (const link of ["http://inseguro.com/a", "javascript:alert(1)", "no es un enlace"]) {
      expect(submitSchema.safeParse({ ...valid, brief: { ...valid.brief, externalLink: link } }).success).toBe(false);
    }
  });

  it("limita la longitud de los textos libres", () => {
    const long = { ...valid, brief: { ...valid.brief, notes: "x".repeat(2001) } };
    expect(submitSchema.safeParse(long).success).toBe(false);
  });

  it("valida nombre y correo", () => {
    const result = submitSchema.safeParse({ ...valid, customer: { ...valid.customer, name: "A", email: "no-es-correo" } });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(errors["customer.name"]).toBeDefined();
      expect(errors["customer.email"]).toBeDefined();
    }
  });
});
