# Dress Shopy — Front-end

Interfaz web de **Dress Shopy**, una tienda de ropa online. Construida con **React 19** y **Vite**, consume la [API en Django/DRF](https://github.com/Yaniel-2003/Api_dress) para mostrar el catálogo, gestionar login/registro, el carrito de compras y administrar artículos, variantes, descuentos y direcciones.

---

## Tabla de contenido

- [Stack técnico](#stack-técnico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y puesta en marcha (Ubuntu)](#instalación-y-puesta-en-marcha-ubuntu)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Rutas de la aplicación](#rutas-de-la-aplicación)
- [Capa de servicios (API)](#capa-de-servicios-api)
- [Autenticación y estado global](#autenticación-y-estado-global)
- [Solución de problemas en Linux](#solución-de-problemas-en-linux)
- [Notas y puntos a mejorar](#notas-y-puntos-a-mejorar)

---

## Stack técnico

| Componente | Tecnología |
|---|---|
| Librería UI | React 19 |
| Bundler / dev server | Vite 8 |
| Ruteo | React Router DOM 7 |
| Estilos | Tailwind CSS 4 (vía `@tailwindcss/vite`) + `tw-animate-css` |
| Componentes base | shadcn/ui (Radix UI, `class-variance-authority`, `lucide-react`) |
| Linting | ESLint 10 (+ `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) |
| Gestor de paquetes | **pnpm** (hay `pnpm-lock.yaml`) |

Dependencias completas en [`package.json`](./package.json). Las convenciones visuales están en [`design-system.md`](./design-system.md).

## Estructura del proyecto

```
Frontend-Dress/
├── index.html
├── vite.config.js          # plugins: react, tailwindcss; alias "@" -> src/
├── eslint.config.js
├── components.json         # configuración de shadcn/ui
├── design-system.md        # tokens y reglas de diseño
├── package.json / pnpm-lock.yaml
├── public/                 # favicons e iconos estáticos
└── src/
    ├── main.jsx            # punto de entrada, monta <App />
    ├── App.jsx             # providers (Auth, Carrito) + router
    ├── App.css / index.css # index.css define los tokens de Tailwind/shadcn
    ├── router/
    │   └── index.jsx       # todas las rutas + componente de ruta protegida
    ├── auth/               # páginas y servicios de autenticación
    │   ├── login.jsx
    │   ├── registro.jsx
    │   ├── perfil.jsx
    │   ├── Logout.jsx
    │   └── services/       # Login / Registro / Logout .service.js
    ├── context/
    │   ├── AuthContext.jsx     # usuario y tokens en sesión
    │   └── CarritoContext.jsx  # cantidad de ítems y contenido del carrito
    ├── pages/
    │   ├── home/
    │   │   ├── home.jsx             # vitrina de productos con filtros
    │   │   └── detallesArticulo.jsx # detalle de una variante + agregar al carrito
    │   ├── articulos/articulos.jsx  # administración de artículos, variantes y descuentos
    │   └── carrito/
    │       ├── carrito.jsx          # página completa del carrito
    │       └── miCarrito.jsx        # vista previa del carrito (panel lateral)
    ├── components/         # NavBar, Footer, Icons, Logo, modales y campos reutilizables
    │   └── ui/             # componentes shadcn (button, badge, card, input, select, sheet...)
    ├── services/           # cliente HTTP y llamadas a la API
    │   ├── api.js                 # wrapper de fetch centralizado
    │   ├── articulo.service.js    # CRUD de artículos, variantes y descuentos
    │   ├── carrito.service.js     # carrito de compras
    │   ├── catalogo.service.js    # género, marca, color, talla, impuesto, cupón, categoría, prendas
    │   ├── direcciones.service.js
    │   └── home.services.js       # endpoint de vitrina pública
    ├── lib/utils.js        # helper `cn` (clsx + tailwind-merge)
    └── assets/
```

## Requisitos previos

- **Ubuntu** (probado sobre WSL2) con `git` y `curl`.
- **Node.js 20+** (probado con Node 24 instalado vía `nvm`).
- **pnpm**.
- La [API](https://github.com/Yaniel-2003/Api_dress) corriendo y accesible (por defecto en `http://127.0.0.1:8000`).

## Instalación y puesta en marcha (Ubuntu)

```bash
# 1. Node con nvm (si aún no lo tienes) y pnpm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc
nvm install --lts
npm install -g pnpm

# 2. Clonar e instalar dependencias
git clone git@github.com:Yaniel-2003/Frontend-Dress.git
cd Frontend-Dress
pnpm install

# 3. Crear el archivo .env (ver variables de entorno abajo)

# 4. Levantar el servidor de desarrollo
pnpm dev
```

Por defecto Vite sirve la app en `http://localhost:5173` (el mismo puerto que la API tiene habilitado en `CORS_ALLOWED_ORIGINS`).

> Usa siempre **pnpm** en este proyecto. Mezclarlo con `npm install` puede dejar un `node_modules` corrupto y generar un `package-lock.json` que no corresponde.

## Variables de entorno

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API (incluyendo `/api`) | `http://127.0.0.1:8000/api` |

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Vite solo lee `.env` al arrancar: si lo cambias, reinicia `pnpm dev`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Levanta el servidor de desarrollo con HMR |
| `pnpm build` | Genera el build de producción en `dist/` |
| `pnpm preview` | Sirve localmente el build de producción |
| `pnpm lint` | Corre ESLint sobre todo el proyecto (hoy termina sin errores) |

## Rutas de la aplicación

Definidas en `src/router/index.jsx`. Todas las rutas salvo `/login` y `/registro` pasan por `ProtecttedRoute`, que redirige a `/login` si no hay `access_token` en `localStorage`.

| Ruta | Componente | Protegida | Descripción |
|---|---|---|---|
| `/` | — | No | Redirige a `/login` |
| `/login` | `Login` | No | Inicio de sesión |
| `/registro` | `Registro` | No | Registro de nuevo usuario |
| `/home` | `Home` | Sí | Vitrina de productos con filtros |
| `/detalles-articulos/:id` | `DetallesArticulos` | Sí | Detalle de una variante y botón de agregar al carrito |
| `/carrito` | `Carrito` | Sí | Carrito completo: cantidades, eliminar ítems, totales y descuentos |
| `/perfil` | `Perfil` | Sí | Datos del usuario y sus direcciones |
| `/articulos` | `Articulos` | Sí | CRUD de artículos, variantes por talla/color y descuentos |

> Las rutas distinguen mayúsculas: la ruta de login es `/login` (minúscula).

## Capa de servicios (API)

Toda petición pasa por `src/services/api.js`, un wrapper sobre `fetch` que:

- Antepone `VITE_API_URL` a cada `endpoint`.
- Agrega `Content-Type: application/json` automáticamente, salvo cuando el `body` es un `FormData` (subida de archivos), donde deja que el navegador ponga el `boundary` correcto.
- Adjunta `Authorization: Bearer <token>` leyendo `access_token` de `localStorage`, excepto en `/login/` y `/registro/`.
- Lanza un `Error` cuando la respuesta no es `ok`, y devuelve `null` en respuestas `204`.

Sobre ese wrapper se construyen los servicios por dominio. `carrito.service.js` expone `obtenerCarrito` (`GET /carritos-compras/`), `agregarCarrito` (`POST /agregar_item_carrito/{id}/`), `actualizarParcial` (`PATCH /carritos-compras/{id}/`) y `eliminarItemCarrito` (`DELETE /carritos-compras/{id}/`).

## Autenticación y estado global

`App.jsx` envuelve la app en dos providers:

- **`AuthProvider`** (`context/AuthContext.jsx`): guarda en `localStorage` `access_token`, `refresh_token` y `usuario` al hacer login, y los borra al cerrar sesión. Expone `usuario`, `login` y `logout` mediante `useAuth()`.
- **`CarritoProvider`** (`context/CarritoContext.jsx`): cuando hay un usuario con sesión, consulta el carrito y expone `cantidad` (total de unidades, para el contador del `NavBar`), `miCarrito` (los ítems) y `cantidadCar()` para refrescarlo tras agregar, cambiar o quitar ítems. Se usa con `useCarrito()`.

El registro (`auth/registro.jsx`) llama a `POST /usuario/`, que es público en la API; el cierre de sesión (`Logout.service.js`) envía el `refresh_token` a `POST /logout/`.

## Solución de problemas en Linux

Linux distingue mayúsculas de minúsculas y Windows no; varios errores del cambio de sistema salieron de ahí:

| Error | Causa | Solución |
|---|---|---|
| `Failed to resolve import "./Router" from "src/App.jsx"` | La carpeta es `src/router/` (minúscula) pero el import decía `./Router` | Importar `./router` (ya corregido) |
| `Can't resolve 'tw-animate-css'` o `Failed to resolve import "lucide-react"` | Dependencia declarada en `package.json` pero no instalada, o servidor de desarrollo iniciado antes de reinstalar `node_modules` | `pnpm install` y reiniciar `pnpm dev` |
| `npm error Cannot read properties of null (reading 'matches')` | `node_modules` corrupto o instalado con otro gestor | `rm -rf node_modules` y luego `pnpm install` (no usar `npm install`) |

## Notas y puntos a mejorar

- **Nombre con typo**: el componente de ruta protegida se llama `ProtecttedRoute` (doble `t`). Funciona, pero conviene renombrarlo.
- **Solo comprueba que exista un token**: `ProtecttedRoute` no valida que el token esté vigente; si expiró, será la API (401) la que lo rechace.
- **Enlace de recuperación de contraseña sin pantalla**: la API envía un correo con un enlace a `/reset-password?uid=...&token=...`, pero el front todavía no tiene esa ruta.
- **Props sin uso**: `SelectFiltro` (en `articulos.jsx`) ya no usa la prop `icon`, aunque algunos llamados todavía se la pasan.
- No hay tests configurados en `package.json` (no hay Vitest/Jest ni script de `test`).
