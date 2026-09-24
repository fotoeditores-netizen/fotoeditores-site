import { ChevronDown } from "lucide-react";

// Preguntas frecuentes con <details>: accesible y sin JavaScript.
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-xl px-5 py-4 open:bg-white/[0.04]"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <summary
            className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white [&::-webkit-details-marker]:hidden"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {item.q}
            <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" style={{ color: "#00D4FF" }} />
          </summary>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
