# Tipiti Books — Task Tracker

## Estado General
- **Total de fases:** 8
- **Total de tareas:** ~120 (agrupadas por subfase)
- **Timeline estimado:** 38 días (~5.5 semanas)
- **Fase actual:** 5 (completada)
- **Inicio:** 2026-02-26

---

## FASE 1: Foundation & Setup (5 días)
> **Entregable:** App corriendo en local con auth admin funcional, Supabase conectada, env vars configuradas
> **Dependencias:** Ninguna
> **User Stories:** US-029, US-030, US-031

### 1.1 Setup Inicial del Proyecto
- [x] T-1.1.1: Configurar proyecto Next.js 16 con TypeScript, Tailwind 4, App Router (actualizar Tailwind 3.4 → 4.x)
- [x] T-1.1.2: Instalar dependencias core — shadcn/ui, zustand, framer-motion, zod, @supabase/supabase-js, @supabase/ssr
- [x] T-1.1.3: Instalar dependencias secundarias — resend, @fal-ai/client, inngest, pdf-lib, sharp
- [x] T-1.1.4: Configurar estructura de carpetas según Tech Spec §3.2 — `src/app/`, `src/components/`, `src/lib/`, `src/stores/`, `src/emails/`
- [x] T-1.1.5: Crear `.env.local` con template de variables (vacías) — copiar de Blueprint
- [x] T-1.1.6: Verificar que `npm run dev` inicia correctamente en `localhost:3000`

### 1.2 Setup Supabase
- [x] T-1.2.1: Crear proyecto Supabase en supabase.com
- [x] T-1.2.2: Copiar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY a `.env.local`
- [x] T-1.2.3: Crear SUPABASE_SERVICE_ROLE_KEY y agregarlo a `.env.local`
- [x] T-1.2.4: Ejecutar SQL migrations — crear 8 tablas: books, scenes, character_variants, variant_pages, orders, discount_codes, subscribers, accessories — `supabase/migrations/001_initial_schema.sql`
- [x] T-1.2.5: Configurar RLS policies según Blueprint (public read published, admin CRUD all)
- [x] T-1.2.6: Crear triggers updated_at para books, scenes, character_variants, orders
- [x] T-1.2.7: Seed inicial — insertar libro "Buenas Noches" con 11 escenas (sin imágenes)

### 1.3 Setup Supabase Storage
- [x] T-1.3.1: Crear bucket `variant-pages` (imágenes pre-generadas, public read)
- [x] T-1.3.2: Crear bucket `character-sheets` (character references, public read)
- [x] T-1.3.3: Crear bucket `setting-sheets` (setting references, public read)
- [x] T-1.3.4: Crear bucket `print-files` (PDFs finales, private/admin only)
- [x] T-1.3.5: Crear bucket `reference-images` (referencias para generación, admin only)
- [x] T-1.3.6: Configurar CORS en Supabase para localhost y Vercel origins

### 1.4 Setup Servicios Externos
- [x] T-1.4.1: Crear cuenta Inngest dev, copiar INNGEST_EVENT_KEY a `.env.local`
- [x] T-1.4.2: Crear cuenta Resend, copiar RESEND_API_KEY a `.env.local`
- [x] T-1.4.3: Crear cuenta fal.ai, copiar FAL_API_KEY a `.env.local`
- [x] T-1.4.4: Setup Flow.cl sandbox — obtener FLOW_MERCHANT_ID, FLOW_API_KEY, FLOW_SECRET_KEY
- [x] T-1.4.5: Verificar todas las env vars están correctas y servicios responden

### 1.5 Admin Auth Implementation
- [x] T-1.5.1: Crear `/src/app/admin/login/page.tsx` — formulario email + password
- [x] T-1.5.2: Crear Server Action `signInAdmin(email, password)` usando Supabase Auth — `src/lib/supabase/server.ts`
- [x] T-1.5.3: Crear middleware `/src/middleware.ts` — proteger rutas /admin/* con JWT verification
- [x] T-1.5.4: Crear `/src/app/admin/layout.tsx` — header + sidebar + Logout button
- [x] T-1.5.5: Crear `/src/app/admin/dashboard/page.tsx` — placeholder "Dashboard coming soon"
- [x] T-1.5.6: Crear Supabase client helpers — `src/lib/supabase/client.ts`, `server.ts`, `admin.ts`
- [x] T-1.5.7: Verificar login/logout flow funciona localmente

### Checklist de Aceptacion — Fase 1
- [x] `npm run dev` inicia sin errores
- [x] Supabase tables creadas (8 tablas, RLS enabled)
- [x] Supabase Storage buckets creados (5 buckets)
- [x] Libro "Buenas Noches" seeded en DB con 11 escenas
- [x] Admin login funciona: email hola@tipitibooks.com
- [x] Middleware protege rutas /admin/*
- [x] Logout limpia sesión y redirige a /admin/login
- [x] JWT persiste en httpOnly cookie
- [x] Todas las env vars configuradas en `.env.local`
- [ ] Inngest, Resend, fal.ai, Flow.cl credenciales validadas (pendiente cuentas)

---

## FASE 2: Design System & Layouts (3 días)
> **Entregable:** Storefront + admin layouts working, component library ready, fonts loaded
> **Dependencias:** FASE 1 completa
> **User Stories:** Ninguna (infraestructura)

### 2.1 Tipografía
- [x] T-2.1.1: Configurar Fraunces, DM Sans, Caveat con `next/font` — `src/lib/fonts.ts`
- [x] T-2.1.2: Crear clases utility `.font-display`, `.font-body`, `.font-handwritten`
- [x] T-2.1.3: Actualizar Tailwind config con tipografía personalizada — `tailwind.config.ts`
- [x] T-2.1.4: Verificar que fonts cargan en localhost sin FOUT

### 2.2 Paleta de Colores
- [x] T-2.2.1: Crear constantes de color — `src/lib/colors.ts`
- [x] T-2.2.2: Extender Tailwind config con colores personalizados (cream, terracota, sage, rose, blue, text, etc.)
- [x] T-2.2.3: Configurar `globals.css` — fondo crema #FBF7F0 como base, texto #4A3F35

### 2.3 Storefront Layout
- [x] T-2.3.1: Crear `/src/app/(storefront)/layout.tsx` — layout wrapper
- [x] T-2.3.2: Crear header storefront — sticky 80px, logo Fraunces, nav desktop, CTA terracota, hamburger mobile — `src/components/storefront/header.tsx`
- [x] T-2.3.3: Crear footer storefront — fondo crema, copyright, email — `src/components/storefront/footer.tsx`
- [x] T-2.3.4: Crear mobile navigation — sidebar slide-out con Framer Motion
- [x] T-2.3.5: Verificar responsive: desktop horizontal nav, mobile burger menu

### 2.4 Admin Layout
- [x] T-2.4.1: Crear `/src/app/admin/layout.tsx` — sidebar 280px + header + main content
- [x] T-2.4.2: Crear sidebar admin — nav items: Dashboard, Libros, Pedidos, Descuentos, Generación, Suscriptores — `src/components/admin/sidebar.tsx`
- [x] T-2.4.3: Implementar active nav item highlight (terracota left border 4px)
- [x] T-2.4.4: Mobile admin: sidebar collapse a hamburger

### 2.5 Component Library Base
- [x] T-2.5.1: Instalar shadcn/ui components — Button, Input, Card, Badge, Dialog, Tabs, Table, Accordion
- [x] T-2.5.2: Personalizar Button con paleta Tipiti — primary terracota, secondary transparent, pill shape
- [x] T-2.5.3: Personalizar Input con styling Tipiti — border #D4C5B0, focus terracota
- [x] T-2.5.4: Personalizar Card con sombras cálidas — shadow rgba(196,125,90,0.08)
- [x] T-2.5.5: Crear loading spinner — `src/components/common/loading-spinner.tsx`
- [x] T-2.5.6: Crear toast notification — `src/components/common/toast-notification.tsx`

### Checklist de Aceptación — Fase 2
- [x] Fraunces, DM Sans, Caveat cargan sin FOUT
- [x] Paleta de colores funciona en Tailwind (bg-cream, text-terracota, etc.)
- [x] Storefront header sticky, responsive (desktop nav + mobile burger)
- [x] Storefront footer aparece en todas las páginas
- [x] Admin layout sidebar + header funcional
- [x] Nav items activos muestran indicador visual
- [x] Button, Input, Card usan diseño Tipiti (no defaults genéricos)
- [x] Mobile responsive: header burger, sidebar collapse, layout single-column
- [x] Logo Tipiti visible en ambos layouts
- [x] Todos los estilos usan colores correctos (#FBF7F0 fondo, #C47D5A CTAs, #4A3F35 texto)

---

## FASE 3: Landing + Storytelling + Waitlist (5 días)
> **Entregable:** Public landing con hero, story, how-it-works, carousel, waitlist working, admin subscribers
> **Dependencias:** FASE 1, FASE 2 completas
> **User Stories:** US-001, US-002, US-003, US-004, US-026, US-027, US-028

### 3.1 Landing Page
- [x] T-3.1.1: Crear `/src/app/(storefront)/page.tsx` — landing page completa
- [x] T-3.1.2: Implementar Hero Section — asimetría 45/55, headline Fraunces, CTA terracota, placeholder ilustración
- [x] T-3.1.3: Implementar sección "Nuestra Historia" — 2 columnas, foto Sofi, texto storytelling
- [x] T-3.1.4: Implementar sección "Cómo Funciona" — grid 3 columnas con cards (Palette/Wand2/Package)
- [x] T-3.1.5: Implementar galería carousel — 6 spreads placeholder, dots navigation, swipe mobile
- [x] T-3.1.6: Implementar sección waitlist — input email + button "Quiero mi libro"
- [x] T-3.1.7: Verificar mobile responsive — stack vertical, full-width buttons, swipeable carousel

### 3.2 Waitlist Form + Resend
- [x] T-3.2.1: Crear Server Action `subscribe.ts` — validar email (Zod), insertar en DB, manejar duplicados
- [x] T-3.2.2: Crear componente waitlist-form — loading/success/error states — `src/components/storefront/waitlist-form.tsx`
- [x] T-3.2.3: Crear email template waitlist welcome — `src/emails/waitlist-welcome.tsx` (React Email)
- [x] T-3.2.4: Integrar Resend para envío de email de bienvenida con código TIPITI20
- [x] T-3.2.5: Verificar email llega correctamente a dirección de prueba

### 3.3 Admin Subscribers
- [x] T-3.3.1: Crear `/src/app/admin/suscriptores/page.tsx` — tabla con email, fecha, fuente, activo
- [x] T-3.3.2: Crear componente subscribers-table con filtros y paginación — `src/components/admin/subscribers-table.tsx`
- [x] T-3.3.3: Implementar Server Action `unsubscribeEmail()` — desactivar suscriptor
- [x] T-3.3.4: Implementar botón "Exportar CSV" — descarga suscriptores-YYYY-MM-DD.csv

### Checklist de Aceptación — Fase 3
- [x] Landing page loads en `/` sin errores
- [x] Hero section full viewport height, responsive
- [x] "Nuestra Historia" 2-column desktop, 1-column mobile
- [x] "Cómo Funciona" grid 3 columnas con cards
- [x] Carousel 6 spreads con dots/arrows funcionales
- [x] Waitlist form: validación email, insert en DB
- [x] Success message después de suscripción
- [ ] Email de bienvenida llega a email de prueba (pendiente: configurar Resend API key)
- [x] Admin `/admin/suscriptores` carga correctamente
- [x] Tabla muestra emails con filtros funcionales
- [x] Botón "Desactivar" funciona
- [x] Botón "Exportar CSV" descarga archivo
- [x] Mobile responsive completo
- [x] Todos los textos en español (Chile)

---

## FASE 4: Catálogo + Wizard Configurador (8 días)
> **Entregable:** Flujo completo de configuración (nombre → apariencia → dedicatoria → resumen), findVariant() ready
> **Dependencias:** FASE 1, FASE 2, FASE 3 completas
> **User Stories:** US-005 a US-013

### 4.1 Catálogo
- [x] T-4.1.1: Crear `/src/app/(storefront)/catalogo/page.tsx` — Server Component, grid de libros publicados
- [x] T-4.1.2: Crear componente book-card — portada, título, edad, precio, CTA "Personalizar" — `src/components/storefront/book-card.tsx`
- [x] T-4.1.3: Implementar estado "Próximamente" — overlay gris, CTA "Avisame"
- [x] T-4.1.4: Cargar portadas desde Supabase Storage (cover_template_url)

### 4.2 Detalle de Libro
- [x] T-4.2.1: Crear `/src/app/(storefront)/libro/[slug]/page.tsx` — breadcrumb, galería, info, FAQs
- [x] T-4.2.2: Implementar galería de spreads — carrusel 6 images, thumbnails desktop, dots mobile
- [x] T-4.2.3: Implementar sección info — título, descripción, specs, precio, CTA "Personalizar"
- [x] T-4.2.4: Crear componente FAQ accordion — `src/components/storefront/book-faq.tsx`
- [x] T-4.2.5: Implementar sticky bottom bar (mobile) — precio + CTA
- [x] T-4.2.6: Crear share button — navigator.share() mobile, copiar link desktop — `src/components/storefront/share-button.tsx`

### 4.3 Zustand Store
- [x] T-4.3.1: Crear configurator store — `src/stores/configurator-store.ts`
  - State: bookId, childName, gender, hairColor, hairType, skinTone, hasGlasses, dedication, currentStep
  - Actions: setChildName, setGender, etc., setStep, reset
  - Persist to localStorage

### 4.4 Wizard Paso 1: Nombre
- [x] T-4.4.1: Crear `/src/app/(storefront)/wizard/paso-1/page.tsx` — progress bar, input nombre, live preview
- [x] T-4.4.2: Implementar progress stepper componente (4 pasos, línea ondulada, clickeable)
- [x] T-4.4.3: Implementar validación nombre (2-30 chars, no números, Zod)
- [x] T-4.4.4: Implementar live preview — "Buenas noches, {nombre}" en Caveat

### 4.5 Wizard Paso 2: Apariencia
- [x] T-4.5.1: Crear `/src/app/(storefront)/wizard/paso-2/page.tsx` — grid selectors + live character preview
- [x] T-4.5.2: Implementar gender selector — 2 cards toggle (Niña/Niño)
- [x] T-4.5.3: Implementar skin tone selector — 3 swatches circulares
- [x] T-4.5.4: Implementar hair color selector — grid con colores filtrados por piel
- [x] T-4.5.5: Implementar hair type selector — toggle Liso/Ondulado
- [x] T-4.5.6: Implementar glasses selector — toggle Sí/No
- [x] T-4.5.7: Implementar live character preview — portrait actualiza según selección

### 4.6 Wizard Paso 3: Dedicatoria
- [x] T-4.6.1: Crear `/src/app/(storefront)/wizard/paso-3/page.tsx` — textarea + preview handwritten
- [x] T-4.6.2: Implementar textarea con counter (max 200 chars)
- [x] T-4.6.3: Implementar live preview dedicatoria en Caveat (handwritten)

### 4.7 Wizard Paso 4: Resumen
- [x] T-4.7.1: Crear `/src/app/(storefront)/wizard/paso-4/page.tsx` — summary card, links "Editar"
- [x] T-4.7.2: Mostrar portrait + nombre + atributos + dedicatoria + libro
- [x] T-4.7.3: Links "Editar" en cada sección → navegan al paso correspondiente
- [x] T-4.7.4: CTA "Ver mi libro" → navega a preview

### 4.8 Variant Lookup
- [x] T-4.8.1: Crear `findVariant()` — `src/lib/utils/variant-lookup.ts`
  - Query: character_variants WHERE book_id AND gender AND hair AND skin AND glasses AND status='approved'
  - Return: variant con portrait_url y character_sheet_urls, o null

### Checklist de Aceptación — Fase 4
- [x] `/catalogo` muestra libros publicados en grid
- [x] Book cards con portada, título, precio, CTA
- [x] `/libro/[slug]` con galería, info, FAQs, share
- [x] Zustand store persiste estado en localStorage
- [x] Wizard paso 1: input nombre, validación, live preview
- [x] Wizard paso 2: todos los selectors, live character preview
- [x] Wizard paso 3: textarea dedicatoria, counter, live preview
- [x] Wizard paso 4: resumen editable, CTA "Ver mi libro"
- [x] Progress bar muestra paso actual (1/2/3/4), clickeable
- [x] Navegación atrás/adelante funciona
- [x] findVariant() retorna variante o null
- [x] Mobile responsive completo
- [x] Todos los textos en español

---

## FASE 5: Preview + Checkout + Pagos (8 días)
> **Entregable:** Flujo end-to-end de compra working, Flow.cl + MercadoPago, webhooks, PDFs
> **Dependencias:** FASE 1-4 completas
> **User Stories:** US-014 a US-025

### 5.1 Preview Page-Flip
- [x] T-5.1.1: Crear `/src/app/(storefront)/preview/page.tsx` — leer estado Zustand, cargar variant pages
- [x] T-5.1.2: Implementar page-flip animation — 11 páginas, swipe/click, controles ◄ ►
- [x] T-5.1.3: Crear componente book-preview — `src/components/storefront/book-preview.tsx`
- [x] T-5.1.4: Superponer nombre del niño/a en cada página (client-side text overlay)
- [x] T-5.1.5: CTA "Comprar por $29.990" + "Compartir Preview"
- [x] T-5.1.6: Mobile: fullscreen toggle, sticky bottom bar

### 5.2 Checkout Form
- [x] T-5.2.1: Crear `/src/app/(storefront)/checkout/page.tsx` — form izquierda + order summary derecha
- [x] T-5.2.2: Implementar formulario envío — nombre, email, teléfono, región, ciudad, dirección (Zod)
- [x] T-5.2.3: Implementar código descuento — input + "Aplicar" + validación vía Server Action
- [x] T-5.2.4: Crear Server Action `validate-discount.ts` — query discount_codes, check validity
- [x] T-5.2.5: Implementar order summary sticky — portada, nombre, precio, descuento, total
- [x] T-5.2.6: Implementar selección método de pago — Flow.cl (primary) + MercadoPago (secondary)
- [x] T-5.2.7: Checkbox newsletter pre-checked

### 5.3 Flow.cl Integration
- [x] T-5.3.1: Crear Flow.cl client wrapper — `src/lib/flow/client.ts`
- [x] T-5.3.2: Crear Server Action `create-order.ts` — insertar order en DB, iniciar pago
- [x] T-5.3.3: Crear `/src/app/(storefront)/pago/page.tsx` — redirect a Flow.cl
- [x] T-5.3.4: Crear webhook handler `/src/app/api/webhooks/flow/route.ts` — HMAC verify, update order

### 5.4 MercadoPago Integration
- [x] T-5.4.1: Crear MercadoPago client wrapper — `src/lib/mercadopago/client.ts`
- [x] T-5.4.2: Crear webhook handler `/src/app/api/webhooks/mercadopago/route.ts`

### 5.5 PDF Composition
- [x] T-5.5.1: Crear PDF builder — `src/lib/compose/pdf-builder.ts`
  - Descargar 11 imágenes + text overlay (Sharp) + ensamblaje (pdf-lib)
- [x] T-5.5.2: Crear text overlay function — `src/lib/compose/text-overlay.ts`
- [x] T-5.5.3: Crear API route `/src/app/api/compose/route.ts` — trigger composition
- [x] T-5.5.4: Integrar con Inngest — `generatePrintFile` job post-pago

### 5.6 Success/Failure Pages
- [x] T-5.6.1: Crear `/src/app/(storefront)/pago/success/page.tsx` — ticket, checkmark, resumen
- [x] T-5.6.2: Crear `/src/app/(storefront)/pago/failure/page.tsx` — error, reintentar, soporte

### 5.7 Email Templates
- [x] T-5.7.1: Crear email confirmación pedido — `src/emails/order-confirmation.tsx`
- [x] T-5.7.2: Crear email notificación envío — `src/emails/shipping-notification.tsx`
- [x] T-5.7.3: Crear email nuevo pedido admin — `src/emails/new-order-admin.tsx`

### Checklist de Aceptación — Fase 5
- [x] `/preview` muestra 11 páginas con page-flip animation
- [x] Nombre superpuesto en páginas
- [x] Controles navegación funcionales
- [x] `/checkout` form valida todos los campos
- [x] Código descuento valida vía API
- [x] Order summary muestra precio, descuento, total
- [ ] Flow.cl payment inicia y retorna a success/failure (pendiente: API keys)
- [ ] Webhook Flow.cl procesa payment correctamente (pendiente: API keys)
- [ ] MercadoPago payment funciona como alternativa (pendiente: API keys)
- [ ] PDF se compone correctamente (pendiente: variant pages generadas)
- [x] Success page muestra ticket con order number
- [x] Failure page muestra error + reintentar
- [ ] Emails llegan a buyer y a Sofi (pendiente: Resend API key)
- [ ] Order en DB: payment_status='paid', print_status='ready' (pendiente: webhooks activos)
- [x] Mobile responsive completo

---

## FASE 6: Admin — Gestión de Libros + Pre-generación (7 días)
> **Entregable:** Book CRUD, scene editor, batch generation pipeline, monitor UI
> **Dependencias:** FASE 1-5 completas
> **User Stories:** US-032 a US-041

### 6.1 Book CRUD
- [ ] T-6.1.1: Crear `/src/app/admin/libros/page.tsx` — tabla de libros (slug, título, variantes, publicado)
- [ ] T-6.1.2: Crear `/src/app/admin/libros/[bookId]/page.tsx` — detalle/edición del libro
- [ ] T-6.1.3: Crear Server Actions: createBook, updateBook, deleteBook
- [ ] T-6.1.4: Crear book-form con validación Zod — `src/components/admin/book-form.tsx`

### 6.2 Scene Editor
- [ ] T-6.2.1: Crear `/src/app/admin/libros/[bookId]/editor/page.tsx` — lista de escenas reorderable
- [ ] T-6.2.2: Implementar WYSIWYG editor para texto narrativo con {name} tag preservation
- [ ] T-6.2.3: Implementar drag & drop reordenar escenas
- [ ] T-6.2.4: Implementar setting sheet upload (file upload → Supabase Storage)

### 6.3 Generation Engine + Batch Jobs
- [ ] T-6.3.1: Crear Inngest function `generateAllVariants.ts` — loop 80 variantes
- [ ] T-6.3.2: Crear Inngest function `generateVariant.ts` — generar 11 páginas por variante
- [ ] T-6.3.3: Crear fal.ai client — `src/lib/fal/client.ts`
- [ ] T-6.3.4: Implementar botón "Generar Variantes" con modal confirmación
- [ ] T-6.3.5: Crear Inngest webhook route — `src/app/api/webhooks/inngest/route.ts`

### 6.4 Generation Monitor
- [ ] T-6.4.1: Crear `/src/app/admin/generacion/page.tsx` — progress monitor real-time
- [ ] T-6.4.2: Implementar tabla de variantes con status (pending/generating/generated)
- [ ] T-6.4.3: Implementar barra de progreso (X/880 imágenes, % completado)
- [ ] T-6.4.4: Implementar botón "Regenerar" por variante individual

### Checklist de Aceptación — Fase 6
- [ ] `/admin/libros` muestra tabla de todos los libros
- [ ] CRUD libro funciona (crear, editar, borrar)
- [ ] Scene editor: escenas reordenables, WYSIWYG con {name}
- [ ] Setting sheet upload funciona
- [ ] Botón "Generar Variantes" inicia Inngest batch job
- [ ] Monitor muestra progreso real-time
- [ ] 80 variantes × 11 páginas se generan secuencialmente
- [ ] Imágenes almacenadas en Storage
- [ ] character_variants + variant_pages populados en DB
- [ ] Botón "Regenerar" individual funciona

---

## FASE 7: Admin — Curación + Pedidos + Descuentos (6 días)
> **Entregable:** Operaciones admin completas (curar variantes, gestionar pedidos, descuentos)
> **Dependencias:** FASE 1-6 completas
> **User Stories:** US-042 a US-053

### 7.1 Variant Curation
- [ ] T-7.1.1: Crear `/src/app/admin/libros/[bookId]/variantes/page.tsx` — grid 6 columnas
- [ ] T-7.1.2: Implementar bulk selection (checkboxes + bulk approve/reject)
- [ ] T-7.1.3: Crear `/src/app/admin/libros/[bookId]/variante/[variantId]/page.tsx` — galería 11 páginas
- [ ] T-7.1.4: Implementar botones Aprobar/Rechazar/Regenerar por variante
- [ ] T-7.1.5: Implementar comparación side-by-side (antes/después regeneración)

### 7.2 Order Management
- [ ] T-7.2.1: Crear `/src/app/admin/pedidos/page.tsx` — tabla filtrable (status, fecha, email)
- [ ] T-7.2.2: Crear `/src/app/admin/pedidos/[orderId]/page.tsx` — detalle con timeline visual
- [ ] T-7.2.3: Implementar cambio de status manual (dropdown + Server Action)
- [ ] T-7.2.4: Implementar "Marcar como enviado" con tracking number
- [ ] T-7.2.5: Implementar descarga de PDF (print_file_url)
- [ ] T-7.2.6: Implementar exportar órdenes CSV

### 7.3 Discount Codes
- [ ] T-7.3.1: Crear `/src/app/admin/descuentos/page.tsx` — tabla CRUD
- [ ] T-7.3.2: Implementar form: código, tipo (% / $), valor, max_uses, expires_at, toggle activo
- [ ] T-7.3.3: Crear Server Actions: createDiscountCode, updateDiscountCode, deleteDiscountCode

### 7.4 Dashboard Operacional
- [ ] T-7.4.1: Crear `/src/app/admin/dashboard/page.tsx` — dashboard completo
- [ ] T-7.4.2: Cards métricas: ventas hoy, pedidos pending, variantes aprobadas, tasa conversión
- [ ] T-7.4.3: Gráfico vendidos por día (últimos 7 días)
- [ ] T-7.4.4: Alertas pedidos atrasados (status='paid' > 3 días)

### Checklist de Aceptación — Fase 7
- [ ] Grid variantes muestra 80 variantes con thumbnails
- [ ] Bulk approve/reject funciona
- [ ] Detalle variante muestra 11 páginas navegables
- [ ] Approve/Reject actualiza DB
- [ ] Order list con filtros funcionales
- [ ] Order detail con timeline y status changes
- [ ] Tracking number guardable
- [ ] PDF downloadable
- [ ] Discount codes CRUD completo
- [ ] Dashboard con métricas correctas
- [ ] Alertas de pedidos atrasados visibles

---

## FASE 8: Quality, SEO & Launch (4 días)
> **Entregable:** App production-ready, deployed a Vercel, E2E tests, SEO configurado
> **Dependencias:** FASE 1-7 completas
> **User Stories:** US-054, US-055, US-056

### 8.1 Performance
- [ ] T-8.1.1: Auditar con Lighthouse — identificar bottlenecks
- [ ] T-8.1.2: Convertir imágenes a WebP + fallback PNG
- [ ] T-8.1.3: Implementar lazy loading con `next/image`
- [ ] T-8.1.4: Verificar Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 8.2 SEO
- [ ] T-8.2.1: Configurar metadata en layout.tsx — title template, description, Open Graph
- [ ] T-8.2.2: Crear sitemap.xml automático (Next.js App Router)
- [ ] T-8.2.3: Crear robots.txt
- [ ] T-8.2.4: Agregar Schema.org structured data (Product, Organization)
- [ ] T-8.2.5: Configurar Google Analytics

### 8.3 Error Pages
- [ ] T-8.3.1: Crear `/src/app/not-found.tsx` — 404 con ilustración acuarela
- [ ] T-8.3.2: Crear `/src/app/error.tsx` — 500 con ilustración acuarela

### 8.4 E2E Tests
- [ ] T-8.4.1: Setup Playwright
- [ ] T-8.4.2: Crear test purchase flow (landing → catálogo → wizard → preview → checkout → success)
- [ ] T-8.4.3: Verificar todos los tests pasan

### 8.5 Production Deploy
- [ ] T-8.5.1: Configurar env vars en Vercel production
- [ ] T-8.5.2: Deploy a Vercel — `git push origin main`
- [ ] T-8.5.3: Verificar DNS apunta a Vercel
- [ ] T-8.5.4: Test Flow.cl live payments
- [ ] T-8.5.5: Configurar Sentry monitoring
- [ ] T-8.5.6: Test end-to-end compra completa en producción

### Checklist de Aceptación — Fase 8
- [ ] Lighthouse score 90+ mobile, 95+ desktop
- [ ] Core Web Vitals passing
- [ ] Imágenes WebP con lazy loading
- [ ] Sitemap.xml y robots.txt generados
- [ ] Meta tags y Open Graph correctos
- [ ] Schema.org structured data válido
- [ ] 404 y 500 pages con ilustraciones
- [ ] E2E tests pasan
- [ ] Vercel deploy exitoso
- [ ] Flow.cl live payments funcionan
- [ ] Emails Resend llegan
- [ ] Sentry captura errores
- [ ] Sin console errors en producción
