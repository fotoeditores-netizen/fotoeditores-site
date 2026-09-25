import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getStaff } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel Fotoeditores" },
  robots: { index: false, follow: false },
};

// Panel del equipo: sin menú público, chat ni popup (decisión 2).
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const staff = await getStaff();
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0A1628 0%, #0D1E3A 100%)" }}>
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Fotoeditores" width={120} height={40} className="h-9 w-auto" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-digital" style={{ fontFamily: "var(--font-montserrat)" }}>
              Panel
            </span>
          </Link>
          {staff && (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline text-white/60">
                {staff.name} · {staff.role === "admin" ? "Administrador" : "Editor"}
              </span>
              <form action="/api/admin/logout" method="post">
                <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-white/60 hover:bg-white/5 hover:text-white">
                  <LogOut size={15} /> Salir
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
