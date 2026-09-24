-- Buckets privados del funnel (docs/FUNNEL_PLAN.md §5.2 y §6).
--
-- public = false y sin políticas sobre storage.objects: ni anon ni authenticated
-- pueden listar, leer ni subir. El servidor emite URLs firmadas de corta
-- duración (createSignedUploadUrl / createSignedUrl) tras validar el pedido.
--
-- file_size_limit = null usa el límite global del proyecto (Project Settings →
-- Storage). En el plan Free el máximo es 50 MB por archivo; los límites por
-- paquete (packages.max_file_mb) se validan además en el servidor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'originals',
    'originals',
    false,
    null,
    array[
      'image/jpeg',
      'image/png',
      'image/heic',
      'image/heif',
      'image/webp',
      'image/tiff',
      'video/mp4',
      'video/quicktime'
    ]
  ),
  -- Entregas del editor: formatos libres (incluye ZIP, PSD, etc.).
  ('deliveries', 'deliveries', false, null, null)
on conflict (id) do update
  set public = excluded.public,
      allowed_mime_types = excluded.allowed_mime_types;
