/*
 * Datos del responsable para /privacidad y /terminos.
 *
 * ⚠️ Los valores null se muestran resaltados como "pendiente" en las páginas.
 * Edgar debe completarlos y un abogado revisar los textos; cuando eso ocurra,
 * reviewed = true quita el aviso de borrador.
 */
export const LEGAL = {
  reviewed: false,
  companyName: null as string | null, // razón social exacta (p. ej. "Fotoeditores S.A.S.")
  taxId: null as string | null, // NIT con dígito de verificación
  city: "Medellín, Colombia",
  address: null as string | null, // dirección física de notificación
  dataEmail: "editorgeneral@fotoeditores.com", // canal para consultas y reclamos de datos
  phoneDigits: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  // Días que se conservan originales y entregas después de entregar el pedido.
  fileRetentionDays: null as number | null, // propuesta del plan: entre 30 y 90
  draftRetentionDays: 7, // borradores sin enviar (tarea programada /api/cron/expire-drafts)
  adjustmentWindowDays: null as number | null, // días para pedir ajustes después de la entrega
  deliveryDaysType: null as "días calendario" | "días hábiles" | null, // cómo se cuentan los plazos de entrega
  effectiveDate: "24 de septiembre de 2026",
};

export function formatPhone(digits: string | null): string | null {
  if (!digits) return null;
  return digits.startsWith("57") && digits.length === 12
    ? `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    : `+${digits}`;
}
