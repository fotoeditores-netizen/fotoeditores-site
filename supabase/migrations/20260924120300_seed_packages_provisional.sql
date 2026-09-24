-- Paquetes de la sección 9 de docs/FUNNEL_PLAN.md.
--
-- ⚠️ PROVISIONALES: precios (USD), tiempos y límites son de ejemplo para poder
-- construir y probar. Edgar define los valores reales en la Fase 2 y se cargan
-- con una migración nueva (no editar esta).
--
-- max_file_mb = 50 porque es el máximo por archivo del plan Free de Supabase.
-- on conflict do nothing: no pisa cambios hechos después en la base.

insert into public.packages
  (slug, segment, name, description, price_usd, max_files, max_file_mb, accepts_video,
   turnaround_hours, revisions_included, sort_order)
values
  ('rescate-1-foto', 'recuerdos', 'Rescate de 1 foto',
   'Restauración y mejora de una foto: nitidez, color, daños y encuadre.',
   9.00, 1, 50, false, 48, 1, 10),

  ('rescate-pack-10', 'recuerdos', 'Rescate de 10 fotos',
   '10 fotos con el mismo tratamiento. Ideal para un álbum o parte de una boda.',
   59.00, 10, 50, false, 72, 1, 20),

  ('evento-recuperado', 'recuerdos', 'Evento recuperado',
   'Reconstrucción de un evento completo a partir de tus fotos de celular.',
   149.00, 60, 50, false, 120, 2, 30),

  ('producto-pack-5', 'producto', 'Producto: 5 imágenes',
   '5 imágenes de producto con nivel de catálogo.',
   39.00, 5, 50, false, 72, 1, 40),

  ('producto-pack-15', 'producto', 'Producto: 15 imágenes',
   '15 imágenes de producto más variantes para redes sociales.',
   99.00, 15, 50, false, 120, 2, 50),

  ('video-corto', 'ambos', 'Video corto',
   'Animamos una foto o mejoramos un video de hasta 30 segundos.',
   29.00, 1, 50, true, 72, 1, 60),

  -- Sin precio: no se cobra en línea; lleva a WhatsApp para cotizar.
  ('a-la-medida', 'ambos', 'A la medida',
   'Creamos desde cero a partir de tu idea. Te cotizamos por WhatsApp.',
   null, 10, 50, true, 168, 0, 70)
on conflict (slug) do nothing;
