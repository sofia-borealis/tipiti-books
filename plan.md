# Tipiti Books — Plan de Comprensión del Proyecto

> **Generado:** 2026-02-26
> **Basado en:** PDR v3.0, Tech Spec v2.0, User Stories v1.0, Wireframes v1.0, Stitch Prompts v1.0, Blueprint v1.0

---

## Qué es Tipiti Books

Tipiti Books es una plataforma e-commerce chilena que vende libros infantiles personalizados con ilustraciones de alta calidad estilo acuarela. El problema que resuelve es claro: los libros personalizados de calidad (como Wonderbly) cuestan $60+ USD enviados a Chile/LATAM, y las opciones locales tienen ilustraciones genéricas tipo "AI slop". Tipiti Books ofrece personalización real del personaje + calidad artística premium + precio accesible (~$29.990 CLP / ~$40 USD).

El comprador (padres, abuelos, tíos — 25-45 años) entra al sitio, elige un libro del catálogo, configura un personaje que se parece al niño/a destinatario (género, piel, pelo, lentes), escribe una dedicatoria, ve un preview animado page-flip del libro personalizado, y paga. Recibe el libro impreso en casa en 8-12 días. La experiencia debe sentirse como entrar a una librería artesanal bohemia, no como un e-commerce genérico.

El negocio es operado por Sofi, mamá emprendedora que gestiona todo desde un panel admin: crea libros, define escenas, lanza la pre-generación de variantes con IA, cura manualmente las ilustraciones (aprueba/rechaza), gestiona pedidos y descuentos. El modelo es B2C directo al consumidor, con un catálogo que empieza con 1 libro ("Buenas Noches, {nombre}") y crece progresivamente.

---

## Arquitectura de 3 Capas

El corazón técnico del producto es una arquitectura de 3 capas independientes que se crean, escalan y versionan por separado:

### Capa 1 — El Cuento (por libro del catálogo)
- Define la estructura narrativa: escenas, ambientes, setting sheets, textos.
- Se crea y cura UNA vez por libro. Es el "template".
- Vive en las tablas `books` y `scenes`.
- Ejemplo: "Buenas Noches" tiene 11 escenas con descripciones visuales, posiciones de cámara, emociones, y texto narrativo con placeholder `{name}`.

### Capa 2 — El Personaje / Variantes (pre-generadas, ~80 por libro)
- Las ilustraciones del personaje en cada escena, pre-generadas con FLUX Kontext Pro.
- Se generan UNA vez por libro (~880 imágenes = 80 variantes × 11 páginas).
- Costo fijo total: ~$35 USD por libro (una sola vez).
- Vive en `character_variants` y `variant_pages`.
- Las variantes se curan manualmente (Sofi aprueba/rechaza antes de publicar).

### Capa 3 — Texto Personalizado (por compra, dinámico)
- El nombre del niño/a y la dedicatoria.
- Se superpone como texto sobre las ilustraciones al momento de la compra.
- Costo: $0. Escala infinita.
- NUNCA es parte de la imagen generada. Los prompts de IA incluyen `NO text, NO letters, NO words`.

**Implicación clave:** Agregar un idioma = solo Capa 3. Corregir un texto = solo Capa 3. Las 880 ilustraciones no se tocan.

---

## Modelo de Pre-Generación (Determinismo)

El principio fundamental es: **dos compradores que eligen la misma variante reciben ilustraciones IDÉNTICAS. No hay randomness.**

### Combinatoria de Variantes (V1)

| Atributo | Opciones | Valores |
|----------|----------|---------|
| Género | 2 | niño, niña |
| Tono de piel | 3 | claro, mate, oscuro |
| Color de pelo | variable* | rubio, castaño, pelirrojo, negro |
| Tipo de pelo | 2 | liso, ondulado |
| Lentes | 2 | sí, no |

*No todas las combinaciones piel-pelo son válidas (biológicamente plausibles):
- Claro: 4 colores (rubio, castaño, pelirrojo, negro)
- Mate: 4 colores
- Oscuro: solo negro

**Total: ~80 variantes por libro × 11 páginas = 880 imágenes**

### El Flujo de Sofi (Pre-generación)

1. Sofi crea un libro en admin (Capa 1): título, escenas, textos, setting sheet.
2. Configura el motor de IA (FLUX Kontext Pro por defecto, configurable por libro).
3. Lanza "Generar Variantes" → Inngest batch job genera las 880 imágenes.
4. Sofi revisa cada variante (11 páginas) en un grid visual.
5. Aprueba las buenas, rechaza/regenera las malas.
6. Cuando tiene suficientes variantes aprobadas, publica el libro al catálogo.
7. Al publicar, los compradores ya pueden personalizar y comprar.

### Determinismo en Compra

Al comprar, el sistema hace un `findVariant()` que busca en `character_variants` la variante aprobada que coincide exactamente con los atributos seleccionados. No se genera nada nuevo. Se superpone el texto (Capa 3) y se compone el PDF para impresión.

---

## Stack Técnico

| Tecnología | Versión | Justificación |
|-----------|---------|---------------|
| **Next.js** | 16 | App Router + Server Components para catálogo SSR. Server Actions para mutaciones. RSC reduce JS al cliente. Turbopack por defecto. |
| **TypeScript** | 5.x | Strict mode. Contratos tipados entre frontend, backend y Supabase. |
| **Tailwind CSS** | 4.x | Utility-first, mobile-first responsive. Rápido de iterar. |
| **shadcn/ui** | latest | Componentes accesibles como base. Personalizados con Design System Tipiti. |
| **Zustand** | latest | Estado local del configurador (wizard). Ligero, sin boilerplate. |
| **Framer Motion** | latest | Animaciones suaves (page transitions, hover states, page-flip). |
| **Zod** | latest | Validación de inputs (nombre, dedicatoria, checkout form). |
| **Supabase** | latest | PostgreSQL + Auth + Storage + RLS. Backend completo sin servidor propio. |
| **Inngest** | latest | Background jobs deterministas (batch generation, PDF composition). |
| **Flow.cl** | - | Gateway de pagos principal para Chile (tarjeta, transferencia). |
| **MercadoPago** | - | Gateway de pagos alternativo (fallback). |
| **Resend** | latest | Emails transaccionales (confirmación, envío, admin). |
| **Sharp** | latest | Text overlay sobre imágenes para composición. |
| **pdf-lib** | latest | Ensamblaje del PDF final para impresión. |
| **fal.ai** | - | API para FLUX Kontext Pro (generación de imágenes). |
| **Vercel** | - | Hosting, Edge Functions, auto-deploy desde GitHub. |
| **Sentry** | latest | Monitoreo de errores en producción. |
| **PostHog** | latest | Analytics de producto (opcional V1). |

**Nota:** El template actual del proyecto ya tiene Next.js 16 + React 19. Tailwind está en 3.4 y se actualizará a 4.x en la Fase 1.

---

## Flujo del Comprador (Happy Path)

```
1. Visitante llega a Landing Page (/)
   → Ve hero emocional, historia de Sofi, "cómo funciona", galería de spreads
   → Puede suscribirse a waitlist (email)

2. Click "Crea tu libro" → /catalogo
   → Ve grid de libros disponibles (portada acuarela, precio, edad)

3. Click "Personalizar" → /libro/buenas-noches
   → Ve detalle: galería spreads, descripción, FAQs, precio
   → Click "Personalizar este libro"

4. Wizard de 4 pasos → /libro/buenas-noches/personalizar
   → Paso 1: Nombre del niño/a (input con live preview)
   → Paso 2: Apariencia (género, piel, pelo, lentes) con preview del personaje
   → Paso 3: Dedicatoria (textarea con preview handwritten)
   → Paso 4: Resumen de selecciones (editable)

5. Preview Page-Flip → /libro/buenas-noches/preview
   → Ve las 11 páginas con animación de libro (WOW moment)
   → Nombre superpuesto en las páginas
   → CTA "Comprar por $29.990"

6. Checkout → /checkout
   → Datos de envío (nombre, email, teléfono, dirección)
   → Código de descuento (TIPITI20 = 20% off)
   → Selección de método de pago (Flow.cl o MercadoPago)

7. Pago → Redirect a Flow.cl / MercadoPago
   → Webhook confirma pago
   → Composición PDF automática (Inngest job)

8. Success → /pago/success
   → Ticket de compra (número pedido, monto, dirección)
   → Email de confirmación al comprador
   → Email de notificación a Sofi

9. Recibe el libro impreso en 8-12 días
```

---

## Flujo del Admin (Sofi)

```
1. Login → /admin/login
   → Email + password (sofi@tipitibooks.com)
   → JWT en httpOnly cookie

2. Dashboard → /admin/dashboard
   → Métricas: ventas hoy/semana, pedidos pending, variantes aprobadas
   → Alertas: pedidos atrasados (>3 días en "paid")
   → Gráfico: ventas por día

3. Gestión de Libros → /admin/libros
   → CRUD de libros (título, descripción, edad, precio, motor IA)
   → Editor de escenas: textos narrativos con {name}, descripción visual
   → Drag & drop para reordenar escenas
   → Upload de setting sheets

4. Pre-generación → /admin/generacion
   → Botón "Generar Variantes" → lanza Inngest batch (80 variantes × 11 páginas)
   → Monitor en tiempo real: progreso, errores, reintentos
   → Regenerar variante individual si se ve mal

5. Curación → /admin/libros/[bookId]/variantes
   → Grid 6 columnas con thumbnails de las 80 variantes
   → Click en variante → galería de 11 páginas
   → Aprobar/Rechazar/Regenerar individual o en bulk
   → Comparar versiones side-by-side

6. Gestión de Pedidos → /admin/pedidos
   → Tabla filtrable: status, fecha, buyer
   → Detalle pedido: timeline visual, buyer info, PDF download
   → Cambiar estado manualmente (paid → printing → shipped)
   → Agregar tracking number

7. Descuentos → /admin/descuentos
   → CRUD de códigos (TIPITI20, tipo %, max uses, expiration)

8. Suscriptores → /admin/suscriptores
   → Lista de emails con fuente (website/checkout)
   → Exportar CSV
```

---

## Riesgos Técnicos Identificados

| # | Riesgo | Prob. | Impacto | Mitigación |
|---|--------|-------|---------|-----------|
| 1 | **Upgrade Tailwind 3.4 → 4** | Media | Bajo | El template tiene Tailwind 3.4. Actualizar a 4.x en Fase 1 (cambios en config y imports CSS). Next.js 16 y React 19 ya están correctos. |
| 2 | **Delays en pre-generación FLUX** | Media | Alto | Batch temprano (Fase 6), paralelizar con Inngest. Tener fallback si fal.ai tiene downtime. |
| 3 | **Flow.cl integración compleja** | Baja | Medio | Usar sandbox temprano. La documentación de Flow.cl es buena pero hay que manejar webhooks y HMAC verification. |
| 4 | **Text overlay en imágenes** | Media | Medio | Sharp para superponer texto requiere calcular posiciones pixel-perfect sobre las ilustraciones. Necesita calibración por escena. |
| 5 | **RLS policies incorrectas** | Baja | Alto | Las variantes pending/generating no deben ser públicas. Testear exhaustivamente en Fase 1. |
| 6 | **PDF composition performance** | Media | Medio | 11 imágenes hi-res + text overlay + ensamblaje PDF puede ser pesado. Inngest background job es correcto. |
| 7 | **Page-flip animation en mobile** | Baja | Medio | Librerías como react-pageflip pueden ser pesadas. Evaluar alternativas ligeras. |
| 8 | **Estructura de carpetas** | Media | Bajo | El CLAUDE.md actual usa Feature-First, pero el Tech Spec define una estructura diferente (src/app + src/components + src/lib). Seguir el Tech Spec. |

---

## Preguntas y Ambigüedades

1. **Versiones confirmadas:** Next.js 16 + React 19 + Tailwind 4. El template ya tiene Next.js 16 y React 19 correctos. Solo falta actualizar Tailwind de 3.4 a 4.x en Fase 1.

3. **Estructura de carpetas:** El CLAUDE.md actual promueve Feature-First (src/features/), pero el Tech Spec define una estructura clásica (src/app/ + src/components/ + src/lib/).
   - **Decisión recomendada:** Seguir la estructura del Tech Spec §3.2 ya que toda la documentación (Blueprint, tareas) referencia esas rutas.

4. **Wizard routing:** El wireframe muestra `/libro/[slug]/personalizar?step=N` pero el Blueprint usa `/wizard/paso-N/page.tsx`. ¿Query params o rutas separadas?
   - **Decisión recomendada:** Seguir la estructura de carpetas del Blueprint (rutas separadas por paso) ya que facilita Server Components y navigation.

5. **Regions de Chile para checkout:** ¿Hay una lista específica de regiones/comunas que Sofi quiere soportar, o usamos las 16 regiones estándar?
   - **Decisión provisional:** 16 regiones estándar de Chile.

6. **Envío gratis sobre $25.000:** El wireframe del checkout menciona "Envío gratis para órdenes sobre $25.000" pero el precio base es $29.990. ¿Siempre es gratis entonces?
   - **Decisión provisional:** Sí, envío gratis para el precio base. El threshold aplica si hay descuentos que bajen el total.

7. **Inngest vs simple cron:** Para la composición de PDF post-pago, ¿Inngest es necesario o un Server Action directo funciona?
   - **Decisión:** Inngest es correcto porque la generación de variantes requiere batch processing real, y usarlo también para PDFs mantiene consistencia.

---

## Confirmación

**Entendí el proyecto. Estoy listo para empezar por la Fase 1.**

El proyecto es claro, bien documentado, y la arquitectura de 3 capas es elegante. El Blueprint tiene 8 fases con ~38 días de trabajo, desde el setup inicial hasta el deploy a producción. La prioridad es construir el happy path completo del comprador (landing → catálogo → wizard → preview → checkout → pago) y luego el admin para Sofi (CRUD libros → pre-generación → curación → pedidos).

Esperando confirmación para comenzar.
