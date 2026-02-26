# 📋 PDR: Tipiti Books

> **Product Definition Report**
> **Estado**: APROBADO
> **Fecha**: 2026-02-23
> **Versión**: 3.0 (actualizado con determinismo, Flow.cl, dashboard operativo, y UX storefront)
> **Documento técnico de referencia**: `TIPITI-IMAGE-GENERATION-GUIDELINES.md` v3.0

---

## 1. Problema de Negocio

### El Dolor

Los libros infantiles personalizados de calidad — como los de Wonderbly — cuestan **$60+ USD** enviados a Chile y Latinoamérica. Para una familia chilena, esto equivale a más de $55.000 CLP solo por un libro. Las opciones locales o más económicas tienen ilustraciones genéricas, tipo "AI slop": personajes plásticos estilo Pixar, sin alma artística, que cualquier padre medianamente exigente descarta al verlas.

El mercado latinoamericano carece de una opción que combine personalización real del personaje, calidad artística de ilustración (estilo acuarela/pintado a mano), y un precio accesible. Los padres, abuelos y familiares quieren regalar algo verdaderamente especial y único — un libro donde el niño se reconozca — pero hoy deben elegir entre pagar $60+ USD por calidad internacional o conformarse con opciones locales mediocres.

### El Costo

- **Costo monetario para el comprador:** $60+ USD por libro de Wonderbly enviado a Chile (precio + envío internacional + impuestos). Esto excluye a gran parte del mercado latinoamericano.
- **Costo de oportunidad:** Compradores potenciales abandonan la compra al ver el precio final o la baja calidad de las alternativas locales.
- **Competidores existentes:** Existen opciones en el mercado pero sus ilustraciones son feas, genéricas, o claramente generadas por IA sin curación. No hay un estándar de calidad premium accesible en la región.

### Situación Actual

Hoy los compradores en LATAM tienen estas opciones:

| Opción | Precio | Calidad | Personalización |
|--------|--------|---------|-----------------|
| Wonderbly / Hooray Heroes | $60+ USD a Chile | Alta | Limitada (configurador básico) |
| Opciones locales LATAM | $15-30 USD | Baja ("AI slop") | Variable |
| Libros artesanales (Etsy, locales) | $40-80 USD | Variable | Manual, lenta, sin escalabilidad |
| No comprar / regalo alternativo | $0 | N/A | N/A |

Ninguna opción combina: precio accesible + calidad artística premium + personalización real del personaje + experiencia de regalo premium.

---

## 2. Propuesta de Valor

### En Una Frase

> **Una plataforma web chilena que genera libros infantiles personalizados con ilustraciones de alta calidad estilo acuarela, usando IA para consistencia de personajes, a un precio accesible (~$40 USD) con empaque premium de regalo.**

"Un Wonderbly para Latinoamérica, powered by AI."

### Determinismo y Consistencia

Un principio arquitectónico crítico de Tipiti Books: **el producto es determinista**. Dos compradores diferentes que eligen exactamente la misma variante de personaje (ej: niña, pelo negro liso, piel mate, con lentes) reciben **las MISMAS ilustraciones en todas las páginas**. No hay aleatoriedad. Esto no es una limitación — es una característica de calidad. Cada variante tiene un seed fijo, y su conjunto aprobado de 11 imágenes (1 portrait + 10 páginas de historia) está pre-generado, curado y garantizado como consistente. El comprador sabe exactamente lo que está recibiendo antes de pagar.

### Flujo Principal (Happy Path) — V1

```
1. EXPLORAR     → Comprador entra a tipitibooks.com y elige un libro del catálogo
2. PERSONALIZAR → Configura el personaje del niño/a en wizard visual:
                   - Nombre del niño/a
                   - Género (niño/niña)
                   - Pelo: 3 colores (castaño, pelirrojo, negro) × 2 tipos (liso, ondulado)
                   - Piel: 3 tonos (clara, mate, oscura)
                   - Lentes: sí/no
                   - Ojos: puntitos negros (NO customizables — decisión de diseño)
                   - Niño = pelo corto por defecto, Niña = pelo más largo
3. ACCESORIOS   → Selecciona accesorios (V1: opcional; V2: freckles, headbands)
4. DEDICATORIA  → Escribe una dedicatoria personal
5. PREVIEW      → Sistema busca la variante pre-generada que coincide con la selección
                   y muestra animación de page-flip con el libro completo personalizado.
                   El nombre del niño/a se superpone como texto.
                   (las ilustraciones ya existen, pre-generadas y curadas por Sofi)
6. PAGAR        → Checkout con Flow.cl (~$40 USD)
7. COMPONER     → Sistema genera el archivo final para impresión:
                   - Capa 1: Ilustraciones pre-generadas (de la variante seleccionada)
                   - Capa 2: Texto narrativo con {name} reemplazado por el nombre del niño/a
                   - Capa 3: Dedicatoria en la página designada
8. IMPRIMIR     → Envío a imprenta (proveedor TBD)
9. QA           → Sofi recibe el libro impreso, revisa calidad
10. EMPACAR     → Empaque premium de regalo (la experiencia de unboxing ES parte de la marca)
11. ENVIAR      → Envío al comprador/destinatario final
```

### Arquitectura de 3 Capas Independientes

Tipiti Books se estructura en **3 capas que se crean, escalan y versionan de forma totalmente independiente**. Esta separación es el principio arquitectónico central del producto:

```
┌─────────────────────────────────────────────────────────────────┐
│  CAPA 3 — TEXTO PERSONALIZADO (por compra)                      │
│  Nombre del niño ({name}), dedicatoria, idioma                  │
│  Se genera al instante. Costo: $0. Escala: infinita.           │
├─────────────────────────────────────────────────────────────────┤
│  CAPA 2 — PERSONAJE (por variante, ~80 combinaciones)          │
│  Ilustraciones pre-generadas con FLUX Kontext + curadas        │
│  Se genera UNA vez por libro. Costo: ~$35-100. Escala: fija.   │
├─────────────────────────────────────────────────────────────────┤
│  CAPA 1 — EL CUENTO (por libro del catálogo)                   │
│  Escenas, ambientes, easter eggs, estructura narrativa          │
│  Se crea y cura UNA vez. Costo: tiempo de Sofi. Escala: manual.│
└─────────────────────────────────────────────────────────────────┘
```

**¿Por qué importa?** Cada capa tiene su propio ciclo de vida:

| Capa | ¿Quién la crea? | ¿Cuándo se crea? | ¿Cuánto cuesta por venta? | ¿Cómo escala? |
|------|-----------------|-------------------|--------------------------|---------------|
| **1. Cuento** | Sofi (con IA para textos, manual para diseño de escenas) | Al agregar un libro nuevo al catálogo | $0 | Sofi agrega nuevos libros al catálogo |
| **2. Personaje** | Pipeline de pre-generación (FLUX Kontext) + curación manual de Sofi | Una vez por libro (~80 variantes × 11 páginas = 880 imágenes) | $0 | Fija: ~80 variantes cubren todas las combinaciones válidas de V1 |
| **3. Texto** | Sistema automático (reemplazo de `{name}` + dedicatoria) | En cada compra, al instante | $0 | Infinita: solo es string replacement |

**Beneficios de la separación:**
- **Agregar un idioma (V2)** = solo agregar una sub-capa de texto. No toca ilustraciones ni personajes.
- **Agregar un libro al catálogo** = crear Capa 1 (escenas) + generar Capa 2 (~80 variantes). La Capa 3 ya funciona automáticamente.
- **Cambiar un texto narrativo** = solo editar `scenes.text_narrative`. Las ilustraciones no se tocan.
- **Mejorar una ilustración** = solo regenerar esa página en Capa 2. El cuento y los textos no se tocan.

### Modelo de Pre-Generación por Variantes

**Decisión arquitectónica clave (v3.0):** La Capa 2 (Personaje) se implementa mediante pre-generación por variantes. Se pre-generan TODAS las ~80 combinaciones posibles de personaje para cada libro del catálogo, y Sofi las revisa y aprueba una por una. Al momento de la compra, el sistema simplemente busca la variante que coincide con la selección del comprador y superpone la Capa 3 (Texto).

**Separación imagen/texto:** Las ilustraciones (Capa 2) no contienen texto ni nombres. El nombre del niño/a es una variable `{name}` en la Capa 3 que se superpone al componer el archivo final. Esto permite que las mismas ilustraciones sirvan para cualquier nombre.

**Combinaciones válidas (v3.0):**

| Atributo | Opciones | Valores |
|----------|----------|---------|
| Género | 2 | niño, niña |
| Color de pelo | 3 | castaño, pelirrojo, negro |
| Tipo de pelo | 2 | liso, ondulado |
| Tono de piel | 3 | claro, mate, oscuro |
| Lentes | 2 | sí, no |
| Ojos | 1 (fijo) | puntitos negros |
| **Total combinaciones** | **~80** | por libro |

**Nota biológica:** Las combinaciones se redujeron de 96 a ~80 al descartar combinaciones biológicamente implausibles: oscuro + rubio, oscuro + pelirrojo. Se mantienen combinaciones válidas como piel oscura + pelo negro y piel clara + pelo negro (familias asiáticas/mixtas en Chile).

**Beneficios del modelo:**
- **$0 USD en generación por venta** (costo fijo ~$35-100 USD por libro, una sola vez)
- **Calidad garantizada:** Sofi revisa y aprueba cada variante antes de publicar
- **Experiencia instantánea:** El preview se muestra al instante (no hay espera de generación)
- **Consistencia perfecta:** Todas las páginas de una variante fueron generadas y aprobadas juntas
- **Determinismo:** El mismo personaje = las mismas imágenes. No hay aleatoriedad.

### Especificaciones de Impresión

- **Tamaño de página:** Configurable por libro en admin (default: 22 × 18 cm). Campo `page_width_mm` y `page_height_mm` en tabla `books`.
- **Total de páginas:** 20 (1 portada + 9 spreads dobles horizontales + 1 página final)
- **Regla de composición:** Personaje NUNCA en el centro de la imagen (zona del lomo/pliegue del libro). Debe quedar centrado a la izquierda o derecha, alternando entre páginas.
- **Espacio negativo para texto:** Posición dinámica alternando por página (arriba-izquierda → abajo-izquierda → arriba-derecha → abajo-derecha) para dar dinamismo visual.
- **Espacio reservado para segundo idioma:** Desde V1, el diseño de cada spread reserva espacio para un bloque de texto adicional (para habilitar bilingüe en V2 sin rediseñar).

### Contenido Narrativo

- **Generación:** Textos generados por IA, optimizados para la edad objetivo del libro.
- **Edición:** Sofi tiene panel de administración para editar tanto los textos narrativos como las descripciones visuales de cada escena. Esto permite correcciones de hablantes nativos (ej: un padre alemán sugiere una mejor frase) y ajustes artísticos por escena.
- **Personalización por nombre:** Los textos narrativos usan la variable `{name}` que se reemplaza con el nombre del niño/a al momento de la compra. El nombre NUNCA aparece dentro de las ilustraciones.
- **Estilo de texto para "Buenas Noches" (0-3 años):** Frases muy cortas, vocabulario simple, abundantes onomatopeyas ("Shhh...", "Zzzzz", "Muuu", "¡Splash!").

### Estilo de Ilustración

- Acuarela/pintado a mano, con pinceladas visibles, paleta pastel cálida.
- **NO planas:** Ricas en detalles que los niños aman buscar — animalitos escondidos, peluches recurrentes, objetos curiosos. Ejemplos: un osito dormido en la caja de juguetes, un ratoncito asomándose por la ventana, una mariposa posada en una flor diferente en cada escena.
- Estos elementos recurrentes ("easter eggs") deben mantener consistencia visual a lo largo de todo el libro usando FLUX Kontext multi-referencia + **Money Shot + Setting Sheet methodology**: se genera un portrait del personaje, luego una character sheet que incluye variaciones pose/expresión, luego un setting sheet por libro (una sola, no por variante), y finalmente las escenas se componen con estos elementos.
- Ojos del personaje principal como **puntitos negros** (estilo ilustración infantil clásica, evitando deliberadamente el look 3D/Pixar).
- **Regla de exclusión de texto en imágenes:** Las ilustraciones NO deben contener letras, palabras ni texto de ningún tipo. Todo texto es superpuesto posteriormente.

### Accesorios y Atributos Avanzados (Roadmap)

**V1 (Base):** Género, pelo (color + tipo), piel, lentes.

**V2 (Accesorios premium):** Las gafas se consideran un atributo base en V1. En V2, se introducen accesorios como overlay: freckles, headbands, sleep caps como upsell premium. Estas requieren pre-generación.

**V2+ (Hairstyles avanzados):** Bun, braids, afro — requieren pre-generación selectiva de sus variantes.

### Flujos V2 (Fase 2+)

- **Segundo personaje** (hermano/a, amigo/a) — Nota: genera ~80×80=6,400 combinaciones si se pre-genera. Se recomienda modelo híbrido: personaje 1 pre-generado, personaje 2 generado on-demand.
- **Foto del regalador** integrada en la dedicatoria/última página
- **Título y color de portada personalizables**
- **Peluche editable** que acompaña al personaje en el libro
- **Opción bilingüe:** Texto en segundo idioma (alemán, inglés, francés, etc.) aprovechando el espacio negativo reservado desde V1
- **Bundle regalo:** Libro + peluche físico que coincide con el personaje del libro (alto margen, alto valor percibido)
- **Referrals, bundles con descuento, gift cards, checkout upsells**

### Flujos Alternativos y Edge Cases

- **Variante no aprobada aún:** Si una combinación específica no ha sido aprobada todavía, mostrar estado "próximamente" y ofrecer combinaciones similares disponibles.
- **Comprador quiere ver preview antes de imprimir:** Opción "regalar sin spoiler" — comprador recibe link de preview para verificar, pero el destinatario no ve nada hasta recibir el paquete.
- **Corrección post-compra:** Si el comprador detecta un error en los datos (nombre, dedicatoria), puede solicitar corrección antes de confirmar impresión.
- **Problema con impresión:** Sofi hace QA manual de cada libro; si hay defecto, se reimprime antes de enviar.

---

## 3. Usuario Objetivo

### Persona Principal: El Comprador de Regalos

- **Rol:** Padres, abuelos, tíos, amigos — cualquier persona que quiera regalar un libro personalizado a un niño/a
- **Contexto:** Buscan un regalo significativo y único para ocasiones especiales
- **Ocasiones de compra:** Nacimientos, baby showers, cumpleaños, Navidad, Día del Niño, bautizos
- **Nivel técnico:** Variable (desde tech-savvy hasta abuelos con smartphone). La experiencia debe ser intuitiva para todos.
- **Dispositivo principal:** **Mobile-first** (la mayoría comprará desde el celular)
- **Frecuencia de uso:** Eventual (1-4 veces al año, por ocasiones)
- **Perfil demográfico:** Familias tanto bilingües como monolingües. El primer libro ("Buenas Noches") apunta a padres con hijos de 0-3 años.

### Persona Secundaria: Sofi (Operadora/Admin)

- **Rol:** Dueña y operadora de Tipiti Books
- **Interacción:** Panel de administración avanzado para:
  - **Pre-generación de variantes:** Lanzar el pipeline de generación de las ~80 variantes por libro
  - **Curación de variantes:** Revisar cada variante generada, aprobar/rechazar/regenerar páginas individuales
  - **Editor WYSIWYG de narrativa:** Editar textos narrativos y descripciones de escenas (prompts) con preview en tiempo real
  - **Gestión de dimensiones:** Cambiar page_width_mm y page_height_mm por libro
  - **Selector de motor de IA:** Seleccionar generation_engine per book (dropdown admin)
  - **Reordenamiento de escenas:** Drag & drop para reordenar el flujo narrativo
  - **Subida de referencias de estilo:** Subir imágenes de referencia visual por libro
  - **Ajuste de prompts:** Editar prompts por escena y ver resultado
  - **Comparación de versiones:** Side-by-side de múltiples generaciones
  - **Historial de regeneración:** Ver qué se regeneró y cuándo por variante/página
  - **Gestión del catálogo de libros**
  - **Gestionar pedidos y fulfillment**
- **Dispositivo:** Desktop (panel de admin)

### TAM Estimado

- Chile: ~250.000 nacimientos/año + cumpleaños de niños 0-6 años
- Mercado inicial: Familias chilenas de NSE ABC1-C2 + comunidad de expatriados/bilingües
- Expansión LATAM: México, Colombia, Argentina (Fase 3+)
- Mercado comparable: Wonderbly genera >$100M USD anuales a nivel global

---

## 4. Arquitectura de Datos

### Input — Qué entra al sistema

| Dato | Tipo | Fuente | Obligatorio |
|------|------|--------|-------------|
| Nombre del niño/a | Texto (form) | Comprador | Sí |
| Género | Selección (niño/niña) | Comprador | Sí |
| Color de pelo | Selección (3 opciones) | Comprador | Sí |
| Tipo de pelo | Selección (liso/ondulado) | Comprador | Sí |
| Tono de piel | Selección (3 opciones) | Comprador | Sí |
| ¿Usa lentes? | Toggle (sí/no) | Comprador | Sí |
| Dedicatoria | Texto libre | Comprador | Sí (V1) |
| Idioma del libro | Selección | Comprador | Sí (V1: 1 idioma) |
| Datos de pago | Flow.cl | Comprador | Sí |
| Dirección de envío | Form | Comprador | Sí |
| Código de descuento | Texto (opcional) | Comprador | No |
| Foto del regalador | Imagen | Comprador | No (V2) |
| Segundo idioma | Selección | Comprador | No (V2) |

### Output — Qué sale del sistema

| Dato | Tipo | Destino | Formato |
|------|------|---------|---------|
| Preview del libro | Ilustraciones + texto superpuesto | Comprador (pantalla) | JPEG/WebP (preview) |
| Libro animado (page-flip) | Página interactiva | Comprador (pantalla) | Web 3D/canvas animation |
| Archivo para impresión | Ilustraciones + texto compuesto | Imprenta | PDF high-res (300dpi, CMYK) |
| Libro personalizado impreso | Libro físico 22×18cm, 20 páginas | Cliente final | Impresión offset/digital |
| Confirmación de pedido | Email | Comprador | Email transaccional |
| Notificación de envío | Email | Comprador | Email con tracking |
| Factura/boleta | Documento fiscal | Comprador | PDF o electrónica (SII Chile) |

### Entidades Principales (Modelo Conceptual v3.0)

| Entidad | Descripción | Relaciones |
|---------|-------------|------------|
| **Book** | Plantilla de un libro del catálogo (escenas, estilo, textos base, dimensiones, motor IA) | Tiene muchas Scenes. Tiene muchas CharacterVariants. Campos: page_width_mm, page_height_mm, generation_engine. |
| **Scene** | Una escena/spread individual del libro (descripción visual, texto narrativo con `{name}`, posición de cámara, iluminación) | Pertenece a un Book. |
| **CharacterVariant** | Una combinación específica de atributos de personaje (género + pelo + piel + lentes) para un Book. Contiene el status de aprobación. | Pertenece a un Book. Tiene muchas VariantPages. |
| **VariantPage** | Una imagen pre-generada para una escena específica dentro de una variante específica. Incluye image_url, prompt_used, quality_score. | Pertenece a un CharacterVariant y a una Scene. |
| **Order** | Pedido de un comprador (nombre del niño + variante + dedicatoria + pago + envío + estado de fulfillment) | Referencia un CharacterVariant, un Book, un User, un DiscountCode (opcional). Estados: paid → composing → sent_to_printer → qa → packed → shipped → delivered |
| **User** | Comprador (guest o registrado) | Tiene muchos Orders. |
| **DiscountCode** | Código de descuento (porcentaje, monto fijo, usos limitados, expiración) | Puede usarse en muchos Orders. Campos: code, type (percentage/fixed), value, max_uses, used_count, expires_at, is_active. |
| **Subscriber** | Email capturado en waitlist pre-lanzamiento | Campos: email, source, subscribed_at, is_active. |

> Para schemas SQL detallados y pipeline de pre-generación, ver `TIPITI-IMAGE-GENERATION-GUIDELINES.md` §3, §5 y §6.

---

## 5. KPIs de Éxito

### Métrica Principal

**50-70 libros vendidos en el primer mes** tras el lanzamiento.

### Métricas del Funnel

| Etapa | Métrica | Target |
|-------|---------|--------|
| Visitas | Usuarios únicos en tipitibooks.com | Tracking |
| Intención | Usuarios que inician personalización | >30% de visitas |
| Configuración completa | Usuarios que terminan de personalizar | >50% de los que inician |
| Preview | Usuarios que ven el preview del libro | >70% de configuración completa |
| Compra | Conversión a pago | >15% de los que ven preview |
| Satisfacción | NPS post-entrega | >8/10 |

### Métricas Operativas (Actualizadas v3.0)

| Métrica | Target |
|---------|--------|
| Variantes aprobadas por libro | ~80/~80 (100% cobertura) |
| Tiempo de aprobación por variante | <5 min revisión manual |
| Tiempo total de pre-generación por libro | <24 horas (batch completo) |
| Uptime del preview instantáneo | >99.5% |

### Métricas Comerciales (Nuevas v3.0)

| Métrica | Target |
|---------|--------|
| Tasa de conversión (view preview → compra) | >15% |
| Valor promedio de pedido (AOV) | ~$40 USD |
| Tasa de descuento utilizado | >20% (TIPITI20 u otros) |
| Email delivery rate (confirmación, envío) | >98% |

### Hitos Temporales

- **Semana 2:** Primer libro con todas las ~80 variantes pre-generadas y aprobadas
- **Semana 3:** Primer libro impreso y entregado (proof of concept end-to-end)
- **Mes 1:** 50-70 unidades vendidas
- **Mes 2:** Landing page con waitlist y storytelling activo
- **Mes 3:** Segundo título en catálogo

### Marketing

- Canal principal: **Influencers mamás** (Instagram, TikTok)
- La experiencia de unboxing del empaque premium ES el contenido de marketing
- Sin Google Ads en la fase inicial
- Estrategia pre-lanzamiento: Waitlist / landing page "Reserva el tuyo" con email capture via Resend
- Promoción de lanzamiento: Código TIPITI20 (20% off) para primeros 50 compradores

---

## 6. Modelo de Negocio

### Monetización

Venta directa de libros personalizados (e-commerce B2C). Cada libro se vende individualmente. No hay modelo de suscripción en V1.

### Pricing (actualizado v3.0)

| Componente | Costo estimado | Nota |
|------------|---------------|------|
| Pre-generación de variantes (fal.ai) | ~$35-100 USD/libro | **Costo ÚNICO por libro del catálogo** (reducido: ~80 variantes vs 96 antes) |
| Composición texto + imagen (por venta) | ~$0 USD | Proceso automático sin costo de IA |
| Impresión (proveedor: Emotions) | ~$8-12 USD/libro | Por unidad, 22×18 cm |
| Envío (proveedor → Sofi) | ~$3-5 USD | Por unidad |
| Empaque premium | ~$3-5 USD | Por unidad |
| Envío (Sofi → cliente) | ~$5-8 USD (Chile) | Por unidad |
| **Costo variable por venta** | **~$19-30 USD** | Sin costo de generación de IA |
| **Precio de venta** | **~$40 USD (~$37.000 CLP)** | — |
| **Margen bruto** | **~33-55%** | Mejor que v1.0 por optimización de variantes y determinismo |

**Amortización del costo de pre-generación:** El costo fijo de ~$35-100 USD por libro se amortiza rápidamente. Con 50 ventas del primer libro, el costo por unidad baja a <$0.7-2 USD.

### Competencia

| Competidor | Qué hacen | Precio a Chile | Nuestra diferencia |
|------------|-----------|----------------|-------------------|
| Wonderbly | Libros personalizados premium, ilustración profesional | $60+ USD | Precio 35% menor, enfocado en LATAM, empaque de regalo |
| Hooray Heroes | Personalización por foto, estilo cartoon | $50+ USD | Calidad artística superior (acuarela vs cartoon genérico) |
| Opciones locales LATAM | Libros con IA genérica | $15-30 USD | Calidad de ilustración premium, consistencia de personaje, no "AI slop" |
| Libros artesanales (Etsy) | Hechos a mano | $40-80 USD | Escalable, entrega más rápida, precio competitivo |

### Diferenciadores Clave

1. **Calidad artística:** Estilo acuarela/pintado a mano con detalles ricos, no "AI slop"
2. **Consistencia de personaje:** FLUX Kontext + curación manual garantizan que el niño se ve igual en todas las páginas
3. **Precio accesible para LATAM:** ~$40 USD vs $60+ de la competencia
4. **Experiencia de regalo premium:** Empaque de regalo incluido, no es "solo un libro"
5. **Determinismo y predictibilidad:** El comprador sabe exactamente qué ilustraciones recibirá (no hay aleatoriedad)
6. **Detalles que enamoran:** Animalitos escondidos, peluches recurrentes, easter eggs que los niños buscan en cada lectura
7. **Preview instantáneo:** Gracias a la pre-generación, el comprador ve su libro personalizado al instante (sin esperas de generación)
8. **Storytelling de marca:** Landing page con la historia de Sofi como mamá, la experiencia de bedtime routine que quería comprar y no existía

---

## 7. Alcance del MVP (Fase 1)

### Features Core (Debe tener)

1. **Landing Page + Storytelling**
   - Hero con ilustración acuarela full-screen
   - Historia de Sofi: mamá, rutina de dormir, qué quiso comprar y no existía
   - "Cómo funciona" en 3 pasos visuales (elegir libro → configurar personaje → recibir)
   - Galería de ejemplos de páginas del libro
   - CTA emocional + soft urgency ("producción artesanal, edición limitada")
   - Waitlist form con email capture (Resend)

2. **Catálogo web + Storefront UX**
   - Catálogo de 1-2 libros iniciales (empezando por "Buenas Noches")
   - Configurador visual WIZARD (no flat form):
     - Paso 1: Nombre del niño/a
     - Paso 2: Selección visual de personaje en grid de imágenes (actualización en tiempo real)
     - Paso 3: Accesorios (V1: opcional, heredados de variante)
     - Paso 4: Dedicatoria
     - Paso 5: Preview animado (page-flip)
   - Inspiración: Wonderbly — buyer elige visualmente con grid, no con dropdowns
   - Personaje actualiza en tiempo real con cada selección
   - Mobile-first responsive (70%+ de compras desde mobile)
   - Full book preview con animación de page-flip (el "WOW moment" de la compra)

3. **Sistema de pre-generación y curación de variantes (Admin)**
   - Pipeline batch para generar las ~80 variantes de un libro: portrait base → character sheet → 11 páginas por variante
   - Panel de curación: Sofi revisa cada variante, aprueba/rechaza/regenera páginas individuales
   - Dashboard de progreso: cuántas variantes aprobadas vs pendientes vs rechazadas por libro
   - Motor: FLUX Kontext Pro vía fal.ai
   - Ver `TIPITI-IMAGE-GENERATION-GUIDELINES.md` para especificaciones completas

4. **Editor de Libros Completo en Admin**
   - Cambiar page_width_mm y page_height_mm por libro
   - Reordenar escenas con drag & drop
   - WYSIWYG editor para texto narrativo por escena (con {name} visible)
   - Preview en tiempo real de texto + imagen
   - Upload/cambio de imágenes de referencia de estilo por libro
   - Selector de AI generation engine por libro (dropdown)
   - Ajuste de prompts por escena + preview de resultado
   - Comparación side-by-side de versiones generadas
   - Historial de regeneración por variante/página

5. **Composición de archivo final y checkout**
   - Motor de composición: superponer texto narrativo (con `{name}` reemplazado) + dedicatoria sobre las ilustraciones pre-generadas
   - Generación de PDF high-res para impresión (300dpi, CMYK)
   - Pago con **Flow.cl** (primary) como gateway principal
   - **MercadoPago** como opción secundaria (para saldo MP y cuotas sin interés)
   - Flujo de pedido: pago → composición → envío a imprenta (proveedor TBD) → envío a Sofi → QA + empaque premium → envío al cliente
   - Email de confirmación de pedido
   - Email de notificación de envío
   - Códigos de descuento aplicables en checkout

6. **Dashboard Operacional de Pedidos (NEW)**
   - Estados progresivos: paid → composing → sent_to_printer → qa → packed → shipped → delivered
   - Alertas si un pedido no ha progresado en X días
   - Métricas: ventas dia/semana/mes, variantes más populares, tasa de conversión
   - Vista timeline de pedidos
   - Notificaciones de alertas operativas

7. **Panel de administración (Sofi)**
   - Gestión del catálogo de libros y sus escenas
   - Editar textos narrativos de cada escena (correcciones de idioma, ajustes de estilo)
   - Editar descripciones visuales de escenas (ajustar prompts de generación)
   - Lanzar y monitorear pipeline de pre-generación
   - Curación de variantes (aprobar/rechazar/regenerar)
   - Gestionar pedidos, estados de fulfillment y operación
   - Gestionar códigos de descuento (crear, desactivar, ver uso)
   - Gestionar suscriptores / waitlist

8. **Sistema de Descuentos (NEW)**
   - Tabla: discount_codes (code, type: percentage/fixed, value, max_uses, used_count, expires_at, is_active)
   - Admin UI para crear códigos manualmente
   - Validación y aplicación en checkout antes de pago
   - Lanzamiento: TIPITI20 = 20% off para primeros 50 compradores

9. **Integración de Newsletter/Waitlist (NEW)**
   - Email capture en landing page y post-compra
   - Tabla: subscribers (email, source, subscribed_at, is_active)
   - Integración con Resend para envío
   - Pre-lanzamiento: manejo de waitlist

### Features Diferidas (Fase 2+)

**V2 (Months 4-8):**
- Referrals program (comprador recibe $5 USD por referido)
- Bundles (2 libros con descuento)
- Gift cards
- Checkout upsells (empaque premium adicional, etc.)
- Segundo personaje (modelo híbrido: P1 pre-generado, P2 on-demand)
- Foto del regalador en dedicatoria/última página
- Accesorios premium (freckles, headbands, sleep caps)
- Opción bilingüe (segundo idioma en espacio negativo)
- Style LoRA entrenado para estilo Tipiti propio
- Notificaciones por WhatsApp

**V3 (Months 9+):**
- Tipiti Club membership (descuento recurrente, acceso a libros early)
- Promociones estacionales
- Programa de influencers
- Expansión a otros países LATAM

### Explícitamente Fuera de Alcance (MVP)

- **No PDF/digital:** Solo libro físico impreso. No se ofrece versión digital descargable.
- **No generación on-demand:** Las imágenes se pre-generan por variantes. No hay generación de imágenes al momento de la compra.
- **No auto-agendar citas ni dashboard complejo:** La operación la maneja Sofi manualmente con apoyo del panel admin.
- **No Google Ads ni paid acquisition:** Marketing solo vía influencers orgánico en V1.
- **No multi-idioma en la UI:** La interfaz web es en español (Chile). El libro puede estar en otro idioma pero la plataforma no.
- **No creación de cuenta obligatoria:** Guest checkout con email. Cuenta opcional post-compra.

---

## 8. Consideraciones Especiales

### Requisitos No Funcionales

- **Autenticación:** Guest checkout (email) para compradores. Login con email/password para Sofi (admin). No se requiere OAuth ni SSO en V1.
- **Roles/Permisos:** 2 roles — Comprador (guest) y Admin (Sofi). En V1, Sofi es la única admin.
- **Pagos/Billing:**
  - **Primary:** Flow.cl (REST API, inline/popup, acepta Webpay/tarjetas/transferencia)
  - **Secondary:** MercadoPago (para balance MP y cuotas sin interés)
  - Stripe no opera directamente en Chile (requiere LLC en US)
  - Ambos soportan tarjetas de crédito/débito y transferencia bancaria
- **Datos Sensibles:**
  - Datos de pago manejados 100% por Flow.cl y MercadoPago (PCI compliance delegada). No se almacenan datos de tarjeta.
  - Datos personales del niño (nombre) requieren política de privacidad clara.
  - Consentimiento explícito de los padres.
- **Integraciones externas:**
  - fal.ai API (pre-generación de imágenes — solo usado en admin, no en flujo de compra)
  - Flow.cl API (pagos — primary)
  - MercadoPago API (pagos — secondary)
  - Proveedor de impresión API (TBD — placeholder)
  - Resend (email transaccional + newsletter)
- **Multi-idioma (contenido):** Los textos del libro pueden estar en cualquier idioma. La UI de la plataforma es solo en español (V1).
- **Multi-tenant:** No. Single-tenant (Tipiti Books es el único operador).
- **Offline:** No requerido.
- **Performance:** El preview es instantáneo (lookup de variante pre-generada). La composición del archivo final para impresión es automática y rápida (<30 segundos). La pre-generación de variantes es asíncrona (solo la usa Sofi desde el admin, no afecta al comprador).

### Restricciones Conocidas

- **Proveedor de impresión:** Emotions, 22×18 cm default. Configurable por libro. Sistema debe ser agnóstico al proveedor, con una interfaz/adaptador que permita cambiar de proveedor sin rediseñar el flujo.
- **Fulfillment modelo artesanal (V1 → V2 → V3):**
  - **V1 (Month 1-3):** Emotions imprime → Sofi recibe → QA manual + empaque manual → envío al cliente. ~15-20 pedidos/semana.
  - **V2 (Month 4-8):** Negociar envío directo de proveedor a cliente. Outsource empaque si el volumen lo justifica.
  - **V3 (Month 9+):** Fulfillment profesional. Gelato o similar para expansión LATAM.
- **Empresa en trámite:** La sociedad/inicio de actividades en SII está en proceso. Facturación electrónica se implementará cuando esté listo.
- **Dominio en proceso:** tipitibooks.com (o similar) está en proceso de adquisición.
- **Token limit de FLUX Kontext:** 512 tokens máximo por prompt. Los prompts deben ser optimizados para no exceder este límite.
- **Formato de impresión configurable:** Páginas default 22×18 cm pero configurable per book. El personaje no puede quedar en el centro (zona del pliegue). Esto impone restricciones de composición que deben estar codificadas en el prompt builder.
- **~80 variantes por libro:** Cada nuevo libro del catálogo requiere generación y curación de ~880 imágenes (~80 variantes × 11 páginas). Esto representa un esfuerzo inicial significativo pero amortizable.

### Riesgos Identificados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Curación de ~80 variantes es muy lenta | Medio — retrasa lanzamiento de nuevos libros | Priorizar variantes más comunes primero (ej: pelo castaño/negro). Implementar QA semi-automatizado con CLIP scoring en Fase 2. |
| Inconsistencia del personaje entre páginas de una variante | Alto — producto defectuoso | Pipeline de QA por variante: Sofi revisa las 11 páginas juntas. Regeneración selectiva de páginas individuales. FLUX Kontext tiene 94% fidelidad. |
| Costos de pre-generación mayores a lo estimado | Bajo — costo es fijo y predecible | ~$35-100 USD por libro es controlable. Monitorear costo por imagen. Migración a LoRA en Fase 2-3. |
| Proveedor de impresión no cumple calidad | Alto — producto defectuoso, marca dañada | QA manual por Sofi antes de cada envío. Tener 2-3 proveedores evaluados como backup. |
| Cuello de botella en fulfillment manual | Medio — limita crecimiento | Limitar ventas iniciales. Plan de transición a fulfillment service en Fase 2. |
| fal.ai downtime durante pre-generación | Bajo — no afecta ventas, solo la creación de nuevos libros | Pre-generación se hace con anticipación. Inngest maneja reintentos automáticos. Endpoint de fallback (Replicate). |
| Derechos de imagen / privacidad de menores | Alto — riesgo legal | Política de privacidad clara. Solo se almacena el nombre del niño (no fotos en V1). Consentimiento explícito de los padres. |
| Textos generados por IA inapropiados o con errores | Medio — experiencia del usuario | Panel de edición para Sofi. Revisión humana de todos los textos antes de publicar un libro en catálogo. |
| Combinatoria explota en V2 con segundo personaje | Medio — limita escalabilidad | Modelo híbrido: personaje 1 pre-generado (~80), personaje 2 on-demand. Evaluar selective pre-generation para combos más populares. |
| Flow.cl integración fallida | Alto — bloquea monetización | Implementar MercadoPago como fallback. Testing exhaustivo antes de lanzamiento. |

---

## 9. UX y Experiencia del Usuario

### Storefront UX (Buyer Journey)

El storefront implementa un **wizard configurador visual**, inspirado en Wonderbly:

**Paso 1: Explorar**
- Comprador entra a tipitibooks.com
- Ve landing page con storytelling (la historia de Sofi)
- Elige un libro del catálogo
- Botón "Personalizar mi libro"

**Paso 2: Nombre**
- Input text para nombre del niño/a
- Validación en tiempo real
- Avance automático o botón "Siguiente"

**Paso 3: Personaje (Visual Grid)**
- Grid interactivo de avatares (mini previews de cada variante)
- Buyer elige: género → pelo (color + tipo) → piel → lentes
- Cada selección actualiza el grid y muestra una preview grande del personaje seleccionado
- NOT dropdowns — toda interacción es visual y rápida
- Mobile: grid stacks, swipe-friendly

**Paso 4: Dedicatoria**
- Textarea libre para dedicatoria
- Character counter (máx 200 caracteres)
- Preview en tiempo real

**Paso 5: Preview Mágico**
- Full-page preview interactivo del libro con animación de page-flip
- El nombre del niño superpuesto en las páginas
- "This is your book" moment — conversión máxima aquí
- Botón "Comprar" destaca

**Checkout: Flow.cl Inline**
- Formulario de envío (nombre, dirección, teléfono)
- Código de descuento (opcional)
- Botón "Pagar" abre widget inline de Flow.cl
- Post-pago: confirmación y email transaccional

### Landing Page (Storytelling)

**Hero Section:**
- Ilustración acuarela full-screen (estilo Tipiti, personaje + ambiente cálido)
- Headline: "Un libro donde [child's name] es la protagonista"
- Subheadline: "Ilustraciones a mano, personalizadas con amor. Desde $40 USD."
- CTA primario: "Crea tu libro" o "Ver ejemplos"

**La Historia de Sofi:**
- Video o sección con foto + texto
- Contexto emocional: Mamá, bedtime routine, quiso comprar un libro especial para su hija, no existía la combinación que buscaba
- Cómo nació Tipiti Books
- Valores: artesanía, calidad, amor por los detalles

**Cómo Funciona (3 pasos visuales):**
1. Elige el libro + personaliza a tu niño/a (icono + ilustración)
2. Nosotros generamos tu libro único (icono + ilustración)
3. Recibes en casa, empaque premium listo para regalar (icono + ilustración)

**Galería de Ejemplos:**
- 6-8 spreads de ejemplo del libro "Buenas Noches"
- Muestra variedad de personajes diferentes
- Detalles que enamoran: "Busca al osito en cada página"

**Social Proof (cuando disponible):**
- Testimonios de madres/abuelas
- Fotos de unboxing reales
- Rating/NPS

**Waitlist / Pre-Lanzamiento CTA:**
- "Reserva el tuyo" — email form con Resend
- Beneficio: "Primeros 50 compradores reciben TIPITI20: 20% off"
- Messaging: "Edición artesanal, producción limitada. Sofi cura cada libro personalmente."

### Admin Panel (Editor Completo)

**Sección: Mis Libros**
- Lista de libros del catálogo
- Status de cada uno (draft, published, archived)
- Acciones: Editar, Pre-generar, Ver Ordenes

**Editar Libro:**
- Nombre del libro
- Descripción
- Edad objetivo (0-3, 3-5, etc.)
- **Dimensiones:** page_width_mm, page_height_mm (inputs numéricos)
- **Motor IA:** dropdown (FLUX Kontext, otros en Fase 2)
- Imágenes de referencia de estilo (upload múltiple)
- Ordena de escenas (drag & drop)
- Publicar / Guardar

**Editor de Escenas (WYSIWYG):**
- Lista de escenas en sidebar (1-11 numeradas)
- Cada escena:
  - **Descripción Visual:** textarea con prompt para IA (preview en tiempo real)
  - **Texto Narrativo:** WYSIWYG editor con {name} variable visible (resaltada)
  - **Posición de Personaje:** left / right toggle (alternancia automática)
  - **Espacio de Texto:** top-left / bottom-left / top-right / bottom-right selector
  - Vista previa: lado derecho muestra imagen generada + texto superpuesto
  - Botón "Regenerar esta escena" si no gusta

**Pre-Generación de Variantes:**
- Botón "Generar todas las variantes" (batch)
- Progress bar de generación (en tiempo real, polling backend)
- Log de errores/warnings
- Opción de retry en variantes fallidas

**Curación de Variantes:**
- Grid de todas las ~80 variantes (mini thumbnails)
- Filtros: género, pelo, piel, lentes, status (pending/approved/rejected)
- Click en thumbnail abre modal con 11 páginas de esa variante
- Por cada página: imagen grande + {name} superpuesto
- Botones: ✅ Approve, ❌ Reject, 🔄 Regenerate (page específica)
- Navegación: prev/next variant
- Bulk actions: Approve todas, Reject todas

**Dashboard de Ordenes:**
- Lista de todos los pedidos
- Columnas: OrderID, Nombre Niño/a, Libro, Variante, Estado, Fecha
- Estados: paid → composing → sent_to_printer → qa → packed → shipped → delivered
- Filtros: estado, fecha, libro
- Click en orden abre detalles:
  - Datos del comprador
  - Datos del niño (nombre, variante seleccionada)
  - Dedicatoria
  - Preview del libro (page-flip)
  - Botón "Cambiar Estado" (dropdown)
  - Botón "Enviar Email" (confirmación, envío, etc.)
  - Historial de cambios de estado

**Alertas Operativas:**
- Pedidos "stalled" (no progresaron en X días)
- Notificación: rojo si >7 días en mismo estado
- Métricas dashboard:
  - Ventas hoy/esta semana/este mes
  - Variante más popular
  - Conversion rate (preview → compra)
  - Ingresos vs costos

**Gestión de Descuentos:**
- Tabla de códigos activos
- Crear nuevo: código + tipo (% o $ fijo) + valor + max usos + fecha expiración
- Ver uso de cada código
- Desactivar / Editar

**Gestión de Suscriptores (Waitlist):**
- Lista de emails en waitlist
- Filtro: origen (landing, popup, etc.)
- Acciones: enviar email (template), marcar como convertido, eliminar

---

## 10. Modelo de Fulfillment

### V1: Manual Artesanal (Mes 1-3)

```
Comprador paga → Sistema compone PDF → Envío a Emotions (imprenta)
→ Empieza a imprimir (3-5 días) → Envío a Sofi (1-2 días)
→ Sofi QA manual + empaque premium (1 día) → Envío al cliente (2-3 días Chile)
```

- **Throughput:** ~15-20 pedidos por semana (limitación de Sofi)
- **Tiempo total:** ~8-12 días desde pago a entrega
- **Costo operacional:** Tiempo de Sofi + materiales empaque
- **Calidad:** 100% QA manual

### V2: Híbrido (Mes 4-8)

```
Comprador paga → Sistema compone PDF → Envío directo a Emotions
→ Emotions imprime + envía directamente al cliente (opcional: a Sofi primero)
```

- Negociar con Emotions envío directo a cliente (sin pasar por Sofi)
- Sofi recibe muestras aleatorias para QA spot-check
- Outsource empaque si volumen justifica
- **Throughput:** ~50-100 pedidos por semana
- **Tiempo total:** ~6-8 días

### V3: Profesional (Mes 9+)

```
Comprador paga → Sistema compone PDF → Integración API con Gelato/similar
→ Fulfillment center imprime + empaca + envía directo
```

- Full integration con plataforma de fulfillment global
- Soporte multi-país LATAM
- Sofi monitorea vía dashboard
- **Throughput:** Ilimitado

---

## 11. Brand y Identidad Visual

### Guía de Marca (TBD — Outsourced a Designer)

Pending: Logo, color palette, typography, tone of voice

Esta sección será completada cuando se contrate a un diseñador de marca. Actualmente bloquea el diseño de storefront; Carlos puede avanzar con arquitectura y lógica mientras se resuelve en paralelo.

**Placeholder para cuando esté lista:**
- Logo mark + wordmark
- Primary colors (3-4) + secondary (2-3)
- Typography: headings (font), body (font)
- Tone of voice: warm, maternal, artisanal, premium
- Imagery style: acuarela, pastel, handmade aesthetic
- Button styles, spacing, component library

---

## 12. Configuración de Motor de IA por Libro

**Nueva capacidad (v3.0):** Cada libro tiene un campo `generation_engine` en la tabla `books`. Admin puede seleccionar qué motor usar para cada libro via dropdown.

| Motor | Estado | Notas |
|-------|--------|-------|
| FLUX Kontext Pro (fal.ai) | MVP (v1) | Default para "Buenas Noches". 94% fidelidad. |
| FLUX Kontext (Replicate fallback) | Fallback | Mismo modelo, endpoint alternativo si fal.ai cae. |
| Style LoRA (custom trained) | V2+ | Entrenado en estilo Tipiti propio. |
| OpenAI DALL-E 3 | Evaluación | Para V2+. Más lento pero 100% compliance. |

**Admin puede cambiar engine sin tocar código.** El prompt builder debe ser agnóstico al motor.

---

## 13. Restricciones Conocidas (Actualizado v3.0)

- **Dimensiones de página:** Default 22×18 cm (Emotions), pero configurable per book en admin
- **Motor de IA:** Default FLUX Kontext, configurable per book
- **Fulfillment V1 es manual:** ~15-20 pedidos/semana. Escalable a V2 en mes 4-8
- **~80 variantes por libro:** Reducidas de 96. Combinaciones biológicamente válidas solamente
- **Determinismo:** Comprador B recibe MISMAS ilustraciones que comprador A si eligen mismo personaje. No hay generación aleatoria.
- **Token limit FLUX:** 512 tokens máximo por prompt
- **Proveedor de impresión:** Emotions es primary (22×18). Agnóstico a futuro.
- **Empresa en SII:** Facturación electrónica pending. Boletas manuales en MVP si es necesario.
- **Flow.cl + MercadoPago:** Stripe no viable en Chile sin LLC USA
- **Datos de menor:** No se almacenan fotos. Solo nombre. Consentimiento claro de padres requerido.

---

## 14. Gaps Identificados y Recomendaciones

> Observaciones que surgieron durante la entrevista de negocio y se han resuelto en v3.0

- **Pagos:** RESUELTO — Flow.cl primary, MercadoPago secondary
- **Fulfillment:** DOCUMENTADO — Roadmap V1→V2→V3 articulado
- **Descuentos:** IMPLEMENTADO — Tabla discount_codes, admin UI
- **Newsletter:** IMPLEMENTADO — Subscribers table, Resend integration
- **Admin panel:** EXPANDIDO — Editor WYSIWYG, dashboard operativo, métricas
- **Storefront UX:** MEJORADO — Wizard visual, page-flip preview, mobile-first
- **Brand:** PENDIENTE — Outsourced a designer. Runs in parallel con dev
- **Variantes:** OPTIMIZADO — 96→80, biológicamente válidas

---

## 15. Próximos Pasos (Pipeline)

Una vez aprobado este PDR v3.0, los siguientes documentos generarán:

1. ⬜ **Tech Spec** — Definición de stack técnico, arquitectura, esquema de base de datos, integraciones (Flow.cl, Resend)
2. ⬜ **User Stories** — Historias de usuario completas con criterios de aceptación (INVEST)
3. ⬜ **Wireframes** — Wireframes low-res desktop + mobile para cada pantalla (storefront + admin)
4. ⬜ **Stitch Prompts** — Design System + prompts para convertir wireframes a UI real
5. ⬜ **Master Blueprint** — Plan de implementación por fases con estimaciones

### Documentos de Referencia

- `TIPITI-IMAGE-GENERATION-GUIDELINES.md` v2.0 — Fuente de verdad técnica para generación de imágenes (pre-generación por variantes, schemas SQL, prompt builder, API specs, pipeline de curación)
- `Tipiti_Books_Investigacion_Consistencia_Personajes.md` — Investigación inicial sobre modelos y técnicas
- `Comparativa_Enfoques_Consistencia.md` — Análisis comparativo IP-Adapter vs FLUX Kontext

---

*PDR v3.0 generado con el pipeline de App Factory*
*Actualizado: determinismo, Flow.cl, admin expandido, storefront UX, fulfillment roadmap, ~80 variantes*
