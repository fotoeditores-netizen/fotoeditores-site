import type { Segment } from "@/lib/ejemplos";

/*
 * Textos de las landings del funnel. Borrador basado en la sección 11 de
 * docs/FUNNEL_PLAN.md: el copy final lo aprueba Edgar.
 *
 * Regla: no prometer reembolsos, plazos ni resultados que no estén definidos
 * en la política de ajustes (docs/AUDITORIA.md §9, decisión 8).
 */

export type LandingContent = {
  segment: Segment;
  path: string;
  seo: { title: string; description: string };
  hero: { badge: string; title: string; subtitle: string; caseId: string };
  pains: { title: string; items: string[] };
  promise: string;
  whatsappMessage: string;
};

export const landings: Record<Segment, LandingContent> = {
  producto: {
    segment: "producto",
    path: "/fotos-de-producto-con-ia",
    seo: {
      title: "Fotos de producto con IA y editores profesionales",
      description:
        "Imágenes y video de producto con nivel de catálogo, sin montar una producción. Editores humanos con 20 años de experiencia potenciados con IA. Precios en USD.",
    },
    hero: {
      badge: "Para emprendedores con producto",
      title: "Tu producto compite con las marcas grandes. Que se vea como una de ellas.",
      subtitle:
        "Somos editores de foto y video con 20 años de experiencia, potenciados con las mejores herramientas de inteligencia artificial. Tú nos envías las fotos de tu producto; un editor humano te devuelve imágenes que venden.",
      caseId: "frasco",
    },
    pains: {
      title: "¿Te suena familiar?",
      items: [
        "No tienes presupuesto para un estudio fotográfico.",
        "Tus fotos de celular no transmiten lo que vale tu producto.",
        "Probaste herramientas de IA y cada resultado sale distinto, raro o inservible.",
      ],
    },
    promise: "Imágenes y video de producto de nivel profesional, sin montar una producción.",
    whatsappMessage: "Hola, vi la página de fotos de producto y tengo una pregunta.",
  },
  recuerdos: {
    segment: "recuerdos",
    path: "/recupera-tus-fotos",
    seo: {
      title: "Recupera y restaura tus fotos: bodas, eventos y álbumes",
      description:
        "Fotos desenfocadas, dañadas o tomadas con celular convertidas en recuerdos dignos del momento. Editores humanos con 20 años de experiencia potenciados con IA.",
    },
    hero: {
      badge: "Bodas · Eventos · Álbum familiar",
      title: "Tus recuerdos no están perdidos. Solo necesitan a un editor de verdad.",
      subtitle:
        "Somos editores de foto y video con 20 años de experiencia, potenciados con las mejores herramientas de inteligencia artificial. Tú nos envías tus fotos; un editor humano las recupera con el cuidado que merecen.",
      caseId: "nina",
    },
    pains: {
      title: "Lo que nos cuentan todos los días",
      items: [
        "Las fotos de la boda salieron desenfocadas o mal encuadradas.",
        "El fotógrafo perdió el material y solo quedan fotos de celular.",
        "El álbum familiar se está borrando con los años.",
        "Lo intentaste con una app de IA y el resultado no se parecía a nadie.",
      ],
    },
    promise: "Recuperamos tus fotos y las convertimos en una producción digna del momento.",
    whatsappMessage: "Hola, vi la página para recuperar fotos y tengo una pregunta.",
  },
};

// Bloque "Por qué la IA sola no te funcionó" (compartido).
export const whyAiAlone = {
  title: "La IA es fácil y gratis… hasta que intentas usarla",
  reasons: [
    {
      title: "Tiene curva de aprendizaje",
      text: "Cada herramienta es distinta y cambia cada mes. Aprenderlas cuesta semanas.",
    },
    {
      title: "No es gratis",
      text: "Suscripciones, créditos y horas de prueba y error que nadie te devuelve.",
    },
    {
      title: "Sin criterio de imagen no hay buenas instrucciones",
      text: "Plano, encuadre e iluminación deciden el resultado. Si no sabes pedirlos, la IA adivina.",
    },
  ],
  difference: "La diferencia: un editor con 20 años de oficio le dice a la IA exactamente qué hacer.",
};

export const howItWorks = [
  { title: "Sube tus fotos o videos", text: "Desde el celular o el computador. También la idea, si quieres crear algo desde cero." },
  { title: "Cuéntanos qué necesitas", text: "Te guiamos con preguntas simples. No necesitas saber de fotografía." },
  { title: "Un editor humano lo trabaja", text: "Te lo entrega listo para usar. Hablas con él por WhatsApp durante todo el proceso." },
];

export const faqs = [
  {
    q: "¿Qué pasa si no me gusta el resultado?",
    a: "Cada paquete incluye ajustes: nos dices qué cambiar y tu editor lo corrige. Si con tu material no es posible lograr lo que buscas, te lo decimos antes de empezar.",
  },
  {
    q: "¿Es seguro mi material?",
    a: "Tus archivos se guardan en almacenamiento privado y solo el equipo que trabaja tu pedido tiene acceso. No usamos tus imágenes en nuestro portafolio sin tu autorización.",
  },
  {
    q: "¿Cuánto se demora?",
    a: "Cada paquete muestra su tiempo de entrega. Empieza a contar cuando recibimos tus archivos y se confirma el pago.",
  },
  {
    q: "¿Usan inteligencia artificial?",
    a: "Sí, y de las mejores del mercado. Pero la IA sola no basta: un editor humano decide qué pedirle, revisa cada resultado y corrige lo que la máquina no ve.",
  },
  {
    q: "¿Puedo hablar con alguien antes de pagar?",
    a: "Claro. Escríbenos por WhatsApp y te responde una persona del equipo, no un bot.",
  },
  {
    q: "¿Qué formatos aceptan?",
    a: "Fotos en JPG, PNG, HEIC (iPhone), WEBP y TIFF; videos en MP4 y MOV. Si tus archivos son muy pesados, puedes compartirlos por un enlace de Google Drive o WeTransfer.",
  },
];
