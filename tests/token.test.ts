import { describe, expect, it } from "vitest";
import { isValidOrderCode, isValidPublicToken } from "@/lib/orders/token";

describe("isValidPublicToken", () => {
  it("acepta 32 caracteres base64url", () => {
    expect(isValidPublicToken("aB3_-xYz0123456789ABCDEFGHIJKLMN")).toBe(true);
  });

  it.each([
    ["corto", "abc"],
    ["largo", "a".repeat(33)],
    ["con caracteres base64 no url-safe", "a".repeat(31) + "+"],
    ["con relleno", "a".repeat(31) + "="],
    ["con intento de inyección", "' or 1=1 --aaaaaaaaaaaaaaaaaaaaa"],
    ["vacío", ""],
  ])("rechaza un token %s", (_, token) => {
    expect(isValidPublicToken(token)).toBe(false);
  });

  it("rechaza valores que no son texto", () => {
    expect(isValidPublicToken(undefined)).toBe(false);
    expect(isValidPublicToken(12345)).toBe(false);
  });
});

describe("isValidOrderCode", () => {
  it("acepta FE-AAMM-NNNN y consecutivos de más de 4 dígitos", () => {
    expect(isValidOrderCode("FE-2609-0042")).toBe(true);
    expect(isValidOrderCode("FE-2609-10000")).toBe(true);
  });

  it("rechaza otros formatos", () => {
    expect(isValidOrderCode("FE-26-0042")).toBe(false);
    expect(isValidOrderCode("fe-2609-0042")).toBe(false);
    expect(isValidOrderCode("FE-2609-042")).toBe(false);
  });
});
