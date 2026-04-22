import type { Metadata } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadMagnetPopup from "@/components/LeadMagnetPopup";
import ChatWidget from "@/components/ChatWidget";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fotoeditores.com"),
  title: {
    default: "Fotoeditores | Gestores de IA para Contenidos — 20 Años",
    template: "%s | Fotoeditores",
  },
  description:
    "Fotoeditores: 20 años de experiencia editorial + las mejores herramientas de IA. Reducimos tus costos hasta un 55% y multiplicamos tu volumen de contenido ×3.5. Colombia.",
  keywords: [
    "gestión de IA para contenidos",
    "producción audiovisual IA",
    "Midjourney Colombia",
    "agencia IA Colombia",
    "edición de fotos con IA",
    "videos con inteligencia artificial",
    "fotoeditores",
    "producción de contenido empresarial",
  ],
  authors: [{ name: "Fotoeditores", url: "https://fotoeditores.com" }],
  creator: "Fotoeditores",
  publisher: "Fotoeditores",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://fotoeditores.com",
    siteName: "Fotoeditores",
    title: "Fotoeditores | Gestores de IA para Contenidos",
    description:
      "20 años de criterio editorial + la IA más avanzada del mercado. Multiplica tu contenido, reduce tus costos.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fotoeditores — 20 años gestionando el futuro del contenido",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fotoeditores | Gestores de IA para Contenidos",
    description:
      "20 años de criterio editorial + la IA más avanzada. -55% costos, +350% volumen de contenido.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="antialiased"
        style={{ background: "#0A1628", color: "#FFFFFF" }}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <LeadMagnetPopup />
        <ChatWidget />
      </body>
    </html>
  );
}
