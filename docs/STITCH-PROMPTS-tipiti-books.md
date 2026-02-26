# Tipiti Books — Stitch Prompts

> **Versión**: 1.0
> **Estado**: COMPLETO
> **Fecha**: 2026-02-25
> **PDR**: PDR-tipiti-books.md v3.0
> **Tech Spec**: TECH-SPEC-tipiti-books.md v2.0
> **User Stories**: USER-STORIES-tipiti-books.md v1.0
> **Wireframes**: WIREFRAMES-tipiti-books.md v1.0
> **Total Prompts**: 18 pantallas (11 storefront + 7 admin)
> **Stitch URL**: https://stitch.withgoogle.com

---

## Design Thinking — Tipiti Books

### 1. PROPÓSITO

Tipiti Books es una tienda web chilena de libros infantiles personalizados con ilustraciones acuarela pintadas a mano. El comprador (padres, abuelos, tíos — 25-45 años) configura un personaje que se parece al niño/a destinatario y recibe un libro impreso premium como regalo. La experiencia debe sentirse como entrar a una librería artesanal cálida, no como navegar un e-commerce más.

### 2. TONO ESTÉTICO — Dirección BOLD

**"Librería artesanal de acuarela"** — Un híbrido entre Organic/Natural y Editorial/Magazine.

Imagina una librería boutique para niños en un barrio bohemio de Santiago: estantes de madera clara, ilustraciones acuarela enmarcadas en las paredes, luz cálida de lámparas, papel texturado en todas partes. El sitio web debe sentirse así — cálido, táctil, con texturas visibles de papel acuarela, tipografía con personalidad de cuento, y colores pastel que abrazan.

**NO es:** minimalismo tech frío, e-commerce genérico, "moderno y limpio", Shopify template, gradientes morados, dashboard SaaS.

### 3. DIFERENCIADOR

La textura de papel acuarela como fondo base de TODO el sitio. Cada sección se siente como una página de un libro ilustrado. Los botones tienen bordes suaves como pinceladas. Las cards tienen sombras cálidas coloreadas (no grises). Las transiciones son como pasar páginas de un cuento.

### 4. ANTI-PATTERNS

```
✗ Inter/Roboto/Arial como fuente principal
✗ Gradiente morado sobre blanco
✗ Blue #3B82F6 como primario
✗ Cards con shadow-md gris genéricas
✗ Fondo blanco puro (#FFFFFF)
✗ Layout de e-commerce genérico (Shopify vibes)
✗ Colores primarios saturados (rojo puro, azul eléctrico)
✗ Estética 3D/Pixar/plástica
```

---

## Instrucciones de Uso

1. Abrir https://stitch.withgoogle.com
2. Seleccionar modo: Standard (rápido) o Experimental (más detallado)
3. Seleccionar medium: **Web**
4. Para cada prompt:
   a. Copiar el prompt completo (incluyendo Design System)
   b. Opcionalmente subir el wireframe ASCII como screenshot
   c. Generar
   d. Revisar y aplicar refinamientos si es necesario
   e. **Guardar screenshot** antes de pasar a la siguiente pantalla
5. Exportar a Figma o código HTML/CSS cuando estés satisfecho

**Orden de generación recomendado:**
1. Landing Page (establece el look & feel completo)
2. Detalle del Libro (consolida cards y galería)
3. Wizard Configurador (define forms e interacciones)
4. Preview Page-Flip (el WOW moment)
5. Checkout + Success/Failure
6. Admin Login → Dashboard → resto del admin

---

## Design System Prompt

**(Copiar este bloque COMPLETO al inicio de CADA prompt en Stitch)**

```
DESIGN SYSTEM — Tipiti Books

Dirección Estética:
- Tono: "Librería artesanal de acuarela" — Organic/Natural meets Editorial infantil premium
- Personalidad: Cálido, tierno, artesanal, premium pero accesible
- Referencia visual: "Oliver Jeffers meets Rifle Paper Co. — como producto web"
- La UI debe sentirse como las páginas de un libro infantil ilustrado a mano

Paleta de Color:
- Color dominante: Crema cálido #FBF7F0 (como papel acuarela real) — FONDO de todo el sitio
- Color de acento principal: Terracota suave #C47D5A — CTAs, botones primarios, highlights
- Color de acento secundario: Verde salvia #8BA888 — badges, confirmaciones, estados activos
- Color emocional: Rosa viejo #D4A0A0 — detalles de ternura, bordes de cards, hover states
- Color de contraste: Azul empolvado #7B9DB7 — links, info, elementos de confianza
- Colores semánticos: Success #8BA888, Error #C47D5A (más oscuro: #A85D3F), Warning #D4A06B, Info #7B9DB7
- Neutrales: #FBF7F0 (fondo crema), #F0E8DC (fondo cards), #D4C5B0 (bordes suaves), #8B7E6A (texto secundario), #4A3F35 (texto principal — marrón cálido, NUNCA negro puro)
- Jerarquía: El crema domina todo. El terracota sorprende en CTAs. El verde confirma. El rosa acaricia.

Tipografía:
- Display/Headings: "Fraunces" (Google Fonts) — serif orgánico con personalidad de cuento infantil
  → Variable weight 600-800, optical size auto
  → Soft, con curvas y terminaciones suaves — perfecta para "Tipiti Books"
  → POR QUÉ: Serif warm que dice "libro infantil premium" sin ser anticuado ni genérico
- Body: "DM Sans" (Google Fonts) — sans-serif friendly y redondeada
  → 400/500 weight, 16px, line-height 1.6
  → POR QUÉ: Complementa Fraunces sin competir, legible en mobile, amigable
- Accent/Handwritten: "Caveat" (Google Fonts) — para dedicatorias, quotes, detalles especiales
  → Solo en elementos puntuales: dedicatoria preview, "hecho con amor", quotes de Sofi
- PROHIBIDO: Inter, Roboto, Arial, system-ui, Space Grotesk como fuente principal

Componentes con Personalidad:
- Botones primarios: #C47D5A (terracota), text #FBF7F0, border-radius 24px (pill suave),
  padding 14px 32px, font DM Sans 500, hover: darken 10% + shadow 0 4px 16px rgba(196,125,90,0.3)
  → Botones como pinceladas suaves — pill shape, cálidos, invitan a tocar
- Botones secundarios: transparent bg, border 1.5px #C47D5A, text #C47D5A, border-radius 24px,
  hover: fill #C47D5A + text #FBF7F0
- Cards: fondo #FFFFFF o #FBF7F0, border-radius 16px, border 1px solid #E8DDD0,
  box-shadow: 0 4px 20px rgba(196,125,90,0.08) (sombra cálida terracota, NO gris),
  hover: translate-y -4px + shadow intensifies
  → Cards que se sienten como páginas sueltas de un libro
- Inputs: border 1.5px solid #D4C5B0, border-radius 12px, fondo #FFFFFF,
  focus: border-color #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.15),
  placeholder color #B5A899, height 48px, padding 12px 16px
  → Inputs suaves, esquinas redondeadas, warmth en el focus
- Icons: Lucide icons, strokeWidth 1.5, 20px, color #8B7E6A
  → Líneas finas, orgánicas, no agresivas
- Badges: pill shape, padding 4px 12px, border-radius 100px,
  Success: bg #8BA888/15 text #6B8B6A, Info: bg #7B9DB7/15 text #5A7B97,
  Warning: bg #D4A06B/15 text #B58045

Layout & Composición:
- Desktop: max-width 1200px centrado, spacing generoso 32-48px entre secciones
- Mobile: single-column, padding 20px, bottom sticky bar para CTAs
- Hero sections: full-width con ilustración acuarela de fondo, texto superpuesto
- Grid de productos: 2-3 columnas desktop, 1 columna mobile
- Sections separadas por thin line #E8DDD0 o espacio generoso (NO borders duros)

Detalles de Atmósfera (lo que diferencia de "AI slop"):
- Fondo global: #FBF7F0 crema con textura de papel acuarela MUY sutil (noise 3-5% opacity)
- Sombras: SIEMPRE cálidas (rgba terracota o rosa), NUNCA grises puras
- Bordes: Suaves, delgados, color #E8DDD0 (no gris frío)
- Separadores: thin line #E8DDD0 con pequeña ilustración acuarela centrada (estrellita, hojita)
- Header: semi-transparente con backdrop-blur, fondo crema 90% opacity
- Ilustraciones spot: Pequeñas acuarelas decorativas — estrellas, lunas, peluches, pinceladas
  sueltas — como si el ilustrador dejó marcas en la interfaz
- Progress steps (wizard): dots conectados con línea ondulada (no recta)
- Hover states: suaves, translate-y small + shadow warm — como si la card "respirara"
- Scroll suave entre secciones con easing natural

Reglas Obligatorias:
- NO usar dark mode. Light theme crema SIEMPRE.
- NO cambiar la estructura del header/nav entre pantallas
- Mantener EXACTAMENTE los mismos colores, fuentes y estilos en todas las pantallas
- Fondo NUNCA es blanco puro (#FFFFFF) — siempre crema #FBF7F0
- Texto NUNCA es negro puro (#000000) — siempre marrón cálido #4A3F35
- Idioma de la interfaz: Español (Chile)
- Si el resultado se ve "genérico" o "como template de Shopify", REESCRIBIR el prompt
```

---

---

# STOREFRONT — Prompts

---

## Prompt 1 de 18: Landing Page

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books es una tienda web chilena de libros infantiles personalizados con ilustraciones acuarela pintadas a mano. Los compradores (padres, abuelos, tíos de 25-45 años) configuran un personaje que se parece al niño/a y reciben un libro impreso premium como regalo. Precio: ~$29.990 CLP (~$40 USD).

PANTALLA A DISEÑAR (Zoom-In):
Diseña la Landing Page completa — ruta: /

Propósito: Enamorar al visitante en 5 segundos, contar la historia de la marca, mostrar cómo funciona, y capturar emails para la waitlist.
Es la primera pantalla que ve cualquier visitante.
Va hacia: Catálogo de libros, o confirmación de waitlist.

Componentes necesarios (en orden vertical):

1. HEADER (sticky, semi-transparente con backdrop-blur sobre fondo crema):
   - Logo "Tipiti Books" en Fraunces 700, color #4A3F35, tamaño 24px
   - Nav horizontal (desktop): "Catálogo" "Nuestra Historia" — en DM Sans 500, 16px, color #4A3F35
   - CTA en header: botón pill terracota "Crea tu libro" (padding 12px 28px, border-radius 24px)
   - Mobile: hamburger menu con ícono Lucide Menu 24px, color #4A3F35
   - Altura header: 80px
   - Spacing: padding 20px horizontal

2. HERO SECTION (full viewport height, min 600px):
   - Layout asimétrico 45/55: texto izquierda, ilustración derecha
   - Headline en Fraunces 800, 48px (mobile 32px), color #4A3F35, line-height 1.3:
     "Un libro donde Sofía es la protagonista"
   - Subheadline en DM Sans 400, 18px (mobile 16px), color #8B7E6A, line-height 1.6:
     "Ilustraciones a mano, personalizadas con amor. Desde $40 USD."
   - CTA primario: botón pill terracota grande "Crea tu libro" con ícono Lucide Sparkles 20px,
     padding 16px 40px, font DM Sans 500 18px, hover: translate-y -2px + shadow 0 8px 24px rgba(196,125,90,0.3)
   - CTA secundario: link "Ver ejemplos ↓" en DM Sans 400 16px, color #7B9DB7, con subtle hover underline
   - Derecha: placeholder rectangular (55% width) con rounded corners 16px, fondo rosa viejo #D4A0A0/20,
     con SVG watercolor illustration placeholder (niña leyendo con mamá, estilo Oliver Jeffers)
   - Fondo: crema #FBF7F0 con manchas de acuarela decorativas muy sutiles en las esquinas (opacity 5-10%)
   - Padding: 60px (desktop), 40px mobile
   - Mobile: stack vertical, hero imagen 300px height

3. SECCIÓN "NUESTRA HISTORIA" (80% width centered, padding 60px 0):
   - Separador sutil: thin line #E8DDD0 arriba con pequeña acuarela decorativa (estrellita) centrada
   - Layout 2 columnas (desktop): imagen izquierda (40%), texto derecha (60%)
   - Imagen: placeholder 300×300px, border-radius 12px, fondo #D4A0A0/15
   - Headline: "Nuestra Historia" en Fraunces 700 36px, color #4A3F35, margin-bottom 24px
   - Texto en DM Sans 400 16px, color #4A3F35, line-height 1.8, max-width 500px:
     "Soy Sofi, mamá de una niña que amaba los cuentos antes de dormir. Quise un libro donde ella fuera la protagonista, donde viera su nombre en cada página. Así nació Tipiti Books — libros personalizados ilustrados a mano, con la calidad premium que los niños merecen."
   - Subtext: "Artesanía · Calidad · Amor" en Fraunces 600 14px, color #8B7E6A, margin-top 20px
   - Mobile: stack vertical, imagen 250×250px, texto full width

4. SECCIÓN "CÓMO FUNCIONA" (80% width centered, padding 60px 0):
   - Separador sutil: thin line #E8DDD0 arriba
   - Headline: "Cómo Funciona" en Fraunces 700 36px, color #4A3F35, text-align center, margin-bottom 48px
   - Grid 3 columnas (desktop): cada columna 320px
   - Card estructura para cada paso (padding 32px, border-radius 16px, bg #F0E8DC, border 1px #E8DDD0):
     * Ícono Lucide (Palette/Wand2/Package) 48px, color #C47D5A, margin-bottom 16px
     * Número círculo: "1" en Fraunces 800 28px, bg terracota #C47D5A, color crema, width 56px, height 56px, border-radius 50%
     * Título en DM Sans 600 18px, color #4A3F35: "Elige el libro y personaliza"
     * Descripción en DM Sans 400 16px, color #8B7E6A: "Selecciona nombre, apariencia y dedicatoria"
   - Pasos:
     (1) "Elige el libro y personaliza" → "Selecciona nombre, apariencia y dedicatoria"
     (2) "Nosotros generamos tu libro" → "Con IA + ilustraciones de artista"
     (3) "Recibes en casa" → "Impresión premium, listo para regalar"
   - Mobile: 1 columna, cards 100% width, margin-bottom 24px

5. GALERÍA CAROUSEL (80% width centered, padding 60px 0):
   - Separador sutil: thin line #E8DDD0 arriba
   - Headline: "Busca al osito en cada página" en Fraunces 700 32px, color #4A3F35, text-align center, margin-bottom 32px
   - Carrusel horizontal: 6 spread images (placeholder rectangles 600×400px, aspect-ratio 3/2)
   - Border-radius 12px, box-shadow 0 4px 20px rgba(196,125,90,0.08)
   - Navigation: ◄ arrow (left) — dot indicators (6 dots, active filled terracota) — ► arrow (right)
   - Mobile: swipe gesture, dots indicator siempre visible, image width 100%, height auto
   - Dots: size 12px, spacing 8px, color #D4C5B0, active color #C47D5A

6. SECCIÓN WAITLIST (80% width centered, padding 80px 0, bg #F0E8DC, border-radius 20px, border 1px #E8DDD0):
   - Headline: "Sé de los primeros" en Fraunces 700 36px, color #4A3F35, text-align center, margin-bottom 12px
   - Subtext: "Primeros 50 compradores reciben TIPITI20: 20% off" en DM Sans 400 16px, color #8B7E6A, margin-bottom 32px
   - Email input: width 300px (desktop), 100% (mobile), height 48px, border 1.5px #D4C5B0, border-radius 12px,
     padding 12px 16px, placeholder "tu@email.com", focus: border #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.15)
   - Submit button: "Quiero mi libro" terracota pill, 280px width (desktop), 100% (mobile)
   - Layout: flex column center, spacing 16px entre input y button
   - Mobile: full width, padding 40px 20px

7. FOOTER (bg #FBF7F0, border-top 1px #E8DDD0, padding 40px 0):
   - Separador: thin line #E8DDD0 arriba
   - Layout centrado: DM Sans 400 14px, color #8B7E6A
   - Contenido:
     "Tipiti Books · Chile 🇨🇱"
     "hola@tipitibooks.com"
   - Links sociales si aplica (opcional)
   - Copyright: © 2026 Tipiti Books
```

### Refinamientos sugeridos:

- Si la hero illustration se ve genérica, pedir "watercolor style illustration with warm terracotta and sage green tones"
- Si los cards parecen planos, agregar "subtle shadow warmth and micro-hover animation"
- Si el carrusel no tiene dots o arrows claros, especificar iconografía Lucide (ChevronLeft, ChevronRight, Circle)
- Mobile responsive: verificar que hero stack correctamente, botones 100% width, padding consistente 20px
- Animación entrance: fade-in suave en cada sección al scroll (easing: ease-out)

---

## Prompt 2 de 18: Catálogo de Libros

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books es una tienda web chilena de libros infantiles personalizados. Los compradores seleccionan libros disponibles para personalizar.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la página de Catálogo — ruta: /catalogo

Propósito: Mostrar todos los libros disponibles en un grid, con portadas acuarela y CTAs claras para personalizar.
Llega desde: Landing Page, Nav
Va hacia: Detalle del Libro

Componentes necesarios (en orden vertical):

1. HEADER (idéntico a Landing Page):
   - Logo "Tipiti Books" Fraunces 700 24px, color #4A3F35
   - Nav: "Catálogo" (active underline terracota), "Nuestra Historia"
   - CTA: "Crea tu libro" terracota pill
   - Mobile: hamburger menu
   - Altura 80px, sticky

2. BREADCRUMB (desktop solo, padding 20px horizontally, below header):
   - DM Sans 400 14px, color #8B7E6A: "Inicio > Catálogo"
   - Si en detalle: "Inicio > Catálogo > Buenas Noches, {nombre}"

3. PAGE HEADING (80% width centered, padding 40px top):
   - "Nuestros Libros" en Fraunces 700 44px, color #4A3F35, margin-bottom 8px
   - Subheading: "Elige tu favorito y personaliza" en DM Sans 400 16px, color #8B7E6A

4. GRID DE LIBROS (80% width centered, padding 40px 0):
   - Desktop: grid 3 columnas, gap 32px
   - Mobile: grid 1 columna, gap 24px
   - Cada card estructura (border-radius 16px, border 1px #E8DDD0, bg #FFFFFF, overflow hidden):

     a) Portada imagen (aspect-ratio 3/4, width 100%, height auto):
        - Placeholder rectangular con rounded-top 16px
        - Watercolor illustration de portada del libro
        - Hover effect: slight scale (1.05) + shadow intensifies

     b) Card content (padding 20px):
        - Título en Fraunces 600 20px, color #4A3F35: "Buenas Noches, {nombre}"
        - Edad en DM Sans 400 14px, color #8B7E6A: "2-5 años · 20 páginas"
        - Precio en Fraunces 700 24px, color #C47D5A, margin 12px 0: "$29.990 CLP"
        - CTA button: "Personalizar" terracota pill, width 100%, padding 12px, DM Sans 500
        - Hover: translate-y -2px + shadow glow

   - Estados:
     * Disponible: como arriba, CTA "Personalizar" habilitado, navega a /libro/[slug]
     * Próximamente: portada gris #D4C5B0, overlay "Próximamente" en Fraunces 600 18px blanco,
       CTA "Avisame cuando esté listo" secundario, navega a popup waitlist

5. EMPTY STATE (si no hay libros):
   - Centered card, padding 80px 40px
   - Ícono Lucide BookOpen 64px, color #C47D5A/30, margin-bottom 24px
   - Headline: "Estamos preparando algo especial" en Fraunces 700 28px, color #4A3F35
   - Texto: "Nuestros libros estarán listos pronto. ¡Únete a la waitlist para ser de los primeros!"
     en DM Sans 400 16px, color #8B7E6A, max-width 400px
   - CTA: "Unirme a la waitlist" secundario button

6. FOOTER (idéntico a Landing)
```

### Refinamientos sugeridos:

- Verificar que portadas tengan aspect-ratio 3/4 correcto
- Agregar shimmer loading skeleton si se desea
- En mobile, verificar que cards no sean muy anchas (100% width)
- Hover states en desktop deben ser suaves (no agresivos)
- Si queda muy vacío, agregar pequeñas ilustraciones decorativas (estrellas, lunas) entre cards

---

## Prompt 3 de 18: Detalle del Libro

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books es una tienda web chilena de libros infantiles personalizados. En esta pantalla, el comprador ve detalles completos de un libro antes de personalizarlo.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la página de Detalle del Libro — ruta: /libro/[slug]

Propósito: Mostrar todos los detalles, spreads de ejemplo, preguntas frecuentes y CTA clara para personalizar.
Llega desde: Catálogo
Va hacia: Wizard Paso 1 (Personalizar)

Componentes necesarios (en orden vertical):

1. HEADER (idéntico a anteriores)

2. BREADCRUMB (desktop, DM Sans 400 14px, color #8B7E6A):
   "Inicio > Catálogo > Buenas Noches"

3. HERO SECTION (80% width centered, padding 40px 0):
   - Layout asimétrico: galería izquierda (50%), info derecha (50%)

   a) GALERÍA SPREADS (lado izquierda):
      - Carrusel de 6 spreads (portada + interiores)
      - Imagen main: aspect-ratio 3/2, width 100%, border-radius 12px, box-shadow 0 4px 20px rgba(196,125,90,0.08)
      - Placeholder watercolor spreads
      - Navigation: ◄ [dot · dot · dot · dot · dot · dot] ►
      - Dot indicator: 12px, active terracota #C47D5A, inactive #D4C5B0, spacing 8px
      - Mobile: carrusel full width (100%), height auto, dots centered below
      - Desktop: thumbnail strip debajo (6 small images 80×60px, aspect 3/2, border 2px, active border terracota)

   b) INFORMACIÓN (lado derecha, desktop) o debajo (mobile):
      - Título: "Buenas Noches, {nombre}" en Fraunces 700 32px, color #4A3F35, margin-bottom 16px
      - Descripción: "Un cuento para soñar donde tu niño/a es la estrella. Personalizamos nombre, apariencia y dedicatoria."
        en DM Sans 400 16px, color #8B7E6A, line-height 1.8, margin-bottom 24px
      - Especificaciones (DM Sans 400 14px, color #8B7E6A, spacing 12px):
        "👶 Edad: 2-5 años"
        "📏 Tamaño: 22×18 cm"
        "📄 Páginas: 20"
        "✨ Impresión: Premium (ilustraciones acuarela)"
      - Precio: "$29.990 CLP" en Fraunces 700 28px, color #C47D5A, margin-top 24px
      - CTA primario: "Personalizar este libro" terracota pill, width 100% (mobile), width auto (desktop),
        padding 14px 40px, ícono Lucide Sparkles 20px, DM Sans 500
      - CTA secundario: "Compartir" button secundario, ícono Lucide Share2 20px, DM Sans 500
        Comportamiento: Share API nativa (mobile) o copiar link + toast "¡Copiado!" (desktop)

4. SECCIÓN "PREGUNTAS FRECUENTES" (80% width centered, padding 60px 0):
   - Separador: thin line #E8DDD0 arriba
   - Headline: "Preguntas Frecuentes" en Fraunces 700 32px, color #4A3F35, margin-bottom 32px
   - Accordion cards (width 100%, max-width 600px):
     * Pregunta en DM Sans 600 16px, color #4A3F35, with chevron (Lucide ChevronDown) right-aligned, 20px
     * Click toggle: expand/collapse con smooth height animation
     * Respuesta en DM Sans 400 15px, color #8B7E6A, line-height 1.8, padding 24px 0
     * FAQ items:
       1. "¿Cuánto tarda en llegar?" → "Entre 7-10 días hábiles a cualquier región de Chile."
       2. "¿De qué material es?" → "Papel de 200 gsm de alta calidad, impresión offset en color. Encuadernación rústica cosida a mano."
       3. "¿Puedo verlo antes de pagar?" → "¡Claro! Puedes ver un preview interactivo con animación page-flip antes de confirmar tu compra."
       4. "¿Hacen envíos a regiones?" → "Sí, disponible a todo Chile. El envío es gratis para órdenes sobre $25.000."

5. STICKY BOTTOM BAR (mobile solo, position fixed, bottom 0, width 100%, bg #FFFFFF, border-top 1px #E8DDD0):
   - Height 100px (para no tapar contenido)
   - Contenido centrado:
     - Precio: "$29.990 CLP" en Fraunces 700 20px, color #C47D5A
     - Button: "Personalizar este libro" terracota pill, width 90%, padding 12px, DM Sans 500, margin-top 8px
   - Box-shadow: 0 -4px 16px rgba(0,0,0,0.05) (sombra hacia arriba)

6. FOOTER (idéntico)
```

### Refinamientos sugeridos:

- Spreads debe tener watercolor quality visible
- Desktop: galería lado izquierdo, info lado derecho (45/55 split)
- Mobile: stack vertical, galería full width, info bajo ella
- FAQs accordion debe tener smooth collapse/expand animation
- Sticky bottom bar mobile debe estar debajo del contenido normal (no overlay)
- Verificar que share button funcione en mobile + desktop

---

## Prompt 4 de 18: Wizard Paso 1 — Nombre del Personaje

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books es una tienda de libros infantiles personalizados. El comprador configura el personaje en un wizard de 4 pasos. Este es el Paso 1.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Wizard Paso 1 — ruta: /libro/[slug]/personalizar?step=1

Propósito: Capturar el nombre del protagonista y mostrar preview en vivo.
Llega desde: Detalle del Libro (botón "Personalizar")
Va hacia: Wizard Paso 2 (Apariencia)

Componentes necesarios (en orden vertical):

1. HEADER (simplificado para wizard, sticky):
   - Logo "Tipiti Books" Fraunces 700 24px, color #4A3F35
   - Back button: ◄ Fraunces 700 20px, color #4A3F35, navega atrás
   - Título: "Buenas Noches, {nombre}" en Fraunces 700 20px, color #4A3F35, centered
   - Desktop: back button left, título center
   - Mobile: back button left, título ellipsis right

2. PROGRESS STEPPER (width 100%, bg #FBF7F0, padding 24px 0, border-bottom 1px #E8DDD0):
   - Layout 4 dots conectados con línea ondulada (not recta)
   - Dot styling: 20px circle, border 2px
     * Completados: bg #8BA888, border #8BA888, inner text color white, número o checkmark
     * Actual: bg #C47D5A, border #C47D5A, text white, número
     * Futuros: bg #D4C5B0, border #D4C5B0, text #8B7E6A
   - Labels: "Nombre" "Apariencia" "Dedicatoria" "Resumen" en DM Sans 400 12px, color #8B7E6A
   - Línea entre dots: 1px sutil #D4C5B0 con curve suave (no recta)
   - Desktop: dots grandes 20px, spacing 120px, labels centered abajo
   - Mobile: dots 16px, spacing 60px, labels arriba/abajo alternado

3. MAIN CONTENT (80% width centered, padding 60px 20px):
   - Layout 2 columnas (desktop): form izquierda (40%), preview derecha (60%)
   - Mobile: stack vertical, form arriba, preview abajo

   a) FORM SECTION (lado izquierda):
      - Headline: "¿Cómo se llama el/la protagonista?" en Fraunces 700 28px, color #4A3F35, margin-bottom 24px
      - Text input:
        * Label: "Nombre" en DM Sans 500 14px, color #4A3F35, margin-bottom 8px
        * Border 1.5px #D4C5B0, border-radius 12px, height 48px, padding 12px 16px
        * Placeholder: "Ej: Sofía, Mateo" en DM Sans 400 14px, color #B5A899
        * Focus: border-color #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.15)
        * Font: DM Sans 500 16px, color #4A3F35
        * Autocapitalize first letter
        * Max length 30 chars
      - Validation feedback (inline, DM Sans 400 12px):
        * Error state: color #A85D3F, icon Lucide AlertCircle 16px
        * Success state: color #6B8B6A, icon Lucide CheckCircle 16px
        * Loading state: spinner Lucide Loader 16px (if checking name availability)
      - Helper text: "2-30 caracteres" en DM Sans 400 12px, color #8B7E6A

   b) PREVIEW CARD (lado derecha, desktop) o abajo (mobile):
      - Card: border-radius 16px, border 1px #E8DDD0, bg #F0E8DC, padding 32px
      - Shadow: 0 4px 20px rgba(196,125,90,0.08)
      - Headline: "Vista previa" en Fraunces 700 16px, color #8B7E6A, margin-bottom 16px
      - Preview text en Caveat 28px, color #4A3F35, line-height 1.6:
        "Buenas noches, [nombre en vivo]"
      - Placeholder illustration (200×200px, centered):
        * Watercolor illustration of a child sleeping
        * Border-radius 12px, bg #D4A0A0/15
      - Updates in real-time as user types

4. NAVIGATION BUTTONS (padding 40px 0, sticky on mobile):
   - Layout: flex center gap 16px (desktop), flex column gap 12px (mobile)
   - Botón "Anterior": secondary (transparent bg, border terracota), disabled (grayed out) in step 1
   - Botón "Siguiente": primary terracota pill
   - Button width: auto desktop, 100% mobile
   - Both buttons: DM Sans 500, padding 12px 40px, border-radius 24px

5. FOOTER (simple, padding 40px 0)
```

### Refinamientos sugeridos:

- Input debe autofocus al cargar
- Preview actualiza en tiempo real mientras escribe
- Nombre máximo 30 chars, sin números especiales
- Validación: mostrar checkmark si válido
- Enter key navega a siguiente paso
- Mobile: preview card debe ser visible sin scroll (cuidar heights)
- Stepper: clickeable en pasos anteriores completados

---

## Prompt 5 de 18: Wizard Paso 2 — Apariencia del Personaje

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Paso 2 del wizard configurador. Aquí el comprador selecciona género, tono de piel, color y tipo de pelo, y opciones de lentes.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Wizard Paso 2 — ruta: /libro/[slug]/personalizar?step=2

Propósito: Capturar las características de apariencia del personaje con preview en vivo.
Llega desde: Wizard Paso 1
Va hacia: Wizard Paso 3 (Dedicatoria)

Componentes necesarios (en orden vertical):

1. HEADER (idéntico a Paso 1)

2. PROGRESS STEPPER (idéntico, pero dot 2 es activo)

3. MAIN CONTENT (80% width centered, padding 60px 20px):
   - Layout: form izquierda (40%), preview derecha (60%, sticky on desktop)
   - Mobile: stack vertical, preview fixed top or scrollable

   a) FORM SECTION (izquierda):

      Sección GÉNERO:
      - Headline: "¿Cómo es el personaje?" en Fraunces 700 24px, color #4A3F35, margin-bottom 24px
      - 2 cards horizontales (desktop) o stack (mobile):
        * Card 1: "Niña" (Lucide sparkles icon or similar)
          - Border 2px, initially #D4C5B0, selected: border #C47D5A + bg #C47D5A/5
          - Padding 20px, border-radius 12px, cursor pointer
          - Text: DM Sans 600 16px, color #4A3F35
          - Width: 48% desktop, 100% mobile
        * Card 2: "Niño"
          - Identical styling
        * Selección click → preview actualiza

      Sección TONO DE PIEL:
      - Label: "Tono de piel" en DM Sans 500 14px, color #4A3F35, margin-top 32px, margin-bottom 16px
      - 3 swatches circulares (radio buttons):
        * Circular 60px diameter, border-radius 50%, border 3px
        * Swatch 1: #E8C9B8 (claro)
        * Swatch 2: #D4A089 (medio)
        * Swatch 3: #B8885E (oscuro)
        * Inactive: border #D4C5B0
        * Active: border #C47D5A, inner ring/glow
        * Spacing: gap 16px, align-items center
      - Display names: "Claro" "Medio" "Oscuro" en DM Sans 400 12px abajo de cada swatch

      Sección COLOR Y TIPO DE PELO:
      - Label: "Color de pelo" en DM Sans 500 14px, margin-top 32px, margin-bottom 16px
      - Grid 2 columnas (desktop) o 1 (mobile) de color swatches:
        * Colores disponibles (4): #C9B89E (rubio), #8B6F47 (castaño), #3D2817 (moreno), #2C1810 (negro)
        * Cada swatch: 50×50px circle, border-radius 50%, border 3px
        * Spacing: gap 16px
        * Active: border #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.2)
      - Filtered based on gender (if applicable in design)

      - Label: "Tipo de pelo" en DM Sans 500 14px, margin-top 24px, margin-bottom 16px
      - 2 toggle buttons:
        * "Liso" | "Ondulado/Rizado"
        * Button styling: border 1.5px #D4C5B0, padding 10px 20px, border-radius 12px
        * Active: border #C47D5A, bg #C47D5A/10, color #4A3F35
        * DM Sans 500 14px

      Sección ACCESORIOS:
      - Label: "¿Lentes?" en DM Sans 500 14px, margin-top 32px, margin-bottom 16px
      - Toggle switch (iOS style):
        * Width 52px, height 32px, border-radius 16px
        * Inactive: bg #D4C5B0
        * Active: bg #8BA888
        * Thumb: 28px circle, white, shadow
      - Or radio buttons: "Sí" | "No"

   b) PREVIEW PORTRAIT (derecha, sticky on desktop):
      - Card: border-radius 16px, border 1px #E8DDD0, bg #F0E8DC, padding 32px
      - Shadow: 0 4px 20px rgba(196,125,90,0.08)
      - Headline: "Tu personaje" en Fraunces 700 16px, color #8B7E6A, margin-bottom 24px
      - Large portrait illustration (300×400px):
        * Watercolor portrait of child with selected attributes
        * Border-radius 12px, bg #D4A0A0/15 placeholder
        * Updates in real-time as selections change
      - Attribute summary below portrait (DM Sans 400 12px, color #8B7E6A):
        * "Niña · Piel media · Pelo oscuro ondulado · Con lentes"

4. NAVIGATION BUTTONS (padding 40px 0):
   - "Anterior" secondary button, enabled (navega a paso 1)
   - "Siguiente" primary terracota button, enabled

5. FOOTER
```

### Refinamientos sugeridos:

- Preview portrait debe actualizar en tiempo real
- Género selection debe ser exclusivo (radio button behavior)
- Colores de pelo deben ser vibrantes pero warm (no grises fríos)
- Portrait illustration debe estar en estilo watercolor cálido
- Mobile: preview debe ser visible sin scroll excesivo (o sticky top)
- Validación: todo pre-seleccionado con defaults para poder avanzar

---

## Prompt 6 de 18: Wizard Paso 3 — Dedicatoria

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Paso 3 del wizard. Aquí el comprador escribe una dedicatoria personalizada para el libro.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Wizard Paso 3 — ruta: /libro/[slug]/personalizar?step=3

Propósito: Capturar una dedicatoria breve y mostrar cómo se verá en el libro.
Llega desde: Wizard Paso 2
Va hacia: Wizard Paso 4 (Resumen)

Componentes necesarios (en orden vertical):

1. HEADER (idéntico)

2. PROGRESS STEPPER (dot 3 activo)

3. MAIN CONTENT (80% width centered, padding 60px 20px):
   - Layout: form izquierda (40%), preview derecha (60%)
   - Mobile: stack vertical

   a) FORM SECTION:
      - Headline: "Escribe una dedicatoria" en Fraunces 700 28px, color #4A3F35, margin-bottom 24px
      - Subtext: "Opcional, pero muy especial para regalar" en DM Sans 400 14px, color #8B7E6A, margin-bottom 24px

      - Textarea:
        * Border 1.5px #D4C5B0, border-radius 12px, padding 16px
        * Height 200px, resize vertical, font DM Sans 400 16px, color #4A3F35
        * Placeholder: "Ej: Para mi Sofía, que llena nuestros días de magia. Te amo. Mamá & Papá"
        * Focus: border #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.15)
        * Max length 200 chars

      - Character counter:
        * DM Sans 400 12px, color #8B7E6A, text-align right
        * Display: "[chars]/200" (e.g., "87/200")
        * Updates in real-time
        * When approaching limit (180+): color #D4A06B (warning)

   b) PREVIEW CARD (derecha):
      - Card: border-radius 16px, border 1px #E8DDD0, bg #F0E8DC, padding 32px
      - Headline: "Cómo se verá" en Fraunces 700 16px, color #8B7E6A, margin-bottom 24px
      - Preview text en Caveat 24px, color #4A3F35, line-height 1.8, text-align center:
        [Dedication text in real-time, or placeholder default text]
      - Subtext: "Esta dedicatoria aparecerá en la primera página de tu libro"
        en DM Sans 400 12px, color #8B7E6A, margin-top 24px, text-align center

4. NAVIGATION BUTTONS (padding 40px 0):
   - "Anterior" secondary
   - "Siguiente" primary

5. FOOTER
```

### Refinamientos sugeridos:

- Textarea debe autofocus
- Character counter debe actualizar en tiempo real
- Preview text en Caveat (handwritten style) para que se vea como escriba real
- Si dedicatoria vacía, mostrar placeholder ejemplo
- Max 200 chars (typical dedicatoria)
- Mobile: preview puede estar abajo o sticky scroll

---

## Prompt 7 de 18: Wizard Paso 4 — Resumen y Confirmación

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Paso 4 final del wizard. Aquí el comprador revisa todas sus selecciones antes de ir a checkout.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Wizard Paso 4 — ruta: /libro/[slug]/personalizar?step=4

Propósito: Mostrar resumen de todas las selecciones con opciones para editar y CTA "Ver mi libro" hacia preview.
Llega desde: Wizard Paso 3
Va hacia: Preview Page-Flip (/libro/[slug]/preview)

Componentes necesarios (en orden vertical):

1. HEADER (idéntico)

2. PROGRESS STEPPER (dot 4 activo)

3. MAIN CONTENT (80% width centered, padding 60px 20px):
   - Layout: large centered card

   SUMMARY CARD (max-width 600px, centered):
   - Border-radius 16px, border 1px #E8DDD0, bg #F0E8DC, padding 40px
   - Shadow: 0 4px 20px rgba(196,125,90,0.08)

   a) PORTRAIT SECTION:
      - Large portrait illustration (300×400px, border-radius 12px)
      - Watercolor style, all attributes applied
      - Centered, margin-bottom 32px

   b) NAME SECTION:
      - Nombre: "[Sofía]" en Fraunces 700 32px, color #4A3F35, text-align center
      - "¿Editar?" link in DM Sans 500 14px, color #C47D5A, margin-top 8px
      - Click "Editar" → navega a step=1 (preservando estado)

   c) ATTRIBUTES SUMMARY:
      - Separador: thin line #E8DDD0
      - Grid 2×2 (desktop) o 1 columna (mobile):
        * "Género: Niña" / "Niño" | DM Sans 400 14px, color #8B7E6A
        * "Piel: Media" | DM Sans 400 14px
        * "Pelo: Oscuro, ondulado" | DM Sans 400 14px
        * "Lentes: Sí" / "No" | DM Sans 400 14px
      - "¿Editar?" link right-aligned, DM Sans 500 12px, color #C47D5A
      - Click → step=2

   d) DEDICATORIA SECTION:
      - Separador: thin line #E8DDD0, margin 24px 0
      - Label: "Dedicatoria" en DM Sans 500 14px, color #4A3F35, margin-bottom 8px
      - Texto en Caveat 20px, color #4A3F35, line-height 1.6, text-align center:
        "[Tu dedicatoria aquí]"
      - Or "Sin dedicatoria" if empty
      - "¿Editar?" link DM Sans 500 12px, color #C47D5A
      - Click → step=3

   e) LIBRO INFO:
      - Separador: thin line #E8DDD0, margin 24px 0
      - Título: "Buenas Noches, {nombre}" en Fraunces 600 20px, color #4A3F35, margin-bottom 8px
      - Especificaciones: "22×18 cm · 20 páginas · Impresión premium"
        en DM Sans 400 12px, color #8B7E6A

4. BUTTONS SECTION (below card, width 100%, max-width 600px, centered, padding 40px 0):
   - "Ver mi libro" CTA: primary terracota pill, width 100%, padding 16px, DM Sans 500
     Navega a /libro/[slug]/preview
   - Separador: "—" en DM Sans 400 14px, color #D4C5B0, margin 24px 0
   - "Volver a editar" link secundario, DM Sans 500 14px, color #C47D5A
     Navega atrás (step=3 o popup)

5. FOOTER
```

### Refinamientos sugeridos:

- Portrait debe ser large y visible
- Todos los campos deben ser editables (clickear "Editar" vuelve a ese step sin perder datos)
- Layout debe ser balanced y no vacío (usar card con padding generoso)
- Mobile: verificar que portrait no sea muy grande
- CTA principal debe ser destacada (color terracota, shadow)

---

## Prompt 8 de 18: Preview Page-Flip

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Preview del libro generado. Aquí el comprador ve todas las 11 páginas con una animación de page-flip realista (como pasar un libro físico). Este es el WOW moment antes de checkout.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la página de Preview Page-Flip — ruta: /libro/[slug]/preview

Propósito: Mostrar todas las 11 páginas del libro con animación de page-flip y opciones para compartir o comprar.
Llega desde: Wizard Paso 4 (botón "Ver mi libro")
Va hacia: Checkout (/checkout) o compartir

Componentes necesarios (en orden vertical):

1. HEADER (minimal):
   - Back button: ◄, color #4A3F35, Fraunces 700 20px
   - Título: "Vista previa de tu libro" Fraunces 700 20px, color #4A3F35, centered
   - Action buttons right: Share (Lucide Share2), Fullscreen (Lucide Maximize)

2. PAGE VIEWER CONTAINER (full viewport, centered):
   - Canvas-based page-flip animation (simulating real page-turning)
   - Dark background #4A3F35 opacity 20% around pages (like reading a physical book)
   - Current spread displayed: 2 pages side-by-side (desktop) or 1 page (mobile)
   - Page dimensions: 400×500px (or responsive, 9:11 aspect ratio per page)
   - Box-shadow: 0 20px 60px rgba(0,0,0,0.15) (depth effect)
   - Border-radius: 4px subtle
   - Pages have watercolor illustration quality

   Animación page-flip:
   - Click right page or swipe right/arrow → next page flips with 3D perspective
   - Click left page or swipe left/arrow → previous page flips back
   - Smooth animation 600ms easing: cubic-bezier(0.4, 0, 0.2, 1)
   - Cursor changes to pointer when hovering over page edges (indicate clickable)

3. PAGE NAVIGATION (below viewer, centered):
   - Layout: flex center items
   - Button "◄ Anterior" (left arrow, Lucide ChevronLeft): secondary, disabled on page 1
   - Dot indicators: 11 dots (1 per page), 12px circles
     * Inactive: bg #D4C5B0
     * Active (current page): bg #C47D5A
     * Spacing: 8px gap
     * Clickeable: click dot → jump to page
   - Button "Siguiente ►" (right arrow, Lucide ChevronRight): secondary, disabled on page 11
   - DM Sans 500 14px, color #4A3F35
   - Page counter: "Página X de 11" en DM Sans 400 12px, color #8B7E6A, below dots

4. ACTION BUTTONS (below navigator, width 100%, max-width 600px, centered, padding 40px 0):
   - Layout: flex column gap 12px (mobile) or row gap 16px (desktop)

   - Primary CTA: "Comprar este libro por $29.990"
     → Terracota pill, width 100%, padding 16px, DM Sans 500
     → Click navega a /checkout (con libro pre-seleccionado)

   - Secondary CTA: "Compartir vista previa"
     → Transparent border terracota, width 100%, DM Sans 500
     → Share API (mobile) o copy link + toast (desktop)

   - "Editar mis selecciones" link
     → DM Sans 500 12px, color #C47D5A
     → Navega atrás a wizard step=1

5. MOBILE STICKY BOTTOM BAR (mobile only):
   - Position fixed, bottom 0, width 100%, bg #FFFFFF, border-top 1px #E8DDD0
   - Content:
     * "$29.990" en Fraunces 700 20px, color #C47D5A
     * "Comprar" button terracota pill, width 90%
   - Height 100px, padding 16px 20px

6. FULLSCREEN TOGGLE (top-right):
   - Ícono Lucide Maximize 24px, color #4A3F35
   - Click → fullscreen mode, hide header, just viewer + nav controls
   - Esc or click again → exit fullscreen
```

### Refinamientos sugeridos:

- Page-flip animation debe ser smooth y convincente (use canvas library like Three.js si es necesario)
- Watercolor quality en spreads debe ser alta
- Mobile: single page view, tap edges or swipe to turn
- Desktop: 2-page spread view (left + right)
- Fullscreen mode: maximizar el viewer, hide ui except nav dots
- Dot navigation must update as user flips pages
- Share button: mobile uses native Share API, desktop copies link + toast notification
- Pre-generate PDF for download (optional future feature)

---

## Prompt 9 de 18: Checkout

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Checkout page. Aquí el comprador confirma su pedido, ingresa dirección de envío, selecciona método de pago y completa la compra.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la página de Checkout — ruta: /checkout

Propósito: Capturar envío, descuentos, método de pago y procesar compra.
Llega desde: Preview Page-Flip (botón "Comprar")
Va hacia: Checkout Success o Checkout Failure

Componentes necesarios (en orden vertical):

1. HEADER (simple):
   - Logo "Tipiti Books" Fraunces 700 24px, color #4A3F35
   - Back button (or just title)
   - "Pagar" button (primary, sticky on scroll)

2. PROGRESS INDICATOR (desktop):
   - 3 steps: "Carrito" (check) → "Envío" (check) → "Pago" (active)
   - DM Sans 500 12px, color #8B7E6A
   - Current step highlighted in terracota

3. LAYOUT (80% max-width centered, padding 40px 20px):
   - Desktop: 2 columnas (form 60%, sidebar 40%)
   - Mobile: single column (form, then sidebar)

   MAIN FORM (izquierda):

   a) ORDER SUMMARY CARD (collapsible on mobile):
      - Border-radius 16px, border 1px #E8DDD0, bg #F0E8DC, padding 24px
      - Headline: "Tu pedido" Fraunces 600 18px, color #4A3F35
      - Libro card:
        * Mini cover image (80×100px aspect 3/4)
        * Título: "Buenas Noches, [nombre]" DM Sans 600 14px
        * Descripción: "Personalizado para [nombre] · Apariencia: [attributes] · Dedicatoria: [preview]"
          DM Sans 400 12px, color #8B7E6A
        * Precio: "$29.990" Fraunces 700 16px, color #C47D5A
      - Click "Editar" → back to preview/wizard
      - Separador: thin line #E8DDD0

   b) DISCOUNT CODE SECTION:
      - Collapsible card: "¿Tienes un código de descuento?" (Lucide ChevronDown toggle)
      - Collapsed: shows question + chevron
      - Expanded: input + button
      - Input: DM Sans 400 14px, border 1.5px #D4C5B0, border-radius 12px, height 40px
        Placeholder: "Ej: TIPITI20"
      - Button: "Aplicar" terracota pill, height 40px, padding 8px 20px
      - Feedback: "Código válido" (green) or "Código no encontrado" (error)

   c) SHIPPING FORM SECTION:
      - Headline: "Dirección de Envío" Fraunces 600 18px, margin-bottom 24px
      - Form fields (DM Sans 400 14px):
        1. Nombre completo: input, border 1.5px #D4C5B0, required
        2. Email: input type email, required
        3. Teléfono: input, placeholder +56 912345678, required
        4. Región: select dropdown, options: "Región Metropolitana", "Valparaíso", "Bío Bío", etc.
        5. Ciudad: text input, required
        6. Dirección: textarea 100px height, placeholder "Calle, número, depto"
        7. Código Postal: input, optional

      - Inputs styling:
        * Border 1.5px #D4C5B0, border-radius 12px, padding 12px 16px, height 44px
        * Focus: border #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.15)
        * Required fields marked with "*" red
        * Validation: real-time, show checkmark on valid
      - Note: "Envío solo a Chile. Gratis para órdenes sobre $25.000"
        DM Sans 400 12px, color #8B7E6A, margin-bottom 20px, bg #F0E8DC, padding 12px

   d) PAYMENT METHOD SECTION:
      - Headline: "Método de Pago" Fraunces 600 18px, margin-top 32px, margin-bottom 24px
      - Radio buttons (2 options):
        1. "Flow.cl" (integración con Flow.cl)
           - Logo Flow.cl (if available)
           - Description: "Tarjeta crédito/débito, transferencia bancaria" DM Sans 400 12px
           - Radio button left-aligned
        2. "Mercado Pago"
           - Logo Mercado Pago
           - Description: "Tarjeta, efectivo, wallet" DM Sans 400 12px
      - Selected option: border 2px #C47D5A, bg #C47D5A/5
      - Spacing: 16px between options
      - DM Sans 500 14px for labels

4. SIDEBAR (derecha):
   - PRICE SUMMARY CARD (sticky on desktop, position relative on mobile):
     * Border-radius 16px, border 1px #E8DDD0, bg #FFFFFF, padding 24px
     * Shadow: 0 4px 20px rgba(196,125,90,0.08)

     * Subtotal: $29.990 (DM Sans 400 14px)
     * Descuento (if applied): -$5.998 (color #8BA888, DM Sans 500 14px)
     * Envío: Gratis (DM Sans 400 14px, color #8BA888)
     * ───────────────────────
     * Total: $29.990 (Fraunces 700 24px, color #C47D5A) ← PROMINENTE

     * Spacing: 12px between line items
     * Separadores: thin line #E8DDD0

   - FINAL CTA BUTTON:
     * "Pagar $29.990" primary terracota pill
     * Width 100%, padding 16px
     * Hover: translate-y -2px + glow shadow
     * Disabled state: gray if form invalid
     * DM Sans 500 16px
     * Loading state: spinner inside button

5. SECURITY BADGE (bottom sidebar):
   - Small badge: "🔒 Pagos seguros con Flow.cl y Mercado Pago"
   - DM Sans 400 12px, color #8B7E6A

6. FOOTER
```

### Refinamientos sugeridos:

- Form validation: real-time feedback, checkmarks for valid fields
- Mobile: single column layout, order summary collapsible (expand to see details)
- Discount code: debe validar contra backend + mostrar nueva total
- Shipping form: pre-rellenar si usuario autenticado
- Payment methods: integrar Flow.cl API y Mercado Pago API (backend)
- Sticky sidebar: en desktop, sigue while scrolling
- Loading state: mostrar spinner en "Pagar" button durante procesamiento
- Error handling: mostrar mensajes claros si hay error en pago

---

## Prompt 10 de 18: Confirmación de Compra (Success)

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Success page después de pago completado. Aquí el comprador ve confirmación de su pedido y detalles de entrega.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la página de Success — ruta: /checkout/success

Propósito: Celebrar la compra, mostrar detalles del pedido, información de entrega y próximos pasos.
Llega desde: Checkout (pago exitoso)
Va hacia: Landing Page o Dashboard (si futuro login)

Componentes necesarios (en orden vertical):

1. HEADER (simple):
   - Logo "Tipiti Books" Fraunces 700 24px
   - Sin nav (focus en confirmación)

2. CONFETTI ANIMATION (full screen, 2 segundos):
   - Confetti de colores cálidos: terracota, verde, rosa, crema
   - Anima hacia abajo desde top
   - Auto-completa en 2s

3. MAIN CONTENT (max-width 600px, centered, padding 60px 20px):

   a) SUCCESS MESSAGE CARD (centered):
      - Border-radius 20px, border 2px #8BA888, bg #FFFFFF, padding 40px
      - Shadow: 0 4px 20px rgba(196,125,90,0.08)

      - Success icon: Lucide CheckCircle 80px, color #8BA888, margin-bottom 24px

      - Headline: "¡Listo! Tu pedido está confirmado"
        Fraunces 700 32px, color #4A3F35, margin-bottom 12px, text-align center

      - Subheadline: "Te enviaremos un email con todos los detalles"
        DM Sans 400 16px, color #8B7E6A, margin-bottom 32px, text-align center

   b) ORDER NUMBER SECTION:
      - "Número de pedido:" DM Sans 500 14px, color #8B7E6A
      - "#ORD-2026-001234" Fraunces 700 20px, color #C47D5A, margin-top 4px, font-family monospace option
      - "Copiar número" link DM Sans 500 12px, color #C47D5A, margin-top 8px
      - Copy icon: Lucide Copy 16px

   c) ORDER DETAILS CARD:
      - Separador: thin line #E8DDD0, margin 32px 0

      - Libro:
        * Mini cover 80×100px aspect 3/4, border-radius 8px
        * Título: "Buenas Noches, [nombre]" DM Sans 600 14px
        * Precio: "$29.990 CLP" Fraunces 700 16px, color #C47D5A
        * Atributos: "[nombre] · [apariencia resumen]" DM Sans 400 12px, color #8B7E6A

      - Separador: thin line #E8DDD0, margin 16px 0

      - Envío:
        * "Dirección: [Dirección del comprador]" DM Sans 400 14px
        * "Región: [Región]" DM Sans 400 14px
        * Spacing: 8px

      - Separador: thin line #E8DDD0, margin 16px 0

      - Total: "$29.990 CLP" Fraunces 700 24px, color #C47D5A, text-align right

   d) TIMELINE / DELIVERY INFO:
      - Headline: "Próximos pasos" DM Sans 600 16px, color #4A3F35, margin-top 32px, margin-bottom 16px

      - Timeline (vertical, left-aligned):
        * Step 1 (checked): "Pago confirmado" ✓
          DM Sans 500 14px, color #8BA888
          Timestamp: "Hace unos segundos"
          DM Sans 400 12px, color #8B7E6A

        * Step 2: "Generando tu libro"
          DM Sans 500 14px, color #8B7E6A
          Estimado: "En 1-2 horas"
          DM Sans 400 12px
          Loading spinner: Lucide Loader 16px, animate rotation

        * Step 3: "Impresión y encuadernación"
          DM Sans 500 14px, color #8B7E6A
          Estimado: "3-5 días hábiles"

        * Step 4: "En camino a tu casa"
          DM Sans 500 14px, color #8B7E6A
          Estimado: "7-10 días hábiles desde orden"

      - Timeline line: 2px #8BA888, conectando steps
      - Current step: highlighted en terracota, filled circle instead of line

   e) EMAIL CONFIRMATION:
      - Info box: bg #F0E8DC, border 1px #E8DDD0, border-radius 12px, padding 16px, margin-top 32px
      - Icon: Lucide Mail 20px, color #8B7E6A
      - Text: "Te hemos enviado un email a [tu@email.com] con todos los detalles del pedido y un link para rastrear tu envío."
        DM Sans 400 14px, color #4A3F35

   f) NEWSLETTER OPT-IN (optional):
      - Checkbox: "Avisarme de nuevos libros y ofertas especiales"
      - DM Sans 400 14px, color #4A3F35
      - Default: checked

4. ACTION BUTTONS (padding 40px 0, flex column gap 12px):
   - Primary: "Volver al inicio" terracota pill, width 100%
     → Navega a /
   - Secondary: "Ver mi pedido" border terracota, width 100%
     → Navega a /mi-cuenta/pedidos/[orderId] (future feature)
   - Tertiary link: "Descargar recibo en PDF" DM Sans 500 12px, color #C47D5A
     → Download PDF

5. FOOTER
```

### Refinamientos sugeridos:

- Confetti animation debe ser breve (1-2 segundos) y colorida (no genérica)
- Timeline debe ser visual y clara (check marks, steps)
- Loading spinner en "Generando tu libro" indica procesamiento activo
- Email confirmation debe ser clara (mostrar email)
- Order number debe ser fácil de copiar
- Mobile: verificar que confetti no sea heavy (performance)
- Success card debe tener border verde salvia (no terracota)

---

## Prompt 11 de 18: Pago Fallido (Failure)

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Error page si el pago falla. Aquí el comprador ve qué salió mal y opciones para reintentar o cambiar método.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la página de Failure — ruta: /checkout/failure

Propósito: Explicar qué pasó, tranquilizar, y ofrecer soluciones (reintentar, cambiar método, contactar soporte).
Llega desde: Checkout (pago fallido)
Va hacia: Checkout (reintentar) o contacto soporte

Componentes necesarios (en orden vertical):

1. HEADER (simple)

2. ERROR MESSAGE CARD (max-width 600px, centered, padding 60px 20px):
   - Border-radius 20px, border 2px #A85D3F, bg #FFFFFF, padding 40px
   - Shadow: 0 4px 20px rgba(196,125,90,0.08)

   - Error icon: Lucide AlertCircle 80px, color #A85D3F (darker terracota), margin-bottom 24px

   - Headline: "Tu pago no pudo ser procesado"
     Fraunces 700 32px, color #4A3F35, margin-bottom 12px, text-align center

   - Error reason: "Contacta a tu banco o intenta con otro método de pago"
     DM Sans 400 16px, color #8B7E6A, margin-bottom 32px, text-align center

3. REASSURANCE SECTION:
   - Info box: bg #F0E8DC, border 1px #E8DDD0, border-radius 12px, padding 20px
   - Icon: Lucide ShieldCheck 20px, color #8BA888
   - Text: "¡No te preocupes! Tu pedido está guardado. Puedes reintentar en unos momentos o cambiar de método de pago."
     DM Sans 400 14px, color #4A3F35

4. COMMON REASONS SECTION (optional):
   - Headline: "¿Por qué podría fallar el pago?" DM Sans 600 14px, color #8B7E6A, margin-top 24px
   - List (DM Sans 400 13px, color #8B7E6A, margin-top 12px):
     • Tu banco rechazó la transacción
     • Fondos insuficientes
     • Datos de tarjeta incorrectos
     • Conexión interrumpida durante el pago

5. ACTION BUTTONS (padding 40px 0, flex column gap 12px):
   - Primary: "Reintentar pago" terracota pill, width 100%
     → Vuelve a /checkout (manteniendo carrito)
   - Secondary: "Cambiar método de pago" border terracota, width 100%
     → Vuelve a /checkout (en sección de pago)
   - Help link: "¿Necesitas ayuda? Contacta con nosotros" DM Sans 500 12px, color #C47D5A
     → Abre modal o navega a /soporte/contacto

6. ORDER PRESERVATION:
   - Texto informativo: "Tu libro personalizado está guardado por 24 horas. Después ese tiempo, deberás volver a completar el wizard."
     DM Sans 400 12px, color #8B7E6A, margin-top 32px, text-align center

7. FOOTER
```

### Refinamientos sugeridos:

- Error message debe ser clara pero empática (no técnica)
- Icon debe ser warning/error (rojo/terracota oscuro) NO éxito
- Reassurance section crucial: tranquilizar que nada se perdió
- Botones principales deben estar claros
- Mobile: verificar spacing y readability
- Si hay error message específico del processor (Flow.cl/Mercado Pago), mostrar si es safe

---

---

# ADMIN — Prompts

---

## Prompt 12 de 18: Admin Login

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books: Admin panel. Aquí los operadores internos (Sofi, ilustradores, fulfillment) logean y gestionan el negocio.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la página de Login Admin — ruta: /admin/login

Propósito: Permitir que admins accedan con email + password. Requiere HTTPS y protección.
Llega desde: URL directa
Va hacia: Dashboard (/admin/dashboard) tras login exitoso

Componentes necesarios (en orden vertical):

1. LAYOUT (full viewport, centered):
   - Fondo: crema #FBF7F0 con textura sutil
   - Centrado: flex center (both axes)

2. LOGIN CARD (max-width 400px, centered):
   - Border-radius 16px, border 1px #E8DDD0, bg #FFFFFF, padding 40px
   - Shadow: 0 4px 20px rgba(196,125,90,0.08)

   - Logo/Brand: "Tipiti Books Panel Admin" Fraunces 700 28px, color #4A3F35, margin-bottom 8px, text-align center
   - Subtext: "Gestión de libros, pedidos y variantes" DM Sans 400 13px, color #8B7E6A, margin-bottom 32px, text-align center

   - Form fields:
     1. Email input:
        - Label: "Email" DM Sans 500 13px, color #4A3F35, margin-bottom 8px
        - Input: border 1.5px #D4C5B0, border-radius 12px, padding 12px 16px, height 44px
        - Placeholder: "admin@tipitibooks.com"
        - Type: email
        - Focus: border #C47D5A + shadow 0 0 0 3px rgba(196,125,90,0.15)

     2. Password input:
        - Label: "Contraseña" DM Sans 500 13px, margin-bottom 8px
        - Input: same styling as email, type password
        - Placeholder: "••••••••"
        - Show/hide toggle: Lucide Eye / EyeOff 20px, color #8B7E6A, right-side, clickable
        - Focus: same as email

     - Spacing between fields: 20px

   - "Recuerda mi sesión" checkbox:
     * Label: "Recuerda mi sesión en este dispositivo" DM Sans 400 13px, color #4A3F35
     * Checkbox left-aligned, margin 16px 0
     * Unchecked by default (for security)

   - Login button:
     * "Iniciar sesión" primary terracota pill
     * Width 100%, padding 12px, DM Sans 500
     * Height 44px
     * Loading state: spinner + disabled
     * Margin-top 24px

   - Error handling:
     * If invalid email/password: error message in red (#A85D3F) below form
     * "Email o contraseña incorrectos. Intenta nuevamente."
     * Icon: Lucide AlertCircle 16px

3. FOOTER (simple, centered):
   - "¿Problemas para acceder? Contacta a hola@tipitibooks.com"
   - DM Sans 400 12px, color #8B7E6A
   - Margin-top 40px

SECURITY REQUIREMENTS:
- HTTPS ONLY
- Password sent hashed (bcrypt or similar)
- Session token stored in secure cookie (httpOnly, secure, sameSite)
- Rate limiting on login attempts (max 5 per minute, then 15-minute lockout)
- Log all login attempts
```

### Refinamientos sugeridos:

- Email validation: real-time feedback
- Password strength indicator (optional)
- "Olvidé mi contraseña" link (future feature)
- Two-factor authentication (future)
- Mobile: verificar que card sea responsive
- Logout button en dashboard para salir

---

## Prompt 13 de 18: Dashboard Operacional

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books Admin: Dashboard home page. Aquí Sofi y su equipo ven KPIs, alertas, pedidos recientes y acceden a todas las funciones del admin.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Dashboard — ruta: /admin/dashboard

Propósito: Mostrar snapshot operacional del negocio (ventas, pedidos, waitlist, alertas).
Llega desde: Login
Va hacia: Lista de Libros, Lista de Pedidos, etc.

Componentes necesarios (en orden vertical):

1. HEADER (sticky, desktop-first):
   - Layout: flex between
   - Left: "Tipiti Books Admin" logo + workspace name
   - Right: User dropdown (avatar 32px circle + "Sofi" name) + "Salir" option
   - Height: 80px, border-bottom 1px #E8DDD0, bg #FFFFFF

2. SIDEBAR NAV (left, sticky, width 280px desktop, collapsible mobile):
   - Logo: "Tipiti Books" Fraunces 700 24px, margin-bottom 32px
   - Menu items (DM Sans 500 14px):
     1. Dashboard (active: bg #C47D5A/10, border-left 4px #C47D5A)
        - Icon: Lucide Home 20px
     2. Libros
        - Icon: Lucide Book 20px
     3. Pedidos
        - Icon: Lucide Package 20px
     4. Pre-generación
        - Icon: Lucide Zap 20px
     5. Variantes (submenu?)
        - Icon: Lucide Palette 20px
     6. Suscriptores
        - Icon: Lucide Mail 20px
   - Spacing: 24px, padding 20px
   - Mobile: hamburger toggle

3. MAIN CONTENT (width: calc(100% - 280px) desktop, 100% mobile):
   - Padding: 40px
   - Max-width handling

   a) PAGE HEADER:
      - "Dashboard" Fraunces 700 36px, color #4A3F35
      - Date: "25 de febrero, 2026" DM Sans 400 14px, color #8B7E6A
      - Refresh button (optional): Lucide RefreshCw 20px, right-aligned

   b) KPI CARDS GRID (4 columnas desktop, 2 móvil, 1 smartphone):
      - Gap: 24px
      - Grid-auto-flow: dense

      Card 1 — Ventas Hoy:
      - Border-radius 16px, border 1px #E8DDD0, bg #FFFFFF, padding 24px
      - Shadow: 0 4px 20px rgba(196,125,90,0.08)
      - Icon: Lucide TrendingUp 32px, color #C47D5A, opacity 20% background circle
      - Métrica: "$29.990 CLP" Fraunces 700 28px, color #4A3F35
      - Label: "Ventas hoy" DM Sans 500 12px, color #8B7E6A
      - Subtext: "+0% desde ayer" DM Sans 400 11px, color #8B7E6A (or with arrow/color)

      Card 2 — Ventas Este Mes:
      - Métrica: "$719.760 CLP" Fraunces 700 28px
      - Label: "Ventas este mes" DM Sans 500 12px
      - Subtext: "+15% vs mes anterior" DM Sans 400 11px, color #8BA888
      - Icon: Lucide BarChart3 32px, color #8BA888

      Card 3 — Pedidos Activos:
      - Métrica: "12" Fraunces 700 28px, color #4A3F35
      - Label: "Pedidos en proceso" DM Sans 500 12px
      - Subtext: "5 en generación, 7 en envío" DM Sans 400 11px
      - Icon: Lucide Package 32px, color #7B9DB7

      Card 4 — Waitlist:
      - Métrica: "234" Fraunces 700 28px
      - Label: "Suscriptores esperando" DM Sans 500 12px
      - Subtext: "+18 en últimas 24h" DM Sans 400 11px
      - Icon: Lucide Bell 32px, color #D4A0A0

   c) ALERTS SECTION (si hay):
      - Headline: "Alertas importantes" DM Sans 600 14px, color #4A3F35, margin-top 40px, margin-bottom 16px
      - Alert boxes (flex column gap 12px):
        * Tipo 1 (Warning): bg #D4A06B/10, border 1px #D4A06B, border-radius 12px, padding 16px
          Icon: Lucide AlertTriangle 20px, color #D4A06B
          Message: "3 variantes rechazadas por calidad. Revisar." DM Sans 400 13px
          Link: "Ver detalles" DM Sans 500 12px, color #C47D5A
        * Tipo 2 (Error): bg #A85D3F/10, border 1px #A85D3F
          Message: "Pre-generación pausada. 5 de 10 completadas."
          Link: "Reanudar"
        * Cerrable: Lucide X 16px, right-aligned

   d) RECENT ORDERS TABLE:
      - Headline: "Pedidos recientes" DM Sans 600 14px, margin-top 40px, margin-bottom 16px
      - Table (DM Sans 400 13px):
        Columns: Orden | Cliente | Libro | Monto | Estado | Acción
        Rows (ejemplo):
        | #ORD-001 | María López | Buenas Noches, Sofía | $29.990 | En envío | [eye icon] |
        | #ORD-002 | Juan García | Buenas Noches, Mateo | $29.990 | En generación | [eye icon] |

      - Table styling:
        * Header row: bg #F0E8DC, border-bottom 1px #E8DDD0
        * Body rows: border-bottom 1px #E8DDD0 (light)
        * Hover row: bg #F0E8DC/50
      - Estado badges: pills con colores semánticos (verde/amarillo/rojo)
      - Click row → Detalle de Pedido
      - Mobile: horizontal scroll or card layout

   e) POPULAR VARIANT (si time permits):
      - Card: "Variante más popular"
      - Mini portrait 80×100px
      - Nombre: "[nombre]" + atributos resumen
      - Órdenes: "8 órdenes en últimos 7 días"
      - Trending: pequeño gráfico mini sparkline (opcional)

4. FOOTER (simple)
```

### Refinamientos sugeridos:

- KPI cards deben actualizar en tiempo real (WebSocket o polling)
- Alerts section debe ser dismissible
- Table debe ser sorteable (click header)
- Mobile: sidebar collapses to hamburger, main content expands
- Charts: si hay datos de tendencias, agregar mini sparklines
- Color código en badges: verde (completado), amarillo (en proceso), rojo (error)

---

## Prompt 14 de 18: Lista de Libros

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books Admin: Aquí se gestiona el catálogo de libros disponibles para personalizar. Mostrar lista, estado, variantes, y accesos a editar.

PANTALLA A DISEÑAR (Zoom-In):
Diseña la Lista de Libros — ruta: /admin/libros

Propósito: Mostrar todos los libros con estado, progreso de variantes, engine usado, y acciones (editar, ver variantes, etc).
Llega desde: Sidebar nav
Va hacia: Editor de Libro, Grid de Variantes

Componentes necesarios (en orden vertical):

1. HEADER (mismo sidebar + header del admin)

2. MAIN CONTENT (80% width, padding 40px):

   a) PAGE HEADER:
      - "Libros" Fraunces 700 36px, color #4A3F35
      - "Catálogo de libros personalizables" DM Sans 400 14px, color #8B7E6A
      - Button "Crear nuevo libro" primary terracota pill, right-aligned
        → Abre form o navega a /admin/libros/new

   b) FILTERS & SEARCH (optional):
      - Search input: "Buscar libro..." DM Sans 400 14px, width 300px
      - Dropdown "Estado": todos, activo, draft, archived
      - Reset filters link

   c) BOOKS TABLE (full width, responsive):
      - Columns:
        1. Título (left-aligned)
        2. Estado (status badge)
        3. Progreso de Variantes (progress bar)
        4. Engine (text, e.g., "StabilityAI 3.6")
        5. Acciones (dropdown menu or buttons)

      - Table Header:
        * bg #F0E8DC, border-bottom 1px #E8DDD0
        * DM Sans 500 12px, color #8B7E6A
        * All caps: "TÍTULO | ESTADO | VARIANTES | ENGINE | ACCIONES"

      - Table Rows:
        * DM Sans 400 13px, color #4A3F35
        * Border-bottom 1px #E8DDD0
        * Hover: bg #F0E8DC/50

        Example row:
        | Buenas Noches, {nombre} | ✓ Activo | [████████░░] 8/10 variantes | StabilityAI 3.6 | ⋮ |

      - Estado badges:
        * "Activo": green #8BA888/15 bg, #6B8B6A text
        * "Draft": gray #D4C5B0/15 bg
        * "Archived": gray opacity 50%

      - Progreso bar:
        * Width 120px, height 6px, border-radius 3px
        * bg #D4C5B0, fill #8BA888
        * Tooltip on hover: "8 de 10 variantes completadas"

      - Acciones dropdown (Lucide MoreVertical 20px):
        * Editar info → /admin/libros/[bookId]/editor
        * Ver variantes → /admin/libros/[bookId]/variantes
        * Duplicar → confirmación + crea copia
        * Archivar → confirmación
        * Eliminar → confirmación + danger action

      - Mobile: horizontal scroll or card layout (each book as expandable card)

   d) EMPTY STATE:
      - If no books:
      - Centered illustration (Lucide BookOpen 64px, color #C47D5A/30)
      - "No hay libros aún" Fraunces 700 24px
      - "Crea tu primer libro personalizable" DM Sans 400 14px
      - Button: "Crear nuevo libro" primary

4. PAGINATION (si hay many books):
   - Bottom-centered: "Página 1 de 3 | ◄ 1 2 3 ►"
   - DM Sans 400 12px

5. FOOTER
```

### Refinamientos sugeridos:

- Table sorteable por clicking headers
- Filtros útiles: activo/draft/archived, por engine
- Progreso bar visual de variantes (% completion)
- Bulk actions: seleccionar múltiples libros + acciones batch
- Mobile: card layout con swipe actions
- Agregar timestamps (creado, actualizado)

---

## Prompt 15 de 18: Editor de Libro

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books Admin: Editor completo de un libro. Aquí se configura metadatos, se escriben escenas con prompts visuales, y se sube el setting sheet (reference images).

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Editor de Libro — ruta: /admin/libros/[bookId]/editor

Propósito: Interfaz WYSIWYG para crear/editar el libro completo.
Llega desde: Lista de Libros (botón "Editar")
Va hacia: Grid de Variantes (cuando se completa)

Componentes necesarios (en orden vertical):

1. HEADER + SIDEBAR (admin nav)

2. MAIN CONTENT (fullscreen editor layout):

   a) TAB NAVIGATION (horizontal, sticky top):
      - Tabs: "Info General" | "Escenas" | "Setting Sheet"
      - Active tab: underline terracota, text bold
      - DM Sans 500 14px, color #4A3F35
      - Padding: 24px, border-bottom 1px #E8DDD0
      - Mobile: scrollable horizontal

   b) TAB 1: INFO GENERAL (width 100%, padding 40px):
      - Headline: "Información General del Libro" Fraunces 700 24px, margin-bottom 24px
      - Form fields (2 columnas desktop, 1 mobile):

        1. Título (required):
           - Label: "Título del libro"
           - Input: DM Sans 400 14px, border 1.5px #D4C5B0, padding 12px 16px, height 44px
           - Placeholder: "Ej: Buenas Noches, {nombre}"

        2. Slug (read-only or auto-generated):
           - Label: "Slug (URL)"
           - Input: read-only gray, text "buenas-noches-nombre"
           - Helper: "Generado automáticamente desde el título"

        3. Rango de edad (required):
           - Label: "Edad recomendada"
           - Dual input: "De 2 años hasta 5 años"
           - Inputs: DM Sans 400 14px, width 80px each

        4. Descripción (required):
           - Label: "Descripción corta"
           - Textarea: height 100px, border 1.5px #D4C5B0, padding 12px 16px
           - Max 250 chars, counter
           - "Un cuento para soñar donde tu niño/a es la estrella..."

        5. Dimensiones (required):
           - Label: "Tamaño del libro"
           - Inputs: "22 cm × 18 cm"
           - Dropdown or manual input

        6. Número de páginas (required):
           - Label: "Páginas totales"
           - Input: number, e.g., "20"
           - Helper: "Incluye portada y contraportada"

        7. Engine (required, dropdown):
           - Label: "Motor de generación de ilustraciones"
           - Options: "StabilityAI 3.6", "DALL-E 3", "Midjourney" (or whatever)
           - Selected: "StabilityAI 3.6"

        8. Precio (required):
           - Label: "Precio en CLP"
           - Input: number, e.g., "29990"
           - Helper: "Precio en pesos chilenos, sin separadores"

        9. Prompt de estilo (required, long textarea):
           - Label: "Prompt de instrucciones de estilo"
           - Textarea: height 150px
           - Content: "Watercolor illustrations in warm, organic style. Oliver Jeffers-inspired. Soft terracotta, sage green, dusty rose tones. Hand-painted quality..."
           - Max 1500 chars, counter

        10. Reference images (optional):
           - Label: "Imágenes de referencia"
           - Dropzone: "Arrastra imágenes o haz click para subir"
           - Allowed: JPG, PNG, up to 10MB each
           - Multiple files
           - Thumbnail grid after upload (100×100px, delete option on hover)

      - Save button: "Guardar cambios" primary terracota, bottom-right sticky

   c) TAB 2: ESCENAS (left sidebar + main editor + right preview):
      - Left Sidebar (width 25%, sticky):
        * Headline: "Escenas (20 total)" DM Sans 600 14px, color #4A3F35, margin-bottom 16px
        * Scrollable list of scenes:
          - "Portada" (locked, read-only)
          - "Escena 1: Introducción" (drag handle)
          - "Escena 2: Primer encuentro" (drag handle)
          - ... (scenes 3-19)
          - "Contraportada" (locked)
        * Drag-to-reorder (Lucide GripVertical 16px)
        * Click scene → loads in editor
        * Active scene: bg #C47D5A/10, border-left 3px #C47D5A
        * Add scene button: "+ Nueva escena" (if app allows)

      - Main Editor (width 50%, center):
        * Scene title editor: "Escena 1: Introducción" input DM Sans 500 16px, editable
        * Divider: thin line #E8DDD0
        * Visual prompt textarea (required):
          - Label: "Prompt visual para la ilustración"
          - Textarea: height 150px, DM Sans 400 14px, border 1.5px #D4C5B0
          - Placeholder: "A little girl sitting on her bed, surrounded by books and stuffed animals, with a warm smile as she reads..."
          - Max 1000 chars, counter
        * Divider
        * Narrative text editor (required):
          - Label: "Texto narrativo (será leído en voz alta)"
          - WYSIWYG editor (rich text): Bold, Italic, Link buttons
          - Textarea: height 200px, DM Sans 400 14px
          - Placeholder: "It was Sofía's favorite time of day—bedtime stories with Mom. As the sky turned dark outside..."
          - Max 500 chars, counter
          - Character count below
        * Divider
        * Position selector (optional):
          - Label: "Posición del texto en la página"
          - Radio buttons: "Arriba" | "Centro" | "Abajo"
          - Or dropdown

      - Right Preview (width 25%, sticky):
        * Headline: "Vista previa de la escena" DM Sans 600 14px, margin-bottom 12px
        * Large illustration placeholder (300×400px):
          - Border-radius 8px, bg #D4A0A0/15
          - "Generando preview..." (or actual preview if already generated)
        * Below illustration, text preview in Caveat 14px:
          - Shows how narrative text will appear
          - Wrapped to fit page width

      - Save scene: "Guardar escena" button, sticky bottom-right

   d) TAB 3: SETTING SHEET (upload + grid):
      - Headline: "Reference Sheet para el Ilustrador" Fraunces 700 24px, margin-bottom 16px
      - Description: "Sube imágenes que definen el estilo visual, personajes, paleta de colores, etc."
        DM Sans 400 14px, color #8B7E6A
      - Dropzone: "Arrastra hasta 5 imágenes o haz click para subir"
        - Allowed: JPG, PNG, up to 15MB each
        - Multiple files
      - Grid after upload (2 columnas, gap 16px):
        * Each image: 250×250px aspect auto, border-radius 8px, thumbnail
        * Delete button (Lucide Trash2) on hover, bottom-right
        * Reorder: drag-to-sort
      - Save: "Guardar setting sheet" button, sticky bottom-right

3. FOOTER + save/cancel buttons (fixed bottom bar):
   - Left: "Cancelar" secondary button
   - Right: "Guardar libro" primary button
   - Auto-save indicator: "Guardado ✓" DM Sans 400 12px, color #8BA888
```

### Refinamientos sugeridos:

- Tab navigation debe ser sticky mientras scroll
- Left sidebar (escenas) debe scrollear independientemente
- Preview debe actualizar en real-time mientras tipea
- Drag-to-reorder de escenas debe ser smooth
- WYSIWYG editor para narrative text (o usar librería como Slate, TipTap)
- Image uploads con progress bar
- Auto-save cada cambio (debounced)
- Mobile: collapsible sidebar, stacked layout

---

## Prompt 16 de 18: Grid de Variantes

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books Admin: Grid de todas las variantes pre-generadas de un libro. Una variante = una combinación de género + piel + pelo + lentes. El objetivo es ver estado, filtrar, bulk actions, y editar/regenerar.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Grid de Variantes — ruta: /admin/libros/[bookId]/variantes

Propósito: Mostrar todas las variantes (100+) en grid, filtrable, con status badges y bulk actions.
Llega desde: Lista de Libros (botón "Ver variantes")
Va hacia: Detalle Variante (click en variante)

Componentes necesarios (en orden vertical):

1. HEADER + SIDEBAR (admin nav)

2. MAIN CONTENT (width 95%, padding 40px):

   a) PAGE HEADER:
      - "Variantes: Buenas Noches" Fraunces 700 28px, color #4A3F35
      - "8 de 10 variantes completadas" DM Sans 400 14px, color #8B7E6A
      - Stats bar (flex, gap 32px):
        * "Total: 10" DM Sans 500 12px, color #8B7E6A
        * "✓ Aprobadas: 8" DM Sans 500 12px, color #8BA888
        * "⏳ Pendientes: 2" DM Sans 500 12px, color #D4A06B
        * "✗ Rechazadas: 0" DM Sans 500 12px, color #A85D3F

   b) FILTERS (horizontal, sticky):
      - Checkboxes (DM Sans 400 12px):
        * "Género: Todas" | "Niña" | "Niño"
        * "Piel: Todas" | "Claro" | "Medio" | "Oscuro"
        * "Pelo: Todos" | "Rubio" | "Castaño" | "Moreno" | "Negro"
      - Dropdowns:
        * "Estado: Todos" | "Aprobada" | "Pendiente" | "Rechazada" | "Error"
        * "Lentes: Todos" | "Con lentes" | "Sin lentes"
      - Buttons:
        * "Limpiar filtros" link DM Sans 500 12px, color #C47D5A
        * "Mostrar más opciones" (expand/collapse)

   c) BULK ACTIONS BAR (if any selected):
      - "X seleccionadas" DM Sans 500 12px, color #8B7E6A
      - Buttons (sticky bottom):
        * "Aprobar seleccionadas" button secondary
        * "Rechazar seleccionadas" button secondary
        * "Regenerar seleccionadas" button secondary
        * "Deseleccionar todas" link
      - Checkbox top-left of grid: "Seleccionar todas [10]"

   d) GRID (6 columnas desktop, 2-3 mobile):
      - Gap: 16px
      - Each variant card:
        * Border: 2px #E8DDD0 (or terracota if has action pending)
        * Border-radius: 12px
        * Padding: 12px
        * Bg: #FFFFFF

        * Checkbox top-left: (for bulk selection)
        * Status badge top-right:
          - "✓ Aprobada": green #8BA888/15, text #6B8B6A
          - "⏳ Pendiente": yellow #D4A06B/15, text #B58045
          - "✗ Rechazada": red #A85D3F/15, text #8B4513
          - "⚠️ Error": orange

        * Large portrait illustration (200×250px aspect 4/5):
          - Border-radius 8px, center of card
          - Watercolor portrait of variant

        * Below portrait, attribute summary (DM Sans 400 11px):
          - "Niña · Piel media · Pelo oscuro · Con lentes"
          - Text-align center, color #8B7E6A

        * Hover state:
          - Shadow intensifies
          - Translate-y -4px
          - Show action buttons:
            - "Ver" (eye icon) → click → Detalle Variante
            - "Regenerar" (refresh icon)
            - "Más opciones" (Lucide MoreVertical)

        * Click card → Detalle Variante

   e) PAGINATION:
      - "Página 1 de 3 | ◄ 1 2 3 ►"
      - DM Sans 400 12px, centered

4. FOOTER
```

### Refinamientos sugeridos:

- Grid responsive (6 cols desktop, 3 tablet, 2 phone, 1 mobile portrait)
- Filtros deben actualizar grid en tiempo real (no recargar)
- Status badges con colores claros (verde/amarillo/rojo)
- Hover effects deben revelar action buttons
- Bulk selection útil para aprobar/rechazar en lote
- Search by variant ID o atributos (future)
- Drag-to-reorder (opcional, para prioridad)

---

## Prompt 17 de 18: Detalle de Variante

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books Admin: Detalle completo de UNA variante. Aquí se ven las 11 páginas del libro, estado de aprobación, y se puede regenerar si necesario.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Detalle de Variante — ruta: /admin/libros/[bookId]/variante/[variantId]

Propósito: Mostrar todas las 11 páginas, state, y permite aprobar/rechazar/regenerar.
Llega desde: Grid de Variantes (click variante)
Va hacia: Grid de Variantes (back)

Componentes necesarios (en orden vertical):

1. HEADER (sticky):
   - Back button: ◄ DM Sans 700 20px
   - Title: "Variante: Sofía (Niña, piel media, pelo oscuro, con lentes)"
     Fraunces 700 20px, color #4A3F35, centered
   - Status badge: top-right, large (e.g., "⏳ Pendiente aprobación")

2. LAYOUT (2-column: left sidebar + main content):

   a) LEFT SIDEBAR (width 25%, sticky, bg #F0E8DC):
      - VARIANT INFO CARD:
        * Heading: "Información" DM Sans 600 14px, margin-bottom 12px
        * Atributos (DM Sans 400 12px, line-height 1.8):
          - Género: Niña
          - Piel: Media
          - Pelo: Oscuro
          - Tipo pelo: Ondulado
          - Lentes: Sí
        * Divider: thin line #E8DDD0, margin 12px 0
        * Seeds/Technical (mono font, 9px):
          - seed_color: #8B6F47
          - seed_style: xyz123
          - model_hash: abc456
        * Divider
        * Timestamps (DM Sans 400 11px):
          - Creada: 2026-02-25 14:30
          - Actualizada: 2026-02-25 15:45

      - NAVIGATION:
        * "◄ Anterior" button secondary (if variant before)
        * "Siguiente ►" button secondary (if variant after)
        * Spacing: 12px

      - KEYBOARD SHORTCUTS (optional):
        * Help text: "Navegación rápida" DM Sans 500 12px, margin-top 24px
        * "← / → Cambiar variante"
        * "A / R Aprobar / Rechazar"
        * "G Regenerar"

   b) MAIN CONTENT (width 75%):
      - PAGE VIEWER (scrollable vertical):

        Page 1 - Portada:
        - Large image: aspect 3/4, width 60% centered, border-radius 8px, shadow
        - "Página 1 de 11" DM Sans 400 12px, color #8B7E6A, centered

        Pages 2-11:
        - Each page in scrollable section:
          * Image: aspect 3/2 spread view (2 pages side-by-side)
          * Width 80% centered
          * Border-radius 8px, shadow
          * "Páginas X-Y de 11" centered below

        Between each page:
        - Thin divider with small dot
        - Spacing 40px

      - ACTIONS BAR (sticky bottom, width 100%, bg #FFFFFF, border-top 1px #E8DDD0):
        * Left side:
          - "⏳ Pendiente aprobación" status badge, large, DM Sans 600 14px
          - Or "✗ Rechazada por:" [reason] (if rejected)
          - Or "✓ Aprobada" (if approved)

        * Right side (flex, gap 12px):
          - "Regenerar" button secondary (Lucide RefreshCw 16px)
            → Shows spinner, regenerates this variant
          - "Rechazar" button secondary (Lucide X 16px)
            → Opens modal for rejection reason
          - "Aprobar" button primary terracota (Lucide Check 16px)
            → Confirms, marks as approved

        * Mobile: buttons stack vertical

      - REJECTION REASON MODAL (if needed):
        * Heading: "¿Por qué se rechaza?" Fraunces 700 20px
        * Textarea: reason for rejection
        * Suggested: "Calidad insuficiente", "Colores incorrectos", "Detalles faltantes", "Proporción facial"
        * Button: "Rechazar variante" red/error color
        * Cancel: "Cancelar"

3. FOOTER
```

### Refinamientos sugeridos:

- Pages deben ser large y de alta calidad (zoom option optional)
- Keyboard shortcuts útiles (← → para navegar variantes)
- Status badge debe ser prominente y actualizar in real-time
- Regenerate button muestra spinner + notificación cuando completa
- Approve/reject deben confirmar antes de hacer
- Mobile: single column, pages fullwidth, actions bottom
- Download PDF option (future)

---

## Prompt 18 de 18: Monitor de Pre-generación

### Para pegar en Stitch:

```
[PEGAR DESIGN SYSTEM PROMPT COMPLETO DE ARRIBA]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
Tipiti Books Admin: Background job monitor. Aquí se ve el progreso de pre-generación de variantes, se puede generar todas, retry failed, y monitorear en tiempo real.

PANTALLA A DISEÑAR (Zoom-In):
Diseña el Monitor de Pre-generación — ruta: /admin/generacion

Propósito: Monitorear jobs de generación de imágenes (batch para todas las variantes).
Llega desde: Sidebar nav
Va hacia: Grid de Variantes (para revisar resultados)

Componentes necesarios (en orden vertical):

1. HEADER + SIDEBAR (admin nav)

2. MAIN CONTENT (80% width, padding 40px):

   a) PAGE HEADER:
      - "Monitor de Pre-generación" Fraunces 700 36px, color #4A3F35
      - "Genera ilustraciones para todas las variantes" DM Sans 400 14px, color #8B7E6A
      - Status indicator (right-aligned):
        * "● Sistema en línea" DM Sans 500 12px, color #8BA888
        * Or "● Procesando..." (animated pulse)

   b) BOOK SELECTOR & BATCH CONTROLS (top card):
      - Border-radius 16px, border 1px #E8DDD0, bg #F0E8DC, padding 24px
      - Heading: "Seleccionar libro para generar" DM Sans 600 14px, margin-bottom 16px
      - Dropdown: "Buenas Noches, {nombre}" (select book)
      - Info: "Libro seleccionado: Buenas Noches"
        "Total variantes: 10"
        "Pendientes: 2"
        DM Sans 400 12px, color #8B7E6A
      - Buttons (flex, gap 16px):
        * "Generar todas" primary terracota
          → Inicia batch job para todas las variantes pendientes
        * "Retry fallidas" secondary
          → Reintenta solo las que fallaron
        * "Pausar generación" secondary (appears while running)
        * "Limpiar completadas" secondary link

   c) PROGRESS SECTION (if job running):
      - Heading: "Progreso actual" DM Sans 600 14px, margin-top 32px, margin-bottom 16px
      - Progress bar:
        * Height 24px, border-radius 12px
        * bg #D4C5B0, fill #8BA888
        * Percentage: "7 de 10 completadas (70%)" centered text
        * Color-coded: green when >80%, yellow <50%, loading animation
      - Estimated time: "Tiempo estimado: 2 horas 30 minutos" DM Sans 400 12px, color #8B7E6A
      - Speed: "Tasa: 2-3 variantes/min" DM Sans 400 12px

   d) TABLE: VARIANT GENERATION STATUS (scrollable):
      - Heading: "Estado de generación por variante" DM Sans 600 14px, margin-top 32px, margin-bottom 16px
      - Columns: Variante | Status | Duración | Acciones
      - Table header: bg #F0E8DC, border-bottom 1px #E8DDD0
      - Rows (ejemplo):
        | Sofía (Niña, piel media, pelo oscuro, con lentes) | ✓ Completada | 4m 23s | [eye icon] |
        | Mateo (Niño, piel clara, pelo rubio, sin lentes) | ✓ Completada | 4m 45s | [eye icon] |
        | María (Niña, piel oscura, pelo negro, con lentes) | ⏳ En progreso | 1m 12s | [pause icon] |
        | Diego (Niño, piel media, pelo castaño, sin lentes) | ⏳ Encolada | — | — |
        | Sofia2 (Niña, piel clara, pelo ondulado, con lentes) | ✗ Error | 2m 15s | [retry icon] [log icon] |

      - Status badges:
        * "✓ Completada": green #8BA888/15
        * "⏳ En progreso": yellow #D4A06B/15, with animated progress bar
        * "⏳ Encolada": gray #D4C5B0/15
        * "✗ Error": red #A85D3F/15

      - Acciones:
        * [eye icon] → abre Detalle Variante
        * [retry icon] (solo en error) → retry individual variant
        * [log icon] → expande detalles de error (inline)

      - Log expansion (inline, hidden by default):
        * "Error log:" mono font 10px
        * "CUDA out of memory. Reducing batch size..."
        * Auto-collapse after 10 segundos

   e) LIVE LOG (collapsible card at bottom):
      - Heading: "Live log del sistema" DM Sans 600 14px
      - Textarea or scrollable log viewer (mono font 11px, bg #2C2C2C, color #00FF00 or similar terminal style):
        * Sample logs:
          "[2026-02-25 14:30:15] Job iniciado: batch_2026_0225_001"
          "[2026-02-25 14:30:22] Generando variante 1/10: Sofía..."
          "[2026-02-25 14:34:45] ✓ Variante 1 completada en 4m 23s"
          "[2026-02-25 14:35:10] Generando variante 2/10: Mateo..."
          "[2026-02-25 14:39:55] ✓ Variante 2 completada en 4m 45s"
          "[2026-02-25 14:40:12] Generando variante 3/10: María..."
        * Auto-scrolls to bottom as new logs appear
      - Max height 300px, scrollable
      - Button "Descargar logs" (download as .txt)
      - Button "Limpiar" (clear logs)

3. MOBILE LAYOUT:
   - Book selector: stacked vertical
   - Progress bar: full width
   - Table: horizontal scroll or card layout
   - Log: collapsible (hidden by default on mobile)

4. FOOTER
```

### Refinamientos sugeridos:

- Live updates via WebSocket (real-time progress)
- Auto-refresh table every 5 segundos (si no WebSocket)
- Pause/resume/cancel job buttons útiles
- Retry failed variants individually o en lote
- Log viewer con search/filter (future)
- Color-code status badges: verde/amarillo/rojo/gris
- Terminal-style log (dark bg, green text) para visual distinction
- Email notification cuando job completa
- Mobile: collapsible log, full-width progress bar

---

---

## NOTAS FINALES

**Orden de generación (recomendado):**
1. Landing Page (establece tone & feel)
2. Detalle del Libro (gallery + FAQs)
3. Wizard Paso 1-4 (form flow)
4. Preview Page-Flip (WOW moment)
5. Checkout + Success/Failure
6. Admin Login
7. Dashboard
8. Lista de Libros + Editor + Variantes + Monitor

**Testing Checklist:**
- Mobile responsive (375px, 768px, 1440px)
- Dark mode NOT applicable (light crema theme only)
- All colors match hex codes exactly
- Fonts: Fraunces (headings), DM Sans (body), Caveat (handwritten)
- No Inter, Roboto, or purple gradients
- Icons from Lucide
- Shadows warm (terracota/rosa), NOT gray
- Borders always #E8DDD0 (warm cream), NOT #ccc
- Text #4A3F35 (warm brown), NEVER #000000

**Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

**Accessibility:**
- WCAG 2.1 AA compliance
- Proper label + input associations
- Keyboard navigation (Tab, Enter, Esc)
- Focus indicators visible (border or ring)
- Alt text for images
- Semantic HTML (button, input, form, etc.)
- Color not sole indicator (use icons + text)

---

**Generado:** 2026-02-25
**Por:** Tipiti Books Design System v1.0
**Estatus:** LISTO PARA STITCH
