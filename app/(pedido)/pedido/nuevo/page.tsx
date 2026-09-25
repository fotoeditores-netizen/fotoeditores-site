import type { Metadata } from "next";
import OrderWizard, { type WizardPackage } from "@/components/pedido/OrderWizard";
import { getPublicEnv } from "@/lib/env/public";
import { getActivePackages, turnaroundLabel } from "@/lib/packages";
import { getWompiConfig } from "@/lib/payments/config";
import { getUsdCopRate } from "@/lib/payments/fx";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Haz tu pedido",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function NuevoPedidoPage({ searchParams }: { searchParams: Promise<{ paquete?: string }> }) {
  const wompi = getWompiConfig();
  const [{ paquete }, all, quote] = await Promise.all([
    searchParams,
    getActivePackages(),
    wompi ? getUsdCopRate() : Promise.resolve(null),
  ]);

  // Solo los paquetes que se compran en línea (con precio).
  const packages: WizardPackage[] = all
    .filter((p) => p.price_usd != null)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      price_usd: p.price_usd!,
      max_files: p.max_files,
      max_file_mb: 50,
      accepts_video: p.accepts_video,
      turnaround_label: turnaroundLabel(p.turnaround_hours),
      revisions_included: p.revisions_included,
      segment: p.segment,
    }));

  return (
    <>
      <h1 className="sr-only">Haz tu pedido</h1>
      <OrderWizard
        packages={packages}
        initialSlug={typeof paquete === "string" ? paquete : null}
        turnstileSiteKey={getPublicEnv().NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        quoteWhatsappHref={whatsappLink("Hola, quiero cotizar un trabajo a la medida.")}
        helpWhatsappHref={whatsappLink("Hola, estoy haciendo un pedido en la página y tengo una duda.")}
        paymentsEnabled={wompi !== null}
        fxRate={quote?.rate ?? null}
      />
    </>
  );
}
