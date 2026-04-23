"use client";

import { ReactNode } from "react";
import { CotizadorProvider } from "@/context/CotizadorContext";
import CotizadorModal from "@/components/CotizadorModal";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CotizadorProvider>
      {children}
      <CotizadorModal />
    </CotizadorProvider>
  );
}
