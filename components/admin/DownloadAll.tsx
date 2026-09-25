"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

/*
 * Descarga todos los originales uno por uno. No se arma un ZIP en el servidor:
 * con decenas de archivos de hasta 50 MB superaría el tiempo máximo de una
 * función de Vercel. El navegador puede pedir permiso para descargas múltiples.
 */
export default function DownloadAll({ urls }: { urls: string[] }) {
  const [busy, setBusy] = useState(false);

  async function downloadAll() {
    setBusy(true);
    for (const url of urls) {
      const a = document.createElement("a");
      a.href = url;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      await new Promise((r) => setTimeout(r, 900));
    }
    setBusy(false);
  }

  if (urls.length < 2) return null;
  return (
    <Button variant="secondary" onClick={downloadAll} disabled={busy}>
      {busy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      Descargar todos ({urls.length})
    </Button>
  );
}
