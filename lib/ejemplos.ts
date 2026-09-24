/*
 * Casos antes/después. Fuente única para /ejemplos y las landings del funnel.
 *
 * segment: en qué landing aparece el caso.
 * packageSlug: paquete que se ofrece con "Quiero algo así" (packages.slug).
 * Videos: se sirven las versiones comprimidas de /antes_despues/web (720 px,
 * ~1–2 MB); los originales pesados siguen en /antes_despues.
 */

export type Segment = "producto" | "recuerdos";
export type MediaKind = "image" | "video";

type CaseBase = {
  id: string;
  category: string;
  title: string;
  tool: string;
  color: string;
  segment: Segment;
  packageSlug: string;
};

// Foto → foto, con divisor arrastrable.
export type SliderCase = CaseBase & { beforeSrc: string; afterSrc: string };

// Foto o video → video, lado a lado.
export type MediaSide = { src: string; kind: MediaKind; poster?: string };
export type SideBySideCase = CaseBase & { before: MediaSide; after: MediaSide };

const img = (file: string): MediaSide => ({ src: `/antes_despues/${file}`, kind: "image" });
const vid = (name: string): MediaSide => ({
  src: `/antes_despues/web/${name}.mp4`,
  kind: "video",
  poster: `/antes_despues/web/${name}.jpg`,
});

export const sliderCases: SliderCase[] = [
  {
    id: "frasco",
    category: "Fotografía de Producto",
    title: "Del archivo crudo a la vitrina digital",
    tool: "Photoshop IA · Magnific",
    color: "#00D4FF",
    segment: "producto",
    packageSlug: "producto-pack-5",
    beforeSrc: "/antes_despues/frasco_antes.jpeg",
    afterSrc: "/antes_despues/frasco_despues.png",
  },
  {
    id: "metro",
    category: "Fotografía Urbana",
    title: "Cada imagen cuenta una historia",
    tool: "Lightroom IA · Corrección de Color",
    color: "#0066FF",
    segment: "recuerdos",
    packageSlug: "rescate-1-foto",
    beforeSrc: "/antes_despues/metro_antes.jpg",
    afterSrc: "/antes_despues/metros_despues.png",
  },
  {
    id: "tren",
    category: "Fotografía Urbana",
    title: "La ciudad en su mejor luz",
    tool: "Lightroom IA · Upscaling",
    color: "#FFB800",
    segment: "recuerdos",
    packageSlug: "rescate-1-foto",
    beforeSrc: "/antes_despues/tren_antes_v2.png",
    afterSrc: "/antes_despues/tren_despues_v2.png",
  },
  {
    id: "nina",
    category: "Retoque & Fotografía de Retrato",
    title: "La imagen que habla por sí sola",
    tool: "Photoshop IA · Magnific · Retoque",
    color: "#00D4FF",
    segment: "recuerdos",
    packageSlug: "rescate-1-foto",
    beforeSrc: "/antes_despues/nina_antes.jpg",
    afterSrc: "/antes_despues/nina_despues.png",
  },
];

export const sideBySideCases: SideBySideCase[] = [
  {
    id: "alfajores",
    category: "Fotografía Gastronómica",
    title: "Del plano estático al contenido que vende",
    tool: "Runway · Video Generativo IA",
    color: "#FFB800",
    segment: "producto",
    packageSlug: "video-corto",
    before: img("alfajores_antes.png"),
    after: vid("alfajores_despues"),
  },
  {
    id: "pareja",
    category: "Retrato & Moda",
    title: "La emoción que conecta con tu audiencia",
    tool: "HeyGen · Producción Audiovisual IA",
    color: "#00D4FF",
    segment: "recuerdos",
    packageSlug: "video-corto",
    before: img("pareja_antes.jpeg"),
    after: vid("pareja_despues"),
  },
  {
    id: "analogico",
    category: "Transformación de Video",
    title: "Moderniza tu archivo audiovisual",
    tool: "Topaz IA · Restauración y Upscaling",
    color: "#0066FF",
    segment: "recuerdos",
    packageSlug: "video-corto",
    before: vid("analogico_antes"),
    after: vid("analogico_despues"),
  },
  {
    id: "frasco-video",
    category: "Producto en Movimiento",
    title: "Tu producto cobra vida con la IA",
    tool: "Runway · Video Generativo",
    color: "#00D4FF",
    segment: "producto",
    packageSlug: "video-corto",
    before: img("frasco_antes_video.png"),
    after: vid("frasco_despues_video"),
  },
  {
    id: "moda",
    category: "Moda & Lifestyle",
    title: "La marca que se mueve y conquista",
    tool: "HeyGen · Video IA",
    color: "#FFB800",
    segment: "producto",
    packageSlug: "video-corto",
    before: img("moda_antes.png"),
    after: vid("moda_despues"),
  },
  {
    id: "pastel",
    category: "Repostería & Gastronomía",
    title: "Del plato al contenido de impacto",
    tool: "Runway · Animación IA",
    color: "#0066FF",
    segment: "producto",
    packageSlug: "video-corto",
    before: img("pastel_antes.jpeg"),
    after: vid("pastel_despues"),
  },
  {
    id: "comunion",
    category: "Fotografía de Eventos",
    title: "El recuerdo que merece ser eterno",
    tool: "Runway · Video Generativo IA",
    color: "#FFB800",
    segment: "recuerdos",
    packageSlug: "video-corto",
    before: img("comunion_antes.png"),
    after: vid("comunion_despues"),
  },
];
