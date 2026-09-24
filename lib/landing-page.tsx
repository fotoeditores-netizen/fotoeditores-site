import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";
import type { Segment } from "@/lib/ejemplos";
import { landings } from "@/lib/landings";
import { getActivePackages, packagesForSegment } from "@/lib/packages";

const SITE = "https://fotoeditores.com";

// Metadatos y página de una landing de segmento. Las rutas solo eligen el segmento.
export function landingMetadata(segment: Segment): Metadata {
  const { seo, path } = landings[segment];
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: { title: seo.title, description: seo.description, url: `${SITE}${path}`, type: "website", locale: "es_CO" },
  };
}

export async function renderLanding(segment: Segment) {
  const content = landings[segment];
  const packages = packagesForSegment(await getActivePackages(), segment);

  // Datos estructurados de servicio (schema.org) para buscadores.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.seo.title,
    description: content.seo.description,
    url: `${SITE}${content.path}`,
    areaServed: "CO",
    provider: { "@type": "Organization", name: "Fotoeditores", url: SITE },
    offers: packages
      .filter((p) => p.price_usd != null)
      .map((p) => ({ "@type": "Offer", name: p.name, price: p.price_usd, priceCurrency: "USD" })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify no escapa "<": se reemplaza para que un texto nunca pueda cerrar el <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LandingPage content={content} packages={packages} />
    </>
  );
}
