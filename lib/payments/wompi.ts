import { createHash, timingSafeEqual } from "node:crypto";

/*
 * Integración con Wompi (docs/FUNNEL_PLAN.md §5.3). Funciones puras: sin red ni
 * base de datos, para probarlas con los ejemplos oficiales de la documentación.
 *   Web Checkout: https://docs.wompi.co/en/docs/colombia/widget-checkout-web/
 *   Eventos:      https://docs.wompi.co/en/docs/colombia/eventos/
 */

export const WOMPI_CHECKOUT_URL = "https://checkout.wompi.co/p/";

export const FINAL_STATUSES = ["APPROVED", "DECLINED", "VOIDED", "ERROR"] as const;
export type WompiStatus = "PENDING" | (typeof FINAL_STATUSES)[number];

const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

// Firma de integridad: SHA256(referencia + monto en centavos + moneda [+ expiración] + secreto).
export function integritySignature(input: {
  reference: string;
  amountInCents: number;
  currency: "COP";
  integritySecret: string;
  expirationTime?: string;
}): string {
  return sha256(
    `${input.reference}${input.amountInCents}${input.currency}${input.expirationTime ?? ""}${input.integritySecret}`,
  );
}

export function checkoutUrl(params: {
  publicKey: string;
  reference: string;
  amountInCents: number;
  signature: string;
  redirectUrl: string;
  customer?: { email?: string | null; fullName?: string | null; phone?: string | null };
}): string {
  const url = new URL(WOMPI_CHECKOUT_URL);
  url.searchParams.set("public-key", params.publicKey);
  url.searchParams.set("currency", "COP");
  url.searchParams.set("amount-in-cents", String(params.amountInCents));
  url.searchParams.set("reference", params.reference);
  url.searchParams.set("signature:integrity", params.signature);
  url.searchParams.set("redirect-url", params.redirectUrl);
  const c = params.customer;
  if (c?.email) url.searchParams.set("customer-data:email", c.email);
  if (c?.fullName) url.searchParams.set("customer-data:full-name", c.fullName);
  // Wompi separa indicativo y número; guardamos el WhatsApp como 57XXXXXXXXXX.
  if (c?.phone && /^57\d{10}$/.test(c.phone)) {
    url.searchParams.set("customer-data:phone-number-prefix", "+57");
    url.searchParams.set("customer-data:phone-number", c.phone.slice(2));
  }
  return url.toString();
}

export type WompiTransaction = {
  id: string;
  reference: string;
  status: WompiStatus;
  amount_in_cents: number;
  currency: string;
  payment_method_type?: string;
};

export type WompiEvent = {
  event: string;
  data: { transaction?: WompiTransaction } & Record<string, unknown>;
  environment?: string;
  signature?: { properties?: string[]; checksum?: string };
  timestamp?: number;
  sent_at?: string;
};

// Lee "transaction.amount_in_cents" dentro de event.data.
function readPath(data: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => (node && typeof node === "object" ? (node as Record<string, unknown>)[key] : undefined), data);
}

/*
 * Checksum del evento: SHA256(valores de signature.properties en orden +
 * timestamp + secreto de eventos). Se compara en tiempo constante con el
 * checksum del cuerpo y, si viene, con el encabezado X-Event-Checksum.
 */
export function eventChecksum(event: WompiEvent, eventsSecret: string): string | null {
  const properties = event.signature?.properties;
  if (!Array.isArray(properties) || properties.length === 0 || typeof event.timestamp !== "number") return null;
  const values: string[] = [];
  for (const property of properties) {
    const value = readPath(event.data, property);
    if (value === undefined || value === null || typeof value === "object") return null;
    values.push(String(value));
  }
  return sha256(`${values.join("")}${event.timestamp}${eventsSecret}`);
}

function sameHex(a: string, b: string): boolean {
  const x = Buffer.from(a.toLowerCase(), "utf8");
  const y = Buffer.from(b.toLowerCase(), "utf8");
  return x.length === y.length && timingSafeEqual(x, y);
}

export function verifyEvent(event: WompiEvent, eventsSecret: string, headerChecksum?: string | null): boolean {
  const expected = eventChecksum(event, eventsSecret);
  const sent = event.signature?.checksum;
  if (!expected || typeof sent !== "string" || !sameHex(expected, sent)) return false;
  return headerChecksum ? sameHex(expected, headerChecksum) : true;
}
