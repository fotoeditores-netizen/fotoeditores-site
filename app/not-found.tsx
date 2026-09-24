import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-[70vh] flex items-center justify-center px-4 pt-28 pb-20 text-center"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1E3A 100%)" }}
      >
        <div>
          <p className="text-6xl font-extrabold mb-4 gradient-text" style={{ fontFamily: "var(--font-montserrat)" }}>
            404
          </p>
          <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
            Esta página no existe
          </h1>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Puede que el enlace esté mal escrito o que la página se haya movido.
          </p>
          <Link
            href="/"
            className="inline-flex px-7 py-3 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)", fontFamily: "var(--font-montserrat)" }}
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
