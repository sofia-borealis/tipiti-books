---
name: wireframes-generator
description: >
  Genera low-res wireframes completos (desktop + mobile) para todas las pantallas de una
  aplicación a partir del PDR, Tech Spec y User Stories aprobados. Produce wireframes en
  múltiples formatos: ASCII en Markdown (siempre), SVG/HTML como artifacts visuales, y
  Frame0 MCP como prioridad cuando está disponible. Cubre todas las pantallas del MVP
  incluyendo estados vacíos, errores, loading y modales. Usa este skill después de User
  Stories (Skill #3) y antes de Stitch Prompts (Skill #5).
---

# Wireframes Generator — Low-Res Wireframes

> **Rol del agente:** UX Designer Senior + Information Architect.
> **Objetivo:** Traducir los user stories en wireframes visuales de baja fidelidad que
> comuniquen estructura, jerarquía, flujo y layout de TODAS las pantallas del MVP,
> en versión desktop y mobile.

---

## Cuándo Usar Este Skill

- Los User Stories (Skill #3) están aprobados y se necesita visualizar las pantallas
- Se necesitan wireframes para validar flujos antes de diseñar UI final
- El Orchestrator lo invoca como Paso 4 del pipeline

## Qué NO Hace Este Skill

- NO define lógica de negocio (eso fue el PDR)
- NO define stack técnico (eso fue el Tech Spec)
- NO define comportamiento detallado (eso fue User Stories)
- NO genera diseño visual final — solo estructura y layout low-fidelity
- NO elige colores, tipografías, ni estilos visuales

---

## Filosofía Central

> *"Un wireframe low-res es un plano arquitectónico, no una foto de la casa terminada."*

### Las 3 Reglas

1. **Estructura sobre estética.** El wireframe comunica QUÉ va en cada pantalla y DÓNDE,
   no cómo se ve. Sin colores, sin tipografía fancy, sin imágenes reales.

2. **Toda pantalla, todo estado.** Si un user story describe una interacción, debe existir
   un wireframe para ella — incluyendo empty states, error states, loading states y modales.

3. **Mobile-first, desktop-second.** Diseñar primero la versión mobile (375px) porque fuerza
   a priorizar contenido. Después expandir a desktop (1440px).

---

## Detección de Herramientas y Estrategia de Output

El agente debe verificar qué herramientas tiene disponibles y elegir la estrategia
de output en este orden de prioridad:

### Prioridad 1: Frame0 MCP (si está disponible)

```
Verificar: ¿Existe el MCP de Frame0 conectado?

Si SÍ:
  → Usar Frame0 como herramienta PRINCIPAL para wireframes
  → Frame0 genera wireframes hand-drawn editables con componentes UI reales
  → El usuario puede iterar directamente en Frame0
  → ADEMÁS generar el documento Markdown con ASCII como respaldo/documentación

Ventajas de Frame0:
  - Librería de componentes UI (buttons, forms, navs, cards, modals)
  - Templates para web, mobile, tablet
  - Estilo sketch que comunica "esto es prototipo, no diseño final"
  - Exportable y editable por el usuario
  - MCP Server: se integra con Claude Desktop/Cursor
```

### Prioridad 2: SVG + HTML Artifacts (siempre disponible)

```
Si Frame0 NO está disponible:
  → Generar wireframes como artifacts SVG o HTML
  → SVG: wireframes estáticos estilo sketch, una imagen por pantalla
  → HTML: wireframes interactivos responsive con CSS sketch-style

Cuándo usar SVG vs HTML:
  - SVG → Pantallas simples, vistas rápidas, flujos lineales
  - HTML → Pantallas complejas, dashboards, formularios multi-step, responsive
```

### Prioridad 3: ASCII en Markdown (siempre se genera)

```
SIEMPRE generar el documento Markdown con wireframes ASCII.
Este es el formato base que:
  → Se incluye en el archivo de output final
  → Sirve como documentación permanente
  → Es legible en cualquier editor de texto
  → Alimenta al Skill #5 (Stitch Prompts)
  → No depende de ninguna herramienta externa
```

### Resumen de Estrategia

| Herramienta | Cuándo | Output | Rol |
|-------------|--------|--------|-----|
| **Frame0 MCP** | Si está disponible | Wireframes editables | Principal |
| **HTML artifact** | Pantallas complejas/responsive | `.html` interactivo | Visual |
| **SVG artifact** | Pantallas simples/rápidas | `.svg` estático | Visual |
| **ASCII Markdown** | Siempre | `.md` documentación | Base obligatoria |

---

## Flujo de Trabajo del Agente

### FASE 1: Análisis de Inputs y Planificación

1. **Leer User Stories** — extraer TODAS las pantallas implícitas:
   - Cada epic típicamente = 1-3 pantallas
   - Cada story con UI = al menos 1 wireframe
   - No olvidar: empty states, errores, confirmaciones, modales

2. **Leer PDR** — extraer personas y contexto de uso:
   - ¿Dispositivo principal? (mobile-first o desktop-first)
   - ¿Nivel técnico del usuario? (afecta complejidad de la UI)
   - ¿Frecuencia de uso? (afecta densidad de información)

3. **Leer Tech Spec** — extraer restricciones de UI:
   - ¿Component library? (shadcn/ui → componentes disponibles)
   - ¿Auth flow? (pantallas de login/signup necesarias)
   - ¿Integraciones que afectan UI? (upload, pagos, etc.)

4. **Crear el Sitemap** — mapa completo de pantallas:

```
📱 SITEMAP — [Nombre del Proyecto]

Públicas (sin auth):
├── / → Landing Page
├── /pricing → Pricing
├── /login → Login
├── /signup → Signup
├── /forgot-password → Password Reset
└── /check-email → Confirmación de email

Autenticadas:
├── /dashboard → Dashboard principal
├── /dashboard/[recurso] → Lista de [recurso]
├── /dashboard/[recurso]/[id] → Detalle de [recurso]
├── /dashboard/[recurso]/new → Crear [recurso]
├── /dashboard/profile → Perfil
├── /dashboard/settings → Configuración
└── /dashboard/billing → Billing (si aplica)

Admin (si aplica):
├── /admin → Panel admin
└── /admin/users → Gestión de usuarios

Modales/Overlays:
├── Confirmación de eliminación
├── [Modal específico del proyecto]
└── ...

Total: [N] pantallas × 2 versiones (mobile + desktop) = [N×2] wireframes
```

5. **Verificar herramientas disponibles** y comunicar al usuario:

```
🔧 HERRAMIENTAS DETECTADAS:

[✅/❌] Frame0 MCP — [disponible/no disponible]
[✅] HTML/SVG Artifacts — siempre disponible
[✅] ASCII Markdown — siempre disponible

Estrategia: [Descripción de cómo se van a generar los wireframes]
```

---

### FASE 2: Presentar Plan al Usuario

```
📋 PLAN DE WIREFRAMES — [Nombre del Proyecto]

Pantallas identificadas: [N] total

Por flujo:
1. Auth Flow: [N] pantallas (login, signup, reset, etc.)
2. [Flujo principal]: [N] pantallas
3. [Flujo secundario]: [N] pantallas
4. Admin/Settings: [N] pantallas

Estados adicionales:
- Empty states: [N]
- Error pages: [N]
- Modales: [N]

Formato de entrega:
- [Frame0 / HTML / SVG] para visualización
- Markdown con ASCII para documentación

¿Falta alguna pantalla? ¿Ajustamos algo?
```

---

### FASE 3: Generación de Wireframes

Generar TODAS las pantallas siguiendo las reglas de abajo.

**Orden de generación:**
1. Auth flow (login → signup → reset) — porque es universal
2. Happy path principal de inicio a fin
3. Pantallas secundarias
4. Estados especiales (empty, error, loading)
5. Modales y overlays
6. Admin (si aplica)

---

## Reglas de Diseño

### Caracteres ASCII Estándar

```
Usar consistentemente:
┌─────────────────┐  Contenedores/cards
│                 │  Bordes verticales
├─────────────────┤  Divisores horizontales
└─────────────────┘  Cierre de contenedor
[Button Text]        Botones/CTAs
[_______________]    Campos de input
< > ▼ ► ☰ 👤 🔔     Iconos/indicadores
○ ●                  Radio buttons
☐ ☑                  Checkboxes
━━━━━━━━━━━━━━━━━   Separadores de sección
...                  Contenido placeholder
(Link Text)          Links clickeables
```

### Dimensiones de Referencia

| Dispositivo | Ancho | Uso |
|-------------|-------|-----|
| Mobile | 375px | iPhone SE/standard — diseñar PRIMERO |
| Tablet | 768px | iPad — solo si el PDR lo requiere |
| Desktop | 1440px | Laptop/monitor — diseñar SEGUNDO |

### Jerarquía Visual

- **Header/Nav** siempre arriba
- **Contenido principal** en el centro, ocupa la mayor área
- **Acciones primarias** destacadas con `[BOTÓN PRIMARIO]` vs `[botón secundario]`
- **Footer** solo si la página lo necesita (landing pages, auth pages)
- **Sidebar** solo en desktop si el dashboard lo requiere

---

## Formato de Cada Wireframe

```markdown
---

### Pantalla: [Nombre Descriptivo]

**Ruta:** /[path]
**User Stories:** US-XXX, US-YYY
**Propósito:** [Qué hace el usuario en esta pantalla]
**Llega desde:** [Pantalla anterior o acción]
**Va hacia:** [Pantalla siguiente o acción]

#### Mobile (375px)

┌─────────────────────────────────┐
│  ☰  Logo           [🔔] [👤]  │
├─────────────────────────────────┤
│                                 │
│  [Contenido de la pantalla]     │
│                                 │
│  [Elementos interactivos]       │
│                                 │
│  [___Campo de input___]         │
│                                 │
│  [  Acción Principal  ]         │
│  (acción secundaria)            │
│                                 │
└─────────────────────────────────┘

#### Desktop (1440px)

┌──────────────────────────────────────────────────────┐
│  Logo    [Nav] [Nav] [Nav]              [🔔] [👤]   │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │    [Contenido principal]                  │
│          │                                           │
│ [Nav 1]  │    [Elementos lado a lado en desktop]     │
│ [Nav 2]  │                                           │
│ [Nav 3]  │                                           │
│          │                                           │
└──────────┴───────────────────────────────────────────┘

#### Elementos Clave

| # | Elemento | Tipo | Comportamiento |
|---|----------|------|----------------|
| 1 | [nombre] | [button/input/card/etc] | [qué hace al interactuar] |
| 2 | [nombre] | ... | ... |

#### Interacciones

- Click [X] → Navega a [pantalla]
- Submit form → [acción del sistema]
- Scroll → [comportamiento si aplica]

#### Estados

- **Empty:** [qué se ve si no hay datos]
- **Loading:** [qué se ve mientras carga]
- **Error:** [qué se ve si algo falla]

---
```

### Pantallas Obligatorias (Siempre Incluir)

Independientemente del proyecto, SIEMPRE generar wireframes para:

1. **Login** — email + password + forgot password link + signup link
2. **Signup** — nombre + email + password + terms checkbox
3. **Forgot Password** — email + submit + back to login
4. **Dashboard/Home** — primera pantalla después de login
5. **Empty State** — dashboard o lista principal sin datos
6. **Error 404** — página no encontrada
7. **Profile/Settings** — editar datos del usuario

### Estados Que No Se Deben Olvidar

Para cada pantalla con datos dinámicos, considerar:

| Estado | Wireframe Necesario? | Qué Mostrar |
|--------|---------------------|-------------|
| **Con datos** | Sí — es el wireframe principal | Datos de ejemplo |
| **Vacío** | Sí — wireframe separado | Ilustración + CTA "Crear primero" |
| **Cargando** | Describir en notas | Skeleton/spinner |
| **Error** | Describir en notas o wireframe | Mensaje + retry |
| **Sin permiso** | Describir en notas | Mensaje + redirect |

---

## Generación de Artifacts Visuales

### SVG Wireframes

Cuando se generan como SVG, usar este estilo sketch/hand-drawn:

```
Principios del SVG:
- Fondo blanco o gris muy claro (#FAFAFA)
- Líneas en gris oscuro (#333) con stroke-width 1-2px
- Texto en sans-serif, tamaño legible
- Botones como rectángulos redondeados con label
- Inputs como rectángulos con borde inferior destacado
- NO colores de marca, NO imágenes, NO iconos elaborados
- Añadir líneas ligeramente irregulares para efecto "hand-drawn" si es posible
```

### HTML Wireframes

Cuando se generan como HTML, usar este approach:

```
Principios del HTML:
- CSS inline o en <style> (archivo único)
- Font-family: 'Comic Neue', cursive, sans-serif (o similar sketch font)
- Colores: solo grises (#333, #666, #999, #CCC, #F0F0F0) + blanco
- Borders: 2px solid #333 con border-radius sutil
- Botones con hover state simple (background-color change)
- Responsive: usar CSS Grid o Flexbox con media queries
- Incluir toggle mobile/desktop si es posible
- NO JavaScript complejo — solo CSS responsive
```

### Frame0 MCP

Cuando Frame0 está disponible:

```
Principios Frame0:
- Usar templates web/mobile de Frame0
- Aprovechar la librería de componentes built-in
- Crear un page por pantalla
- Linking entre pages para mostrar flujo de navegación
- Permitir al usuario editar y ajustar después
- Exportar como referencia para el Skill #5
```

---

## Template del Documento Final

El archivo Markdown con ASCII wireframes SIEMPRE se genera.
Se guarda en `/mnt/user-data/outputs/` con el nombre:
`WIREFRAMES-[nombre-del-proyecto-kebab-case].md`

```markdown
# [Nombre del Proyecto] — Low-Res Wireframes

> **Versión**: 1.0
> **Estado**: BORRADOR | APROBADO
> **Fecha**: [YYYY-MM-DD]
> **PDR**: PDR-[nombre].md
> **Tech Spec**: TECH-SPEC-[nombre].md
> **User Stories**: USER-STORIES-[nombre].md
> **Total Pantallas**: [N] (Mobile: [N] | Desktop: [N])

---

## Sitemap

```
[Mapa visual de todas las pantallas con jerarquía]
```

## Flujo de Navegación Principal

```
[Diagrama del happy path: pantalla → pantalla → pantalla]
```

---

## 1. Auth Flow

### Pantalla: Login
[wireframe completo con formato estándar]

### Pantalla: Signup
[wireframe]

### Pantalla: Forgot Password
[wireframe]

---

## 2. [Nombre del Flujo Principal]

### Pantalla: [Nombre]
[wireframe]

### Pantalla: [Nombre]
[wireframe]

---

## 3. [Nombre del Flujo Secundario]

[wireframes]

---

## N. Estados Especiales

### Empty State: [Pantalla]
[wireframe del estado vacío]

### Error 404
[wireframe]

---

## Modales y Overlays

### Modal: [Nombre]
[wireframe del modal]

---

## Resumen de Interacciones

| Desde | Acción | Hacia |
|-------|--------|-------|
| Login | Submit credentials | Dashboard |
| Dashboard | Click "Crear nuevo" | Form de creación |
| ... | ... | ... |

---

*Wireframes generados con Claude para Carlos-GPT*
*Pendiente aprobación antes de avanzar al siguiente skill*
```

---

## Reglas para el Agente

### Calidad de los Wireframes

1. **Consistencia.** Todos los wireframes usan los mismos caracteres ASCII, el mismo
   layout de header/nav, los mismos patrones de botones e inputs.

2. **Cada pantalla es auto-contenida.** Alguien que ve un wireframe aislado debe entender
   qué pantalla es, cómo se llega, y qué se puede hacer ahí.

3. **Mobile primero.** Siempre dibujar mobile antes que desktop. Si solo se puede hacer
   uno (por tiempo/espacio), hacer mobile.

4. **Priorizar el happy path.** Wireframear primero el flujo exitoso completo de inicio
   a fin, después los edge cases y estados alternativos.

5. **No inventar pantallas.** Si no hay un user story que justifique una pantalla,
   no la crees. Si detectas que falta un story para una pantalla necesaria,
   notifica al usuario.

6. **Labels descriptivos.** Nunca "Lorem ipsum". Siempre texto que describa lo que
   realmente iría ahí: "Nombre del proyecto", "Total de ventas este mes", etc.

### Integración con el Pipeline

7. **Mapear stories a pantallas.** Cada wireframe debe referenciar los US-XXX que cubre.
   Si un story no tiene wireframe, falta algo.

8. **Alimenta al Skill #5.** Los wireframes son el input para generar prompts de
   Google Stitch. Deben ser suficientemente claros para que otro agente (o humano)
   entienda la estructura y genere pantallas reales.

9. **Respetar la cantidad.** No reducir wireframes por flojera. Si hay 15 pantallas
   en los user stories, hay 15 wireframes × 2 versiones (mobile + desktop).

10. **Guardar el archivo** en `/mnt/user-data/outputs/WIREFRAMES-[nombre-kebab].md`

---

## Instalación de Frame0 MCP (Referencia)

Si el usuario quiere habilitar Frame0 como herramienta principal:

```
Frame0 MCP Server:
- Website: https://frame0.app/
- El MCP se configura desde Frame0 para conectar con Claude Desktop/Cursor
- Componentes disponibles: buttons, forms, navs, cards, modals, tables,
  charts, icons (1500+ sketch-style), device templates
- Soporta: web, mobile, tablet, smartwatch templates
- Export: PNG, SVG, editable frame0 format
```

Para Excalidraw MCP (alternativa para diagramas de flujo):

```
Excalidraw MCP:
- Remoto: https://excalidraw-mcp-app.vercel.app/mcp
- Agregar como conector en Claude: Settings → Connectors → Add custom connector
- Ideal para: diagramas de arquitectura, flows, sitemaps visuales
- No ideal para: wireframes detallados de UI (usar Frame0 o HTML para eso)
```

---

*"Un wireframe bueno es el que todos entienden sin explicación."*
