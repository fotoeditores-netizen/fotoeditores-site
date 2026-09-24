import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

// Pedido: sin menú, chat ni popup (decisión 2): nada que distraiga de terminarlo.
export default function PedidoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0A1628 0%, #0D1E3A 100%)" }}>
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" aria-label="Fotoeditores, ir al inicio">
            <Image src="/logo.png" alt="Fotoeditores" width={160} height={52} className="h-12 w-auto" priority />
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-white/50">
            <Lock size={13} /> Pedido seguro
          </span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">{children}</main>
    </div>
  );
}
