import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

// Landings de anuncios: sin chat de IA ni popup (distraen del CTA); en su lugar,
// WhatsApp para dudas antes de comprar.
export default function LandingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat message="Hola, vi su página y tengo una pregunta antes de hacer mi pedido." />
    </>
  );
}
