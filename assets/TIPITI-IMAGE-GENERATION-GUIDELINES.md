# TIPITI-IMAGE-GENERATION-GUIDELINES.md

> **Documento técnico de referencia para generación de imágenes con IA**
> Versión: 3.0 | Febrero 2026
> Uso: Este documento es la fuente de verdad para todos los documentos técnicos del proyecto (PDR, Tech Spec, User Stories, Blueprint). Cualquier decisión de generación de imágenes debe alinearse con estos lineamientos.

---

## 1. Decisión Arquitectónica: Pre-Generación por Variantes

### 1.1 Modelo de Pre-Generación (v3.0)

Tipiti Books adopta un modelo de **pre-generación por variantes de personaje**. En lugar de generar imágenes bajo demanda por cada compra, se pre-generan TODAS las combinaciones posibles de personaje para cada libro del catálogo. Al momento de la compra, el sistema busca el set de ilustraciones pre-generadas que corresponde a la selección del comprador y le superpone los textos personalizados (nombre + dedicatoria) como capa de texto, no como parte de la imagen.

```
MODELO ANTERIOR (descartado):
  Compra → Generar imágenes con IA → QA → Imprimir → Enviar
  Costo por venta: $1-2 USD (generación) + riesgo de inconsistencia

MODELO ACTUAL (adoptado):
  [Una vez] Admin genera + cura las ~80 variantes por libro
  Compra → Lookup variante → Superponer texto (nombre) → Imprimir → Enviar
  Costo por venta: $0 USD en generación. Costo fijo total: ~$35 por libro.
```

### 1.2 Combinatoria de Variantes (V1) — Validez Biológica

| Atributo | Opciones | Valores |
|----------|----------|---------|
| Género | 2 | niño, niña |
| Tono de piel | 3 | claro, mate, oscuro |
| Color de pelo | 4* | rubio, castaño, pelirrojo, negro |
| Tipo de pelo | 2 | liso, ondulado |
| Lentes | 2 | sí, no |
| Ojos | 1 (fijo) | puntitos negros |

**Nota sobre color de pelo:** Inicialmente se ofrecían todas las combinaciones (4 colores × 3 tonos = 12), pero se han eliminado combinaciones biológicamente implausibles:
- ~~Oscuro + Rubio~~ ❌ (implausible)
- ~~Oscuro + Pelirrojo~~ ❌ (implausible)
- **Oscuro + Negro** ✓ (común en familias asiáticas, mixtas en Chile)
- Claro + Rubio ✓
- Claro + Castaño ✓
- Claro + Pelirrojo ✓
- Claro + Negro ✓ (mixto)
- Mate + Rubio ✓
- Mate + Castaño ✓
- Mate + Pelirrojo ✓
- Mate + Negro ✓

**Cálculo actualizado:**
- Base: 2 genders × 3 skin tones × ~3.3 hair colors promedio* × 2 hair types = ~40 combinaciones
- Con lentes (sí/no): 40 × 2 = **~80 variantes** por libro

*Promedio de colores válidos por tono: claro=4, mate=4, oscuro=1

**Imágenes por variante:** 1 portada + 9 spreads + 1 página final = **11 imágenes**
**Total por libro:** 80 × 11 = **880 imágenes**
**Costo total:** 880 × $0.04 = **~$35 USD** (una sola vez por libro)

### 1.3 Tabla de Validez de Combinaciones (Matriz Tono-Color)

| Tono de Piel | Rubio | Castaño | Pelirrojo | Negro | Total |
|--------------|-------|---------|-----------|-------|-------|
| Claro | ✓ | ✓ | ✓ | ✓ | 4 |
| Mate | ✓ | ✓ | ✓ | ✓ | 4 |
| Oscuro | ❌ | ❌ | ❌ | ✓ | 1 |
| **Total** | **2** | **2** | **2** | **3** | **~40 base × 2 (lentes) = 80** |

### 1.4 Arquitectura de 3 Capas Independientes

Tipiti Books se estructura en **3 capas que se crean, escalan y versionan de forma totalmente independiente**. Este principio arquitectónico es la base de todas las decisiones de generación de imágenes, composición y almacenamiento.

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPA 3 — TEXTO PERSONALIZADO (por compra)                      │
│  Nombre del niño ({name}), dedicatoria, idioma                  │
│  Se genera al instante. Costo: $0. Escala: infinita.           │
│  → NO es parte de la imagen. Se superpone como texto.           │
├─────────────────────────────────────────────────────────────────┤
│  CAPA 2 — PERSONAJE (por variante, ~80 combinaciones)          │
│  Ilustraciones pre-generadas con AI configurable + curadas      │
│  Se genera UNA vez por libro. Costo: ~$35-70. Escala: fija.    │
│  → ES la imagen. Se almacena en character_variants/variant_pages│
├─────────────────────────────────────────────────────────────────┤
│  CAPA 1 — EL CUENTO (por libro del catálogo)                   │
│  Escenas, ambientes, setting sheets, estructura narrativa       │
│  Se crea y cura UNA vez. Escala: manual (Sofi agrega libros).  │
│  → Define QUÉ se genera. Es el "template" (books + scenes).    │
└─────────────────────────────────────────────────────────────────┘
```

**Implicación clave para generación de imágenes:** La Capa 2 (ilustraciones) NUNCA contiene elementos de la Capa 3 (texto, nombres). Esto es una regla inquebrantable del prompt builder: los prompts no incluyen el nombre del niño, y el NEGATIVE_BLOCK incluye `NO text, NO letters, NO words`. Todo texto se superpone después, en la fase de composición.

**Implicación para escalabilidad:**
- Agregar un idioma (V2) = solo agregar texto en Capa 3. Las 880 ilustraciones no se tocan.
- Corregir un texto = solo editar `scenes.text_narrative`. Las ilustraciones no se regeneran.
- Agregar un libro = crear escenas (Capa 1) + generar ~80 variantes (Capa 2). La Capa 3 funciona automáticamente.

### 1.5 Composición del Archivo Final (Superposición de Capas)

Al momento de la compra, las 3 capas se combinan para producir el archivo de impresión:

```
Archivo final para impresión (por página) =
  Capa 1: Template de escena (scenes → define composición, posición de texto)
  Capa 2: Ilustración pre-generada (variant_pages → la imagen)
  Capa 3: Texto personalizado superpuesto:
    - Texto narrativo con {name} reemplazado (scenes.text_narrative)
    - Dedicatoria (solo en página designada)
    - (V2: Texto en segundo idioma, usando espacio negativo reservado)
```

### 1.6 Justificación Técnica del Motor

| Criterio | IP-Adapter/InstantID (descartado) | Motor Configurable (adoptado) |
|----------|----------------------------------|------------------------|
| Consistencia en múltiples poses | Se degrada en ángulos laterales | 94% fidelidad, robusto en poses variadas |
| Edición iterativa | Cada regeneración introduce drift | Preserva identidad tras múltiples ediciones |
| Identidad artística vs fotográfica | Optimizado para fotos reales | Funciona nativamente con estilos artísticos |
| Complejidad operacional | ComfyUI + SDXL + LoRA + IP-Adapter | Una API call por imagen, zero DevOps |
| Time to market | Semanas-meses de setup | Días |
| **Flexibilidad de modelo** | Locked a IP-Adapter | Configurable por libro en DB |

---

## 2. Principio de Determinismo

### 2.1 Garantía de Identidad Replicada

**Dos compradores que eligen la misma variante reciben ilustraciones IDÉNTICAS. No hay randomness.**

Este es un principio arquitectónico fundamental y una ventaja de calidad (no una limitación):

```typescript
// Ilustración final determinística
const illustration = await getVariantPage(variant_id, scene_id);
// → Siempre devuelve la MISMA ilustración, nunca varía
// → Seed fijo documentado en variant_pages.seed_used
// → Familia de niños con el mismo personaje obtiene la misma ilustración base
```

**Implicaciones:**

1. **Calidad consistente:** Cada variante se aprueba UNA SOLA VEZ y se replica. Sin variabilidad.
2. **Costos predecibles:** Los costos de generación y curation son exactos y amortizables.
3. **Trazabilidad:** Es imposible perder una ilustración; se regenera desde seed + prompt documentados.
4. **Escalabilidad:** La aprobación de 80 variantes × 11 páginas = 880 aprobaciones totales por libro, luego escala a infinito.

**Documentación de seeds:**
```sql
-- En variant_pages
seed_used INTEGER NOT NULL,  -- Seed exacto de FLUX para reproducibilidad
prompt_used TEXT NOT NULL,   -- Prompt completo (si cambia, hay que regenerar)
```

No se genera ningún componente aleatorio en el pipeline. La "creatividad" está congelada en el momento de aprobación.

---

## 3. Motor de IA Configurable por Libro

### 3.1 Rechazo de Hardcoding

Anterior (v2.0): Motor `FLUX Kontext Pro` hardcodeado en código.

**Problema:** Los modelos de IA evolucionan rápidamente. Si cambia el modelo recomendado (Kling 1.6, NanoBANA, FLUX Max, etc.), hay que reescribir código.

### 3.2 Solución: Campo `generation_engine` en DB

En la tabla `books`:

```sql
ALTER TABLE books ADD COLUMN generation_engine TEXT DEFAULT 'flux-kontext-pro';
-- Valores válidos: 'flux-kontext-pro', 'flux-kontext-max', 'kling-1.6', 'nanobanana'
```

El pipeline de Inngest **lee este campo dinámicamente**:

```typescript
async function generateVariantPage(variant: CharacterVariant, book: Book, scene: Scene) {
  const engineToUse = book.generation_engine;  // Lee de DB, no hardcodeado

  const endpoint = getEndpointForEngine(engineToUse);
  // → si 'flux-kontext-pro': fal-ai/flux-pro/kontext
  // → si 'kling-1.6': api.kling.ai/v1/generate
  // → etc.

  const result = await callGenerationAPI(endpoint, prompt, variant.portrait_url);
  return result;
}
```

**Admin UI:** Selector dropdown en `Books > Edit` para cambiar el engine sin tocar código.

**Beneficio:** Si Sofi descubre que Kling 1.6 da mejor consistencia, cambia el dropdown, y la próxima vez que genere un libro, usa Kling. Sin deploy.

---

## 4. Money Shot Methodology — Generación Estructurada

### 4.1 Problema: Drift Visual

En la v2.0, cada página se generaba independientemente con `image-to-image` del portrait. Resultado: El personaje variaba sutilmente de página en página, especialmente en pose/expresión.

**Solución:** Sistema de dos niveles con Character Sheet como referencia visual consistente.

### 4.2 Flujo de Generación (Money Shot)

**Paso 1: PORTRAIT (Money Shot)**
```
Input: Character attributes + illustrator style references
Output: Frontal portrait único que define al personaje para SIEMPRE
  → Talla de cara, proporciones, color, accesorios (lentes), expresión base
  → NO se cambia nunca. Una vez aprobado por Sofi → congelado.
```

**Paso 2: CHARACTER SHEET (4 vistas)**
```
Input: Portrait aprobado (image-to-image reference)
Output: 4 vistas del mismo personaje:
  - Frontal (frente)
  - Lateral (perfil)
  - 3/4 (vista ¾)
  - Cuerpo completo
  → Usado en image-to-image para todas las escenas
  → Garantiza que el personaje se ve igual en TODAS las páginas
  → Se genera UNA sola vez por variante
```

**Paso 3: SCENE GENERATION (11 páginas)**
```
Input:
  - Character Sheet (4 vistas como imagen-to-image reference)
  - Setting Sheet (ambiente del libro)
  - Scene description + style reference
Output:
  - 11 imágenes (1 portada + 9 spreads + 1 final) con el mismo personaje
  - Personaje visualmente consistente en todas las páginas
  → Model recibe: prompt + character sheet + setting sheet (multi-reference)
```

**Paso 4: UPSCALE (300 DPI)**
```
Output: Imágenes escaladas a resolución de impresión
  - 5197×2126 px (print-ready, 300 DPI para 22×18 cm)
```

**Paso 5: APROBACIÓN**
```
Sofi revisa y aprueba/rechaza cada página
Si portrait no convence → regenerar PORTRAIT → cascada: nuevo character sheet → nuevas escenas
Si página individual no convence → regenerar solo esa página (mantiene character sheet)
```

### 4.3 Beneficio de Money Shot

| Aspecto | Antes (v2.0) | Ahora (v3.0 Money Shot) |
|---------|-------------|----------------------|
| Consistencia visual | El personaje varía entre páginas | Idéntico en todas las 11 páginas |
| Referencia visual | Solo portrait (~1MB) | Portrait + character sheet 4 vistas (~4MB) |
| Regeneración de página | Requiere nuevo prompt + reoptimización | Regenera solo esa página, mantiene consistency |
| Cambio de estilo | Afecta al portrait y todas las escenas | Afecta solo si regenera character sheet |

---

## 5. Setting Sheet — Ambiente Consistente

### 5.1 Concepto

Así como el CHARACTER SHEET genera 4 vistas del personaje, el SETTING SHEET genera 3 vistas del ambiente/escenario del libro.

**Se genera UNA SOLA VEZ por libro** (no por variante, porque todas las variantes de un libro comparten el mismo ambiente).

### 5.2 Composición

```
SETTING SHEET = 3 vistas del ambiente:
  1. Frontal (main view — lo que ven en la mayoría de spreads)
  2. Lateral (complementary angle)
  3. Close-up detail (textura, detalles, objetos recurrentes)
```

**Ejemplo para "Buenas Noches":**
```
1. Frontal: Habitación de dormir vista desde la puerta
2. Lateral: Misma habitación, vista desde el lado de la cama
3. Detail: Close-up del peluche y la mesita de noche con elementos recurrentes
```

### 5.3 Integración en Pipeline

```
Layer 1 (STORY):
  books
    ├── scenes[]
    │   ├── visual_description
    │   ├── setting_sheet_url ← NEW (una URL por libro)
    │   └── setting_reference_urls[] ← NEW (3 URLs para cada vista del setting)
    └── style_reference_urls[] ← NEW (fotos/arte inspiración)
```

**Se genera:**
- UNA sola vez cuando se crea el libro
- Se almacena en Supabase Storage bucket `settings`
- Se referencia como imagen-to-image en CADA generación de escena

### 5.4 DB Schema

```sql
ALTER TABLE books ADD COLUMN setting_sheet_url TEXT;  -- Opcional, para UI
ALTER TABLE scenes ADD COLUMN setting_sheet_url TEXT;
ALTER TABLE scenes ADD COLUMN setting_reference_urls JSONB DEFAULT '[]';
  -- Ejemplo: {"frontal": "url1", "lateral": "url2", "detail": "url3"}
```

---

## 6. Stack de Generación de Imágenes

### 6.1 Motor Principal: Configurable (v3.0)

No se hardcodea un motor específico. Se elige por libro en DB (`generation_engine`).

**Opciones soportadas:**

| Motor | Endpoint | Costo | Ventaja |
|-------|----------|-------|---------|
| FLUX Kontext Pro | `fal-ai/flux-pro/kontext` | $0.04/img | Balance costo-calidad |
| FLUX Kontext Max | `fal-ai/flux-pro/kontext/max` | $0.08/img | Multi-referencia, máxima fidelidad |
| Kling 1.6 | `api.kling.ai/v1/generate` | Variable | Anime-friendly, estilo |
| NanoBANA | `api.nanobanana.ai/v1` | Variable | Velocidad, bajo costo |

**Admin elige en Books > Edit:**
```
Libro: "Buenas Noches"
Generation Engine: [ FLUX Kontext Pro ▼ ]
  - FLUX Kontext Pro
  - FLUX Kontext Max
  - Kling 1.6
  - NanoBANA
```

### 6.2 Motor Auxiliar: FLUX + LoRA de Estilo (Fase 2+)

- **Trainer:** `fal-ai/flux-kontext-trainer` o `fal-ai/flux-lora-fast-training`
- **Inferencia con LoRA:** `fal-ai/flux-lora`
- **Costo de entrenamiento:** ~$2 por run (1000 steps)
- **Trigger word:** Token único por estilo (ej: `tipiti_watercolor_v1`)

### 6.3 Almacenamiento

- **Portraits de variante:** Supabase Storage (bucket `portraits`)
- **Character sheets:** Supabase Storage (bucket `character-sheets`)
- **Setting sheets:** Supabase Storage (bucket `settings`)
- **Ilustraciones pre-generadas:** Supabase Storage (bucket `illustrations`)
- **Ilustraciones hi-res (print-ready):** Supabase Storage (bucket `illustrations-hires`)
- **LoRAs entrenados:** fal.ai (URL devuelto post-entrenamiento) + referencia en Supabase

---

## 7. Modelo de Datos — Pre-Generación

### 7.1 Schema de la Tabla `character_variants`

Cada variante es una combinación única de rasgos físicos para un libro específico. No está vinculada a un usuario ni a un pedido — es un "template visual" pre-generado.

```sql
CREATE TABLE character_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) NOT NULL,

  -- Combinación de rasgos (define la unicidad)
  gender TEXT NOT NULL,                    -- 'boy', 'girl'
  hair_color TEXT NOT NULL,                -- 'blonde', 'brown', 'red', 'black'
  hair_type TEXT NOT NULL,                 -- 'straight', 'wavy'
  skin_tone TEXT NOT NULL,                 -- 'light', 'medium', 'dark'
  has_glasses BOOLEAN NOT NULL DEFAULT FALSE,

  -- Rasgos fijos (no configurables por el comprador)
  eye_style TEXT DEFAULT 'black_dots',     -- siempre puntitos negros en V1

  -- Imágenes de referencia generadas
  portrait_url TEXT,                       -- portrait frontal base (money shot)
  character_sheet_urls JSONB,              -- {"frontal": "url", "lateral": "url", "three_quarter": "url", "full_body": "url"}

  -- Estado de curación
  status TEXT DEFAULT 'pending',           -- 'pending', 'generating', 'generated', 'approved', 'rejected'
  approved_by TEXT,                        -- admin que aprobó
  approved_at TIMESTAMPTZ,

  -- Tracking
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unicidad: una sola variante por combinación por libro
  UNIQUE(book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
);

-- Índice para lookup rápido en tiempo de compra
CREATE INDEX idx_variant_lookup ON character_variants(book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
  WHERE status = 'approved';
```

### 7.2 Schema de la Tabla `variant_pages`

Cada variante tiene un set completo de páginas pre-generadas (1 por escena del libro).

```sql
CREATE TABLE variant_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES character_variants(id) NOT NULL,
  scene_id UUID REFERENCES scenes(id) NOT NULL,

  -- Imagen pre-generada
  image_url TEXT NOT NULL,                 -- ilustración estándar (web preview)
  image_url_hires TEXT,                    -- versión upscaled para impresión (300 DPI)

  -- Metadata de generación (para debugging y reproducibilidad)
  prompt_used TEXT NOT NULL,
  seed_used INTEGER NOT NULL,              -- Seed exacto para reproducibilidad determinística
  generation_model TEXT NOT NULL,          -- 'flux-kontext-pro', 'kling-1.6', etc. (actual usado)
  generation_cost DECIMAL(6,4),
  reference_images_used JSONB,             -- {"character_sheet": "url", "setting_sheet": "url"}

  -- Estado de curación
  status TEXT DEFAULT 'generated',         -- 'generating', 'generated', 'approved', 'rejected'
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(variant_id, scene_id)
);
```

### 7.3 Tabla `books` (actualizada)

```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,                -- 'buenas-noches'
  title_template TEXT NOT NULL,             -- 'Buenas Noches, {name}'
  style_prompt TEXT NOT NULL,               -- STYLE_BLOCK fijo del libro
  style_lora_url TEXT,                      -- URL del LoRA de estilo (Fase 2+)
  total_scenes INTEGER NOT NULL,            -- 9 (spreads) + portada + final = 11
  target_age TEXT DEFAULT '0-3',            -- rango de edad objetivo
  default_language TEXT DEFAULT 'es',
  available_languages TEXT[] DEFAULT '{"es"}',

  -- Motor de generación (V3.0)
  generation_engine TEXT DEFAULT 'flux-kontext-pro',
    -- Valores: 'flux-kontext-pro', 'flux-kontext-max', 'kling-1.6', 'nanobanana'

  -- Estado del catálogo
  total_variants INTEGER DEFAULT 80,        -- cuántas variantes tiene este libro
  approved_variants INTEGER DEFAULT 0,      -- cuántas están aprobadas
  is_published BOOLEAN DEFAULT FALSE,       -- visible en el catálogo público

  -- Impresión (V3.0: en milímetros para precisión)
  page_width_mm INTEGER DEFAULT 220,        -- 220 mm = 22 cm (configurable por admin)
  page_height_mm INTEGER DEFAULT 180,       -- 180 mm = 18 cm (configurable por admin)
  total_pages INTEGER DEFAULT 20,           -- incluyendo portada y final

  -- Assets
  cover_template_url TEXT,
  setting_sheet_url TEXT,                   -- Setting sheet del libro (Layer 1)
  style_reference_urls JSONB DEFAULT '[]',  -- Array de URLs de referencia visual

  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 7.4 Tabla `scenes` (actualizada)

```sql
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) NOT NULL,
  scene_number INTEGER NOT NULL,            -- 0=portada, 1-9=spreads, 10=final

  -- Descripción visual para el prompt de IA
  visual_description TEXT NOT NULL,
  camera_angle TEXT DEFAULT 'medium_shot',
  lighting TEXT DEFAULT 'warm',
  emotion TEXT DEFAULT 'peaceful',
  suggested_seed INTEGER,

  -- Elementos recurrentes (easter eggs)
  recurring_elements TEXT[],                -- ['sleeping_mouse', 'teddy_bear', 'butterfly']

  -- Composición de la página
  character_position TEXT DEFAULT 'left',   -- 'left', 'right' (alterna, NUNCA center)
  text_position TEXT DEFAULT 'top_left',    -- posición del bloque de texto (alterna para dinamismo)
  text_position_secondary TEXT,             -- posición del segundo idioma (V2)

  -- Textos narrativos (con placeholder {name})
  text_narrative JSONB NOT NULL,            -- {"es": "Buenas noches, {name}. Shhh...", "de": "Gute Nacht, {name}. Shhh..."}

  -- Setting (V3.0)
  setting_sheet_url TEXT,                   -- URL del setting sheet del libro
  setting_reference_urls JSONB DEFAULT '{"frontal": null, "lateral": null, "detail": null}',

  UNIQUE(book_id, scene_number)
);
```

### 7.5 Tabla `orders` (simplificada)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES character_variants(id) NOT NULL,
  book_id UUID REFERENCES books(id) NOT NULL,

  -- Personalización del comprador
  child_name TEXT NOT NULL,                 -- se inyecta en {name} de los textos
  dedication TEXT,                          -- dedicatoria personal
  language TEXT DEFAULT 'es',               -- idioma elegido para los textos
  second_language TEXT,                     -- segundo idioma (V2, nullable)

  -- Comprador
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT,

  -- Envío
  shipping_address JSONB NOT NULL,
  shipping_city TEXT,
  shipping_region TEXT,
  shipping_country TEXT DEFAULT 'CL',

  -- Pago
  payment_provider TEXT DEFAULT 'flow',
  payment_id TEXT,                          -- ID de transacción de Flow.cl/MercadoPago
  payment_status TEXT DEFAULT 'pending',    -- 'pending', 'approved', 'rejected'
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'CLP',

  -- Fulfillment
  print_file_url TEXT,                      -- URL del PDF listo para imprenta
  print_status TEXT DEFAULT 'pending',      -- 'pending', 'sent_to_print', 'printed', 'received_by_admin'
  shipping_status TEXT DEFAULT 'pending',   -- 'pending', 'shipped', 'delivered'
  tracking_number TEXT,

  -- Estado general
  status TEXT DEFAULT 'created',            -- 'created', 'paid', 'composing', 'printing', 'shipped', 'delivered', 'cancelled'

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 7.6 Tabla `accessories` (V1.5+)

Para V2, se agregan accesorios como capa separada (no requieren re-generación):

```sql
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) NOT NULL,

  name TEXT NOT NULL,                      -- 'freckles', 'headband', 'sleep_cap'
  type TEXT NOT NULL,                      -- 'overlay' (aplicados como post-gen)

  image_layer_url TEXT NOT NULL,           -- PNG con transparencia, pre-renderizado
  description TEXT,

  -- Pricing
  is_premium BOOLEAN DEFAULT FALSE,
  premium_price DECIMAL(8,2),              -- Upsell en checkout

  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Nota arquitectónica:** Los accesorios de V2 (freckles, headbands, sleep caps) se almacenan como PNG con canal alpha y se superponen sobre la ilustración YA APROBADA en tiempo de compra. NO requieren regeneración de imagen porque no cambian la estructura del personaje. Esto es un upsell en checkout.

Los accesorios que SÍ requieren regeneración (hairstyles: bun, ponytail, braid, afro) deben codificarse como **variantes separadas** en `character_variants` porque modifican la composición facial/cabeza. Estos se pre-generan junto con las otras 80 variantes en V2+.

### 7.7 Mapeo de Campos del Comprador a Variante

El comprador selecciona opciones en lenguaje natural. El sistema las mapea a los valores de la tabla `character_variants` para hacer el lookup.

```typescript
// Mapeo de opciones del UI a valores de character_variants
const BUYER_TO_VARIANT_MAP = {
  gender: {
    'Niño': 'boy',
    'Niña': 'girl',
  },
  hair_color: {
    'Rubio': 'blonde',
    'Castaño': 'brown',
    'Pelirrojo': 'red',
    'Negro': 'black',
  },
  hair_type: {
    'Liso': 'straight',
    'Ondulado': 'wavy',
  },
  skin_tone: {
    'Clara': 'light',
    'Mate': 'medium',
    'Oscura': 'dark',
  },
  has_glasses: {
    'Sí': true,
    'No': false,
  },
};

// Lookup de variante en tiempo de compra
async function findVariant(
  bookId: string,
  selection: BuyerSelection
): Promise<CharacterVariant | null> {
  const { data } = await supabase
    .from('character_variants')
    .select('*, variant_pages(*)')
    .eq('book_id', bookId)
    .eq('gender', BUYER_TO_VARIANT_MAP.gender[selection.gender])
    .eq('hair_color', BUYER_TO_VARIANT_MAP.hair_color[selection.hairColor])
    .eq('hair_type', BUYER_TO_VARIANT_MAP.hair_type[selection.hairType])
    .eq('skin_tone', BUYER_TO_VARIANT_MAP.skin_tone[selection.skinTone])
    .eq('has_glasses', BUYER_TO_VARIANT_MAP.has_glasses[selection.glasses])
    .eq('status', 'approved')
    .single();

  return data;
}
```

---

## 8. Prompt Builder — Especificación Técnica

### 8.1 Estructura del Prompt

Cada prompt de generación se compone de 4 bloques concatenados:

```
[STYLE_BLOCK] + [CHARACTER_BLOCK] + [SCENE_BLOCK] + [NEGATIVE_BLOCK]
```

**Límite:** 512 tokens máximo (restricción de FLUX Kontext).

### 8.2 STYLE_BLOCK — Estilo Artístico (Fijo por Libro)

```
soft watercolor children's book illustration, gentle visible brush strokes,
warm pastel color palette, hand-painted storybook art, whimsical and tender,
editorial quality children's picture book, textured watercolor paper background
```

### 8.3 CHARACTER_BLOCK — Identidad del Personaje (Generado por Variante)

Se construye a partir de los campos de `character_variants`. Ya no incluye `{name}` porque el nombre no aparece en la imagen.

**Reglas de construcción:**

1. **Empezar con edad y género:** `"a toddler [boy/girl]"`
2. **Listar TODOS los rasgos físicos:** piel → pelo (estilo + color) → ojos (puntitos negros)
3. **Accesorios con énfasis:** `"who ALWAYS wears small round glasses"`
4. **Repetir accesorios críticos al final** (anti-drift)
5. **NO incluir nombre** — el nombre es texto superpuesto, no parte de la imagen

**Ejemplo:**

```
a toddler boy with warm olive skin, short dark brown wavy hair,
small black dot eyes, who ALWAYS wears small round glasses,
wearing comfortable pajamas,
the child ALWAYS has small round glasses visible on the face
```

```typescript
// Mapeo de variante a descriptores
const SKIN_TONE_PROMPT: Record<string, string> = {
  'light': 'very light/pale skin',
  'medium': 'warm olive/medium skin',
  'dark': 'warm deep brown skin',
};

const HAIR_COLOR_PROMPT: Record<string, string> = {
  'blonde': 'golden blonde',
  'brown': 'dark brown',
  'red': 'red',
  'black': 'jet black',
};

const HAIR_TYPE_PROMPT: Record<string, string> = {
  'straight': 'straight',
  'wavy': 'wavy',
};

const GENDER_HAIR_STYLE: Record<string, string> = {
  'boy_straight': 'short straight hair',
  'boy_wavy': 'short wavy hair',
  'girl_straight': 'long straight hair',
  'girl_wavy': 'long wavy hair',
};

function buildCharacterBlock(variant: CharacterVariant): string {
  const gender = variant.gender; // 'boy' or 'girl'
  const hairKey = `${gender}_${variant.hair_type}`;

  const parts: string[] = [
    `a toddler ${gender}`,
    `with ${SKIN_TONE_PROMPT[variant.skin_tone]}`,
    `${HAIR_COLOR_PROMPT[variant.hair_color]} ${GENDER_HAIR_STYLE[hairKey]}`,
    'small black dot eyes',  // SIEMPRE puntitos negros
  ];

  if (variant.has_glasses) {
    parts.push('who ALWAYS wears small round glasses');
  }

  parts.push('wearing comfortable pajamas');

  // Repetición anti-drift
  if (variant.has_glasses) {
    parts.push('the child ALWAYS has small round glasses visible on the face');
  }

  return parts.join(', ');
}
```

### 8.4 SCENE_BLOCK — Descripción de Escena

Se almacena en `scenes.visual_description`. Incluye composición y elementos recurrentes.

**Estructura:**

```
[acción del personaje] + [ubicación/fondo] + [iluminación] + [emoción] +
[posición del personaje: left/right] + [elementos recurrentes/easter eggs] +
[espacio negativo para texto: posición específica]
```

**Ejemplo:**

```
sitting on a cozy bed surrounded by soft pillows, in a warmly lit bedroom
with stars visible through the window, nighttime, peaceful sleepy expression,
gentle warm lamplight, the child positioned on the LEFT side of the image,
a small sleeping mouse curled up on the windowsill, a teddy bear peeking
from behind a pillow, clear negative space on the upper right for text overlay
```

**Reglas de composición:**

1. **Personaje NUNCA en el centro** (zona del lomo/pliegue del libro)
2. **Alternar posición:** escenas impares = izquierda, pares = derecha
3. **Espacio negativo dinámico para texto:** alterna posición (top-left, bottom-left, top-right, bottom-right)
4. **Espacio negativo adicional reservado** para segundo idioma en V2
5. **Incluir elementos recurrentes** (easter eggs): un mismo animalito/peluche que aparece en cada escena en un lugar diferente

### 8.5 NEGATIVE_BLOCK — Anti-Slop

```
NOT 3D render, NOT CGI, NOT Pixar style, NOT Disney 3D, NOT photorealistic,
NOT plastic, NOT shiny, NOT glossy, NOT digital art, NOT anime, NOT manga,
NOT cartoon network style, NOT clipart, NOT stock illustration, NO text,
NO letters, NO words, NO writing in the image
```

**Nota v3.0:** Se mantiene `NO text, NO letters, NO words, NO writing in the image` porque todo el texto se superpone como capa separada. La imagen debe estar 100% libre de texto generado por IA.

### 8.6 Prompt Completo

```typescript
function buildFullPrompt(variant: CharacterVariant, scene: Scene, book: Book): string {
  const style = book.style_prompt;
  const character = buildCharacterBlock(variant);
  const sceneDesc = scene.visual_description;
  const negative = NEGATIVE_PROMPT;

  const prompt = `${style}, ${character}, ${sceneDesc}. ${negative}`;

  if (prompt.split(' ').length > 350) {
    console.warn('Prompt approaching 512 token limit');
  }

  return prompt;
}
```

---

## 9. Pipeline de Pre-Generación — Flujo Técnico Actualizado (Money Shot)

### 9.1 Flujo General (Herramienta de Admin)

```
Panel Admin (Sofi):
  1. Selecciona un libro del catálogo
  2. Elige motor de IA (generation_engine) — por defecto FLUX Kontext Pro
  3. Clickea "Generar todas las variantes"
  4. Sistema genera las ~80 combinaciones en batch (background job)

  Para cada variante:
    a. Genera portrait base (text-to-image, money shot) — 3 opciones para elegir
    b. Genera character sheet (4 vistas, image-to-image) — Sofi aprueba portrait primero
    c. Genera 11 páginas (portada + 9 spreads + final)
       - image-to-image usando character sheet + setting sheet
    d. Upscalea a resolución de impresión (300 DPI)

  5. Sofi revisa cada variante en el panel:
     - Aprueba portrait → cascada: se aprueban automáticamente las 4 vistas del character sheet
     - Rechaza/regenera portrait → cascada: el character sheet se regenera
     - Para cada página: aprueba/rechaza/regenera
     - Puede editar la descripción visual de una escena y regenerar solo esa página

  6. Cuando TODAS las variantes están aprobadas, publica el libro al catálogo
```

### 9.2 Generación del Portrait (Money Shot)

```typescript
async function generatePortrait(variant: CharacterVariant, book: Book) {
  const prompt = `${book.style_prompt}, ${buildCharacterBlock(variant)}, front view, neutral pose, looking at viewer, centered portrait, simple soft background. ${NEGATIVE_PROMPT}`;

  const endpoint = getEndpointForEngine(book.generation_engine);

  const result = await callGenerationAPI(endpoint, {
    prompt,
    aspect_ratio: '1:1',
    num_images: 3,           // 3 opciones para elegir
    guidance_scale: 3.5,
    output_format: 'png',
  });

  // Sofi elige la mejor → se guarda como portrait_url
  // + seed documentado en variant_pages
  return result.images;
}
```

### 9.3 Generación del Character Sheet (4 vistas)

Se genera UNA SOLA VEZ después de que Sofi aprueba el portrait.

```typescript
async function generateCharacterSheet(variant: CharacterVariant, book: Book) {
  const portraitUrl = variant.portrait_url;  // Ya aprobado

  const views = ['frontal', 'lateral', 'three_quarter', 'full_body'];
  const sheetUrls = {};

  for (const view of views) {
    const scenePrompt = getCharacterSheetPrompt(view);  // "frontal view of toddler", etc.
    const fullPrompt = `${book.style_prompt}, ${buildCharacterBlock(variant)}, ${scenePrompt}. ${NEGATIVE_PROMPT}`;

    const endpoint = getEndpointForEngine(book.generation_engine);
    const result = await callGenerationAPI(endpoint, {
      prompt: fullPrompt,
      image_url: portraitUrl,  // image-to-image reference
      guidance_scale: 3.5,
      num_images: 1,
      output_format: 'png',
    });

    sheetUrls[view] = result.images[0].url;
  }

  // Guardar en variant.character_sheet_urls
  await updateVariant(variant.id, { character_sheet_urls: sheetUrls });
}
```

### 9.4 Generación de Páginas por Variante (11 escenas)

Se genera image-to-image usando el character sheet + setting sheet como referencias.

```typescript
async function generateVariantPages(
  variant: CharacterVariant,
  book: Book,
  scenes: Scene[]
) {
  const characterSheetUrls = variant.character_sheet_urls;  // 4 vistas
  const settingSheetUrl = book.setting_sheet_url;          // ambiente del libro

  for (const scene of scenes) {
    const prompt = buildFullPrompt(variant, scene, book);

    const endpoint = getEndpointForEngine(book.generation_engine);
    const imageUrls = [
      characterSheetUrls.frontal,  // Principal reference: frente del personaje
      characterSheetUrls.three_quarter,
      settingSheetUrl,             // Ambiente del libro
    ];

    const result = await callGenerationAPI(endpoint, {
      prompt,
      image_urls: imageUrls,       // Multi-reference: character + setting
      guidance_scale: 3.5,
      num_images: 2,               // 2 opciones por escena
      output_format: 'png',
      seed: scene.suggested_seed,  // Seed sugerido para reproducibilidad
    });

    // Guardar con seed documentado
    const seed = result.seed || scene.suggested_seed;
    await saveVariantPage({
      variant_id: variant.id,
      scene_id: scene.id,
      image_url: result.images[0].url,
      prompt_used: prompt,
      seed_used: seed,
      generation_model: book.generation_engine,
      reference_images_used: {
        character_sheet: characterSheetUrls.frontal,
        setting_sheet: settingSheetUrl,
      },
    });
  }
}
```

### 9.5 Batch Generation (~80 variantes)

```typescript
async function generateAllVariants(bookId: string) {
  const book = await getBook(bookId);
  const scenes = await getScenes(bookId);

  // Generar setting sheet UNA sola vez por libro (Layer 1)
  if (!book.setting_sheet_url) {
    await generateSettingSheet(book);
  }

  const validCombinations = generateValidCombinations();  // ~80 combinaciones, solo válidas

  for (const combo of validCombinations) {
    // Crear registro de variante
    const variant = await createVariant(bookId, combo);

    try {
      // Paso 1: Portrait
      const portraitImages = await generatePortrait(variant, book);
      // → Sofi aprueba en UI, guarda portrait_url

      // Paso 2: Character Sheet (cuando portrait está aprobado)
      // Inngest job escucha cambio en variant.status → 'portrait_approved'
      // → Genera character sheet automáticamente

      // Paso 3: Páginas (cuando character sheet está aprobado)
      // Inngest job escucha cambio en variant.status → 'character_sheet_approved'
      // → Genera todas las 11 páginas

      // Paso 4: Upscale (cuando todas las páginas están generadas)
      await upscaleVariantPages(variant.id);

      // Marcar como 'generated' (pendiente aprobación final)
      await updateVariantStatus(variant.id, 'generated');
    } catch (error) {
      console.error(`Error generating variant ${combo}:`, error);
      await updateVariantStatus(variant.id, 'failed');
    }
  }
}

function generateValidCombinations(): VariantCombo[] {
  const genders = ['boy', 'girl'];
  const skinTones = ['light', 'medium', 'dark'];
  const hairColors = {
    light: ['blonde', 'brown', 'red', 'black'],
    medium: ['blonde', 'brown', 'red', 'black'],
    dark: ['black'],  // Solo negro para oscuro (biológicamente válido)
  };
  const hairTypes = ['straight', 'wavy'];
  const glasses = [true, false];

  const combos: VariantCombo[] = [];

  for (const g of genders) {
    for (const st of skinTones) {
      for (const hc of hairColors[st]) {  // Solo colores válidos para este tono
        for (const ht of hairTypes) {
          for (const gl of glasses) {
            combos.push({
              gender: g,
              hair_color: hc,
              hair_type: ht,
              skin_tone: st,
              has_glasses: gl,
            });
          }
        }
      }
    }
  }

  return combos;  // ~80 combinaciones
}
```

### 9.6 Costo de Pre-Generación por Libro (V3.0)

| Paso | Imágenes | Costo unitario | Total |
|------|----------|---------------|-------|
| Setting sheet (3 vistas) | 3 | $0.04 | $0.12 |
| Portraits (3 opciones × ~80 variantes) | 240 | $0.04 | $9.60 |
| Character sheets (4 vistas × ~80) | 320 | $0.04 | $12.80 |
| Páginas (11 × ~80, 2 opciones cada una) | 1,760 | $0.04 | $70.40 |
| Regeneraciones (~10% retry) | ~200 | $0.04 | $8.00 |
| **Total por libro** | **~2,523** | | **~$100 USD** |

**Nota:** Este costo refleja ~80 variantes en lugar de 96. Si se usa Kontext Max ($0.08/img) para regeneraciones de alta calidad, el costo sube a ~$140 USD. Si se optimiza a 1 opción por página sin regeneración, baja a ~$50 USD.

**Costo amortizado:** A 50 ventas del primer mes, el costo de generación por libro vendido es **$2.00 USD**. A 200 ventas, baja a **$0.50 USD**.

---

## 10. Pipeline de Compra — Composición en Tiempo Real

### 10.1 Flujo de Composición (al momento de la compra)

Cuando un comprador finaliza su personalización y paga:

```
1. LOOKUP: Buscar character_variant por (book_id, gender, hair_color, hair_type, skin_tone, has_glasses)
2. FETCH: Obtener todas las variant_pages (11 imágenes pre-generadas)
3. COMPOSE: Para cada página:
   a. Cargar ilustración pre-generada (image_url_hires)
   b. Reemplazar {name} en text_narrative con child_name
   c. Renderizar texto sobre la imagen en la posición definida (text_position)
   d. Aplicar tipografía del libro (font_family, font_size, font_color)
4. ASSEMBLE: Generar PDF listo para imprenta (20 páginas, dimensiones configurables, 300 DPI)
5. STORE: Guardar PDF en Supabase Storage → actualizar order.print_file_url
6. NOTIFY: Email de confirmación al comprador + notificación a Sofi
```

### 10.2 Composición de Texto sobre Imagen

```typescript
// Pseudocódigo de composición
interface PageComposition {
  illustration_url: string;     // imagen pre-generada
  text: string;                 // texto con {name} reemplazado
  text_position: TextPosition;  // 'top_left', 'bottom_left', 'top_right', 'bottom_right'
  font: FontConfig;             // tipografía del libro
}

function composePageText(
  scene: Scene,
  childName: string,
  language: string
): string {
  const template = scene.text_narrative[language]; // "Buenas noches, {name}. Shhh..."
  return template.replace(/{name}/g, childName);   // "Buenas noches, Alonso. Shhh..."
}
```

---

## 11. Dimensiones de Impresión Configurables

### 11.1 Problema Anterior

v2.0 tenía hardcodeadas las dimensiones: 22×18 cm (Emotions hardcover, 20 páginas).

**Problema:** Si cambias de proveedor de impresión, cambian las dimensiones. Hay que tocar código.

### 11.2 Solución: Campos en DB

En la tabla `books`:

```sql
-- Antiguos (cm, menos precisión):
-- page_width_cm DECIMAL(4,1) DEFAULT 22.0,
-- page_height_cm DECIMAL(4,1) DEFAULT 18.0,

-- Nuevos (mm, más precisión):
page_width_mm INTEGER DEFAULT 220,   -- 220 mm = 22 cm (Emotions)
page_height_mm INTEGER DEFAULT 180,  -- 180 mm = 18 cm (Emotions)
```

**Admin puede cambiar sin deploy:**

```
Libro: "Buenas Noches"
Ancho (mm): [220] (22 cm)
Alto (mm):  [180] (18 cm)
Proveedor: [Emotions ▼]
  - Emotions (220×180 mm)
  - Blurb (200×250 mm)
  - Lulu (203×254 mm)
```

**En el pipeline de composición de PDF:**

```typescript
async function assemblePDF(order: Order, variant: CharacterVariant) {
  const book = await getBook(order.book_id);

  const pdfConfig = {
    pageWidth: book.page_width_mm,   // Lee de DB
    pageHeight: book.page_height_mm,
    dpi: 300,
    paperSize: `${book.page_width_mm}x${book.page_height_mm}mm`,
  };

  // LibreOffice/ImageMagick usa estas dimensiones
  const pdf = await generatePDF(variant_pages, pdfConfig);
  return pdf;
}
```

**Beneficio:** Cambiar proveedor de impresión es un cambio en BD, no en código.

---

## 12. Reglas de Prompting para Consistencia — Cheat Sheet

### 12.1 HACER (DO)

| Regla | Ejemplo |
|-------|---------|
| Referir al personaje con descriptores específicos | "The toddler boy with olive skin and wavy brown hair" |
| Repetir accesorios críticos 2x en el prompt | Al inicio Y al final del CHARACTER_BLOCK |
| Especificar posición del personaje (left/right) | "the child positioned on the LEFT side of the image" |
| Incluir espacio negativo explícito para texto | "clear negative space on the upper right for text overlay" |
| Especificar "NO text, NO letters" en el negative | Evita que la IA genere texto dentro de la imagen |
| Incluir elementos recurrentes (easter eggs) | "a small sleeping mouse on the windowsill" |
| Usar el mismo camera language entre spreads | Consistencia de ángulos y encuadres |
| Documentar seeds exactos por variante | Determinismo y reproducibilidad |
| Usar character sheet + setting sheet como referencias | Garantiza consistencia visual a través de escenas |

### 12.2 NO HACER (DON'T)

| Anti-patrón | Por qué falla |
|-------------|---------------|
| Poner al personaje en el centro de la imagen | Zona del pliegue del libro — se pierde al encuadernar |
| Incluir el nombre del niño en el prompt de imagen | El nombre es texto superpuesto, no generado por IA |
| Omitir accesorios del prompt | El modelo los elimina si no se mencionan |
| Generar texto con IA dentro de la imagen | La IA genera texto ilegible/incorrecto; usar overlay |
| Exceder ~350 palabras en el prompt | Límite de 512 tokens; trunca silenciosamente |
| Regenerar la misma escena sin cambiar el seed | Resultados impredecibles; cambiar seed siempre |
| Usar portrait solo sin character sheet | El personaje varía entre páginas; usar sheet de 4 vistas |

---

## 13. Quality Assurance — Validación de Variantes

### 13.1 QA por Variante (una sola vez)

Cada variante se valida UNA vez durante la pre-generación. Una vez aprobada, se sirve idéntica a todos los compradores con esa combinación.

**Checklist por variante:**

1. **Portrait:** ¿Se corresponde con la combinación de rasgos? ¿Estilo acuarela?
2. **Consistencia entre páginas:** ¿El personaje se ve igual en las 11 páginas? (Gracias al character sheet)
3. **Accesorios:** ¿Lentes presentes en TODAS las páginas? (si aplica)
4. **Composición:** ¿Personaje a izquierda/derecha (nunca centro)? ¿Espacio negativo para texto?
5. **Elementos recurrentes:** ¿Los easter eggs están presentes y consistentes?
6. **Sin texto en imagen:** ¿La imagen está libre de letras/palabras generadas?
7. **Sin artefactos:** ¿Manos correctas? ¿Sin distorsiones?
8. **Setting:** ¿El ambiente es coherente con las referencias de setting sheet?

### 13.2 Estrategia de Regeneración

Si una página de una variante no pasa QA, Sofi puede regenerar solo esa página:

1. **Retry 1:** Mismo prompt + character sheet + setting sheet, diferente seed
2. **Retry 2:** Aumentar guidance_scale a 4.0-4.5
3. **Retry 3:** Usar motor Max (ej: Kontext Max) con múltiples vistas del character sheet
4. **Retry 4:** Editar la descripción visual de la escena y regenerar

Si el **portrait no convence:**
- Regenerar portrait → aprobación → cascada: nuevo character sheet → nuevas 11 páginas
- Esto asegura que el personaje sea completamente coherente

---

## 14. Evolución por Fases

### Fase 1 — MVP (Meses 1-3)

```
Pre-generación: ~80 variantes × 1 libro = ~$35-50 USD (una vez)
Compra: lookup + composición texto + PDF → $0 en generación por venta
Validación: manual por Sofi (una vez por variante)
Estilo: solo vía prompt engineering (STYLE_BLOCK)
Motor: FLUX Kontext Pro (hardcodeado → v3.0: configurable)
Dinámicas: Solo 2 genders × 3 tonos × ~3.3 colores × 2 tipos × 2 lentes = ~80
```

### Fase 2 — Calidad + Expansión (Meses 4-8)

```
Pre-generación con Style LoRA → estilo más consistente
Segundo libro en catálogo (nuevas ~80 variantes)
Opción bilingüe (texto en segundo idioma usando espacio negativo)
QA semi-automatizado (CLIP scoring para pre-filtrar)
Accesorios V1.5: freckles, headbands, sleep caps → overlay layer, upsell
Hairstyles V2: bun, ponytail, braid, afro → nuevas variantes pre-generadas
Motor configurable por libro (admin dropdown)
Dimensiones de impresión configurables (por proveedor)
```

### Fase 3 — Escala (Mes 9+)

```
Self-hosted inference para bajar costos de pre-generación
Más libros en catálogo (~5-10)
V2 features: foto del regalador, bundle con peluche
Auto-generación de nuevas variantes si se agregan opciones de personalización
Foto del comprador "en la portada" (Alonso con foto del tío Pepe)
API pública para librerías
```

---

## 15. Formatos de Imagen y Resolución

| Uso | Resolución | Aspect Ratio | Formato |
|-----|-----------|--------------|---------|
| Portrait de variante | 1024×1024 | 1:1 | PNG |
| Character sheet (cada vista) | 1024×1024 | 1:1 | PNG |
| Setting sheet (cada vista) | 1024×1024 | 1:1 | PNG |
| Spread doble (22×18 cm × 2) | 2048×1024 | ~2:1 | PNG |
| Spread hi-res (impresión 300 DPI) | 5197×2362 | ~2.2:1 | PNG |
| Portada | 1024×1536 | ~2:3 | PNG |
| Preview web (thumbnail) | 512×256 | 2:1 | JPEG (q85) |

**Nota:** Las imágenes de 22×18 cm a 300 DPI requieren 2598×2126 px por página, o 5197×2126 px por spread doble. Las imágenes generadas por FLUX (~2048px) se upscalean con Real-ESRGAN como paso post-generación durante la pre-generación.

---

## 16. Parámetros API de Referencia Rápida

### 16.1 FLUX Kontext Pro — Text-to-Image (portraits)

```typescript
const endpoint = getEndpointForEngine(book.generation_engine);

const result = await callGenerationAPI(endpoint, {
  prompt: `${STYLE_BLOCK}, ${buildCharacterBlock(variant)}, front view, neutral pose, looking at viewer, centered portrait, simple soft background. ${NEGATIVE_PROMPT}`,
  aspect_ratio: '1:1',
  num_images: 3,
  guidance_scale: 3.5,
  output_format: 'png',
});
```

### 16.2 FLUX Kontext Pro — Image-to-Image (escenas con character sheet + setting sheet)

```typescript
const result = await callGenerationAPI(endpoint, {
  prompt: buildFullPrompt(variant, scene, book),
  image_urls: [
    variant.character_sheet_urls.frontal,
    variant.character_sheet_urls.three_quarter,
    book.setting_sheet_url,
  ],
  guidance_scale: 3.5,
  num_images: 2,
  seed: scene.suggested_seed,
  output_format: 'png',
});
```

### 16.3 FLUX Kontext Max — Multi-Referencia (retry de alta calidad)

```typescript
const result = await callGenerationAPI(endpoint, {
  prompt: buildFullPrompt(variant, scene, book),
  image_urls: [
    variant.character_sheet_urls.frontal,
    variant.character_sheet_urls.three_quarter,
    variant.character_sheet_urls.side,
    variant.character_sheet_urls.full_body,
    book.setting_sheet_url,
  ],
  guidance_scale: 4.0,
  num_images: 2,
  output_format: 'png',
});
```

---

## 17. Fuentes y Referencias Técnicas

- [FLUX.1 Kontext Pro API — fal.ai](https://fal.ai/models/fal-ai/flux-pro/kontext)
- [FLUX.1 Kontext Text-to-Image API — fal.ai](https://fal.ai/models/fal-ai/flux-pro/kontext/text-to-image/api)
- [FLUX.1 Kontext Max Multi-Reference — fal.ai](https://fal.ai/models/fal-ai/flux-pro/kontext/max/multi/api)
- [FLUX Kontext Trainer — fal.ai](https://fal.ai/models/fal-ai/flux-kontext-trainer)
- [BFL Prompting Guide — Image-to-Image](https://docs.bfl.ai/guides/prompting_guide_kontext_i2i)
- [BFL FLUX Kontext Announcement](https://bfl.ai/announcements/flux-1-kontext)
- [FLUX.1 Kontext Paper (arXiv)](https://arxiv.org/html/2506.15742v2)
- [PricePerToken — Image Model Pricing](https://pricepertoken.com/image)

---

*Este documento es la fuente de verdad técnica para generación de imágenes en Tipiti Books. v3.0 — Arquitectura de pre-generación por variantes con Money Shot methodology, setting sheets, determinismo, y configurationabilidad de motor + dimensiones. Todos los documentos del pipeline (PDR, Tech Spec, User Stories, Blueprint) deben referenciar estos lineamientos.*
