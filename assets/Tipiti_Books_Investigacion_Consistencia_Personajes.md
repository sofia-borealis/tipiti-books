# TIPITI BOOKS — Investigación: Consistencia de Personajes con IA

**Para ilustraciones de libros infantiles personalizados**
Febrero 2026

---

## 1. Resumen Ejecutivo

Este documento presenta los resultados de una investigación exhaustiva sobre cómo lograr consistencia de personajes en ilustraciones generadas por IA para libros infantiles. Cubre las técnicas disponibles, los modelos recomendados, comparativas de precio y velocidad, y una arquitectura propuesta para el creador de personajes in-app de Tipiti Books.

**Hallazgo principal:** La combinación ganadora para Tipiti Books es usar **FLUX Kontext** para consistencia de personajes (94% de fidelidad) + un **Character Creator basado en Avataaars** (React, open-source) para la personalización in-app + **LoRA training automatizado** vía fal.ai para personajes recurrentes (~$2 por entrenamiento).

---

## 2. El Problema Central: Character Drift

La mayoría de los generadores de imágenes con IA (Midjourney, DALL-E, Stable Diffusion) fueron diseñados para crear una imagen perfecta a partir de un prompt. No fueron diseñados para recordar personajes entre generaciones. Esto significa que al generar diferentes escenas de un libro, el personaje "muta" entre páginas: cambian los rasgos faciales, las proporciones, el estilo de ropa, y hasta el estilo artístico.

Para un libro infantil de 12-15 páginas donde el niño debe reconocer al personaje como él mismo, esto es un deal-breaker. Los niños forman vínculos emocionales con los personajes y necesitan consistencia visual para comprensión y conexión.

---

## 3. Técnicas para Mantener Consistencia

### 3.1 Character Reference Sheets (Hojas de Referencia)

Consiste en crear imágenes canónicas del personaje que sirven como "anclas de identidad" para generaciones posteriores. Se mantienen hojas de referencia mostrando vista frontal, vista lateral, expresiones y variaciones de outfit.

- **Dificultad:** Baja
- **Efectividad sola:** Media (60-70% consistencia)
- **Mejor para:** Punto de partida, combinar con otras técnicas

### 3.2 LoRA Training (Low-Rank Adaptation)

Entrena modelos LoRA personalizados con 15-30 imágenes de referencia del personaje para fijar su identidad visual. Es el estándar de la industria para libros con 10+ páginas del mismo personaje.

- **Imágenes necesarias:** 15-30 (6-12 mínimo para resultados aceptables)
- **Costo:** ~$2 por entrenamiento en fal.ai, $2-12 en GPU propia
- **Tiempo:** 30-90 minutos de entrenamiento
- **Efectividad:** Alta (73-94% según implementación)

### 3.3 FLUX Kontext (Recomendado)

FLUX.1 Kontext de Black Forest Labs es el avance más significativo para consistencia de personajes en 2025-2026. A diferencia de modelos tradicionales text-to-image, Kontext entiende imágenes existentes y las modifica mediante instrucciones de texto, sin necesidad de fine-tuning.

- **Consistencia:** 94% (vs 73% de LoRA tradicional)
- **Velocidad:** 40% más rápido que LoRA tradicional
- **Precio:** $0.04/imagen (pro), $0.08/imagen (max)
- **Ventaja clave:** No requiere entrenamiento previo. Tomas una imagen de referencia y generas variaciones manteniendo identidad
- **Ideal para:** Flujos iterativos como storyboards y narraciones visuales (exactamente libros infantiles)

### 3.4 Midjourney --cref (Character Reference)

Midjourney tiene el parámetro --cref que permite mantener el mismo personaje entre imágenes. Combinado con --cw (character weight) permite controlar cuánto se respeta la referencia.

- **Pros:** Fácil de usar, excelente estilo artístico, buen para acuarela/pintado a mano
- **Contras:** Menos control fino, no tiene API oficial para automatización, requiere Discord

### 3.5 GPT-4o / GPT Image 1

La generación nativa de imágenes de GPT-4o permite refinar personajes a través de conversación, usando el contexto del chat para mantener consistencia. Útil pero menos controlable que Flux Kontext.

### 3.6 Structured Prompting (Prompts Estructurados)

Crear un template base con identidad del personaje, estilo artístico y modificadores de calidad. Luego agregar detalles específicos de cada escena (pose, acción, fondo). El mismo prompt de personaje se reutiliza en todas las páginas.

### 3.7 CharForge (Pipeline Automatizado)

CharForge (GitHub) es el proyecto más cercano a un pipeline completamente automatizado: toma una sola imagen de referencia, genera un character sheet multi-vista, auto-captiona con LoRACaptioner, entrena un LoRA con ai-toolkit, y genera imágenes consistentes. Incluye API Python con scripts train_character.py y test_character.py.

---

## 4. Comparativa de Modelos para Ilustración Infantil

Evaluación de los principales modelos según estilo "ilustración pintada a mano", consistencia, precio y velocidad:

| Modelo | Estilo Acuarela | Consistencia | Precio/img | Automatizable | Veredicto |
|--------|----------------|--------------|------------|---------------|-----------|
| **FLUX Kontext** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $0.04-0.08 | Sí (API) | **RECOMENDADO** |
| **Midjourney** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ~$0.03-0.05 | Limitado | Mejor estilo |
| **Leonardo AI** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Desde $12/mes | Sí (API) | Buen balance |
| **GPT-4o** | ⭐⭐⭐ | ⭐⭐⭐ | $0.02-0.08 | Sí (API) | Versátil |
| **Neolemon** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $29/mes | No (web only) | Fácil de usar |
| **Flux + LoRA** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $2 train + $0.02/img | Sí (API) | Máx control |

---

## 5. Arquitectura Recomendada para Tipiti Books

### 5.1 El Character Creator In-App

Para que el papá pueda crear el personaje de su hijo dentro de la app, escogiendo características físicas (pelo, piel, ojos, pecas, lentes, cejas, boca), la arquitectura recomendada tiene dos fases:

**Fase 1: Selección Visual (UI) → Avatar SVG**

Usar la librería open-source Avataaars (React component, MIT license) como base del creador. El padre selecciona partes del personaje con controles intuitivos: tipo de pelo y color, tono de piel, forma y color de ojos, cejas, boca, accesorios (lentes, pecas, etc.). El resultado es un avatar estilizado en SVG/PNG que sirve como "especificación visual" del personaje.

**Fase 2: Avatar → Personaje Ilustrado (IA)**

El avatar generado se usa como referencia para generar el personaje en estilo "ilustración pintada a mano" usando FLUX Kontext. El flujo sería:

1. El padre completa el Character Creator → se genera un avatar SVG con las características elegidas
2. Se envía el avatar + un prompt de estilo a FLUX Kontext para generar el "character sheet" ilustrado (vista frontal, lateral, expresiones)
3. El character sheet ilustrado se guarda como referencia para todas las escenas del libro
4. Para cada escena, se usa FLUX Kontext con la referencia + descripción de la escena para generar la ilustración manteniendo consistencia

### 5.2 Librerías Open-Source para el Character Creator

| Librería | Tipo | Personalización | Output |
|----------|------|-----------------|--------|
| **Avataaars (React)** | Cartoon 2D, estilo ilustración | Pelo, piel, ojos, cejas, boca, ropa, accesorios | SVG/PNG + React code |
| **DiceBear** | 30+ estilos, API | Pelo, ojos, accesorios, colores | SVG vía URL/API |
| **React Nice Avatar** | Cartoon minimalista | Sexo, pelo, forma cara | React component |
| **Character Creator (.org)** | Cartoon detallado | Sexo, piel, pelo, ropa completa | SVG descargable |

**Recomendación:** Usar Avataaars como base y extenderlo/personalizarlo para el estilo visual de Tipiti Books. Es React nativo, open-source (MIT), genera SVG limpio, y tiene la personalización más completa de todas las opciones.

---

## 6. Pipeline Completo Propuesto

### 6.1 Flujo de Personalización

El pipeline end-to-end para cuando un padre personaliza un libro:

1. El padre abre la web → elige libro del catálogo → ingresa nombre del niño
2. Abre el Character Creator → selecciona pelo, piel, ojos, accesorios → genera avatar
3. El avatar + estilo del libro se envían a FLUX Kontext vía API (fal.ai o Replicate)
4. FLUX Kontext genera el character sheet ilustrado del personaje (3-5 vistas)
5. Para cada escena del libro (12-15), se genera la ilustración con el personaje consistente
6. Se arma el PDF del libro (preview para el padre)
7. Si compra → se envía a Gelato API para impresión

### 6.2 ¿Se Necesita Entrenar un LoRA por Personaje?

**Respuesta corta: No necesariamente.** FLUX Kontext puede mantener consistencia sin entrenamiento previo usando solo imágenes de referencia. Esto es crítico para Tipiti Books porque cada personaje es único (se parece al hijo del cliente) y entrenar un LoRA por cada pedido agregaría 30-90 minutos de espera y ~$2 extra.

**Flujo recomendado sin LoRA:** Avatar → FLUX Kontext (generar character sheet) → FLUX Kontext (generar cada escena usando character sheet como referencia). Costo estimado: $0.04-0.08 x 15 escenas = $0.60-$1.20 por libro.

**Flujo con LoRA (para personajes recurrentes):** Si un padre quiere múltiples libros con el mismo personaje, ahí sí conviene entrenar un LoRA una vez ($2) y reutilizarlo. Se puede ofrecer como feature premium: "Guarda tu personaje para futuros libros".

---

## 7. Costos Estimados por Libro (Generación de Imágenes)

| Concepto | Sin LoRA (Kontext) | Con LoRA |
|----------|-------------------|----------|
| Character Sheet (5 vistas) | $0.20-0.40 | $2.00 (train) + $0.10 |
| 15 Ilustraciones de escenas | $0.60-1.20 | $0.30-0.60 |
| Regeneraciones (2x promedio) | $0.40-0.80 | $0.20-0.40 |
| **TOTAL por libro** | **$1.20-2.40** | **$2.50-3.10 (1er libro)** |
| Libros siguientes (con LoRA) | N/A | **$0.50-1.00** |

**Conclusión de costos:** Con un precio de venta de $30-45 USD por libro y un costo de generación de imágenes de $1-3, más ~$10-15 de impresión y envío, el margen es excelente (50%+).

---

## 8. Lo Que Está Haciendo la Comunidad

### 8.1 Foros y Reddit

La comunidad está dividida. Algunos advierten que el nicho de libros infantiles con IA está saturado de "AI slop" y que los libros hechos con IA rara vez venden. Otros argumentan que para un MVP o un producto diferenciado, las herramientas de IA son viables si se logra calidad premium.

Las herramientas más mencionadas en foros son Midjourney (por su calidad artística), Leonardo AI (por su facilidad de uso y Image Guidance), y Neolemon (plataforma dedicada a libros infantiles con 20,000+ creadores). También se menciona frecuentemente ComfyUI + Flux como el setup más potente para control total.

### 8.2 Técnica del "Money Shot"

La técnica de Benja para videos infantiles aplica perfectamente a libros. Consiste en generar primero una imagen "hero" del personaje (el money shot) con máxima calidad y detalle, y luego usar esa imagen como ancla para todas las variaciones posteriores. Con FLUX Kontext, esta técnica es nativa: generas el character sheet perfecto y lo usas como referencia para cada escena.

### 8.3 Plataformas Dedicadas

Neolemon es la plataforma más avanzada dedicada específicamente a libros infantiles con consistencia de personajes. Su Character Consistency Engine permite generar el mismo personaje en escenas ilimitadas. Sin embargo, no tiene API para automatización, lo que la descarta como backend para Tipiti Books. Es útil como referencia de UX y benchmark de calidad.

---

## 9. Recomendaciones de Estilo "Pintado a Mano"

Para lograr el estilo "ilustración pintada a mano" y evitar el look Pixar/3D genérico, estos son los modificadores de prompt más efectivos:

**Prompt base recomendado:**

> "soft watercolor children's book illustration, gentle brush strokes, warm pastel color palette, hand-painted storybook style, whimsical and tender, editorial quality children's picture book art, NOT 3D, NOT Pixar, NOT photorealistic"

**Negative prompts críticos:**

> "3D render, CGI, Pixar style, Disney 3D, photorealistic, plastic, shiny, glossy, digital art, anime, manga, cartoon network style"

Midjourney es el mejor para estilo acuarela out-of-the-box, pero FLUX Kontext con los prompts correctos logra resultados muy similares y tiene la ventaja de API + consistencia superior.

---

## 10. Stack Técnico Recomendado para Tipiti Books

- **Creador de Personajes:** Avataaars (React) → personalizado al estilo Tipiti
- **Generación de Imágenes:** FLUX Kontext Pro vía fal.ai API ($0.04/imagen)
- **Consistencia:** FLUX Kontext (referencia in-context) + LoRA opcional para personajes recurrentes
- **Estilo:** Prompts estructurados con negative prompts anti-Pixar
- **Orquestación:** N8N (webhook → Notion → fal.ai → PDF → Gelato)
- **Catálogo:** Notion (base de datos de libros, escenas, prompts por escena)
- **Web:** Next.js / Lovable (preview del libro + checkout)
- **Impresión:** Gelato API (print-on-demand global)

### 10.1 Flujo Técnico Simplificado

Web (padre personaliza) → API call a backend → N8N webhook recibe datos → Consulta libro en Notion → Para cada escena: llama fal.ai con FLUX Kontext + referencia del personaje + prompt de escena → Recibe imágenes → Arma PDF con texto bilingüe → Envía preview al padre → Si compra: envía PDF final a Gelato API

---

## 11. Nota Legal Importante

Según las guías del US Copyright Office (2025), el contenido 100% generado por IA no puede ser registrado bajo copyright, aunque los autores retienen derechos sobre la compilación y arreglo de obras asistidas por IA. Para Tipiti Books, esto significa que los textos originales de los cuentos (escritos por humanos) sí tienen copyright, y la selección, arreglo y combinación de ilustraciones también. Es recomendable documentar la intervención humana en el proceso creativo.

---

## 12. Próximos Pasos Sugeridos

1. Hacer prueba de concepto con FLUX Kontext: generar 5 escenas del cuento "Buenas Noches" con un personaje consistente usando fal.ai
2. Evaluar Avataaars como base del Character Creator: fork del repo, personalizar estilos al look Tipiti
3. Definir el "Character DNA Template": las características exactas que el padre podrá personalizar
4. Crear el prompt master: template de prompt que combine el estilo del libro + características del personaje + descripción de escena
5. Probar pipeline básico en N8N: webhook → fal.ai → imagen de vuelta
6. Benchmark de calidad: comparar output de FLUX Kontext vs Midjourney --cref vs las ilustraciones de tu prima

---

## 13. Fuentes de Investigación

- [FLUX.1 Kontext - Black Forest Labs](https://bfl.ai/models/flux-kontext)
- [Consistent Characters Across 20+ Pages Pipeline](https://www.musketeerstech.com/for-ai/consistent-characters-ai-childrens-books/)
- [Together.ai - FLUX.1 Kontext Models](https://www.together.ai/blog/flux-1-kontext)
- [FLUX Kontext on Replicate](https://replicate.com/blog/flux-kontext)
- [Segmind - Create Consistent Character with Flux](https://blog.segmind.com/create-consistent-character-with-flux-1-with-1-image/)
- [Z-Image - Flux 1.1 for AI Storybook](https://z-image.ai/blog/use-flux-1-1-for-ai-storybook-and-children-s-illustrations)
- [Avataaars React Component](https://github.com/fangpenlin/avataaars)
- [DiceBear Avatar Library](https://dicebear.com)
- [CharForge - Automated Character Pipeline](https://github.com/RishiDesai/CharForge)
- [Civitai - Training Character LoRA](https://civitai.com/articles/12789/training-a-character-lora-from-a-character-sheet)
