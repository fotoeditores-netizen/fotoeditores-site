# Auditoría del repositorio — Fase 0 del funnel

Fecha: 24 de septiembre de 2026 · Rama base: `main` (commit `bfe5ef7`) · Plan de referencia: [`docs/FUNNEL_PLAN.md`](FUNNEL_PLAN.md)

Esta auditoría se hizo leyendo el código. **No se compiló ni se ejecutó la app**: el repositorio local no tiene `node_modules` instalados. La primera tarea de la Fase 1 es `npm install` + `npm run build` para confirmar que el proyecto compila tal como está.

---

## 1. Stack actual

| Tema | Hallazgo |
|---|---|
| Framework | **Next.js 16.1.6**, **App Router** (`app/`), React 19, TypeScript 5 (`strict: true`) |
| Estilos | **Tailwind CSS 3** + mucho estilo inline (`style={{…}}`) con colores hex escritos a mano. `app/globals.css` define utilidades propias (`.glass`, `.gradient-text`, `.grid-pattern`, `.gradient-border`, `.prose-fotoeditores`) |
| Fuentes | `next/font/google`: **Montserrat** (títulos, `--font-montserrat`), **Inter** (texto, `--font-inter`), **JetBrains Mono** (etiquetas técnicas, `--font-jetbrains`) — `app/layout.tsx` |
| Animación | `framer-motion` 12 (casi todas las secciones entran con `motion.div`) |
| Iconos | `lucide-react` |
| Correo | **Resend 4** ya instalado y en uso, remitente `contacto@fotoeditores.com`, destino interno `editorgeneral@fotoeditores.com` |
| IA | `@anthropic-ai/sdk` (chat del sitio, modelo Haiku 4.5); ElevenLabs para voz (opcional) |
| Blog | MDX en `content/blog/` leído con `gray-matter` + `next-mdx-remote` (`lib/blog.ts`) |
| Tests | **No hay** framework de pruebas ni script `test` |
| Git | Remoto `github.com/fotoeditores-netizen/fotoeditores-site`. Existe la rama remota `origin/mejoras-diseno` con 3 commits que no están en `main` |
| Despliegue | Vercel (no hay `vercel.json`; `.vercel/` está en `.gitignore`) |

### Tokens de marca (`tailwind.config.ts`)

| Token | Valor | Uso observado |
|---|---|---|
| `midnight` | `#0A1628` | Fondo general del sitio |
| `electric` | `#0066FF` | Color primario, inicio de gradientes |
| `cyan-digital` | `#00D4FF` | Acento, "DESPUÉS", fin de gradientes |
| `gold` | `#FFB800` | Insignias ("20 años", "Ver para creer") |
| `cosmos` | `#1A1A2E` | Fondos secundarios |
| `coral` | `#FF4D6D` | Errores |
| — | `#050D1A`, `#0D1E3A` | Fondos alternos de sección (no están como token) |

Gradiente de CTA principal (repetido en todo el sitio): `linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)` con `boxShadow: 0 0 40px rgba(0,102,255,0.4)`.

---

## 2. Mapa de rutas actual

| Ruta | Archivo | Tipo | Metadatos SEO |
|---|---|---|---|
| `/` | `app/page.tsx` | Servidor (compone componentes cliente) | Sí |
| `/ejemplos` | `app/ejemplos/page.tsx` | **Cliente** (`"use client"`) | **No** (hereda los del layout) |
| `/contacto` | `app/contacto/page.tsx` | Cliente | No |
| `/tecnologia` | `app/tecnologia/page.tsx` | Cliente | No |
| `/nuestro-adn` | `app/nuestro-adn/page.tsx` | Cliente | No |
| `/blog`, `/blog/[slug]` | `app/blog/…` | Servidor | Sí (`generateMetadata`, `params` como Promise — patrón Next 16 correcto) |

**Rutas API** (`app/api/*/route.ts`): `contact`, `cotizador`, `lead-magnet`, `chat`, `tts`, `exchange-rate`.

**No existen**: `sitemap`, `robots`, `middleware`/`proxy`, `/privacidad`, `/terminos`. El footer enlaza a `/privacidad` y `/terminos`, así que **hoy esos enlaces dan 404** (la Fase 7 los crea).

`/ejemplos` **no aparece en el menú principal** (`components/Navbar.tsx`); solo se llega desde un botón del Hero.

---

## 3. Componentes reutilizables para el funnel

| Componente | Archivo | Reutilización en el funnel | Notas |
|---|---|---|---|
| **Divisor antes/después** | `components/BeforeAfterSlider.tsx` | Hero y galería de las landings (Fase 2) | Props `beforeSrc`, `afterSrc`, `alt`. Usa Pointer Events (funciona con dedo en móvil). **Proporción fija 3:4 vertical** (`paddingBottom: 133%`): para fotos horizontales de producto habría que añadir una prop de proporción |
| **Caja de medios antes/después (video)** | `MediaBox` dentro de `app/ejemplos/page.tsx` | Casos de video en landings | Está **definido dentro de la página**, no exportado. Habría que moverlo a `components/` para reutilizarlo. Proporción fija 9:16 |
| **Datos de los 11 casos** | Arreglos `sliders` y `sideBySide` en `app/ejemplos/page.tsx` | Filtrar casos por segmento en cada landing | Hoy están dentro de la página. Propuesta: moverlos a `lib/ejemplos.ts` con un campo `segment` |
| Tarjeta de caso | Markup inline en `/ejemplos` (insignia de categoría + título + herramienta) | Galería de las landings | No es componente; se copia el patrón |
| **Estilo de campos de formulario** | `inputBase`, `selectBase`, `FormField` en `components/Cotizador.tsx`; `inputStyle` en `app/contacto/page.tsx` | Asistente de pedido (Fase 3) | Hay **dos versiones** ligeramente distintas del mismo estilo; no hay componente `Input` compartido |
| `Stepper` (+/−) y `Tooltip` | `components/Cotizador.tsx` (internos) | Posible en el brief guiado | No exportados |
| Tarjetas de selección (`ToggleCard`) | `components/Cotizador.tsx` (interno) | Paso 1 "elige tu paquete" y opciones del brief | No exportado |
| Botón CTA con pulso (`motion.button` con `boxShadow` animado) | `components/Cotizador.tsx` | CTA de pago | Patrón copiable |
| Tarjetas de paquetes | `packages` en `app/tecnologia/page.tsx` y `components/ServicesSection.tsx` | Sección "Paquetes y precios" | Precios **escritos a mano en USD**; en el funnel vendrán de la tabla `packages` en COP |
| Modal global | `CotizadorModal` + `context/CotizadorContext.tsx` | Referencia de patrón de modal | Se monta en todas las páginas vía `ClientProviders` |
| Layout, Navbar, Footer | `app/layout.tsx`, `components/Navbar.tsx`, `components/Footer.tsx` | Landings | Navbar fija de 96 px de alto (`h-24`): las páginas usan `pt-28` para compensar |
| Cabecera de sección (insignia + h1 con gradiente + fondo `grid-pattern`) | Repetida en `/ejemplos`, `/contacto`, `/tecnologia` | Hero de las landings | Patrón copiado a mano en cada página; no es componente |
| Correo con Resend | `app/api/cotizador/route.ts`, `app/api/contact/route.ts` | Correos transaccionales (Fase 6) | Plantillas HTML inline con la cabecera de marca (gradiente `#0A1628 → #0066FF`, logo "Foto**editores**") |
| Tasa USD/COP | `app/api/exchange-rate/route.ts` | Solo si se muestran equivalentes en USD | El funnel cobra en COP fijo; no debería depender de esta tasa |

**Conclusión:** el sistema visual es consistente pero vive en estilos inline copiados de página en página, no en componentes. Para el funnel propongo extraer **solo lo que se va a reutilizar de verdad**: `MediaBox` y los datos de casos (a `components/` y `lib/`), y una prop de proporción para `BeforeAfterSlider`. Los campos de formulario del asistente seguirían el estilo de `Cotizador.tsx`. Ver pregunta 4.

---

## 4. Variables de entorno actuales

No hay `.env.example`. Variables que el código lee hoy:

| Variable | Dónde | Obligatoria |
|---|---|---|
| `RESEND_API_KEY` | `api/contact`, `api/cotizador`, `api/lead-magnet` | Sí |
| `ANTHROPIC_API_KEY` | `api/chat` (el SDK la lee implícitamente) | Sí para el chat |
| `ELEVENLABS_API_KEY` | `api/tts` | No (si falta, responde 204) |
| `PAYMENT_URL` | `api/cotizador` (botón "Aprobar cotización y realizar pago" del correo) | No (usa `https://fotoeditores.com` por defecto) |

El `.env.example` de la Fase 1 debe incluir estas cuatro **además** de las del plan.

`.gitignore` ya excluye `.env*`. Revisé el historial de git (23 commits) sin encontrar archivos `.env` versionados.

---

## 5. Riesgos y hallazgos que afectan al funnel

Ordenados por impacto. **Ninguno se corrige en esta fase** (la Fase 0 no toca código de la app).

### Críticos para pagos y seguridad

1. **`typescript.ignoreBuildErrors: true`** en `next.config.ts`. El build de Vercel publica aunque haya errores de tipos. Con lógica de pagos y permisos esto es peligroso: un error de tipos en el webhook de Wompi llegaría a producción sin aviso. **Propuesta:** desactivarlo al inicio de la Fase 1, después de corregir los errores que existan hoy.
2. **HTML sin escapar en los correos.** `api/contact`, `api/cotizador` y `api/lead-magnet` insertan `name`, `company`, `message`, etc. directamente en el HTML. Cualquiera puede inyectar enlaces o HTML en correos que salen del dominio de Fotoeditores. Los correos del funnel (Fase 6) deben escapar todo, y conviene corregir también los tres existentes.
3. **El total del Cotizador se calcula en el navegador** y el servidor lo acepta tal cual (`total`, `copRate` en `api/cotizador`). Para una cotización por correo es aceptable, pero **este patrón no se puede copiar al funnel**: el plan exige que el precio salga siempre de la base de datos.
4. **`/api/chat` no tiene límite de tasa** y cada llamada cuesta dinero (API de Anthropic). Tampoco limita cuántos mensajes se envían. Encaja en la revisión de la Fase 8.

### Conflictos con el diseño del funnel

5. **Widgets flotantes en todas las páginas.** `ChatWidget` ocupa `fixed bottom-6 right-6`: es justo donde irá el botón flotante de WhatsApp de la Fase 2. `LeadMagnetPopup` aparece tras un temporizador en **cualquier** página (incluido lo que será el asistente de pedido), lo que interrumpiría a alguien a mitad de una subida o un pago. Ver pregunta 2.
6. **El layout raíz monta Navbar, Footer, chat, popup y Cotizador en todas las rutas.** Para `/pedido/*` y `/admin` conviene un layout propio (menos distracciones en el pedido; sin navegación pública en el panel). La forma limpia en App Router es separar con **grupos de rutas** (`app/(sitio)/…`, `app/(funnel)/…`), lo que implica mover las páginas actuales dentro de un grupo. Las URLs no cambian, pero es un movimiento de archivos grande. Ver pregunta 3.
7. **Las páginas de contenido son componentes cliente** (`"use client"` en toda la página), por eso `/ejemplos`, `/contacto`, `/tecnologia` y `/nuestro-adn` no pueden exportar `metadata` y comparten el título genérico del layout. Las landings del funnel deben ser **componentes de servidor** (metadatos, datos estructurados, lectura de `packages`) con partes cliente solo donde haga falta (divisor, animaciones).
8. **Moneda.** Todo el sitio muestra USD (paquetes desde 99 USD/mes, Cotizador en USD con opción COP). El funnel cobra en COP. Hay que decidir cómo se muestran juntos sin confundir. Ver pregunta 5.

### Rendimiento (criterio de Lighthouse ≥ 85 en móvil)

9. **`public/` pesa 260 MB y todo está en git.** Los medios de `/ejemplos` suman unos 210 MB: videos de 6–33 MB (`pastel_despues.mp4` pesa 33 MB), fotos "antes" de 8–17 MB (`nina_antes.jpg` 16,8 MB) y retratos del equipo de hasta 24,7 MB (`mauricio_macias.png`). `next/image` optimiza las imágenes al servirlas, pero **los videos se descargan completos** y además hay `.mov` duplicados de cada `.mp4`. Si las landings reutilizan estos videos tal cual, será difícil pasar de 85 en móvil. **Propuesta para la Fase 2:** versiones comprimidas para web (videos de 1–3 MB, `preload="none"` y póster) y dejar los originales fuera del repositorio.
10. `next.config.ts` permite imágenes remotas de **cualquier** dominio (`hostname: "**"`). Es innecesario y permite usar el optimizador de imágenes de Vercel como proxy abierto. Conviene restringirlo.

### Configuración y deuda menor

11. **Dos archivos de PostCSS en conflicto:** `postcss.config.js` (Tailwind 3, correcto para las dependencias instaladas) y `postcss.config.mjs` (usa `@tailwindcss/postcss`, que es Tailwind 4 y **no está en `package.json`**). No pude verificar cuál toma Next sin instalar dependencias. Lo compruebo con el primer build de la Fase 1; seguramente hay que borrar el `.mjs`.
12. **Teléfono de relleno en un correo real:** `api/cotizador` envía a los clientes `CONTACT_PHONE = "+57 300 000 0000"`. Se corrige cuando se defina el número de WhatsApp de negocio (Fase 1, variable `NEXT_PUBLIC_WHATSAPP_NUMBER`).
13. **Promesas comerciales sin política escrita:** el chat promete "probar el servicio sin riesgo por 14 días" y el correo del Cotizador describe una devolución a 7 días con condiciones. El plan pide no publicar promesas de reembolso sin una política definida; la del funnel tiene que ser coherente con estas o reemplazarlas.
14. **Sin `sitemap.xml` ni `robots.txt`.** Las landings de anuncios se benefician de estar en un sitemap. Tarea pequeña de la Fase 2.
15. **Next 16 cambió el nombre de `middleware.ts` a `proxy.ts`.** Si se usa para proteger `/admin` (Fase 5), hay que seguir la convención de Next 16. Lo verifico en la documentación de la versión instalada antes de implementarlo.
16. El `README.md` es la plantilla por defecto de `create-next-app`.

---

## 6. Convenciones del repositorio y nombres de rutas

- Las páginas públicas usan **español en kebab-case** (`/nuestro-adn`, `/contacto`, `/ejemplos`). Las rutas del plan (`/fotos-de-producto-con-ia`, `/recupera-tus-fotos`, `/pedido/nuevo`, `/pedido/[token]`, `/terminos`, `/privacidad`, `/politica-de-ajustes`) **ya siguen esa convención**. Además, `/terminos` y `/privacidad` coinciden con los enlaces que el footer ya tiene.
- Las rutas API mezclan idiomas (`/api/contact` en inglés, `/api/cotizador` en español). Propongo **mantener los endpoints del plan tal cual** (`/api/orders`, `/api/wompi/events`, `/api/admin/…`).
- Alias de importación `@/*` apuntando a la raíz (`@/components/…`, `@/lib/…`).
- Componentes en `components/` con PascalCase, un componente por archivo, exportación por defecto.
- Módulos de datos y utilidades en `lib/`; contextos de React en `context/`.
- Mensajes de commit estilo Conventional Commits en español: `feat(cotizador): …`, `fix(cotizador): …`.

**Propuesta: sin cambios a los nombres de rutas de la sección 7 del plan.**

---

## 7. Plan de cambios mínimo (por fase)

| Fase | Cambios sobre código existente |
|---|---|
| 1 | `npm install` y confirmar que `npm run build` pasa. Resolver el conflicto de PostCSS. Corregir errores de tipos y quitar `ignoreBuildErrors`. Crear `.env.example` (variables del plan + las 4 actuales). Añadir un framework de pruebas (Vitest para unidades; Playwright se suma en la Fase 8). Todo lo demás es **código nuevo**: `lib/supabase/*`, `lib/env.ts`, `supabase/migrations/*` |
| 2 | Mover `MediaBox` a `components/` y los datos de casos a `lib/ejemplos.ts` (con `segment`); prop de proporción en `BeforeAfterSlider`. Crear las dos landings como componentes de servidor. CTA "Quiero algo así" por caso en `/ejemplos`. Enlaces a `/ejemplos` y al funnel en el menú. Medios comprimidos. `sitemap.ts` y `robots.ts` |
| 3–5 | Código nuevo en `app/(funnel)/pedido/*`, `app/admin/*`, `app/api/orders/*`, `app/api/wompi/*`, `app/api/admin/*`. Layout del funnel sin chat ni popup (según la respuesta a la pregunta 2/3) |
| 6 | Plantillas en `emails/` con escape de HTML; aplicar el mismo escape a los tres endpoints de correo existentes |
| 7 | Páginas legales (resuelven los 404 del footer); GA4, Meta Pixel y CAPI |
| 8 | Límite de tasa en `/api/chat` y en los endpoints públicos nuevos; restringir `images.remotePatterns` |

---

## 8. Dudas para Edgar

1. **Rama `mejoras-diseno`.** En `origin` hay 3 commits que no están en `main`. ¿Se van a fusionar antes de empezar el funnel? Si cambian el diseño, conviene integrarlos primero para no reutilizar componentes que luego cambien.
2. **Chat y popup en el funnel.** Propongo **ocultar `LeadMagnetPopup` y `ChatWidget` en `/pedido/*` y `/admin`**, y en las landings **reemplazar el chat por el botón flotante de WhatsApp** (que pide el plan) para que no se tapen. ¿De acuerdo, o prefieres conservar el chat de IA en las landings?
3. **Grupos de rutas.** Para que `/pedido` y `/admin` tengan un layout propio, propongo mover las páginas actuales a `app/(sitio)/` (las URLs no cambian). La alternativa es no mover nada y ocultar elementos según la ruta desde el layout raíz: menos cambios hoy, más condicionales después. **Recomiendo los grupos de rutas.** ¿Lo apruebas?
4. **Componentes compartidos.** ¿Extraigo solo lo necesario para el funnel (`MediaBox`, datos de casos, proporción del divisor), o prefieres que también unifique los campos de formulario y los botones en componentes compartidos? Recomiendo **solo lo necesario**, para no tocar páginas que hoy funcionan.
5. **USD y COP.** El home y `/tecnologia` venden en USD/mes; el funnel cobra en COP por proyecto. ¿Las landings muestran solo COP? ¿Se ajusta el resto del sitio o se deja en USD?
6. **Videos pesados.** ¿Puedo generar versiones comprimidas de los videos de `/ejemplos` para las landings (y más adelante para `/ejemplos`)? ¿Los originales de alta calidad existen fuera del repositorio, por ejemplo en Drive, para poder sacarlos de git más adelante?
7. **Supuesto de Resend.** El sitio ya envía desde `contacto@fotoeditores.com` con Resend, así que el dominio parece verificado. ¿Confirmas Resend para el funnel y la dirección `pedidos@fotoeditores.com`?
8. **Política de devolución existente.** El correo del Cotizador ya promete devolución a 7 días con condiciones, y el chat ofrece "14 días sin riesgo". ¿Siguen vigentes? La política de ajustes del funnel debe ser coherente con ellas o reemplazarlas.
9. **Commits.** El plan pide trabajar en `funnel/fase-N`. ¿Hago commit de `docs/FUNNEL_PLAN.md`, `docs/AUDITORIA.md` y `CLAUDE.md` en la rama `funnel/fase-0` cuando apruebes esta auditoría?

---

## 9. Decisiones de Edgar (24 de septiembre de 2026)

**Estas decisiones prevalecen sobre `FUNNEL_PLAN.md` donde lo contradigan.**

| # | Tema | Decisión | Fase en la que se aplica |
|---|---|---|---|
| 1 | Rama `mejoras-diseno` | **No se fusiona.** Salió de una versión de abril y `main` ya tiene versiones posteriores de sus cambios (arreglo del divisor con Pointer Events, Cotizador como modal en lugar del enlace externo a `funnel-fotoeditores.vercel.app`, navbar en `lg`). Fusionarla haría retroceder el sitio. Se rescatan dos cosas: su `vercel.json` (cabeceras de seguridad, región `gru1`, `no-store` en `/api`) y el borrado de `postcss.config.mjs` | 1 |
| 2 | Chat y popup | Se **ocultan en `/pedido/*` y `/admin`**. En las landings, el botón flotante de WhatsApp ocupa la esquina que hoy usa el chat | 2–3 |
| 3 | Estructura de carpetas | **Aprobados los grupos de rutas** (`app/(sitio)/…`, layout propio para el pedido y el panel). Las URLs no cambian | 2 |
| 4 | Componentes compartidos | **Unificar formularios y botones** en componentes compartidos, diseñados a partir de lo que necesita el funnel, y migrar a ellos las páginas existentes (Cotizador, `/contacto`) | 2–3 |
| 5 | Moneda | **Todos los precios se muestran en USD**, en el sitio y en el funnel. Como Wompi solo cobra en COP, el servidor convierte al pagar: `packages` guarda `price_usd`, y el pedido guarda `amount_usd`, la tasa usada (`fx_rate`) y `amount_cop`. La firma de Wompi se calcula sobre `amount_cop`. El cliente ve algo como "USD 25 (≈ COP 102.000)" antes de pagar. Queda pendiente decidir si se añade un margen sobre la tasa para cubrir la variación del dólar | 1 (modelo de datos), 4 (cobro) |
| 6 | Videos | Se crean **versiones comprimidas** para web. Edgar entregará después los originales en alta calidad | 2 |
| 7 | Correo | **Se usa Resend.** El código actual ya envía desde `contacto@fotoeditores.com`, así que probablemente ya existe una cuenta. En la Fase 1 se verifica quién es su dueño y se entrega el paso a paso para dejarla a nombre del negocio y habilitar `pedidos@fotoeditores.com` | 1 |
| 8 | Devoluciones | **7 días.** Se retira la promesa de "14 días sin riesgo" del chat (`app/api/chat/route.ts`) y la política del funnel se alinea con la del correo del Cotizador | 7 (antes si se publica el funnel) |
| 9 | Commits | Commit de la Fase 0 en la rama `funnel/fase-0`. Cada fase se fusiona a `main` después de revisar su preview en Vercel | — |

### Decisiones tomadas durante la Fase 2 (24 de septiembre de 2026)

| # | Tema | Decisión |
|---|---|---|
| 10 | CTA antes del asistente | Mientras no exista `/pedido/nuevo` (Fase 3), "Empieza tu pedido" abre WhatsApp con el paquete y el precio escritos (`components/landing/PackageCards.tsx`). En la Fase 3 el enlace pasa a `/pedido/nuevo?paquete=<slug>` |
| 11 | Precios | **Confirmados por Edgar** los valores de `supabase/migrations/…_seed_packages_provisional.sql` como definitivos: USD 9, 59, 149, 39, 99, 29 y "a la medida" por cotización. (El nombre y los comentarios de esa migración dicen "provisional" porque ya estaba aplicada; los cambios futuros de precio van en una migración nueva) |
| 12 | Testimonios del home | Se conservan tal como están, por decisión de Edgar. Las landings no los reutilizan |
| 13 | Menú | En escritorio "Inicio" lo cumple el logo; menú completo desde 1280 px y hamburguesa por debajo (arregla la superposición que existía en producción) |
| 14 | Mediciones | Lighthouse se mide sobre la preview de Vercel con `VERCEL_AUTOMATION_BYPASS_SECRET` (en `.env.local`, nunca en el repositorio). En preview el SEO sale bajo por el `noindex` de Vercel: es esperado |

### Cambios al plan que se derivan de la decisión 5

- Sección 6, tabla `packages`: `price_cop` pasa a ser `price_usd`.
- Sección 6, tabla `orders`: `amount_cop` se complementa con `amount_usd` y `fx_rate`.
- Sección 5.3: "Monto en centavos" se calcula a partir de `amount_cop`, que se fija en el servidor al crear el intento de pago. La tasa **nunca** llega desde el navegador.
- Sección 7 (medición): el evento `purchase` se reporta en USD, que es el precio de referencia.
- La tasa se obtiene en el servidor. Se puede partir de `app/api/exchange-rate/route.ts`, que ya consulta `open.er-api.com` con caché de 6 horas, pero el valor de respaldo fijo (`4200`) no sirve para cobrar: si no hay tasa confiable, el pago no se inicia.
