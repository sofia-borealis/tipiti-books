# /plan — Forge Planning Pipeline

Activa el pipeline completo de planificación de App Factory.

## Qué Hace

1. Lee `.claude/skills/app-factory/SKILL.md`
2. Detecta el estado del usuario (desde cero, con docs previos, skill específico, retomar)
3. Ejecuta el pipeline secuencial: PDR → Tech Spec → User Stories → Wireframes → UI Prompts → Blueprint
4. Al terminar el Blueprint, propone transición a `/build`

## Cuándo Usar

```
/plan                              → Desde cero (Forge te entrevistará)
/plan tengo una idea para X        → Desde cero con contexto inicial
/plan wireframes                   → Saltar directo al skill de wireframes
/plan blueprint                    → Generar solo el blueprint (con docs previos)
```

## Protocolo de Activación

Al recibir `/plan`:

1. **Cargar el skill** — Leer `.claude/skills/app-factory/SKILL.md` completo
2. **Detectar estado** — ¿Tiene el usuario documentos previos? ¿Pide un skill específico?
3. **Ejecutar** — Seguir el protocolo del orchestrator en SKILL.md
4. **Al terminar** — Mostrar el mensaje de cierre y sugerir `/build`

## Mensaje de Cierre (al terminar el Blueprint)

```
✅ BLUEPRINT-[nombre].md generado.

Tienes el plan completo para construir tu app.
Cuando estés listo para construir, usa /build.
```

## Notas

- **NUNCA saltes pasos** sin confirmar con el usuario
- Si el usuario ya tiene algún documento (PDR, Tech Spec, etc.), detéctalos y empieza desde ahí
- Cada skill genera un archivo `.md` en el directorio raíz del proyecto
- El Blueprint es el output final y el input requerido para `/build`
