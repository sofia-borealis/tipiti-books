# Tipiti Books — Low-Res Wireframes

> **Versión**: 1.0
> **Estado**: BORRADOR
> **Fecha**: 2026-02-25
> **PDR**: PDR-tipiti-books.md v3.0
> **Tech Spec**: TECH-SPEC-tipiti-books.md v2.0
> **User Stories**: USER-STORIES-tipiti-books.md v1.0
> **Total Pantallas**: 28 (Mobile: 28 | Desktop: 28) = 56 wireframes

---

## Sitemap

```
📱 SITEMAP — Tipiti Books

Storefront (sin auth, mobile-first):
├── / → Landing Page (hero + historia + cómo funciona + waitlist)
├── /catalogo → Catálogo de Libros
├── /libro/[slug] → Detalle del Libro
├── /libro/[slug]/personalizar → Wizard Configurador
│   ├── Paso 1: Nombre del niño/a
│   ├── Paso 2: Apariencia (género + piel + pelo + lentes)
│   ├── Paso 3: Dedicatoria
│   └── Paso 4: Resumen de selección
├── /libro/[slug]/preview → Preview Page-Flip
├── /checkout → Checkout (envío + descuento + pago)
├── /checkout/success → Confirmación de Compra
└── /checkout/failure → Pago Fallido

Admin (auth requerido, desktop-first):
├── /admin/login → Login Admin
├── /admin/dashboard → Dashboard Operacional
├── /admin/libros → Lista de Libros
├── /admin/libros/[bookId]/editor → Editor de Libro
│   ├── Tab: Info General
│   ├── Tab: Escenas (WYSIWYG)
│   └── Tab: Setting Sheet
├── /admin/libros/[bookId]/variantes → Grid de Variantes
├── /admin/libros/[bookId]/variante/[variantId] → Detalle Variante (11 páginas)
├── /admin/generacion → Monitor de Pre-generación
├── /admin/pedidos → Lista de Pedidos
├── /admin/pedidos/[orderId] → Detalle de Pedido
├── /admin/descuentos → Gestión de Descuentos
└── /admin/suscriptores → Lista de Suscriptores

Páginas de Estado:
├── /404 → Página No Encontrada
└── /500 → Error del Servidor

Total: 28 pantallas únicas × 2 versiones = 56 wireframes
```

---

## Flujo de Navegación Principal

```
BUYER HAPPY PATH:
Landing → Catálogo → Detalle Libro → Wizard (4 pasos) → Preview → Checkout → Success

┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────────────────────┐
│ Landing  │──▶│ Catálogo │──▶│ Detalle  │──▶│ Wizard                   │
│ Page     │   │          │   │ Libro    │   │ 1.Nombre → 2.Apariencia  │
└──────────┘   └──────────┘   └──────────┘   │ → 3.Dedicatoria → 4.Sum │
                                              └────────────┬─────────────┘
                                                           │
                                                           ▼
                                              ┌──────────────────────────┐
                                              │ Preview Page-Flip        │
                                              │ (WOW moment)             │
                                              └────────────┬─────────────┘
                                                           │
                                                           ▼
                                              ┌──────────────────────────┐
                                              │ Checkout                 │
                                              │ Envío → Descuento → Pago│
                                              └──────┬──────────┬───────┘
                                                     │          │
                                                     ▼          ▼
                                              ┌──────────┐ ┌──────────┐
                                              │ Success  │ │ Failure  │
                                              └──────────┘ └──────────┘

ADMIN HAPPY PATH:
Login → Dashboard → Libros → Editor → Pre-generar → Curar Variantes → Pedidos

┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Login    │──▶│Dashboard │──▶│ Libros   │──▶│ Editor   │
│ Admin    │   │          │   │ Lista    │   │ Libro    │
└──────────┘   └──────────┘   └──────────┘   └────┬─────┘
                                                   │
                    ┌──────────────────────────────┘
                    ▼
┌──────────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ Pre-generar  │──▶│ Monitor  │──▶│ Grid     │──▶│ Detalle  │
│ Variantes    │   │ Progreso │   │ Variantes│   │ Variante │
└──────────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## 🔧 HERRAMIENTAS DETECTADAS

```
[✅] Excalidraw MCP — disponible (para diagramas de flujo/sitemap)
[✅] HTML/SVG Artifacts — siempre disponible
[✅] ASCII Markdown — siempre disponible
[❌] Frame0 MCP — no disponible

Estrategia: ASCII wireframes en Markdown como formato principal.
```

---

---

# STOREFRONT — Pantallas Públicas

---

## 1. Landing Page

---

### Pantalla: Landing Page Completa

**Ruta:** /
**User Stories:** US-001, US-002, US-003, US-004
**Propósito:** Enamorar al visitante en 5 segundos, contar la historia, mostrar cómo funciona y capturar emails
**Llega desde:** URL directa, redes sociales, Google
**Va hacia:** Catálogo, Waitlist confirmación

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ☰  Tipiti Books      [Catálogo]│
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │  [Ilustración acuarela      ││
│  │   hero — niña leyendo       ││
│  │   con su mamá]              ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  Un libro donde                 │
│  Sofía es la protagonista       │
│                                 │
│  Ilustraciones a mano,          │
│  personalizadas con amor.       │
│  Desde $40 USD.                 │
│                                 │
│  [ ★ Crea tu libro ★ ]         │
│  (Ver ejemplos ↓)              │
│                                 │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [Foto/video de Sofi]        ││
│  └─────────────────────────────┘│
│                                 │
│  Nuestra Historia               │
│                                 │
│  "Soy Sofi, mamá de una niña   │
│  que amaba los cuentos antes    │
│  de dormir. Quise un libro      │
│  donde ella fuera la            │
│  protagonista... y no existía." │
│                                 │
│  Artesanía · Calidad · Amor     │
│                                 │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  Cómo Funciona                  │
│                                 │
│  ┌───────────┐                  │
│  │  🎨  1    │                  │
│  │ Elige el  │                  │
│  │ libro y   │                  │
│  │ personaliza│                 │
│  │ a tu niño │                  │
│  └───────────┘                  │
│  ┌───────────┐                  │
│  │  ✨  2    │                  │
│  │ Nosotros  │                  │
│  │ generamos │                  │
│  │ tu libro  │                  │
│  │ único     │                  │
│  └───────────┘                  │
│  ┌───────────┐                  │
│  │  📦  3    │                  │
│  │ Recibes   │                  │
│  │ en casa,  │                  │
│  │ listo para│                  │
│  │ regalar   │                  │
│  └───────────┘                  │
│                                 │
│  Galería de ejemplo             │
│  ◄ [spread1] [spread2] [spr ►  │
│    ● ○ ○ ○ ○ ○                  │
│  "Busca al osito en cada pág"   │
│                                 │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  Sé de los primeros             │
│                                 │
│  Primeros 50 compradores        │
│  reciben TIPITI20: 20% off      │
│                                 │
│  [____tu@email.com____]        │
│  [  Quiero mi libro  ]         │
│                                 │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│  Tipiti Books · Chile 🇨🇱       │
│  hola@tipitibooks.com           │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books (logo)          Catálogo    Nuestra Historia   [CTA]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────┬─────────────────────────────────────┐   │
│  │                      │                                     │   │
│  │  Un libro donde      │  [Ilustración acuarela hero         │   │
│  │  Sofía es la         │   — niña leyendo con mamá,          │   │
│  │  protagonista        │   estilo watercolor cálido]          │   │
│  │                      │                                     │   │
│  │  Ilustraciones a     │                                     │   │
│  │  mano, personaliza-  │                                     │   │
│  │  das con amor.       │                                     │   │
│  │  Desde $40 USD.      │                                     │   │
│  │                      │                                     │   │
│  │  [ ★ Crea tu libro ] │                                     │   │
│  │  (Ver ejemplos ↓)    │                                     │   │
│  │                      │                                     │   │
│  └──────────────────────┴─────────────────────────────────────┘   │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                    │
│  ┌─────────────────────┬──────────────────────────────────────┐   │
│  │ [Foto de Sofi]      │  Nuestra Historia                    │   │
│  │                     │                                      │   │
│  │                     │  "Soy Sofi, mamá de una niña que     │   │
│  │                     │  amaba los cuentos antes de dormir.  │   │
│  │                     │  Quise un libro donde ella fuera     │   │
│  │                     │  la protagonista..."                 │   │
│  │                     │                                      │   │
│  │                     │  Artesanía · Calidad · Amor          │   │
│  └─────────────────────┴──────────────────────────────────────┘   │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                    │
│  Cómo Funciona                                                     │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   🎨  1      │  │   ✨  2      │  │   📦  3      │            │
│  │ Elige el     │  │ Nosotros     │  │ Recibes en   │            │
│  │ libro y      │  │ generamos tu │  │ casa, listo  │            │
│  │ personaliza  │  │ libro único  │  │ para regalar │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                    │
│  ◄ [spread1] [spread2] [spread3] [spread4] [spread5] [sprd6] ►   │
│  "Busca al osito en cada página"                                   │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                    │
│             Sé de los primeros — 20% off para los 50 primeros      │
│                                                                    │
│             [____tu@email.com____] [Quiero mi libro]               │
│                                                                    │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│  Tipiti Books · Chile 🇨🇱 · hola@tipitibooks.com                  │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Hero illustration | Imagen | Fondo acuarela, WebP con fallback JPG |
| 2 | "Crea tu libro" | Button primario | Navega a /catalogo |
| 3 | "Ver ejemplos" | Link scroll | Scroll suave a galería |
| 4 | Galería de spreads | Carrusel | Swipe horizontal mobile, scroll desktop |
| 5 | Email waitlist input | Input + Button | Guarda en subscribers, envía email bienvenida |

#### Interacciones

- Click "Crea tu libro" → /catalogo
- Click "Ver ejemplos" → Scroll a galería de spreads
- Submit email waitlist → Guardar subscriber + mostrar confirmación animada
- Click "Catálogo" nav → /catalogo

#### Estados

- **Loading:** Skeleton del hero con placeholder gris
- **Error waitlist:** "Hubo un error. Intenta nuevamente en unos segundos."
- **Email duplicado:** "Este email ya está registrado. ¡Te avisaremos pronto!"
- **Confirmación waitlist:** "¡Listo! Te avisaremos cuando lancemos." (checkmark animado)

---

## 2. Catálogo de Libros

---

### Pantalla: Catálogo

**Ruta:** /catalogo
**User Stories:** US-005
**Propósito:** Mostrar libros disponibles para personalizar
**Llega desde:** Landing Page, Nav
**Va hacia:** Detalle del Libro

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄  Tipiti Books       [Catálogo]│
├─────────────────────────────────┤
│                                 │
│  Nuestros Libros                │
│                                 │
│  ┌─────────────────────────────┐│
│  │ [Portada acuarela           ││
│  │  "Buenas Noches, {nombre}"] ││
│  │                             ││
│  ├─────────────────────────────┤│
│  │ Buenas Noches, {nombre}     ││
│  │ 2-5 años · 20 páginas       ││
│  │ $29.990 CLP                 ││
│  │ [ Personalizar ]            ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [Portada acuarela           ││
│  │  "Próximamente"]            ││
│  │                             ││
│  ├─────────────────────────────┤│
│  │ Nuevo título (próximamente) ││
│  │ Avisame cuando esté listo   ││
│  │ [ Unirme a waitlist ]       ││
│  └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books (logo)          Catálogo    Nuestra Historia   [CTA]│
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Nuestros Libros                                                   │
│                                                                    │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────┐ │
│  │ [Portada acuarela]  │  │ [Portada            │  │ Próxima-  │ │
│  │                     │  │  "Próximamente"]    │  │ mente...  │ │
│  ├─────────────────────┤  ├─────────────────────┤  │           │ │
│  │ Buenas Noches       │  │ Nuevo título        │  │           │ │
│  │ 2-5 años · 20 pág   │  │ (próximamente)      │  │           │ │
│  │ $29.990 CLP         │  │ [ Waitlist ]        │  │           │ │
│  │ [ Personalizar ]    │  │                     │  │           │ │
│  └─────────────────────┘  └─────────────────────┘  └───────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Book card | Card | Click → detalle del libro |
| 2 | "Personalizar" | Button | Navega a /libro/[slug] |
| 3 | Portada thumbnail | Imagen | cover_template_url del libro |

#### Estados

- **Empty:** "Estamos preparando algo especial. ¡Vuelve pronto!" + link a waitlist
- **Loading:** 2-3 skeleton cards con shimmer
- **1 solo libro:** Mostrar igualmente como catálogo

---

## 3. Detalle del Libro

---

### Pantalla: Detalle del Libro

**Ruta:** /libro/[slug]
**User Stories:** US-006, US-007
**Propósito:** Mostrar todo sobre el libro para que el comprador decida personalizarlo
**Llega desde:** Catálogo
**Va hacia:** Wizard Configurador (Paso 1)

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄ Catálogo             [Share]│
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │  [Spread de ejemplo 1]     ││
│  │                             ││
│  └─────────────────────────────┘│
│  ◄ ● ○ ○ ○ ○ ○ ►              │
│                                 │
│  Buenas Noches, {nombre}        │
│  Un cuento para soñar donde     │
│  tu niño/a es la estrella.      │
│                                 │
│  2-5 años · 22×18 cm           │
│  20 páginas · Impresión premium │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  Preguntas Frecuentes           │
│                                 │
│  ▼ ¿Cuánto tarda en llegar?     │
│  ▼ ¿De qué material es?        │
│  ▼ ¿Puedo verlo antes de pagar? │
│  ▼ ¿Hacen envíos a regiones?    │
│                                 │
│┌─────────────────────────────┐  │
││ $29.990 CLP                 │  │
││ [ ★ Personalizar este libro]│  │
│└─────────────────────────────┘  │
└─────────────────────────────────┘
  ↑ sticky bottom bar
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│  Home > Catálogo > Buenas Noches                                   │
│                                                                    │
│  ┌────────────────────────────┬───────────────────────────────┐   │
│  │                            │                               │   │
│  │  [Spread de ejemplo]       │  Buenas Noches, {nombre}      │   │
│  │                            │                               │   │
│  │  ◄ ● ○ ○ ○ ○ ○ ►         │  Un cuento para soñar donde   │   │
│  │                            │  tu niño/a es la estrella.    │   │
│  │  [thumb1][thumb2][thumb3]  │                               │   │
│  │  [thumb4][thumb5][thumb6]  │  2-5 años · 22×18 cm         │   │
│  │                            │  20 páginas · Impresión prem. │   │
│  │                            │                               │   │
│  │                            │  $29.990 CLP                  │   │
│  │                            │                               │   │
│  │                            │  [★ Personalizar este libro]  │   │
│  │                            │                               │   │
│  │                            │  (Copiar link 🔗)             │   │
│  └────────────────────────────┴───────────────────────────────┘   │
│                                                                    │
│  Preguntas Frecuentes                                              │
│  ▼ ¿Cuánto tarda?  ▼ ¿Material?  ▼ ¿Preview?  ▼ ¿Envíos?       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Galería spreads | Carrusel | Swipe mobile, thumbnails desktop |
| 2 | "Personalizar" | Button primario | Navega a /libro/[slug]/personalizar |
| 3 | Precio CLP | Texto | Desde books.price_clp |
| 4 | Share button | Button | Share API mobile, copiar link desktop |
| 5 | FAQs | Accordion | Expand/collapse |
| 6 | Sticky bottom bar | Container | Solo mobile, precio + CTA |

#### Interacciones

- Click "Personalizar" → /libro/[slug]/personalizar (wizard paso 1)
- Swipe galería → Siguiente/anterior spread
- Click FAQ → Expand/collapse respuesta
- Click Share → Share API nativa (mobile) o "¡Copiado!" (desktop)

---

## 4. Wizard Configurador — Paso 1: Nombre

---

### Pantalla: Wizard - Nombre del Niño/a

**Ruta:** /libro/[slug]/personalizar (step=1)
**User Stories:** US-008, US-013
**Propósito:** Capturar el nombre del protagonista
**Llega desde:** Detalle del Libro
**Va hacia:** Wizard Paso 2 (Apariencia)

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄ Buenas Noches                │
├─────────────────────────────────┤
│                                 │
│  ● ─ ─ ○ ─ ─ ○ ─ ─ ○          │
│  Nombre  Apariencia  Dedicat. Preview│
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │  ¿Cómo se llama el/la      ││
│  │  protagonista?              ││
│  │                             ││
│  │  [___________________]     ││
│  │   Ej: Sofía, Mateo          ││
│  │                             ││
│  │  ┌───────────────────────┐  ││
│  │  │ "Buenas noches,       │  ││
│  │  │  Sofía"                │  ││
│  │  │                        │  ││
│  │  │  [preview ilustración] │  ││
│  │  └───────────────────────┘  ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  [     Siguiente →    ]         │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│            ● ──── ○ ──── ○ ──── ○                                 │
│          Nombre  Apariencia  Dedicat.  Preview                    │
│                                                                    │
│  ┌──────────────────────────┬─────────────────────────────────┐   │
│  │                          │                                 │   │
│  │  ¿Cómo se llama el/la   │   ┌───────────────────────┐     │   │
│  │  protagonista?           │   │                       │     │   │
│  │                          │   │ "Buenas noches,       │     │   │
│  │  [____________________]  │   │  Sofía"               │     │   │
│  │   Ej: Sofía, Mateo      │   │                       │     │   │
│  │                          │   │ [preview ilustración] │     │   │
│  │                          │   │                       │     │   │
│  │                          │   └───────────────────────┘     │   │
│  │                          │                                 │   │
│  │  [  Siguiente →  ]       │                                 │   │
│  │                          │                                 │   │
│  └──────────────────────────┴─────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Progress bar | Stepper | 4 pasos, clickeable en completados |
| 2 | Nombre input | Text input | Autofocus, autocapitalize, 2-30 chars |
| 3 | Preview en vivo | Card | Muestra nombre en frase del libro |
| 4 | "Siguiente" | Button | Avanza a paso 2, Enter también funciona |

#### Interacciones

- Tipear nombre → Preview se actualiza en tiempo real
- Click "Siguiente" / Enter → Paso 2 (slide animation)
- Click paso en stepper → Navega a paso completado
- Nombre inválido → Error inline debajo del input

---

## 5. Wizard Configurador — Paso 2: Apariencia

---

### Pantalla: Wizard - Apariencia del Personaje

**Ruta:** /libro/[slug]/personalizar (step=2)
**User Stories:** US-009, US-010, US-013
**Propósito:** Seleccionar género, piel, pelo, lentes en grid visual
**Llega desde:** Wizard Paso 1
**Va hacia:** Wizard Paso 3 (Dedicatoria)

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄ Paso 1                       │
├─────────────────────────────────┤
│                                 │
│  ○ ─ ─ ● ─ ─ ○ ─ ─ ○          │
│  Nombre  Apariencia  Dedicat. Prev│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [Portrait del personaje     ││
│  │  actualizado en tiempo      ││
│  │  real según selección]      ││
│  └─────────────────────────────┘│
│  ↑ sticky en mobile             │
│                                 │
│  Género                         │
│  ┌────────────┐ ┌────────────┐ │
│  │  [Niña]    │ │  [Niño]    │ │
│  │  ✓ activo  │ │            │ │
│  └────────────┘ └────────────┘ │
│                                 │
│  Tono de piel                   │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 🟡   │ │ 🟤   │ │ 🟫   │   │
│  │Claro │ │ Mate │ │Oscuro│   │
│  │  ✓   │ │      │ │      │   │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  Color de pelo                  │
│  ┌──────┐┌──────┐┌──────┐┌──┐ │
│  │Rubio ││Casta-││Pelir-││Ne-│ │
│  │  ✓   ││ño    ││rojo  ││gro│ │
│  └──────┘└──────┘└──────┘└──┘ │
│                                 │
│  Tipo de pelo                   │
│  ┌────────────┐ ┌────────────┐ │
│  │ ~~ Liso    │ │ 〰 Ondulado│ │
│  │    ✓       │ │            │ │
│  └────────────┘ └────────────┘ │
│                                 │
│  Lentes                         │
│  ┌────────────┐ ┌────────────┐ │
│  │ 👓 Sí      │ │    No      │ │
│  │            │ │    ✓       │ │
│  └────────────┘ └────────────┘ │
│                                 │
│  [← Atrás]  [  Siguiente →  ] │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│            ○ ──── ● ──── ○ ──── ○                                 │
│          Nombre  Apariencia  Dedicat.  Preview                    │
│                                                                    │
│  ┌────────────────────────────────┬───────────────────────────┐   │
│  │                                │                           │   │
│  │  Género                        │  ┌───────────────────┐   │   │
│  │  [Niña ✓]  [Niño]             │  │                   │   │   │
│  │                                │  │  [Portrait del    │   │   │
│  │  Tono de piel                  │  │   personaje       │   │   │
│  │  [🟡 Claro ✓] [🟤 Mate] [🟫] │  │   grande,         │   │   │
│  │                                │  │   actualizado     │   │   │
│  │  Color de pelo                 │  │   en tiempo       │   │   │
│  │  [Rubio ✓][Castaño][Pelir][Ne]│  │   real]           │   │   │
│  │                                │  │                   │   │   │
│  │  Tipo de pelo                  │  └───────────────────┘   │   │
│  │  [Liso ✓]  [Ondulado]         │                           │   │
│  │                                │  Sofía                    │   │
│  │  Lentes                        │  Niña · Piel clara ·     │   │
│  │  [Sí]  [No ✓]                 │  Rubio liso · Sin lentes │   │
│  │                                │                           │   │
│  │  [← Atrás]  [Siguiente →]     │                           │   │
│  │                                │                           │   │
│  └────────────────────────────────┴───────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Género selector | Card group (2) | Exclusivo, muestra ilustración |
| 2 | Piel swatches | Color swatches (3) | Exclusivo, filtra colores de pelo |
| 3 | Pelo color grid | Card group (1-4) | Filtrado por piel (oscuro→solo negro) |
| 4 | Pelo tipo toggle | Toggle (2) | Liso/ondulado |
| 5 | Lentes toggle | Toggle (2) | Sí/No |
| 6 | Portrait preview | Imagen | Se actualiza en cada cambio con lookup de variante |

#### Interacciones

- Seleccionar piel oscura → Pelo se reduce a solo "negro" + mensaje explicativo
- Cada cambio → Portrait preview se actualiza (findVariant lookup)
- Click "Siguiente" → Paso 3
- Click "Atrás" → Paso 1 (datos preservados)

#### Estados

- **Variante no disponible:** "Esta combinación estará disponible pronto. Prueba con otra similar." + sugerencias
- **Loading portrait:** Skeleton shimmer en preview
- **Todo seleccionado:** Siguiente habilitado

---

## 6. Wizard Configurador — Paso 3: Dedicatoria

---

### Pantalla: Wizard - Dedicatoria

**Ruta:** /libro/[slug]/personalizar (step=3)
**User Stories:** US-011, US-013
**Propósito:** Escribir mensaje personal para imprimir en el libro
**Llega desde:** Wizard Paso 2
**Va hacia:** Wizard Paso 4 (Resumen)

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄ Paso 2                       │
├─────────────────────────────────┤
│                                 │
│  ○ ─ ─ ○ ─ ─ ● ─ ─ ○          │
│  Nombre  Apariencia  Dedicat. Prev│
│                                 │
│  Escribe un mensaje especial    │
│  para Sofía                     │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Para mi Sofía querida,      ││
│  │ este libro es para ti       ││
│  │ porque eres la luz de       ││
│  │ nuestras noches...          ││
│  │                             ││
│  │                             ││
│  └─────────────────────────────┘│
│                          142/200│
│                                 │
│  ┌─────────────────────────────┐│
│  │  Preview dedicatoria        ││
│  │  ┌───────────────────────┐  ││
│  │  │ "Para mi Sofía        │  ││
│  │  │  querida, este libro  │  ││
│  │  │  es para ti porque    │  ││
│  │  │  eres la luz de       │  ││
│  │  │  nuestras noches..."  │  ││
│  │  └───────────────────────┘  ││
│  │  (tipografía del libro)     ││
│  └─────────────────────────────┘│
│                                 │
│  [← Atrás]  [  Siguiente →  ] │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│            ○ ──── ○ ──── ● ──── ○                                 │
│          Nombre  Apariencia  Dedicat.  Preview                    │
│                                                                    │
│  ┌────────────────────────────────┬───────────────────────────┐   │
│  │                                │                           │   │
│  │  Escribe un mensaje especial   │  ┌───────────────────┐   │   │
│  │  para Sofía                    │  │                   │   │   │
│  │                                │  │ Preview de la     │   │   │
│  │  ┌──────────────────────────┐  │  │ dedicatoria en    │   │   │
│  │  │ Para mi Sofía querida,   │  │  │ tipografía del    │   │   │
│  │  │ este libro es para ti    │  │  │ libro sobre       │   │   │
│  │  │ porque eres la luz de    │  │  │ fondo de página   │   │   │
│  │  │ nuestras noches...       │  │  │                   │   │   │
│  │  │                          │  │  └───────────────────┘   │   │
│  │  └──────────────────────────┘  │                           │   │
│  │                         142/200│                           │   │
│  │                                │                           │   │
│  │  [← Atrás]  [Siguiente →]     │                           │   │
│  │                                │                           │   │
│  └────────────────────────────────┴───────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Textarea dedicatoria | Textarea | Autoexpand, max 200 chars |
| 2 | Counter | Texto | X/200, se pone rojo al acercarse |
| 3 | Preview dedicatoria | Card | Tipografía del libro, actualización real-time |

---

## 7. Wizard Configurador — Paso 4: Resumen

---

### Pantalla: Wizard - Resumen de Selección

**Ruta:** /libro/[slug]/personalizar (step=4)
**User Stories:** US-012, US-013
**Propósito:** Confirmar todas las selecciones antes del preview
**Llega desde:** Wizard Paso 3
**Va hacia:** Preview Page-Flip

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄ Paso 3                       │
├─────────────────────────────────┤
│                                 │
│  ○ ─ ─ ○ ─ ─ ○ ─ ─ ●          │
│  Nombre  Apariencia  Dedicat. Prev│
│                                 │
│  ¡Así quedó tu personaje!       │
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │  [Portrait grande del       ││
│  │   personaje configurado]    ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  Sofía                          │
│  Niña · Piel clara · Rubio liso │
│  Sin lentes                     │
│  (Editar ✏️)                    │
│                                 │
│  Dedicatoria:                   │
│  "Para mi Sofía querida..."     │
│  (Editar ✏️)                    │
│                                 │
│  Buenas Noches, Sofía           │
│  20 páginas · 22×18 cm          │
│                                 │
│  [ ★ Ver mi libro ★ ]          │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│            ○ ──── ○ ──── ○ ──── ●                                 │
│          Nombre  Apariencia  Dedicat.  Preview                    │
│                                                                    │
│  ┌─────────────────┬──────────────────────────────────────────┐   │
│  │                 │                                          │   │
│  │  [Portrait      │  ¡Así quedó tu personaje!                │   │
│  │   grande]       │                                          │   │
│  │                 │  Nombre: Sofía                           │   │
│  │                 │  Género: Niña                            │   │
│  │                 │  Piel: Clara · Pelo: Rubio liso          │   │
│  │                 │  Lentes: No                   (Editar ✏️)│   │
│  │                 │                                          │   │
│  │                 │  Dedicatoria:                            │   │
│  │                 │  "Para mi Sofía querida..."   (Editar ✏️)│   │
│  │                 │                                          │   │
│  │                 │  Libro: Buenas Noches, Sofía             │   │
│  │                 │  20 páginas · 22×18 cm                   │   │
│  │                 │                                          │   │
│  │                 │  [ ★ Ver mi libro ★ ]                    │   │
│  │                 │                                          │   │
│  └─────────────────┴──────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Interacciones

- Click "Editar" → Vuelve al paso correspondiente del wizard
- Click "Ver mi libro" → /libro/[slug]/preview con animación de transición

---

## 8. Preview Page-Flip

---

### Pantalla: Preview Animado del Libro

**Ruta:** /libro/[slug]/preview
**User Stories:** US-014, US-015, US-016
**Propósito:** El WOW moment — ver el libro personalizado completo con page-flip
**Llega desde:** Wizard Paso 4
**Va hacia:** Checkout

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄ Editar    Buenas Noches [⛶] │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │                             ││
│  │  [Spread del libro con      ││
│  │   ilustración acuarela      ││
│  │   + texto "Buenas noches,   ││
│  │   Sofía" superpuesto]       ││
│  │                             ││
│  │  ◄                     ►    ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│        ○ ○ ● ○ ○ ○ ○ ○ ○ ○ ○  │
│                3/11             │
│                                 │
│  (Compartir preview 🔗)         │
│                                 │
│┌─────────────────────────────┐  │
││ $29.990 CLP                 │  │
││ [ ★ Comprar por $29.990 ★ ]│  │
││ Producción artesanal.       │  │
││ Envío en 8-12 días.         │  │
│└─────────────────────────────┘  │
└─────────────────────────────────┘
  ↑ sticky bottom bar
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  (Editar personalización)                                          │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  ◄   [Spread del libro con page-flip animation          ►│   │
│  │       ilustración acuarela + texto "Buenas noches,        │   │
│  │       Sofía" superpuesto — efecto de libro abierto 3D]    │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│              ○ ○ ○ ● ○ ○ ○ ○ ○ ○ ○    4/11                       │
│              ← → keyboard arrows                                   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Sofía (thumbnail)  ·  Buenas Noches  ·  $29.990 CLP      │   │
│  │  [ ★ Comprar por $29.990 CLP ★ ]  (Compartir preview 🔗) │   │
│  │  Producción artesanal. Envío en 8-12 días.                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Page-flip viewer | Canvas/Animation | Swipe mobile, click/arrows desktop |
| 2 | Page indicator | Dots + counter | 11 dots, página actual |
| 3 | Fullscreen toggle | Button | Solo mobile, expande viewer |
| 4 | CTA Comprar | Button sticky | Precio + acción, sticky bottom mobile |
| 5 | "Editar" | Link | Vuelve al wizard paso 4 |
| 6 | Compartir | Button | Genera link temporal (7 días) |

---

## 9. Checkout

---

### Pantalla: Checkout (Envío + Descuento + Pago)

**Ruta:** /checkout
**User Stories:** US-017, US-018, US-019, US-020
**Propósito:** Capturar datos de envío, aplicar descuento y procesar pago
**Llega desde:** Preview Page-Flip
**Va hacia:** Success o Failure

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  ◄ Preview          Checkout    │
├─────────────────────────────────┤
│                                 │
│  Resumen del pedido             │
│  ┌─────────────────────────────┐│
│  │ [thumb] Buenas Noches,      ││
│  │         Sofía               ││
│  │         Niña · Rubio liso   ││
│  │                             ││
│  │         $29.990 CLP         ││
│  └─────────────────────────────┘│
│                                 │
│  (¿Tienes un código? ▼)        │
│  ┌─────────────────────────────┐│
│  │ [__TIPITI20__] [Aplicar]    ││
│  │                             ││
│  │ TIPITI20 — 20% off          ││
│  │ -$5.998 CLP        (Quitar)││
│  │ ────────────────────        ││
│  │ Total: $23.992 CLP         ││
│  └─────────────────────────────┘│
│                                 │
│  Datos de envío                 │
│                                 │
│  Nombre completo *              │
│  [_________________________]   │
│                                 │
│  Email *                        │
│  [_________________________]   │
│                                 │
│  Teléfono *                     │
│  [+56 9 ________________]     │
│                                 │
│  Dirección *                    │
│  [_________________________]   │
│                                 │
│  Ciudad *          Región *     │
│  [____________] [_________▼]   │
│                                 │
│  Código postal                  │
│  [____________]                │
│                                 │
│  🇨🇱 Envío solo a Chile (V1)    │
│                                 │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  Método de pago                 │
│                                 │
│  ┌─────────────────────────────┐│
│  │ ○ Tarjeta / Webpay (Flow)  ││
│  │   Crédito, débito, Webpay  ││
│  ├─────────────────────────────┤│
│  │ ○ MercadoPago               ││
│  │   Saldo MP, cuotas sin int.││
│  └─────────────────────────────┘│
│                                 │
│  [ ★ Pagar $23.992 CLP ★ ]    │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────┬─────────────────────────┐   │
│  │                                  │                         │   │
│  │  Datos de envío                  │  Resumen del pedido     │   │
│  │                                  │                         │   │
│  │  Nombre completo *               │  [thumb] Buenas Noches  │   │
│  │  [__________________________]    │          Sofía          │   │
│  │                                  │  Niña · Rubio liso      │   │
│  │  Email *         Teléfono *      │                         │   │
│  │  [_____________] [+56 9 ____]    │  ────────────────       │   │
│  │                                  │  Subtotal: $29.990      │   │
│  │  Dirección *                     │  TIPITI20 (20%)         │   │
│  │  [__________________________]    │  Descuento: -$5.998     │   │
│  │                                  │  ────────────────       │   │
│  │  Ciudad *   Región *   C.P.      │  Total: $23.992 CLP    │   │
│  │  [________] [_____▼] [_____]     │                         │   │
│  │                                  │  (¿Código? ▼)           │   │
│  │  🇨🇱 Solo Chile (V1)              │  [_______] [Aplicar]    │   │
│  │                                  │                         │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━     │                         │   │
│  │                                  │                         │   │
│  │  Método de pago                  │                         │   │
│  │  ○ Tarjeta/Webpay (Flow.cl)     │                         │   │
│  │  ○ MercadoPago                   │                         │   │
│  │                                  │                         │   │
│  │  [★ Pagar $23.992 CLP ★]        │                         │   │
│  │                                  │                         │   │
│  └──────────────────────────────────┴─────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | Resumen pedido | Card | Thumbnail + info + precio |
| 2 | Código descuento | Collapsible input | Expandir → input + "Aplicar" |
| 3 | Formulario envío | Form | 7 campos, validación Zod |
| 4 | Método de pago | Radio group | Flow.cl (default) o MercadoPago |
| 5 | "Pagar" | Button primario | Disabled hasta form válido, no doble-click |

#### Estados

- **Descuento válido:** Precio tachado + nuevo precio + badge verde
- **Descuento inválido:** Mensaje rojo bajo input
- **Loading pago:** Overlay "Procesando tu pago..." (no cerrar)
- **Form incompleto:** Botón "Pagar" disabled

---

## 10. Confirmación de Compra

---

### Pantalla: Compra Exitosa

**Ruta:** /checkout/success
**User Stories:** US-021, US-026
**Propósito:** Confirmar pago, generar tranquilidad, ofrecer newsletter
**Llega desde:** Checkout (pago exitoso)
**Va hacia:** Landing (Home)

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  Tipiti Books                    │
├─────────────────────────────────┤
│                                 │
│         ✓ (animación confetti)  │
│                                 │
│  ¡Tu libro está en camino!      │
│                                 │
│  Pedido #TIP-2024-0001         │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Buenas Noches, Sofía        ││
│  │ [portrait thumb]            ││
│  │                             ││
│  │ Subtotal:    $29.990        ││
│  │ Descuento:   -$5.998        ││
│  │ Total pagado: $23.992 CLP  ││
│  │                             ││
│  │ Enviado a:                  ││
│  │ Av. Providencia 1234       ││
│  │ Santiago, RM                ││
│  └─────────────────────────────┘│
│                                 │
│  Recibirás un email de          │
│  confirmación en tu@email.com   │
│                                 │
│  Tu libro estará listo en       │
│  8-12 días hábiles              │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│                                 │
│  ☐ Quiero recibir novedades     │
│    sobre nuevos libros y        │
│    promociones                  │
│                                 │
│  [ Volver al inicio ]           │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books     Catálogo    Nuestra Historia              [CTA] │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                    ✓ (confetti animation)                           │
│                                                                    │
│                    ¡Tu libro está en camino!                        │
│                    Pedido #TIP-2024-0001                            │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  [thumb]  Buenas Noches, Sofía    │  Total: $23.992 CLP   │   │
│  │           Niña · Rubio liso       │  Desc: -$5.998 (20%) │   │
│  │           Av. Providencia 1234    │                       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│      Recibirás un email de confirmación en tu@email.com            │
│      Tu libro estará listo en 8-12 días hábiles                    │
│                                                                    │
│      ☐ Quiero recibir novedades sobre nuevos libros y promociones  │
│                                                                    │
│      [ Volver al inicio ]                                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 11. Pago Fallido

---

### Pantalla: Pago Fallido

**Ruta:** /checkout/failure
**User Stories:** US-022
**Propósito:** Informar error sin generar ansiedad, ofrecer reintentar
**Llega desde:** Checkout (pago rechazado)
**Va hacia:** Checkout (reintento)

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  Tipiti Books                    │
├─────────────────────────────────┤
│                                 │
│         ⚠️                       │
│                                 │
│  Tu pago no pudo ser            │
│  procesado                      │
│                                 │
│  No te preocupes — tu libro     │
│  personalizado está guardado.   │
│                                 │
│  Sugerencias:                   │
│  · Verifica los datos de tu     │
│    tarjeta                      │
│  · Intenta con otro método      │
│    de pago                      │
│                                 │
│  [ ★ Reintentar pago ★ ]       │
│  [ Cambiar método de pago ]     │
│  (Volver al inicio)            │
│                                 │
└─────────────────────────────────┘
```

*(Desktop: layout centrado similar, sin columnas)*

---

---

# ADMIN — Pantallas Protegidas

---

## 12. Login Admin

---

### Pantalla: Login Admin

**Ruta:** /admin/login
**User Stories:** US-029
**Propósito:** Autenticar a Sofi para acceder al panel
**Llega desde:** URL directa, redirect de protección de rutas
**Va hacia:** Dashboard Admin

#### Mobile (375px)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         Tipiti Books            │
│         Panel Admin             │
│                                 │
│  Email                          │
│  [_________________________]   │
│                                 │
│  Contraseña                     │
│  [___________________] [👁]    │
│                                 │
│  ☑ Recordar sesión              │
│                                 │
│  [ Iniciar sesión ]             │
│                                 │
│                                 │
└─────────────────────────────────┘
```

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                                                                    │
│                    ┌──────────────────────┐                        │
│                    │                      │                        │
│                    │  Tipiti Books         │                        │
│                    │  Panel Admin          │                        │
│                    │                      │                        │
│                    │  Email               │                        │
│                    │  [________________]  │                        │
│                    │                      │                        │
│                    │  Contraseña          │                        │
│                    │  [____________] [👁] │                        │
│                    │                      │                        │
│                    │  ☑ Recordar sesión   │                        │
│                    │                      │                        │
│                    │  [Iniciar sesión]    │                        │
│                    │                      │                        │
│                    └──────────────────────┘                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### Estados

- **Credenciales incorrectas:** "Email o contraseña incorrectos."
- **Rate limit:** "Demasiados intentos. Espera 1 minuto."
- **Loading:** Spinner en botón
- **Sesión expirada (redirect):** Banner "Tu sesión expiró."

---

## 13. Dashboard Operacional

---

### Pantalla: Dashboard Admin

**Ruta:** /admin/dashboard
**User Stories:** US-049, US-050
**Propósito:** Vista panorámica del negocio + alertas
**Llega desde:** Login, Sidebar nav
**Va hacia:** Cualquier sección admin

#### Desktop (1440px) — pantalla principal del admin

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  Buenos días, Sofi                                     │
│  📚 Libros│                                                        │
│  🎨 Gener.│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  📦 Pedidos│ │ Ventas    │ │ Ventas   │ │ Pedidos  │ │ Waitlist │ │
│  🏷 Desc. │ │ Hoy      │ │ Mes      │ │ Activos  │ │          │ │
│  📧 Suscr.│ │ 2        │ │ 14       │ │ 5        │ │ 127      │ │
│           │ │$59.980   │ │$419.860  │ │ 3 enviar │ │          │ │
│           │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│           │                                                        │
│           │  ⚠️ Alertas (2)                                        │
│           │  ┌────────────────────────────────────────────────┐    │
│           │  │ 🔴 Pedido #TIP-0005 lleva 8 días en "packed" │    │
│           │  │ 🟡 Pedido #TIP-0012 lleva 4 días en "paid"   │    │
│           │  └────────────────────────────────────────────────┘    │
│           │                                                        │
│           │  Últimos pedidos                                       │
│           │  ┌────────────────────────────────────────────────┐    │
│           │  │ #TIP-0014 │ Mateo   │ Buenas.. │ paid    │ Hoy│    │
│           │  │ #TIP-0013 │ Sofía   │ Buenas.. │ shipped │ Ayer│   │
│           │  │ #TIP-0012 │ Valentina│ Buenas..│ paid    │ 4d │    │
│           │  │ #TIP-0011 │ Tomás   │ Buenas.. │ deliver │ 5d │    │
│           │  │ #TIP-0010 │ Isidora │ Buenas.. │ shipped │ 6d │    │
│           │  └────────────────────────────────────────────────┘    │
│           │                                                        │
│           │  Variante más popular: Niña · Mate · Castaño ondulado  │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

#### Mobile (375px) — sidebar collapsa a hamburger

```
┌─────────────────────────────────┐
│  ☰  Dashboard         Sofi 👤  │
├─────────────────────────────────┤
│                                 │
│  ┌──────────┐ ┌──────────┐     │
│  │ Ventas   │ │ Pedidos  │     │
│  │ Hoy: 2   │ │ Activos:5│     │
│  │ $59.980  │ │ 3 enviar │     │
│  └──────────┘ └──────────┘     │
│  ┌──────────┐ ┌──────────┐     │
│  │ Mes: 14  │ │ Waitlist │     │
│  │ $419.860 │ │ 127      │     │
│  └──────────┘ └──────────┘     │
│                                 │
│  ⚠️ Alertas (2)                 │
│  🔴 #TIP-0005 — 8 días packed  │
│  🟡 #TIP-0012 — 4 días paid    │
│                                 │
│  Últimos pedidos                │
│  #TIP-0014 Mateo   paid   Hoy  │
│  #TIP-0013 Sofía   shipped Ayer│
│  #TIP-0012 Valent. paid   4d   │
│                                 │
└─────────────────────────────────┘
```

---

## 14. Lista de Libros (Admin)

---

### Pantalla: Gestión de Libros

**Ruta:** /admin/libros
**User Stories:** US-032
**Propósito:** Ver y gestionar todos los libros del catálogo
**Llega desde:** Sidebar nav
**Va hacia:** Editor de Libro, Grid de Variantes

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  Mis Libros                    [+ Crear nuevo libro]  │
│  📚 Libros│                                                        │
│  🎨 Gener.│  Filtros: [Todos ▼]  [Edad ▼]                         │
│  📦 Pedidos│                                                       │
│  🏷 Desc. │  ┌──────────────────────────────────────────────────┐  │
│  📧 Suscr.│  │ Título          │Status │Variantes│Motor  │Acc.│  │
│           │  ├──────────────────────────────────────────────────┤  │
│           │  │ Buenas Noches   │🟢 Pub │████░░ 65/80│FLUX Pro│[…]│ │
│           │  │ 2-5 años        │       │ 81%       │       │    │  │
│           │  ├──────────────────────────────────────────────────┤  │
│           │  │ Aventura Mágica │🟡 Draft│░░░░░░ 0/80│FLUX Max│[…]│ │
│           │  │ 4-8 años        │       │ 0%        │       │    │  │
│           │  └──────────────────────────────────────────────────┘  │
│           │                                                        │
│           │  [...] = Editar | Variantes | Pre-generar | Pub/Desp.  │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 15. Editor de Libro (Admin)

---

### Pantalla: Editor del Libro

**Ruta:** /admin/libros/[bookId]/editor
**User Stories:** US-033, US-034, US-035, US-036, US-037
**Propósito:** Configurar todos los aspectos de un libro
**Llega desde:** Lista de Libros
**Va hacia:** Grid de Variantes, Pre-generación

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  ◄ Mis Libros > Buenas Noches                         │
│  📚 Libros│                                                        │
│  🎨 Gener.│  [Info General] [Escenas] [Setting Sheet]              │
│  📦 Pedidos│                                                       │
│  🏷 Desc. │  ━━━━ Tab: Info General ━━━━                           │
│  📧 Suscr.│                                                        │
│           │  Título *                                              │
│           │  [Buenas Noches, {name}_______________]                │
│           │                                                        │
│           │  Slug *             Edad objetivo *                    │
│           │  [buenas-noches]    [2-5 años ▼]                      │
│           │                                                        │
│           │  Descripción                                           │
│           │  [Un cuento para soñar donde tu niño/a...]             │
│           │                                                        │
│           │  Dimensiones (mm)                                      │
│           │  Ancho: [220]   Alto: [180]                            │
│           │                                                        │
│           │  Motor de Generación *                                 │
│           │  [FLUX Kontext Pro ▼] ⭐ Recomendado                   │
│           │  ⚠️ Cambiar motor requiere regenerar variantes pend.   │
│           │                                                        │
│           │  Precio (CLP) *                                        │
│           │  [$29.990]                                             │
│           │                                                        │
│           │  Style Prompt (STYLE_BLOCK)                            │
│           │  ┌──────────────────────────────────────────────┐      │
│           │  │ Watercolor children's book illustration,     │      │
│           │  │ soft palette, warm tones, hand-painted...    │      │
│           │  └──────────────────────────────────────────────┘      │
│           │                                                        │
│           │  Imágenes de referencia                                 │
│           │  [ref1.jpg ✕] [ref2.jpg ✕] [+ Subir]                  │
│           │                                                        │
│           │  [Guardar] [Publicar 🟢] [Vista previa]                │
│           │  Guardado ✓ hace 2 min                                 │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

#### Tab: Escenas

```
┌───────────┬─────────────────────────────────────────────────────────┐
│  Escenas  │                                                         │
│           │  ┌─────────────────────────────────┬────────────────┐   │
│ ≡ 0.Port. │  │ Escena 3: "La luna y las        │ [Preview]      │   │
│ ≡ 1.Esc 1 │  │ estrellas"                       │                │   │
│ ≡ 2.Esc 2 │  │                                  │ [Imagen gen.   │   │
│ ≡ 3.Esc 3◄│  │ Descripción visual (prompt IA):  │  de esta       │   │
│ ≡ 4.Esc 4 │  │ ┌──────────────────────────────┐ │  escena con    │   │
│ ≡ 5.Esc 5 │  │ │ A girl in light blue pajamas │ │  la variante   │   │
│ ≡ 6.Esc 6 │  │ │ with white stars looking at   │ │  base]         │   │
│ ≡ 7.Esc 7 │  │ │ the moon through the window  │ │                │   │
│ ≡ 8.Esc 8 │  │ └──────────────────────────────┘ │                │   │
│ ≡ 9.Esc 9 │  │                                  │                │   │
│ ≡ 10.Final│  │ Texto narrativo (WYSIWYG):       │                │   │
│           │  │ ┌──────────────────────────────┐ │                │   │
│ ≡ = drag  │  │ │ {name} miró por la ventana   │ │                │   │
│   handle  │  │ │ y vio la luna brillar.       │ │                │   │
│           │  │ │ "Buenas noches, luna"        │ │                │   │
│ ● Sin     │  │ └──────────────────────────────┘ │                │   │
│   guardar │  │                                  │                │   │
│           │  │ Personaje: [Izquierda ▼]          │                │   │
│           │  │ Texto pos: [bottom-left ▼]        │                │   │
│           │  │                                  │                │   │
│           │  │ [Guardar escena] [🔄 Regenerar]   │                │   │
│           │  │ Autosave: ✓ Guardado              │                │   │
│           │  └─────────────────────────────────┴────────────────┘   │
└───────────┴─────────────────────────────────────────────────────────┘
```

#### Tab: Setting Sheet

```
┌───────────┬─────────────────────────────────────────────────────────┐
│           │  Setting Sheet — Ambientes del libro                     │
│           │                                                         │
│           │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│           │  │ [Imagen]     │ │ [Imagen]     │ │ [Imagen]     │    │
│           │  │              │ │              │ │              │    │
│           │  │  Frontal     │ │  Lateral     │ │  Detalle     │    │
│           │  │  ✓ Subida    │ │  ✓ Subida    │ │  (vacío)     │    │
│           │  │ [Reemplazar] │ │ [Reemplazar] │ │ [+ Subir]    │    │
│           │  └──────────────┘ └──────────────┘ └──────────────┘    │
│           │                                                         │
│           │  Formatos: PNG, JPG · Máx: 20MB cada una                │
│           │                                                         │
└───────────┴─────────────────────────────────────────────────────────┘
```

---

## 16. Grid de Variantes

---

### Pantalla: Grid de Variantes del Libro

**Ruta:** /admin/libros/[bookId]/variantes
**User Stories:** US-042, US-044
**Propósito:** Vista panorámica de las ~80 variantes con filtros y bulk actions
**Llega desde:** Lista de Libros, Editor de Libro
**Va hacia:** Detalle de Variante

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  ◄ Buenas Noches > Variantes                          │
│  📚 Libros│                                                        │
│  🎨 Gener.│  65/80 aprobadas │ 10 pendientes │ 5 rechazadas       │
│  📦 Pedidos│                                                       │
│  🏷 Desc. │  Filtros: [Género ▼] [Piel ▼] [Pelo ▼] [Status ▼]   │
│  📧 Suscr.│                     [Lentes ▼] [Buscar...]            │
│           │                                                        │
│           │  ☐ Seleccionar todas (filtradas)                       │
│           │                                                        │
│           │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│           │  │☐   │ │☐   │ │☐   │ │☐   │ │☐   │ │☐   │          │
│           │  │[img]│ │[img]│ │[img]│ │[img]│ │[img]│ │[img]│      │
│           │  │🟢  │ │🟢  │ │🟢  │ │🟡  │ │🟡  │ │🔴  │          │
│           │  │♀ Cl│ │♀ Cl│ │♀ Cl│ │♀ Mt│ │♀ Mt│ │♀ Mt│          │
│           │  │Rub │ │Cas │ │Pel │ │Rub │ │Cas │ │Pel │          │
│           │  │Lis │ │Lis │ │Lis │ │Ond │ │Ond │ │Ond │          │
│           │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘          │
│           │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│           │  │... │ │... │ │... │ │... │ │... │ │... │            │
│           │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘          │
│           │                                                        │
│           │  ... (~80 cards total, 6 columnas)                     │
│           │                                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 3 seleccionadas  │  [✅ Aprobar seleccionadas]  [❌ Rechazar] │ │
│  └─────────────────────────────────────────────────────────────┘   │
│  ↑ sticky bottom bar (aparece con selección)                       │
│                                                                    │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 17. Detalle de Variante (11 Páginas)

---

### Pantalla: Revisión de Variante

**Ruta:** /admin/libros/[bookId]/variante/[variantId]
**User Stories:** US-043, US-045
**Propósito:** Revisar las 11 páginas y aprobar/rechazar cada una
**Llega desde:** Grid de Variantes
**Va hacia:** Grid de Variantes (prev/next variante)

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  Info     │  ◄ Variantes > Variante #23                            │
│           │  ♀ Niña · Mate · Castaño ondulado · Sin lentes         │
│  Variante │  Status: 🟡 En revisión   [◄ Prev] [Next ►]           │
│  #23 / 80 │                                                        │
│           │  ┌────────────────────────────────────────────────┐    │
│  Atributos│  │                                                │    │
│  ♀ Niña   │  │  Página 0 — Portada                   🟢 ✅   │    │
│  Mate     │  │  [Imagen grande de portada con                 │    │
│  Castaño  │  │   "Buenas noches, {name}" superpuesto]        │    │
│  Ondulado │  │                                                │    │
│  Sin lent.│  │  [✅ Aprobar] [❌ Rechazar] [🔄 Regenerar]     │    │
│           │  │                                                │    │
│  Seeds:   │  ├────────────────────────────────────────────────┤    │
│  Portrait:│  │                                                │    │
│  42871    │  │  Página 1 — La hora de dormir          🟡 ⏳   │    │
│  CS: 42872│  │  [Imagen grande del spread 1]                  │    │
│           │  │                                                │    │
│  Shortcuts│  │  [✅ Aprobar] [❌ Rechazar] [🔄 Regenerar]     │    │
│  A=Aprobar│  │                                                │    │
│  R=Rechaz.│  ├────────────────────────────────────────────────┤    │
│  N=Next   │  │                                                │    │
│           │  │  Página 2 — El pijama de estrellas     🟢 ✅   │    │
│           │  │  [Imagen grande]                               │    │
│           │  │  ...                                           │    │
│           │  │                                                │    │
│           │  │  (scroll vertical, 11 páginas total)           │    │
│           │  │                                                │    │
│           │  └────────────────────────────────────────────────┘    │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 18. Monitor de Pre-generación

---

### Pantalla: Monitor de Generación

**Ruta:** /admin/generacion
**User Stories:** US-038, US-039, US-040, US-041
**Propósito:** Lanzar y monitorear la generación batch de variantes
**Llega desde:** Lista de Libros, Sidebar
**Va hacia:** Grid de Variantes

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  Pre-generación de Variantes                           │
│  📚 Libros│                                                        │
│  🎨 Gener.│  Libro: [Buenas Noches ▼]                              │
│  📦 Pedidos│                                                       │
│  🏷 Desc. │  ┌────────────────────────────────────────────────┐    │
│  📧 Suscr.│  │ Progreso general:  ████████████░░░░ 65/80      │    │
│           │  │ Tiempo restante: ~45 minutos                   │    │
│           │  │ Estado: Generando...                            │    │
│           │  └────────────────────────────────────────────────┘    │
│           │                                                        │
│           │  [★ Generar todas las variantes]                       │
│           │  [🔄 Reintentar fallidas (5)]                          │
│           │                                                        │
│           │  ┌────────────────────────────────────────────────┐    │
│           │  │ Variante │ Status      │ Progreso        │ Acc │   │
│           │  ├────────────────────────────────────────────────┤    │
│           │  │ #01 ♀ClRuLi │ ✅ generated │ 11/11 páginas │     │   │
│           │  │ #02 ♀ClRuOn │ ✅ generated │ 11/11 páginas │     │   │
│           │  │ #03 ♀ClCaLi │ 🔄 generating│ 7/11 páginas  │     │   │
│           │  │ #04 ♀ClCaOn │ ⏳ pending   │ —             │     │   │
│           │  │ #05 ♀ClPeLi │ ❌ failed    │ 3/11 (error)  │ [🔄]│  │
│           │  │ ...         │             │               │     │   │
│           │  └────────────────────────────────────────────────┘    │
│           │                                                        │
│           │  ━━ Generar variante individual ━━                     │
│           │  Género [▼] Piel [▼] Pelo [▼] Tipo [▼] Lentes [▼]    │
│           │  [Generar esta variante]                               │
│           │                                                        │
│           │  Log en tiempo real:                                    │
│           │  ┌────────────────────────────────────────────────┐    │
│           │  │ 14:32:15 — Variante #03: Generando página 8   │    │
│           │  │ 14:32:01 — Variante #05: fal.ai timeout (3/3) │    │
│           │  │ 14:31:45 — Variante #02: Completada ✅          │    │
│           │  └────────────────────────────────────────────────┘    │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 19. Lista de Pedidos

---

### Pantalla: Gestión de Pedidos

**Ruta:** /admin/pedidos
**User Stories:** US-046
**Propósito:** Ver y filtrar todos los pedidos
**Llega desde:** Dashboard, Sidebar
**Va hacia:** Detalle de Pedido

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  Pedidos     5 en proceso │ 3 enviados │ 12 entregados│
│  📚 Libros│                                                        │
│  🎨 Gener.│  Filtros: [Estado ▼] [Fecha ▼] [Libro ▼]              │
│  📦 Pedidos│ Buscar: [__nombre, email, #pedido__]                  │
│  🏷 Desc. │                                                        │
│  📧 Suscr.│  ┌──────────────────────────────────────────────────┐  │
│           │  │ ID        │Niño/a │Libro    │Estado  │Fecha│Monto│  │
│           │  ├──────────────────────────────────────────────────┤  │
│           │  │ TIP-0014  │Mateo  │B.Noches │🔵 paid │Hoy │$29k│  │
│           │  │ TIP-0013  │Sofía  │B.Noches │🟢 ship │Ayer│$24k│  │
│           │  │ TIP-0012🟡│Valen. │B.Noches │🔵 paid │4d  │$30k│  │
│           │  │ TIP-0011  │Tomás  │B.Noches │✅ deliv │5d  │$30k│  │
│           │  │ TIP-0010  │Isido. │B.Noches │🟢 ship │6d  │$24k│  │
│           │  │ TIP-0009  │Emma   │B.Noches │✅ deliv │8d  │$30k│  │
│           │  │ ...       │       │         │        │    │     │  │
│           │  └──────────────────────────────────────────────────┘  │
│           │                                        Pág 1 de 2 ► │  │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 20. Detalle de Pedido

---

### Pantalla: Detalle del Pedido

**Ruta:** /admin/pedidos/[orderId]
**User Stories:** US-047, US-048
**Propósito:** Ver todo sobre un pedido y gestionar su fulfillment
**Llega desde:** Lista de Pedidos, Dashboard alertas
**Va hacia:** Lista de Pedidos

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  ◄ Pedidos > #TIP-2024-0014                           │
│  📚 Libros│                                                        │
│  🎨 Gener.│  Timeline:                                             │
│  📦 Pedidos│ ●paid → ●composing → ○print → ○qa → ○pack → ○ship   │
│  🏷 Desc. │  Feb 25      Feb 25                                   │
│  📧 Suscr.│                                                        │
│           │  ┌─────────────────────┬──────────────────────────┐    │
│           │  │ Comprador           │ Libro                    │    │
│           │  │ María García        │ Buenas Noches, Mateo     │    │
│           │  │ maria@email.com     │ [portrait thumb]         │    │
│           │  │ +56 9 1234 5678     │ ♂ Niño · Mate · Castaño │    │
│           │  │                     │ Ondulado · Sin lentes    │    │
│           │  ├─────────────────────┤                          │    │
│           │  │ Dirección           │ Dedicatoria:             │    │
│           │  │ Av. Providencia 123 │ "Para mi Mateo, que      │    │
│           │  │ Santiago, RM        │  sueñes con estrellas"   │    │
│           │  │ Chile               │                          │    │
│           │  └─────────────────────┴──────────────────────────┘    │
│           │                                                        │
│           │  Pago: $23.992 CLP via Flow.cl (TIPITI20: -$5.998)     │
│           │  PDF: [📄 Descargar PDF de impresión]                  │
│           │                                                        │
│           │  Estado actual: [composing ▼ → Cambiar a...]          │
│           │  Tracking: [___________________] (al marcar shipped)  │
│           │                                                        │
│           │  [ ★ Marcar como enviado ★ ]                           │
│           │  [ 📧 Enviar email manual... ]                         │
│           │                                                        │
│           │  Historial:                                             │
│           │  Feb 25 14:30 — paid (webhook Flow.cl)                 │
│           │  Feb 25 14:31 — composing (auto: PDF generándose)      │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 21. Gestión de Descuentos

---

### Pantalla: Códigos de Descuento

**Ruta:** /admin/descuentos
**User Stories:** US-051
**Propósito:** CRUD de códigos de descuento
**Llega desde:** Sidebar
**Va hacia:** (inline actions)

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  Códigos de Descuento            [+ Crear código]     │
│  📚 Libros│                                                        │
│  🎨 Gener.│  ┌──────────────────────────────────────────────────┐  │
│  📦 Pedidos│ │ Código   │Tipo │Valor│Usos   │Expira│Activo│Acc.│  │
│  🏷 Desc. │ ├──────────────────────────────────────────────────┤  │
│  📧 Suscr.│ │ TIPITI20 │ %   │ 20% │ 23/50 │ —    │ 🟢   │[…]│  │
│           │ │ AMIGOS   │ $   │$5k  │ 5/∞   │Mar 1 │ 🟢   │[…]│  │
│           │ │ VERANO25 │ %   │ 25% │50/50  │ Exp. │ ⚫   │[…]│  │
│           │ └──────────────────────────────────────────────────┘  │
│           │                                                        │
│           │  [...] = Editar | Activar/Desactivar | Ver historial   │
│           │                                                        │
│           │  ━━ Crear nuevo código ━━                              │
│           │  Código: [____________] o [Auto-generar]               │
│           │  Tipo:  ○ Porcentaje  ○ Monto fijo                    │
│           │  Valor: [______]                                       │
│           │  Max usos: [______] (vacío = ilimitado)                │
│           │  Expiración: [____/____/____] (vacío = sin exp.)       │
│           │  [Crear código]                                        │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 22. Lista de Suscriptores

---

### Pantalla: Gestión de Suscriptores

**Ruta:** /admin/suscriptores
**User Stories:** US-027, US-028
**Propósito:** Ver, filtrar y exportar lista de emails
**Llega desde:** Sidebar
**Va hacia:** (inline actions)

#### Desktop (1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│  Tipiti Books Admin                              Sofi 👤 [Salir]  │
├───────────┬────────────────────────────────────────────────────────┤
│           │                                                        │
│  📊 Dash  │  Suscriptores (127 activos)        [📥 Exportar CSV]  │
│  📚 Libros│                                                        │
│  🎨 Gener.│  Filtros: [Source ▼] [Estado ▼] [Fecha ▼]             │
│  📦 Pedidos│ Buscar: [____email____]                               │
│  🏷 Desc. │                                                        │
│  📧 Suscr.│  ┌──────────────────────────────────────────────────┐  │
│           │  │ Email              │Source     │Fecha   │Estado  │  │
│           │  ├──────────────────────────────────────────────────┤  │
│           │  │ ana@email.com      │waitlist   │Feb 20  │🟢 Act │  │
│           │  │ pedro@email.com    │post_purch │Feb 22  │🟢 Act │  │
│           │  │ lucia@email.com    │waitlist   │Feb 18  │⭐ Conv│  │
│           │  │ ...                │           │        │       │  │
│           │  └──────────────────────────────────────────────────┘  │
│           │                                        Pág 1 de 7 ► │  │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

---

# ESTADOS ESPECIALES

---

## 23. Error 404

---

### Pantalla: Página No Encontrada

**Ruta:** /404
**User Stories:** US-056
**Propósito:** Informar amigablemente que la URL no existe

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  Tipiti Books                    │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │  [Ilustración acuarela      ││
│  │   estilo Tipiti — personaje ││
│  │   perdido buscando algo]    ││
│  └─────────────────────────────┘│
│                                 │
│  ¡Ups! Esta página              │
│  no existe                      │
│                                 │
│  Parece que te perdiste         │
│  en el cuento equivocado.       │
│                                 │
│  [ Volver al inicio ]           │
│  (Ver catálogo)                │
│                                 │
└─────────────────────────────────┘
```

---

## 24. Error 500

---

### Pantalla: Error del Servidor

**Ruta:** /500
**User Stories:** US-056
**Propósito:** Informar error sin mostrar datos técnicos

#### Mobile (375px)

```
┌─────────────────────────────────┐
│  Tipiti Books                    │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │  [Ilustración acuarela      ││
│  │   — personaje sorprendido]  ││
│  └─────────────────────────────┘│
│                                 │
│  Algo salió mal                 │
│                                 │
│  Estamos trabajando para        │
│  solucionarlo. Intenta          │
│  de nuevo en unos minutos.      │
│                                 │
│  [ Volver al inicio ]           │
│  [ Reintentar ]                │
│                                 │
└─────────────────────────────────┘
```

---

## 25. Empty State: Catálogo Vacío

```
┌─────────────────────────────────┐
│  Tipiti Books                    │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │  [Ilustración — personaje   ││
│  │   pintando un libro]        ││
│  └─────────────────────────────┘│
│                                 │
│  Estamos preparando             │
│  algo especial                  │
│                                 │
│  Nuestros libros están casi     │
│  listos. ¡Vuelve pronto!       │
│                                 │
│  [ Unirme a la waitlist ]       │
│                                 │
└─────────────────────────────────┘
```

---

## 26. Empty State: Admin Sin Pedidos

```
┌───────────┬────────────────────────────────────────────────────────┐
│           │                                                        │
│  Sidebar  │  ┌────────────────────────────────────────────────┐    │
│  ...      │  │  [Ilustración — caja vacía con confetti]       │    │
│           │  │                                                │    │
│           │  │  No hay pedidos aún                            │    │
│           │  │  ¡Los primeros están por llegar!               │    │
│           │  │                                                │    │
│           │  │  Mientras tanto, asegúrate de que tu libro     │    │
│           │  │  tenga variantes aprobadas.                    │    │
│           │  │                                                │    │
│           │  │  [ Ver mis libros ]                            │    │
│           │  └────────────────────────────────────────────────┘    │
│           │                                                        │
└───────────┴────────────────────────────────────────────────────────┘
```

---

## 27. Modal: Confirmación de Pre-generación

```
┌────────────────────────────────────────────┐
│                                            │
│  ⚠️ Confirmar pre-generación               │
│                                            │
│  Esto generará ~80 variantes              │
│  (~880 imágenes) para "Buenas Noches".    │
│                                            │
│  Costo estimado: ~$35-100 USD             │
│  Tiempo estimado: ~2-4 horas              │
│                                            │
│  Requisitos verificados:                   │
│  ✅ Escenas definidas (11)                 │
│  ✅ Setting sheet subido                   │
│  ✅ Style prompt configurado               │
│                                            │
│  [Cancelar]  [★ Iniciar generación ★]     │
│                                            │
└────────────────────────────────────────────┘
```

---

## 28. Modal: Aprobar/Rechazar Variante

```
┌────────────────────────────────────────────┐
│                                            │
│  ❌ Rechazar variante #23                   │
│                                            │
│  ♀ Niña · Mate · Castaño ondulado         │
│                                            │
│  Motivo (opcional):                        │
│  [______________________________]          │
│                                            │
│  Nota: La variante quedará marcada         │
│  como "rechazada" y podrá ser              │
│  regenerada después.                       │
│                                            │
│  [Cancelar]  [Rechazar variante]           │
│                                            │
└────────────────────────────────────────────┘
```

---

---

## Resumen de Interacciones

| Desde | Acción | Hacia |
|-------|--------|-------|
| Landing | Click "Crea tu libro" | Catálogo |
| Landing | Submit email waitlist | Confirmación inline |
| Catálogo | Click libro card | Detalle Libro |
| Detalle | Click "Personalizar" | Wizard Paso 1 |
| Wizard 1 | Submit nombre | Wizard Paso 2 |
| Wizard 2 | Seleccionar apariencia + Next | Wizard Paso 3 |
| Wizard 3 | Escribir dedicatoria + Next | Wizard Paso 4 |
| Wizard 4 | Click "Ver mi libro" | Preview Page-Flip |
| Preview | Click "Comprar" | Checkout |
| Checkout | Submit form + pagar Flow.cl | Success o Failure |
| Checkout | Submit form + pagar MercadoPago | Success o Failure (redirect) |
| Success | Click "Volver al inicio" | Landing |
| Failure | Click "Reintentar" | Checkout (datos preservados) |
| Admin Login | Submit credentials | Dashboard |
| Dashboard | Click alerta | Detalle Pedido |
| Dashboard | Click pedido reciente | Detalle Pedido |
| Sidebar | Click sección | Pantalla correspondiente |
| Lista Libros | Click libro | Editor Libro |
| Editor | Click "Pre-generar" | Monitor Generación (+ modal confirm) |
| Grid Variantes | Click variante | Detalle Variante |
| Detalle Variante | Aprobar todas las páginas | Variante → approved |
| Detalle Variante | Rechazar página | Modal rechazo |
| Detalle Variante | Regenerar página | Re-queue + refresh |
| Lista Pedidos | Click pedido | Detalle Pedido |
| Detalle Pedido | Cambiar estado | Update + email trigger |

---

## Mapping User Stories → Pantallas

| User Story | Pantalla(s) |
|-----------|-------------|
| US-001 | Landing (Hero) |
| US-002 | Landing (Historia Sofi) |
| US-003 | Landing (Cómo Funciona + Galería) |
| US-004 | Landing (Waitlist) |
| US-005 | Catálogo |
| US-006 | Detalle Libro |
| US-007 | Detalle Libro (share) |
| US-008 | Wizard Paso 1 |
| US-009 | Wizard Paso 2 (género) |
| US-010 | Wizard Paso 2 (apariencia grid) |
| US-011 | Wizard Paso 3 |
| US-012 | Wizard Paso 4 |
| US-013 | Wizard (stepper + navegación) |
| US-014 | Preview Page-Flip |
| US-015 | Preview (CTA compra) |
| US-016 | Preview (compartir) |
| US-017 | Checkout (formulario envío) |
| US-018 | Checkout (código descuento) |
| US-019 | Checkout (Flow.cl) |
| US-020 | Checkout (MercadoPago) |
| US-021 | Confirmación Success |
| US-022 | Pago Fallido |
| US-023 | (Email — no tiene pantalla, es trigger) |
| US-024 | (Email — trigger) |
| US-025 | (Email — trigger) |
| US-026 | Confirmación Success (checkbox newsletter) |
| US-027 | Admin Suscriptores |
| US-028 | Admin Suscriptores (export CSV) |
| US-029 | Admin Login |
| US-030 | (Middleware — no tiene pantalla propia) |
| US-031 | Admin Sidebar/Header (botón logout) |
| US-032 | Admin Lista Libros |
| US-033 | Admin Editor Libro (Info General) |
| US-034 | Admin Editor Libro (Tab Escenas) |
| US-035 | Admin Editor Libro (Drag & Drop escenas) |
| US-036 | Admin Editor Libro (Tab Setting Sheet) |
| US-037 | Admin Editor Libro (Motor IA dropdown) |
| US-038 | Admin Monitor Generación (lanzar) |
| US-039 | Admin Monitor Generación (progreso) |
| US-040 | Admin Monitor + Detalle Variante (regenerar) |
| US-041 | Admin Monitor Generación (form individual) |
| US-042 | Admin Grid Variantes |
| US-043 | Admin Detalle Variante |
| US-044 | Admin Grid Variantes (bulk actions) |
| US-045 | Admin Detalle Variante (side-by-side) |
| US-046 | Admin Lista Pedidos |
| US-047 | Admin Detalle Pedido |
| US-048 | (Sistema — PDF auto-compose, visible en Detalle Pedido) |
| US-049 | Admin Dashboard |
| US-050 | Admin Dashboard (alertas) |
| US-051 | Admin Descuentos |
| US-052 | (API — no tiene pantalla, es endpoint) |
| US-053 | (Sistema — lógica de descuento en orden) |
| US-054 | (Non-functional — performance) |
| US-055 | (Non-functional — SEO meta tags) |
| US-056 | Error 404, Error 500 |

**Cobertura: 56/56 User Stories mapeados.** Todos los stories con UI tienen wireframe. Los stories de sistema/API/email están identificados como "sin pantalla propia".

---

*Wireframes generados con Claude para Tipiti Books*
*Pendiente aprobación antes de avanzar al Skill #5 (UI Prompts)*
