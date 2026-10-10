# Dress Shopy · Design System

Estilo: moderno, limpio, profesional (Linear / Stripe Dashboard). Fondo claro, mucho aire,
bordes redondeados, sombras suaves, **sin gradientes**. Stack: Tailwind v4 + shadcn/ui (JSX).

Los tokens viven en `src/index.css` (`:root`). Los componentes base en `src/components/ui/`.
Regla de oro: **no escribas colores sueltos** (`bg-green-600`, `#123456`). Usa los tokens.

## 1. Colores

| Token (Tailwind)          | Valor     | Uso                                           |
| ------------------------- | --------- | --------------------------------------------- |
| `bg-background`           | `#FAFAFA` | Fondo de todas las páginas                    |
| `bg-card`                 | `#FFFFFF` | Cards, inputs, drawers, modales               |
| `text-foreground`         | `#09090B` | Texto principal y títulos                     |
| `text-muted-foreground`   | `#71717A` | Texto secundario, labels de ayuda, placeholders |
| `bg-primary`              | `#09090B` | Botón principal (negro)                       |
| `text-primary-foreground` | `#FAFAFA` | Texto sobre botón negro                       |
| `bg-secondary` / `bg-muted` | `#F4F4F5` | Botón secundario, chips, zonas sutiles      |
| `border-border`           | `#E4E4E7` | Todos los bordes y divisores                  |
| `ring-ring`               | `#A1A1AA` | Anillo de foco                                |
| `text-destructive`        | `#DC2626` | Errores, eliminar                             |
| `text-success`            | `#16A34A` | Confirmaciones, descuentos                    |

**Identidad de marca (se mantiene la original):** negro + blanco como base, **esmeralda** y **azul** como acentos.

| Uso                                   | Clases                                              |
| ------------------------------------- | --------------------------------------------------- |
| Acento principal (links, hover botón) | `text-emerald-700`, `hover:bg-emerald-700`          |
| Anillo de foco                        | `ring-ring` (= esmeralda `#10B981`)                 |
| Fondos decorativos (halos)            | `bg-emerald-400/20` + `bg-blue-400/20` con `blur-3xl` |
| Paneles de marca oscuros              | `bg-zinc-950` con halos `emerald-500/35` y `blue-600/35` |

Los halos de color son fondo decorativo; el texto y los controles siguen siendo negro/blanco.
Rojo solo para errores.

## 2. Tipografía

Fuente: **Inter** (400, 500, 600, 700), cargada en `index.html`.

| Rol              | Clases                                                   |
| ---------------- | -------------------------------------------------------- |
| Título de página | `text-2xl font-semibold tracking-tight`                  |
| Título de card   | `text-lg font-semibold tracking-tight`                   |
| Texto            | `text-sm` (14px)                                         |
| Texto secundario | `text-sm text-muted-foreground`                          |
| Label            | `text-sm font-medium` (shadcn `<Label>`)                 |
| Precio / total   | `text-3xl font-semibold tracking-tight tabular-nums`     |

## 3. Forma, sombra y espacio

- **Radio:** `rounded-xl` (12px) en cards, inputs, botones. `rounded-full` solo en badges y avatares.
- **Sombras:** `shadow-sm` por defecto en cards. `shadow-md` solo al hover o en elementos flotantes
  (drawer, dropdown). Nunca `shadow-2xl`.
- **Bordes:** siempre `border` (1px, `border-border`). Card = borde + `shadow-sm`.
- **Espaciado:** escala de 4px. Padding de card `p-6`; separación entre campos `gap-5`;
  entre secciones `gap-8`. Contenedor de página `max-w-6xl mx-auto px-4 sm:px-6`.
- **Sin gradientes**, sin `hover:scale-*`, sin sombras de color.

## 4. Botones — `@/components/ui/button`

```jsx
<Button>Guardar</Button>                       // principal: negro
<Button variant="secondary">Cancelar</Button>  // gris claro
<Button variant="outline">Filtros</Button>     // borde, fondo blanco
<Button variant="ghost">Volver</Button>        // sin fondo
<Button variant="link">¿Olvidaste…?</Button>   // texto subrayado al hover
<Button variant="destructive">Eliminar</Button>
<Button size="lg" className="w-full">Iniciar sesión</Button>  // formularios: lg + ancho completo
```

Altura: `default` 40px, `lg` 44px (formularios/CTA), `sm` 32px (tablas, acciones inline).
Un solo botón principal (negro) por vista.

## 5. Inputs — `@/components/ui/input`, `label`, `select`, `textarea`

Siempre **label arriba**, input grande (44px), fondo blanco, `rounded-xl`, foco con anillo gris.

```jsx
<div className="grid gap-2">
  <Label htmlFor="email">Correo</Label>
  <Input id="email" type="email" placeholder="correo@ejemplo.com" />
</div>
```

- Texto de ayuda: `<p className="text-xs text-muted-foreground">…</p>` debajo del input.
- Error: `aria-invalid` en el input + `<p className="text-xs text-destructive">…</p>`.
- Campo con icono a la derecha (ver contraseña): input con `pr-11` y botón `absolute right-1 top-1/2 -translate-y-1/2`
  como `Button variant="ghost" size="icon-sm"`.

## 6. Cards — `@/components/ui/card`

```jsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción corta</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>
```

Card de formulario (login/registro): `max-w-md`, centrada vertical y horizontalmente sobre `bg-background`.
Card de producto: imagen `aspect-[4/5] object-cover rounded-t-xl`, nombre `text-sm font-medium`,
precio `text-sm font-semibold`, descuento en `Badge`.

## 7. Otros componentes

- **Badge** (`ui/badge`): descuentos, estados. Variantes `default` (negro), `secondary`, `outline`.
- **Separator** (`ui/separator`): divisores dentro de cards.
- **Sheet** (`ui/sheet`): drawer del carrito (lado derecho).
- **Iconos:** `src/components/Icons.jsx` (trazo 2, `w-4 h-4` en botones/labels, `w-5 h-5` solo en títulos).

## 8. Layouts por vista

| Vista      | Layout                                                                          |
| ---------- | ------------------------------------------------------------------------------- |
| Login / Registro | Centrado, card blanca `max-w-md`, inputs grandes, botón negro, link sutil abajo |
| Home       | Hero minimal (texto + buscador), grid de productos 1/2/3/4 columnas             |
| Artículos  | Formulario en 2 columnas + preview sticky al lado                               |
| Perfil     | Sidebar a la izquierda (`w-64`), contenido a la derecha                         |
| Carrito    | Lista limpia + resumen con total grande, `sticky top-6`                         |

## 9. Checklist antes de dar una vista por terminada

- [ ] Sin colores sueltos ni gradientes
- [ ] Todos los campos usan `Label` + `Input`/`Select`/`Textarea`
- [ ] Un solo botón negro principal
- [ ] `rounded-xl` y `shadow-sm` consistentes
- [ ] Se ve bien a 375px de ancho
