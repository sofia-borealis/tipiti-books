# Tipiti Books — User Stories

> **Versión**: 1.0
> **Estado**: BORRADOR
> **Fecha**: 2026-02-25
> **PDR**: PDR-tipiti-books.md v3.0
> **Tech Spec**: TECH-SPEC-tipiti-books.md v2.0
> **Total Stories**: 56 (P0: 48 | P1: 8)

---

## User Journey Maps

### Comprador (Guest, Mobile-First)

```
Landing Page → Explorar Catálogo → Elegir Libro → Wizard Configurador
  (nombre → personaje visual → dedicatoria → preview page-flip)
  → Checkout (código descuento + Flow.cl / MercadoPago)
  → Email confirmación → Esperar fulfillment → Recibir libro
```

### Sofi (Admin, Desktop)

```
Login → Dashboard Operacional → Gestionar Libros (editor completo)
  → Pre-generar Variantes (pipeline batch) → Curar Variantes (aprobar/rechazar)
  → Gestionar Pedidos (fulfillment) → Descuentos → Suscriptores/Waitlist
```

---

## Resumen de Epics

| Epic | Stories | Prioridad | Descripción |
|------|---------|-----------|-------------|
| Epic 1: Landing Page + Storytelling | US-001 a US-004 | P0 | Hero, historia de Sofi, cómo funciona, waitlist CTA |
| Epic 2: Catálogo + Detalle de Libro | US-005 a US-007 | P0 | Listado, detalle, CTA personalizar |
| Epic 3: Wizard Configurador de Personaje | US-008 a US-013 | P0 | Nombre, grid visual, dedicatoria, lookup variante |
| Epic 4: Preview del Libro | US-014 a US-016 | P0 | Page-flip, nombre superpuesto, WOW moment |
| Epic 5: Checkout + Pagos | US-017 a US-022 | P0 | Envío, descuento, Flow.cl, MercadoPago, webhooks |
| Epic 6: Emails Transaccionales | US-023 a US-025 | P0 | Confirmación, envío, notificación admin |
| Epic 7: Newsletter / Waitlist | US-026 a US-028 | P0 | Capture email, subscribers, gestión admin |
| Epic 8: Auth Admin | US-029 a US-031 | P0 | Login, protección rutas, logout |
| Epic 9: Gestión de Libros + Editor | US-032 a US-037 | P0 | CRUD, editor escenas, dimensiones, motor IA, drag & drop |
| Epic 10: Pre-generación de Variantes | US-038 a US-041 | P0 | Pipeline batch, monitor, retry, money shot |
| Epic 11: Curación de Variantes | US-042 a US-045 | P0 | Grid, modal 11 páginas, aprobar/rechazar, bulk |
| Epic 12: Pedidos + Fulfillment | US-046 a US-050 | P0 | Lista, estados, composición PDF, alertas |
| Epic 13: Sistema de Descuentos | US-051 a US-053 | P0 | CRUD códigos, validación checkout |
| Stories No-Funcionales | US-054 a US-056 | P0/P1 | Performance, SEO, error pages |

---

## Epic 1: Landing Page + Storytelling

> La puerta de entrada emocional a Tipiti Books. Debe enamorar al comprador en los primeros 5 segundos y guiarlo hacia la acción (personalizar un libro o unirse a la waitlist).

### US-001: Ver Landing Page con Hero Emocional

**Como** comprador potencial que llega a tipitibooks.com
**Quiero** ver una página de entrada visualmente impactante con ilustraciones acuarela
**Para** entender inmediatamente qué es Tipiti Books y sentir ganas de explorar más

**Acceptance Criteria:**

Funcionalidad:
- [ ] Hero section ocupa el viewport completo con ilustración acuarela de fondo
- [ ] Headline principal visible: "Un libro donde [nombre] es la protagonista" (o variante aprobada por marca)
- [ ] Subheadline con precio de referencia: "Ilustraciones a mano, personalizadas con amor. Desde $40 USD."
- [ ] CTA primario visible above the fold: "Crea tu libro" que lleva al catálogo
- [ ] CTA secundario: "Ver ejemplos" que scroll suave a la galería

Validaciones:
- [ ] Página carga en <3 segundos en conexión 3G (LCP <2.5s)

UX:
- [ ] Mobile-first: hero y CTAs se ven correctamente en viewport 375px
- [ ] Imagen hero se sirve en WebP con fallback JPG
- [ ] Animación sutil de entrada (fade-in) con Framer Motion, no bloquea interacción

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** Ninguna
**Notas técnicas:** Server Component (SSR). Imágenes desde Supabase Storage CDN. Tailwind CSS 4 para responsive.

---

### US-002: Leer la Historia de Sofi (Storytelling)

**Como** comprador potencial que quiere entender quién está detrás del producto
**Quiero** ver una sección que cuente la historia personal de Sofi como mamá
**Para** conectar emocionalmente con la marca y confiar en que el producto está hecho con amor

**Acceptance Criteria:**

Funcionalidad:
- [ ] Sección "Nuestra Historia" con foto/video de Sofi + texto narrativo
- [ ] Cuenta la historia: mamá, rutina de dormir, quiso comprar un libro especial para su hija, no existía
- [ ] Valores de la marca visibles: artesanía, calidad, amor por los detalles
- [ ] Scroll suave desde el hero a esta sección

UX:
- [ ] Mobile: contenido stack vertical, imagen arriba, texto abajo
- [ ] Texto legible (min 16px en mobile)
- [ ] Lazy loading de la imagen/video

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-001
**Notas técnicas:** Contenido estático, SSR.

---

### US-003: Ver Sección "Cómo Funciona" en 3 Pasos

**Como** comprador que no entiende el producto aún
**Quiero** ver un resumen visual de cómo funciona en 3 pasos simples
**Para** entender rápidamente que es fácil y querer probarlo

**Acceptance Criteria:**

Funcionalidad:
- [ ] 3 pasos visuales con ícono/ilustración + texto corto cada uno:
  1. "Elige el libro y personaliza a tu niño/a"
  2. "Nosotros generamos tu libro único"
  3. "Recibes en casa, listo para regalar"
- [ ] Galería de 6-8 spreads de ejemplo del libro "Buenas Noches" mostrando variedad de personajes
- [ ] Detalle que invita a buscar: "Busca al osito en cada página" o similar

UX:
- [ ] Mobile: steps stack vertical con scroll
- [ ] Desktop: steps en fila horizontal
- [ ] Galería con scroll horizontal (swipeable en mobile)

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-001

---

### US-004: Unirse a la Waitlist (Pre-Lanzamiento)

**Como** visitante interesado que aún no puede comprar (pre-lanzamiento)
**Quiero** dejar mi email para ser notificado cuando Tipiti Books lance
**Para** ser de los primeros en comprar y acceder al descuento de lanzamiento

**Acceptance Criteria:**

Funcionalidad:
- [ ] Formulario de email visible en la landing (sección final y/o popup)
- [ ] Mensaje: "Primeros 50 compradores reciben TIPITI20: 20% off"
- [ ] Al enviar email: guardar en tabla `subscribers` con source='landing_waitlist'
- [ ] Mostrar confirmación: "¡Listo! Te avisaremos cuando lancemos."
- [ ] Enviar email de bienvenida via Resend con el código TIPITI20

Validaciones:
- [ ] Email formato válido (user@domain.com). Si es inválido: "Ingresa un email válido"
- [ ] Email duplicado: "Este email ya está registrado. ¡Te avisaremos pronto!"

Error Handling:
- [ ] Si Resend falla: guardar subscriber de todos modos, reintentar email en background
- [ ] Si Supabase falla: "Hubo un error. Intenta nuevamente en unos segundos."

UX:
- [ ] Input + botón en una línea (mobile: stacked)
- [ ] Loading spinner en botón mientras procesa
- [ ] Animación de confirmación (checkmark)

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** Ninguna
**Notas técnicas:** Server Action para insertar en Supabase + trigger Resend. Zod schema subscribeNewsletterSchema.

---

## Epic 2: Catálogo + Detalle de Libro

> El comprador explora los libros disponibles y elige cuál personalizar. En V1 hay 1-2 libros, pero la arquitectura soporta N libros.

### US-005: Ver Catálogo de Libros Disponibles

**Como** comprador que quiere elegir un libro para regalar
**Quiero** ver todos los libros disponibles con sus portadas e información básica
**Para** decidir cuál libro personalizar para el niño/a

**Acceptance Criteria:**

Funcionalidad:
- [ ] Grid de libros publicados (books.is_published = true)
- [ ] Cada card muestra: portada (cover_template_url), título, edad objetivo (target_age), precio en CLP
- [ ] Click en card lleva a la página de detalle del libro
- [ ] Si solo hay 1 libro, mostrar igualmente como catálogo (para escalar)

Empty State:
- [ ] Si no hay libros publicados: "Estamos preparando algo especial. ¡Vuelve pronto!" + link a waitlist

UX:
- [ ] Mobile: cards en columna single (full width)
- [ ] Desktop: grid de 2-3 columnas
- [ ] Hover effect sutil en cards (desktop)

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-001 (comparte layout)
**Notas técnicas:** Server Component con query a Supabase. RLS filtra solo is_published=true.

---

### US-006: Ver Detalle de un Libro

**Como** comprador que quiere saber más sobre un libro antes de personalizarlo
**Quiero** ver el detalle del libro con ejemplos de páginas, descripción y precio
**Para** decidir si es el libro correcto para el niño/a al que se lo voy a regalar

**Acceptance Criteria:**

Funcionalidad:
- [ ] Título del libro, descripción, edad objetivo
- [ ] Galería de 4-6 spreads de ejemplo (usando variantes aprobadas aleatorias como muestra)
- [ ] Precio en CLP prominente
- [ ] Información de formato: "20 páginas, 22×18 cm, impresión premium"
- [ ] CTA principal: "Personalizar este libro" → lleva al wizard configurador
- [ ] Sección de preguntas frecuentes del libro (cuánto tarda, de qué material es, etc.)

UX:
- [ ] Galería swipeable en mobile
- [ ] CTA sticky en mobile (bottom bar)
- [ ] Breadcrumb: Home > Catálogo > [Nombre del libro]

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-005
**Notas técnicas:** Route /libro/[slug]. Server Component. Imágenes de muestra desde variant_pages de variantes aprobadas.

---

### US-007: Compartir Libro en Redes Sociales

**Como** comprador emocionado con el libro que encontró
**Quiero** poder compartir el link del libro con amigos o familia
**Para** que otros también conozcan Tipiti Books o me den su opinión

**Acceptance Criteria:**

Funcionalidad:
- [ ] Botón de compartir (share API nativa en mobile, o copiar link en desktop)
- [ ] Open Graph meta tags correctos: título, descripción, imagen de portada
- [ ] URL amigable: tipitibooks.com/libro/buenas-noches

UX:
- [ ] En mobile: usa la Share API nativa del navegador
- [ ] En desktop: botón "Copiar link" con feedback "¡Copiado!"

**Prioridad:** P1
**Estimación:** S (1-2 días)
**Dependencias:** US-006

---

## Epic 3: Wizard Configurador de Personaje

> El corazón de la experiencia de compra. Un wizard visual paso a paso donde el comprador construye el personaje del niño/a. Cada selección actualiza el preview en tiempo real. Mobile-first, interacción visual (grids, no dropdowns).

### US-008: Ingresar Nombre del Niño/a (Paso 1 del Wizard)

**Como** comprador que inicia la personalización del libro
**Quiero** ingresar el nombre del niño/a que recibirá el libro
**Para** que el libro sea verdaderamente personal con su nombre en cada página

**Acceptance Criteria:**

Funcionalidad:
- [ ] Input de texto para nombre del niño/a
- [ ] Placeholder: "¿Cómo se llama el/la protagonista?"
- [ ] Preview en tiempo real: muestra el nombre en una frase de ejemplo ("Buenas noches, [nombre]")
- [ ] Botón "Siguiente" para avanzar al Paso 2
- [ ] El nombre se guarda en el store de Zustand (configurator-store)

Validaciones:
- [ ] Nombre requerido. Si vacío: "Ingresa el nombre del niño/a"
- [ ] Mínimo 2 caracteres, máximo 30
- [ ] Solo letras, espacios y tildes (ñ, á, é, etc.). Si incluye números o símbolos: "El nombre solo puede contener letras"
- [ ] Se capitaliza automáticamente la primera letra

UX:
- [ ] Autofocus en el input al entrar al paso
- [ ] Enter avanza al siguiente paso
- [ ] Indicador de progreso del wizard (paso 1 de 4)
- [ ] Animación de transición entre pasos (Framer Motion)

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-006
**Notas técnicas:** Zustand store para estado del wizard. Zod validation. Route /libro/[slug]/personalizar.

---

### US-009: Seleccionar Género del Personaje (Parte del Paso 2)

**Como** comprador que configura el personaje
**Quiero** elegir si el personaje es niño o niña
**Para** que el personaje se parezca al destinatario del regalo

**Acceptance Criteria:**

Funcionalidad:
- [ ] Dos opciones visuales: Niño y Niña (ilustraciones de ejemplo, no solo texto)
- [ ] Selección exclusiva (solo uno a la vez)
- [ ] Al seleccionar, el preview del personaje se actualiza inmediatamente
- [ ] La selección determina el estilo de pelo (niño = corto, niña = largo)

UX:
- [ ] Cards grandes con ilustración representativa de cada género
- [ ] Selección visual clara (borde destacado, escala sutil)
- [ ] Transición animada al cambiar de género

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-008
**Notas técnicas:** Parte del Step 2 del wizard. Actualiza Zustand store.gender.

---

### US-010: Seleccionar Apariencia del Personaje en Grid Visual (Paso 2)

**Como** comprador que configura el personaje del niño/a
**Quiero** elegir el tono de piel, color de pelo, tipo de pelo y lentes en un grid visual interactivo
**Para** que el personaje se parezca lo más posible al niño/a real

**Acceptance Criteria:**

Funcionalidad:
- [ ] Grid visual con opciones de tono de piel (3): claro, mate, oscuro — representados con swatches de color o mini ilustraciones
- [ ] Grid de color de pelo: 4 opciones para piel clara/mate (rubio, castaño, pelirrojo, negro), 1 opción para piel oscura (solo negro)
- [ ] Al seleccionar piel oscura, las opciones de pelo se reducen automáticamente a solo "negro" con mensaje: "Para piel oscura, el cabello es negro"
- [ ] Toggle tipo de pelo: liso / ondulado (visual, no dropdown)
- [ ] Toggle lentes: sí / no (visual con preview del personaje con/sin lentes)
- [ ] Preview grande del personaje seleccionado se actualiza en tiempo real con cada cambio
- [ ] El preview muestra el portrait de la variante que coincide con la selección actual (lookup en variant_pages)

Validaciones:
- [ ] Todas las opciones son obligatorias antes de avanzar
- [ ] Solo combinaciones biológicamente válidas permitidas (oscuro + rubio/pelirrojo/castaño = bloqueado)

Error Handling:
- [ ] Si la variante seleccionada no está aprobada aún: "Esta combinación estará disponible pronto. Prueba con otra similar." + sugerencias de variantes cercanas disponibles

UX:
- [ ] Mobile: opciones stack vertical, preview fijo arriba (sticky)
- [ ] Desktop: opciones a la izquierda, preview grande a la derecha
- [ ] Cada selección tiene animación de transición suave
- [ ] Selección actual destacada con borde de color + checkmark
- [ ] NO usar dropdowns — todo es interacción visual directa (grids, swatches, toggles)

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-009
**Notas técnicas:** Zustand store actualiza hair_color, hair_type, skin_tone, has_glasses. findVariant() hace lookup en Supabase para obtener portrait_url de la variante que coincide. Si no hay match aprobado, muestra placeholder.

---

### US-011: Escribir Dedicatoria (Paso 3 del Wizard)

**Como** comprador que quiere agregar un mensaje personal al libro
**Quiero** escribir una dedicatoria que se imprimirá en el libro
**Para** que el regalo sea aún más especial y emotivo

**Acceptance Criteria:**

Funcionalidad:
- [ ] Textarea para dedicatoria libre
- [ ] Placeholder inspirador: "Escribe un mensaje especial para [nombre]..."
- [ ] Counter de caracteres visible: "X/200 caracteres"
- [ ] Preview de cómo se verá la dedicatoria en la página del libro

Validaciones:
- [ ] Dedicatoria requerida (V1). Si vacía: "Escribe una dedicatoria para [nombre]"
- [ ] Máximo 200 caracteres. Al llegar a 200: input se bloquea, counter en rojo

UX:
- [ ] Textarea autoexpand según contenido
- [ ] Preview en tiempo real de la dedicatoria en tipografía del libro
- [ ] Botón "Siguiente" para ir al preview final

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-010

---

### US-012: Ver Resumen de Selección antes del Preview

**Como** comprador que terminó de configurar el personaje
**Quiero** ver un resumen de mi selección antes de ver el preview completo
**Para** confirmar que todo está correcto antes de decidir si compro

**Acceptance Criteria:**

Funcionalidad:
- [ ] Resumen visual: nombre del niño/a, portrait del personaje, atributos seleccionados (género, pelo, piel, lentes), dedicatoria
- [ ] Botón "Editar" que permite volver a cualquier paso del wizard
- [ ] Botón "Ver mi libro" que lleva al preview page-flip (US-014)

UX:
- [ ] Layout limpio y centrado
- [ ] Portrait del personaje prominente
- [ ] Transición animada al preview

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-011

---

### US-013: Navegar Libremente entre Pasos del Wizard

**Como** comprador que está personalizando el libro
**Quiero** poder ir adelante y atrás entre los pasos del wizard sin perder mis selecciones
**Para** poder cambiar de opinión en cualquier momento sin empezar de cero

**Acceptance Criteria:**

Funcionalidad:
- [ ] Indicador de progreso clickeable (pasos 1-4)
- [ ] Click en paso anterior: navega sin perder datos del store
- [ ] Botón "Atrás" en cada paso
- [ ] El estado se mantiene en Zustand al navegar (no se pierde al cambiar pasos)

UX:
- [ ] Progreso visual (barra o dots con estado activo/completado/pendiente)
- [ ] Transiciones direccionales (slide left/right según dirección de navegación)
- [ ] Steps completados tienen checkmark visual

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-008

---

## Epic 4: Preview del Libro

> El "WOW moment" de la experiencia. El comprador ve su libro personalizado completo con animación page-flip. Esto es donde se cierra la venta emocionalmente.

### US-014: Ver Preview Animado del Libro (Page-Flip)

**Como** comprador que terminó de configurar el personaje
**Quiero** ver mi libro completo personalizado con una animación de pasar páginas
**Para** emocionarme con el resultado y decidir comprarlo

**Acceptance Criteria:**

Funcionalidad:
- [ ] Animación de page-flip que muestra las 11 páginas del libro (portada + 9 spreads + final)
- [ ] Ilustraciones pre-generadas de la variante seleccionada (variant_pages.image_url)
- [ ] Nombre del niño/a superpuesto como texto en cada página donde aparece {name}
- [ ] Dedicatoria visible en la página designada
- [ ] Controles: pasar página adelante/atrás, ir a página específica

Empty State:
- [ ] Si la variante no tiene todas las páginas aprobadas: "Estamos terminando de preparar esta combinación. Intenta con otra similar." (no debería pasar en producción)

UX:
- [ ] Mobile: swipe left/right para pasar páginas
- [ ] Desktop: click en bordes o flechas + keyboard arrows
- [ ] Animación fluida de page-flip (Framer Motion o CSS 3D transform)
- [ ] Fullscreen option en mobile
- [ ] Loading skeleton mientras carga las imágenes

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-012
**Notas técnicas:** Imágenes servidas desde Supabase Storage CDN. Texto superpuesto client-side con canvas o absolute positioned divs. Zustand store tiene variant_id seleccionado.

---

### US-015: Ver CTA de Compra Después del Preview

**Como** comprador emocionado después de ver el preview de su libro
**Quiero** ver un botón claro para proceder a la compra
**Para** no tener que buscar cómo comprarlo — la acción es obvia

**Acceptance Criteria:**

Funcionalidad:
- [ ] CTA prominente: "Comprar por $XX.XXX CLP" (precio real del libro)
- [ ] Precio visible en CLP
- [ ] Mini resumen: nombre del niño, variante seleccionada (thumbnail), libro elegido
- [ ] Link "Editar personalización" para volver al wizard

UX:
- [ ] Botón sticky en mobile (bottom bar)
- [ ] Color de acento, tamaño grande, imposible de ignorar
- [ ] Micro-copy debajo: "Producción artesanal. Envío en 8-12 días." (manage expectations)

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-014

---

### US-016: Compartir Preview del Libro

**Como** comprador que quiere mostrar el libro antes de comprarlo
**Quiero** poder capturar o compartir una imagen del preview
**Para** pedir opinión a mi pareja/familia o compartir en redes

**Acceptance Criteria:**

Funcionalidad:
- [ ] Botón "Compartir preview" que genera un link único temporal al preview
- [ ] El link muestra el preview read-only (sin opción de compra)
- [ ] Expira después de 7 días

UX:
- [ ] Share API nativa en mobile
- [ ] "Copiar link" en desktop con feedback

**Prioridad:** P1
**Estimación:** M (3-4 días)
**Dependencias:** US-014

---

## Epic 5: Checkout + Pagos

> El flujo de pago con Flow.cl como gateway principal y MercadoPago como secundario. Incluye formulario de envío, aplicación de código de descuento y webhooks de confirmación.

### US-017: Completar Formulario de Envío

**Como** comprador que decidió comprar el libro
**Quiero** ingresar mis datos de envío
**Para** recibir el libro en la dirección correcta

**Acceptance Criteria:**

Funcionalidad:
- [ ] Campos: nombre completo, email, teléfono, dirección, ciudad, región, código postal
- [ ] País pre-seleccionado: Chile (V1 solo Chile)
- [ ] Email del comprador se usa para confirmación y tracking
- [ ] Resumen del pedido visible: libro, variante (thumbnail), nombre del niño, dedicatoria, precio

Validaciones:
- [ ] Nombre: requerido, mínimo 3 caracteres
- [ ] Email: formato válido. Si inválido: "Ingresa un email válido"
- [ ] Teléfono: formato chileno (+56 9 XXXX XXXX). Si inválido: "Ingresa un número de teléfono válido"
- [ ] Dirección: requerida, mínimo 10 caracteres
- [ ] Ciudad y región: requeridos

UX:
- [ ] Mobile: formulario en una columna, teclado numérico para teléfono
- [ ] Autofill compatible (autocomplete attributes correctos)
- [ ] Botón "Continuar al pago" disabled hasta que el formulario sea válido

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-015
**Notas técnicas:** Zod schema orderSchema para validación client+server. Server Action para crear order en estado 'created'.

---

### US-018: Aplicar Código de Descuento en Checkout

**Como** comprador que tiene un código de descuento
**Quiero** ingresarlo en el checkout para obtener un descuento
**Para** pagar menos por mi libro

**Acceptance Criteria:**

Funcionalidad:
- [ ] Input de código de descuento en la sección de resumen del checkout
- [ ] Botón "Aplicar" que valida el código contra tabla `discount_codes`
- [ ] Si código válido: mostrar descuento aplicado, nuevo total calculado
- [ ] Si código de porcentaje: "TIPITI20 — 20% off: -$X.XXX CLP"
- [ ] Si código de monto fijo: "AMIGOS — $5.000 CLP off: -$5.000 CLP"
- [ ] Botón "Quitar" para remover el descuento aplicado

Validaciones:
- [ ] Código inexistente: "Código no válido. Verifica que esté bien escrito."
- [ ] Código expirado: "Este código ya expiró."
- [ ] Código agotado (used_count >= max_uses): "Este código ya fue utilizado el máximo de veces."
- [ ] Código desactivado (is_active = false): "Este código no está disponible."

UX:
- [ ] Input colapsable (link "¿Tienes un código de descuento?")
- [ ] Loading spinner mientras valida
- [ ] Animación al aplicar descuento (precio tachado + nuevo precio)
- [ ] Total se actualiza en tiempo real

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-017
**Notas técnicas:** API endpoint /api/discount-codes valida contra Supabase. Zod schema applyDiscountCodeSchema.

---

### US-019: Pagar con Flow.cl (Gateway Principal)

**Como** comprador que completó el formulario de envío
**Quiero** pagar con tarjeta de crédito/débito o Webpay a través de Flow.cl
**Para** completar mi compra de forma segura y rápida

**Acceptance Criteria:**

Funcionalidad:
- [ ] Al clickear "Pagar", se abre el widget inline/popup de Flow.cl (sin redirect a otra página)
- [ ] Flow.cl maneja: tarjetas de crédito, tarjetas de débito, Webpay, transferencia bancaria
- [ ] El monto enviado a Flow.cl incluye el descuento aplicado (si hay)
- [ ] Al pago exitoso: webhook de Flow.cl actualiza order.payment_status = 'approved'
- [ ] Al pago exitoso: redirect a página de confirmación (/checkout/success)

Error Handling:
- [ ] Pago rechazado: "No pudimos procesar tu pago. Verifica los datos de tu tarjeta e intenta nuevamente."
- [ ] Timeout de Flow.cl: "El pago está tomando más tiempo de lo esperado. No cierres esta ventana."
- [ ] Error de red: "Error de conexión. Intenta nuevamente."

UX:
- [ ] Widget Flow.cl inline (no redirect — mejor UX)
- [ ] Loading overlay mientras procesa el pago
- [ ] No permitir doble-click en botón de pago (disable después del primer click)

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-017
**Notas técnicas:** Flow.cl REST API con inline/popup. FLOW_API_KEY, FLOW_SECRET_KEY en env. Webhook route: /api/webhooks/flow. Firma HMAC para validar webhook.

---

### US-020: Pagar con MercadoPago (Opción Secundaria)

**Como** comprador que prefiere usar su saldo de MercadoPago o pagar en cuotas sin interés
**Quiero** tener la opción de pagar con MercadoPago
**Para** usar el método de pago que me resulte más conveniente

**Acceptance Criteria:**

Funcionalidad:
- [ ] Opción visible: "Pagar con MercadoPago" como alternativa a Flow.cl
- [ ] Al seleccionar: redirect a Checkout Pro de MercadoPago
- [ ] Soporta: saldo MP, tarjetas en cuotas sin interés, transferencia
- [ ] Webhook de MercadoPago actualiza order.payment_status y order.payment_provider = 'mercadopago'
- [ ] Al pago exitoso: redirect a página de confirmación

Error Handling:
- [ ] Pago rechazado por MercadoPago: redirect a /checkout/failure con mensaje de error
- [ ] Webhook no llega en 5 minutos: job de verificación en Inngest consulta status a MP

UX:
- [ ] Botón secundario (menos prominente que Flow.cl)
- [ ] Nota: "Serás redirigido a MercadoPago para completar el pago"

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-017
**Notas técnicas:** MercadoPago SDK. Checkout Pro (redirect). Webhook: /api/webhooks/mercadopago.

---

### US-021: Ver Confirmación de Compra Exitosa

**Como** comprador que acaba de pagar
**Quiero** ver una confirmación clara de que mi compra fue exitosa
**Para** tener tranquilidad de que todo está en orden y saber qué esperar

**Acceptance Criteria:**

Funcionalidad:
- [ ] Página de confirmación con: número de pedido, nombre del niño, libro comprado, precio pagado, descuento aplicado (si hubo)
- [ ] Mensaje: "¡Tu libro está en camino! Recibirás un email de confirmación en [email]."
- [ ] Timeline estimado: "Tu libro estará listo en 8-12 días hábiles"
- [ ] Resumen de dirección de envío
- [ ] Botón "Volver al inicio"

UX:
- [ ] Animación de celebración sutil (confetti o checkmark animado)
- [ ] Mobile-friendly
- [ ] No permitir navegar "atrás" al checkout (previene doble-compra)

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-019

---

### US-022: Ver Página de Pago Fallido

**Como** comprador cuyo pago fue rechazado
**Quiero** ver qué pasó y tener opciones para reintentar
**Para** no quedarme sin comprar el libro que ya personalicé

**Acceptance Criteria:**

Funcionalidad:
- [ ] Mensaje claro: "Tu pago no pudo ser procesado"
- [ ] Sugerencias: "Verifica los datos de tu tarjeta" o "Intenta con otro método de pago"
- [ ] Botón "Reintentar pago" que lleva de vuelta al checkout con datos preservados
- [ ] Botón "Cambiar método de pago"
- [ ] La order no se pierde — se mantiene en estado 'created' para reintento

UX:
- [ ] No generar ansiedad — tono tranquilizador
- [ ] No mostrar códigos de error técnicos al usuario

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-019

---

## Epic 6: Emails Transaccionales

> Emails automáticos que mantienen al comprador informado en cada etapa del proceso. Usan Resend + React Email templates.

### US-023: Recibir Email de Confirmación de Pedido

**Como** comprador que acaba de pagar
**Quiero** recibir un email de confirmación con los detalles de mi pedido
**Para** tener un registro de mi compra y saber que todo está en proceso

**Acceptance Criteria:**

Funcionalidad:
- [ ] Email enviado automáticamente al confirmar el pago (webhook trigger)
- [ ] Contenido: número de pedido, nombre del libro, nombre del niño, variante (thumbnail), precio pagado, descuento (si aplica), dirección de envío
- [ ] Timeline estimado: "Tu libro estará listo en 8-12 días hábiles"
- [ ] Remitente: hola@tipitibooks.com (o similar)
- [ ] Reply-to funcional (llega a Sofi)

Error Handling:
- [ ] Si Resend falla: reintentar 3 veces con backoff. Loguear en Sentry.

UX:
- [ ] Template con branding Tipiti (cuando brand esté lista, placeholder mientras tanto)
- [ ] Responsive (se ve bien en Gmail, Apple Mail, Outlook)

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-019
**Notas técnicas:** React Email template. Trigger: webhook de Flow.cl/MercadoPago → Inngest event → send email via Resend.

---

### US-024: Recibir Email de Notificación de Envío

**Como** comprador esperando su libro
**Quiero** recibir un email cuando mi libro haya sido enviado
**Para** saber que ya viene en camino y tener el número de tracking

**Acceptance Criteria:**

Funcionalidad:
- [ ] Email enviado cuando Sofi cambia estado del pedido a "shipped"
- [ ] Contenido: número de pedido, número de tracking (si disponible), empresa de envío
- [ ] Mensaje: "Tu libro ya está en camino. Estimamos que llegue en 2-3 días hábiles."
- [ ] Link de tracking (si disponible)

UX:
- [ ] Mismo template de branding que el email de confirmación
- [ ] Responsive

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-023

---

### US-025: Notificar a Sofi de Nuevo Pedido

**Como** Sofi (admin) que necesita gestionar cada pedido
**Quiero** recibir un email (o notificación en dashboard) cuando llegue un nuevo pedido
**Para** comenzar el proceso de fulfillment sin tener que revisar el dashboard constantemente

**Acceptance Criteria:**

Funcionalidad:
- [ ] Email a Sofi al confirmar pago con: nombre del comprador, libro, variante, dedicatoria, dirección
- [ ] Link directo al pedido en el admin panel
- [ ] Alternativa: badge de "nuevos pedidos" en el dashboard (P1)

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-023

---

## Epic 7: Newsletter / Waitlist

> Captura de emails pre-lanzamiento y post-compra. Alimenta la tabla subscribers para comunicación futura.

### US-026: Suscribirse al Newsletter Post-Compra

**Como** comprador que acaba de comprar un libro
**Quiero** que me ofrezcan suscribirme al newsletter de Tipiti Books
**Para** enterarme de nuevos libros y promociones futuras

**Acceptance Criteria:**

Funcionalidad:
- [ ] En la página de confirmación (post-compra): checkbox o CTA "¿Quieres recibir novedades?"
- [ ] Si acepta: guardar email en subscribers con source='post_purchase'
- [ ] No suscribir automáticamente — requiere acción explícita del comprador

UX:
- [ ] Checkbox pre-desmarcado (opt-in, no opt-out)
- [ ] Mensaje corto: "Te avisaremos cuando lancemos nuevos libros y promociones"

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-021

---

### US-027: Gestionar Lista de Suscriptores (Admin)

**Como** Sofi (admin)
**Quiero** ver y gestionar la lista de emails suscritos
**Para** saber cuántas personas están en mi waitlist y poder comunicarme con ellas

**Acceptance Criteria:**

Funcionalidad:
- [ ] Tabla de suscriptores con: email, source (landing_waitlist, post_purchase, popup), fecha, estado (activo/inactivo)
- [ ] Filtros: por source, por fecha, por estado
- [ ] Contador total de suscriptores activos
- [ ] Acción: marcar como "convertido" (cuando compra)
- [ ] Acción: desactivar suscriptor

UX:
- [ ] Tabla paginada (20 por página)
- [ ] Buscador por email

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-004, US-026
**Notas técnicas:** Admin route /admin/suscriptores. Query subscribers table con filtros.

---

### US-028: Exportar Lista de Suscriptores

**Como** Sofi (admin)
**Quiero** exportar la lista de suscriptores como CSV
**Para** poder usarla en herramientas externas de email marketing

**Acceptance Criteria:**

Funcionalidad:
- [ ] Botón "Exportar CSV" en la tabla de suscriptores
- [ ] CSV incluye: email, source, subscribed_at, is_active
- [ ] Respeta filtros activos (exporta solo lo filtrado)

**Prioridad:** P1
**Estimación:** S (1-2 días)
**Dependencias:** US-027

---

## Epic 8: Auth Admin

> Autenticación simple para Sofi. Email/password via Supabase Auth. Sin OAuth, sin magic links, sin SSO. Un solo usuario admin en V1.

### US-029: Iniciar Sesión como Admin

**Como** Sofi (admin)
**Quiero** iniciar sesión con mi email y contraseña
**Para** acceder al panel de administración de Tipiti Books

**Acceptance Criteria:**

Funcionalidad:
- [ ] Página de login en /admin/login con email + password
- [ ] Al autenticar correctamente: redirect a /admin/dashboard
- [ ] Sesión persiste (cookie httpOnly, Supabase Auth)
- [ ] "Recordar sesión" activo por defecto

Validaciones:
- [ ] Email inválido: "Ingresa un email válido"
- [ ] Credenciales incorrectas: "Email o contraseña incorrectos. Intenta nuevamente."

Error Handling:
- [ ] Supabase Auth down: "Error de conexión. Intenta en unos segundos."
- [ ] Demasiados intentos (rate limit): "Demasiados intentos. Espera 1 minuto."

UX:
- [ ] Formulario centrado, limpio, sin distracciones
- [ ] Loading state en botón mientras autentica
- [ ] Password input con toggle de visibilidad (ojo)

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** Ninguna
**Notas técnicas:** Supabase Auth email/password. Middleware de Next.js protege /admin/*. Role 'admin' en JWT claim.

---

### US-030: Protección de Rutas Admin

**Como** sistema
**Quiero** que todas las rutas /admin/* estén protegidas por autenticación
**Para** que ninguna persona no autorizada acceda al panel de administración

**Acceptance Criteria:**

Funcionalidad:
- [ ] Middleware de Next.js intercepta todas las rutas /admin/*
- [ ] Si no hay sesión válida: redirect a /admin/login
- [ ] Si hay sesión pero no es admin: redirect a / (homepage)
- [ ] Sesión expirada: redirect a /admin/login con mensaje "Tu sesión expiró. Inicia sesión nuevamente."

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-029
**Notas técnicas:** Next.js middleware + Supabase Auth getSession(). RLS policies en Supabase filtran datos por role.

---

### US-031: Cerrar Sesión como Admin

**Como** Sofi (admin)
**Quiero** poder cerrar mi sesión de forma segura
**Para** proteger el acceso al panel si dejo mi computadora abierta

**Acceptance Criteria:**

Funcionalidad:
- [ ] Botón "Cerrar sesión" visible en sidebar o header del admin
- [ ] Al clickear: destruir sesión en Supabase Auth + redirect a /admin/login
- [ ] Cookie de sesión eliminada

UX:
- [ ] Confirmación inmediata (no pedir "¿Estás segura?")

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-029

---

## Epic 9: Gestión de Libros + Editor

> Sofi gestiona el catálogo de libros, edita escenas, configura dimensiones, elige motor de IA y sube referencias de estilo. Es el control creativo total sobre cada libro.

### US-032: Ver Lista de Libros del Catálogo (Admin)

**Como** Sofi (admin)
**Quiero** ver todos mis libros del catálogo con su estado y progreso
**Para** saber cuáles están publicados, cuáles en progreso y cuáles necesitan atención

**Acceptance Criteria:**

Funcionalidad:
- [ ] Tabla/grid de libros con: título, slug, status (draft/published/archived), variantes aprobadas/total (ej: 65/80), target_age, generation_engine
- [ ] Filtros: por status, por edad objetivo
- [ ] Acciones por libro: Editar, Ver variantes, Pre-generar, Publicar/Despublicar
- [ ] Botón "Crear nuevo libro"

UX:
- [ ] Badges de color para status (draft=amarillo, published=verde, archived=gris)
- [ ] Progress bar para variantes aprobadas
- [ ] Click en fila lleva al editor del libro

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-030
**Notas técnicas:** Route /admin/libros. Query books table. Admin RLS policy.

---

### US-033: Crear/Editar Libro en Admin

**Como** Sofi (admin)
**Quiero** crear un nuevo libro o editar uno existente con todos sus parámetros
**Para** configurar cada aspecto del libro antes de generar las variantes

**Acceptance Criteria:**

Funcionalidad:
- [ ] Formulario con: título (title_template con {name}), slug, descripción, edad objetivo (dropdown), idioma default
- [ ] Campos de impresión: page_width_mm (input numérico, default 220), page_height_mm (default 180)
- [ ] Selector de motor IA: dropdown con opciones (FLUX Kontext Pro, FLUX Kontext Max, Kling, NanoBANA)
- [ ] Upload múltiple de imágenes de referencia de estilo (style_reference_urls) con preview
- [ ] Campo de style prompt (STYLE_BLOCK del libro) — textarea
- [ ] Precio en CLP (input numérico)
- [ ] Botón Guardar + Botón Publicar/Despublicar

Validaciones:
- [ ] Título requerido, debe contener {name}. Si falta: "El título debe incluir {name} para personalización"
- [ ] Slug requerido, auto-generado desde título, único. Si duplicado: "Este slug ya existe"
- [ ] Dimensiones: mínimo 100mm × 100mm, máximo 500mm × 500mm
- [ ] Precio: requerido, mínimo $1.000 CLP

Error Handling:
- [ ] Error al guardar: "No pudimos guardar los cambios. Intenta nuevamente."

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-032
**Notas técnicas:** Route /admin/libros/[bookId]/editor. Server Action para update books table.

---

### US-034: Editar Escenas de un Libro (Editor WYSIWYG)

**Como** Sofi (admin)
**Quiero** editar el texto narrativo y la descripción visual de cada escena del libro
**Para** refinar la historia y los prompts de generación de imágenes

**Acceptance Criteria:**

Funcionalidad:
- [ ] Sidebar con lista de escenas (0=portada, 1-9=spreads, 10=final)
- [ ] Click en escena abre editor con:
  - Descripción visual (textarea para prompt de IA) con preview de imagen generada al lado
  - Texto narrativo en WYSIWYG editor con {name} resaltado en color diferente
  - Posición de personaje: toggle left/right (alternancia automática sugerida)
  - Posición de texto: selector (top-left, bottom-left, top-right, bottom-right)
- [ ] Preview en tiempo real: texto narrativo superpuesto sobre la imagen de la escena
- [ ] Botón "Guardar escena" guarda cambios en tabla scenes
- [ ] Botón "Regenerar esta escena" (si la descripción visual cambió) — lanza job de regeneración selectiva

Validaciones:
- [ ] Texto narrativo requerido, debe contener {name} al menos una vez
- [ ] Descripción visual requerida

UX:
- [ ] Layout split: sidebar izquierda (lista escenas), editor centro, preview derecha
- [ ] Autosave cada 30 segundos (con indicador "Guardado" / "Sin guardar")
- [ ] Escenas con cambios no guardados: indicador visual (punto amarillo)

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-033
**Notas técnicas:** WYSIWYG: usar contenteditable con {name} highlighting, o TipTap editor. Preview: Sharp para overlay o client-side canvas.

---

### US-035: Reordenar Escenas con Drag & Drop

**Como** Sofi (admin)
**Quiero** reordenar las escenas del libro arrastrándolas
**Para** ajustar el flujo narrativo sin tener que recrear escenas

**Acceptance Criteria:**

Funcionalidad:
- [ ] Drag & drop en la lista de escenas del sidebar
- [ ] Al soltar: actualizar scene_number de todas las escenas afectadas en DB
- [ ] Portada (scene_number=0) y final (scene_number=10) no son movibles

UX:
- [ ] Visual feedback durante drag (elemento "flotante")
- [ ] Snap to position al soltar
- [ ] Undo: "Escenas reordenadas" con botón "Deshacer" (por 5 segundos)

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-034
**Notas técnicas:** dnd-kit o @hello-pangea/dnd para drag & drop. Server Action para batch update scene_number.

---

### US-036: Subir Setting Sheet para un Libro

**Como** Sofi (admin)
**Quiero** subir las imágenes del setting sheet (3 vistas del ambiente) para un libro
**Para** que el modelo de IA tenga referencia del ambiente al generar las escenas

**Acceptance Criteria:**

Funcionalidad:
- [ ] Sección "Setting Sheet" en el editor del libro
- [ ] Upload de 3 imágenes: frontal, lateral, detalle
- [ ] Preview de cada imagen subida
- [ ] Las URLs se guardan en books.setting_sheet_url y scenes.setting_reference_urls (JSONB: {"frontal": url, "lateral": url, "detail": url})
- [ ] Opción de reemplazar imágenes existentes

Validaciones:
- [ ] Formatos aceptados: PNG, JPG. Si otro: "Solo se aceptan imágenes PNG o JPG"
- [ ] Tamaño máximo: 20MB por imagen. Si excede: "La imagen es muy grande. Máximo 20MB."

UX:
- [ ] Drag & drop o selector de archivos
- [ ] Progress bar de upload
- [ ] Preview con labels (frontal, lateral, detalle)

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-033
**Notas técnicas:** Supabase Storage bucket 'setting-sheets'. Upload via signed URL.

---

### US-037: Configurar Motor de IA por Libro

**Como** Sofi (admin)
**Quiero** seleccionar qué modelo de IA usar para generar las variantes de cada libro
**Para** poder probar diferentes modelos y usar el que dé mejor resultado

**Acceptance Criteria:**

Funcionalidad:
- [ ] Dropdown en editor del libro: "Motor de Generación"
- [ ] Opciones: FLUX Kontext Pro (default), FLUX Kontext Max, Kling 1.6, NanoBANA
- [ ] Al cambiar motor: advertencia "Cambiar el motor requiere regenerar las variantes pendientes. Las variantes ya aprobadas no se ven afectadas."
- [ ] El campo books.generation_engine se actualiza en DB

UX:
- [ ] Label descriptivo junto a cada opción: costo, ventajas
- [ ] Badge "Recomendado" en FLUX Kontext Pro

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-033

---

## Epic 10: Pre-generación de Variantes

> El pipeline batch que genera las ~80 variantes de un libro usando el flujo Money Shot (portrait → character sheet → setting sheet → 11 páginas). Orquestado por Inngest.

### US-038: Lanzar Pre-generación de Todas las Variantes

**Como** Sofi (admin)
**Quiero** lanzar la generación automática de todas las ~80 variantes de un libro en un solo click
**Para** iniciar el proceso de creación de las ilustraciones sin tener que hacerlo una por una

**Acceptance Criteria:**

Funcionalidad:
- [ ] Botón "Generar todas las variantes" en la página de variantes del libro
- [ ] Al clickear: genera las ~80 combinaciones válidas (según matriz tono-color) y crea registros en character_variants con status='pending'
- [ ] Dispara evento Inngest 'book/generate-all-variants' con book_id
- [ ] Pipeline por variante: portrait (money shot) → character sheet (4 vistas) → 11 páginas con multi-referencia
- [ ] Cada imagen se genera con seed fijo (documentado en variant_pages.seed_used)
- [ ] Imágenes se almacenan en Supabase Storage (buckets: portraits, character-sheets, illustrations)
- [ ] Al terminar cada variante: status cambia a 'generated'

Error Handling:
- [ ] Si fal.ai falla en una variante: marcar como 'failed', continuar con las demás
- [ ] Retry automático hasta 3 veces con backoff exponencial
- [ ] Si todas las retries fallan: status='failed' con error message

UX:
- [ ] Confirmación antes de lanzar: "Esto generará ~80 variantes (~880 imágenes). Costo estimado: ~$35-100 USD. ¿Continuar?"
- [ ] No se puede lanzar si el libro no tiene escenas definidas ni setting sheet

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-033, US-036
**Notas técnicas:** Inngest function generate-all-variants.ts con concurrency limit ~4-8. Lee books.generation_engine dinámicamente. Prompt builder engine-aware.

---

### US-039: Monitorear Progreso de Pre-generación

**Como** Sofi (admin)
**Quiero** ver el progreso en tiempo real de la generación de variantes
**Para** saber cuánto falta y si hay errores que requieran atención

**Acceptance Criteria:**

Funcionalidad:
- [ ] Página /admin/generacion con vista del job activo
- [ ] Progress bar general: X/80 variantes completadas
- [ ] Desglose por variante: lista con status (pending, generating, generated, failed)
- [ ] Para cada variante: sub-progreso (portrait ✓, character sheet ✓, páginas 7/11)
- [ ] Log de errores/warnings en tiempo real
- [ ] Tiempo estimado restante

UX:
- [ ] Auto-refresh cada 5 segundos (polling) o Supabase Realtime
- [ ] Variantes fallidas destacadas en rojo
- [ ] Botón "Reintentar fallidas" para retry de las que fallaron

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-038
**Notas técnicas:** Polling a character_variants + variant_pages con filtro by book_id.

---

### US-040: Regenerar Variante Individual

**Como** Sofi (admin)
**Quiero** regenerar una variante específica (o una página individual de una variante)
**Para** corregir una variante fallida o insatisfactoria sin regenerar todo el libro

**Acceptance Criteria:**

Funcionalidad:
- [ ] Botón "Regenerar" en cada variante (regenera portrait + character sheet + 11 páginas)
- [ ] Botón "Regenerar página" en cada página individual (regenera solo esa página manteniendo el character sheet)
- [ ] Al regenerar portrait: cascada automática → nuevo character sheet → nuevas escenas (warning al usuario)
- [ ] Al regenerar solo una página: mantiene el mismo character sheet, mismo seed (o nuevo seed si se solicita)
- [ ] El seed se puede fijar manualmente (input opcional) o dejar auto

Error Handling:
- [ ] Si la regeneración falla: mantener la versión anterior, mostrar error

UX:
- [ ] Confirmación si es regeneración cascada: "Regenerar el portrait regenerará también el character sheet y las 11 páginas. ¿Continuar?"
- [ ] Para página individual: "Solo se regenerará esta página."

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-038

---

### US-041: Generar Variante con Combinación Específica

**Como** Sofi (admin)
**Quiero** generar una variante individual seleccionando la combinación exacta de atributos
**Para** priorizar combinaciones populares o testear resultados antes de generar el batch completo

**Acceptance Criteria:**

Funcionalidad:
- [ ] Formulario: seleccionar género, tono de piel, color de pelo (filtrado por validez), tipo de pelo, lentes
- [ ] Validación de combinación biológica (oscuro + rubio/pelirrojo = bloqueado)
- [ ] Botón "Generar esta variante" lanza el pipeline para esa combinación individual
- [ ] Si la variante ya existe: mostrar estado actual y opción de regenerar

UX:
- [ ] Preview de la combinación seleccionada (si existe una similar para referencia)

**Prioridad:** P1
**Estimación:** M (3-4 días)
**Dependencias:** US-038

---

## Epic 11: Curación de Variantes

> Sofi revisa cada variante generada, aprueba, rechaza o regenera páginas individuales. Es el control de calidad que garantiza la consistencia visual del producto.

### US-042: Ver Grid de Variantes de un Libro

**Como** Sofi (admin)
**Quiero** ver todas las ~80 variantes de un libro en un grid con thumbnails y estados
**Para** tener una vista panorámica del progreso y encontrar rápidamente las que necesitan atención

**Acceptance Criteria:**

Funcionalidad:
- [ ] Grid de ~80 variantes con thumbnail del portrait de cada una
- [ ] Cada card muestra: portrait thumbnail, atributos (género, pelo, piel, lentes), status (pending/generating/generated/approved/rejected)
- [ ] Filtros: por género, por color de pelo, por tono de piel, por status, por lentes
- [ ] Ordenar: por status (rejected primero), por fecha de generación
- [ ] Contador: "65/80 aprobadas | 10 pendientes | 5 rechazadas"
- [ ] Click en variante abre el detalle (US-043)

UX:
- [ ] Cards de color según status: verde=approved, amarillo=pending/generated, rojo=rejected, gris=pending
- [ ] Grid responsive: 4-6 columnas en desktop, 2-3 en tablet
- [ ] Búsqueda rápida por atributo

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-038
**Notas técnicas:** Route /admin/libros/[bookId]/variantes. Query character_variants con filtros.

---

### US-043: Revisar Detalle de una Variante (11 Páginas)

**Como** Sofi (admin)
**Quiero** ver las 11 páginas de una variante en detalle para decidir si la apruebo o rechazo
**Para** garantizar que la calidad visual es consistente en todas las páginas

**Acceptance Criteria:**

Funcionalidad:
- [ ] Modal o página con las 11 imágenes de la variante (portada + 9 spreads + final)
- [ ] Cada imagen a tamaño grande con texto {name} superpuesto para simular resultado final
- [ ] Por cada página: botones ✅ Approve, ❌ Reject, 🔄 Regenerate
- [ ] Si TODAS las páginas están aprobadas: variante status cambia a 'approved'
- [ ] Si alguna página se rechaza: variante status cambia a 'rejected' (requiere corrección)
- [ ] Info de la variante visible: género, pelo, piel, lentes, seeds usados
- [ ] Navegación: prev/next variante (sin volver al grid)

UX:
- [ ] Galería scroll vertical con imágenes grandes
- [ ] Keyboard shortcuts: A=aprobar, R=rechazar, N=siguiente variante
- [ ] Badge de status por página (approved/rejected/pending)
- [ ] Si portrait fue rechazado: warning "Rechazar el portrait requiere regenerar toda la variante"

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-042
**Notas técnicas:** Route /admin/libros/[bookId]/variante/[variantId]. Query variant_pages + scenes.

---

### US-044: Aprobar/Rechazar Variantes en Bulk

**Como** Sofi (admin)
**Quiero** aprobar o rechazar múltiples variantes a la vez
**Para** acelerar el proceso de curación cuando muchas variantes son satisfactorias

**Acceptance Criteria:**

Funcionalidad:
- [ ] Checkboxes de selección múltiple en el grid de variantes
- [ ] "Seleccionar todas (filtradas)"
- [ ] Botón "Aprobar seleccionadas" (bulk approve)
- [ ] Botón "Rechazar seleccionadas" (bulk reject)
- [ ] Confirmación: "¿Aprobar X variantes? Esta acción no se puede deshacer fácilmente."

UX:
- [ ] Barra de acciones aparece cuando hay selección activa (sticky bottom)
- [ ] Counter: "X variantes seleccionadas"

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-042

---

### US-045: Comparar Versiones de una Página (Side-by-Side)

**Como** Sofi (admin)
**Quiero** comparar dos versiones generadas de la misma página lado a lado
**Para** decidir cuál es mejor cuando regenero una página

**Acceptance Criteria:**

Funcionalidad:
- [ ] Al regenerar una página, la versión anterior se mantiene como "alternativa"
- [ ] Vista side-by-side: versión actual vs nueva generación
- [ ] Botón "Usar esta" en cada versión para elegir cuál aprobar
- [ ] Historial de regeneraciones visible (cuántas veces se regeneró, qué seeds se usaron)

UX:
- [ ] Slider superpuesto (antes/después) como alternativa al side-by-side
- [ ] Zoom para ver detalles

**Prioridad:** P1
**Estimación:** M (3-4 días)
**Dependencias:** US-043

---

## Epic 12: Pedidos + Fulfillment + Dashboard

> Gestión completa del ciclo de vida de un pedido: desde el pago hasta la entrega. Incluye composición del PDF, estados progresivos, alertas y métricas.

### US-046: Ver Lista de Pedidos (Admin)

**Como** Sofi (admin)
**Quiero** ver todos los pedidos con su estado actual y datos principales
**Para** gestionar el fulfillment de cada pedido de principio a fin

**Acceptance Criteria:**

Funcionalidad:
- [ ] Tabla de pedidos con columnas: ID, nombre del niño/a, libro, variante (thumbnail), estado, fecha de compra, monto pagado
- [ ] Estados: paid → composing → sent_to_printer → qa → packed → shipped → delivered
- [ ] Filtros: por estado, por fecha, por libro
- [ ] Ordenar: por fecha (más recientes primero por default), por estado
- [ ] Búsqueda: por nombre del niño, por email del comprador, por order ID
- [ ] Click en fila abre detalle del pedido

Empty State:
- [ ] "No hay pedidos aún. ¡Los primeros están por llegar!"

UX:
- [ ] Badges de color por estado (paid=azul, composing=amarillo, shipped=verde, delivered=gris)
- [ ] Tabla paginada (20 por página)
- [ ] Contadores arriba: "X en proceso | Y enviados | Z entregados"

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-030
**Notas técnicas:** Route /admin/pedidos. Query orders table con joins a books y character_variants.

---

### US-047: Ver y Gestionar Detalle de un Pedido

**Como** Sofi (admin)
**Quiero** ver todos los detalles de un pedido y poder cambiar su estado
**Para** gestionar cada paso del fulfillment manualmente

**Acceptance Criteria:**

Funcionalidad:
- [ ] Datos del comprador: nombre, email, teléfono
- [ ] Datos del niño: nombre, variante seleccionada (portrait thumbnail)
- [ ] Dedicatoria completa
- [ ] Dirección de envío
- [ ] Pago: monto, proveedor (Flow.cl/MP), descuento aplicado, fecha de pago
- [ ] Preview del libro (page-flip mini o galería de páginas)
- [ ] Link a PDF de impresión (si ya se compuso)
- [ ] Dropdown "Cambiar estado" con los estados disponibles según el actual
- [ ] Input para número de tracking (cuando estado = shipped)
- [ ] Historial de cambios de estado con timestamps
- [ ] Botón "Enviar email" manual: seleccionar template (confirmación, envío, custom)

Validaciones:
- [ ] No permitir retroceder estados (shipped no puede volver a qa)

UX:
- [ ] Layout en secciones colapsables
- [ ] Timeline visual del progreso del pedido
- [ ] Botón de acción principal destaca según estado actual (ej: "Marcar como enviado" si está en 'packed')

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-046

---

### US-048: Composición Automática del PDF para Impresión

**Como** sistema (automático post-pago)
**Quiero** generar el archivo PDF final para impresión automáticamente después del pago
**Para** que el libro esté listo para imprenta sin intervención manual

**Acceptance Criteria:**

Funcionalidad:
- [ ] Trigger: cuando order.payment_status cambia a 'approved'
- [ ] Proceso:
  1. Descargar ilustraciones hi-res (variant_pages.image_url_hires) de Supabase Storage
  2. Leer textos narrativos de scenes.text_narrative, reemplazar {name} por order.child_name
  3. Superponer texto sobre imágenes usando Sharp (posición definida por scenes.text_position)
  4. Insertar dedicatoria en la página designada
  5. Ensamblar PDF de 20 páginas con pdf-lib
  6. Dimensiones del PDF: books.page_width_mm × books.page_height_mm
  7. Subir PDF a Supabase Storage
  8. Actualizar order.print_file_url y order.status = 'composing' → 'ready_to_print'
- [ ] PDF generado en CMYK, 300 DPI, con bleed marks

Error Handling:
- [ ] Si falla la composición: status permanece en 'composing', loguear error en Sentry, notificar a Sofi
- [ ] Retry automático 2 veces

**Prioridad:** P0
**Estimación:** L (5+ días)
**Dependencias:** US-019
**Notas técnicas:** Inngest function triggered by order.paid event. Sharp para image composition. pdf-lib para PDF assembly. Supabase Storage bucket 'print-files'.

---

### US-049: Dashboard Operacional con Métricas

**Como** Sofi (admin)
**Quiero** ver un dashboard con métricas clave de mi negocio
**Para** entender cómo van las ventas y detectar problemas operacionales

**Acceptance Criteria:**

Funcionalidad:
- [ ] Métricas principales: ventas hoy, esta semana, este mes (cantidad + monto en CLP)
- [ ] Pedidos por estado: gráfico o contadores (cuántos en cada estado)
- [ ] Variante más popular (qué combinación se vende más)
- [ ] Alertas de pedidos "stalled": pedidos que llevan >3 días en el mismo estado (configurable)
- [ ] Lista rápida de los últimos 5 pedidos recientes
- [ ] Suscriptores totales en waitlist

UX:
- [ ] Cards con métricas principales en la parte superior
- [ ] Tabla/lista de alertas debajo
- [ ] Pedidos recientes como links rápidos
- [ ] Refresh automático cada 60 segundos

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-046
**Notas técnicas:** Route /admin/dashboard. Aggregation queries a orders, character_variants, subscribers.

---

### US-050: Alertas de Pedidos Atrasados

**Como** Sofi (admin)
**Quiero** que el sistema me avise cuando un pedido lleva demasiado tiempo en un estado
**Para** no dejar pedidos olvidados y mantener tiempos de entrega prometidos

**Acceptance Criteria:**

Funcionalidad:
- [ ] Pedido en estado >3 días sin cambio: badge amarillo "Atención"
- [ ] Pedido en estado >7 días sin cambio: badge rojo "Urgente"
- [ ] Email diario a Sofi si hay pedidos con alerta roja (via Resend/Inngest cron)
- [ ] Alertas visibles en dashboard y en la lista de pedidos

UX:
- [ ] Badge en sidebar: número de alertas activas
- [ ] Click en alerta lleva directo al pedido

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-049
**Notas técnicas:** Inngest cron job diario que checkea orders.updated_at vs now().

---

## Epic 13: Sistema de Descuentos

> CRUD de códigos de descuento y su validación en checkout. Código de lanzamiento: TIPITI20 (20% off, 50 usos).

### US-051: Crear y Gestionar Códigos de Descuento (Admin)

**Como** Sofi (admin)
**Quiero** crear y gestionar códigos de descuento para campañas de marketing
**Para** incentivar las primeras compras y poder hacer promociones

**Acceptance Criteria:**

Funcionalidad:
- [ ] Tabla de códigos con: código, tipo (porcentaje/monto fijo), valor, usos/max_usos, fecha de expiración, estado (activo/inactivo)
- [ ] Formulario "Crear código": código (texto libre o auto-generado), tipo (% o $), valor, máximo de usos (opcional), fecha de expiración (opcional)
- [ ] Acciones: editar, desactivar/activar, ver historial de uso
- [ ] Seed data: TIPITI20 = porcentaje, 20%, max 50 usos, sin expiración

Validaciones:
- [ ] Código único. Si duplicado: "Este código ya existe"
- [ ] Valor: >0. Si porcentaje: máximo 100%
- [ ] Expiración: debe ser fecha futura

UX:
- [ ] Tabla paginada con búsqueda por código
- [ ] Acciones inline (toggle activo/inactivo)

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-030
**Notas técnicas:** Table discount_codes. Admin routes.

---

### US-052: Validar Código de Descuento (API)

**Como** sistema
**Quiero** validar un código de descuento cuando el comprador lo ingresa en checkout
**Para** aplicar el descuento correcto solo si el código es válido

**Acceptance Criteria:**

Funcionalidad:
- [ ] Endpoint POST /api/discount-codes/validate con body: { code: string }
- [ ] Validaciones: código existe, is_active=true, used_count < max_uses (si hay max), no expirado (si hay fecha)
- [ ] Response exitosa: { valid: true, type: 'percentage'|'fixed', value: number, code: string }
- [ ] Response fallida: { valid: false, reason: 'not_found'|'expired'|'exhausted'|'inactive' }

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-051
**Notas técnicas:** Zod schema applyDiscountCodeSchema. Supabase query.

---

### US-053: Aplicar Descuento al Confirmar Pedido

**Como** sistema
**Quiero** registrar el descuento aplicado al crear el pedido confirmado
**Para** tener trazabilidad del descuento y actualizar el contador de usos

**Acceptance Criteria:**

Funcionalidad:
- [ ] Al crear order con pago exitoso: si hay código de descuento, guardar discount_code_id y discount_amount en la order
- [ ] Incrementar used_count en discount_codes
- [ ] Si used_count alcanza max_uses: desactivar código automáticamente
- [ ] El monto cobrado al comprador refleja el descuento

**Prioridad:** P0
**Estimación:** S (1-2 días)
**Dependencias:** US-052

---

## Stories No-Funcionales

> Stories técnicos que no pertenecen a un epic de usuario pero son necesarios para la calidad y operación del producto.

### US-054: Performance del Storefront

**Como** comprador navegando desde un celular con conexión 3G
**Quiero** que la tienda cargue rápidamente y funcione sin lag
**Para** no abandonar la compra por frustración con la velocidad

**Acceptance Criteria:**

Funcionalidad:
- [ ] Largest Contentful Paint (LCP) <2.5 segundos en 3G
- [ ] First Input Delay (FID) <100ms
- [ ] Cumulative Layout Shift (CLS) <0.1
- [ ] Imágenes servidas en WebP/AVIF con fallback
- [ ] Lazy loading de imágenes below the fold
- [ ] Lighthouse score >80 en mobile

**Prioridad:** P0
**Estimación:** M (3-4 días)
**Dependencias:** US-001, US-014
**Notas técnicas:** Next.js Image component con Supabase CDN. Server Components para SSR. Tailwind CSS minimal bundle.

---

### US-055: SEO Básico

**Como** Tipiti Books (negocio)
**Quiero** que las páginas del storefront estén optimizadas para buscadores
**Para** aparecer en Google cuando alguien busque "libros personalizados Chile"

**Acceptance Criteria:**

Funcionalidad:
- [ ] Meta tags dinámicos por página: title, description, og:image, og:title, og:description
- [ ] Sitemap.xml generado automáticamente
- [ ] robots.txt configurado (allow storefront, disallow admin)
- [ ] URLs semánticas: /libro/buenas-noches (no /libro/uuid-123)
- [ ] Structured data (JSON-LD) para producto en página de libro

**Prioridad:** P1
**Estimación:** M (3-4 días)
**Dependencias:** US-006
**Notas técnicas:** Next.js metadata API + generateMetadata().

---

### US-056: Páginas de Error (404, 500)

**Como** visitante que llega a una URL incorrecta o experimenta un error
**Quiero** ver una página amigable que me explique qué pasó
**Para** no sentirme perdido y poder volver a la tienda

**Acceptance Criteria:**

Funcionalidad:
- [ ] 404: "Esta página no existe" con ilustración Tipiti, link a Home y catálogo
- [ ] 500: "Algo salió mal" con ilustración, link a Home, sugerencia de reintentar
- [ ] Errores logueados en Sentry

UX:
- [ ] Consistente con el estilo visual de la marca
- [ ] Mobile-friendly
- [ ] No mostrar stack traces ni errores técnicos al usuario

**Prioridad:** P1
**Estimación:** S (1-2 días)
**Dependencias:** US-001

---

## Resumen de Dependencias

```
US-001 (Landing Hero)
  ├── US-002 (Historia Sofi) → US-003 (Cómo Funciona)
  ├── US-004 (Waitlist)
  └── US-005 (Catálogo) → US-006 (Detalle Libro) → US-008 (Wizard Paso 1)
                                                        ├── US-009 (Género)
                                                        ├── US-010 (Apariencia Grid)
                                                        ├── US-011 (Dedicatoria)
                                                        └── US-012 (Resumen) → US-014 (Preview Page-Flip)
                                                                                  └── US-015 (CTA Compra)
                                                                                        └── US-017 (Formulario Envío)
                                                                                              ├── US-018 (Código Descuento)
                                                                                              ├── US-019 (Flow.cl) → US-021 (Confirmación) → US-023 (Email Confirmación)
                                                                                              └── US-020 (MercadoPago)

US-029 (Login Admin)
  └── US-030 (Protección Rutas)
        ├── US-032 (Lista Libros) → US-033 (Editor Libro) → US-034 (Editor Escenas)
        │                                                   → US-036 (Setting Sheet)
        │                                                   → US-037 (Motor IA)
        │                                                   → US-038 (Pre-generación)
        │                                                        └── US-039 (Monitor) → US-040 (Regenerar)
        │                                                        └── US-042 (Grid Variantes) → US-043 (Detalle Variante) → US-044 (Bulk Actions)
        ├── US-046 (Lista Pedidos) → US-047 (Detalle Pedido)
        │                          → US-049 (Dashboard) → US-050 (Alertas)
        └── US-051 (Descuentos Admin) → US-052 (API Validación) → US-053 (Aplicar Descuento)
```

---

## Stories Diferidos (Post-MVP)

| Story | Epic | Razón de Diferimiento | Fase |
|-------|------|----------------------|------|
| Referrals program | Comercial | No necesario para lanzamiento | V2 |
| Bundles (2 libros con descuento) | Comercial | Requiere pricing dinámico | V2 |
| Gift cards | Comercial | Complejidad de fulfillment | V2 |
| Checkout upsells | Comercial | Optimizar después de validar funnel base | V2 |
| Segundo personaje | Configurador | Combinatoria explota (~6,400 variantes). Modelo híbrido necesario | V2 |
| Foto del regalador en dedicatoria | Configurador | Upload + procesamiento adicional | V2 |
| Accesorios premium (freckles, headbands) | Configurador | Requiere overlay system | V2 |
| Opción bilingüe | Texto | Layout y espacio negativo listos, falta implementación | V2 |
| Style LoRA training | Admin/AI | Prompts optimizados suficientes para V1 | V2 |
| Notificaciones WhatsApp | Comunicación | Canal secundario, email suficiente V1 | V2 |
| Tipiti Club membership | Comercial | Modelo de suscripción, post-product-market-fit | V3 |
| Expansión LATAM (multi-país) | Plataforma | Requiere fulfillment global (Gelato) | V3 |
| Analytics avanzado (PostHog) | Producto | Básico con Vercel Analytics V1, PostHog V1.5 | V1.5 |
| QA semi-automatizado (CLIP scoring) | Admin/AI | Curación manual suficiente para 1-2 libros | V2 |

---

*User Stories generados con Claude para Tipiti Books*
*Pendiente aprobación antes de avanzar al siguiente skill (Wireframes)*
