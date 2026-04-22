import Hero from "@/components/Hero";
import EditorsTeaser from "@/components/EditorsTeaser";
import ROICalculator from "@/components/ROICalculator";
import PainPoints from "@/components/PainPoints";
import SolutionSection from "@/components/SolutionSection";
import ServicesSection from "@/components/ServicesSection";
import SocialProof from "@/components/SocialProof";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fotoeditores | Gestores de IA para Contenidos — 20 Años de Experiencia",
  description:
    "Somos la solución humana a la IA. 20 años de criterio editorial + las mejores herramientas de IA. -55% costos, +350% volumen, -70% tiempo. Colombia.",
  alternates: { canonical: "https://fotoeditores.com" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <EditorsTeaser />
      <PainPoints />
      <SolutionSection />
      <ServicesSection />
      <ROICalculator />
      <SocialProof />
      <LeadMagnetSection />
    </>
  );
}
