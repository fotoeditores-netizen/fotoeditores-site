import { getPublicEnv } from "@/lib/env/public";

// Enlace wa.me con el mensaje ya escrito. Funciona en servidor y navegador.
export function whatsappLink(message: string): string {
  const number = getPublicEnv().NEXT_PUBLIC_WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatUsd(amount: number | string): string {
  const value = Number(amount);
  return `USD ${Number.isInteger(value) ? value : value.toFixed(2)}`;
}

// Mensaje del CTA de un paquete mientras no exista el asistente de pedido (Fase 3).
export function packageWhatsappMessage(pkg: { name: string; price_usd: number | string | null }): string {
  return pkg.price_usd == null
    ? `Hola, quiero cotizar el servicio "${pkg.name}".`
    : `Hola, me interesa el paquete "${pkg.name}" (${formatUsd(pkg.price_usd)}). ¿Cómo empiezo?`;
}
