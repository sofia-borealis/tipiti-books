# Tipiti Books — Technical Specifications

> **Tech Spec v2.0**
> **Estado**: BORRADOR
> **Fecha**: 2026-02-23
> **PDR de referencia**: PDR-tipiti-books.md v3.0
> **Documento de imágenes**: TIPITI-IMAGE-GENERATION-GUIDELINES.md v3.0

---

## 1. Resumen Ejecutivo

### Problema (del PDR)

Los libros infantiles personalizados de calidad cuestan $60+ USD enviados a Chile/LATAM, y las opciones locales tienen ilustraciones genéricas tipo "AI slop". No hay una opción que combine personalización real, calidad artística premium y precio accesible.

### Solución Técnica

Plataforma e-commerce con configurador de personaje que busca variantes pre-generadas (~80 combinaciones por libro), superpone textos personalizados (nombre + dedicatoria) y genera un PDF para impresión. Las ilustraciones se pre-generan via FLUX Kontext Pro (configurable por libro) y se curan manualmente antes de publicar al catálogo.

### Complejidad Estimada

**Medio** — E-commerce B2C con integraciones externas (pagos Flow.cl, generación de imágenes, email), panel de admin con pipeline de pre-generación batch, y motor de composición de archivos para impresión. No requiere tiempo real, multi-tenancy, ni alta disponibilidad en V1.

---

## 2. Stack Tecnológico

### 2.1 Tabla Resumen

| Capa | Tecnología | Versión | Justificación |
|------|-----------|---------|---------------|
| Framework | Next.js | 15 | App Router + Server Components para catálogo SSR. Server Actions para mutaciones. RSC reduce JS al cliente en páginas de catálogo. |
| Language | TypeScript | 5.x | Strict mode. Contratos tipados entre frontend, backend y Supabase. |
| Styling | Tailwind CSS | 4.x | Utility-first, ideal para mobile-first responsive. Rápido de iterar. |
| Components | shadcn/ui | latest | Componentes accesibles, customizables, no-dependency. Perfecto para admin + storefront. |
| State Mgmt | Zustand | 5.x | Estado del configurador de personaje (selección + preview) necesita estado global entre componentes. Ligero. |
| Animations | Framer Motion | 12.x | Transiciones del configurador de personaje, page flip preview, micro-interactions de la landing. |
| Validation | Zod | 3.x | Schemas compartidos client/server. Validación de formularios y API inputs. |
| Backend | Supabase | latest | Auth + PostgreSQL + Storage + Edge Functions. Todo-en-uno reduce complejidad operacional para MVP de 1 persona. |
| Database | PostgreSQL (via Supabase) | 15+ | Relacional, RLS nativo, JSONB para datos semi-estructurados. |
| Auth | Supabase Auth | latest | Email/password para admin. Guest checkout no requiere auth del comprador. |
| Storage | Supabase Storage | latest | 4 buckets: illustrations, illustrations-hires, character-sheets, setting-sheets. CDN integrado para servir previews. |
| Background Jobs | Inngest | latest | Orquestación multi-step del pipeline de pre-generación (80 variantes × 11 páginas). Reintentos, concurrency control, observabilidad. |
| Payments | Flow.cl | latest | Inline/popup API (sin redirect). Principal proveedor en Chile. Tarjetas + Webpay + transferencia. |
| Payments Secondary | MercadoPago | latest | Checkout Pro (redirect). Opción secundaria para saldo MP y cuotas sin interés. |
| Email | Resend | latest | Emails transaccionales (confirmación, envío). API simple, React Email templates. |
| AI/Images | fal.ai (FLUX Kontext Pro) | latest | Pre-generación de ilustraciones. Configurable por libro. Solo usado en admin, no en flujo de compra. |
| Image Processing | Sharp | latest | Composición de texto sobre ilustraciones. Generación de PDF para impresión. |
| PDF Generation | @react-pdf/renderer o pdf-lib | latest | Composición del archivo final para impresión (ilustraciones + texto + dedicatoria). |
| Upscaling | Real-ESRGAN via fal.ai | latest | Upscale de ilustraciones a resolución de impresión (300 DPI). |
| Analytics | PostHog | latest | Funnel de conversión, eventos custom. Self-hosteable si crece. |
| Monitoring | Sentry | latest | Error tracking frontend + serverless functions. Alertas en Slack. |
| Hosting | Vercel | - | Deploy automático desde GitHub. Edge network. Integración nativa con Next.js. |
| Testing | Vitest + Playwright | latest | Unit tests (Vitest) + E2E del flujo de compra (Playwright). Coverage mínimo en MVP. |

### 2.2 Decisiones Técnicas Importantes

**Inngest sobre Supabase Edge Functions para background jobs**
- Razón: El pipeline de pre-generación requiere orquestación multi-step (portrait → character sheet → setting sheet → 11 páginas × 80 variantes = 880+ imágenes). Inngest maneja reintentos, concurrency, timeouts y observabilidad out-of-the-box.
- Trade-off: Dependencia adicional. Capa gratuita de Inngest es generosa (25K events/mes).
- Reevaluar si: Solo necesitamos jobs simples sin orquestación compleja.

**Zustand sobre URL state / Context para el configurador**
- Razón: El configurador tiene ~6 campos interdependientes que afectan el preview en tiempo real. Zustand permite un store limpio con derivaciones (lookup de variante) sin prop-drilling.
- Trade-off: Dependencia adicional (3KB gzipped).
- Reevaluar si: El configurador se simplifica a <3 campos.

**Flow.cl (inline/popup API) sobre MercadoPago Checkout Pro (redirect) como PRIMARY**
- Razón: Flow.cl es el gateway dominante en Chile con API REST moderna, inline/popup que no requiere redirect, mejor UX. MercadoPago es fallback secundario para usuarios con saldo MP.
- Trade-off: Dos integraciones de pago. Mayor costo de mantenimiento.
- Reevaluar si: Tasa de adopción de Flow.cl es <10% (mantener solo MercadoPago).

**Sharp + pdf-lib sobre Puppeteer/Chrome para composición de PDF**
- Razón: Composición directa de imágenes + texto es más rápida y ligera que renderizar HTML a PDF. Sharp maneja la superposición de texto, pdf-lib ensambla las páginas.
- Trade-off: Menos flexibilidad en layout que HTML-to-PDF.
- Reevaluar si: El diseño de página requiere layouts muy complejos con CSS.

**Pre-generación por variantes sobre generación on-demand**
- Razón: $0 de costo de IA por venta (vs $1-2), preview instantáneo, calidad curada y garantizada, no depende de fal.ai uptime para ventas.
- Trade-off: Costo fijo inicial (~$35-100 por libro), 880 imágenes que almacenar y curar.
- Reevaluar si: V2 introduce segundo personaje (80² = 6,400 combinaciones). Modelo híbrido recomendado.

**Dimensiones en mm (configurable) sobre fixed**
- Razón: Permite per-book customization de tamaño de página sin código. 220mm × 180mm (22×18 cm) por defecto.
- Trade-off: Complejidad en pipeline de composición.

**Motor de IA configurable por libro (configurable engine)**
- Razón: Permite cambiar de FLUX Kontext Pro a otros modelos (ej: DALL-E 3, Stable Diffusion XL) sin migrar schema. Futura A/B testing de calidad.
- Trade-off: Prompt builder debe adaptar prompts por engine.

### 2.3 Lo Que NO Se Incluye (y por qué)

| Tecnología | Razón de exclusión | Agregar en |
|------------|-------------------|------------|
| Redis/Upstash | No se necesita rate limiting ni caché agresivo con <100 usuarios iniciales | Fase 2 si hay abuso |
| tRPC | Server Actions de Next.js cubren las necesidades de API. No hay consumidor externo. | Fase 3 si se necesita API pública |
| WebSockets / Realtime | No hay funcionalidad que requiera tiempo real para el comprador | Fase 2 si se agrega tracking live |
| WhatsApp API | Canal de notificación secundario | Fase 2 |
| Stripe | Flow.cl + MercadoPago son el estándar en Chile. Stripe no tiene igual penetración local. | Fase 3 expansión internacional |
| Docker | Vercel maneja el deploy. No se necesita containerización en V1. | Fase 3 si se migra a VPS |
| LoRA Training | El estilo se logra con prompts optimizados en V1 | Fase 2 para estilo Tipiti propio |

---

## 3. Arquitectura

### 3.0 Principio Fundacional: Arquitectura de 3 Capas Independientes + Determinismo

Toda la arquitectura técnica de Tipiti Books se deriva de un principio central: el producto se compone de **3 capas que se crean, escalan y versionan de forma totalmente independiente**, con énfasis en **determinismo** en la pre-generación (seeds fijos, sin randomness).

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CAPA 3 — TEXTO PERSONALIZADO (varía por compra)                        │
│  ─────────────────────────────────────────────────────────────────────  │
│  Nombre del niño ({name}), dedicatoria, idioma.                         │
│  Se compone al instante por string replacement. Costo por venta: $0.    │
│  Escala: infinita. No toca imágenes.                                    │
│  DB: orders.child_name + orders.dedication + scenes.text_narrative      │
│  Runtime: composición server-side (Sharp + pdf-lib)                     │
├─────────────────────────────────────────────────────────────────────────┤
│  CAPA 2 — PERSONAJE (~80 combinaciones fijas, DETERMINISTAS)           │
│  ─────────────────────────────────────────────────────────────────────  │
│  Ilustraciones pre-generadas con IA configurable (FLUX Kontext Pro),    │
│  curadas por Sofi. Seeds fijos en DB para reproducibilidad. Se genera  │
│  UNA vez por libro del catálogo. Costo fijo: ~$35-100 USD.             │
│  Escala: fija (~80 combinaciones en V1).                                │
│  DB: character_variants + variant_pages                                  │
│  Storage: buckets illustrations + illustrations-hires + portraits +      │
│           character-sheets                                              │
├─────────────────────────────────────────────────────────────────────────┤
│  CAPA 1 — EL CUENTO (varía por libro del catálogo)                     │
│  ─────────────────────────────────────────────────────────────────────  │
│  Escenas, ambientes (setting sheet), composición visual, easter eggs,   │
│  narrativa. Se crea y cura UNA vez por título. Escala: Sofi agrega     │
│  nuevos libros. Es el "template" inmutable que alimenta las otras dos.  │
│  DB: books + scenes                                                      │
│  Storage: setting-sheets bucket                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Implicaciones técnicas de la separación:**

| Operación | Capas afectadas | Capas NO afectadas |
|-----------|----------------|-------------------|
| Agregar un libro al catálogo | Capa 1 (crear escenas + setting sheet) + Capa 2 (pre-generar 80 variantes) | Capa 3 (funciona automáticamente) |
| Agregar un idioma (V2) | Capa 3 (agregar campo en `text_narrative` JSONB) | Capa 1 y 2 (ilustraciones no cambian) |
| Corregir un texto narrativo | Capa 1 (editar `scenes.text_narrative`) | Capa 2 y 3 (ilustraciones y composición no cambian) |
| Mejorar una ilustración | Capa 2 (regenerar `variant_pages` específica con seed fijo) | Capa 1 y 3 (cuento y textos no cambian) |
| Nueva venta | Capa 3 (componer texto + imagen) | Capa 1 y 2 (ya existen, solo se leen) |
| Cambiar motor IA (V1.5) | Capa 2 (reconfigurar engine en books.generation_engine) | Capa 1 y 3 |
| Segundo personaje (V2) | Capa 2 (modelo híbrido: pre-gen + on-demand) | Capa 1 (escenas se adaptan) + Capa 3 (segundo {name}) |

Esta separación se refleja directamente en el schema de DB (§4), la estructura de Storage (§4.3), el pipeline de Inngest (§3.4), y las API specifications (§5).

### 3.1 Diagrama de Alto Nivel

```
┌─────────────┐         ┌──────────────────────────┐         ┌──────────────┐
│   Comprador │         │       Next.js 15          │         │   Supabase   │
│   (Mobile)  │────────▶│   Vercel (App Router)     │────────▶│  PostgreSQL  │
│             │◀────────│                            │◀────────│  Auth        │
└─────────────┘         │  ┌─────────┐ ┌──────────┐│         │  Storage     │
                        │  │ Store-   │ │ Admin    ││         └──────────────┘
                        │  │ front    │ │ Panel    ││                │
                        │  └─────────┘ └──────────┘│                │
                        └──────────┬───────────────┘                │
                                   │                                │
                    ┌──────────────┼────────────────┐              │
                    │              │                 │              │
                    ▼              ▼                 ▼              │
             ┌────────────┐   ┌──────────────┐   ┌──────────────┐ │
             │  Flow.cl   │   │   Inngest     │   │    Resend    │ │
             │  (Pagos)   │   │  (Jobs batch  │   │   (Email)    │ │
             └────────────┘   │  pre-gen)     │   └──────────────┘ │
                      ▲        └──────┬───────┘                     │
                      │               │                             │
                      │        ┌──────▼───────┐                     │
            ┌─────────┴────┐   │   fal.ai      │                     │
            │              │   │  FLUX Kontext │─── ilustraciones ──▶│
         MercadoPago      │   │  (configurable)    (Storage)
         (Secundario)    └─   │  + Real-ESRGAN│
                              └──────────────┘
```

### 3.2 Arquitectura de Carpetas

```
tipiti-books/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (storefront)/             # Grupo: páginas públicas
│   │   │   ├── page.tsx              # Landing / catálogo
│   │   │   ├── libro/[slug]/
│   │   │   │   ├── page.tsx          # Detalle del libro
│   │   │   │   └── personalizar/
│   │   │   │       └── page.tsx      # Configurador de personaje
│   │   │   ├── preview/[orderId]/
│   │   │   │   └── page.tsx          # Preview del libro personalizado
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx          # Resumen + redirect a Flow.cl
│   │   │   │   ├── success/page.tsx  # Post-pago exitoso
│   │   │   │   └── failure/page.tsx  # Post-pago fallido
│   │   │   ├── waitlist/
│   │   │   │   └── page.tsx          # Pre-launch landing
│   │   │   └── layout.tsx            # Layout storefront (nav, footer)
│   │   │
│   │   ├── admin/                    # Grupo: panel de administración
│   │   │   ├── layout.tsx            # Layout admin (sidebar, auth check)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Operational dashboard (pedidos, métricas)
│   │   │   ├── libros/
│   │   │   │   ├── page.tsx          # Lista de libros del catálogo
│   │   │   │   └── [bookId]/
│   │   │   │       ├── page.tsx      # Detalle del libro + escenas
│   │   │   │       ├── editor/
│   │   │   │       │   └── page.tsx  # Book editor: dimensiones, referencias, motor IA
│   │   │   │       ├── variantes/
│   │   │   │       │   └── page.tsx  # Grid de 80 variantes + estados
│   │   │   │       └── variante/[variantId]/
│   │   │   │           └── page.tsx  # Detalle: 11 páginas, aprobar/rechazar
│   │   │   ├── pedidos/
│   │   │   │   ├── page.tsx          # Lista de pedidos con states
│   │   │   │   └── [orderId]/
│   │   │   │       └── page.tsx      # Detalle del pedido + fulfillment
│   │   │   └── generacion/
│   │   │       └── page.tsx          # Monitor de jobs de pre-generación
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── webhooks/
│   │   │   │   ├── flow/route.ts         # Webhook de Flow.cl
│   │   │   │   ├── mercadopago/route.ts # Webhook de MercadoPago
│   │   │   │   └── inngest/route.ts     # Inngest event handler
│   │   │   ├── compose/route.ts      # Endpoint de composición PDF
│   │   │   ├── discount-codes/route.ts # Validar códigos de descuento
│   │   │   └── subscribe/route.ts    # Newsletter subscribe
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Tailwind + custom styles
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── storefront/               # Componentes del storefront
│   │   │   ├── character-configurator.tsx
│   │   │   ├── book-preview.tsx
│   │   │   ├── book-card.tsx
│   │   │   └── checkout-summary.tsx
│   │   └── admin/                    # Componentes del admin
│   │       ├── variant-grid.tsx
│   │       ├── variant-detail.tsx
│   │       ├── scene-editor.tsx
│   │       ├── book-editor.tsx
│   │       ├── order-table.tsx
│   │       └── dashboard-metrics.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase browser client
│   │   │   ├── server.ts             # Supabase server client (SSR)
│   │   │   ├── admin.ts              # Supabase service role client
│   │   │   └── types.ts              # Generated types from Supabase
│   │   ├── inngest/
│   │   │   ├── client.ts             # Inngest client
│   │   │   └── functions/
│   │   │       ├── generate-all-variants.ts
│   │   │       ├── generate-single-variant.ts
│   │   │       └── upscale-variant-pages.ts
│   │   ├── fal/
│   │   │   ├── client.ts             # fal.ai client wrapper
│   │   │   └── prompt-builder.ts     # buildCharacterBlock, buildFullPrompt (engine-aware)
│   │   ├── flow/
│   │   │   └── client.ts             # Flow.cl API wrapper
│   │   ├── mercadopago/
│   │   │   └── client.ts             # MercadoPago SDK wrapper (secundario)
│   │   ├── compose/
│   │   │   ├── text-overlay.ts       # Superposición de texto sobre imagen
│   │   │   └── pdf-builder.ts        # Ensamblaje de PDF para impresión
│   │   └── utils/
│   │       ├── variant-lookup.ts     # findVariant()
│   │       └── constants.ts          # BUYER_TO_VARIANT_MAP, etc.
│   │
│   ├── stores/
│   │   └── configurator-store.ts     # Zustand store para el configurador
│   │
│   ├── schemas/                      # Zod schemas
│   │   ├── order.ts
│   │   ├── book.ts
│   │   ├── variant.ts
│   │   └── discount.ts
│   │
│   └── emails/                       # React Email templates
│       ├── order-confirmation.tsx
│       └── shipping-notification.tsx
│
├── supabase/
│   ├── migrations/                   # SQL migrations
│   │   ├── 001_books_and_scenes.sql
│   │   ├── 002_character_variants.sql
│   │   ├── 003_orders.sql
│   │   ├── 004_discount_and_subscribers.sql
│   │   └── 005_rls_policies.sql
│   └── seed.sql                      # Seed data (libro "Buenas Noches" + escenas)
│
├── public/
│   └── ...                           # Static assets
│
├── .env.local                        # Environment variables (local)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── inngest.config.ts                 # Inngest configuration
```

### 3.3 Componentes del Sistema

**Storefront (Next.js App Router — RSC)**
- Propósito: Catálogo de libros, configurador de personaje, preview, checkout, waitlist
- Tecnología: Server Components para catálogo (SSR), Client Components para configurador (interactivo)
- Se comunica con: Supabase (lectura de libros, variantes), Flow.cl (checkout), MercadoPago (alternativo), Zustand (estado del configurador)
- Escala: Vercel Edge Network sirve estáticos. PostgreSQL connection pooling via Supabase.

**Admin Panel (Next.js — protegido por auth)**
- Propósito: Gestión de catálogo, pre-generación de variantes, curación, fulfillment, dashboard operacional
- Componentes:
  - **Book Editor**: Cambiar dimensiones (page_width_mm / page_height_mm), subir/cambiar imágenes de referencia (style_reference_urls), seleccionar motor IA (generation_engine), editar narrativa con WYSIWYG
  - **Scene Management**: Reordenar escenas con drag & drop, editar narrativa, subir setting sheet reference
  - **Operational Dashboard**: Estados de pedidos (paid → composing → sent_to_printer → qa → packed → shipped → delivered), stall alerts si no progresa en X días, métricas (sales diarias/semanales/mensuales, variantes populares, tasa de conversión)
- Tecnología: Server Components + Server Actions para mutaciones
- Se comunica con: Supabase (CRUD), Inngest (lanzar jobs), fal.ai (indirectamente via Inngest)
- Escala: Single user (Sofi). No requiere optimización.

**Pipeline de Pre-Generación (Inngest)**
- Propósito: Generar las 80 variantes × 11 páginas para un libro con determinismo
- Flujo:
  1. Generar portrait base (dinero shot) con seed fijo
  2. Generar character sheet (4 vistas desde portrait) con el mismo seed
  3. Cargar setting sheet (pre-generada, parte de Layer 1/book)
  4. Generar 11 páginas usando character sheet + setting sheet + scene prompt
  5. Upscale a hi-res
  6. Sofi aprueba/rechaza
- Tecnología: Inngest functions con steps, concurrency limit, reintentos. Motor IA configurable por libro (reads de books.generation_engine)
- Se comunica con: fal.ai (generación de imágenes), Supabase Storage (almacenar resultados), Supabase DB (actualizar estados)
- Escala: Concurrency controlada por Inngest. ~4-8 generaciones simultáneas.

**Motor de Composición (Server-side)**
- Propósito: Superponer texto personalizado sobre ilustraciones pre-generadas y generar PDF para impresión
- Tecnología: Sharp (image processing) + pdf-lib (PDF assembly)
- Se comunica con: Supabase Storage (leer ilustraciones, character sheets, setting sheets), Supabase DB (leer textos narrativos, dimensiones)
- Escala: Composición es ligera (<30 segundos por libro). Se ejecuta on-demand al confirmar pedido.

### 3.4 Flujo de Datos

```
=== FLUJO DE COMPRA (tiempo real) ===

Comprador selecciona atributos
    │
    ▼
Zustand store actualiza estado
    │
    ▼
findVariant(bookId, selection) → Supabase query
    │
    ▼
character_sheet_url (4 vistas) + variant_pages[] (imágenes pre-generadas)
    + scenes[] (textos con {name})
    │
    ▼
Preview: character sheet + páginas con nombre superpuesto (client-side)
    │
    ▼
Checkout → Flow.cl inline/popup (o fallback MercadoPago)
    │
    ▼
Webhook Flow.cl → crear Order → status: 'paid'
    │
    ▼
Composición PDF (server-side):
  - Descargar character sheet + setting sheet de Storage
  - Descargar ilustraciones hi-res de Storage
  - Reemplazar {name} en textos narrativos
  - Superponer texto sobre imágenes (Sharp)
  - Ensamblar PDF 20 páginas con character + setting context (pdf-lib)
  - Subir PDF a Storage
    │
    ▼
Order status: 'ready_to_print' → Email a Sofi
    │
    ▼
Sofi actualiza estado → 'sent_to_printer' → 'qa_check' → 'packing' → 'shipped' → 'delivered'


=== FLUJO DE PRE-GENERACIÓN (admin, async, DETERMINISTA) ===

Sofi clickea "Generar variantes" en admin
    │
    ▼
Selecciona motor IA (books.generation_engine = 'flux-kontext-pro')
    │
    ▼
Inngest event: 'book/generate-all-variants'
    │
    ▼
Para cada combinación (80 total):
  ├── Step 1: Generar portrait (money shot) con seed fijo → character_sheet_url
  ├── Step 2: Generar character sheet (4 vistas) con el mismo seed → 4 imágenes
  ├── Step 3: Cargar setting sheet pre-generada (Layer 1 del libro)
  ├── Step 4: Generar 11 páginas (image-to-image × 11) con seed fijo
  ├── Step 5: Upscale a hi-res (Real-ESRGAN × 11)
  └── Step 6: Actualizar estado en DB → 'generated' + guardar reference_images_used (JSONB)
    │
    ▼
Sofi revisa en admin → Aprobar / Rechazar / Regenerar (mismo seed)
    │
    ▼
Cuando 80/80 aprobadas → Libro se publica al catálogo
```

---

## 4. Base de Datos

### 4.1 Modelo de Datos (Diagrama ER)

```
books (1) ──────< (many) scenes
books (1) ──────< (many) character_variants
character_variants (1) ──────< (many) variant_pages
variant_pages (many) >────── (1) scenes
orders (many) >────── (1) character_variants
orders (many) >────── (1) books
orders (many) >────── (1) discount_codes
subscribers (independent)
accessories (1) ──────< (many) orders (V2)
```

### 4.2 Schema Completo

```sql
-- ============================================
-- Tabla: books
-- Propósito: Catálogo de libros (templates)
-- ============================================
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_template TEXT NOT NULL,           -- 'Buenas Noches, {name}'
  description TEXT,
  style_prompt TEXT NOT NULL,             -- STYLE_BLOCK fijo
  style_lora_url TEXT,
  style_reference_urls JSONB,             -- URLs a imágenes de referencia para el estilo
  total_scenes INTEGER NOT NULL DEFAULT 11,
  target_age TEXT DEFAULT '0-3',
  default_language TEXT DEFAULT 'es',
  available_languages TEXT[] DEFAULT '{"es"}',

  -- Motor IA configurable
  generation_engine TEXT DEFAULT 'flux-kontext-pro',  -- configurable por libro

  -- Estado del catálogo
  total_variants INTEGER DEFAULT 80,      -- actualizado de 96 a 80
  approved_variants INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,

  -- Impresión (ahora en mm para precisión)
  page_width_mm INTEGER DEFAULT 220,      -- 220mm = 22cm
  page_height_mm INTEGER DEFAULT 180,     -- 180mm = 18cm
  total_pages INTEGER DEFAULT 20,

  cover_template_url TEXT,
  price_clp INTEGER NOT NULL,             -- precio en CLP
  price_usd DECIMAL(10,2),               -- precio en USD (referencia)

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS: Libros publicados son públicos; todos los libros visibles para admin
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Libros publicados visibles para todos"
  ON books FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin ve todos los libros"
  ON books FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

COMMENT ON TABLE books IS 'Catálogo de libros personalizables. Cada libro es un template con escenas y variantes pre-generadas. Motor IA configurable por libro (Capa 1 - Level Ground).';

-- ============================================
-- Tabla: scenes
-- Propósito: Escenas/spreads de un libro
-- ============================================
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  scene_number INTEGER NOT NULL,          -- 0=portada, 1-9=spreads, 10=final

  visual_description TEXT NOT NULL,
  camera_angle TEXT DEFAULT 'medium_shot',
  lighting TEXT DEFAULT 'warm',
  emotion TEXT DEFAULT 'peaceful',
  suggested_seed INTEGER,

  recurring_elements TEXT[],              -- ['sleeping_mouse', 'teddy_bear', 'butterfly']

  character_position TEXT DEFAULT 'left', -- 'left', 'right' (NUNCA 'center')
  text_position TEXT DEFAULT 'top_left',
  text_position_secondary TEXT,

  text_narrative JSONB NOT NULL,          -- {"es": "Buenas noches, {name}...", "de": "Gute Nacht, {name}..."}

  setting_sheet_url TEXT,                 -- Pre-generated setting reference (Capa 1)
  setting_reference_urls JSONB,           -- Additional reference images for this scene

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  UNIQUE(book_id, scene_number)
);

ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Escenas de libros publicados son públicas"
  ON scenes FOR SELECT
  USING (EXISTS (SELECT 1 FROM books WHERE books.id = scenes.book_id AND books.is_published = true));

CREATE POLICY "Admin CRUD escenas"
  ON scenes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: character_variants
-- Propósito: Combinaciones pre-generadas de personaje
-- ============================================
CREATE TABLE character_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,

  gender TEXT NOT NULL,                   -- 'boy', 'girl'
  hair_color TEXT NOT NULL,               -- 'blonde', 'brown', 'red', 'black'
  hair_type TEXT NOT NULL,                -- 'straight', 'wavy'
  skin_tone TEXT NOT NULL,                -- 'light', 'medium', 'dark'
  has_glasses BOOLEAN NOT NULL DEFAULT FALSE,
  eye_style TEXT DEFAULT 'black_dots',

  portrait_url TEXT,                      -- Money shot (base portrait)
  character_sheet_urls JSONB,             -- {"frontal": "url", "lateral": "url", "three_quarter": "url", "full_body": "url"}

  status TEXT DEFAULT 'pending',          -- 'pending', 'generating', 'generated', 'approved', 'rejected'
  approved_by TEXT,
  approved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  UNIQUE(book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
);

-- Índice para lookup rápido en tiempo de compra
CREATE INDEX idx_variant_lookup
  ON character_variants(book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
  WHERE status = 'approved';

ALTER TABLE character_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variantes aprobadas de libros publicados son públicas"
  ON character_variants FOR SELECT
  USING (
    status = 'approved' AND
    EXISTS (SELECT 1 FROM books WHERE books.id = character_variants.book_id AND books.is_published = true)
  );

CREATE POLICY "Admin CRUD variantes"
  ON character_variants FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: variant_pages
-- Propósito: Páginas pre-generadas por variante
-- ============================================
CREATE TABLE variant_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES character_variants(id) ON DELETE CASCADE NOT NULL,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE NOT NULL,

  image_url TEXT NOT NULL,
  image_url_hires TEXT,

  prompt_used TEXT NOT NULL,
  seed_used INTEGER,
  generation_model TEXT NOT NULL,
  generation_cost DECIMAL(6,4),

  reference_images_used JSONB,            -- URLs a reference images utilizadas

  status TEXT DEFAULT 'generated',        -- 'generating', 'generated', 'approved', 'rejected'
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  UNIQUE(variant_id, scene_id)
);

ALTER TABLE variant_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Páginas de variantes aprobadas son públicas"
  ON variant_pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM character_variants cv
      WHERE cv.id = variant_pages.variant_id
      AND cv.status = 'approved'
      AND EXISTS (SELECT 1 FROM books WHERE books.id = cv.book_id AND books.is_published = true)
    )
  );

CREATE POLICY "Admin CRUD páginas"
  ON variant_pages FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: orders
-- Propósito: Pedidos de compradores
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES character_variants(id) NOT NULL,
  book_id UUID REFERENCES books(id) NOT NULL,
  discount_code_id UUID REFERENCES discount_codes(id),

  child_name TEXT NOT NULL,
  dedication TEXT,
  language TEXT DEFAULT 'es',
  second_language TEXT,

  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT,

  shipping_address JSONB NOT NULL,
  shipping_city TEXT,
  shipping_region TEXT,
  shipping_country TEXT DEFAULT 'CL',

  payment_provider TEXT DEFAULT 'flow',   -- 'flow' (primary), 'mercadopago' (secondary)
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount_paid DECIMAL(10,2),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'CLP',

  print_file_url TEXT,
  print_status TEXT DEFAULT 'pending',
  shipping_status TEXT DEFAULT 'pending',
  tracking_number TEXT,

  -- Order fulfillment states
  status TEXT DEFAULT 'created',
  -- States: 'created', 'paid', 'composing', 'ready_to_print', 'sent_to_printer',
  --        'qa_check', 'packing', 'shipped', 'delivered', 'cancelled'

  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_buyer_email ON orders(buyer_email);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin gestiona pedidos"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: discount_codes
-- Propósito: Códigos de descuento
-- ============================================
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,                     -- 'percentage', 'fixed'
  value DECIMAL(10,2) NOT NULL,           -- Porcentaje o monto fijo
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_discount_code ON discount_codes(code);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin CRUD discount codes"
  ON discount_codes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: subscribers
-- Propósito: Lista de emails para newsletter
-- ============================================
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',          -- 'website', 'landing', 'checkout'
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_subscriber_email ON subscribers(email);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin CRUD subscribers"
  ON subscribers FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: accessories (V1.5/V2)
-- Propósito: Accesorios opcionales para personaje
-- ============================================
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,                     -- 'overlay' or 'variant'
  image_layer_url TEXT,
  premium_price INTEGER,                  -- CLP
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin CRUD accessories"
  ON accessories FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER character_variants_updated_at BEFORE UPDATE ON character_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.3 Storage / Buckets

| Bucket | Contenido | Acceso | Límite |
|--------|----------|--------|--------|
| `portraits` | Portrait base (money shot) de cada variante (1 por variante) | Privado (solo admin) | 5MB por archivo |
| `illustrations` | Ilustraciones estándar (web preview, ~1200px) | Público (CDN) | 5MB por archivo |
| `illustrations-hires` | Ilustraciones hi-res para impresión (300 DPI, ~4000px) | Privado (solo composición server-side) | 20MB por archivo |
| `character-sheets` | Character sheets (4 vistas por variante) | Privado (solo admin/composición) | 5MB por archivo |
| `setting-sheets` | Setting reference images (pre-generadas, por libro) | Privado (solo admin/composición) | 10MB por archivo |
| `print-files` | PDFs finales para impresión | Privado (solo admin) | 100MB por archivo |

**Estimación de almacenamiento por libro:** 80 variantes × 11 páginas × 2 resoluciones + character sheets + setting sheet ≈ 1,760 archivos. ~4-5GB por libro (incluyendo hi-res).

### 4.4 Migrations Strategy

Migraciones secuenciales en `supabase/migrations/`. Cada migración es un archivo SQL numerado. Se ejecutan con `supabase db push` (desarrollo) y `supabase db migrate` (producción).

```bash
supabase migration new create_books_and_scenes
supabase migration new create_character_variants
supabase migration new create_orders
supabase migration new create_discount_and_subscribers
supabase migration new create_rls_policies
```

---

## 5. API Specifications

### 5.1 Estilo de API

**Server Actions** para todas las mutaciones (Next.js 15 built-in). **Direct Supabase queries** desde Server Components para reads. **API Routes** solo para webhooks externos (Flow.cl, MercadoPago, Inngest).

### 5.2 Server Actions

```typescript
// ==============================
// Lookup de variante (storefront)
// ==============================

/**
 * Busca la variante pre-generada que coincide con la selección del comprador.
 * Se llama desde el configurador cuando el usuario completa la selección.
 *
 * Auth: Pública
 */
interface FindVariantRequest {
  bookId: string;           // UUID del libro
  gender: 'Niño' | 'Niña';
  hairColor: 'Rubio' | 'Castaño' | 'Pelirrojo' | 'Negro';
  hairType: 'Liso' | 'Ondulado';
  skinTone: 'Clara' | 'Mate' | 'Oscura';
  glasses: 'Sí' | 'No';
}

interface FindVariantResponse {
  variant: {
    id: string;
    characterSheetUrl: string;    // 4 vistas del personaje
    pages: {
      sceneNumber: number;
      imageUrl: string;            // URL de ilustración (preview)
      textNarrative: string;       // Texto con {name} aún sin reemplazar
      textPosition: string;
    }[];
  } | null;
  available: boolean;              // false si la variante no está aprobada aún
}

// ==============================
// Crear pedido (checkout)
// ==============================

/**
 * Crea un pedido y genera la referencia de pago en Flow.cl o MercadoPago.
 *
 * Auth: Pública (guest checkout)
 */
interface CreateOrderRequest {
  bookId: string;
  variantId: string;
  childName: string;               // 1-50 caracteres, sin caracteres especiales peligrosos
  dedication: string;              // 1-500 caracteres
  language: string;                // 'es' en V1
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  discountCode?: string;           // Código de descuento opcional
  paymentMethod: 'flow' | 'mercadopago';  // Elegir proveedor
  shippingAddress: {
    street: string;
    number: string;
    apartment?: string;
    city: string;
    region: string;
    postalCode?: string;
    country: string;               // 'CL' en V1
  };
}

interface CreateOrderResponse {
  orderId: string;
  flowCheckoutUrl?: string;        // URL de inline/popup Flow.cl
  mercadopagoUrl?: string;         // URL de redirect MercadoPago (fallback)
}

// ==============================
// Validar código de descuento
// ==============================

/**
 * Valida un código de descuento y retorna el monto del descuento.
 *
 * Auth: Pública
 */
interface ApplyDiscountCodeRequest {
  code: string;
  totalAmount: DECIMAL;            // Monto antes del descuento
}

interface ApplyDiscountCodeResponse {
  valid: boolean;
  discountAmount: DECIMAL;
  newTotal: DECIMAL;
  errorMessage?: string;
}

// ==============================
// Newsletter subscribe
// ==============================

/**
 * Agrega un email a la lista de subscribers.
 *
 * Auth: Pública
 */
interface SubscribeNewsletterRequest {
  email: string;
  source: 'website' | 'landing' | 'checkout';
}

interface SubscribeNewsletterResponse {
  success: boolean;
  message: string;
}

// ==============================
// Admin: Lanzar pre-generación
// ==============================

/**
 * Dispara el pipeline de pre-generación de todas las variantes de un libro.
 *
 * Auth: Admin requerido
 */
interface GenerateAllVariantsRequest {
  bookId: string;
  concurrency?: number;            // Default: 4 (variantes simultáneas)
}

interface GenerateAllVariantsResponse {
  jobId: string;                   // Inngest event ID
  totalVariants: number;           // 80
  estimatedMinutes: number;        // ~150-300 min
}

// ==============================
// Admin: Aprobar/Rechazar variante
// ==============================

/**
 * Cambia el estado de una variante a 'approved' o 'rejected'.
 *
 * Auth: Admin requerido
 */
interface UpdateVariantStatusRequest {
  variantId: string;
  status: 'approved' | 'rejected';
}

// ==============================
// Admin: Regenerar página
// ==============================

/**
 * Regenera una página específica de una variante con el mismo seed (determinista).
 *
 * Auth: Admin requerido
 */
interface RegeneratePageRequest {
  pageId: string;                  // variant_page.id
  // El seed se read de la DB y se usa automáticamente (determinista)
}

// ==============================
// Admin: Actualizar configuración del libro
// ==============================

/**
 * Actualiza dimensiones, motor IA, y referencias de estilo por libro.
 *
 * Auth: Admin requerido
 */
interface UpdateBookSettingsRequest {
  bookId: string;
  pageWidthMm?: INTEGER;           // 220mm default
  pageHeightMm?: INTEGER;          // 180mm default
  generationEngine?: string;       // 'flux-kontext-pro', etc.
  styleReferenceUrls?: string[];   // URLs a imágenes de referencia
}

// ==============================
// Admin: Reordenar escenas
// ==============================

/**
 * Reordena las escenas de un libro con drag & drop.
 *
 * Auth: Admin requerido
 */
interface ReorderScenesRequest {
  bookId: string;
  sceneIds: string[];              // IDs en nuevo orden
}
```

### 5.3 API Routes (Webhooks)

```typescript
// POST /api/webhooks/flow
// Webhook de notificación de pago de Flow.cl
// Verifica firma, actualiza order.payment_status,
// dispara composición de PDF si status = 'approved'

// POST /api/webhooks/mercadopago
// Webhook de notificación de pago de MercadoPago (fallback)
// Verifica firma HMAC, actualiza order.payment_status,
// dispara composición de PDF si status = 'approved'

// POST /api/webhooks/inngest
// Handler de Inngest para functions registradas
// Inngest SDK maneja routing automáticamente

// POST /api/compose
// Endpoint interno para composición de PDF
// Llamado después de pago exitoso
// Auth: Internal (API key o Inngest)

// POST /api/discount-codes
// Validar código de descuento (Server Action)

// POST /api/subscribe
// Newsletter subscribe (Server Action)
```

### 5.4 Validación

Zod schemas compartidos entre client y server. Ubicados en `src/schemas/`.

```typescript
// src/schemas/order.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
  bookId: z.string().uuid(),
  variantId: z.string().uuid(),
  childName: z.string().min(1).max(50).regex(/^[\p{L}\s'-]+$/u, 'Nombre inválido'),
  dedication: z.string().min(1).max(500),
  language: z.enum(['es']),        // Expandir en V2
  discountCode: z.string().optional(),
  paymentMethod: z.enum(['flow', 'mercadopago']),
  buyerEmail: z.string().email(),
  buyerName: z.string().min(1).max(100),
  buyerPhone: z.string().optional(),
  shippingAddress: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    apartment: z.string().optional(),
    city: z.string().min(1),
    region: z.string().min(1),
    postalCode: z.string().optional(),
    country: z.literal('CL'),       // Solo Chile en V1
  }),
});

// src/schemas/discount.ts
export const applyDiscountCodeSchema = z.object({
  code: z.string().min(1).max(50),
  totalAmount: z.number().positive(),
});

// src/schemas/subscribe.ts
export const subscribeNewsletterSchema = z.object({
  email: z.string().email(),
  source: z.enum(['website', 'landing', 'checkout']),
});
```

---

## 6. Autenticación y Seguridad

### 6.1 Flujo de Auth

```
Comprador:
  No requiere autenticación. Guest checkout con email.
  El email se usa para confirmación y tracking.

Admin (Sofi):
  Email + Password via Supabase Auth
  → Login en /admin/login
  → JWT con claim custom { role: 'admin' }
  → Middleware de Next.js verifica JWT en /admin/*
  → RLS en Supabase usa auth.jwt() ->> 'role' = 'admin'
```

### 6.2 Roles y Permisos

| Rol | Puede hacer | No puede hacer |
|-----|------------|---------------|
| Guest (Comprador) | Ver catálogo, configurar personaje, ver preview, pagar, ver estado de su pedido por link, suscribirse a newsletter | Acceder a /admin, ver otros pedidos, modificar datos del catálogo |
| Admin (Sofi) | Todo lo de guest + CRUD libros/escenas, pre-generar variantes, aprobar/rechazar, gestionar pedidos, ver dashboard operacional, crear códigos de descuento | N/A (full access en V1) |

### 6.3 Protección de Rutas

| Ruta Pattern | Acceso | Redirect si no auth |
|-------------|--------|-------------------|
| / | Público | N/A |
| /libro/* | Público | N/A |
| /checkout/* | Público | N/A |
| /preview/* | Público (por link con orderId) | N/A |
| /waitlist | Público | N/A |
| /admin/* | Admin autenticado | /admin/login |
| /api/webhooks/* | Verificación de firma | 401 |

### 6.4 Security Checklist

- [ ] Passwords hasheados (Supabase Auth usa bcrypt)
- [ ] JWT con expiración (24h para admin, configurable)
- [ ] HTTPS enforced (Vercel default)
- [ ] CORS configurado (solo dominio propio)
- [ ] Rate limiting en checkout (Vercel built-in, 100 req/min)
- [ ] SQL injection prevenido (Supabase client usa queries parametrizadas)
- [ ] XSS protection (React escapes by default, CSP headers)
- [ ] CSRF — Server Actions de Next.js incluyen protección CSRF
- [ ] Secrets en env vars (nunca hardcoded)
- [ ] File uploads: no hay uploads de usuario en V1 (V2: foto del regalador)
- [ ] RLS habilitado en todas las tablas
- [ ] Webhooks Flow.cl + MercadoPago verificados con HMAC signature
- [ ] childName sanitizado (regex + max length) para prevenir XSS en composición

---

## 7. Integraciones Externas

### 7.1 fal.ai (Generación de Imágenes)

- **Propósito**: Pre-generación de ilustraciones (pipeline admin), configurable por libro
- **API Docs**: https://fal.ai/docs
- **Auth method**: API Key (`FAL_KEY`)
- **Motor configurable**: Acceder a `books.generation_engine` durante pipeline. Por defecto: `flux-kontext-pro`
- **Endpoints que usamos**:
  - `fal-ai/flux-pro/kontext/text-to-image` — portrait base (money shot) con seed fijo
  - `fal-ai/flux-pro/kontext` — character sheet generation (4 vistas desde portrait)
  - `fal-ai/flux-pro/kontext` — image-to-image (páginas con character sheet + setting sheet reference)
  - `fal-ai/real-esrgan` — upscaling a hi-res 300 DPI
- **Costo estimado**: ~$35-100 por libro (880 imágenes + upscale)
- **Gotchas conocidos**:
  - Rate limits en capa gratuita; respuestas pueden tardar 10-30s por imagen
  - URLs de resultado expiran (descargar y almacenar en Supabase Storage inmediatamente)
  - Setting sheet generation es parte de Layer 1 setup (pre-generada una sola vez)
- **Fallback si falla**: Replicate como provider alternativo para FLUX Kontext. Inngest maneja reintentos automáticos (3 intentos con backoff exponencial).

### 7.2 Flow.cl (Pagos — Principal)

- **Propósito**: Procesamiento de pagos para Chile (PRIMARY)
- **API Docs**: https://www.flow.cl/docs/
- **Auth method**: API Key + Secret Key (`FLOW_API_KEY`, `FLOW_SECRET_KEY`, `FLOW_WEBHOOK_SECRET`)
- **Endpoints que usamos**:
  - Inline/popup API (sin redirect) — mejor UX
  - Aceptar Webpay, tarjetas de crédito/débito, transferencia bancaria
  - Webhook de notificación (verificado con HMAC)
- **Costo estimado**: Comisión ~2.9% + IVA por transacción
- **Ventajas**:
  - No requiere redirect (inline/popup)
  - Gateway dominante en Chile
  - Excelente soporte local
- **Gotchas conocidos**:
  - Webhook puede enviar notificaciones duplicadas (idempotencia requerida en handler)
  - Verificar firma de webhook con HMAC
- **Fallback si falla**: MercadoPago como opción secundaria en checkout

### 7.2b MercadoPago (Pagos — Secundario)

- **Propósito**: Procesamiento de pagos alternativo (SECONDARY) — usuarios con saldo MP, cuotas sin interés
- **API Docs**: https://www.mercadopago.cl/developers/es/docs
- **Auth method**: Access Token (`MERCADOPAGO_ACCESS_TOKEN`)
- **Endpoints que usamos**:
  - Checkout Pro (crear preferencia de pago → redirect)
  - Webhook de notificación (IPN)
- **Costo estimado**: Comisión ~3.49% + IVA por transacción
- **Gotchas conocidos**:
  - Webhook puede enviar notificaciones duplicadas (idempotencia requerida en handler)
  - Usar `payment_id` como clave de idempotencia
  - Checkout Pro redirect puede tener latencia
  - Status "in_process" para tarjetas requiere polling
- **Fallback si falla**: Re-intentar con Flow.cl. Si persiste, mostrar mensaje de error.

### 7.3 Resend (Email Transaccional)

- **Propósito**: Emails de confirmación de pedido y notificación de envío
- **API Docs**: https://resend.com/docs
- **Auth method**: API Key (`RESEND_API_KEY`)
- **Endpoints que usamos**: Envío de emails con React Email templates
- **Costo estimado**: Gratis hasta 3,000 emails/mes (suficiente para V1)
- **Gotchas conocidos**: Dominio verificado requerido para evitar spam. Rate limit de 10 emails/segundo.
- **Fallback si falla**: Reintentar 3 veces. Si persiste, loguear error y notificar a admin.

### 7.4 Inngest (Background Jobs)

- **Propósito**: Orquestación del pipeline de pre-generación de variantes (determinista)
- **API Docs**: https://www.inngest.com/docs
- **Auth method**: Signing key (`INNGEST_SIGNING_KEY`) + Event key (`INNGEST_EVENT_KEY`)
- **Funciones registradas**:
  - `book/generate-all-variants` — orquesta la generación de 80 variantes con seeds fijos
  - `variant/generate-single` — genera 1 variante (portrait + character sheet + 11 páginas)
  - `variant/upscale-pages` — upscale de las 11 páginas a hi-res
- **Costo estimado**: Gratis hasta 25,000 events/mes
- **Determinismo**:
  - Seeds se guardan en DB (scenes.suggested_seed)
  - Inngest ejecuta el mismo seed → mismos resultados (reproducible)
  - Adecuado para QA y regeneraciones
- **Gotchas conocidos**:
  - Functions tienen timeout de 5 min por step. Cada step debe ser idempotente
  - Usar `step.run()` para cada operación que puede fallar
- **Fallback si falla**: Inngest maneja reintentos automáticamente. Admin puede relanzar variantes fallidas manualmente.

### 7.5 PostHog (Analytics)

- **Propósito**: Tracking del funnel de conversión
- **Auth method**: Project API Key (público, client-side)
- **Eventos trackeados**: `page_view`, `configurator_started`, `configurator_completed`, `preview_viewed`, `checkout_started`, `payment_completed`, `newsletter_subscribed`
- **Costo estimado**: Gratis hasta 1M events/mes
- **Gotchas**: Respetar Do Not Track. Cookie-less mode para GDPR.

### 7.6 Sentry (Error Monitoring)

- **Propósito**: Error tracking en frontend y serverless functions
- **Auth method**: DSN (`SENTRY_DSN`)
- **Costo estimado**: Gratis hasta 5,000 errors/mes
- **Integración**: `@sentry/nextjs` con source maps en Vercel

---

## 8. Performance

### 8.1 Targets

| Métrica | Target | Máximo Aceptable |
|---------|--------|-----------------|
| First Contentful Paint (landing) | <1.5s | 2.5s |
| Time to Interactive (configurador) | <2.5s | 4s |
| Preview load (variante lookup + render) | <1s | 2s |
| Composición PDF (server-side) | <30s | 60s |
| API Response (checkout creation) | <2s | 5s |

### 8.2 Estrategias de Optimización

- **Image optimization**: Next.js Image component con formato WebP/AVIF para previews. Lazy loading para imágenes debajo del fold.
- **Caching**: Variantes aprobadas se cachean en Vercel Edge (ISR o fetch cache). Supabase CDN para imágenes en `illustrations` bucket.
- **Code splitting**: App Router hace splitting automático por ruta. Configurador como Client Component se carga con dynamic import.
- **DB indexing**: Índice compuesto en `character_variants` para lookup instantáneo (ver §4.2). Índice en `orders(status)` para panel admin.
- **Prefetching**: Prefetch de las ilustraciones de la variante más probable mientras el usuario configura.

### 8.3 Escalabilidad

**10x (500-700 ventas/mes):** Sin cambios técnicos. Vercel escala automáticamente. Supabase Pro plan para más connections. Storage ~40GB.

**100x (5,000-7,000 ventas/mes):** Agregar Redis para caché de variantes. Considerar CDN dedicado (Cloudflare R2). Migrar composición de PDF a worker dedicado.

---

## 9. Error Handling

### 9.1 Error Codes

```typescript
enum AppErrorCode {
  // Client (400s)
  VALIDATION_ERROR = "VALIDATION_ERROR",
  VARIANT_NOT_FOUND = "VARIANT_NOT_FOUND",       // Variante no aprobada o no existe
  VARIANT_NOT_AVAILABLE = "VARIANT_NOT_AVAILABLE", // Variante existe pero no está aprobada
  ORDER_NOT_FOUND = "ORDER_NOT_FOUND",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  DISCOUNT_CODE_INVALID = "DISCOUNT_CODE_INVALID",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",

  // Server (500s)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  GENERATION_FAILED = "GENERATION_FAILED",        // fal.ai error
  COMPOSITION_FAILED = "COMPOSITION_FAILED",      // PDF composition error
  PAYMENT_WEBHOOK_ERROR = "PAYMENT_WEBHOOK_ERROR",
  STORAGE_ERROR = "STORAGE_ERROR",                // Supabase Storage error
}
```

### 9.2 Logging Strategy

- **Sentry**: Todos los errores de servidor (500s) y errores no capturados en cliente
- **Console (Vercel logs)**: Info-level para operaciones importantes (pedido creado, pago recibido, composición completada)
- **Inngest Dashboard**: Estado de todos los jobs de pre-generación (éxitos, fallos, reintentos)
- **PostHog**: Eventos de negocio (no errores técnicos)

### 9.3 User-Facing Errors

- **Variante no disponible**: Toast con "Esta combinación aún no está disponible. Prueba con otra opción." + sugerir variantes cercanas disponibles
- **Error de pago**: Página de error con botón de reintentar + email de soporte
- **Código de descuento inválido**: Toast con "El código de descuento no es válido o ha expirado."
- **Error de composición**: No visible al usuario. Se loguea internamente y Sofi recibe alerta.
- **Error genérico**: Toast con "Algo salió mal. Por favor intenta de nuevo."

---

## 10. Deployment

### 10.1 Environments

| Env | URL | Propósito | Deploy trigger |
|-----|-----|----------|---------------|
| Development | localhost:3000 | Dev local | Manual |
| Preview | *.vercel.app | PR preview | Push a PR branch |
| Production | tipitibooks.com | Live | Push a `main` |

### 10.2 Environment Variables

**Públicas (client-safe):**
```
NEXT_PUBLIC_SUPABASE_URL          # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Clave anon de Supabase (segura para client)
NEXT_PUBLIC_POSTHOG_KEY           # Project API key de PostHog
NEXT_PUBLIC_POSTHOG_HOST          # Host de PostHog
NEXT_PUBLIC_SENTRY_DSN            # DSN de Sentry (client)
NEXT_PUBLIC_FLOW_PUBLIC_KEY       # Clave pública de Flow.cl
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY # Clave pública de MercadoPago
```

**Secretas (server-only):**
```
SUPABASE_SERVICE_ROLE_KEY         # Clave service role (bypasses RLS)
FAL_KEY                           # API key de fal.ai
FLOW_API_KEY                      # API key de Flow.cl
FLOW_SECRET_KEY                   # Secret key de Flow.cl
FLOW_WEBHOOK_SECRET               # Secreto para verificar webhooks Flow.cl
MERCADOPAGO_ACCESS_TOKEN          # Token de acceso de MercadoPago
MERCADOPAGO_WEBHOOK_SECRET        # Secreto para verificar webhooks MercadoPago
RESEND_API_KEY                    # API key de Resend
INNGEST_SIGNING_KEY               # Signing key de Inngest
INNGEST_EVENT_KEY                 # Event key de Inngest
SENTRY_AUTH_TOKEN                 # Token para source maps upload
```

### 10.3 CI/CD

```
Push to PR:
  → Vercel Preview Deploy (automático)
  → TypeScript typecheck (tsc --noEmit)
  → ESLint

Push to main:
  → Vercel Production Deploy (automático)
  → supabase db push (migrations)
```

No hay pipeline de testing automatizado en V1 (MVP). Se agrega en Fase 2.

### 10.4 Infrastructure

- **Hosting**: Vercel (Hobby plan para empezar, Pro cuando sea necesario)
- **CDN**: Vercel Edge Network (global) + Supabase Storage CDN
- **DNS**: Configurar en registrar del dominio → apuntar a Vercel
- **SSL**: Automático vía Vercel (Let's Encrypt)

---

## 11. Testing Strategy

### 11.1 Approach

| Tipo | Herramienta | Coverage Target | Qué se testea |
|------|------------|----------------|---------------|
| Unit | Vitest | Funciones críticas | prompt-builder, variant-lookup, text-overlay, discount validation, Zod schemas |
| E2E | Playwright | Flujos happy path | Configurador → Preview → Checkout flow (ambos Flow.cl y MercadoPago) |

### 11.2 Testing Commands

```bash
# Unit tests
pnpm test              # Vitest run
pnpm test:watch        # Vitest watch mode

# E2E tests
pnpm test:e2e          # Playwright
pnpm test:e2e:ui       # Playwright UI mode
```

### 11.3 E2E Flows Críticos

1. **Happy path completo (Flow.cl)**: Seleccionar libro → Configurar personaje → Ver preview → Completar datos → Pagar con Flow.cl
2. **Happy path completo (MercadoPago)**: Seleccionar libro → Configurar personaje → Ver preview → Completar datos → Pagar con MercadoPago
3. **Aplicar código de descuento**: Completar configurador → Ingresar código válido → Ver descuento aplicado
4. **Variante no disponible**: Seleccionar combinación no aprobada → Mostrar mensaje + sugerencias
5. **Admin: aprobar variante**: Login admin → Navegar a libro → Revisar variante → Aprobar
6. **Admin: generar variantes**: Clickear "Generar 80 variantes" → Monitorear progreso → Revisar y aprobar

---

## 12. Consideraciones Futuras (Post-MVP)

| Feature/Mejora | Impacto Técnico | Fase Estimada |
|---------------|----------------|---------------|
| Segundo personaje | Modelo híbrido: pre-gen personaje 1 + on-demand personaje 2. Agrega tabla `second_characters`. Inngest function nueva. | Fase 2 |
| Accesorios opcionales (V1.5) | Tabla `accessories` con overlay/variant types. Premium pricing. UI en configurador. | Fase 1.5 |
| Opción bilingüe | Agregar `second_language` a orders. Composición PDF renderiza 2 bloques de texto por página. | Fase 2 |
| A/B testing de motores IA | Generar misma variante con 2 engines diferentes. Admin elige mejor. Agregar `generation_engine` a variant_pages. | Fase 2 |
| Style LoRA | Entrenar LoRA con fal-ai/flux-kontext-trainer. Agregar `style_lora_url` a books (ya en schema). | Fase 2 |
| QA semi-automatizado | CLIP scoring en pipeline de pre-generación. Auto-reject si score < threshold. | Fase 2 |
| Gift cards | Nueva tabla `gift_cards`. Flujo de canje en checkout. | Fase 3 |
| Multi-country | Flow.cl, MercadoPago soportan MX, CO, AR. Agregar `currency` dinámico y opciones de envío por país. | Fase 3 |
| Self-hosted inference | GPU pool (RunPod/Lambda). Reduce costo de pre-generación ~80%. Solo justificado a escala. | Fase 3 |
| Account system | Supabase Auth para compradores (optional). Historial de pedidos, re-order. | Fase 2-3 |
| WhatsApp notifications | Integrar Twilio/YCloud API. Agregar `notification_channel` a orders. | Fase 2 |

---

## 13. Gotchas y Auto-Blindaje

### Next.js 15 + App Router
- **Server Components son default**: Todo componente es RSC a menos que use `"use client"`. El configurador DEBE ser Client Component (usa estado, eventos).
- **Server Actions y forms**: Usar `useFormStatus` para loading states. Las Server Actions NO deben exponer datos sensibles en el return.
- **Image optimization**: `next/image` requiere configurar `remotePatterns` en `next.config.ts` para Supabase Storage URLs.
- **ISR y revalidación**: Páginas del catálogo pueden usar `revalidate = 3600` (1 hora). Revalidar on-demand cuando se publica un libro.

### Supabase
- **RLS siempre activo**: TODAS las queries desde el client usan `anon key` y respetan RLS. Queries desde server con `service role` bypasean RLS (solo para composición y admin).
- **Storage policies**: Configurar policies en cada bucket. `illustrations` = público, `illustrations-hires` = solo service role, `character-sheets` y `setting-sheets` = privados.
- **Connection pooling**: Usar Supabase connection string con pooler para serverless (puerto 6543, no 5432).
- **Tipos generados**: Correr `supabase gen types typescript` después de cada migración.

### fal.ai
- **URLs temporales**: Las URLs de imágenes generadas EXPIRAN. Descargar y almacenar en Supabase Storage inmediatamente después de generación.
- **512 token limit**: Prompts de FLUX Kontext tienen límite estricto. El prompt builder debe validar length y adaptarse al engine configurado.
- **Rate limits**: En capa gratuita, ~10 req/min. Inngest debe throttlear la concurrency.
- **Setting sheet generation**: Es parte de Layer 1 setup (pre-generada una sola vez per libro). No se regenera.

### Flow.cl
- **Webhook idempotencia**: Flow.cl puede enviar el mismo webhook múltiples veces. Usar `flow_order_id` como clave de idempotencia.
- **Verificar firma**: Validar HMAC signature de webhook con `FLOW_WEBHOOK_SECRET`.
- **Inline API**: No requiere redirect. Mejor UX que MercadoPago. Leer docs recientes.

### MercadoPago (Secundario)
- **Webhook idempotencia**: MercadoPago puede enviar el mismo webhook múltiples veces. Usar `payment_id` como clave de idempotencia.
- **Modo sandbox**: Usar credenciales de test durante desarrollo. Tarjetas de prueba disponibles en docs.
- **IPN vs Webhooks**: Usar el sistema de webhooks nuevo (v2), no el IPN legacy.

### Inngest + Determinismo
- **Step timeouts**: Cada `step.run()` tiene timeout de 5 minutos. Si la generación de una imagen tarda más, dividir en: request → poll status.
- **Idempotencia de steps**: Cada step debe ser idempotente. Si se reintenta, no debe crear duplicados.
- **Event naming**: Usar formato `entity/action` (ej: `book/generate-all-variants`, `variant/generate-single`).
- **Seeds fijos**: Guardar seeds en DB (scenes.suggested_seed). Reutilizar en regeneraciones. Esto garantiza reproducibilidad determinista.

---

## 14. Convenciones de Código

| Aspecto | Convención |
|---------|-----------|
| Variables/Funciones | camelCase |
| Componentes React | PascalCase |
| Archivos/Carpetas | kebab-case |
| Constantes | UPPER_SNAKE_CASE |
| DB columns | snake_case |
| Commits | Conventional Commits (`feat:`, `fix:`, `chore:`) |
| Max file length | 300 líneas (refactorizar si excede) |
| TypeScript `any` | NEVER — usar `unknown` y narrowing |
| Imports | Absolute paths con `@/` alias |
| Exports | Named exports (no default, excepto pages) |
| Error handling | try/catch con error codes tipados |
| Comments | Solo para lógica compleja. El código debe ser auto-explicativo. |

---

*Tech Spec generado con el pipeline de App Factory*
*Pendiente aprobación antes de avanzar al siguiente skill*
