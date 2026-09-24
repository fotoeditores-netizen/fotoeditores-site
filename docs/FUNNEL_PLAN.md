# Funnel de ventas "Gestores de IA" — Esquema de trabajo para Claude Code

Proyecto: fotoeditores.com · Servicio: edición y producción de imagen con editores humanos potenciados con IA
Estado: listo para ejecutar por fases · Fecha del documento: 21 de septiembre de 2026

---

## 0. Cómo usar este documento

1. Guarda este archivo en la raíz del repositorio de fotoeditores.com como `docs/FUNNEL_PLAN.md`.
2. Abre el repositorio en VS Code con Claude Code y escribe: `Lee docs/FUNNEL_PLAN.md completo. Empieza por la Fase 0 y no pases a la siguiente hasta que se cumplan sus criterios de aceptación y yo lo confirme.`
3. Trabaja **una fase por sesión**. Al terminar cada una, haz commit en una rama (`funnel/fase-N`) y revisa el preview de Vercel antes de fusionar a `main`.
4. Cada fase incluye: objetivo, tareas, un prompt sugerido, criterios de aceptación y una sección **"Lo que hace Edgar"** con lo que Claude Code no puede hacer por ti (crear cuentas, pegar llaves, decidir precios).

Reglas permanentes para Claude Code (cópialas también en `CLAUDE.md`):

- Antes de escribir código, inspecciona el repositorio y **reutiliza** lo que ya existe (sistema de diseño, componentes, el divisor antes/después de `/ejemplos`, el Cotizador Web, layout, tipografías, colores). No inventes una identidad visual nueva.
- Ningún secreto en el código ni en el repositorio. Todo va en variables de entorno (`.env.local` en local, Environment Variables en Vercel). Deja un `.env.example` sin valores reales.
- Toda lógica de dinero y de acceso a archivos ocurre **en el servidor** (Route Handlers / Server Actions). El navegador nunca ve la llave de servicio de Supabase ni el secreto de integridad de Wompi.
- Commits pequeños y frecuentes, con mensajes claros. Tests para todo lo que toque pagos y permisos.
- Si algo del plan choca con lo que encuentres en el repositorio, **detente y pregunta** en vez de improvisar.

---

## 1. Contexto de marca (lo que el funnel debe comunicar)

**Postulado central:** *"La IA es fácil y gratis… hasta que intentas usarla."*

La secuencia de persuasión, que debe sentirse igual en todas las piezas (anuncio, landing, correo, WhatsApp):

1. **Reconocimiento del dolor.** Intentaste usar IA para tus fotos o videos y no te salió como esperabas. No es tu culpa: la IA no es tan fácil ni tan gratis. Tiene curva de aprendizaje, cuesta dinero (suscripciones, créditos) y, sobre todo, exige criterio de imagen: saber qué es un plano, un encuadre, una iluminación, para poder darle instrucciones que produzcan resultados profesionales.
2. **Solución.** Somos gestores de inteligencia artificial: editores y productores de foto y video **totalmente humanos**, con **20 años de experiencia**, potenciados con las mejores herramientas de IA.
3. **Prueba.** Los resultados de la página `/ejemplos` (antes/después reales).
4. **Acción mínima.** Solo envíanos tus fotos o videos (o la idea que quieres crear desde cero) y dinos qué necesitas. Nosotros hacemos el resto y hablas con un editor de verdad.

**Públicos prioritarios** (cada uno tendrá su landing y su conjunto de anuncios):

| Segmento | Dolor | Promesa |
|---|---|---|
| Emprendedores con producto | No tienen presupuesto para una gran producción; su producto se ve amateur frente a la competencia | Imágenes y video de producto con nivel profesional, sin producción de estudio |
| Recuperación de recuerdos (bodas, eventos, álbum familiar) | Fotógrafo deficiente (desenfocadas, mal encuadradas), material perdido, álbum deteriorado, solo quedan fotos de celular | Recuperamos y reconstruimos tus recuerdos con calidad de gran producción |
| Empresas e instituciones | Memoria gráfica de la empresa dispersa o deteriorada | Archivo restaurado y unificado |

> Recomendación de arranque: lanzar con **dos** landings (Emprendedores/producto y Recuperación de recuerdos) que comparten el mismo flujo de pedido. Empresas puede seguir por `/contacto` y cotización humana en esta primera etapa.

---

## 2. Diagnóstico de `/ejemplos` (punto de partida)

Lo que ya funciona: 11 casos antes/después con divisor arrastrable ("Ver para creer"), variedad (producto, retrato, urbana, video gastronómico, moda, restauración de video, eventos), herramientas visibles (Photoshop IA, Magnific, Runway, HeyGen, Topaz), sitio construido en Next.js, mensaje de equipo humano por WhatsApp en el home, paquetes desde 99 USD/mes y un Cotizador Web.

Lo que frena la conversión hoy y que el funnel debe resolver:

- Los CTA ("Hablar con un experto", "Quiero estos resultados") llevan a `/contacto`, un formulario genérico: el visitante no puede actuar sobre **sus** archivos en el momento de mayor interés.
- No hay precios visibles en `/ejemplos`, ni prueba social (testimonios, número de clientes), ni preguntas frecuentes, ni WhatsApp visible en esa página.
- Los 11 ejemplos son casi todos comerciales. **Faltan 3 a 5 casos de rescate emocional** (boda desenfocada, foto de celular reconstruida, foto antigua restaurada, álbum familiar). Sin ellos la landing de recuerdos no convence.
- La oferta principal del home es B2B recurrente (paquetes mensuales). El funnel es un **servicio puntual comprable por proyecto**: debe funcionar como puerta de entrada y ofrecer, después de la entrega, el paso a un paquete mensual.

Nota: este diagnóstico se hizo sobre el texto y el HTML de la página, no sobre su render visual. Claude Code debe extraer colores, tipografías y componentes reales del repositorio.

---

## 3. Decisiones ya tomadas

| Tema | Decisión |
|---|---|
| Pasarela de pago | **Wompi** (Colombia). Web Checkout con redirección. En la documentación revisada la moneda soportada es COP |
| Modelo de precio | **Paquetes fijos por servicio**, el cliente paga en el momento |
| Arquitectura | **Mismo proyecto Next.js**, rutas nuevas (un repositorio, un diseño, un despliegue en Vercel) |
| Comunicación con el editor | **WhatsApp** (enlace `wa.me` con el número de pedido ya escrito) más correo transaccional como respaldo |
| Stack | GitHub · VS Code + Claude Code · Vercel · Supabase (Postgres, Auth, Storage) · n8n para automatizaciones |
| Cuentas | Todas a nombre de la organización (correo del dominio o el correo dueño del negocio), no del correo personal de quien desarrolla |

Supuestos que asumo hasta que digas lo contrario (están marcados **[SUPUESTO]** donde aplican): correo transaccional con Resend; sin cuenta de usuario para el cliente (acceso por enlace mágico al pedido); un solo idioma (español); solo COP en esta etapa.

---

## 4. Mapa del funnel

```
ANUNCIO (Meta / Google / TikTok / YouTube)
   │  UTMs + pixel
   ▼
LANDING DE SEGMENTO   /fotos-de-producto-con-ia   ·   /recupera-tus-fotos
   │  problema → solución → prueba (antes/después) → cómo funciona → precios → FAQ
   ▼
PEDIDO (asistente de 4 pasos, sin registro)   /pedido/nuevo?paquete=...
   1. Elige el servicio y el paquete
   2. Sube tus fotos o videos (con barra de progreso)
   3. Cuéntanos qué necesitas (brief guiado) + tus datos (nombre, correo, WhatsApp)
   4. Revisa y paga con Wompi (tarjeta, PSE, Nequi, Bancolombia)
   ▼
CONFIRMACIÓN   /pedido/[token]
   - Estado del pedido en vivo
   - Botón "Hablar con mi editor por WhatsApp" (mensaje ya escrito con el número del pedido)
   - Correo de confirmación
   ▼
PRODUCCIÓN (panel del editor)   /admin
   - El editor ve el pedido, descarga los originales, trabaja, sube las entregas
   ▼
ENTREGA + REVISIÓN   /pedido/[token]
   - Vista previa, descarga de archivos finales, solicitud de ajustes (según el paquete)
   ▼
POST-VENTA
   - Solicitud de reseña · oferta de paquete mensual · reactivación
```

Rescate del carrito: si el cliente sube archivos y no paga, se le recuerda automáticamente (correo a la hora y a las 24 horas) y el editor puede escribirle por WhatsApp desde el panel.

---

## 5. Arquitectura técnica

### 5.1 Componentes

| Capa | Herramienta | Uso en el funnel |
|---|---|---|
| Front + servidor | Next.js (el proyecto existente) | Landings, asistente de pedido, páginas de seguimiento, panel `/admin`, Route Handlers para pagos y webhooks |
| Base de datos y permisos | Supabase Postgres con RLS (Row Level Security: reglas que dicen quién puede leer o escribir cada fila) | Pedidos, paquetes, archivos, eventos |
| Archivos | Supabase Storage, buckets **privados** | Originales del cliente y entregas finales |
| Autenticación | Supabase Auth | Solo para el equipo de edición (`/admin`) |
| Pagos | Wompi Web Checkout + eventos (webhook) | Cobro en COP |
| Correo | Resend **[SUPUESTO]** | Confirmaciones, avisos de estado, entrega, recordatorios |
| Automatizaciones | n8n | Aviso al editor, carrito abandonado, reseñas, respaldos, alertas |
| Medición | GA4 + Meta Pixel + API de Conversiones de Meta | Optimización de campañas |
| Hosting | Vercel | Despliegue y previews por rama |

### 5.2 Subida de archivos (punto crítico)

- Los archivos **no pasan por las funciones de Vercel** (tienen límite de tamaño de cuerpo). El navegador sube directo a Supabase Storage.
- Flujo: el asistente pide al servidor un permiso de subida (`createSignedUploadUrl`) para un pedido en estado `draft`; el navegador sube con el protocolo resumible **TUS** (bloques de 6 MB, permite reanudar si se cae la conexión y mostrar progreso), usando por ejemplo `tus-js-client` o Uppy.
- Validaciones en el servidor: tipos permitidos (JPG, PNG, HEIC, WEBP, TIFF, MP4, MOV), máximo de archivos y de peso por paquete, y comprobación del tamaño real tras la subida.
- Verifica el **límite de tamaño por archivo de tu plan de Supabase**: el plan gratuito es bajo y los videos pueden superarlo; si es el caso, necesitas el plan Pro. Como salida de emergencia, el asistente ofrece un campo "pega un enlace de Drive/WeTransfer" para archivos muy pesados.
- Los borradores sin pago se limpian a los 7 días (tarea programada) para no acumular costo de almacenamiento.
- Los archivos se descargan siempre con **URLs firmadas de corta duración** generadas en el servidor.

### 5.3 Pago con Wompi (resumen técnico)

Basado en la documentación oficial de Wompi (Widget & Checkout Web y Eventos):

- **Web Checkout:** se redirige al cliente a Wompi con `public-key`, `currency` (COP), `amount-in-cents`, `reference`, `signature:integrity`, `redirect-url` y `customer-data`.
- **Firma de integridad (se calcula solo en servidor):** `SHA256( reference + amount-in-cents + currency + integrity_secret )`. Opcionalmente `expiration-time` va como quinto elemento.
- **Referencia única por intento:** una referencia de Wompi no se reutiliza. Usa `<codigo_pedido>-<n_intento>` (por ejemplo `FE-2609-0042-1`), así el cliente puede reintentar si su pago falla.
- **Monto en centavos:** 95.000 COP se envía como `9500000`.
- **Webhook (fuente de verdad):** Wompi envía `transaction.updated` a la URL de eventos configurada en el dashboard (URLs distintas para Sandbox y Producción). Se valida el `checksum`: se concatenan los valores indicados en `signature.properties` (normalmente `transaction.id`, `transaction.status`, `transaction.amount_in_cents`), luego el `timestamp`, luego el **secreto de eventos**, se calcula SHA256 y se compara con `signature.checksum` / header `X-Event-Checksum`. Se responde HTTP 200; si no, Wompi reintenta (hasta 3 veces en 24 horas).
- **Estados finales:** `APPROVED`, `DECLINED`, `VOIDED`, `ERROR`.
- **Reglas de oro:** (1) nunca marcar un pedido como pagado por el parámetro de la URL de retorno; solo por el webhook validado (o consultando la transacción a la API de Wompi); (2) verificar que el monto y la referencia del evento coinciden con el pedido; (3) el manejo del evento debe ser idempotente (recibir el mismo evento dos veces no duplica nada).
- Llaves de sandbox empiezan con `pub_test_`, las de producción con `pub_prod_`. El comercio en producción requiere activación/aprobación de la cuenta en Wompi: **empieza ese trámite desde la Fase 1**.

---

## 6. Modelo de datos (Supabase)

Claude Code debe crearlo como migraciones SQL versionadas en `supabase/migrations/`.

| Tabla | Campos principales |
|---|---|
| `packages` | `id`, `slug`, `segment` (producto / recuerdos), `name`, `description`, `price_cop`, `max_files`, `max_file_mb`, `accepts_video`, `turnaround_hours`, `revisions_included`, `active`, `sort_order` |
| `orders` | `id`, `code` (`FE-AAMM-NNNN`), `public_token` (32 caracteres aleatorios, no adivinable), `package_id`, `status`, `amount_cop`, `customer_name`, `customer_email`, `customer_whatsapp`, `brief` (jsonb), `utm` (jsonb), `consent_at`, `paid_at`, `delivered_at`, `created_at`, `updated_at` |
| `order_files` | `id`, `order_id`, `kind` (`original` / `delivery`), `storage_path`, `filename`, `mime`, `size_bytes`, `created_at` |
| `payments` | `id`, `order_id`, `attempt`, `wompi_reference` (único), `wompi_transaction_id`, `status`, `amount_cents`, `payment_method`, `raw_event` (jsonb), `created_at` |
| `order_events` | `id`, `order_id`, `type`, `actor` (`system` / `customer` / editor), `payload` (jsonb), `created_at` — bitácora de todo lo que pasa |
| `profiles` | `id` (= usuario de Supabase Auth), `role` (`editor` / `admin`), `name` |

**Estados del pedido:** `draft` → `awaiting_payment` → `paid` → `in_progress` → `delivered` → (`revision_requested` → `in_progress`) → `closed`. Estados laterales: `payment_failed`, `cancelled`, `refunded`, `expired` (borrador limpiado).

**Reglas de seguridad (RLS):**

- Las tablas y los buckets son privados por defecto. Ninguna tabla se lee desde el navegador con la llave pública, excepto `packages` (solo `active = true`).
- El cliente accede a su pedido únicamente a través de rutas del servidor que validan `public_token`; el servidor usa la llave de servicio.
- Solo usuarios con `profiles.role in ('editor','admin')` acceden al panel y a todos los pedidos.
- Buckets: `originals` (subidas del cliente) y `deliveries` (entregas del editor), ambos privados.

---

## 7. Rutas y endpoints

**Páginas**

| Ruta | Propósito |
|---|---|
| `/fotos-de-producto-con-ia` | Landing del segmento emprendedores |
| `/recupera-tus-fotos` | Landing del segmento recuerdos |
| `/pedido/nuevo` | Asistente de 4 pasos |
| `/pedido/[token]` | Seguimiento, WhatsApp, entrega y revisiones |
| `/pedido/[token]/gracias` | Retorno de Wompi (consulta el estado real, no confía en la URL) |
| `/admin`, `/admin/pedidos/[id]` | Panel del editor (protegido) |
| `/terminos`, `/privacidad`, `/politica-de-ajustes` | Páginas legales |

**Route Handlers (servidor)**

| Endpoint | Función |
|---|---|
| `POST /api/orders` | Crea el pedido en `draft`, devuelve `public_token` |
| `POST /api/orders/[id]/upload-url` | Emite URL firmada de subida (valida tipo, cantidad, peso, estado) |
| `POST /api/orders/[id]/submit` | Guarda brief y datos, pasa a `awaiting_payment` |
| `POST /api/orders/[id]/checkout` | Calcula la firma de integridad y devuelve los parámetros del Web Checkout |
| `POST /api/wompi/events` | Webhook de Wompi: valida checksum, idempotente, actualiza pago y pedido |
| `POST /api/orders/[id]/revision` | El cliente solicita un ajuste |
| `POST /api/admin/orders/[id]/status` | El editor cambia el estado |
| `POST /api/admin/orders/[id]/deliver` | El editor sube entregas y notifica al cliente |

---

## 8. Fases de trabajo

Tiempos estimados para una persona trabajando con Claude Code; ajústalos a tu ritmo.

| Fase | Nombre | Estimado |
|---|---|---|
| 0 | Auditoría del repositorio y decisiones | 0,5 día |
| 1 | Cuentas, variables de entorno y base de datos | 1 día |
| 2 | Catálogo de paquetes y landings del funnel | 2–3 días |
| 3 | Asistente de pedido y subida de archivos | 2–3 días |
| 4 | Pago con Wompi | 2 días |
| 5 | Seguimiento del cliente y panel del editor | 2–3 días |
| 6 | Correos y automatizaciones (n8n) | 1–2 días |
| 7 | Medición, publicidad y aspectos legales | 1 día |
| 8 | Pruebas, seguridad y rendimiento | 1–2 días |
| 9 | Paso a producción y lanzamiento suave | 1 día |

Ruta crítica: **la aprobación de la cuenta de Wompi en producción** puede tardar; se inicia en la Fase 1 y corre en paralelo. El contenido de los antes/después de rescate emocional (Fase 2) también depende de ti y conviene prepararlo desde ya.

---

### Fase 0 — Auditoría del repositorio y decisiones

**Objetivo:** entender el proyecto actual para integrar el funnel sin romper nada y sin duplicar componentes.

**Tareas para Claude Code**

- Leer la estructura del repositorio: versión de Next.js, App Router o Pages Router, sistema de estilos (Tailwind, CSS Modules, etc.), fuentes, tokens de color, componentes de UI existentes.
- Localizar y documentar: el componente del divisor antes/después de `/ejemplos`, el Cotizador Web, el formulario de `/contacto`, el header/footer, el manejo de metadatos SEO.
- Revisar cómo se despliega (Vercel), variables de entorno actuales y dependencias.
- Producir `docs/AUDITORIA.md` con hallazgos, lista de componentes reutilizables y un plan de cambios mínimo. Crear `CLAUDE.md` con las reglas permanentes de la sección 0.
- Proponer los nombres finales de rutas (sección 7) si el repositorio ya usa otra convención.

**Prompt sugerido**

> Lee `docs/FUNNEL_PLAN.md`. Ejecuta solo la Fase 0: audita este repositorio y genera `docs/AUDITORIA.md` y `CLAUDE.md`. No modifiques código de la aplicación todavía. Al final, lista las dudas que necesites que yo resuelva.

**Criterios de aceptación:** existe `docs/AUDITORIA.md` con componentes reutilizables identificados; `CLAUDE.md` creado; ninguna línea de código de la app modificada.

**Lo que hace Edgar:** revisar la auditoría y responder las dudas.

---

### Fase 1 — Cuentas, variables de entorno y base de datos

**Objetivo:** tener toda la infraestructura lista y a nombre del negocio.

**Lo que hace Edgar (antes de la sesión con Claude Code)**

1. Crear el proyecto de **Supabase** con el correo del negocio y elegir región cercana (por ejemplo São Paulo). Guardar las llaves en un gestor de contraseñas: URL del proyecto, `anon key` y `service_role key`. **La `service_role key` nunca se pega en el código ni en el chat; va solo en Vercel y `.env.local`.**
2. Crear la cuenta de comercio en **Wompi** y solicitar la activación de producción **hoy mismo**. Mientras tanto usar Sandbox: anotar llave pública de prueba, secreto de integridad y secreto de eventos.
3. Crear la cuenta de **Resend** **[SUPUESTO]** y verificar el dominio `fotoeditores.com` (registros DNS) para enviar desde una dirección propia (por ejemplo `pedidos@fotoeditores.com`).
4. Tener una instancia de **n8n** (nube o propia) con URL accesible.
5. Cargar las variables en Vercel: *Project → Settings → Environment Variables* (marcar entornos Preview y Production por separado; en Preview van las llaves de Sandbox).
6. Definir el número de WhatsApp de negocio que recibirá los pedidos (formato internacional, por ejemplo `573001234567`).

**Variables de entorno esperadas** (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=
WOMPI_INTEGRITY_SECRET=
WOMPI_EVENTS_SECRET=
WOMPI_API_BASE=
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_WHATSAPP_NUMBER=
N8N_WEBHOOK_BASE_URL=
N8N_WEBHOOK_SECRET=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_TOKEN=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

**Tareas para Claude Code**

- Instalar el cliente de Supabase y configurarlo (cliente de navegador con llave pública; cliente de servidor con llave de servicio, en un módulo que solo se importa desde código de servidor).
- Escribir las migraciones de la sección 6 con RLS activado, crear los buckets privados `originals` y `deliveries`, y sembrar `packages` con **datos de ejemplo marcados como provisionales**.
- Crear el flujo de código para generar `code` de pedido (`FE-AAMM-NNNN`) y `public_token`.
- Crear `.env.example` y validar las variables al arrancar (falla claro si falta alguna).

**Prompt sugerido**

> Ejecuta la Fase 1 de `docs/FUNNEL_PLAN.md`. Crea las migraciones de Supabase de la sección 6 con RLS, los buckets privados y el módulo de validación de variables de entorno. Yo ya cargué las variables en `.env.local`. Escribe pruebas que demuestren que un usuario anónimo no puede leer `orders` ni `order_files` con la llave pública.

**Criterios de aceptación:** migraciones aplican en limpio; prueba de RLS pasa (anónimo no lee pedidos ni archivos); `.env.example` completo; ningún secreto en git (`git log -p | grep` de las llaves da vacío).

---

### Fase 2 — Catálogo de paquetes y landings del funnel

**Objetivo:** dos landings que conviertan y muestren el precio, conectadas al asistente de pedido.

**Estructura de cada landing** (reutilizando componentes existentes)

1. **Hero:** titular con el postulado y el dolor del segmento; un solo CTA ("Empieza tu pedido"); prueba inmediata (un antes/después arrastrable).
2. **El problema:** "Intentaste con IA y no te salió." Tres razones: curva de aprendizaje, no es gratis (suscripciones y créditos), y sin criterio de imagen (plano, encuadre, iluminación) las instrucciones no producen resultados profesionales.
3. **La solución:** editores humanos con 20 años de experiencia + las mejores herramientas de IA.
4. **Prueba:** galería de antes/después del segmento (reutilizar el componente de `/ejemplos`); métricas de marca (20 años); espacio para testimonios reales cuando existan.
5. **Cómo funciona:** tres pasos — sube tus fotos o videos, cuéntanos qué necesitas, recibe el resultado de un editor humano.
6. **Paquetes y precios:** tarjetas leídas de la tabla `packages` (qué incluye, tiempo de entrega, número de ajustes), cada una con botón hacia `/pedido/nuevo?paquete=<slug>`.
7. **Preguntas frecuentes** (resolver objeciones): ¿qué pasa si no me gusta? · ¿es seguro mi material? · ¿cuánto demora? · ¿usan IA? (sí, y por qué necesitas a un humano que la dirija) · ¿puedo hablar con alguien antes de pagar? · ¿qué formatos aceptan?
8. **Cierre:** repetir el CTA, botón flotante de WhatsApp para dudas previas a la compra.

**Otras tareas**

- Añadir a `/ejemplos` un CTA por caso ("Quiero algo así") que lleve al pedido con el servicio preseleccionado y un bloque de precio "desde". Enlazar el menú principal al funnel.
- SEO técnico de cada landing (título, descripción, Open Graph, datos estructurados de servicio) y rendimiento (imágenes optimizadas, LCP bajo).
- El copy final lo aprueba Edgar; Claude Code usa el borrador de la sección 11 como punto de partida.

**Prompt sugerido**

> Ejecuta la Fase 2. Crea `/fotos-de-producto-con-ia` y `/recupera-tus-fotos` con la estructura del plan, reutilizando el componente antes/después y el diseño existentes. Los paquetes se leen de la tabla `packages`. Usa el copy de la sección 11 como borrador. Verifica en móvil (ancho 375 px) porque la mayor parte del tráfico de anuncios llegará desde teléfono.

**Criterios de aceptación:** ambas landings navegables en el preview de Vercel; CTA llevan al asistente con el paquete preseleccionado; puntuación de rendimiento móvil en Lighthouse ≥ 85; sin desbordes horizontales en 375 px.

**Lo que hace Edgar:** definir los **precios reales** y el contenido de cada paquete; aprobar el copy; entregar 3–5 antes/después de rescate emocional (con autorización de las personas retratadas o material propio/de muestra); enviar testimonios reales si los hay.

---

### Fase 3 — Asistente de pedido y subida de archivos

**Objetivo:** que un visitante suba sus archivos y describa lo que necesita en menos de 3 minutos, desde el teléfono.

**Tareas para Claude Code**

- Asistente de 4 pasos con barra de progreso, estado guardado (si recarga, no pierde lo subido: usar el `public_token` del borrador) y diseño móvil primero.
- Paso 2 (subida): arrastrar y soltar o seleccionar desde la galería del teléfono, miniaturas, barra de progreso por archivo, reanudación si se corta la conexión (TUS), validación de tipo y peso con mensajes claros en español, y opción de pegar un enlace de Drive/WeTransfer para archivos muy pesados.
- Paso 3 (brief guiado): en vez de un cuadro de texto vacío, preguntas cortas según el paquete — qué quieres lograr (opciones: mejorar nitidez, recuperar color, quitar fondo, restaurar daños, animar, generar desde cero…), para qué lo usarás (redes, impresión, catálogo, álbum), referencias opcionales y un campo libre. Aquí se aplica el postulado: **la app traduce lo que el cliente quiere a la información que el editor necesita**, para que el cliente no tenga que saber de planos ni encuadres.
- Datos de contacto (nombre, correo, WhatsApp con validación), casilla de consentimiento de tratamiento de datos (enlace a `/privacidad`) y protección anti-bots (Cloudflare Turnstile) antes de crear el pedido.
- Captura de UTMs y `fbclid`/`gclid` en la primera visita (cookie) y almacenamiento en `orders.utm`.
- Tarea programada (Vercel Cron o n8n) que expire y borre borradores sin pago a los 7 días.

**Prompt sugerido**

> Ejecuta la Fase 3. Construye `/pedido/nuevo` como asistente de 4 pasos con las rutas de la sección 7. La subida debe ir directo a Supabase Storage con URL firmada y protocolo TUS; no pases archivos por funciones de Vercel. Escribe pruebas para: tipo de archivo inválido, exceso de peso, exceso de cantidad y subida a un pedido que no está en `draft`.

**Criterios de aceptación:** subir 10 fotos y 1 video de prueba desde un teléfono real funciona con progreso y reanudación; un archivo `.exe` o de peso excesivo se rechaza en servidor; un visitante no puede listar ni descargar archivos de otro pedido; el borrador sobrevive a una recarga.

---

### Fase 4 — Pago con Wompi

**Objetivo:** cobrar de forma segura y marcar el pedido como pagado solo con confirmación verificada.

**Tareas para Claude Code**

- `POST /api/orders/[id]/checkout`: valida que el pedido esté en `awaiting_payment`, toma el precio **desde la base de datos** (nunca del navegador), crea un registro en `payments` con referencia única `<code>-<intento>`, calcula la firma de integridad en servidor y devuelve los parámetros del Web Checkout.
- Redirigir al Web Checkout de Wompi con `redirect-url` a `/pedido/[token]/gracias`.
- `POST /api/wompi/events`: leer el cuerpo **sin modificar**, validar el checksum con el secreto de eventos, buscar el pago por referencia, verificar monto y moneda, actualizar `payments` y `orders` de forma **idempotente**, registrar en `order_events`, responder 200, y disparar el webhook a n8n. Estados: `APPROVED` → `paid`; `DECLINED`/`ERROR` → `payment_failed` (permite reintentar con nuevo intento); `VOIDED` → según el caso.
- La página `/gracias` consulta el estado real del pedido (sondeo corto) y, si sigue pendiente, permite consultar la transacción a la API de Wompi.
- Botón "Reintentar pago" cuando falla.
- Pruebas unitarias de la firma de integridad y del checksum del webhook con los ejemplos de la documentación de Wompi; prueba de idempotencia (mismo evento dos veces) y de rechazo (checksum inválido, monto distinto).
- Enviar `Purchase` a Meta CAPI **desde el webhook** cuando el pago se aprueba.

**Prompt sugerido**

> Ejecuta la Fase 4 con Wompi Sandbox. Implementa checkout y webhook siguiendo la sección 5.3. El precio sale siempre de la tabla `packages`. Cubre con pruebas: firma de integridad, checksum inválido, evento duplicado, monto que no coincide, pago rechazado y reintento con nueva referencia. Documenta cómo probar en Sandbox con los datos de prueba de Wompi.

**Criterios de aceptación:** un pago de prueba aprobado lleva el pedido a `paid` y aparece en el panel; uno rechazado deja reintentar; reenviar el mismo evento no duplica nada; modificar el monto en el navegador no cambia lo cobrado; el webhook con firma inválida responde error y no altera datos.

**Lo que hace Edgar:** configurar en el dashboard de Wompi (Sandbox) la URL de eventos apuntando al preview de Vercel (`https://<preview>/api/wompi/events`); probar tarjeta, PSE y Nequi de prueba; más adelante repetir en producción.

---

### Fase 5 — Seguimiento del cliente y panel del editor

**Objetivo:** que el cliente vea el avance y hable con un humano, y que tú produzcas sin fricción.

**Página del cliente `/pedido/[token]`**

- Línea de estado en español (Recibido → Pagado → En edición → Entregado), fecha estimada de entrega, resumen del pedido y archivos subidos.
- Botón **"Hablar con mi editor por WhatsApp"**: `https://wa.me/<numero>?text=Hola,%20soy%20<nombre>.%20Mi%20pedido%20es%20<codigo>`.
- Cuando hay entrega: vista previa, descarga de archivos finales (URL firmada) y botón "Solicitar ajuste" (descuenta de `revisions_included`), con campo de comentarios.

**Panel `/admin`** (acceso con Supabase Auth, solo `editor`/`admin`)

- Bandeja de pedidos con filtros por estado y antigüedad, y alerta visual de pedidos que se acercan a su plazo.
- Detalle del pedido: brief legible, datos del cliente, descarga de originales (individual y en ZIP), bitácora, botón **"Escribir por WhatsApp"** (enlace prellenado), cambio de estado, notas internas.
- Subida de entregas (misma técnica de subida directa) y botón **"Entregar"** que cambia estado y notifica al cliente.
- Métricas simples: pedidos por estado, ingresos por semana, tiempo medio de entrega.

**Prompt sugerido**

> Ejecuta la Fase 5. Construye `/pedido/[token]` y `/admin` según el plan. El acceso del cliente es solo por token; el del panel por Supabase Auth con rol. Las descargas son siempre por URL firmada de corta duración. Pruebas: un token equivocado no revela nada, un usuario sin rol no entra a `/admin`, y solicitar más ajustes de los incluidos se rechaza.

**Criterios de aceptación:** flujo completo de punta a punta en Sandbox (pedido → pago → panel → entrega → descarga del cliente); el botón de WhatsApp abre el chat con el mensaje correcto; ningún endpoint del panel responde sin sesión con rol.

**Lo que hace Edgar:** crear los usuarios del equipo en Supabase Auth y asignarles rol en `profiles`.

---

### Fase 6 — Correos y automatizaciones (n8n)

**Objetivo:** que el sistema trabaje solo alrededor del pedido.

**Correos transaccionales (Resend):** confirmación de pedido pagado (con enlace de seguimiento y WhatsApp), aviso de "tu editor ya está trabajando", entrega lista, ajuste recibido, recibo de pago. Diseño simple, con la voz de marca, en texto plano alternativo.

**Flujos de n8n** (Claude Code deja documentados los payloads y los `webhooks`; tú los armas en n8n o él genera los JSON importables)

| Flujo | Disparador | Acción |
|---|---|---|
| Pedido pagado | Webhook al aprobar el pago | Avisar al editor (correo + mensaje interno o Telegram/Slack) con el resumen y el enlace al panel |
| Carrito abandonado | Pedido en `awaiting_payment` > 1 h y > 24 h | Correo de recordatorio con enlace para retomar; a las 24 h aviso al editor para contacto manual por WhatsApp |
| Entrega sin respuesta | Pedido `delivered` sin actividad > 3 días | Recordatorio amable y solicitud de reseña |
| Reseña y post-venta | 3–5 días tras `closed` | Pedir testimonio y ofrecer paquete mensual |
| Respaldo | Diario | Respaldo de base de datos con alerta si falla |
| Alertas de despliegue | Error de despliegue en Vercel | Aviso a tu correo |

Los webhooks de la app hacia n8n se firman con `N8N_WEBHOOK_SECRET` para que nadie más los pueda disparar.

**Prompt sugerido**

> Ejecuta la Fase 6. Implementa el envío de correos transaccionales con Resend (plantillas en `emails/`) y los disparos firmados hacia n8n descritos en el plan. Documenta cada payload en `docs/n8n.md` y genera los flujos como JSON importable donde sea posible.

**Criterios de aceptación:** un pago de prueba genera correo al cliente y aviso al editor; un pedido dejado en `awaiting_payment` dispara el recordatorio; un disparo sin firma válida es rechazado.

---

### Fase 7 — Medición, publicidad y aspectos legales

**Objetivo:** dejar todo listo para pautar y medir desde el primer peso.

**Medición**

- GA4 y Meta Pixel cargados con consentimiento (aviso de cookies). Eventos de embudo: `view_landing`, `select_package`, `upload_started`, `upload_completed`, `begin_checkout`, `purchase` (con valor y moneda COP), `whatsapp_click`.
- API de Conversiones de Meta desde el servidor para `Purchase` y `InitiateCheckout` con deduplicación (mismo `event_id` que el pixel).
- Etiqueta de conversión de Google Ads.
- Captura de UTMs de punta a punta (anuncio → pedido → panel), para saber qué campaña vendió qué.
- Panel interno con la tasa de conversión de cada paso del embudo (visitas → subida → pago).

**Aspectos legales (Colombia)** — Claude Code redacta borradores; **deben ser revisados por un abogado**:

- Política de tratamiento de datos personales (Ley 1581 de 2012, habeas data) y aviso de privacidad: se manejan fotos de personas, incluso familiares, lo que exige cuidado. Definir cuánto tiempo se conservan los archivos (por ejemplo 30–90 días tras la entrega) y cómo pedir su borrado.
- Términos del servicio: alcance del paquete, ajustes incluidos, tiempos, propiedad de los resultados, autorización del cliente para editar imágenes de terceros que aparezcan, uso de IA como herramienta, y política de reembolso/desistimiento.
- Autorización expresa (casilla) antes de pagar; autorización opcional y separada para usar el resultado como caso en el portafolio.

**Prompt sugerido**

> Ejecuta la Fase 7. Instala GA4, Meta Pixel y Meta CAPI con los eventos del plan, respetando el consentimiento de cookies y deduplicando con `event_id`. Crea las páginas `/terminos`, `/privacidad` y `/politica-de-ajustes` con borradores claros en español y una nota visible para revisión legal. Muestra cómo validar los eventos con el Test Events de Meta.

**Criterios de aceptación:** los eventos aparecen una sola vez en Meta y GA4 durante un flujo de prueba; la compra llega con valor en COP; sin consentimiento no se cargan los pixels.

**Lo que hace Edgar:** crear la cuenta de anuncios, el pixel y el token de CAPI; revisión legal de los textos.

---

### Fase 8 — Pruebas, seguridad y rendimiento

**Tareas para Claude Code**

- Pruebas end-to-end con Playwright del flujo completo en móvil y escritorio (con Wompi Sandbox y mocks donde no se pueda automatizar el checkout de Wompi).
- Revisión de seguridad: intentar leer pedidos/archivos ajenos, manipular precio, reenviar webhooks, subir tipos no permitidos, saltarse el estado del pedido, fuerza bruta de tokens; limitación de tasa (rate limiting) en los endpoints públicos; cabeceras de seguridad.
- Rendimiento: Lighthouse móvil de las landings y del asistente; revisar peso de imágenes y de scripts de terceros.
- Accesibilidad básica (contraste, foco, etiquetas de formularios).
- Manejo de errores: mensajes claros en español si falla una subida o un pago; registro de errores (Sentry o el registro de Vercel).

**Prompt sugerido**

> Ejecuta la Fase 8. Escribe pruebas Playwright para el flujo completo y haz una revisión de seguridad adversarial de los endpoints de la sección 7: intenta romperlos e informa cada hallazgo con su corrección. Entrega un reporte `docs/QA.md`.

**Criterios de aceptación:** e2e verde; reporte de seguridad sin hallazgos críticos abiertos; Lighthouse móvil ≥ 85 en landings.

---

### Fase 9 — Producción y lanzamiento suave

**Tareas**

1. Cambiar a llaves de producción de Wompi (con la cuenta ya activada) en las variables de **Production** en Vercel; configurar la URL de eventos de producción en el dashboard de Wompi.
2. Hacer **una compra real de valor mínimo** (con tu propia tarjeta) y comprobar: cobro, webhook, pedido pagado, correo, aviso al editor y evento de compra en Meta y GA4. Reembolsarla o anularla, según lo que permita Wompi para tu cuenta.
3. Lanzamiento suave: enviar el enlace a 10–20 personas cercanas o clientes actuales; corregir fricciones.
4. Encender publicidad con presupuesto pequeño, un anuncio por segmento (ver sección 10), y revisar el embudo a las 72 horas.

**Criterios de aceptación:** compra real completa sin intervención manual, primeros clientes reales atendidos, tablero de conversión con datos.

---

## 9. Estructura de paquetes sugerida (precios por definir)

Los nombres y alcances son una propuesta para arrancar; **los valores en COP los defines tú** (`price_cop`). Claude Code los siembra como provisionales.

| Slug | Segmento | Qué incluye (borrador) | Ajustes | Precio |
|---|---|---|---|---|
| `rescate-1-foto` | Recuerdos | Restauración/mejora de 1 foto (nitidez, color, daños, encuadre) | 1 | por definir |
| `rescate-pack-10` | Recuerdos | 10 fotos, mismo tratamiento; ideal para un álbum o parte de una boda | 1 | por definir |
| `evento-recuperado` | Recuerdos | Reconstrucción de un evento completo a partir de hasta N fotos de celular | 2 | por definir |
| `producto-pack-5` | Producto | 5 imágenes de producto con nivel de catálogo | 1 | por definir |
| `producto-pack-15` | Producto | 15 imágenes de producto + variantes para redes | 2 | por definir |
| `video-corto` | Ambos | Animar una foto o mejorar un video de hasta 30 s | 1 | por definir |
| `a-la-medida` | Ambos | Generación desde cero a partir de una idea. **No se cobra en línea**: lleva a WhatsApp para cotizar **[SUPUESTO: opcional, se puede quitar]** | — | cotización |

Sugerencia estratégica: mantener un paquete de entrada de precio bajo (`rescate-1-foto` o `producto-pack-5`) para que la primera compra sea fácil, y usar la entrega como momento para ofrecer el paquete mensual del home (Starter, Producer, Studio).

---

## 10. Plan de publicidad inicial (para cuando el funnel esté en producción)

Un anuncio de prueba por segmento, todos apuntando a su landing con UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`):

| Segmento | Canal principal | Formato | Gancho |
|---|---|---|---|
| Recuerdos | Meta (Facebook/Instagram) | Video corto o carrusel antes/después | "Tu fotógrafo te entregó las fotos desenfocadas. Todavía se pueden recuperar." |
| Producto | Meta e Instagram Reels; Google Search para intención alta | Video antes/después de producto | "Tu producto merece verse como el de las marcas grandes, sin producción de estudio." |
| Ambos | Google Search | Anuncios de búsqueda ("restaurar fotos antiguas", "mejorar fotos de producto con IA") | Intención de compra directa |

Regla de medición: decidir con datos a las 72 horas y a los 7 días — costo por subida completada, costo por compra, y conversión de cada paso del embudo.

---

## 11. Copy base (borrador para aprobar)

**Hero (compartido)**
- Titular: *La IA es fácil y gratis… hasta que intentas usarla.*
- Subtítulo: *Somos editores de foto y video con 20 años de experiencia, potenciados con las mejores herramientas de inteligencia artificial. Tú nos envías tus archivos; un editor humano te devuelve resultados profesionales.*
- CTA: *Empieza tu pedido*

**Landing "Recupera tus fotos"**
- Titular alternativo: *Tus recuerdos no están perdidos. Solo necesitan a un editor de verdad.*
- Bloque de dolor: fotos desenfocadas o mal encuadradas de la boda, un fotógrafo que perdió el material, un álbum familiar deteriorado, solo quedan fotos tomadas con celular. "Lo intentaste con una app de IA y el resultado no se parecía a nadie."
- Promesa: *Recuperamos tus fotos y las convertimos en una producción digna del momento.*

**Landing "Fotos de producto con IA"**
- Titular alternativo: *Tu producto compite con las marcas grandes. Que se vea como una de ellas.*
- Bloque de dolor: sin presupuesto para estudio, fotos de celular que no venden, herramientas de IA que dan resultados inconsistentes.
- Promesa: *Imágenes y video de producto de nivel profesional, sin montar una producción.*

**Bloque "Por qué la IA sola no te funcionó"**
- Tiene una curva de aprendizaje real: cada herramienta es distinta y cambia cada mes.
- No es gratis: suscripciones, créditos y horas de prueba y error.
- Sin criterio de imagen no hay buenas instrucciones: plano, encuadre e iluminación deciden el resultado.
- La diferencia: *un editor con 20 años de oficio le dice a la IA exactamente qué hacer.*

**Cómo funciona**
1. Sube tus fotos o videos.
2. Cuéntanos qué necesitas (te guiamos con preguntas simples).
3. Un editor humano lo trabaja y te lo entrega. Hablas con él por WhatsApp.

**Garantía / política de ajustes:** *a definir por Edgar* (cuántos ajustes incluye cada paquete y qué pasa si el resultado no es viable). No publicar promesas de reembolso o de plazos que no estés seguro de cumplir.

---

## 12. Pendientes de Edgar y riesgos

**Decisiones y materiales que solo tú puedes aportar**

1. Precios en COP y alcance definitivo de cada paquete (sección 9).
2. Plazos de entrega reales por paquete y capacidad del equipo (cuántos pedidos por semana se pueden atender sin bajar la calidad).
3. Política de ajustes y de reembolso.
4. 3–5 antes/después de rescate emocional para la landing de recuerdos; testimonios reales.
5. Número de WhatsApp de negocio y quién atiende, en qué horarios.
6. Correo del dominio o del negocio para las cuentas (Supabase, Wompi, Resend, n8n, Vercel).
7. Confirmar los supuestos marcados **[SUPUESTO]** (Resend, sin registro de usuario, solo COP, paquete "a la medida").

**Riesgos a vigilar**

- **Aprobación de Wompi en producción:** puede demorar; empezar ya. Si se retrasa mucho, el funnel puede salir con pago manual por enlace mientras tanto.
- **Peso de archivos y costo de almacenamiento:** los videos son pesados; verificar plan de Supabase, limitar peso por paquete y limpiar borradores.
- **Privacidad de material sensible:** fotos familiares y de personas exigen buenas prácticas y textos legales revisados.
- **Capacidad operativa:** si la publicidad funciona más rápido que tu capacidad de producción, la calidad y los plazos se resienten. Poner un tope de pedidos activos y un mensaje de "cupos limitados" solo si es cierto.
- **Expectativas del cliente:** el brief guiado y ejemplos claros reducen ajustes y frustración; en fotos muy dañadas, dejar claro qué es viable.
- **Moneda:** al vender solo en COP se limita el público fuera de Colombia; si más adelante interesa Latinoamérica o EE. UU., evaluar Stripe como segunda pasarela.

---

## 13. Checklist final de lanzamiento

- [ ] Las dos landings publicadas, con precios reales y copy aprobado
- [ ] Asistente de pedido probado desde un teléfono real (iOS y Android)
- [ ] Wompi en producción activado; compra real de prueba hecha y reembolsada
- [ ] Webhook validado, idempotente y con monitoreo
- [ ] Panel del editor en uso por el equipo; entrega de prueba completada
- [ ] Correos transaccionales llegando a bandeja de entrada (no a spam)
- [ ] Flujos de n8n activos (pedido pagado, carrito abandonado, reseña, respaldo)
- [ ] GA4, Meta Pixel y CAPI verificados; UTMs llegando hasta el pedido
- [ ] Términos, privacidad y política de ajustes revisados por un abogado
- [ ] Respaldo de base de datos probado (restauración verificada)
- [ ] Ningún secreto en el repositorio; llaves de Sandbox y Producción separadas
- [ ] `docs/AUDITORIA.md`, `docs/n8n.md` y `docs/QA.md` actualizados
- [ ] Capacidad operativa definida (tope de pedidos activos)
- [ ] Presupuesto inicial de publicidad y criterios de decisión a 72 h y 7 días fijados

---

## 14. Fuentes consultadas

- Wompi — Widget & Checkout Web: https://docs.wompi.co/en/docs/colombia/widget-checkout-web/
- Wompi — Eventos (webhooks): https://docs.wompi.co/en/docs/colombia/eventos/
- Supabase — Resumable Uploads: https://supabase.com/docs/guides/storage/uploads/resumable-uploads
- Página analizada: https://www.fotoeditores.com/ejemplos y https://www.fotoeditores.com
