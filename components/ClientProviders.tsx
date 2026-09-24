"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CotizadorProvider, useCotizador } from "@/context/CotizadorContext";

// El Cotizador pesa (formulario grande + animaciones): se descarga la primera
// vez que alguien lo abre, no en cada página. Mejora la carga en celular.
const CotizadorModal = dynamic(() => import("@/components/CotizadorModal"), { ssr: false });

function LazyCotizadorModal() {
  const { isOpen } = useCotizador();
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (isOpen) setRequested(true);
  }, [isOpen]);
  return requested ? <CotizadorModal /> : null;
}

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CotizadorProvider>
      {children}
      <LazyCotizadorModal />
    </CotizadorProvider>
  );
}
