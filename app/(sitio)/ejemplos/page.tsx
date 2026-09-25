import type { Metadata } from "next";
import EjemplosView, { type CaseCta } from "@/components/ejemplos/EjemplosView";
import { sideBySideCases, sliderCases } from "@/lib/ejemplos";
import { getActivePackages } from "@/lib/packages";
import { formatUsd, packageWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

// Regenera la página cada 5 minutos para reflejar cambios de precio en Supabase.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Antes y después: ejemplos reales de edición con IA",
  description:
    "Fotos de producto, retratos, eventos y videos transformados por editores humanos con 20 años de experiencia y las mejores herramientas de IA.",
  alternates: { canonical: "https://fotoeditores.com/ejemplos" },
};

export default async function EjemplosPage() {
  const packages = await getActivePackages();
  const bySlug = new Map(packages.map((p) => [p.slug, p]));

  const ctas: Record<string, CaseCta> = {};
  for (const item of [...sliderCases, ...sideBySideCases]) {
    const pkg = bySlug.get(item.packageSlug);
    if (!pkg) continue; // paquete desactivado: el caso se muestra sin CTA
    ctas[item.id] = {
      // Paquetes con precio van al asistente; los que se cotizan, a WhatsApp.
      href:
        pkg.price_usd == null
          ? whatsappLink(`${packageWhatsappMessage(pkg)} Vi el ejemplo "${item.title}".`)
          : `/pedido/nuevo?paquete=${pkg.slug}`,
      priceLabel: pkg.price_usd == null ? null : formatUsd(pkg.price_usd),
    };
  }

  return <EjemplosView ctas={ctas} />;
}
