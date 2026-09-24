"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Video en bucle que solo se descarga y reproduce cuando está en pantalla.
 * Con autoPlay normal, cada video de la página se descarga al abrirla, aunque
 * esté muy abajo; en móvil eso arruina el tiempo de carga. El póster también
 * se asigna al acercarse: el navegador lo descarga aunque preload="none".
 */
export default function LazyVideo({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          video.play().catch(() => {
            // El navegador bloqueó la reproducción automática: queda el póster y los controles.
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={near ? poster : undefined}
      preload="none"
      muted
      loop
      playsInline
      controls
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
