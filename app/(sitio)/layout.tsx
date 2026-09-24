import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import ChatWidget from "@/components/ChatWidget";

// Páginas institucionales: se conservan el chat de IA y el popup de la guía gratuita.
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <LeadMagnetPopup />
      <ChatWidget />
    </>
  );
}
