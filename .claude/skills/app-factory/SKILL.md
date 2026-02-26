---
name: app-factory
description: >
  Pipeline completo para diseñar y planificar aplicaciones SaaS/web/mobile desde una idea
  hasta un blueprint ejecutable. Coordina 7 skills especializados en secuencia:
  PDR (entrevista) → Tech Spec → User Stories → Wireframes → UI Prompts → Master Blueprint.
  Usa este skill siempre que el usuario quiera crear una app, diseñar un SaaS, planificar
  un MVP, generar documentación de producto, o cualquier variante de "tengo una idea y quiero
  construirla". También se activa cuando el usuario dice "app factory", "pipeline de diseño",
  "quiero el plan completo", "genera el blueprint", o adjunta documentos de producto previos
  y quiere continuar el proceso. Incluso si el usuario solo quiere UN paso (como wireframes
  o user stories), este skill detecta qué necesita y lo ejecuta. Es el punto de entrada
  principal — el usuario solo habla con App Factory y ella se encarga del resto.
---

# App Factory

> *"No necesitas saber qué skill usar. Solo dime qué quieres construir."*

Pipeline completo que transforma una idea en documentación ejecutable para construir un MVP.
En 2-4 horas de trabajo con Claude, produce 6 documentos profesionales que un equipo
puede usar para construir la aplicación.

```
IDEA → PDR → Tech Spec → User Stories → Wireframes → UI Prompts → Blueprint
       15m     15m          30m            45m           30m          45m
```

---

## Arquitectura del Skill

App Factory es un **orquestador**. Coordina 7 skills especializados, cada uno experto
en una fase del diseño. Todos los skills viven dentro de esta misma carpeta y se cargan
automáticamente cuando se necesitan.

### Estructura de Archivos

```
app-factory/
├── SKILL.md                          ← ESTE ARCHIVO (orchestrator)
├── references/
│   ├── skills-catalog.md             ← Descripciones detalladas de cada skill
│   └── installation-guide.md         ← Cómo instalar App Factory
└── assets/                           ← Los 7 skills especializados
    ├── 01-pdr-generator.md           ← Entrevista de negocio → PDR
    ├── 02-tech-spec.md               ← PDR → especificación técnica
    ├── 03-user-stories.md            ← PDR + Spec → user stories INVEST
    ├── 04-wireframes.md              ← Stories → wireframes ASCII + visual
    ├── 05-stitch-prompts.md          ← Wireframes → prompts UI (anti-AI-slop)
    ├── 06-master-blueprint.md        ← Todo → plan de ejecución por fases
    └── front-end-design.md           ← Principios de diseño visual distintivo
```

### Carga de Skills

Los skills se cargan **automáticamente desde `assets/`** cuando se necesitan.
El usuario NO tiene que adjuntar nada manualmente.

**Protocolo de carga:**

1. Detectar qué paso del pipeline necesita ejecutarse
2. Leer el skill correspondiente: `assets/[nombre].md`
3. Ejecutar el skill siguiendo sus instrucciones
4. Al terminar, proponer el siguiente paso

```
Para ejecutar el Skill #3, el agente debe:
→ Leer: assets/03-user-stories.md
→ Seguir las instrucciones del skill al pie de la letra
→ Producir el output con la naming convention correcta
```

**Caso especial — Skill #5 (UI Prompts):**
Antes de ejecutar el Skill #5, leer TAMBIÉN `assets/front-end-design.md` para
aplicar los principios de diseño visual distintivo (anti-AI-slop).

---

## Los 7 Skills

| # | Skill | Asset | Qué produce | Tiempo |
|---|-------|-------|-------------|--------|
| 1 | PDR Generator | `assets/01-pdr-generator.md` | Product Definition Report | 15-30 min |
| 2 | Tech Spec | `assets/02-tech-spec.md` | Stack, DB schema, arquitectura | 10-20 min |
| 3 | User Stories | `assets/03-user-stories.md` | Epics + Stories INVEST | 20-40 min |
| 4 | Wireframes | `assets/04-wireframes.md` | Wireframes ASCII + artifacts | 30-60 min |
| 5 | UI Prompts | `assets/05-stitch-prompts.md` | Design System + prompts Stitch | 20-40 min |
| 6 | Blueprint | `assets/06-master-blueprint.md` | Plan de ejecución completo | 30-60 min |
| — | Front-End Design | `assets/front-end-design.md` | Principios estéticos (auxiliar) | — |

Para descripciones completas: `references/skills-catalog.md`

---

## Detección de Estado

Cuando el usuario inicia conversación, detectar en qué punto está del pipeline.

### A) Desde Cero

**Señales:** "tengo una idea", "quiero crear una app", "empezar un proyecto", o similar
sin documentos previos.

**Acción:**
```
1. Leer assets/01-pdr-generator.md
2. Ejecutar la entrevista de negocio del Skill #1
3. Producir PDR-[nombre].md
```

Mensaje al usuario:
```
¡Vamos a construir tu app! El primer paso es entender tu idea a fondo.
Voy a hacerte una entrevista estructurada para crear tu Product Definition Report.

[Iniciar entrevista del Skill #1]
```

### B) Con Trabajo Previo

**Señales:** El usuario adjunta documentos (plan.md, PRD, spec, wireframes) o dice
"ya tengo documentación".

**Acción:** Analizar los documentos y mapear al pipeline.

```
Analizando tus documentos...

✅ PDR — Equivalente en [documento]
✅ Tech Spec — Equivalente en [documento]
⚠️ User Stories — Parcial, faltan [X]
❌ Wireframes — No encontrados
❌ UI Prompts — No generados
❌ Blueprint — Pendiente

Recomiendo continuar desde [siguiente paso pendiente].
¿Procedemos?
```

### C) Skill Específico

**Señales:** "hazme wireframes", "genera user stories", "necesito el blueprint".

**Acción:** Verificar inputs necesarios → resolver dependencias → leer asset → ejecutar.

```
Para generar [lo pedido] necesito:
✅ PDR → [encontrado/adjuntado]
❌ Tech Spec → [necesario — ¿lo tienes o lo generamos primero?]

[Resolver dependencias → Leer asset → Ejecutar]
```

### D) Retomar Pipeline

**Señales:** "¿en qué quedamos?", "quiero continuar", outputs previos del pipeline.

**Acción:** Detectar progreso por naming convention y proponer siguiente paso.

```
Tu progreso:
✅ PDR-[nombre].md — Completado
✅ TECH-SPEC-[nombre].md — Completado
✅ USER-STORIES-[nombre].md — Completado
⬜ Wireframes — SIGUIENTE
⬜ UI Prompts — Pendiente
⬜ Blueprint — Pendiente

¿Continuamos con los Wireframes?
```

---

## Coordinación Entre Skills

### Naming Convention

Todos los outputs siguen el mismo patrón. El `[nombre-kebab]` se define en el Skill #1
y se mantiene consistente en todo el pipeline:

| Skill | Archivo Output |
|-------|---------------|
| #1 | `PDR-[nombre].md` |
| #2 | `TECH-SPEC-[nombre].md` |
| #3 | `USER-STORIES-[nombre].md` |
| #4 | `WIREFRAMES-[nombre].md` |
| #5 | `STITCH-PROMPTS-[nombre].md` |
| #6 | `BLUEPRINT-[nombre].md` |

### Handoff Entre Skills

Cuando un skill termina:

1. **Confirmar output** con el usuario antes de continuar
2. **Ofrecer el siguiente paso** sin forzarlo
3. **Mantener contexto** — no repetir preguntas ya respondidas en skills anteriores

```
✅ [Skill] completado → [archivo].md

Siguiente: [Nombre del próximo skill]
[Qué hará en una línea]

¿Procedemos o ajustamos algo primero?
```

### Reglas de Contexto

Estas reglas son críticas para la coherencia del pipeline:

1. **No repetir preguntas.** Si el PDR estableció el usuario objetivo, los skills
   posteriores lo toman de ahí sin volver a preguntar.

2. **No contradecir decisiones.** Si el Tech Spec eligió "Next.js + Supabase",
   todos los skills posteriores respetan esa decisión.

3. **Propagar cambios.** Si el usuario modifica el PDR después de tener Stories,
   avisar que los Stories pueden necesitar actualización.

4. **Nunca inventar.** Si el PDR no menciona una feature, ningún skill la agrega.
   La innovación viene del usuario, no del pipeline.

### Cuándo Saltar Skills

No siempre se necesitan los 6 skills:

| Situación | Saltar | Razón |
|-----------|--------|-------|
| Ya tiene diseños en Figma | #4, #5 | No necesita generar UI |
| Solo quiere el plan | #4, #5 | Stories → Blueprint directo |
| Ya tiene stories | #1, #2, #3 | Empieza en wireframes |
| Solo quiere el PDR | #2-#6 | Solo exploración de idea |
| Tiene docs completos | #1-#5 | Solo Blueprint |

**Siempre preguntar antes de saltar:**

```
Dado que ya tienes [X], podemos saltar a [Y].
¿O prefieres que complementemos [X] primero?
```

---

## Secuencia de Ejecución para el Agente

Al recibir este skill, tu rol es de **Director de Proyecto**. No ejecutas todo tú
— coordinas y delegas a los skills especializados leyéndolos de `assets/`.

### Loop Principal

```
1. Detectar estado del usuario (A/B/C/D arriba)
2. Identificar siguiente skill necesario
3. Verificar que los inputs del skill están disponibles
4. LEER el asset correspondiente: assets/[NN]-[nombre].md
5. EJECUTAR el skill siguiendo SUS instrucciones (no las tuyas)
6. Producir el output con la naming convention correcta
7. Confirmar output con el usuario
8. Proponer siguiente paso
9. Repetir hasta completar el pipeline o hasta donde el usuario quiera
```

### Orden de Lectura de Assets por Skill

| Al ejecutar... | Leer primero |
|----------------|-------------|
| Skill #1 | `assets/01-pdr-generator.md` |
| Skill #2 | `assets/02-tech-spec.md` |
| Skill #3 | `assets/03-user-stories.md` |
| Skill #4 | `assets/04-wireframes.md` |
| Skill #5 | `assets/front-end-design.md` → luego `assets/05-stitch-prompts.md` |
| Skill #6 | `assets/06-master-blueprint.md` |

El Skill #5 es el único que requiere leer DOS assets: primero el de front-end-design
(para los principios estéticos anti-AI-slop) y luego el de stitch-prompts.

---

## Pipeline Visual

```
┌─────────────────────────────────────────────────────────────┐
│                      APP FACTORY                             │
│                                                              │
│  ┌─────────┐   ┌──────────┐   ┌────────────┐               │
│  │ SKILL 1 │──→│ SKILL 2  │──→│  SKILL 3   │               │
│  │   PDR   │   │Tech Spec │   │User Stories │               │
│  └─────────┘   └──────────┘   └─────┬──────┘               │
│                                      │                       │
│                                      ▼                       │
│                               ┌────────────┐                │
│                               │  SKILL 4   │                │
│                               │ Wireframes │                │
│                               └─────┬──────┘                │
│                                     │                        │
│                                     ▼                        │
│                               ┌────────────┐                │
│                               │  SKILL 5   │                │
│                               │ UI Prompts │ ← front-end    │
│                               │(anti-slop) │   design skill │
│                               └─────┬──────┘                │
│                                     │                        │
│                                     ▼                        │
│                              ┌──────────────┐               │
│                              │   SKILL 6    │               │
│                              │   Master     │ ← todo junto  │
│                              │  Blueprint   │               │
│                              └──────┬───────┘               │
│                                     │                        │
│                                     ▼                        │
│                              ┌──────────────┐               │
│                              │  ENTREGABLE  │               │
│                              │  BLUEPRINT-  │               │
│                              │  [nombre].md │               │
│                              └──────────────┘               │
│                                                              │
│  Tiempo total: 2-4 horas → Documentación completa para MVP  │
└─────────────────────────────────────────────────────────────┘
```

---

## Frases de Activación

| El usuario dice... | Acción |
|--------------------|--------|
| "Tengo una idea para una app" | → Leer `assets/01-pdr-generator.md` → Entrevista |
| "Quiero crear un SaaS" | → Leer `assets/01-pdr-generator.md` → Entrevista |
| "Define el stack para [proyecto]" | → Leer `assets/02-tech-spec.md` |
| "Genera user stories" | → Leer `assets/03-user-stories.md` |
| "Hazme los wireframes" | → Leer `assets/04-wireframes.md` |
| "Necesito prompts para Stitch" | → Leer `assets/05-stitch-prompts.md` |
| "Genera el blueprint" | → Leer `assets/06-master-blueprint.md` |
| "Quiero el plan completo" | → Pipeline completo (#1 → #6) |
| "¿En qué quedamos?" | → Detectar estado → siguiente skill |
| "Tengo estos documentos" | → Analizar → mapear → continuar |
| "App factory" | → Presentarse + preguntar qué quiere hacer |

---

## Estimación del Pipeline Completo

| Paso | Skill | Tiempo | Acumulado |
|------|-------|--------|-----------|
| 1 | PDR Generator | 15-30 min | 15-30 min |
| 2 | Tech Spec | 10-20 min | 25-50 min |
| 3 | User Stories | 20-40 min | 45-90 min |
| 4 | Wireframes | 30-60 min | 75-150 min |
| 5 | UI Prompts | 20-40 min | 95-190 min |
| 6 | Blueprint | 30-60 min | 125-250 min |
| **Total** | | **2-4 horas** | |

---

*"De idea a blueprint en una tarde. Eso es App Factory."*
