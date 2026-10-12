# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Clientes (compradores):** público de una boutique de moda de gama media-alta. Llegan a descubrir prendas, revisar una variante concreta (talla, color, precio, descuento), armar un carrito y completar una orden de compra.
- **Personal de la tienda (admin):** gestiona el catálogo — artículos, variantes por talla/color, descuentos — y los datos de catálogo de apoyo (género, marca, color, talla, impuesto, cupón, categoría).

## Product Purpose

Dress Shopy es la tienda online real de un negocio de ropa. El front-end (React) consume una API propia en Django/DRF para mostrar el catálogo, autenticar clientes, gestionar carrito, direcciones y órdenes, y permitir al personal administrar el inventario. El éxito es que un cliente encuentre una prenda que le guste, entienda su precio y disponibilidad sin dudas, y cierre la compra.

## Positioning

Boutique de gama media-alta: selección curada, menor volumen, énfasis en la calidad y en la presentación de cada prenda, no en el catálogo masivo ni en el descuento agresivo. Las ofertas existen, pero son un complemento, no el gancho principal.

## Operating Context

- Flujo de cliente: vitrina (`/home`, con búsqueda, filtros, sección de ofertas y catálogo) → detalle de variante (`/detalles-articulos/:id`) → carrito (panel lateral `miCarrito` y página `/carrito`) → orden (`/orden`). Perfil con direcciones en `/perfil`.
- Cuenta: registro, login, recuperación de contraseña por correo (`/olvideContraseña` → enlace a `/reset-password?uid=…&token=…`).
- Flujo de admin: CRUD de artículos, variantes y descuentos en `/articulos`.
- Idioma de la interfaz y del código: español.

## Capabilities and Constraints

- Stack existente: React 19, Vite 8, React Router 7, Tailwind CSS 4, shadcn/ui (Radix, lucide-react), pnpm. API en `VITE_API_URL` con JWT (`access_token`/`refresh_token` en `localStorage`).
- Imágenes de producto provienen de la API (subida vía `FormData`).
- **Decisión confirmada, aún no implementada:** separar roles cliente y admin. Solo el personal debe ver y usar la administración de artículos; hoy cualquier usuario con sesión accede a `/articulos`. El catálogo debe ser visible **sin login**; hoy todas las rutas salvo login/registro/recuperación exigen sesión. Requiere soporte de roles en la API.
- Precios se muestran como `$` + `toLocaleString()`; moneda y país de operación **sin confirmar**.
- `index.html` declara `lang="es"` (corregido el 2026-10-11).
- Sin tests configurados.

## Brand Commitments

- Nombre: **Dress Shopy** (logo en `src/components/Logo.jsx`, favicons en `public/`).
- Voz: español, trato de "tú".

## Evidence on Hand

- Productos, precios, variantes y descuentos reales vienen de la API; no hay contenido estático de producto en el repo.
- No hay testimonios, reseñas, prensa, cifras de clientes ni políticas (envíos, devoluciones) registradas en el proyecto. No inventarlas; pedirlas al negocio si una superficie las necesita.

## Product Principles

1. **La prenda es la protagonista.** Cada decisión debe favorecer ver bien el producto y entender talla, color y precio con certeza.
2. **Curaduría sobre volumen.** Presentar menos, mejor; evitar la estética de saldo o de marketplace masivo.
3. **Compra sin fricción, sin sorpresas.** Precio final, descuento, impuesto y total claros en cada paso hasta la orden.
4. **Dos públicos, dos espacios.** La experiencia de compra y la de administración se separan; el cliente nunca ve herramientas internas.
5. **Confianza con lo real.** Solo datos y afirmaciones que el negocio pueda respaldar.
