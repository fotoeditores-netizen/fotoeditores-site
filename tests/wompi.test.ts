import { describe, expect, it } from "vitest";
import { checkoutUrl, eventChecksum, integritySignature, verifyEvent, type WompiEvent } from "@/lib/payments/wompi";

// Ejemplos oficiales de la documentación de Wompi (secretos de ejemplo, no reales).
describe("firma de integridad (ejemplo oficial de Wompi)", () => {
  it("reproduce el hash de la documentación", () => {
    expect(
      integritySignature({
        reference: "sk8-438k4-xmxm392-sn2m",
        amountInCents: 2490000,
        currency: "COP",
        integritySecret: "prod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6",
      }),
    ).toBe("37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5");
  });

  it("cambia si cambia el monto: el navegador no puede alterar lo cobrado", () => {
    const base = { reference: "FE-2609-0001-1", currency: "COP" as const, integritySecret: "test_integrity_x" };
    expect(integritySignature({ ...base, amountInCents: 23610000 })).not.toBe(
      integritySignature({ ...base, amountInCents: 100 }),
    );
  });
});

const officialEvent = (): WompiEvent => ({
  event: "transaction.updated",
  data: {
    transaction: {
      id: "1234-1610641025-49201",
      status: "APPROVED",
      amount_in_cents: 4490000,
      reference: "MZQ3X2DE2SMX",
      currency: "COP",
    },
  },
  environment: "prod",
  signature: {
    properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
    // La documentación publica 3476DDA5…, pero ese valor NO es el SHA256 de la cadena que
    // ella misma muestra ("1234-1610641025-49201APPROVED44900001530291411prod_events_…"),
    // que da 5A18EC5E…: el ejemplo tiene un error. Se valida el algoritmo documentado; la
    // prueba con un evento real de Sandbox está en tests/wompi.sandbox-event.test.ts.
    checksum: "5A18EC5E8FDB7DF463E9F94774CBA8F583BA21BD04A09CEFF2EA68A4BC0AEFBE",
  },
  timestamp: 1530291411,
});
const SECRET = "prod_events_OcHnIzeBl5socpwByQ4hA52Em3USQ93Z";

describe("checksum de eventos (algoritmo de la documentación de Wompi)", () => {
  it("concatena propiedades en orden + timestamp + secreto y aplica SHA256", async () => {
    const { createHash } = await import("node:crypto");
    const documented = "1234-1610641025-49201" + "APPROVED" + "4490000" + "1530291411" + SECRET;
    expect(eventChecksum(officialEvent(), SECRET)).toBe(createHash("sha256").update(documented).digest("hex"));
    expect(eventChecksum(officialEvent(), SECRET)?.toUpperCase()).toBe(
      "5A18EC5E8FDB7DF463E9F94774CBA8F583BA21BD04A09CEFF2EA68A4BC0AEFBE",
    );
    expect(verifyEvent(officialEvent(), SECRET)).toBe(true);
  });

  it("acepta el encabezado X-Event-Checksum si coincide y lo rechaza si no", () => {
    const e = officialEvent();
    expect(verifyEvent(e, SECRET, e.signature!.checksum!.toLowerCase())).toBe(true);
    expect(verifyEvent(e, SECRET, "0".repeat(64))).toBe(false);
  });

  it("rechaza un evento con el secreto equivocado", () => {
    expect(verifyEvent(officialEvent(), "otro_secreto")).toBe(false);
  });

  it("rechaza un evento alterado (monto o estado cambiados)", () => {
    const monto = officialEvent();
    monto.data.transaction!.amount_in_cents = 100;
    expect(verifyEvent(monto, SECRET)).toBe(false);

    const estado = officialEvent();
    estado.data.transaction!.status = "DECLINED";
    expect(verifyEvent(estado, SECRET)).toBe(false);
  });

  it("rechaza eventos sin firma, sin timestamp o con propiedades inexistentes", () => {
    expect(verifyEvent({ ...officialEvent(), signature: undefined }, SECRET)).toBe(false);
    expect(verifyEvent({ ...officialEvent(), timestamp: undefined }, SECRET)).toBe(false);
    const raro = officialEvent();
    raro.signature!.properties = ["transaction.no_existe"];
    expect(verifyEvent(raro, SECRET)).toBe(false);
  });
});

describe("checkoutUrl", () => {
  it("arma la URL del Web Checkout con los nombres exactos de Wompi", () => {
    const url = new URL(
      checkoutUrl({
        publicKey: "pub_test_abc",
        reference: "FE-2609-0001-1",
        amountInCents: 19700000,
        signature: "abc123",
        redirectUrl: "https://fotoeditores.com/pedido/TOKEN/gracias",
        customer: { email: "ana@example.com", fullName: "Ana Pérez", phone: "573001234567" },
      }),
    );
    expect(url.origin + url.pathname).toBe("https://checkout.wompi.co/p/");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      "public-key": "pub_test_abc",
      currency: "COP",
      "amount-in-cents": "19700000",
      reference: "FE-2609-0001-1",
      "signature:integrity": "abc123",
      "redirect-url": "https://fotoeditores.com/pedido/TOKEN/gracias",
      "customer-data:email": "ana@example.com",
      "customer-data:full-name": "Ana Pérez",
      "customer-data:phone-number-prefix": "+57",
      "customer-data:phone-number": "3001234567",
    });
  });

  it("no envía el teléfono si no es colombiano (Wompi pide indicativo aparte)", () => {
    const url = new URL(
      checkoutUrl({
        publicKey: "pub_test_abc",
        reference: "R",
        amountInCents: 1,
        signature: "s",
        redirectUrl: "https://x.co",
        customer: { phone: "13055550100" },
      }),
    );
    expect(url.searchParams.has("customer-data:phone-number")).toBe(false);
  });
});
