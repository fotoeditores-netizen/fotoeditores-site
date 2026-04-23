"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CotizadorContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CotizadorContext = createContext<CotizadorContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function CotizadorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CotizadorContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </CotizadorContext.Provider>
  );
}

export const useCotizador = () => useContext(CotizadorContext);
