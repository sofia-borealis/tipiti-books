---
description: "Actualiza Forge a la ultima version. Busca el alias forge, hace git pull y reemplaza la carpeta .claude/"
---

# Update Forge

Este comando actualiza las herramientas de desarrollo (carpeta `.claude/`) a la ultima version disponible.

## Proceso

### Paso 1: Buscar el alias forge

Busca el alias `forge` en los archivos de configuracion del shell del usuario:

```bash
# Buscar en zshrc
grep "alias forge" ~/.zshrc

# Si no esta, buscar en bashrc
grep "alias forge" ~/.bashrc
```

El alias tiene este formato:
```bash
alias forge="cp -r /ruta/al/repo/forge/forge/. ."
```

**Extrae la ruta del repo** del alias (la parte entre `cp -r ` y `/forge/.`).

Si no encuentras el alias, pregunta al usuario:
> No encontre el alias `forge`. Por favor, indica la ruta donde tienes el repositorio de Forge.

### Paso 2: Actualizar el repositorio fuente

Una vez tengas la ruta del repo, actualiza con git:

```bash
cd [RUTA_REPO_FORGE]
git pull origin main
```

Si hay errores de git (cambios locales, etc.), informa al usuario y sugiere solucion.

### Paso 3: Reemplazar .claude/

Elimina la carpeta `.claude/` actual del proyecto y copia la nueva:

```bash
# En el directorio del proyecto actual
rm -rf .claude/
cp -r [RUTA_REPO_FORGE]/forge/.claude/ .claude/
```

### Paso 4: Confirmar actualizacion

Informa al usuario:

```
Forge actualizado correctamente.

Cambios aplicados:
- .claude/commands/       (comandos actualizados — /plan, /build, etc.)
- .claude/agents/         (agentes actualizados)
- .claude/PRPs/           (templates PRP actualizados)
- .claude/ai_templates/   (bloques LEGO actualizados)
- .claude/design-systems/ (sistemas de diseno actualizados)
- .claude/skills/         (skills actualizados — App Factory incluido)
- .claude/prompts/        (metodologias actualizadas)

Archivos NO modificados:
- CLAUDE.md (tu configuracion de proyecto)
- example.mcp.json (tus tokens y credenciales)
- src/ (tu codigo)
```

## Notas

- Este comando NO modifica `CLAUDE.md`, `example.mcp.json` ni el codigo fuente
- Solo actualiza la "toolbox" de desarrollo (comandos, agentes, skills, templates)
- Si necesitas actualizar `CLAUDE.md` manualmente, revisa el template en el repo Forge
