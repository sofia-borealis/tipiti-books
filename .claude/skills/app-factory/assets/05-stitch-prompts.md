---
name: ui-generation-prompts
description: >
  Genera prompts optimizados para Google Stitch que convierten wireframes low-res en
  pantallas UI de alta fidelidad con identidad visual DISTINTIVA — no genérica.
  Integra la filosofía del skill Front-End Design para romper con la estética "AI slop"
  (Inter + gradiente morado + layout predecible = lo que queremos EVITAR).
  Incluye Design System Prompt (identidad visual diferenciada), prompts individuales
  por pantalla con formato Zoom-Out-Zoom-In, y guía de refinamiento iterativo.
  Además, genera una estrategia de Generative UI basada en los 3 patrones del ecosistema
  CopilotKit/AG-UI (Static, Declarative con A2UI/Open-JSON-UI, y Open-ended con MCP Apps)
  para las pantallas que se benefician de UI generada por agentes en runtime.
  Usa este skill después de Wireframes (Skill #4) y antes de Master Blueprint (Skill #6).
  El output es un archivo STITCH-PROMPTS-[nombre].md listo para ejecutar en stitch.withgoogle.com,
  más una sección de Generative UI Strategy para pantallas dinámicas.
  REFERENCIA OBLIGATORIA: Leer /front-end-design/SKILL.md antes de definir el Design System.
---

# UI Generation — De Wireframes a Pantallas Reales (Anti-AI-Slop Edition)

> **Rol del agente:** UI Designer Senior + Prompt Engineer especializado en Google Stitch
> y Generative UI patterns. **Con mentalidad de diseñador real, no de IA genérica.**
> **Objetivo:** Transformar los wireframes low-res aprobados en un set completo de prompts
> optimizados para Google Stitch que generen pantallas UI de alta fidelidad, **visualmente
> distintivas y memorables**, consistentes entre sí, y listas para exportar a Figma o código.
> Además, identificar qué pantallas o componentes se benefician de Generative UI.
>
> **Filosofía de diseño:** Cada proyecto merece una identidad visual ÚNICA. No reciclamos
> la misma paleta de azul + gris + Inter de siempre. Pensamos en el contexto, la audiencia,
> la emoción que queremos provocar, y tomamos decisiones BOLD que hagan el producto memorable.
> Referencia: skill Front-End Design (leer ANTES de empezar).

---

## Cuándo Usar Este Skill

- Los wireframes (Skill #4) están aprobados
- Se necesitan pantallas de alta fidelidad generadas con Google Stitch
- Se quiere evaluar si la app se beneficia de Generative UI (UI adaptativa por agentes)
- El Orchestrator lo invoca como Paso 5 del pipeline

## Qué NO Hace Este Skill

- NO ejecuta los prompts en Stitch (eso lo hace el usuario manualmente)
- NO reemplaza a un diseñador para decisiones estéticas de marca avanzadas
- NO genera código final (Stitch genera código, pero el Skill #6 planifica la implementación)
- NO define lógica de negocio ni arquitectura (eso ya está en PDR y Tech Spec)
- NO implementa los protocolos de Generative UI (define la estrategia; la implementación va en Skill #6)

---

## Filosofía Central

> *"Stitch no es perfecto. Es un acelerador. El 80% viene del prompt,
> el 20% del refinamiento manual."*

> *"Si tu app se ve igual que todas las apps generadas por IA,
> perdiste. La diferenciación visual ES ventaja competitiva."*

### Las 4 Reglas

1. **Un prompt, una pantalla.** Stitch genera mejor cuando recibe instrucciones enfocadas
   en una sola pantalla. Prompts largos que intentan generar toda la app a la vez
   producen resultados inconsistentes y pierden componentes.

2. **Consistencia mata a creatividad... EXCEPTO cuando la consistencia es genérica.**
   Es mejor tener 15 pantallas visualmente coherentes (mismos colores, tipografía, botones)
   que 15 pantallas individuales distintas. PERO esa coherencia debe ser DISTINTIVA,
   no la plantilla por defecto de Tailwind UI con Inter y gradiente morado.

3. **Zoom-Out-Zoom-In.** Cada prompt sigue el framework recomendado por Google:
   primero el contexto amplio del producto, luego el zoom en la pantalla específica.
   Esto le da a Stitch la información que necesita para tomar decisiones inteligentes
   de layout y estilo.

4. **Anti-AI-Slop como principio de diseño.** Antes de escribir cualquier prompt,
   el agente debe leer el skill Front-End Design y aplicar sus principios:
   tipografía con personalidad, paletas con intención, layouts que sorprendan,
   detalles que deleiten. Si el resultado "se ve como lo hizo una IA", hay que
   reescribir el prompt.

### Dependencia: Front-End Design Skill

**OBLIGATORIO:** El agente DEBE leer el skill `front-end-design/SKILL.md` antes de
definir el Design System Prompt. Este skill contiene:

- **Design Thinking:** Cómo elegir una dirección estética BOLD basada en contexto
- **Tipografía:** Fuentes distintivas, NO genéricas (prohibido Inter, Roboto, Arial)
- **Color & Theme:** Paletas con intención y dominancia, no distribuidas tímidamente
- **Motion:** Animaciones con impacto (staggered reveals, scroll-triggered, hover states)
- **Spatial Composition:** Layouts asimétricos, overlap, diagonal flow, grid-breaking
- **Backgrounds & Details:** Texturas, gradientes mesh, noise, profundidad visual

El agente aplica estos principios al construir el Design System Prompt, adaptándolos
al contexto del proyecto (industria, audiencia, personalidad de marca).

---

## Contexto Sobre Google Stitch

### Qué Es

Google Stitch (stitch.withgoogle.com) es una herramienta de Google Labs que usa
Gemini para generar diseños UI y código frontend a partir de prompts de texto natural
o imágenes de referencia.

### Capacidades

- Genera pantallas UI completas desde texto
- Acepta wireframes/sketches como imagen de referencia
- Exporta a Figma (copy-paste) o código HTML/Tailwind CSS
- Chat iterativo para refinar diseños sin empezar de cero
- Modo Standard (Gemini Flash, 350 gen/mes) y Experimental (Gemini Pro, 50 gen/mes)
- Soporta diseño web y mobile
- Desde V2 (Sep 2025): responsive resizing con live HTML rendering

### Limitaciones Conocidas

- Tiende a generar dark mode si no se especifica lo contrario
- Cambia estilos entre pantallas si no se repite el contexto visual
- Prompts >5000 chars tienden a omitir componentes
- No aplica automáticamente brand guidelines o design tokens
- No soporta animaciones ni interacciones avanzadas
- Mejor para mobile apps que para web compleja
- No tiene memoria entre sesiones — cada prompt necesita el contexto completo

---

## Flujo de Trabajo del Agente

### FASE 1: Recopilar Inputs

Antes de escribir prompts, el agente necesita extraer información de todos los documentos previos:

**Del PDR:**
- Nombre del producto
- Tipo de aplicación (web app, mobile app, dashboard SaaS, etc.)
- Usuario objetivo (edad, nivel técnico, contexto de uso)
- Personalidad de marca (profesional, amigable, minimalista, vibrante, etc.)

**Del Tech Spec:**
- Component library (shadcn/ui, Material, custom, etc.)
- Framework CSS (Tailwind, CSS Modules, etc.)
- ¿Modo oscuro? ¿Multi-tema?

**De los User Stories:**
- Funcionalidad de cada pantalla (qué hace el usuario)
- Datos que se muestran/capturan
- Estados (empty, error, loading, success)

**De los Wireframes:**
- Layout de cada pantalla (mobile + desktop)
- Jerarquía de elementos
- Navegación entre pantallas
- Componentes específicos (tablas, formularios, cards, gráficos)

---

### FASE 2: Design Thinking + Design System Prompt

**PASO 2a: Leer el skill Front-End Design** (obligatorio)

El agente lee `/front-end-design/SKILL.md` y aplica sus principios de diseño.
Si no tiene acceso al archivo, aplica estos principios core:

- Tipografía con personalidad (NUNCA Inter/Roboto/Arial como principal)
- Paleta con dominancia e intención (no colores distribuidos tímidamente)
- Layouts que sorprendan (asimetría, overlap, grid-breaking cuando tenga sentido)
- Detalles de atmósfera (texturas, sombras con color, micro-interactions)
- Si el resultado "se ve como lo hizo una IA" → rehacer

**PASO 2b: Design Thinking** (antes de definir colores/fuentes)

```
DESIGN THINKING — [Nombre del Proyecto]

1. PROPÓSITO: [Qué problema resuelve, quién la usa, en qué contexto]

2. TONO ESTÉTICO — elegir UNA dirección BOLD:
   → Brutalmente minimal | Luxury/refined | Retro-futuristic
   → Organic/natural | Editorial/magazine | Playful/toy-like
   → Brutalist/raw | Art deco/geometric | Industrial/utilitarian
   → Soft/pastel | Neo-corporate | [Híbrido propio]

3. DIFERENCIADOR: ¿Qué hace esta UI INOLVIDABLE?
   → [Un detalle, una decisión, algo que alguien recordará]

4. ANTI-PATTERNS:
   ✗ Inter/Roboto/Arial como fuente principal
   ✗ Gradiente morado sobre blanco
   ✗ Blue #3B82F6 como primario (Tailwind default)
   ✗ Cards genéricas idénticas a todas las apps
   ✗ Paleta "safe" de grises + 1 accent color tímido
```

**PASO 2c: Discutir con el usuario**

```
🎨 DESIGN SYSTEM — [Nombre del Proyecto]

Necesito definir la identidad visual. Algunas preguntas:

1. ¿Tienes colores de marca ya definidos?
   (Si no, propongo algo basado en tu industria y audiencia)

2. ¿Qué SENSACIÓN quieres que tenga tu app?
   No "moderna y limpia" — piensa en:
   → ¿Elegante como un hotel boutique?
   → ¿Eficiente como un cockpit de avión?
   → ¿Cálida como una cafetería artesanal?
   → ¿Bold como una marca streetwear?
   → ¿Precisa como un instrumento suizo?

3. ¿Alguna app o sitio cuyo diseño ADMIRES?
   (No tiene que ser del mismo rubro)

4. ¿Tema claro, oscuro, o ambos?

5. ¿Desktop-first o mobile-first?
```

**Si el usuario no tiene preferencias claras**, el agente PROPONE UNA DIRECCIÓN BOLD:
- Basándose en industria, audiencia, competencia
- NUNCA la opción "safe" por defecto
- Propone algo con personalidad y deja que el usuario modere si quiere

**PASO 2d: Crear el Design System Prompt** usando el template de abajo.

---

### FASE 3: Generar los Prompts

Generar un prompt individual por cada pantalla, siguiendo el template y las reglas.

El archivo se guarda en `/mnt/user-data/outputs/` con el nombre:
`STITCH-PROMPTS-[nombre-del-proyecto-kebab-case].md`

---

## Template del Design System Prompt

Este bloque se incluye (copiado literalmente) al inicio de cada prompt de Stitch.
**ANTES de completar este template, completar el Design Thinking de la FASE 2.**

```markdown
## Design System Prompt — [Nombre del Proyecto]

(Incluir este bloque COMPLETO al inicio de cada prompt en Stitch)

### Dirección Estética
- Tono: [La dirección elegida — ej: "Editorial con influencia art deco"]
- Personalidad: [2-3 adjetivos — ej: "Sofisticado, audaz, preciso"]
- Referencia visual: [App/sitio que captura el vibe — ej: "Linear meets Stripe"]

### Paleta de Color
- Color dominante: [Color] [hex] — [qué evoca]
- Color de acento: [Color] [hex] — [contraste intencional]
- Colores semánticos: Success [hex], Error [hex], Warning [hex], Info [hex]
- Neutrales: [hex range de más claro a más oscuro]
- Fondo: [color + tratamiento — ¿textura? ¿gradiente sutil? ¿tono cálido/frío?]
- Jerarquía: El dominante manda, el acento sorprende

### Tipografía
- Display/Headings: [Fuente DISTINTIVA — ej: "Clash Display", "Playfair Display"]
  → [Peso, tamaño, letter-spacing]
  → POR QUÉ esta fuente: [conexión con el tono]
- Body: [Fuente complementaria — ej: "DM Sans", "Outfit", "Source Serif 4"]
  → 16px, regular, line-height 1.5-1.6
- Mono (si aplica): [ej: "JetBrains Mono", "Fira Code"]
- PROHIBIDO: Inter, Roboto, Arial, system-ui como fuente principal

### Componentes con Personalidad
- Botones primarios: [color, radius, padding, hover effect — CON CARÁCTER]
- Botones secundarios: [outline/ghost/text — coherentes]
- Cards: [NO genéricas. ¿Borde de color? ¿Gradiente? ¿Sombra dramática? ¿Sin sombra?]
- Inputs: [¿underline? ¿outlined? ¿filled? Focus state con personalidad]
- Icons: [set específico — Lucide/Phosphor/Heroicons, estilo line/filled/duotone]
- Badges: [¿pill? ¿square? ¿con dot? ¿colores vibrantes o sutiles?]

### Layout & Composición
- Desktop: [estructura + ¿algún elemento que rompe el grid?]
- Mobile: [adaptación — bottom nav/hamburger/tab bar]
- Spacing: [¿generosa o densa?]

### Detalles de Atmósfera (lo que diferencia de "AI slop")
- Fondo: [¿Sólido? ¿Gradiente mesh? ¿Noise? ¿Patrón geométrico?]
- Sombras: [¿Dramáticas? ¿Coloreadas? ¿Sutiles? ¿Flat sin sombra?]
- Bordes: [¿Delgados neutros? ¿Gruesos coloridos? ¿Sin bordes?]
- Micro-detalles: [separadores, ilustraciones spot, cursor custom, etc.]

### Reglas Obligatorias
- NO usar dark mode (a menos que se especifique lo contrario)
- NO cambiar la estructura del header/nav entre pantallas
- Mantener EXACTAMENTE los mismos colores y estilos en todas las pantallas
- Idioma de la interfaz: [Español / Inglés / etc.]
- Si el resultado se ve "genérico" o "como template", REESCRIBIR el prompt
```

---

## Template de Prompt Por Pantalla

Cada prompt sigue el framework **Zoom-Out-Zoom-In**:

```markdown
## Prompt [N] de [Total]: [Nombre de la Pantalla]

### Para pegar en Stitch:

---

[DESIGN SYSTEM PROMPT — copiar bloque completo de arriba]

---

CONTEXTO DEL PRODUCTO (Zoom-Out):
[Nombre] es [tipo de app] para [usuario objetivo].
[Una frase sobre el propósito general del producto].

PANTALLA A DISEÑAR (Zoom-In):
Diseña la pantalla de [nombre/función] — [ruta si es web app].

Propósito: [Qué hace el usuario aquí]
Viene de: [pantalla anterior]
Va hacia: [pantalla siguiente]

Componentes necesarios:
- [Componente 1]: [descripción detallada con datos de ejemplo]
- [Componente 2]: [descripción detallada]
- [Componente 3]: [descripción detallada]
- [Componente N]: [descripción]

Layout:
- [Desktop/Mobile]: [descripción del layout — sidebar, grid, single-column, etc.]
- [Responsive behavior si aplica]

Estados incluidos:
- Estado por defecto: [qué se ve normalmente]
- [Empty state / Error state / Loading si es relevante para esta pantalla]

NO CAMBIAR de lo ya establecido:
- Estructura del header/navegación
- Paleta de colores
- Estilo de botones y cards
- Tipografía

---

### Notas de Refinamiento:

Si Stitch no genera correctamente al primer intento, usar estos prompts de ajuste:

1. "[Ajuste específico — ej: Aumentar tamaño del gráfico principal]"
2. "[Ajuste específico — ej: Mover botón CTA debajo del formulario]"
3. "[Ajuste específico — ej: Cambiar layout de cards a grid de 3 columnas]"

### Wireframe de Referencia:

[Copiar aquí el wireframe ASCII de esta pantalla del documento de wireframes,
O indicar: "Subir screenshot del wireframe como imagen a Stitch junto con este prompt"]

### User Stories Cubiertos:

US-[XXX], US-[YYY]
```

---

## Reglas de Escritura de Prompts

### 1. Vocabulario UI que Stitch Entiende Bien

Usar siempre estos términos estándar en los prompts:

**Componentes:**
Navigation bar, Hero section, Call-to-action button (CTA), Card layout,
Card grid, Sidebar, Drawer, Modal, Dialog, Dropdown menu, Tab navigation,
Breadcrumbs, Footer, Form inputs, Search bar, Data table, Avatar,
Badge, Tooltip, Toast notification, Accordion, Carousel, Stepper,
Progress bar, Skeleton loader

**Layouts:**
Single-column layout, Grid layout (2-column, 3-column), Sidebar layout,
Dashboard layout, Master-detail layout, Split-screen layout,
Sticky header, Fixed bottom bar, Floating action button (FAB)

**Estilos (usar para dirigir la estética):**
Minimalist, Clean, Brutalist, Editorial, Magazine-style, Art deco,
Organic, Warm, Industrial, Retro, Futuristic, Bold, High-contrast,
Geometric, Soft, Glassmorphism, Neumorphism, Card-based, Dense dashboard,
Luxury, Refined, Playful, Professional, Elegant serif, Monospace terminal

**EVITAR estos estilos genéricos (producen AI slop):**
"Modern and clean" (no dice nada), "Professional look" (demasiado vago),
"Material Design-inspired" (produce resultados idénticos a toda app de Google)

### 2. Vocabulario Estético Avanzado (del Front-End Design Skill)

Incluir estos detalles en los prompts para guiar a Stitch hacia resultados distintos:

**Tipografía con personalidad:**
- "Use [Fuente específica] for headings" (Stitch las conoce si son de Google Fonts)
- "Large display text, 48px bold, tight letter-spacing -0.02em"
- "Serif headings paired with sans-serif body" (crea contraste visual)
- "Monospace font for data/numbers for a technical feel"

**Color con intención:**
- "Rich, deep [color] as dominant — not a pale tint"
- "High-contrast accent of [color] for CTAs and interactive elements"
- "Warm neutral backgrounds, NOT pure white — use [hex] off-white"
- "Colored shadows (not gray) — subtle [color] tint on card shadows"

**Layout con sorpresa:**
- "Asymmetric 60/40 split on desktop" (en vez de siempre 50/50)
- "Full-width hero section that bleeds to edges, then contained content below"
- "Overlapping elements: stats cards overlap the hero section by 40px"
- "Left-aligned content with generous right margin (editorial style)"

**Detalles de atmósfera:**
- "Subtle noise texture on background for depth"
- "Decorative thin line separators between sections"
- "Rounded pill-shaped badges with vibrant colors"
- "Cards with left color border accent, no shadow"

### 3. Reglas de Extensión

- **Prompt inicial:** 1500-3000 caracteres ideal. Más de 5000 y Stitch empieza a omitir.
- **Refinamientos:** 1-2 cambios por prompt de refinamiento. Nunca más de 3.
- **Datos de ejemplo:** Siempre incluir datos realistas, no "Lorem ipsum".
  Stitch genera mejores layouts cuando entiende qué tipo de datos van.

### 3. Orden de Generación Recomendado

```
1. Dashboard/Home (pantalla principal — establece el look & feel)
2. Login/Signup (pantallas de auth — simples pero definen botones/forms)
3. Pantalla de creación/formulario principal
4. Pantalla de listado/tabla
5. Pantalla de detalle
6. Perfil/Settings
7. Pantallas secundarias
8. Landing page (si aplica — genera al final cuando el estilo está consolidado)
```

**Razón:** Empezar por el dashboard porque es la pantalla más compleja y la que
define el sistema visual. Las pantallas simples (login) se benefician de tener
ese contexto ya establecido.

### 4. Manejo de Inconsistencias

Stitch tiende a cambiar estilos entre generaciones. Mitigaciones:

- **Repetir el Design System Prompt** en cada prompt (no asumir que lo recuerda)
- **Incluir "NO CAMBIAR"** explícitamente para elementos ya establecidos
- **Referir pantallas anteriores:** "Mantén el mismo estilo del dashboard anterior"
- **Guardar screenshot** después de cada pantalla exitosa para usar como referencia
- **Si genera dark mode no solicitado:** Agregar "NO usar dark mode. Light theme obligatorio."

### 5. Uso de Wireframes como Input Visual

Stitch acepta imágenes. La estrategia óptima:

```
Método 1 (Recomendado):
- Subir screenshot del wireframe como imagen a Stitch
- ADEMÁS incluir el prompt de texto con el Design System
- Stitch usa la imagen como layout y el texto como estilo

Método 2 (Alternativo):
- Solo texto, describiendo el layout basado en el wireframe ASCII
- Menos preciso pero no requiere capturas de pantalla

Método 3 (Avanzado):
- Subir wireframe HTML del Skill #4 como screenshot
- O generar SVG del wireframe y subirlo a Stitch
```

---

## Template del Documento Final

```markdown
# [Nombre del Proyecto] — Stitch Prompts

> **Versión**: 1.0
> **Estado**: BORRADOR | APROBADO
> **Fecha**: [YYYY-MM-DD]
> **PDR**: PDR-[nombre].md
> **Tech Spec**: TECH-SPEC-[nombre].md
> **User Stories**: USER-STORIES-[nombre].md
> **Wireframes**: WIREFRAMES-[nombre].md
> **Total Prompts**: [N] pantallas
> **Stitch URL**: https://stitch.withgoogle.com

---

## Instrucciones de Uso

1. Abrir https://stitch.withgoogle.com
2. Seleccionar modo: Standard (rápido) o Experimental (más detallado)
3. Seleccionar medium: [App / Web] según el proyecto
4. Para cada prompt:
   a. Copiar el prompt completo (incluyendo Design System)
   b. Opcionalmente subir el wireframe como imagen
   c. Generar
   d. Revisar y aplicar refinamientos si es necesario
   e. Guardar screenshot antes de pasar a la siguiente pantalla
5. Exportar a Figma o código HTML/CSS cuando estés satisfecho

---

## Design System Prompt

(Copiar este bloque al inicio de CADA prompt)

```
[Bloque completo del Design System aquí]
```

---

## Prompt 1 de [N]: [Nombre de Pantalla]

### Para pegar en Stitch:

```
[Prompt completo aquí]
```

### Refinamientos sugeridos:

1. "[ajuste 1]"
2. "[ajuste 2]"

### Wireframe de referencia:

[ASCII wireframe o "subir wireframe-[nombre].png"]

### Stories cubiertos: US-XXX, US-YYY

---

## Prompt 2 de [N]: [Nombre de Pantalla]

[... mismo formato ...]

---

## [Repite para cada pantalla]

---

## Checklist de Exportación

Después de generar todas las pantallas en Stitch:

- [ ] Todas las pantallas generadas y guardadas (screenshots)
- [ ] Consistencia visual verificada entre pantallas
- [ ] Exportado a Figma para ajustes finales (si aplica)
- [ ] Código HTML/CSS exportado para referencia de desarrollo (si aplica)
- [ ] Responsive behavior verificado (Stitch V2+ soporta resize)

---

## Generative UI Strategy

(Solo incluir si el PDR indica features de IA, copilot, o personalización dinámica.
Si la app es un CRUD estático, omitir esta sección.)

### Evaluación de Pantallas

| Pantalla | Tipo | Protocolo | Razón |
|----------|------|-----------|-------|
| [nombre] | [Estática / Static GenUI / Declarative] | [N/A / AG-UI / A2UI] | [justificación] |

### Componentes del Registry (si Declarative)

[Lista de componentes pre-aprobados que el agente puede ensamblar]

### Dependencias para Blueprint (Skill #6)

[Lista de packages, configs y setup necesarios]

---

*Stitch Prompts + Generative UI Strategy generados con Claude*
*Stitch: https://stitch.withgoogle.com*
*A2UI Composer: https://a2ui-editor.ag-ui.com/*
*CopilotKit: https://docs.copilotkit.ai/generative-ui*
```

---

## Reglas para el Agente

### Calidad de los Prompts

1. **Datos realistas.** Nunca "Lorem ipsum" ni "User 1, User 2". Usar nombres,
   números y textos que representen datos reales del dominio del proyecto.
   Si es una app de citas médicas: "Dr. García - Cardiología - Lunes 9:00 AM".

2. **Específico > Genérico.** "Botón azul #2563EB, bordes redondeados 8px, texto blanco,
   padding 12px 24px" > "Botón bonito". Stitch es literal.

3. **Un cambio por refinamiento.** Si el prompt inicial produce algo 70% correcto,
   refinar con UN cambio específico por iteración, no 5 cambios juntos.

4. **Prevenir dark mode.** Incluir "NO usar dark mode" en el Design System Prompt
   a menos que el usuario lo quiera explícitamente.

5. **Mensajes de UI exactos.** Si el user story dice "mostrar: 'No tienes proyectos
   aún. Crea tu primero'", ese texto exacto va en el prompt de Stitch.

### Anti-AI-Slop (del skill Front-End Design)

6. **Leer Front-End Design SKILL.md antes de empezar.** Siempre. Sin excepción.
   Los principios de ese skill son la base del Design System Prompt.

7. **Nunca usar fuentes genéricas como principal.** Inter, Roboto, Arial, system-ui
   están PROHIBIDAS como fuente de headings. Para body son aceptables solo si los
   headings tienen una fuente con personalidad. Proponer siempre fuentes de
   Google Fonts que tengan carácter: Clash Display, DM Serif Display, Playfair Display,
   Space Grotesk, Sora, Outfit, Bricolage Grotesque, etc. PERO variar entre proyectos —
   nunca converger en la misma fuente.

8. **Paletas con dominancia.** NO distribuir colores equitativamente. Un color DOMINA
   (fondo o accent), el otro SORPRENDE (CTAs, highlights). Evitar el cliché de
   "azul corporativo + gris" a menos que el contexto realmente lo requiera.

9. **Componentes con identidad propia.** Cada proyecto tiene SUS botones, SUS cards,
   SUS inputs. No son los de Tailwind UI por defecto. El prompt debe describir
   qué hace ÚNICOS a estos componentes.

10. **Test mental anti-slop.** Antes de finalizar cada prompt, preguntarse:
    "¿Si pongo 10 apps generadas por IA en una fila, esta se distingue?"
    Si la respuesta es no, reescribir el Design System.

### Integración con el Pipeline

6. **Mapear wireframes a prompts 1:1.** Cada wireframe del Skill #4 = un prompt aquí.
   Si hay 15 wireframes, hay 15 prompts.

7. **Mapear stories a pantallas.** Cada prompt referencia los US-XXX que cubre.

8. **No inventar funcionalidad.** Si el wireframe no tiene un componente,
   el prompt no lo agrega. Si detectas algo faltante, pregunta al usuario.

9. **El Design System se define UNA VEZ y se copia.** No variar entre prompts.
   El usuario puede ajustarlo, pero la base es consistente.

10. **Guardar el archivo** en `/mnt/user-data/outputs/STITCH-PROMPTS-[nombre-kebab].md`

---

## PARTE 2: GENERATIVE UI STRATEGY

> *"No toda pantalla necesita ser estática. Las pantallas que dependen de contexto,
> datos en tiempo real, o interacción con agentes IA se benefician de UI que se genera
> o adapta en runtime."*

### Qué Es Generative UI

Generative UI es un patrón donde **partes de la interfaz son generadas, seleccionadas
o controladas por un agente IA en runtime**, en lugar de ser 100% predefinidas por
el desarrollador. En vez de solo generar texto, los agentes envían estado de UI,
especificaciones estructuradas, o bloques interactivos que el frontend renderiza
en tiempo real.

Esto convierte la UI de pantallas fijas a una interfaz que **se adapta mientras
el agente trabaja y el contexto cambia**.

### Los 3 Tipos de Generative UI

Basado en el framework de CopilotKit (github.com/CopilotKit/generative-ui),
hay un espectro de control vs libertad:

```
┌─────────────────┬──────────────────────┬─────────────────────┐
│  STATIC         │  DECLARATIVE         │  OPEN-ENDED         │
│  (Más control)  │  (Balance)           │  (Más libertad)     │
├─────────────────┼──────────────────────┼─────────────────────┤
│ Componentes     │ El agente ensambla   │ El agente genera    │
│ pre-construidos │ UI desde un registry │ HTML/iframe/content  │
│ El agente solo  │ de componentes       │ libre               │
│ llena parámetros│ aprobados            │                     │
├─────────────────┼──────────────────────┼─────────────────────┤
│ Protocolo:      │ Protocolo:           │ Protocolo:          │
│ AG-UI           │ A2UI (Google)        │ MCP Apps            │
│                 │ Open-JSON-UI (OpenAI)│                     │
├─────────────────┼──────────────────────┼─────────────────────┤
│ Ejemplo:        │ Ejemplo:             │ Ejemplo:            │
│ Weather card    │ Dashboard dinámico   │ Prototipo generado  │
│ que siempre     │ que combina cards,   │ completamente       │
│ muestra ciudad  │ charts, tablas       │ por el agente       │
│ + temperatura   │ según el query       │                     │
├─────────────────┼──────────────────────┼─────────────────────┤
│ ✅ Más fiable   │ ✅ Balance ideal     │ ✅ Máxima flexibilidad│
│ ✅ Accesible    │ ✅ Flexible + seguro │ ❌ Frágil en prod   │
│ ❌ Inflexible   │ ❌ Requiere registry │ ❌ Riesgo seguridad │
└─────────────────┴──────────────────────┴─────────────────────┘
```

### Cuándo Usar Cada Tipo

**Static Generative UI** — Para flujos mission-critical:
- Checkout, pagos, compliance
- Datos sensibles o regulados
- Componentes que no deben variar (auth, forms de datos personales)
- El agente solo decide CUÁNDO mostrar el componente y con QUÉ datos

**Declarative Generative UI** — El sweet spot para la mayoría de apps:
- Dashboards que cambian según el rol o query del usuario
- Chat-driven assistants que muestran forms, cards, charts contextuales
- Workflows que generan UI de aprobación/rechazo según el caso
- Multi-modal apps donde el contenido varía pero los building blocks son finitos

**Open-ended Generative UI** — Solo para prototyping/build-time:
- Generación de landing pages experimentales
- Scaffolding inicial de pantallas (lo que hace Stitch básicamente)
- Demos y hackathons
- NUNCA en producción para usuarios finales

### Los Protocolos Clave

**AG-UI (Agent-User Interaction Protocol)** — CopilotKit
- Capa de runtime bidireccional entre agente y aplicación
- Maneja la comunicación agente ↔ frontend
- Funciona debajo de todos los demás patrones
- GitHub: github.com/ag-ui-protocol/ag-ui

**A2UI (Agent-to-User Interface)** — Google (Dic 2025)
- Estándar abierto: agentes "hablan UI" en JSON declarativo
- El agente envía un blueprint de componentes, NO código ejecutable
- El cliente renderiza con sus componentes nativos (React, Flutter, Angular, etc.)
- Seguridad first: formato declarativo, no ejecutable — catálogo de componentes aprobados
- Streaming JSONL para rendering progresivo
- 3 mensajes clave: surfaceUpdate (componentes), dataModelUpdate (estado), beginRendering (render)
- A2UI Composer: editor visual para crear widgets → https://a2ui-editor.ag-ui.com/
- GitHub: github.com/google/A2UI
- Spec: a2ui.org/specification/v0.8-a2ui/

**Open-JSON-UI** — Estandarización abierta del schema de OpenAI
- Similar a A2UI pero con raíces en el ecosistema OpenAI
- JSON schema para describir cards, forms, charts
- Más sencillo que A2UI pero menos features de streaming

**MCP Apps** — Anthropic/OpenAI (Feb 2025)
- Extensión de MCP (Model Context Protocol) para UI interactiva
- Los MCP servers pueden enviar UI completa (HTML/iframes)
- Más libertad pero menos control
- Ideal para integrar herramientas de terceros con su propia UI

### Evaluación de Candidatos para Generative UI

El agente debe analizar cada pantalla de los wireframes y clasificarla:

```
📊 EVALUACIÓN GENERATIVE UI

Para cada pantalla, preguntar:

1. ¿El contenido de esta pantalla cambia según el CONTEXTO del usuario?
   (rol, permisos, historial, preferencias)
   → Si SÍ: candidato para Generative UI

2. ¿Un agente IA podría MEJORAR esta pantalla adaptándola en runtime?
   (recomendaciones, layouts personalizados, acciones contextuales)
   → Si SÍ: candidato para Generative UI

3. ¿Esta pantalla maneja datos SENSIBLES o flujos CRÍTICOS?
   (pagos, auth, datos personales, compliance)
   → Si SÍ: Static only (componentes pre-built, agente solo llena datos)

4. ¿Los componentes de esta pantalla son COMBINABLES?
   (diferentes cards/charts/forms que se ensamblan según necesidad)
   → Si SÍ: Declarative (A2UI/Open-JSON-UI)

5. ¿Esta pantalla necesita generar UI COMPLETAMENTE NUEVA en runtime?
   → Si SÍ y es producción: reconsiderar — probablemente Declarative alcanza
   → Si SÍ y es prototipo: Open-ended (MCP Apps)
```

### Matriz de Decisión

| Pantalla | ¿Estática? | ¿Dinámica? | ¿Agente útil? | → Tipo |
|----------|-----------|-----------|---------------|--------|
| Login/Signup | ✅ | ❌ | ❌ | Estática pura (sin Generative UI) |
| Dashboard | ❌ | ✅ | ✅ | Static GenUI (cards pre-built, agente llena datos) |
| Dashboard con copilot | ❌ | ✅ | ✅✅ | Declarative (A2UI — agente ensambla widgets) |
| Formulario de datos | ✅ | ❌ | ❌ | Estática pura |
| Formulario adaptativo | ❌ | ✅ | ✅ | Declarative (A2UI — campos según contexto) |
| Chat con agente | ❌ | ✅✅ | ✅✅ | Declarative (A2UI/Open-JSON-UI — rich responses) |
| Settings/Profile | ✅ | ❌ | ❌ | Estática pura |
| Reportes | ❌ | ✅ | ✅ | Static GenUI (chart components pre-built) |
| Landing page | ✅ | ❌ | ❌ | Estática pura (generada en build-time con Stitch) |

### Template de Generative UI Strategy

Incluir esta sección en el documento final cuando haya pantallas candidatas:

```markdown
## Generative UI Strategy

### Resumen

| Pantallas Totales | Estáticas Puras | Static GenUI | Declarative GenUI | Open-ended |
|-------------------|----------------|-------------|-------------------|------------|
| [N]               | [X]            | [Y]         | [Z]               | [0*]       |

*Open-ended no se recomienda para producción

### Pantallas con Generative UI

#### [Nombre Pantalla] — [Static / Declarative]

**Tipo:** Static Generative UI
**Protocolo:** AG-UI (CopilotKit)
**Razón:** [Por qué esta pantalla se beneficia de ser dinámica]

**Componentes pre-built necesarios:**
- [ComponentCard] — muestra [qué datos] con [qué props]
- [ComponentChart] — renderiza [qué tipo de gráfico]

**Implementación:**
```jsx
// Frontend tool registration (CopilotKit pattern)
useFrontendTool({
  name: "[tool_name]",
  description: "[qué hace]",
  parameters: z.object({ /* ... */ }),
  handler: async (params) => { /* fetch data */ },
  render: ({ status, args, result }) => {
    // Loading → Component pre-built → Result
  }
});
```

#### [Nombre Pantalla] — Declarative

**Tipo:** Declarative Generative UI
**Protocolo:** A2UI (Google)
**Razón:** [Por qué esta pantalla necesita composición dinámica]

**Registry de componentes:**
- Card, DataTable, BarChart, LineChart, Form, Badge, Button

**A2UI Flow:**
1. Usuario hace query → Agente decide qué componentes mostrar
2. Agente genera A2UI JSON (surfaceUpdate + dataModelUpdate + beginRendering)
3. Frontend renderiza con componentes del registry nativo
4. Usuario interactúa → Eventos van de vuelta al agente → UI se actualiza

**Ejemplo A2UI payload:**
```json
{"surfaceUpdate":{"surfaceId":"dashboard","components":[
  {"id":"metric-1","type":"stat-card","properties":{"title":"Ventas","value":"$12,450"}},
  {"id":"chart-1","type":"bar-chart","properties":{"data":"@dataModel/sales"}}
]}}
{"dataModelUpdate":{"surfaceId":"dashboard","path":"/sales","contents":[...]}}
{"beginRendering":{"surfaceId":"dashboard","root":"metric-1"}}
```

### Recomendación de Stack para Generative UI

| Necesidad | Herramienta | Notas |
|-----------|------------|-------|
| Runtime agente ↔ frontend | AG-UI (CopilotKit) | Bidireccional, React-native |
| UI declarativa cross-platform | A2UI (Google) | JSON declarativo, seguro |
| UI declarativa web-first | Open-JSON-UI | Más simple que A2UI |
| Integración MCPs con UI | MCP Apps | Para herramientas externas |
| Frontend tools (React) | CopilotKit | useFrontendTool, shared state |

### Dependencias para Skill #6 (Blueprint)

El Blueprint debe incluir:
- [ ] Instalación de @copilotkit/react si se usa Static GenUI
- [ ] Setup de A2UI renderer si se usa Declarative GenUI
- [ ] Definición del component registry (catálogo de widgets aprobados)
- [ ] Implementación de AG-UI runtime endpoint
- [ ] Tests de seguridad para UI generada por agentes
```

### Reglas para Evaluación de Generative UI

1. **No forzar Generative UI.** Si la app es un CRUD simple sin agentes IA,
   todas las pantallas son estáticas puras. Generative UI solo agrega valor
   cuando hay un agente que necesita presentar información dinámica o contextual.

2. **El PDR define si aplica.** Si el PDR menciona "asistente IA", "copilot",
   "recomendaciones personalizadas", "dashboard adaptativo" → evaluar Generative UI.
   Si el PDR es "app de inventario CRUD" → Skip esta sección completa.

3. **Declarative > Open-ended siempre en producción.** Incluso cuando se necesita
   máxima flexibilidad, un registry bien diseñado de componentes declarativos
   cubre el 95% de los casos sin los riesgos de UI completamente generada.

4. **A2UI para multi-plataforma, Open-JSON-UI para web-only.**
   Si la app tiene versión Flutter/mobile nativa → A2UI.
   Si es solo web React/Next.js → Open-JSON-UI o A2UI ambos funcionan.

5. **Seguridad es non-negotiable.** El agente NUNCA genera HTML/JS ejecutable
   en producción. Siempre JSON declarativo mapeado a componentes pre-aprobados.

---

## Ejemplo de Prompt Completo (Anti-AI-Slop)

```
[DESIGN SYSTEM — VirtualStage Pro]

Dirección Estética:
- Tono: Luxury/refined con toque editorial — inmobiliario premium meets tech sofisticado
- Personalidad: Sofisticado, confiable, premium
- Referencia visual: "Sotheby's International Realty meets Linear app"

Paleta de Color:
- Color dominante: #1B2A4A (navy profundo) — autoridad, confianza inmobiliaria
- Color de acento: #C9A55C (dorado muted) — premium sin ser ostentoso
- Colores semánticos: Success #2D7D46, Error #C23B22, Warning #D4952B, Info #3B6FA0
- Neutrales: #FAFAF8 (crema cálido), #E8E6E1 (borde), #8E8C87 (texto secundario), #2C2B28 (texto principal)
- Fondo: #FAFAF8 crema cálido (NO blanco puro — da calidez de galería de arte)

Tipografía:
- Display/Headings: DM Serif Display, 700 weight, tight tracking -0.01em
  → Serif elegante que dice "inmobiliaria premium" sin ser anticuado
- Body: Outfit, 400 weight, 16px, line-height 1.6
  → Sans-serif moderna que complementa sin competir
- Números/Stats: JetBrains Mono, 500 weight — da precisión a los datos

Componentes:
- Botones primarios: #1B2A4A filled, text #FAFAF8, border-radius 4px (sharp, no pill),
  padding 14px 28px, hover: lighten 10% + subtle shadow 0 2px 8px rgba(27,42,74,0.3)
  → Botones rectangulares, casi militares — autoridad
- Botones secundarios: transparent bg, border 1.5px #1B2A4A, text #1B2A4A, hover: fill #1B2A4A + text white
- Cards: fondo blanco #FFFFFF, SIN shadow, border-left 3px solid #C9A55C (acento dorado lateral),
  border-radius 0px (esquinas sharp), padding 24px 28px
  → Cards editoriales — el borde dorado lateral es el differentiator
- Inputs: border-bottom only 1.5px #E8E6E1, NO border completo, focus: border-color #1B2A4A,
  label pequeño encima en #8E8C87, height 48px
  → Estilo editorial — underline inputs, clean y sofisticado
- Icons: Phosphor icons, thin weight, 20px, color #8E8C87

Layout:
- Desktop: max-width 1200px centrado, generoso spacing de 32-48px entre secciones
- Mobile: single-column, padding 20px, bottom nav con 4 items
- Grid de propiedades: 3 columnas desktop, asimétrico — primera card más grande (featured)

Detalles de Atmósfera:
- Fondo: crema #FAFAF8 con textura noise sutilísima (5% opacity)
- Separadores: thin line #E8E6E1 con pequeño ornamento dorado centrado entre secciones
- Stats: números grandes en DM Serif Display + label pequeño en Outfit — jerarquía dramática
- Hover en cards: smooth translate-y -2px + border-left widthens to 5px

NO usar dark mode. Light theme crema siempre.
Idioma de la interfaz: Inglés.

---

CONTEXTO DEL PRODUCTO:
VirtualStage Pro es una plataforma web SaaS para realtors que permite
subir fotos de propiedades vacías y generar staging virtual con IA.
Usuario objetivo: Agentes inmobiliarios premium (35-55 años), manejan propiedades
de alto valor. Necesitan presentar una imagen sofisticada a sus clientes.

PANTALLA A DISEÑAR: Dashboard Principal — /dashboard

Propósito: Vista general de las propiedades del realtor con acceso rápido
a crear nuevas y ver el estado de las existentes.
Viene de: Login exitoso
Va hacia: Click en propiedad → Detalle | Click "Nueva Propiedad" → Wizard

Componentes necesarios:
- Header: Logo "VirtualStage Pro" en DM Serif Display izquierda (navy + gold dot),
  navigation horizontal en Outfit medium (Dashboard [activo con underline dorada],
  Properties, Billing, Support), avatar derecha con dropdown

- Greeting: "Good morning, Sarah" en DM Serif Display 28px + "Here's your portfolio" en
  Outfit 16px #8E8C87 — tono premium y personal

- Tarjetas de métricas (fila horizontal, 4 cards con border-left dorado):
  * Active Properties: 12 (número en DM Serif Display 32px, label en Outfit 14px)
  * Photos Staged: 87
  * Credits Remaining: 150
  * Avg per Property: 7.2 photos

- Botón CTA principal: "New Property" (navy filled, icono Phosphor +, estilo sharp)

- Featured property card (más grande, primera posición):
  * Thumbnail grande con overlay gradiente sutil al bottom
  * "Lakewood Estate" en DM Serif Display 20px
  * "4521 Lakeshore Dr, Winnipeg" en Outfit 14px #8E8C87
  * Badge "In Progress" dorado con text navy
  * "24 photos • Updated 2h ago"

- Grid de propiedades restantes (2 columnas debajo del featured):
  Cards con thumbnail, nombre, dirección, badge de estado, botón "View Details"

- Empty state (si no hay propiedades):
  Ilustración line-art de una casa vacía (estilo editorial) +
  "Your portfolio is empty" en DM Serif Display +
  "Start by adding your first property" en Outfit +
  Botón "Add Property"

Layout:
- Desktop: Header fijo, contenido centrado max-width 1200px
  Featured property card span full-width, grid debajo en 2 columnas
- Mobile: Header con hamburger, featured card stacked, propiedades 1 columna

NO CAMBIAR: Colores, tipografía, estilo de botones y cards definidos arriba.
```

---

*"El mejor prompt de Stitch es el que no necesita refinamiento.
El segundo mejor es el que solo necesita uno."*

*"Si tu diseño se confunde con el de cualquier otra app generada por IA,
no es diseño — es ruido visual. Cada pixel es una oportunidad de
decir 'esto fue pensado por un humano con intención'."*

*"Generative UI no es generar UIs desde cero. Es dejar que el agente
componga la interfaz correcta para el contexto correcto, usando
los building blocks que tú pre-aprobaste."*
