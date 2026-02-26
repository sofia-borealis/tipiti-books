# /build — Forge Execution Pipeline

Toma el Blueprint aprobado y lo convierte en código production-ready.

## Qué Hace

1. Lee el `BLUEPRINT-[nombre].md` (debe estar en contexto o indicado por el usuario)
2. Genera el PRP en `.claude/PRPs/PRP-[nombre].md` basado en el Blueprint
3. Presenta el plan de ejecución por fases (máximo 10 líneas)
4. **ESPERA APROBACIÓN EXPLÍCITA** ("go", "sí", "procede", "ok", "adelante")
5. Al recibir aprobación: inicia el bucle agéntico (`.claude/prompts/bucle-agentico-blueprint.md`)

## Handoff Protocol

```
📋 Blueprint leído: BLUEPRINT-[nombre].md

Plan de ejecución:
• Fase 1: Setup + Auth (~2h)
• Fase 2: DB Schema + RLS (~1h)
• Fase 3: Core Features (~4h)
• Fase 4: UI + Testing (~2h)
• Fase 5: Deploy Vercel (~30min)

¿Procedo? (escribe "go" para confirmar o indica ajustes)
```

## Reglas Críticas

- ❌ **NO escribas ninguna línea de código sin recibir "go"** (o equivalente)
- ❌ **NO asumas aprobación** — espera explícitamente
- ✅ El usuario puede modificar fases antes de aprobar
- ✅ El resumen de fases debe ser conciso (10 líneas máximo)
- ✅ Una vez aprobado, ejecutar según `.claude/prompts/bucle-agentico-blueprint.md`

## Cuándo Usar

```
/build                             → Usa el Blueprint en contexto actual
/build BLUEPRINT-inventario.md     → Especifica qué Blueprint usar
```

## Pre-requisitos

- Debe existir un `BLUEPRINT-[nombre].md` generado por `/plan`
- El Blueprint debe estar aprobado por el usuario
- Sin Blueprint no hay construcción (❌ código sin planificación = deuda técnica)

## Flujo Completo

```
/build
  ↓
Leer BLUEPRINT-[nombre].md
  ↓
Generar PRP-[nombre].md en .claude/PRPs/
  ↓
Mostrar fases concisas
  ↓
ESPERAR "go"
  ↓
Ejecutar bucle agéntico por fases
  ↓
Playwright valida visualmente
  ↓
Deploy a Vercel
```
