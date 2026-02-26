# Tipiti Books

Libros infantiles personalizados con ilustraciones acuarela pintadas a mano.
Hecho en Chile con amor.

---

## Que es este proyecto?

Tipiti Books es una tienda web donde padres, abuelos y tios pueden crear un libro personalizado para un nino o nina. El comprador elige un libro del catalogo, personaliza un personaje que se parece al nino (color de piel, pelo, lentes), escribe una dedicatoria, y recibe el libro impreso en casa.

Las ilustraciones son estilo acuarela premium (no son las tipicas ilustraciones "de IA" que se ven genericas). Se pre-generan todas las combinaciones posibles de personaje (~80 variantes por libro) y se curan manualmente antes de publicar. Cuando alguien compra, el sistema simplemente busca la variante correcta y le superpone el nombre.

**Para Sofi:** Este es tu proyecto. Tu puedes seguir construyendolo usando Claude Code siguiendo las instrucciones de abajo.

---

## Requisitos Previos

Antes de empezar, necesitas tener instalado:

| Herramienta | Version | Link de Descarga | Para que sirve |
|------------|---------|-------------------|----------------|
| **Node.js** | 20 o superior | https://nodejs.org/en/download | El motor que corre la app |
| **npm** | Viene con Node.js | (se instala con Node.js) | Instala las librerias del proyecto |
| **Git** | Ultima version | https://git-scm.com/downloads | Control de versiones del codigo |
| **Claude Code** | Ultima version | https://docs.anthropic.com/en/docs/claude-code | Tu asistente de programacion |

### Cuentas que necesitas crear (todas gratuitas para empezar):

| Servicio | URL | Para que sirve |
|----------|-----|----------------|
| **Supabase** | https://supabase.com | Base de datos + autenticacion + almacenamiento de imagenes |
| **Vercel** | https://vercel.com | Publicar la app en internet |
| **Resend** | https://resend.com | Enviar emails (confirmacion de compra, etc.) |
| **fal.ai** | https://fal.ai | Generar ilustraciones con IA (FLUX Kontext Pro) |
| **Inngest** | https://inngest.com | Procesar tareas en segundo plano (generacion batch) |
| **Flow.cl** | https://flow.cl | Recibir pagos (tarjeta, transferencia) |
| **MercadoPago** | https://mercadopago.cl | Pagos alternativos (opcional) |

---

## Como Empezar (Paso a Paso)

### 1. Clona el repositorio

Abre la Terminal (Mac) o Command Prompt (Windows) y escribe:

```bash
git clone <URL-del-repo>
cd tipiti-books
```

### 2. Instala las dependencias

```bash
npm install
```

Esto descarga todas las librerias que el proyecto necesita. Puede tardar unos minutos.

### 3. Configura las variables de entorno

```bash
cp .env.local.example .env.local
```

Esto crea un archivo `.env.local` donde vas a poner tus claves secretas. Abre el archivo y llena cada variable (ver tabla de Variables de Entorno mas abajo).

### 4. Levanta el proyecto

```bash
npm run dev
```

### 5. Abre el navegador

Ve a http://localhost:3000 y deberias ver la app corriendo.

---

## Estructura del Proyecto

```
tipiti-books/
|
|-- docs/                          # Documentacion del proyecto
|   |-- PDR-tipiti-books.md        # Vision del producto
|   |-- TECH-SPEC-tipiti-books.md  # Especificaciones tecnicas
|   |-- USER-STORIES-tipiti-books.md # Historias de usuario
|   |-- WIREFRAMES-tipiti-books.md # Disenos de pantallas
|   |-- STITCH-PROMPTS-tipiti-books.md # Design System + prompts UI
|   |-- BLUEPRINT-tipiti-books.md  # Plan maestro de ejecucion
|
|-- assets/                        # Guias de ilustracion e identidad
|
|-- src/                           # Codigo fuente de la app
|   |-- app/                       # Paginas y rutas
|   |   |-- (storefront)/          # Paginas publicas (landing, catalogo, wizard, checkout)
|   |   |-- admin/                 # Panel de administracion (solo Sofi)
|   |   |-- api/                   # Endpoints (webhooks, APIs)
|   |   |-- layout.tsx             # Layout principal
|   |   |-- globals.css            # Estilos globales
|   |
|   |-- components/                # Componentes reutilizables
|   |   |-- ui/                    # Componentes base (botones, inputs, cards)
|   |   |-- storefront/            # Componentes de la tienda
|   |   |-- admin/                 # Componentes del admin
|   |   |-- common/                # Componentes compartidos
|   |
|   |-- lib/                       # Logica de negocio y utilidades
|   |   |-- supabase/              # Conexion a la base de datos
|   |   |-- inngest/               # Jobs en segundo plano
|   |   |-- fal/                   # Generacion de imagenes con IA
|   |   |-- flow/                  # Pagos Flow.cl
|   |   |-- compose/               # Composicion de PDFs
|   |   |-- utils/                 # Funciones utilitarias
|   |
|   |-- stores/                    # Estado de la app (Zustand)
|   |-- emails/                    # Templates de email
|
|-- supabase/                      # Migraciones de base de datos
|-- plan.md                        # Comprension del proyecto
|-- tasks.md                       # Tracker de tareas por fase
|-- CLAUDE.md                      # Instrucciones para Claude Code
|-- package.json                   # Dependencias del proyecto
```

---

## La Documentacion

En la carpeta `docs/` hay 6 documentos que forman el plan completo del proyecto:

| Archivo | Que contiene |
|---------|-------------|
| `PDR-tipiti-books.md` | La vision del producto: que problema resuelve, como funciona el negocio, metricas de exito |
| `TECH-SPEC-tipiti-books.md` | Decisiones tecnicas: que tecnologias usar y por que, esquema de base de datos completo |
| `USER-STORIES-tipiti-books.md` | 56 historias de usuario: que debe poder hacer el comprador y que debe poder hacer Sofi |
| `WIREFRAMES-tipiti-books.md` | Disenos de 28 pantallas en formato texto (mobile + desktop) |
| `STITCH-PROMPTS-tipiti-books.md` | Design System completo (colores, tipografia, componentes) + prompts para generar UI |
| `BLUEPRINT-tipiti-books.md` | **EL DOCUMENTO PRINCIPAL.** Plan de ejecucion en 8 fases con todas las tareas |

Tambien hay archivos auxiliares:
- `tasks.md` — Tracker de tareas con checkboxes (para marcar progreso)
- `plan.md` — Resumen de la comprension del proyecto

---

## Como Usar Claude Code para Seguir Construyendo

### Abrir Claude Code

1. Abre la Terminal en la carpeta del proyecto
2. Escribe `claude` y presiona Enter
3. Claude Code se abre con todo el contexto del proyecto

### Ejemplos de Prompts para Sofi

**Para continuar con la siguiente tarea:**
```
Lee el tasks.md y continua con la siguiente tarea pendiente de la fase actual
```

**Para trabajar en una fase completa:**
```
Estoy en la Fase 3. Implementa la siguiente subfase
```

**Para validar si puedes avanzar de fase:**
```
Muestrame el checklist de aceptacion de la Fase actual y valida si pasamos
```

**Para arreglar un error:**
```
Hay un error en la pagina de checkout, el boton de pagar no funciona. Arreglalo
```

**Para agregar algo nuevo:**
```
Agrega un campo de telefono al formulario de checkout siguiendo el Design System
```

**Para entender algo:**
```
Explicame como funciona el sistema de variantes pre-generadas
```

### Como Retomar Trabajo Entre Sesiones

Cada vez que abras Claude Code en una nueva sesion:

1. Claude Code lee automaticamente el CLAUDE.md (las instrucciones del proyecto)
2. Dile: "Lee el tasks.md y dimme en que fase estamos y cual es la siguiente tarea"
3. Claude Code retomara desde donde quedaste

### Que Hacer Si Algo Se Rompe

1. **La app no corre (`npm run dev` falla):** Dile a Claude "npm run dev me da un error, arreglalo"
2. **Una pagina se ve sin estilos:** Dile "la pagina X se ve sin los estilos del Design System, arreglalo"
3. **La base de datos no conecta:** Verifica que las variables de Supabase esten correctas en `.env.local`
4. **Algo se perdio:** Git guarda todas las versiones. Dile a Claude "restaura el archivo X a la version anterior"

---

## Skills y MCPs Recomendados para Claude Code

Los MCPs (Model Context Protocols) son herramientas que le dan "superpoderes" a Claude Code:

| MCP | Para que sirve | Como activar |
|-----|---------------|-------------|
| **Supabase MCP** | Gestionar la base de datos directamente desde Claude | Ya configurado en `.mcp.json` |
| **Context7** | Tener documentacion actualizada de Next.js, Tailwind, etc. | Configurar en `.mcp.json` |
| **Playwright MCP** | Testing automatizado — Claude puede abrir el navegador y probar la app | `npm install -D @playwright/test` |

### Configuracion actual de MCPs

El archivo `.mcp.json` en la raiz del proyecto ya tiene la configuracion base. Cuando crees tu proyecto Supabase, actualiza el `project-ref` y el `access-token`.

---

## Variables de Entorno

Crea un archivo `.env.local` en la raiz del proyecto con estas variables:

| Variable | Servicio | Como obtenerla | Obligatoria |
|----------|----------|----------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Dashboard → Settings → API → Project URL | Si |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Dashboard → Settings → API → anon public | Si |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Dashboard → Settings → API → service_role (SECRETA, nunca exponer) | Si |
| `FAL_API_KEY` | fal.ai | Dashboard → Keys → Create Key | Si (para generar imagenes) |
| `INNGEST_EVENT_KEY` | Inngest | Dashboard → Manage → Signing Key | Si |
| `INNGEST_SIGNING_KEY` | Inngest | Dashboard → Manage → Signing Key | Si |
| `FLOW_API_KEY` | Flow.cl | Panel de comercio → Configuracion → API | Si (para pagos) |
| `FLOW_SECRET_KEY` | Flow.cl | Panel de comercio → Configuracion → API | Si (para pagos) |
| `FLOW_MERCHANT_ID` | Flow.cl | Panel de comercio → Tu ID de comercio | Si (para pagos) |
| `MERCADOPAGO_ACCESS_TOKEN` | MercadoPago | Dashboard → Credenciales → Access Token | Opcional |
| `RESEND_API_KEY` | Resend | Dashboard → API Keys → Create | Si |
| `RESEND_FROM_EMAIL` | Resend | Configurar dominio verificado | Si |
| `NEXT_PUBLIC_SITE_URL` | Tu dominio | El URL de tu sitio (ej: https://tipitibooks.com) | Si (prod) |

### Ejemplo de `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# fal.ai (Generacion de imagenes)
FAL_API_KEY=xxxxx

# Inngest (Jobs en segundo plano)
INNGEST_EVENT_KEY=xxxxx
INNGEST_SIGNING_KEY=signkey-xxxxx

# Flow.cl (Pagos)
FLOW_API_KEY=xxxxx
FLOW_SECRET_KEY=xxxxx
FLOW_MERCHANT_ID=xxxxx

# MercadoPago (Pagos alternativos)
MERCADOPAGO_ACCESS_TOKEN=xxxxx

# Resend (Emails)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=hola@tipitibooks.com

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Comandos Utiles

| Comando | Que hace |
|---------|----------|
| `npm run dev` | Levanta la app en modo desarrollo (http://localhost:3000) |
| `npm run build` | Construye la version de produccion (para verificar que todo compila) |
| `npm run lint` | Verifica errores de codigo |
| `npm run start` | Corre la version de produccion localmente |
| `npx supabase db push` | Aplica cambios de base de datos (migraciones) |
| `npx inngest-cli dev` | Levanta el servidor local de Inngest (para jobs en segundo plano) |
| `npx playwright test` | Corre los tests automatizados |

---

## FAQ / Troubleshooting

### "npm install falla"

1. Verifica que tienes Node.js 20+: `node --version`
2. Borra la carpeta `node_modules` y el archivo `package-lock.json`: `rm -rf node_modules package-lock.json`
3. Vuelve a instalar: `npm install`

### "No puedo conectar a Supabase"

1. Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estan correctos en `.env.local`
2. Verifica que tu proyecto Supabase esta activo (no pausado) en el dashboard
3. Si acabas de crear el proyecto, espera 2-3 minutos

### "La pagina se ve sin estilos"

1. Detiene el servidor (Ctrl+C) y vuelve a levantar: `npm run dev`
2. Si persiste, borra la cache: `rm -rf .next && npm run dev`

### "Como hago deploy a produccion"

1. Crea una cuenta en https://vercel.com
2. Conecta tu repositorio de GitHub
3. En Vercel, ve a Settings → Environment Variables y agrega TODAS las variables de `.env.local`
4. Vercel hace deploy automatico cada vez que hagas push a `main`

### "El pago no funciona"

1. Verifica que estas en modo sandbox de Flow.cl (para pruebas)
2. Verifica FLOW_API_KEY, FLOW_SECRET_KEY y FLOW_MERCHANT_ID
3. En produccion, cambia a las credenciales de produccion de Flow.cl

### "Los emails no llegan"

1. Verifica RESEND_API_KEY en `.env.local`
2. Verifica que el dominio remitente esta verificado en Resend
3. Revisa la carpeta de spam

---

## Glosario para Sofi

Terminos tecnicos explicados en simple:

| Termino | Que significa |
|---------|-------------|
| **Server Component** | Una pagina que se genera en el servidor, mas rapida porque el navegador recibe el HTML listo |
| **Client Component** | Una pagina que se genera en el navegador del usuario, necesaria para interactividad (clicks, formularios) |
| **API Key** | Una contrasena que le das a tu app para que pueda hablar con un servicio externo (como Supabase o Flow.cl) |
| **Environment Variable** | Una configuracion secreta que se guarda en `.env.local` y no se sube a GitHub |
| **Migration** | Un archivo SQL que crea o modifica tablas en la base de datos |
| **RLS (Row Level Security)** | Reglas que controlan quien puede ver que datos en la base de datos |
| **Webhook** | Cuando un servicio externo (como Flow.cl) le avisa a tu app que algo paso (ej: "el pago fue exitoso") |
| **Server Action** | Una funcion que corre en el servidor cuando el usuario hace algo (ej: enviar un formulario) |
| **Middleware** | Codigo que se ejecuta ANTES de mostrar una pagina (ej: verificar si el usuario esta logueado) |
| **JWT (JSON Web Token)** | Un "pase" digital que prueba que Sofi esta logueada, se guarda en una cookie |
| **Cookie httpOnly** | Una cookie segura que el navegador guarda pero que JavaScript no puede leer (mas seguro) |
| **Zustand** | Una libreria para guardar datos temporales en el navegador (ej: las selecciones del wizard) |
| **Inngest** | Un servicio que ejecuta tareas pesadas en segundo plano (ej: generar 880 imagenes) |
| **Batch Job** | Una tarea que procesa muchos items de una vez (ej: generar todas las variantes de un libro) |
| **Seed** | Un numero que hace que la IA genere siempre la misma imagen (determinismo) |
| **Deploy** | Publicar la app en internet para que cualquiera pueda acceder |
| **Build** | Compilar el codigo en una version optimizada para produccion |
| **Lint** | Verificar que el codigo cumple con las reglas de calidad |
| **Responsive** | Que la pagina se ve bien tanto en celular como en computador |
| **SSR (Server-Side Rendering)** | Generar las paginas en el servidor para que carguen mas rapido |
| **CTA (Call To Action)** | Un boton que invita al usuario a hacer algo (ej: "Crea tu libro") |
| **HMAC** | Una firma digital que verifica que un webhook realmente viene de Flow.cl y no de un impostor |
| **PDF Composition** | El proceso de combinar las ilustraciones + el nombre del nino + la dedicatoria en un PDF listo para imprimir |

---

## Stack Tecnico

- **Next.js 16** — Framework web (paginas, rutas, server-side rendering, Turbopack)
- **TypeScript** — JavaScript con tipos (menos errores)
- **Tailwind CSS 4** — Estilos (colores, tamanios, responsive)
- **shadcn/ui** — Componentes base (botones, inputs, cards)
- **Supabase** — Base de datos + autenticacion + almacenamiento
- **Zustand** — Estado del wizard configurador
- **Framer Motion** — Animaciones suaves
- **Zod** — Validacion de formularios
- **Inngest** — Tareas en segundo plano (generacion batch)
- **Flow.cl** — Pagos (tarjeta, transferencia)
- **MercadoPago** — Pagos alternativos
- **Resend** — Emails transaccionales
- **Sharp + pdf-lib** — Composicion del PDF para impresion
- **fal.ai** — API para generar ilustraciones con FLUX Kontext Pro
- **Vercel** — Hosting (publicar la app en internet)

---

*Tipiti Books -- Hecho con amor en Chile*
