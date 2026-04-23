"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("Failed to fetch dynamically imported module")
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          background: "#0A1628",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>
            Actualizando a la versión más reciente...
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.6rem 1.8rem",
              background: "linear-gradient(135deg, #0066FF, #00D4FF)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Recargar ahora
          </button>
        </div>
      </body>
    </html>
  );
}
