import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PorQueElegirnos from "@/components/PorQueElegirnos";
import Cotizador from "@/components/Cotizador";
import Trayectoria from "@/components/Trayectoria";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PorQueElegirnos />
        <Cotizador />
        <Trayectoria />
      </main>
      <Footer />
    </>
  );
}
