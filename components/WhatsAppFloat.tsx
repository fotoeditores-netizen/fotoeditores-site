import WhatsAppIcon from "@/components/WhatsAppIcon";
import { whatsappLink } from "@/lib/whatsapp";

// Botón flotante para dudas antes de comprar. En las landings ocupa la esquina
// que en el resto del sitio usa el chat de IA (decisión 2 de la auditoría).
export default function WhatsAppFloat({ message }: { message: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-5 z-50 flex items-center gap-2 rounded-full bg-[#1FAF53] hover:bg-[#25D366] text-white shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all hover:scale-105 pl-4 pr-5 py-3.5"
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))", fontFamily: "var(--font-montserrat)" }}
    >
      <WhatsAppIcon size={24} />
      <span className="text-sm font-bold hidden sm:inline">¿Dudas? Escríbenos</span>
    </a>
  );
}
