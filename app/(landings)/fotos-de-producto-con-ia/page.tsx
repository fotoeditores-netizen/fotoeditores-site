import { landingMetadata, renderLanding } from "@/lib/landing-page";

export const revalidate = 300;
export const metadata = landingMetadata("producto");

export default function FotosDeProductoPage() {
  return renderLanding("producto");
}
