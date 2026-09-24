import { landingMetadata, renderLanding } from "@/lib/landing-page";

export const revalidate = 300;
export const metadata = landingMetadata("recuerdos");

export default function RecuperaTusFotosPage() {
  return renderLanding("recuerdos");
}
