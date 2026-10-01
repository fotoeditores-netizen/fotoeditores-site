import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import MemberRow from "@/components/admin/MemberRow";
import NewMemberForm from "@/components/admin/NewMemberForm";
import { requireStaffPage } from "@/lib/admin/auth";
import { listTeam } from "@/lib/admin/team";
import { getAdminSupabase } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Equipo" };
export const dynamic = "force-dynamic";

// Equipo del panel: solo administradores crean y editan editores y administradores.
export default async function TeamPage() {
  const staff = await requireStaffPage();
  if (staff.role !== "admin") redirect("/admin");
  const team = await listTeam(getAdminSupabase());

  return (
    <div className="space-y-8">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-white/55 hover:text-white">
        <ArrowLeft size={15} /> Pedidos
      </Link>

      <header>
        <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
          Equipo
        </h1>
        <p className="text-sm text-white/60">
          Quién puede entrar al panel. A nadie se le borra: si le quitas el acceso, su historial en los pedidos se conserva.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-4 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
          Agregar a alguien
        </h2>
        <NewMemberForm />
      </section>

      <section>
        <h2 className="mb-3 font-bold text-white" style={{ fontFamily: "var(--font-montserrat)" }}>
          Miembros ({team.filter((m) => !m.disabled).length} con acceso)
        </h2>
        <ul className="space-y-3">
          {team.map((m) => (
            <MemberRow key={m.id} member={m} isSelf={m.id === staff.id} />
          ))}
        </ul>
      </section>
    </div>
  );
}
