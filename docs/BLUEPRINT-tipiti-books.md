# Tipiti Books — Master Blueprint

> **Master Blueprint v1.0**
> **Estado**: FINAL
> **Fecha de generación**: 2026-02-26
> **Timeline**: 38 días (6 de marzo — 13 de abril, 2026)
> **Equipo**: Sofi (product/design/admin), dev team
> **Fuentes**: PDR v3.0, Tech Spec v2.0, User Stories v1.0, Wireframes, Stitch Prompts v1.0

---

## Visión del Producto

Tipiti Books es una plataforma web chilena que genera libros infantiles personalizados con ilustraciones de alta calidad estilo acuarela. Los compradores (padres, abuelos, tíos) configuran un personaje que refleja al niño/a regalado y reciben un libro impreso premium en casa. El producto combina **personalización real + calidad artística premium + precio accesible (~$40 USD)**, resolviendo el problema de que los libros de este nivel cuestan $60+ USD cuando se envían a Latinoamérica.

La arquitectura de 3 capas (Cuento → Personaje → Texto) permite que cada componente se cree, escale y versione independientemente. Las ilustraciones se pre-generan via FLUX Kontext Pro (~80 variantes × 11 páginas por libro), se curan manualmente, y al momento de la compra el sistema simplemente busca la variante que coincide y superpone el nombre + dedicatoria del comprador. **Determinismo**: El mismo personaje = las mismas ilustraciones. No hay aleatoriedad.

---

## Stack Técnico (Referencia Rápida)

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|----------|
| **Frontend** | Next.js App Router | 15 | Storefront SSR + Admin panel |
| **Language** | TypeScript | 5.x | Type-safe contracts |
| **Styling** | Tailwind CSS | 4.x | Utility-first, mobile-first responsive |
| **UI Components** | shadcn/ui | latest | Componentes accesibles base |
| **State (Client)** | Zustand | latest | Configurador local (wizard) |
| **Database** | Supabase PostgreSQL | latest | OLTP relacional |
| **Auth** | Supabase Auth | - | Admin login (email) |
| **Storage** | Supabase Storage | - | Imágenes pre-generadas, PDFs |
| **Image Generation** | fal.ai (FLUX Kontext Pro) | - | Pre-generación de variantes |
| **Async Jobs** | Inngest | latest | Pipeline batch determinista |
| **Email** | Resend | latest | Transaccionales + newsletter |
| **Payments** | Flow.cl | - | Gateway principal (inline/popup) |
| **Payments (alt)** | MercadoPago | - | Fallback secundario |
| **PDF Composition** | Sharp + pdf-lib | latest | Texto overlay + ensamblaje |
| **Hosting** | Vercel | - | App + Edge Functions |
| **Monitoring** | Sentry + PostHog | latest | Errors + analytics |

### API Keys & Env Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxx

# Auth Admin
ADMIN_EMAIL=sofi@tipitibooks.com
ADMIN_PASSWORD_HASH=bcrypt_hash_set_manually

# fal.ai (Image Generation)
FAL_API_KEY=xxxxx

# Inngest (Async Jobs)
INNGEST_EVENT_KEY=signKey_xxxxx
INNGEST_EVENT_API_BASE_URL=https://app.inngest.com

# Flow.cl (Payment)
FLOW_MERCHANT_ID=xxxxx
FLOW_API_KEY=xxxxx
FLOW_SECRET_KEY=xxxxx

# MercadoPago (Payment Alt)
MERCADOPAGO_ACCESS_TOKEN=xxxxx

# Resend (Email)
RESEND_API_KEY=xxxxx
RESEND_FROM_EMAIL=hola@tipitibooks.com

# Environment
NODE_ENV=production
VERCEL_ENV=production
```

### Folder Structure

```
tipiti-books/
├── src/
│   ├── app/
│   │   ├── (storefront)/           # Public routes
│   │   │   ├── page.tsx             # Landing /
│   │   │   ├── catalogo/page.tsx    # Catalog /catalogo
│   │   │   ├── libro/[slug]/
│   │   │   │   └── page.tsx         # Book detail /libro/[slug]
│   │   │   ├── wizard/
│   │   │   │   ├── paso-1/page.tsx  # Name input
│   │   │   │   ├── paso-2/page.tsx  # Appearance grid
│   │   │   │   ├── paso-3/page.tsx  # Dedication
│   │   │   │   └── paso-4/page.tsx  # Summary
│   │   │   ├── preview/page.tsx     # Page-flip animation
│   │   │   ├── checkout/page.tsx    # Shipping + discount
│   │   │   ├── pago/
│   │   │   │   ├── page.tsx         # Redirect to Flow.cl
│   │   │   │   ├── success/page.tsx
│   │   │   │   └── failure/page.tsx
│   │   │   └── layout.tsx           # Storefront layout
│   │   │
│   │   ├── admin/                   # Protected admin routes
│   │   │   ├── layout.tsx           # Admin layout (sidebar auth)
│   │   │   ├── dashboard/page.tsx   # Operational dashboard
│   │   │   ├── libros/
│   │   │   │   ├── page.tsx         # Book list
│   │   │   │   └── [bookId]/
│   │   │   │       ├── page.tsx     # Book detail
│   │   │   │       ├── editor/page.tsx
│   │   │   │       ├── variantes/page.tsx
│   │   │   │       └── variante/[variantId]/page.tsx
│   │   │   ├── pedidos/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [orderId]/page.tsx
│   │   │   ├── generacion/page.tsx
│   │   │   ├── descuentos/page.tsx
│   │   │   └── suscriptores/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   ├── flow/route.ts
│   │   │   │   ├── mercadopago/route.ts
│   │   │   │   └── inngest/route.ts
│   │   │   ├── compose/route.ts
│   │   │   ├── discount-codes/route.ts
│   │   │   └── subscribe/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                  # shadcn/ui
│   │   ├── storefront/
│   │   │   ├── character-configurator.tsx
│   │   │   ├── book-preview.tsx
│   │   │   └── checkout-form.tsx
│   │   └── admin/
│   │       ├── variant-grid.tsx
│   │       ├── scene-editor.tsx
│   │       └── order-table.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── admin.ts
│   │   │   └── types.ts
│   │   ├── inngest/
│   │   │   ├── client.ts
│   │   │   └── functions/
│   │   ├── fal/client.ts
│   │   ├── flow/client.ts
│   │   ├── compose/
│   │   │   ├── text-overlay.ts
│   │   │   └── pdf-builder.ts
│   │   └── utils/
│   │       ├── variant-lookup.ts    # findVariant()
│   │       └── constants.ts
│   │
│   ├── stores/
│   │   └── configurator-store.ts    # Zustand
│   │
│   └── emails/
│       ├── order-confirmation.tsx
│       └── shipping-notification.tsx
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
└── package.json
```

---

## Database Schema (SQL Completo)

```sql
-- ============================================
-- Tabla: books
-- Propósito: Catálogo de libros personalizables
-- ============================================
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_template TEXT NOT NULL,
  description TEXT,
  style_prompt TEXT NOT NULL,
  style_lora_url TEXT,
  style_reference_urls JSONB,
  total_scenes INTEGER NOT NULL DEFAULT 11,
  target_age TEXT DEFAULT '0-3',
  default_language TEXT DEFAULT 'es',
  available_languages TEXT[] DEFAULT '{"es"}',
  generation_engine TEXT DEFAULT 'flux-kontext-pro',
  total_variants INTEGER DEFAULT 80,
  approved_variants INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  page_width_mm INTEGER DEFAULT 220,
  page_height_mm INTEGER DEFAULT 180,
  total_pages INTEGER DEFAULT 20,
  cover_template_url TEXT,
  price_clp INTEGER NOT NULL,
  price_usd DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Libros publicados visibles para todos" ON books FOR SELECT USING (is_published = true);
CREATE POLICY "Admin ve todos los libros" ON books FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: scenes
-- Propósito: Escenas/spreads de un libro
-- ============================================
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  scene_number INTEGER NOT NULL,
  visual_description TEXT NOT NULL,
  camera_angle TEXT DEFAULT 'medium_shot',
  lighting TEXT DEFAULT 'warm',
  emotion TEXT DEFAULT 'peaceful',
  suggested_seed INTEGER,
  recurring_elements TEXT[],
  character_position TEXT DEFAULT 'left',
  text_position TEXT DEFAULT 'top_left',
  text_position_secondary TEXT,
  text_narrative JSONB NOT NULL,
  setting_sheet_url TEXT,
  setting_reference_urls JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(book_id, scene_number)
);

ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Escenas de libros publicados son públicas" ON scenes FOR SELECT
  USING (EXISTS (SELECT 1 FROM books WHERE books.id = scenes.book_id AND books.is_published = true));
CREATE POLICY "Admin CRUD escenas" ON scenes FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: character_variants
-- Propósito: Combinaciones pre-generadas de personaje (~80 por libro)
-- ============================================
CREATE TABLE character_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE NOT NULL,
  gender TEXT NOT NULL,
  hair_color TEXT NOT NULL,
  hair_type TEXT NOT NULL,
  skin_tone TEXT NOT NULL,
  has_glasses BOOLEAN NOT NULL DEFAULT FALSE,
  eye_style TEXT DEFAULT 'black_dots',
  portrait_url TEXT,
  character_sheet_urls JSONB,
  status TEXT DEFAULT 'pending',
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
);

CREATE INDEX idx_variant_lookup ON character_variants(book_id, gender, hair_color, hair_type, skin_tone, has_glasses) WHERE status = 'approved';

ALTER TABLE character_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Variantes aprobadas de libros publicados son públicas" ON character_variants FOR SELECT
  USING (status = 'approved' AND EXISTS (SELECT 1 FROM books WHERE books.id = character_variants.book_id AND books.is_published = true));
CREATE POLICY "Admin CRUD variantes" ON character_variants FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: variant_pages
-- Propósito: Páginas pre-generadas por variante (11 páginas por variante)
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
  reference_images_used JSONB,
  status TEXT DEFAULT 'generated',
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(variant_id, scene_id)
);

ALTER TABLE variant_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Páginas de variantes aprobadas son públicas" ON variant_pages FOR SELECT
  USING (EXISTS (SELECT 1 FROM character_variants cv WHERE cv.id = variant_pages.variant_id AND cv.status = 'approved'
    AND EXISTS (SELECT 1 FROM books WHERE books.id = cv.book_id AND books.is_published = true)));
CREATE POLICY "Admin CRUD páginas" ON variant_pages FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

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
  payment_provider TEXT DEFAULT 'flow',
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  amount_paid DECIMAL(10,2),
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'CLP',
  print_file_url TEXT,
  print_status TEXT DEFAULT 'pending',
  shipping_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  status TEXT DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_buyer_email ON orders(buyer_email);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin gestiona pedidos" ON orders FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: discount_codes
-- Propósito: Códigos de descuento
-- ============================================
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_discount_code ON discount_codes(code);

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin CRUD discount codes" ON discount_codes FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: subscribers
-- Propósito: Lista de emails para newsletter/waitlist
-- ============================================
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'website',
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_subscriber_email ON subscribers(email);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin CRUD subscribers" ON subscribers FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Tabla: accessories (V1.5/V2)
-- Propósito: Accesorios opcionales para personaje
-- ============================================
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  image_layer_url TEXT,
  premium_price INTEGER,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin CRUD accessories" ON accessories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================
-- Trigger para updated_at
-- ============================================
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

---

## Design System

**Dirección Estética:** "Librería artesanal de acuarela" — Organic/Natural meets Editorial infantil premium. Tono cálido, tierno, artesanal, premium pero accesible. Referencia visual: Oliver Jeffers meets Rifle Paper Co.

**Paleta de Color:**
- Dominante: Crema cálido **#FBF7F0** (como papel acuarela real) — FONDO
- Acento principal: Terracota suave **#C47D5A** — CTAs, botones, highlights
- Acento secundario: Verde salvia **#8BA888** — badges, confirmaciones, success
- Emocional: Rosa viejo **#D4A0A0** — detalles de ternura, hover states
- Contraste: Azul empolvado **#7B9DB7** — links, info, confianza
- Texto principal: **#4A3F35** (marrón cálido, NUNCA negro puro)

**Tipografía:**
- **Display/Headings:** Fraunces 600-800 — serif orgánico, soft, personalidad cuento infantil
- **Body:** DM Sans 400/500 — sans-serif friendly, 16px, line-height 1.6
- **Handwritten:** Caveat — solo dedicatorias, quotes especiales
- **PROHIBIDO:** Inter, Roboto, Arial, system-ui como fuente principal

**Componentes:**
- Botones: Pill shape (border-radius 24px), terracota bg, padding 14px 32px, hover: translate-y -2px + shadow warmth
- Cards: Border-radius 16px, border 1px #E8DDD0, shadow terracota 0 4px 20px rgba(196,125,90,0.08)
- Inputs: Border 1.5px #D4C5B0, border-radius 12px, height 48px, focus: border #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.15)
- Badges: Pill shape, padding 4px 12px, success bg #8BA888/15 text #6B8B6A

---

## Resumen de Fases

| Fase | Duración | Stories | Pantallas | Entregable |
|------|----------|---------|-----------|-----------|
| **FASE 1: Foundation & Setup** | 5 d | US-029 a US-031 | Setup tech | App running, admin auth working |
| **FASE 2: Design System & Layouts** | 3 d | - | - | Layouts + component library |
| **FASE 3: Landing + Storytelling + Waitlist** | 5 d | US-001 a US-004, US-026 a US-028 | 4 screens | Public landing, waitlist working |
| **FASE 4: Catálogo + Wizard Configurador** | 8 d | US-005 a US-013 | 8 screens | Complete purchase flow setup |
| **FASE 5: Preview + Checkout + Pagos** | 8 d | US-014 a US-025 | 7 screens | End-to-end purchase working |
| **FASE 6: Admin — Gestión de Libros + Pre-gen** | 7 d | US-032 a US-041 | 6 screens | Book CRUD + batch generation |
| **FASE 7: Admin — Curación + Pedidos + Descuentos** | 6 d | US-042 a US-053 | 6 screens | Complete admin operations |
| **FASE 8: Quality, SEO & Launch** | 4 d | US-054 a US-056 | 2 screens | Production ready, deployed |
| **TOTAL** | **38 d** | **56 stories** | **22 screens** | **Live storefront** |

---

## FASE 1: Foundation & Setup

**Duración:** 5 días (6-10 marzo)
**Dependencias:** Ninguna
**Entregable:** App running locally con admin auth working, Supabase conectada, env vars configuradas

### 1.0 User Stories de Esta Fase

**US-029: Iniciar Sesión como Admin**
- Como Sofi, quiero entrar a un área restringida con email + contraseña para gestionar el catálogo
- Criterios de aceptación:
  - Ruta /admin/login con formulario email + password
  - Email válido (sofi@tipitibooks.com), password hasheado con bcrypt
  - Sesión persiste con JWT en httpOnly cookie
  - Validación de credenciales contra Supabase Auth
  - Error messaging: "Email o contraseña incorrectos"

**US-030: Protección de Rutas Admin**
- Como Sofi, quiero que las rutas /admin/* solo sean accesibles si estoy logueado
- Criterios de aceptación:
  - Middleware verifica JWT en cada request a /admin
  - Si no autenticado, redirect a /admin/login
  - Si token expirado, redirect a /admin/login con mensaje "Sesión expirada"
  - Layout admin muestra username y botón logout visible

**US-031: Cerrar Sesión como Admin**
- Como Sofi, quiero poder cerrar sesión desde cualquier pantalla del admin
- Criterios de aceptación:
  - Botón "Cerrar sesión" en header/sidebar admin
  - Click limpia httpOnly cookie + JWT
  - Redirect a /admin/login
  - Message: "Sesión cerrada correctamente"

### 1.1 Subfases y Tareas

**Tarea 1.1.1 — Setup inicial del proyecto (1 día)**
- [ ] Crear repo en GitHub
- [ ] Inicializar Next.js 15 con `npx create-next-app@latest --typescript --tailwind`
- [ ] Instalar dependencias: TypeScript, Tailwind 4, shadcn/ui, Zustand, Supabase, Resend, fal-ai, Inngest, pdf-lib, sharp
- [ ] Crear `.env.local` con variables template (vacías)
- [ ] Verificar que `npm run dev` inicia correctamente en `localhost:3000`

**Tarea 1.1.2 — Setup Supabase (1 día)**
- [ ] Crear proyecto Supabase en supabase.com
- [ ] Copiar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY a `.env.local`
- [ ] Crear SUPABASE_SERVICE_ROLE_KEY
- [ ] Ejecutar SQL migrations (tables: books, scenes, character_variants, variant_pages, orders, discount_codes, subscribers, accessories)
- [ ] Seed inicial: insertar libro "Buenas Noches" con 11 escenas (sin imágenes aún)
- [ ] Verificar RLS policies: public libros publicados, admin todo

**Tarea 1.1.3 — Setup Supabase Storage buckets (1 día)**
- [ ] Crear bucket `variant-pages` (imágenes pre-generadas, public)
- [ ] Crear bucket `character-sheets` (character references, public)
- [ ] Crear bucket `setting-sheets` (setting references, public)
- [ ] Crear bucket `print-files` (PDFs finales, private/admin only)
- [ ] Crear bucket `reference-images` (referencias para generación, admin only)
- [ ] Configurar CORS en Supabase para Vercel origin

**Tarea 1.1.4 — Setup Inngest + Resend + env (1 día)**
- [ ] Crear cuenta Inngest dev, copiar INNGEST_EVENT_KEY a `.env.local`
- [ ] Crear cuenta Resend, copiar RESEND_API_KEY
- [ ] Crear cuenta fal.ai, copiar FAL_API_KEY
- [ ] Setup Flow.cl sandbox: obtener FLOW_MERCHANT_ID, FLOW_API_KEY, FLOW_SECRET_KEY
- [ ] Crear cuenta PostHog para analytics (opcional V1)
- [ ] Verificar todas las env vars están correctas

**Tarea 1.1.5 — Admin auth implementation (1 día)**
- [ ] Crear `/src/app/admin/login/page.tsx` con formulario (email, password)
- [ ] Crear Server Action `signInAdmin(email, password)` usando Supabase Auth
- [ ] Crear middleware `/src/middleware.ts` para proteger rutas /admin*
- [ ] Crear `/src/app/admin/layout.tsx` con header + sidebar (Logout button)
- [ ] Verificar login/logout flow funciona localmente
- [ ] Crear `/src/app/admin/dashboard/page.tsx` placeholder

### 1.2 Wireframes — Fase 1

Sin wireframes nuevos. Las rutas de admin/login y admin/dashboard se definen en FASE 2 como parte del Design System.

### 1.3 Stitch Prompts — Fase 1

Sin prompts nuevos. Foundation es pure tech setup.

### 1.4 Checklist de Aceptación — Fase 1

- [ ] `npm run dev` inicia sin errores
- [ ] Supabase tables creadas (8 tablas, RLS enabled)
- [ ] Supabase Storage buckets creados (5 buckets)
- [ ] Libro "Buenas Noches" seeded en DB
- [ ] Admin login funciona: email sofi@tipitibooks.com
- [ ] Middleware protege rutas /admin*
- [ ] Logout limpia sesión y redirige
- [ ] JWT persiste en httpOnly cookie
- [ ] All env vars configuradas en `.env.local`
- [ ] Inngest, Resend, fal.ai, Flow.cl credenciales validadas

### 1.5 Notas Técnicas — Fase 1

- **Supabase Auth:** Usar email + password (sin OAuth en V1). Sofi solo usuario admin.
- **Session management:** httpOnly cookies + JWT refresh tokens automáticos via Supabase
- **Middleware:** Verificar `auth.getUser()` en cada request a /admin*
- **Error handling:** Loggear a console en dev, a Sentry en prod (post-FASE 1)
- **Database:** RLS policies must be tight: public read books/variants/pages si publicados, admin CRUD todo
- **Bucket permissions:** Variant/character/setting sheets public read, print-files private admin only

---

## FASE 2: Design System & Layouts

**Duración:** 3 días (11-13 marzo)
**Dependencias:** FASE 1 completa
**Entregable:** Storefront + admin layouts working, component library ready, fonts loaded, design tokens configured

### 2.0 User Stories de Esta Fase

No hay user stories de esta fase. Es infrastructure.

### 2.1 Subfases y Tareas

**Tarea 2.1.1 — Setup tipografía (1 día)**
- [ ] Descargar Fraunces, DM Sans, Caveat de Google Fonts (o local fonts en `/public/fonts/`)
- [ ] Configurar `@font-face` en `/src/app/globals.css`
- [ ] Crear `/src/lib/fonts.ts` con exports: `fraunces`, `dmSans`, `caveat` para Tailwind
- [ ] Actualizar `tailwind.config.ts` con tipografía personalizada
- [ ] Crear clase utility `.font-display` (Fraunces), `.font-body` (DM Sans), `.font-handwritten` (Caveat)
- [ ] Verificar que fonts cargan en localhost:3000

**Tarea 2.1.2 — Configurar paleta de colores Tailwind (1 día)**
- [ ] Crear `/src/lib/colors.ts` con constantes:
  - `colors.cream = '#FBF7F0'`
  - `colors.terracota = '#C47D5A'`
  - `colors.sage = '#8BA888'`
  - `colors.rose = '#D4A0A0'`
  - `colors.blue = '#7B9DB7'`
  - `colors.text = '#4A3F35'`
  - `colors.textSecondary = '#8B7E6A'`
  - Etc.
- [ ] Extender `tailwind.config.ts` con colores personalizados
- [ ] Crear `/src/components/ui/color-palette.tsx` (demo page con todos los colores)
- [ ] Accesible via ruta interna `/colors` (para QA visual)

**Tarea 2.1.3 — Crear storefront layout (1 día)**
- [ ] Crear `/src/app/(storefront)/layout.tsx`:
  - Header sticky 80px, bg crema 90% opacity con backdrop-blur
  - Logo Tipiti (Fraunces 700 24px) izquierda
  - Nav desktop: Catálogo, Nuestra Historia (DM Sans 500 16px)
  - CTA "Crea tu libro" terracota pill derecha
  - Mobile hamburger menu (ícono Lucide Menu)
  - Navegación responsive: desktop horizontal, mobile sidebar slide-out
- [ ] Crear `/src/app/(storefront)/layout/header.tsx` componente reutilizable
- [ ] Crear `/src/app/(storefront)/layout/footer.tsx`:
  - Fondo crema, border-top 1px #E8DDD0
  - Copyright, email, links sociales (placeholder)
  - Centrado, DM Sans 400 14px
- [ ] Footer debe aparecer en todas las páginas storefront
- [ ] Mobile responsive: header burger, nav scroll, footer full-width

**Tarea 2.1.4 — Crear admin layout (1 día)**
- [ ] Crear `/src/app/admin/layout.tsx`:
  - Sidebar izquierda: 280px width, bg crema, border-right 1px #E8DDD0
  - Sidebar nav items: Dashboard, Libros, Pedidos, Descuentos, Generación, Suscriptores
  - Header sticky 80px: Logo "Tipiti Admin" centro-izquierda, Logout button derecha
  - Main content area: padding 40px, fondo crema
  - Footer admin (opcional): mínimo
  - Mobile: sidebar collapses a hamburger (sidebar slides in), main content full-width
- [ ] Crear `/src/components/admin/sidebar.tsx` componente reutilizable
- [ ] Active nav item highlight: terracota left border 4px
- [ ] Hover states: bg #F0E8DC, cursor pointer

**Tarea 2.1.5 — Base component library (1 día)**
- [ ] Crear shadcn/ui base components: Button, Input, Card, Badge, Dialog, Tabs, Table, Pagination
- [ ] Personalizar Button shadcn para usar paleta Tipiti (primary terracota, secondary transparent, etc.)
- [ ] Crear `/src/components/ui/button-custom.tsx` con size variants: sm (40px), md (48px), lg (56px)
- [ ] Crear `/src/components/ui/input-custom.tsx` con styling Tipiti
- [ ] Crear `/src/components/ui/card-custom.tsx` con sombras cálidas
- [ ] Crear `/src/components/common/loading-spinner.tsx` (terracota, animado)
- [ ] Crear `/src/components/common/toast-notification.tsx` para success/error/info messages

### 2.2 Wireframes — Fase 2

Ninguno. Design System es config visual + componentes.

### 2.3 Stitch Prompts — Fase 2

Ninguno. No hay UI a diseñar aún.

### 2.4 Checklist de Aceptación — Fase 2

- [ ] Fraunces, DM Sans, Caveat cargan sin FOUT
- [ ] Paleta de colores funciona en Tailwind (ej: `bg-cream`, `text-terracota`)
- [ ] Storefront header sticky, responsive
- [ ] Storefront footer aparece en todas las páginas
- [ ] Admin layout sidebar + header
- [ ] Nav items activos muestran indicador visual
- [ ] Button, Input, Card componentes usan diseño Tipiti
- [ ] Mobile responsive: header burger, sidebar collapse, layout single-column
- [ ] Logo Tipiti visible en header (storefront) y admin
- [ ] Todos los estilos usan colores correctos (#FBF7F0 fondo, #C47D5A CTAs, etc.)

### 2.5 Notas Técnicas — Fase 2

- **Fonts:** Usar `next/font` para local loading (mejor performance que Google Fonts externally)
- **Tailwind config:** Use `extend` para agregar colores/tipografía sin sobreescribir defaults
- **Responsive:** Mobile-first: `base` styles, then `md:` desktop overrides
- **Sidebar:** Usar Tailwind con `hidden md:block` para desktop, `block md:hidden` para mobile
- **Colors:** Siempre usar variables Tailwind, no hardcoded hex values

---

## FASE 3: Landing + Storytelling + Waitlist

**Duración:** 5 días (14-18 marzo)
**Dependencias:** FASE 1, FASE 2 completas
**Entregable:** Public landing con hero, story section, how-it-works carousel, waitlist form working, admin subscribers list

### 3.0 User Stories de Esta Fase

**US-001: Ver Landing Page con Hero Emocional**
- Como visitante, quiero ver una landing page hermosa que me enamore del producto en 5 segundos
- Criterios: Hero section con headline, subheadline, CTA primario, ilustración acuarela, full viewport height

**US-002: Leer la Historia de Sofi (Storytelling)**
- Como visitante, quiero conocer la historia de Sofi y por qué creó Tipiti Books
- Criterios: Sección "Nuestra Historia" con imagen + texto artesanal, tono personal y emocional

**US-003: Ver Sección "Cómo Funciona" en 3 Pasos**
- Como visitante, quiero entender el flujo de compra en 3 pasos claros
- Criterios: Grid 3 columnas (desktop) con pasos: personaliza → generamos → recibes

**US-004: Unirse a la Waitlist (Pre-Lanzamiento)**
- Como visitante, quiero suscribirme al newsletter para recibir notificaciones
- Criterios: Email input + submit button, validación, success message "¡Gracias!", email almacenado en DB

**US-026: Suscribirse al Newsletter Post-Compra**
- Como comprador, quiero recibir correos de empresa post-compra
- Criterios: Checkbox "Suscribirse al newsletter" en checkout, pre-checked, email guardado si checked

**US-027: Gestionar Lista de Suscriptores (Admin)**
- Como Sofi, quiero ver lista de todos los suscriptores con filters
- Criterios: Ruta /admin/suscriptores con tabla: email, fecha, fuente (website/landing/checkout), es_activo

**US-028: Exportar Lista de Suscriptores**
- Como Sofi, quiero descargar lista de emails como CSV
- Criterios: Botón "Exportar CSV" descarga `suscriptores-YYYY-MM-DD.csv` con emails

### 3.1 Subfases y Tareas

**Tarea 3.1.1 — Implementar Landing Page (2 días)**
- [ ] Crear `/src/app/(storefront)/page.tsx` (landing home)
- [ ] Implementar HERO SECTION:
  - Asimetría 45/55: texto izquierda, ilustración derecha
  - Headline: "Un libro donde {name} es la protagonista" Fraunces 800 48px
  - Subheadline: "Ilustraciones a mano, personalizadas con amor. Desde $40 USD." DM Sans 400 18px
  - CTA "Crea tu libro" terracota pill + ícono Sparkles
  - Placeholder ilustración acuarela derecha (SVG o imagen)
  - Full viewport height min 600px
  - Mobile: stack vertical, image 300px height
- [ ] Implementar SECCIÓN "NUESTRA HISTORIA":
  - Layout 2 columnas: imagen 40%, texto 60%
  - Headline "Nuestra Historia" Fraunces 700 36px
  - Párrafo storytelling Sofi (2-3 oraciones)
  - Subtext "Artesanía · Calidad · Amor" Fraunces 600 14px
  - Separador sutil arriba (thin line con decoración)
  - Mobile: stack vertical
- [ ] Implementar SECCIÓN "CÓMO FUNCIONA":
  - Headline "Cómo Funciona" Fraunces 700 36px, centrado
  - Grid 3 columnas (desktop):
    * Card 1: Ícono Palette, "Elige el libro y personaliza", "Selecciona nombre, apariencia y dedicatoria"
    * Card 2: Ícono Wand2, "Nosotros generamos tu libro", "Con IA + ilustraciones de artista"
    * Card 3: Ícono Package, "Recibes en casa", "Impresión premium, listo para regalar"
  - Cada card: número círculo (1/2/3) terracota, border-radius 16px, bg #F0E8DC
  - Mobile: 1 columna, cards 100% width
- [ ] Implementar GALERÍA CAROUSEL:
  - Headline "Busca al osito en cada página" Fraunces 700 32px, centrado
  - Carrusel horizontal: 6 imágenes spreads (placeholder rectangles 600×400px)
  - Navigation: ◄ dot dot dot ►, active dot terracota
  - Mobile: swipe gesture, dots centered
- [ ] Implementar SECCIÓN WAITLIST:
  - Headline "Sé de los primeros" Fraunces 700 36px
  - Subtext "Primeros 50 compradores reciben TIPITI20: 20% off"
  - Email input 300px (desktop), 100% (mobile)
  - Submit button "Quiero mi libro" terracota
  - Separador sutil arriba
  - Mobile: full width, padding 40px 20px

**Tarea 3.1.2 — Waitlist form + Resend integration (1 día)**
- [ ] Crear Server Action `/src/app/(storefront)/actions/subscribe.ts`:
  - Validar email format (Zod)
  - Insertar en DB `subscribers` con source='website'
  - Si email ya existe y is_active=true, error "Ya estás suscrito"
  - Enviar email de bienvenida via Resend
- [ ] Crear `/src/components/storefront/waitlist-form.tsx`:
  - Form onSubmit → call subscribe action
  - Loading state: spinner button
  - Success state: toast "¡Gracias por suscribirte!", input vacío
  - Error state: toast con mensaje de error
- [ ] Crear email template `/src/emails/waitlist-welcome.tsx` (React Email):
  - Saludo personalizado
  - "Estamos preparando algo especial para ti"
  - Código TIPITI20 (20% off primeros 50)
  - Link a landing
  - Firma Sofi
- [ ] Verificar Resend está configurado y env var correcto

**Tarea 3.1.3 — Admin subscribers list (1 día)**
- [ ] Crear `/src/app/admin/suscriptores/page.tsx`:
  - Server Component que carga de DB
  - Tabla: email, fecha_suscripcion, fuente (website/landing/checkout), is_activo
  - Columna acciones: "Desactivar" botón secundario
  - Filtros (client-side): email search, fuente filter, is_activo toggle
  - Paginación: 20 items por página
  - Desktop: tabla normal, mobile: cards stack
- [ ] Crear `/src/components/admin/subscribers-table.tsx`
- [ ] Crear Server Action: `unsubscribeEmail(email)` → update is_activo=false
- [ ] Botón "Exportar CSV": descarga archivo con todos los suscriptores

**Tarea 3.1.4 — Export CSV functionality (1 día)**
- [ ] Crear `/src/app/admin/suscriptores/export.ts` Server Action:
  - Query DB: SELECT email, subscribed_at, source, is_active FROM subscribers
  - Format CSV: email,fecha,fuente,activo (headers en español)
  - Stringify con npm `papaparse` o manual
  - Return como Blob
- [ ] Crear botón "Exportar CSV" en `/src/app/admin/suscriptores/page.tsx`:
  - Click → Server Action → download `suscriptores-{YYYY-MM-DD}.csv`
  - Toast: "CSV descargado"

**Tarea 3.1.5 — Newsletter subscribe in checkout (1 día)**
- [ ] Agregar checkbox en checkout form (FASE 5): "Suscribirse al newsletter"
- [ ] Pre-checked por defecto
- [ ] Si checked al completar compra:
  - INSERT en `subscribers` (source='checkout')
  - Si ya existe, solo update is_activo=true
- [ ] Buyer email usado para suscripción

### 3.2 Wireframes — Fase 3

Ver WIREFRAMES-tipiti-books.md:
- §1: Landing Page (hero, story, how-it-works, carousel, waitlist)
- §2: Catalog (grid de libros)
- Aplicar Stitch Prompt 1 (Landing Page) y Stitch Prompt 2 (Catálogo)

### 3.3 Stitch Prompts — Fase 3

- **Prompt 1 de 18:** Landing Page (hero, story, cómo funciona, carousel, waitlist)
  - Usar Design System completo del documento STITCH-PROMPTS-tipiti-books.md
  - IMPORTANTE: Incluir sección "Busca al osito en cada página" con carrusel de 6 spreads
  - Watercolor illustrations para hero y sections

- **Prompt 2 de 18:** Catálogo de Libros
  - Grid 3 columnas (desktop), 1 (mobile)
  - Card estructura: portada (aspect-ratio 3/4), título, edad, precio, CTA "Personalizar"
  - Estados: Disponible (normal), Próximamente (gris + overlay)

### 3.4 Checklist de Aceptación — Fase 3

- [ ] Landing page loads at `/` sin errores
- [ ] Hero section full viewport height, responsive
- [ ] Hero image placeholder muestra acuarela (o color placeholder)
- [ ] "Nuestra Historia" sección visible, 2-column desktop, 1-column mobile
- [ ] "Cómo Funciona" grid 3 columnas con cards, números 1/2/3
- [ ] Carousel con 6 spreads, navigation arrows/dots funcionales
- [ ] Waitlist form: validación de email, insert en DB `subscribers`
- [ ] Success message después de suscripción
- [ ] Resend email de bienvenida llega a email de prueba
- [ ] Admin `/admin/suscriptores` page carga
- [ ] Tabla muestra emails, fechas, fuentes, estados
- [ ] Botón "Desactivar" funciona (update DB is_activo=false)
- [ ] Botón "Exportar CSV" descarga archivo
- [ ] Mobile responsive: waitlist form 100% width, carousel swipeable
- [ ] Todos los textos en español (Chile)

### 3.5 Notas Técnicas — Fase 3

- **Server Actions:** `subscribe.ts` debe validar email antes de insert, manejo de duplicados
- **Resend:** Template debe ser profesional, incluir código TIPITI20 para primeros 50
- **CSV export:** Manual format recomendado (evita dependencia extra), headers en español
- **Carousel:** Usar librería `embla-carousel` (ligero, accesible) o Radix primitives
- **Mobile:** Waitlist form 100% width (no limitar a 300px), button también 100%
- **RLS:** Subscribers table: admin CRUD, public insert only (vía API, sin auth)

---

## FASE 4: Catálogo + Wizard Configurador

**Duración:** 8 días (19-26 marzo)
**Dependencias:** FASE 1, FASE 2, FASE 3 completas
**Entregable:** Complete purchase configurator flow (name → appearance → dedication → summary working), findVariant() lookup ready

### 4.0 User Stories de Esta Fase

**US-005: Ver Catálogo de Libros Disponibles**
- Como comprador, quiero ver todos los libros disponibles en un grid atractivo
- Criterios: Grid 3 columnas (desktop), card con portada, título, edad, precio, CTA "Personalizar"

**US-006: Ver Detalle de un Libro**
- Como comprador, quiero ver detalles completos del libro antes de personalizar
- Criterios: Portada grande, descripción, especificaciones (edad, páginas, tamaño), precio, FAQs, CTA "Personalizar"

**US-007: Compartir Libro en Redes Sociales**
- Como comprador, quiero compartir el libro en WhatsApp/Facebook/Twitter
- Criterios: Botón "Compartir" con opciones (share API nativa o fallback copiar link)

**US-008: Ingresar Nombre del Niño/a (Paso 1 del Wizard)**
- Como comprador, quiero ingresar el nombre del niño/a que recibirá el libro
- Criterios: Input text, validación (min 2 caracteres, max 30), live preview del nombre

**US-009: Seleccionar Género del Personaje (Parte del Paso 2)**
- Como comprador, quiero elegir si el personaje es niño o niña
- Criterios: Radio buttons o toggle: "Niño" / "Niña", afecta apariencia del personaje

**US-010: Seleccionar Apariencia del Personaje en Grid Visual (Paso 2)**
- Como comprador, quiero elegir pelo, piel, lentes de un grid visual
- Criterios: Grid 2D + extras selector:
  - Pelo: color (castaño, pelirrojo, negro) × tipo (liso, ondulado)
  - Piel: tono (claro, mate, oscuro)
  - Lentes: sí/no
  - Live preview: personaje actualiza en tiempo real (character sheet de 4 vistas)

**US-011: Escribir Dedicatoria (Paso 3 del Wizard)**
- Como comprador, quiero escribir una dedicatoria personal para el libro
- Criterios: Textarea, max 200 caracteres, live preview de cómo se vería en el libro, contador

**US-012: Ver Resumen de Selección antes del Preview**
- Como comprador, quiero ver un resumen de mis selecciones antes de ir al preview
- Criterios: Paso 4 muestra: nombre, personaje (imagen), dedicatoria, opciones para editar cada uno

**US-013: Navegar Libremente entre Pasos del Wizard**
- Como comprador, quiero poder avanzar y retroceder entre pasos, no ser forzado a flujo lineal
- Criterios: Progress bar con números 1/2/3/4, click en paso anterior salta atrás, estado persiste

### 4.1 Subfases y Tareas

**Tarea 4.1.1 — Catálogo page (2 días)**
- [ ] Crear `/src/app/(storefront)/catalogo/page.tsx`:
  - Server Component que carga books de DB WHERE is_published=true
  - Heading "Nuestros Libros" Fraunces 700 44px
  - Subheading "Elige tu favorito y personaliza"
  - Grid layout: 3 columnas (desktop), 1 (mobile), gap 32px
- [ ] Crear `/src/components/storefront/book-card.tsx`:
  - Estructura: portada (aspect-ratio 3/4), título, edad, precio, CTA "Personalizar"
  - Portada: image placeholder con border-radius 16px top
  - Título: Fraunces 600 20px
  - Edad/páginas: DM Sans 400 14px, color secondary
  - Precio: Fraunces 700 24px, color terracota
  - CTA button: 100% width, onClick navega a `/libro/{slug}`
  - Hover: card translate-y -4px, shadow intensifica
- [ ] Cargar portada desde `books.cover_template_url` (Supabase Storage)
- [ ] Estado "Próximamente": overlay gris, disable CTA, show "Avisame cuando esté listo"

**Tarea 4.1.2 — Detalle de libro (2 días)**
- [ ] Crear `/src/app/(storefront)/libro/[slug]/page.tsx`:
  - Breadcrumb: "Inicio > Catálogo > {title}"
  - Layout asimétrico: galería spreads 50%, info 50%
- [ ] Galería de spreads:
  - Carrusel 6 spreads (portada + 5 interiores)
  - Main image aspect-ratio 3/2, border-radius 12px
  - Thumbnail strip debajo: 6 imágenes 80×60px, active border terracota
  - Navigation arrows + dots
- [ ] Info column:
  - Título: Fraunces 700 32px
  - Descripción: DM Sans 400 16px, line-height 1.8
  - Especificaciones: 👶 Edad, 📏 Tamaño, 📄 Páginas, ✨ Impresión
  - Precio: Fraunces 700 28px, terracota
  - CTA "Personalizar este libro": terracota pill, ícono Sparkles
  - CTA "Compartir": secundario, ícono Share2
- [ ] Crear `/src/components/storefront/book-detail.tsx` componente
- [ ] Crear `/src/components/storefront/book-faq.tsx`:
  - Accordion: 3-4 preguntas típicas (edad recomendada, impresión, tiempo de envío)
  - Usar Radix UI accordion o shadcn/ui Accordion

**Tarea 4.1.3 — Share button integration (1 día)**
- [ ] Crear `/src/components/storefront/share-button.tsx`:
  - Server: `navigator.share()` API nativa (mobile)
  - Fallback desktop: copiar link al portapapeles + toast "¡Copiado!"
  - Ícono Lucide Share2, botón secundario
  - Share text: "Mira este libro para {name} — Tipiti Books"
  - Share URL: `https://tipitibooks.com/libro/{slug}`

**Tarea 4.1.4 — Zustand configurator store (1 día)**
- [ ] Crear `/src/stores/configurator-store.ts`:
  - State: `{ bookId, childName, gender, hairColor, hairType, skinTone, hasGlasses, dedication, currentStep }`
  - Actions: `setChildName()`, `setGender()`, `setHairColor()`, etc., `setStep()`, `reset()`
  - Persist to localStorage (opcional: para recuperar si cierra tab)
  - Estado es local al cliente (no sincroniza con DB hasta checkout)
- [ ] Usar en Wizard componentes con `useConfiguratorStore()`

**Tarea 4.1.5 — Wizard Paso 1: Nombre (1 día)**
- [ ] Crear `/src/app/(storefront)/wizard/paso-1/page.tsx`:
  - Layout: Wizard Progress Bar (Step 1/4 highlighted)
  - Form: Input "Nombre del niño/a"
  - Validación: min 2 chars, max 30 chars, no números
  - Live preview derecha: texto "{name} es la protagonista" superpuesto en fondo crema
  - Submit button "Siguiente" → setChildName() + navigate a paso-2
  - "Anterior" button (disabled en paso 1)
  - Mobile: progress bar top, form 100% width

**Tarea 4.1.6 — Wizard Paso 2: Apariencia (2 días)**
- [ ] Crear `/src/app/(storefront)/wizard/paso-2/page.tsx`:
  - Progress bar Step 2/4
  - Layout: Grid selector izquierda, live preview derecha (character sheet)
  - Gender selector: Radio "Niño" / "Niña" (2 buttons toggle style)
  - Hair selector: Grid 3×2 (3 colores × 2 tipos = 6 opciones)
    * Ícono/label para cada: "Castaño Liso", "Castaño Ondulado", etc.
    * Active border terracota
  - Skin tone selector: Radio "Claro" / "Mate" / "Oscuro" (3 buttons)
  - Glasses selector: Checkbox "Incluir lentes" (toggle style)
  - Live preview character sheet (4 vistas: frontal, lateral, 3/4, full body)
    * Placeholder si variante no exists yet (grayscale, "Próximamente")
  - Next/Back buttons
  - Mobile: stack vertical, preview reducido

**Tarea 4.1.7 — Wizard Paso 3: Dedicatoria (1 día)**
- [ ] Crear `/src/app/(storefront)/wizard/paso-3/page.tsx`:
  - Progress bar Step 3/4
  - Textarea: "Escribe una dedicatoria personal"
  - Max 200 chars, contador visible
  - Placeholder: "Ej: Para Sofia, con amor de mamá"
  - Live preview derecha: cómo se vería en última página del libro
    * Fuente Caveat (handwritten style)
    * Posición en página (centrada, bajo ilustración)
  - Next/Back buttons
  - Mobile: stack vertical

**Tarea 4.1.8 — Wizard Paso 4: Resumen (1 día)**
- [ ] Crear `/src/app/(storefront)/wizard/paso-4/page.tsx`:
  - Progress bar Step 4/4
  - Summary cards (4 cards pequeñas, editables):
    * Card 1: "Nombre: {name}" — click abre modal input
    * Card 2: "Personaje" + character sheet thumb — click vuelve a paso-2
    * Card 3: "Dedicatoria: {dedication}" — click abre modal textarea
    * Card 4: "Libro: {title}" (read-only)
  - CTA "Ver Preview" terracota → navega a `/preview`
  - "Editar" links en cada card
  - Mobile: stack vertical

**Tarea 4.1.9 — findVariant() lookup function (1 día)**
- [ ] Crear `/src/lib/utils/variant-lookup.ts`:
  - Export `findVariant(bookId, gender, hairColor, hairType, skinTone, hasGlasses): Promise<CharacterVariant>`
  - Query DB `character_variants` WHERE book_id={bookId} AND gender={gender} AND ... AND status='approved'
  - Si no found: return `null` → paso 2 muestra "Próximamente"
  - Si found: return variant con `portrait_url` y `character_sheet_urls`
  - Cache en memory (Zustand store) para evitar re-queries en paso 2 live updates

### 4.2 Wireframes — Fase 4

Ver WIREFRAMES-tipiti-books.md:
- §2: Catálogo
- §3: Detalle Libro
- §4-7: Wizard Pasos 1-4

Aplicar Stitch Prompts 2 (Catálogo), 3 (Detalle), y 4-7 (Wizard steps).

### 4.3 Stitch Prompts — Fase 4

- **Prompt 2 de 18:** Catálogo de Libros — grid 3 columnas, cards con portada/título/precio/CTA
- **Prompt 3 de 18:** Detalle del Libro — galería spreads, info, FAQs, CTA "Personalizar"
- **Prompt 4 de 18:** Wizard Paso 1 (Nombre) — input, live preview, progress bar
- **Prompt 5 de 18:** Wizard Paso 2 (Apariencia) — grid selector, live character preview
- **Prompt 6 de 18:** Wizard Paso 3 (Dedicatoria) — textarea, live preview handwritten
- **Prompt 7 de 18:** Wizard Paso 4 (Resumen) — 4 cards editables, CTA "Ver Preview"

### 4.4 Checklist de Aceptación — Fase 4

- [ ] `/catalogo` page loads, muestra todos los libros publicados
- [ ] Book cards muestran portada, título, edad, precio, CTA
- [ ] `/libro/[slug]` page loads con detalles completos
- [ ] Galería spreads funciona: arrows, dots, thumbnails
- [ ] Share button copia link o abre share API
- [ ] Zustand store persiste estado en localStorage
- [ ] Wizard paso 1: input nombre, validación, live preview
- [ ] Wizard paso 2: gender + hair + skin + glasses selectors, live character preview
- [ ] Wizard paso 3: textarea dedicatoria, contador, live preview handwritten
- [ ] Wizard paso 4: 4 cards con opciones de editar, CTA "Ver Preview"
- [ ] Progress bar mostranova paso actual (1/2/3/4)
- [ ] Navegación atrás/adelante funciona
- [ ] findVariant() lookup retorna variante correcta o null si no exists
- [ ] Mobile responsive: forms 100% width, progress bar visible
- [ ] Todos los textos en español

### 4.5 Notas Técnicas — Fase 4

- **State management:** Zustand store es source of truth, persiste en localStorage
- **Live preview:** Character sheet URLs se cargan del DB vía findVariant()
- **Validación:** Zod schemas para nombre, dedicatoria (ya creados en FASE 2)
- **Routing:** Wizard es una "aplicación" dentro de storefront, estado se pierde al reload (OK para V1)
- **Mobile:** Wizard components deben stackear vertical, inputs 100% width
- **Accessibility:** Radio buttons accesibles, textarea con label, focus states visibles

---

## FASE 5: Preview + Checkout + Pagos

**Duración:** 8 días (27 marzo - 3 abril)
**Dependencias:** FASE 1-4 completas
**Entregable:** End-to-end purchase flow working, Flow.cl + MercadoPago integration live, webhooks handling payments, PDFs composing

### 5.0 User Stories de Esta Fase

**US-014: Ver Preview Animado del Libro (Page-Flip)**
- Como comprador, quiero ver una animación de page-flip del libro personalizado antes de pagar
- Criterios: 11 páginas (portada + 10 spreads/interiores), nombre superpuesto, animación flip suave

**US-015: Ver CTA de Compra Después del Preview**
- Como comprador, quiero un botón claro "Comprar Ahora" después del preview
- Criterios: Botón terracota pill, precio total, navega a `/checkout`

**US-016: Compartir Preview del Libro**
- Como comprador, quiero compartir link del preview (sin spoiler) antes de comprar
- Criterios: Botón "Compartir Preview" abre share API o copia link a `/preview/{previewId}`

**US-017: Completar Formulario de Envío**
- Como comprador, quiero ingresar dirección de envío y datos personales
- Criterios: Nombre, email, teléfono, calle, ciudad, región, país (prefill CL)

**US-018: Aplicar Código de Descuento en Checkout**
- Como comprador, quiero aplicar un código de descuento (TIPITI20 = 20% off)
- Criterios: Input "Código de descuento", validación vía API, muestra descuento aplicado

**US-019: Pagar con Flow.cl (Gateway Principal)**
- Como comprador, quiero pagar con Flow.cl (tarjeta de crédito, transferencia)
- Criterios: Botón "Pagar con Flow.cl" abre popup/inline, procesa pago, webhook confirma

**US-020: Pagar con MercadoPago (Opción Secundaria)**
- Como comprador, quiero opción de MercadoPago si Flow.cl no funciona
- Criterios: Botón "Pagar con MercadoPago" redirects a MercadoPago, webhook confirma

**US-021: Ver Confirmación de Compra Exitosa**
- Como comprador, quiero ver página de éxito con resumen del pedido
- Criterios: Número de pedido, fecha, monto, dirección, "pronto recibirás email"

**US-022: Ver Página de Pago Fallido**
- Como comprador, quiero saber qué salió mal si el pago falla
- Criterios: Mensaje de error claro, botón "Reintentar", link a soporte

**US-023: Recibir Email de Confirmación de Pedido**
- Como comprador, quiero email de confirmación con detalles del pedido
- Criterios: Email a buyer_email, resumen, número pedido, estimado de entrega

**US-024: Recibir Email de Notificación de Envío**
- Como comprador, quiero email cuando el libro se envía
- Criterios: Email incluye tracking number, carrier info, estimado de llegada

**US-025: Notificar a Sofi de Nuevo Pedido**
- Como Sofi, quiero recibir email de cada nuevo pedido para empezar fulfillment
- Criterios: Email a sofi@tipitibooks.com, resumen pedido, link a `/admin/pedidos/{orderId}`

### 5.1 Subfases y Tareas

**Tarea 5.1.1 — Preview page con page-flip (2 días)**
- [ ] Crear `/src/app/(storefront)/preview/page.tsx`:
  - Leer estado del Zustand configurator
  - Llamar findVariant() para obtener todas las 11 páginas (variant_pages)
  - Superponer nombre del niño/a en cada página (text overlay con Sharp?)
  - Mostrar página-flip animation (librería: `react-pageflip` o `turn.js`)
  - Navegación: ◄ previous, page counter (X / 11), next ►
  - Mobile: full viewport, swipe gestures
- [ ] Crear `/src/components/storefront/book-preview.tsx`:
  - Componente reutilizable, recibe `pages: VariantPage[]`, `childName: string`
  - Renderiza page-flip animation con todas las páginas
  - Controles navegación abajo
- [ ] CTA "Comprar Ahora" debajo del preview: terracota pill, navega a `/checkout`
  - Mostrar precio total
- [ ] CTA "Compartir Preview": botón secundario, share API o copiar link

**Tarea 5.1.2 — Checkout form (2 días)**
- [ ] Crear `/src/app/(storefront)/checkout/page.tsx`:
  - Layout 2 columnas (desktop): form izquierda, order summary derecha
  - Order Summary (sticky):
    * Portada del libro
    * Nombre del niño/a
    * Precio base CLP
    * Subtotal
    * Descuento (si aplicado, con raya roja)
    * Total
  - Formulario izquierda (Zod validated):
    * Sección "Datos del Comprador": nombre, email, teléfono
    * Sección "Dirección de Envío": calle, ciudad, región (dropdown), país (prefill CL)
    * Sección "Código de Descuento": input + button "Aplicar"
    * Sección "Newsletter": checkbox "Suscribirse" (pre-checked)
    * Botones: "Pagar con Flow.cl", "Pagar con MercadoPago" (ambos terracota)
  - Mobile: single column, order summary arriba
- [ ] Crear `/src/components/storefront/checkout-form.tsx`
- [ ] Crear Server Action `/src/app/(storefront)/actions/validate-discount.ts`:
  - Recibe `code: string`
  - Query DB `discount_codes` WHERE code={code} AND is_active=true AND (expires_at > now() OR expires_at IS NULL)
  - Si found: return `{ success: true, type, value, discount_amount }`
  - Si not found o expired: return `{ success: false, message: "Código inválido" }`
  - Check used_count < max_uses (si max_uses set)

**Tarea 5.1.3 — Flow.cl integration (2 días)**
- [ ] Crear `/src/lib/flow/client.ts`:
  - Wrapper para Flow.cl SDK
  - `initPayment(amount, orderId, email)` → retorna payment URL
  - Configurar webhook URL: `https://tipitibooks.com/api/webhooks/flow`
  - Testear en sandbox: FLOW_MERCHANT_ID, FLOW_API_KEY, FLOW_SECRET_KEY
- [ ] Crear Server Action `/src/app/(storefront)/actions/create-order.ts`:
  - Recibe: wizard state (bookId, childName, dedication), buyer data, variant_id, discount
  - Validar variant_id exists y está approved
  - INSERT en DB `orders`:
    * status='created'
    * payment_status='pending'
    * variant_id, book_id, child_name, dedication, buyer_*, shipping_*
    * discount_code_id (si aplicado)
    * amount_paid=price_clp - discount_amount
  - Return `orderId`
- [ ] Crear `/src/app/(storefront)/pago/page.tsx`:
  - Server Component que recibe `?orderId=XXX`
  - Carga order de DB
  - Llama Flow.cl initPayment()
  - Redirect a Flow.cl payment URL (o inline popup)
- [ ] Crear webhook handler `/src/app/api/webhooks/flow/route.ts`:
  - Recibe Flow.cl webhook (POST)
  - Verificar signature (HMAC con FLOW_SECRET_KEY)
  - Si `token_id` retornado:
    * Query order by payment_id=token_id
    * UPDATE order: payment_status='paid', status='paid'
    * Trigger composición PDF (Inngest job)
    * Enviar email de confirmación a comprador
    * Enviar email a Sofi
  - Return `200 OK`

**Tarea 5.1.4 — MercadoPago integration (1 día)**
- [ ] Crear `/src/lib/mercadopago/client.ts`:
  - Wrapper para MercadoPago SDK
  - `initPayment(amount, orderId, email)` → retorna redirect URL
  - Webhook URL: `https://tipitibooks.com/api/webhooks/mercadopago`
- [ ] Crear webhook handler `/src/app/api/webhooks/mercadopago/route.ts`:
  - Similar a Flow.cl webhook
  - Verificar `payment.status='approved'`
  - UPDATE order, trigger PDF composition, enviar emails

**Tarea 5.1.5 — PDF Composition engine (2 días)**
- [ ] Crear `/src/lib/compose/pdf-builder.ts`:
  - Función `composePDF(order, variant, book): Promise<Buffer>`
  - Descargar character sheet + setting sheet de Storage
  - Descargar las 11 imágenes de variant_pages
  - Para cada página:
    * Cargar imagen base (illustration)
    * Superponer nombre del niño/a (text overlay con Sharp)
    * Superponer dedicatoria en última página
    * Ensamblar en PDF (pdf-lib)
  - Retorna PDF Buffer
  - Subir PDF a Storage `print-files/{orderId}.pdf`
- [ ] Crear Server Action `/src/app/api/compose/route.ts`:
  - POST endpoint: recibe `orderId`
  - Llama `composePDF(order, variant, book)`
  - UPDATE order: print_file_url=URL Storage, print_status='ready'
  - Trigger email a Sofi
  - Return status
- [ ] Integrar en webhook Flow.cl/MercadoPago:
  - Después de UPDATE payment_status='paid'
  - Crear Inngest job: `generatePrintFile.invoke({ orderId })`

**Tarea 5.1.6 — Success/Failure pages (1 día)**
- [ ] Crear `/src/app/(storefront)/pago/success/page.tsx`:
  - Server Component que recibe `?orderId=XXX&token_id=XXX`
  - Muestra ticket de compra:
    * Checkmark icon terracota
    * "¡Gracias por tu compra!"
    * Número de pedido
    * Monto pagado
    * Dirección de envío
    * "Pronto recibirás email de confirmación"
  - CTAs: "Volver al inicio", "Ver más libros"
- [ ] Crear `/src/app/(storefront)/pago/failure/page.tsx`:
  - Error message
  - Razón del error (si disponible)
  - Botón "Reintentar" → vuelve a `/checkout?orderId=XXX`
  - Link a soporte email

**Tarea 5.1.7 — Email templates (1 día)**
- [ ] Crear `/src/emails/order-confirmation.tsx` (React Email):
  - Saludo con nombre comprador
  - Resumen pedido: nombre niño/a, libro, dedicatoria
  - Número pedido, fecha, monto
  - "Pronto iniciaremos la impresión"
  - Link a tracking (cuando esté listo)
  - Firma Sofi
- [ ] Crear `/src/emails/shipping-notification.tsx`:
  - "¡Tu libro está en camino!"
  - Número de seguimiento
  - Carrier (Correos Chile, DHL, etc.)
  - Estimado de entrega
  - Link a tracking
- [ ] Crear `/src/emails/new-order-admin.tsx`:
  - Para Sofi
  - Resumen pedido completo
  - Detalles buyer
  - Link directo a `/admin/pedidos/{orderId}`
  - "Acción requerida: revisar y enviar a imprenta"

### 5.2 Wireframes — Fase 5

Ver WIREFRAMES-tipiti-books.md:
- §8: Preview Page (page-flip)
- §9: Checkout
- §10: Success Page
- §11: Failure Page

### 5.3 Stitch Prompts — Fase 5

- **Prompt 8 de 18:** Preview Page — page-flip animation, controls, precio, CTA "Comprar"
- **Prompt 9 de 18:** Checkout — form izquierda (buyer data, shipping, discount), order summary derecha (sticky)
- **Prompt 10 de 18:** Success Page — ticket de compra, orden number, dirección
- **Prompt 11 de 18:** Failure Page — error message, botón "Reintentar"

### 5.4 Checklist de Aceptación — Fase 5

- [ ] `/preview` muestra 11 páginas con page-flip animation
- [ ] Nombre del niño/a superpuesto en páginas
- [ ] Controles navegación funcionales (◄ contador ►)
- [ ] `/checkout` form valida todos los campos
- [ ] Código de descuento input valida vía API
- [ ] Order summary muestra precio, descuento, total
- [ ] Flow.cl payment inicia y retorna a success/failure
- [ ] Webhook Flow.cl procesa payment correctamente
- [ ] MercadoPago payment inicia (alternativa)
- [ ] Webhook MercadoPago procesa payment
- [ ] PDF se compone correctamente (text overlays)
- [ ] `/pago/success` muestra ticket con order number
- [ ] `/pago/failure` muestra error, botón "Reintentar"
- [ ] Email de confirmación llega a buyer
- [ ] Email de nuevo pedido llega a Sofi
- [ ] Order en DB: payment_status='paid', print_status='ready'
- [ ] Print file URL guardado en order
- [ ] Mobile responsive: form 100% width, order summary debajo

### 5.5 Notas Técnicas — Fase 5

- **Flow.cl:** Usar sandbox en dev, producción en deploy
- **Webhooks:** HMAC verification crítico, implementar retry logic con Inngest
- **PDF:** Sharp para text overlay requiere análisis de imagen (blobs), pdf-lib para ensamblaje
- **Emails:** Resend templates deben ser profesionales, incluir tracking links
- **Error handling:** Sentry para logging de errores de pago
- **Idempotency:** Webhook handlers deben verificar que order no fue procesado 2 veces (check payment_status)

---

## FASE 6: Admin — Gestión de Libros + Pre-generación

**Duración:** 7 días (4-10 abril)
**Dependencias:** FASE 1-5 completas
**Entregable:** Book CRUD, scene editor, generation engine selector, batch generation pipeline working, monitor UI

### 6.0 User Stories de Esta Fase

**US-032: Ver Lista de Libros del Catálogo (Admin)**
- Como Sofi, quiero ver lista de todos los libros con estado
- Criterios: Tabla: título, total_escenas, variantes_aprobadas/total, is_publicado, acciones (editar, copiar, borrar)

**US-033: Crear/Editar Libro en Admin**
- Como Sofi, quiero crear un nuevo libro y editar existentes
- Criterios: Form: título_template, descripción, age_target, precio_clp, generation_engine, is_published toggle

**US-034: Editar Escenas de un Libro (Editor WYSIWYG)**
- Como Sofi, quiero editar textos narrativos de cada escena
- Criterios: WYSIWYG editor, {name} tag preservation, preview en tiempo real, save

**US-035: Reordenar Escenas con Drag & Drop**
- Como Sofi, quiero cambiar orden de escenas con drag & drop
- Criterios: Reorderable list, persist a DB, scene_number auto-actualiza

**US-036: Subir Setting Sheet para un Libro**
- Como Sofi, quiero subir referencia visual (setting sheet) para un libro
- Criterios: File upload, guardar URL en `books.setting_sheet_urls`, preview

**US-037: Configurar Motor de IA por Libro**
- Como Sofi, quiero elegir qué motor IA usar para generar variantes de un libro
- Criterios: Dropdown: "FLUX Kontext Pro" (default), opciones futuras

**US-038: Lanzar Pre-generación de Todas las Variantes**
- Como Sofi, quiero generar todas las 80 variantes × 11 páginas de un libro
- Criterios: Botón "Generar Variantes", confirmación, inicia Inngest batch job, monitor muestra progreso

**US-039: Monitorear Progreso de Pre-generación**
- Como Sofi, quiero ver progreso en tiempo real (X/880 imágenes, % completado)
- Criterios: Real-time updates (polling o WebSocket), muestra éxitos, errores, reintentos

**US-040: Regenerar Variante Individual**
- Como Sofi, quiero regenerar una variante específica si se ve mal
- Criterios: Botón en grid de variantes, Inngest job para 11 páginas, progress tracker

**US-041: Generar Variante con Combinación Específica**
- Como Sofi, quiero generar UNA variante (no todas 80) especificando atributos
- Criterios: Modal: gender, hair_color, hair_type, skin_tone, has_glasses, botón "Generar", monitor

### 6.1 Subfases y Tareas

**Tarea 6.1.1 — Book CRUD admin (2 días)**
- [ ] Crear `/src/app/admin/libros/page.tsx`: tabla de libros con columnas slug, título, escenas, variantes (X/Y aprobadas), publicado, acciones
- [ ] Crear `/src/app/admin/libros/[bookId]/page.tsx`: detalle del libro, form editable (título, descripción, edad, precio, motor IA, is_published)
- [ ] Crear Server Actions: `createBook()`, `updateBook()`, `deleteBook()`
- [ ] Crear `/src/components/admin/book-form.tsx`: form con validación Zod

**Tarea 6.1.2 — Scene editor WYSIWYG (2 días)**
- [ ] Crear `/src/app/admin/libros/[bookId]/editor/page.tsx`: reorderable list de escenas
- [ ] Cada escena: número, descripción visual, textarea texto narrativo (con {name} tag preservation)
- [ ] WYSIWYG editor (Lexical o Slate): bold, italic, links, preservar {name} token
- [ ] Preview en tiempo real: mostrar cómo se vería el texto en el libro
- [ ] Drag & drop reordenar, auto-update scene_number
- [ ] Button "Setting Sheet": file upload para setting_sheet_url por libro

**Tarea 6.1.3 — Generation engine + batch jobs (2 días)**
- [ ] Crear Inngest functions `/src/lib/inngest/functions/`:
  - `generateAllVariants.ts`: loop sobre 80 variantes, para cada una: `generateVariant()`
  - `generateVariant.ts`: generar 11 páginas (portrait + 10 scenes)
  - `upscaleVariantPages.ts`: upscale images a hi-res opcional
- [ ] Crear `/src/app/admin/libros/[bookId]/page.tsx` botón "Generar Variantes":
  - Modal confirmación
  - Inicia Inngest job: `generateAllVariants.invoke({ bookId })`
  - Redirige a `/admin/generacion?bookId={bookId}` para monitorear
- [ ] Implementar `findVariant()` como lookup pre-generación: query character_variants WHERE status='pending'/'generating'/'generated'

**Tarea 6.1.4 — Generation monitor UI (1 día)**
- [ ] Crear `/src/app/admin/generacion/page.tsx`: real-time progress monitor
  - Selector filtro por bookId (dropdown)
  - Tabla: variant (boy/brown/straight/light/no-glasses), status (pending/generating/generated/approved), progreso (0/11 páginas)
  - Gráfico: X/880 imágenes, porcentaje completado
  - Log en tiempo real: últimas acciones (si Inngest retorna eventos)
  - Botón "Pausar job", "Reanudar job", "Cancelar" (admin only)
- [ ] Usar polling o WebSocket a endpoint `/api/generation-status?bookId={bookId}` que retorna estado del Inngest job

**Tarea 6.1.5 — Regenerate single variant (1 día)**
- [ ] En `/src/app/admin/libros/[bookId]/variantes/page.tsx` (FASE 7): cada variante tiene botón "Regenerar"
- [ ] Click → modal confirmación "¿Regenerar esta variante? (11 páginas)"
- [ ] Inicia Inngest: `generateVariant.invoke({ variantId })`
- [ ] Redirige a monitor con filtro por bookId

### 6.2 Wireframes — Fase 6

Ver WIREFRAMES-tipiti-books.md:
- §12: Admin Book List
- §13: Book Editor
- §14: Generation Monitor

Aplicar Stitch Prompts 12-14.

### 6.3 Stitch Prompts — Fase 6

- **Prompt 12 de 18:** Admin Book List — tabla, acciones (editar, copiar, borrar), botón "Nuevo libro"
- **Prompt 13 de 18:** Book Editor — escenas reordenables, WYSIWYG editor, setting sheet upload
- **Prompt 14 de 18:** Generation Monitor — real-time progress, tabla variantes, logs

### 6.4 Checklist de Aceptación — Fase 6

- [ ] `/admin/libros` muestra tabla de libros publicados + no publicados
- [ ] Botón "Nuevo libro" abre form
- [ ] Form libro: título, descripción, edad, precio, motor IA, toggle publicado
- [ ] Edit libro funciona: cambios persisten en DB
- [ ] Delete libro abre confirmación
- [ ] Scene editor: lista escenas reordenables
- [ ] WYSIWYG editor preserva {name} token
- [ ] Preview escena muestra texto en tiempo real
- [ ] Setting sheet upload funciona
- [ ] Botón "Generar Variantes" inicia Inngest job
- [ ] Monitor genera muestra progreso real-time
- [ ] 80 variantes × 11 páginas se generan en secuencia
- [ ] Imágenes se almacenan en Storage
- [ ] character_variants + variant_pages se populan en DB
- [ ] Botón "Regenerar" en variante individual funciona
- [ ] Status variante cambia: pending → generating → generated

### 6.5 Notas Técnicas — Fase 6

- **Inngest:** Usar `batchSize: 4` para ~4 variantes en paralelo (vs 80 secuencial)
- **fal.ai:** FLUX Kontext Pro seed determinista: guardar seed en variant_pages.seed_used
- **Storage:** Crear folders: `variant-pages/{bookId}/{variantId}/` para organizar imágenes
- **RLS:** Variantes pending/generating no se muestran públicamente hasta approved
- **UI Feedback:** Progress bar con % completado, toast notificaciones para errores

---

## FASE 7: Admin — Curación + Pedidos + Descuentos

**Duración:** 6 días (11-16 abril)
**Dependencias:** FASE 1-6 completas
**Entregable:** Complete admin operations (curate variants, manage orders, discounts)

### 7.0 User Stories de Esta Fase

**US-042: Ver Grid de Variantes de un Libro**
- Como Sofi, quiero ver grid de todas las 80 variantes con thumbnails
- Criterios: Grid 6 columnas, cada variante: thumbnail character sheet, status badge, botones acciones

**US-043: Revisar Detalle de una Variante (11 Páginas)**
- Como Sofi, quiero revisar todas las 11 páginas de una variante antes de aprobar
- Criterios: Gallery 11 imágenes, flip entre páginas, botones "Aprobar", "Rechazar", "Regenerar"

**US-044: Aprobar/Rechazar Variantes en Bulk**
- Como Sofi, quiero seleccionar múltiples variantes y aprobar/rechazar juntas
- Criterios: Checkboxes, bulk actions: "Aprobar seleccionadas", "Rechazar seleccionadas"

**US-045: Comparar Versiones de una Página (Side-by-Side)**
- Como Sofi, quiero comparar 2 versiones de la misma página (antes/después regeneración)
- Criterios: Modal side-by-side view, zoom, slider para comparar

**US-046: Ver Lista de Pedidos (Admin)**
- Como Sofi, quiero ver todos los pedidos con estado
- Criterios: Tabla filtrable: order_id, buyer, libro, status (created/paid/composing/.../shipped), fecha, acciones

**US-047: Ver y Gestionar Detalle de un Pedido**
- Como Sofi, quiero ver detalles completos y avanzar estado del pedido manualmente
- Criterios: Número pedido, buyer info, dirección, status timeline, botones para cambiar estado, PDF download

**US-048: Composición Automática del PDF para Impresión**
- Como sistema, quiero componer automáticamente el PDF después del pago
- Criterios: Server Action triggered por webhook pago, texto + imágenes, PDF guardado en Storage

**US-049: Dashboard Operacional con Métricas**
- Como Sofi, quiero ver métricas de operación: ventas hoy/semana/mes, pedidos pending, variantes aprobadas
- Criterios: Cards con números, gráficos simples (vendidos por día), top libros

**US-050: Alertas de Pedidos Atrasados**
- Como Sofi, quiero ser alertado si un pedido no progresa en X días
- Criterios: Dashboard muestra pedidos en estado "paid" hace >3 días, badge rojo "Atrasado"

**US-051: Crear y Gestionar Códigos de Descuento (Admin)**
- Como Sofi, quiero crear códigos de descuento (TIPITI20 = 20% off)
- Criterios: CRUD: código, tipo (%, $), valor, max_uses, expires_at, is_activo toggle

**US-052: Validar Código de Descuento (API)**
- Como API, quiero validar un código antes de aplicarlo
- Criterios: Endpoint `/api/discount-codes/validate?code=TIPITI20` retorna { success, type, value, discount_amount }

**US-053: Aplicar Descuento al Confirmar Pedido**
- Como comprador, quiero que el descuento se reste del total en checkout
- Criterios: Order.discount_amount actualiza, amount_paid = precio - descuento

### 7.1 Subfases y Tareas

**Tarea 7.1.1 — Variant curation grid (2 días)**
- [ ] Crear `/src/app/admin/libros/[bookId]/variantes/page.tsx`: grid 6 columnas de todas las variantes
- [ ] Cada card: thumbnail character sheet (4-view), badge status (pending/generating/generated/approved/rejected), botones "Ver", "Regenerar", "Aprobar", "Rechazar"
- [ ] Implementar bulk selection: checkboxes, bulk actions toolbar
- [ ] Filtro: "Mostrar solo Aprobadas" toggle, status filter
- [ ] Ordenamiento: por status, por atributos (género, color, etc.)

**Tarea 7.1.2 — Variant detail + curation (1 día)**
- [ ] Crear `/src/app/admin/libros/[bookId]/variante/[variantId]/page.tsx`: galería 11 páginas
- [ ] Navigation: ◄ página N/11 ►, thumbnails strip abajo
- [ ] Buttons: "Aprobar", "Rechazar", "Regenerar"
- [ ] Click "Aprobar" → UPDATE character_variants SET status='approved', approved_at=now(), approved_by='sofi'
- [ ] Click "Rechazar" → UPDATE status='rejected'

**Tarea 7.1.3 — Order management (2 días)**
- [ ] Crear `/src/app/admin/pedidos/page.tsx`: tabla de todas las órdenes
  - Columnas: order_id, buyer_name, libro, status (badge con color), fecha, monto
  - Filtros: status dropdown, fecha range picker, buyer email search
  - Paginación: 20 por página
  - Botón "Exportar CSV" (todas las órdenes)
- [ ] Crear `/src/app/admin/pedidos/[orderId]/page.tsx`: detalle pedido
  - Timeline visual: created → paid → composing → ready_to_print → sent_to_printer → qa_check → packing → shipped → delivered
  - Buyer info: nombre, email, teléfono, dirección
  - Order info: libro, nombre niño/a, dedicatoria, precio, descuento
  - PDF preview o link download (`print_file_url`)
  - Status selector: dropdown para cambiar manualmente
  - Botones: "Marcar como enviado" (open modal para tracking number), "Descargar PDF", "Ver detalles de pago"

**Tarea 7.1.4 — Discount codes CRUD (1 día)**
- [ ] Crear `/src/app/admin/descuentos/page.tsx`: tabla de códigos de descuento
  - Columnas: código, tipo (% o $), valor, max_uses/used_count, expires_at, is_activo toggle, acciones (editar, borrar)
  - Botón "Nuevo Código": abre modal form
- [ ] Form: código (uppercase), tipo radio (% / $), valor input, max_uses (opcional), expires_at date picker, is_activo toggle
- [ ] Server Actions: `createDiscountCode()`, `updateDiscountCode()`, `deleteDiscountCode()`

**Tarea 7.1.5 — Dashboard operacional (1 día)**
- [ ] Crear `/src/app/admin/dashboard/page.tsx`: dashboard completo
- [ ] Cards superiores:
  - "Ventas Hoy": $X.XXX
  - "Pedidos Pending": N
  - "Variantes Aprobadas": N/total
  - "Tasa de Conversión": X%
- [ ] Gráfico: barras vendidos por día (últimos 7 días)
- [ ] Top 3 libros: título, cantidad vendida
- [ ] Alertas: pedidos atrasados (status='paid' hace >3 días) en card rojo

### 7.2 Wireframes — Fase 7

Ver WIREFRAMES-tipiti-books.md:
- §15: Admin Variant Grid
- §16: Admin Variant Detail
- §17: Admin Order List
- §18: Admin Order Detail
- §19: Admin Dashboard
- §20: Admin Discount Codes

Aplicar Stitch Prompts 15-20.

### 7.3 Stitch Prompts — Fase 7

- **Prompt 15 de 18:** Admin Variant Grid — grid 6 columnas, bulk actions, filtros
- **Prompt 16 de 18:** Admin Variant Detail — galería 11 páginas, approve/reject buttons
- **Prompt 17 de 18:** Admin Order List — tabla filtrable, estado badges, acciones
- **Prompt 18 de 18:** Admin Dashboard — cards métricas, gráficos, alertas

### 7.4 Checklist de Aceptación — Fase 7

- [ ] Variant grid muestra 80 variantes en 6 columnas
- [ ] Bulk selection funciona (checkboxes, bulk approve/reject)
- [ ] Variant detail muestra 11 páginas navegables
- [ ] Approve/Reject actualiza DB correctamente
- [ ] Order list carga todas las órdenes
- [ ] Filtros: status, fecha, email search funcionales
- [ ] Order detail muestra timeline completo
- [ ] Status dropdown permite cambiar estado manualmente
- [ ] "Enviar" button guarda tracking number
- [ ] PDF download funciona
- [ ] Discount codes CRUD funciona
- [ ] Dashboard muestra métricas correctas
- [ ] Gráfico vendidos por día renderiza correctamente
- [ ] Alertas de pedidos atrasados se muestran

### 7.5 Notas Técnicas — Fase 7

- **Timeline:** Usar Radix UI Tabs o custom component con vertical línea
- **Bulk actions:** Mantener selección en memoria (Zustand) para operaciones rápidas
- **Status dropdown:** Server Action para cada cambio de status, trigger email si es necesario
- **Analytics:** Queries a DB con agregaciones, considerar caching si es lento
- **CSV export:** Papaparse o manual format, incluir todas las columnas

---

## FASE 8: Quality, SEO & Launch

**Duración:** 4 días (17-20 abril)
**Dependencias:** FASE 1-7 completas
**Entregable:** Production-ready app, deployed to Vercel, E2E tests, SEO configured

### 8.0 User Stories de Esta Fase

**US-054: Performance del Storefront**
- Como usuario, quiero que el storefront cargue rápidamente (LCP < 2.5s)
- Criterios: Imágenes WebP, lazy loading, código minificado, Core Web Vitals passing

**US-055: SEO Básico**
- Como usuario, quiero que el sitio sea indexable en Google
- Criterios: Meta tags, Open Graph, sitemap, structured data (Schema.org)

**US-056: Páginas de Error (404, 500) con Ilustraciones**
- Como usuario, quiero error pages bonitas si algo falla
- Criterios: 404 y 500 pages diseñadas, acuarela illustrations, CTA volver al inicio

### 8.1 Subfases y Tareas

**Tarea 8.1.1 — Performance optimization (1 día)**
- [ ] Auditar con Lighthouse: identificar bottlenecks
- [ ] Convertir todas las imágenes a WebP + fallback PNG
- [ ] Implementar lazy loading: `<Image loading="lazy" />`
- [ ] Code splitting: route-based splitting automático Next.js
- [ ] Minify CSS/JS: Vercel lo hace automáticamente
- [ ] Infinitely scroll en grid o paginar (no cargar todas las imágenes de una vez)
- [ ] Cache headers: imágenes estáticas 1 año, HTML 0 segundos
- [ ] Verificar Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

**Tarea 8.1.2 — SEO setup (1 día)**
- [ ] Crear `/src/app/layout.tsx` metadata:
  - title template: `{title} — Tipiti Books`
  - description: "Libros infantiles personalizados con ilustraciones acuarela"
  - Open Graph: og:image, og:type, og:url
  - Twitter Card: twitter:card, twitter:image
- [ ] Crear sitemap automático: `/sitemap.xml` (Next.js 13.4+)
  - Incluir: /, /catalogo, /libro/* (todos los libros publicados)
- [ ] Crear robots.txt: `/public/robots.txt`
- [ ] Agregar Google Analytics: gtag script en Head
- [ ] Schema.org structured data:
  - Product schema para cada libro
  - Organization schema para Tipiti Books
- [ ] Verificar en Google Search Console

**Tarea 8.1.3 — Error pages (1 día)**
- [ ] Crear `/src/app/not-found.tsx` (404 page):
  - Headline: "Página no encontrada"
  - Pequeña acuarela illustration (libro con signo de interrogación)
  - CTA: "Volver al inicio" → link /
  - Subtext: "La página que buscas no existe"
- [ ] Crear `/src/app/error.tsx` (500 page):
  - Headline: "Algo salió mal"
  - Acuarela illustration (libro roto)
  - CTA: "Intentar de nuevo" → refrescar, "Volver al inicio" → link /
  - Subtext: "Estamos trabajando en esto"

**Tarea 8.1.4 — E2E tests (1 día)**
- [ ] Setup Playwright: `npm install -D @playwright/test`
- [ ] Crear `/tests/e2e/purchase-flow.spec.ts`:
  - Test 1: Navigate landing → click "Crea tu libro" → redirect /catalogo
  - Test 2: Click libro → navigate /libro/buenas-noches
  - Test 3: Click "Personalizar" → navigate /wizard/paso-1
  - Test 4: Input nombre → "Siguiente" → paso-2
  - Test 5: Select gender, hair, skin → live preview updates
  - Test 6: Click "Siguiente" × 2 → paso-4 (summary)
  - Test 7: Click "Ver Preview" → /preview muestra 11 páginas
  - Test 8: Click "Comprar Ahora" → /checkout
  - Test 9: Fill form + apply discount → "Pagar con Flow.cl"
  - Test 10: Simular Flow.cl webhook → order status='paid'
- [ ] Run tests: `npm run test:e2e`
- [ ] Verificar todos pasan antes de deploy

**Tarea 8.1.5 — Production deploy (1 día)**
- [ ] Verificar env vars en Vercel production
- [ ] Deploy a Vercel: `git push origin main` → auto-build
- [ ] Verificar DNS: domain apunta a Vercel
- [ ] Run Lighthouse en producción: score target 90+ (mobile), 95+ (desktop)
- [ ] Test Flow.cl live: payment procesamiento
- [ ] Monitor con Sentry: capturar errores en producción
- [ ] Verificar emails se envían vía Resend
- [ ] Test de usuario: compra completa end-to-end
- [ ] Anunciar launch

### 8.2 Wireframes — Fase 8

Sin wireframes nuevos. Solo error pages:
- 404 page con acuarela
- 500 page con acuarela

### 8.3 Stitch Prompts — Fase 8

Sin prompts nuevos.

### 8.4 Checklist de Aceptación — Fase 8

- [ ] Lighthouse score 90+ mobile, 95+ desktop
- [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Todas las imágenes son WebP con fallback PNG
- [ ] Lazy loading implementado en grids/carousels
- [ ] Sitemap.xml genera correctamente
- [ ] robots.txt allows googlebot
- [ ] Meta tags renderizados en head (verificar "Ver fuente")
- [ ] Open Graph tags correctos (og:image 1200×630px)
- [ ] Schema.org structured data válido (JSON-LD)
- [ ] Google Search Console indexa sitio
- [ ] 404 y 500 pages bonitas con ilustraciones
- [ ] E2E tests pasan (10/10 tests)
- [ ] Vercel deploy successful
- [ ] DNS apunta a Vercel
- [ ] Flow.cl live payments funcionan
- [ ] Emails Resend llegan correctamente
- [ ] Sentry captura errores
- [ ] No console errors en producción

### 8.5 Notas Técnicas — Fase 8

- **Images:** Usar `next/image` con sizes prop para responsive
- **SEO:** Cada página debe tener unique title + description
- **Structured Data:** Validar con Google Rich Results Test
- **Monitoring:** Configurar Sentry para alertas de errores críticos
- **CI/CD:** Vercel auto-deploys on push, verificar que tests corren primero
- **Backups:** Configurar backups automáticos de Supabase

---

## Apéndice C: Dependencias Entre Fases

```
FASE 1: Foundation
    ├── tech setup, Supabase, auth
    │
    └─→ FASE 2: Design System & Layouts
        ├── tipografía, colores, componentes
        │
        └─→ FASE 3: Landing + Waitlist
        │   ├── public landing, storytelling
        │   ├── pueden ejecutarse en paralelo con FASE 2
        │
        ├─→ FASE 4: Catálogo + Wizard
        │   ├── depende de FASE 3 (navigation)
        │   ├── depende de components FASE 2
        │
        └─→ FASE 5: Preview + Checkout + Pagos
            ├── depende de FASE 4 (configurator state)
            ├── depende de FASE 3 (landing)
            │
            └─→ FASE 6: Admin — Gestión de Libros
            │   ├── depende de FASE 1 (auth)
            │   ├── pre-generación independiente
            │
            └─→ FASE 7: Admin — Curación + Pedidos
                ├── depende de FASE 6 (variantes generadas)
                ├── depende de FASE 5 (órdenes creadas)
                │
                └─→ FASE 8: Quality + SEO + Launch
                    ├── depende de todas (testing)
```

---

## Apéndice D: Notas Finales

**Filosofía del Proyecto:**

1. **Determinismo:** El mismo personaje = mismas ilustraciones. No hay aleatoriedad. Pre-generación es la clave.
2. **Arquitectura de 3 Capas:** Cuento (fijo), Personaje (pre-generado), Texto (dinámico). Cada una escala independientemente.
3. **Calidad sobre Volumen:** Mejor 1 libro excelente con 80 variantes curadas que 100 libros con imágenes genéricas.
4. **Mobile-First:** Comprador principal es móvil (padres en el sofá, abuelos). Responsive es crítico.
5. **Diseño Artesanal:** Acuarela, Fraunces, DM Sans, colores cálidos. NUNCA genérico.

**Riesgos y Mitigaciones:**

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|-----------|
| Delays pre-generación FLUX | Media | Alto | Batch early (FASE 6 semana 1), parallelizar con Inngest |
| Flow.cl integración complejidad | Baja | Medio | Usar sandbox temprano, documentación clara |
| Variantes no aprobadas a tiempo | Media | Medio | Priorizar Buenas Noches en FASE 6, tener bot-generated fallback |
| Performance LCP > 2.5s | Baja | Medio | Image optimization FASE 8, lazy loading FASE 4 |
| RLS policies incorrectas | Baja | Alto | Test en FASE 1, revisión Supabase docs |

**Post-Launch (Roadmap V1.1+):**

- Agregar segundo personaje (hermano/a, amigo/a) → 6,400 variantes (híbrida: P1 pre-gen, P2 on-demand)
- Accesorios premium: freckles, headbands, peluches (pre-gen selectiva)
- Segundo idioma: alemán, inglés (capa de texto solo, reutiliza Capa 2 illustrations)
- Foto del regalador integrada (última página)
- Bundle: libro + peluche físico (matching character)
- Referrals program, gift cards
- Checkout upsells (wrapping premium, tarjeta dedicatoria)

---

**DOCUMENTO COMPLETADO**

Este Blueprint integra PDR v3.0, Tech Spec v2.0, User Stories v1.0, Wireframes, y Stitch Prompts en un plan ejecutable de 38 días. Cada fase es autónoma pero secuencial. Cada tarea ≤ 1 día. Cada historia tiene criterios de aceptación claros. El código es copy-paste-ready (SQL schemas, folder structure, env vars).

Equipo: Sofi (product/design/admin), dev team (2-3 devs), designer (Stitch). Timeline: 6 marzo — 13 abril 2026.

**Comienza FASE 1. ¡Vamos!**



---

## Apéndice A: Mapeo US → Fase

| US | Historia | Fase | Prioridad |
|----|----------|------|-----------|
| US-001 | Landing hero | 3 | P0 |
| US-002 | Story Sofi | 3 | P0 |
| US-003 | Cómo funciona | 3 | P0 |
| US-004 | Waitlist | 3 | P0 |
| US-005 | Catálogo | 4 | P0 |
| US-006 | Detalle libro | 4 | P0 |
| US-007 | Compartir libro | 4 | P0 |
| US-008 | Nombre (Paso 1) | 4 | P0 |
| US-009 | Género (Paso 2) | 4 | P0 |
| US-010 | Apariencia (Paso 2) | 4 | P0 |
| US-011 | Dedicatoria (Paso 3) | 4 | P0 |
| US-012 | Resumen (Paso 4) | 4 | P0 |
| US-013 | Navegar wizard | 4 | P0 |
| US-014 | Preview page-flip | 5 | P0 |
| US-015 | CTA compra | 5 | P0 |
| US-016 | Compartir preview | 5 | P0 |
| US-017 | Formulario envío | 5 | P0 |
| US-018 | Descuento | 5 | P0 |
| US-019 | Flow.cl | 5 | P0 |
| US-020 | MercadoPago | 5 | P0 |
| US-021 | Success page | 5 | P0 |
| US-022 | Failure page | 5 | P0 |
| US-023 | Email confirmación | 5 | P0 |
| US-024 | Email envío | 5 | P0 |
| US-025 | Email Sofi | 5 | P0 |
| US-026 | Newsletter subscribe | 3 | P0 |
| US-027 | Admin suscriptores | 3 | P0 |
| US-028 | Export CSV | 3 | P0 |
| US-029 | Admin login | 1 | P0 |
| US-030 | Protección rutas | 1 | P0 |
| US-031 | Logout | 1 | P0 |
| US-032 | Lista libros | 6 | P0 |
| US-033 | Crear/editar libro | 6 | P0 |
| US-034 | Editor escenas | 6 | P0 |
| US-035 | Reordenar escenas | 6 | P0 |
| US-036 | Setting sheet | 6 | P0 |
| US-037 | Motor IA | 6 | P0 |
| US-038 | Lanzar pre-generación | 6 | P0 |
| US-039 | Monitorear progreso | 6 | P0 |
| US-040 | Regenerar variante | 6 | P0 |
| US-041 | Generar 1 variante | 6 | P0 |
| US-042 | Grid variantes | 7 | P0 |
| US-043 | Detalle variante | 7 | P0 |
| US-044 | Aprobar/rechazar bulk | 7 | P0 |
| US-045 | Comparar páginas | 7 | P0 |
| US-046 | Lista pedidos | 7 | P0 |
| US-047 | Detalle pedido | 7 | P0 |
| US-048 | PDF composición | 7 | P0 |
| US-049 | Dashboard métricas | 7 | P0 |
| US-050 | Alertas atrasos | 7 | P0 |
| US-051 | CRUD descuentos | 7 | P0 |
| US-052 | Validar descuento | 7 | P0 |
| US-053 | Aplicar descuento | 7 | P0 |
| US-054 | Performance | 8 | P0 |
| US-055 | SEO | 8 | P0 |
| US-056 | Error pages | 8 | P0 |

---

## Apéndice B: Timeline Detallado

| Semana | Fase | Fechas | Duración | Entregable |
|--------|------|--------|----------|-----------|
| 1 | FASE 1 | 6-10 mar | 5 d | App running, admin auth |
| 2 | FASE 2 | 11-13 mar | 3 d | Layouts, design system |
| 2-3 | FASE 3 | 14-18 mar | 5 d | Landing, waitlist |
| 3-4 | FASE 4 | 19-26 mar | 8 d | Wizard, catálogo |
| 4-5 | FASE 5 | 27 mar-3 abr | 8 d | Pagos, checkout, emails |
| 5-6 | FASE 6 | 4-10 abr | 7 d | Book CRUD, pre-gen |
| 6 | FASE 7 | 11-16 abr | 6 d | Curación, pedidos |
| 6-7 | FASE 8 | 17-20 abr | 4 d | QA, SEO, deploy |
| **TOTAL** | **8 FASES** | **6 mar - 13 abr** | **38 d** | **LIVE** |

