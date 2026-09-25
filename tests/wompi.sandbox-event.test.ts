/*
 * Evento REAL de Wompi Sandbox (pago aprobado del pedido FE-2609-0110, 25/09/2026),
 * con los datos personales quitados (no forman parte de la firma). Demuestra que
 * la validación del checksum coincide con lo que Wompi envía de verdad; el
 * ejemplo de la documentación tiene un hash incorrecto (ver tests/wompi.test.ts).
 * Necesita el secreto de eventos de Sandbox de .env.local; sin él se salta.
 */
import { describe, expect, it } from "vitest";
import event from "./fixtures/wompi-sandbox-event.json";
import { verifyEvent, type WompiEvent } from "@/lib/payments/wompi";

const SECRET = process.env.WOMPI_EVENTS_SECRET;
const isSandboxSecret = SECRET?.startsWith("test_events_");

describe.skipIf(!isSandboxSecret)("evento real de Wompi Sandbox", () => {
  it("la firma real de Wompi es válida con nuestro algoritmo", () => {
    expect(verifyEvent(event as WompiEvent, SECRET!)).toBe(true);
  });

  it("deja de ser válida si se altera cualquier dato firmado", () => {
    for (const field of ["id", "status", "amount_in_cents"] as const) {
      const copy = structuredClone(event) as WompiEvent;
      const tx = copy.data.transaction as unknown as Record<string, unknown>;
      tx[field] = field === "amount_in_cents" ? 1 : "alterado";
      expect(verifyEvent(copy, SECRET!), field).toBe(false);
    }
  });
});
