/*
 * Datos del responsable para /privacidad y /terminos.
 *
 * ⚠️ Los valores null se muestran resaltados como "pendiente" en las páginas.
 * Edgar debe completarlos y un abogado revisar los textos; cuando eso ocurra,
 * reviewed = true quita el aviso de borrador.
 */
export const LEGAL = {
  reviewed: false,
  companyName: "Inversiones Fotoeditores" as string | null, // razón social
  taxId: "900.482.551-9" as string | null, // NIT con dígito de verificación
  city: "Medellín, Colombia",
  address: "Calle 32B # 81-45, Nueva Villa de Aburrá, Belén, Medellín" as string | null, // dirección de notificación
  dataEmail: "editorgeneral@fotoeditores.com", // canal para consultas y reclamos de datos
  phoneDigits: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  // Días que se conservan originales y entregas después de entregar el pedido.
  fileRetentionDays: 90 as number | null,
  draftRetentionDays: 7, // borradores sin enviar (tarea programada /api/cron/expire-drafts)
  adjustmentWindowDays: 3 as number | null, // días para pedir ajustes después de la entrega
  deliveryDaysType: null as "días calendario" | "días hábiles" | null, // cómo se cuentan los plazos de entrega
  effectiveDate: "24 de septiembre de 2026",
};

export function formatPhone(digits: string | null): string | null {
  if (!digits) return null;
  return digits.startsWith("57") && digits.length === 12
    ? `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    : `+${digits}`;
}
