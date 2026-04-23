"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCotizador } from "@/context/CotizadorContext";
import Cotizador from "@/components/Cotizador";

export default function CotizadorModal() {
  const { isOpen, close } = useCotizador();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(5, 10, 20, 0.88)", backdropFilter: "blur(10px)" }}
          />

          {/* Scroll container */}
          <div className="fixed inset-0 z-[61] overflow-y-auto py-8 px-4 flex items-start justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-2xl"
              style={{
                background: "rgba(10, 22, 40, 0.98)",
                border: "1px solid rgba(0,102,255,0.18)",
                borderRadius: "20px",
                boxShadow:
                  "0 0 80px rgba(0,102,255,0.12), 0 40px 80px rgba(0,0,0,0.65)",
              }}
            >
              {/* Grid background — matches site style */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[20px] overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,102,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl transition-all duration-150 hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.4)" }}
                aria-label="Cerrar cotizador"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="relative p-6 sm:p-8 pt-8">
                <Cotizador />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
