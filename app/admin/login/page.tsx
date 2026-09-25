import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getStaff } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Entrar al panel", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  // Solo rutas internas del panel: evita redirecciones abiertas a otros sitios.
  const target = typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  if (await getStaff()) redirect(target);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-extrabold text-white mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
        Panel del equipo
      </h1>
      <p className="text-sm text-white/55 mb-8">Entra con el usuario que te asignaron.</p>
      <LoginForm
        next={target}
        notice={error === "sin-acceso" ? "Tu usuario no tiene acceso al panel. Pide a un administrador que te asigne el rol." : undefined}
      />
    </div>
  );
}
