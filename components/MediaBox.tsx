import Image from "next/image";
import LazyVideo from "@/components/LazyVideo";
import type { MediaSide } from "@/lib/ejemplos";

// Una mitad (antes o después) de un caso lado a lado, en formato 9:16.
// Antes vivía dentro de app/(sitio)/ejemplos/page.tsx.
export default function MediaBox({ media, label, isAfter }: { media: MediaSide; label: string; isAfter: boolean }) {
  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingBottom: "177.78%" }}>
        <div className="absolute inset-0 bg-[#050D1A]">
          {media.kind === "video" ? (
            <LazyVideo src={media.src} poster={media.poster} label={label} className="w-full h-full object-cover" />
          ) : (
            <Image src={media.src} alt={label} fill className="object-cover" sizes="(max-width: 768px) 50vw, 320px" />
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-center">
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={
            isAfter
              ? { background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00D4FF", fontFamily: "var(--font-montserrat)" }
              : { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-montserrat)" }
          }
        >
          {isAfter ? "DESPUÉS" : "ANTES"}
        </span>
      </div>
    </div>
  );
}
