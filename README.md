# Dress Shopy — Front-end

Interfaz web de **Dress Shopy**, una tienda de ropa online. Construida con **React 19** y **Vite**, consume la [API en Django/DRF](../api) del mismo proyecto para mostrar el catálogo público, gestionar el login/registro y administrar artículos, variantes, descuentos y direcciones.

---

## Tabla de contenido

- [Stack técnico](#stack-técnico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Capa de servicios (API)](#capa-de-servicios-api)
- [Autenticación](#autenticación)
- [Notas y puntos a mejorar](#notas-y-puntos-a-mejorar)

---

## Stack técnico

| Componente | Tecnología |
|---|---|
| Librería UI | React 19 |
| Bundler / dev server | Vite 8 |
| Ruteo | React Router DOM 7 |
| Estilos | Tailwind CSS 4 (vía `@tailwindcss/vite`) |
| Linting | ESLint 10 (+ `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) |
| Gestor de paquetes | pnpm (hay `pnpm-lock.yaml`) |

Dependencias completas en [`package.json`](./package.json).

## Estructura del proyecto

```
front-end/
├── index.html
├── vite.config.js          # plugins: react, tailwindcss
├── package.json
├── public/                 # favicons e iconos estáticos
└── src/
    ├── main.jsx             # punto de entrada, monta <App />
    ├── App.jsx              # monta el router de la app
    ├── App.css / index.css
    ├── router/
    │   └── index.jsx        # todas las rutas + componente de ruta protegida
    ├── auth/                 # páginas y servicios de autenticación
    │   ├── login.jsx
    │   ├── registro.jsx
    │   ├── perfil.jsx
    │   ├── Logout.jsx
    │   └── services/
    │       ├── Login.service.js
    │       ├── Registro.service.js
    │       └── Logout.service.js
    ├── pages/
    │   ├── home/home.jsx      # vitrina pública de productos
    │   └── articulos/articulos.jsx   # administración de artículos, variantes y descuentos
    ├── components/            # componentes reutilizables (NavBar, Footer, Icons, modales)
    ├── context/                # (reservado para React Context; vacío por ahora)
    ├── services/                # cliente HTTP y llamadas a la API
    │   ├── api.js               # wrapper de fetch centralizado
    │   ├── articulo.service.js   # CRUD de artículos, variantes y descuentos
    │   ├── catalogo.service.js   # género, marca, color, talla, impuesto, cupón, categoría, prendas
    │   ├── direcciones.service.js
    │   └── home.services.js      # endpoint de vitrina pública
    └── assets/
```

## Requisitos previos

- **Node.js 20+** (probado con 22).
- **pnpm** instalado (`npm install -g pnpm`), o adaptar los comandos a `npm`/`yarn` si se prefiere.
- La [API](../api) corriendo y accesible (por defecto en `http://127.0.0.1:8000`).

## Instalación y puesta en marcha

```bash
# 1. Entrar a la carpeta del front-end
cd front-end

# 2. Instalar dependencias
pnpm install

# 3. Crear el archivo .env (ver variables de entorno abajo)

# 4. Levantar el servidor de desarrollo
pnpm dev
```

Por defecto Vite sirve la app en `http://localhost:5173` (el mismo puerto que la API tiene habilitado en `CORS_ALLOWED_ORIGINS`).

## Variables de entorno

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API (incluyendo `/api`) | `http://127.0.0.1:8000/api` |

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Levanta el servidor de desarrollo con HMR |
| `pnpm build` | Genera el build de producción en `dist/` |
| `pnpm preview` | Sirve localmente el build de producción |
| `pnpm lint` | Corre ESLint sobre todo el proyecto |

## Rutas de la aplicación

Definidas en `src/router/index.jsx`:

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | — | Redirige a `/Login` |
| `/Login` | `Login` | Inicio de sesión |
| `/registro` | `Registro` | Registro de nuevo usuario |
| `/home` | `Home` | Vitrina pública de productos (consume `/tienda-publica/`) |
| `/perfil` | `Perfil` | Datos del usuario autenticado |
| `/articulos` | `Articulos` | CRUD de artículos, variantes por talla/color y descuentos |

## Capa de servicios (API)

Toda petición pasa por `src/services/api.js`, un wrapper sobre `fetch` que:

- Antepone `VITE_API_URL` a cada `endpoint`.
- Agrega `Content-Type: application/json` automáticamente, salvo cuando el `body` es un `FormData` (subida de archivos), donde deja que el navegador ponga el `boundary` correcto.
- Adjunta `Authorization: Bearer <token>` leyendo `access_token` de `localStorage`, excepto en `/login/` y `/registro/`.
- Lanza un `Error` cuando la respuesta no es `ok`, y devuelve `null` en respuestas `204`.

Sobre ese wrapper se construyen los servicios por dominio: `articulo.service.js` (artículos, variantes, descuentos), `catalogo.service.js` (catálogos de apoyo: marca, color, talla, impuesto, cupón, categoría, prendas, género), `direcciones.service.js` y `home.services.js` (vitrina pública).

## Autenticación

- El login (`auth/login.jsx`) llama a `Login.service.js`, que pega contra `POST /login/` de la API.
- Al autenticar correctamente se guardan en `localStorage`: `access_token`, `refresh_token` y `usuario` (JSON serializado).
- El cierre de sesión (`Logout.service.js`) envía el `refresh_token` a `POST /logout/`.
- El registro (`auth/registro.jsx` + `Registro.service.js`) llama a `POST /usuario/`, que es público en la API.

## Notas y puntos a mejorar

Cosas detectadas al revisar el código, útiles para el siguiente que trabaje en el proyecto:

- **Las rutas privadas no están protegidas realmente**: `router/index.jsx` define un componente `ProtecttedRoute` (nótese también el nombre con typo) que valida si hay token en `localStorage`, pero **ninguna `<Route>` lo está usando** actualmente. Hoy `/home`, `/perfil` y `/articulos` son accesibles sin iniciar sesión desde el navegador (la API sí sigue exigiendo el JWT en sus endpoints).
- **Inconsistencia en el nombre de la llave del token**: `login.jsx` guarda el token como `access_token` (guion bajo) y lo mismo hace `services/api.js` al leerlo, pero `ProtecttedRoute` en `router/index.jsx` busca `access-token` (guion medio). Mientras no se unifique el nombre, ese componente de ruta protegida **nunca encontrará el token**, incluso con sesión iniciada.
- **Import con mayúscula distinta al archivo real**: `App.jsx` importa `./Router`, pero el archivo es `src/router/index.jsx` (carpeta en minúscula). Funciona en Windows por ser un sistema de archivos insensible a mayúsculas, pero **puede fallar en Linux/macOS o en un pipeline de CI**, que sí distinguen mayúsculas de minúsculas.
- **`context/` está vacío**: la carpeta existe pero no tiene ningún Context de React todavía; el estado de sesión/usuario hoy se maneja leyendo `localStorage` directamente desde cada componente que lo necesita.
- No hay tests configurados en `package.json` (no hay Vitest/Jest ni scripts de `test`).
