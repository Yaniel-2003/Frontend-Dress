---
name: Dress Shopy
description: Boutique de moda de gama media-alta; una vitrina blanca, iluminada, con la luz esmeralda y azul de la marca en lo que actúa.
colors:
  lienzo: "#fafafa"
  superficie: "#ffffff"
  tinta: "#0b0b0c"
  esmeralda: "#34d399"
  azul: "#60a5fa"
  emerald-texto: "#047857"
  emerald-foco: "#059669"
  sky-info: "#0369a1"
  sky-tint: "#38bdf8"
  ring: "#10b981"
  background: "#fafafa"
  foreground: "#09090b"
  card: "#ffffff"
  muted: "#f4f4f5"
  muted-foreground: "#71717a"
  border: "#e4e4e7"
  destructive: "#dc2626"
typography:
  display:
    fontFamily: "Gilda Display, ui-serif, Georgia, serif"
    fontSize: "clamp(3rem, 7.5vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  display-panel:
    fontFamily: "Gilda Display, ui-serif, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline-page:
    fontFamily: "Gilda Display, ui-serif, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Gilda Display, ui-serif, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.25
  title-serif:
    fontFamily: "Gilda Display, ui-serif, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.33
  title-panel:
    fontFamily: "Gilda Display, ui-serif, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
  title-page:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title-form:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.025em"
  title-product:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  body-lede:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  micro:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  price:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    fontFeature: "tnum"
  price-total:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    letterSpacing: "-0.025em"
    fontFeature: "tnum"
  price-receipt:
    fontFamily: "Gilda Display, ui-serif, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tnum"
rounded:
  sm: "8px"
  md: "10px"
  xl: "12px"
  card-inner: "15px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter: "32px"
  field-gap: "20px"
  card-grid-x: "24px"
  card-grid-y: "40px"
  panel: "24px"
  receipt-row: "24px"
  section: "80px"
components:
  button-identidad:
    backgroundColor: "{colors.esmeralda}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "0 24px"
    height: "48px"
  button-tinta:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.lienzo}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "48px"
  button-outline:
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    height: "48px"
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.xl}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.emerald-texto}"
  search-capsule:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.2xl}"
    padding: "6px 6px 6px 16px"
    height: "60px"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "8px 14px"
    height: "44px"
  input-tienda:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "8px 14px 8px 40px"
    height: "44px"
  vitrina-card:
    backgroundColor: "{colors.superficie}"
    rounded: "{rounded.2xl}"
  panel:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  chip-filtro:
    textColor: "{colors.tinta}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "44px"
  tag-oferta:
    backgroundColor: "{colors.esmeralda}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  tag-info:
    textColor: "{colors.sky-info}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-count:
    backgroundColor: "{colors.esmeralda}"
    textColor: "{colors.tinta}"
    typography: "{typography.micro}"
    rounded: "{rounded.full}"
    padding: "0 6px"
    height: "20px"
  floating-cart:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.superficie}"
    rounded: "{rounded.full}"
    size: "56px"
  nav-bar:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    height: "64px"
  sheet-carrito:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    width: "448px"
  receipt-row:
    textColor: "{colors.tinta}"
    padding: "24px 0"
  modal:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.2xl}"
    padding: "32px"
---

# Design System: Dress Shopy

## Overview

**Creative North Star: "La vitrina iluminada"**

The storefront is the boutique's shop window in daylight: a soft white ground (lienzo), pure white boxes for garments and panels (superficie), near-black ink for type (tinta), and the shop's identity light, emerald running into blue, on everything that acts or is selected. Gilda Display carries headlines; Inter carries every control, price and label. Real store photographs head the pages, washed into white by a bottom veil so dark serif headlines sit on them; they are never a SaaS collage.

The light world ships on every view after login: the storefront home (`src/pages/home/home.jsx`) with its filter modal, item detail (`src/pages/home/detallesArticulo.jsx`), the cart sheet opened from the floating cart (`src/pages/carrito/miCarrito.jsx`), the cart page (`src/pages/carrito/carrito.jsx`), the order receipt (`src/pages/orden/orden.jsx`), the profile (`src/auth/perfil.jsx`), Artículos (`src/pages/articulos/articulos.jsx`), and the shared chrome (`NavBar.jsx`, `Footer.jsx`, `compra/PiezasCompra.jsx`). The user chose it because a store should not tire the eyes of its buyers. The pre-login auth pages (`login.jsx`, `registro.jsx`, `forgotPass.jsx`, `resetPass.jsx`) keep their daylight form beside `AuthLayout.jsx`'s dark editorial photo panel; they were not part of the change. History: until this pass the post-login views were a night world (noche ground, crema type, vitrina boxes); those tokens are gone from the code.

This document supersedes `design-system.md` (the earlier light SaaS conventions) wherever they conflict. That file's daylight values (radius, field sizes, labels above inputs) still describe the auth form and Artículos, but its gray focus ring is now emerald, gradients are the identity mark as well as photo veils, and Gilda Display joins Inter as the display face.

**Key Characteristics:**
- White ground, white boxes, near-black ink; emerald-to-blue light as the identity on every post-login surface.
- Editorial serif display (Gilda Display, weight 400) over a neutral sans UI (Inter).
- Products in white vitrine cards whose emerald-to-blue frame and multiplied inner tint switch on at hover.
- Active, focus and selected states drawn in emerald: hairlines, outlines, check marks, gradient dots; emerald as text is always the darker emerald-700.
- A few deliberate dark accents (Filtros, carousel arrows, size chip, profile actions, floating cart) carry weight on white.
- A real store photograph heads the main pages, veiled into white.

## Colors

A white, near-neutral palette with near-black ink, lit by emerald and blue fills, with darker emerald and sky shades for any colored text.

### Primary
- **Identity Emerald** (esmeralda): the lead light, used as a fill or line, never as text on white. Starts every identity gradient; fills the count badges, the arrow chip on card hover and the empty-state gradient chips (at 25%); draws the active-nav hairline, the completed-step connector (60%), checked-chip borders (70%) and tints (15%), spinners, and the page text selection (at 30%). Text on an emerald fill is always tinta.

### Secondary
- **Identity Blue** (azul): the second light, always paired with emerald. It ends the gradient on primary buttons, offer tags, the active step dot and the selected radio circle, and is the bottom-right tint inside vitrine cards and the far end of the search capsule's focus glow.
- **Emerald Text** (emerald-texto, Tailwind emerald-700): every emerald that must be read on white: discounted prices, the discount line of summaries, "Principal", completed-step labels, empty-state links, icon accents (search icon, "Ver detalle" chevron, check marks), filter section counts, and field-icon focus on store fields.
- **Emerald Focus** (emerald-foco, emerald-600): the 2px focus outline on every post-login link and control; also the "Shopy" word of the logo on light grounds and field-icon focus on daylight fields.

### Tertiary
- **Info Sky** (sky-info, sky-700) on **Sky Tint** (sky-tint, sky-400 at 7-10%, 1px ring at 25% where it is a pill): savings ("Ahorras…", "Estás ahorrando…", where the sentence uses sky-800), per-item discount counters, the low-stock note on detail.

### Neutral
- **Lienzo** (lienzo): page ground of every post-login view, the NavBar, Footer and cart sheet, the search capsule (60% with blur), the photo veils, the mobile purchase bar (95%), and the text on dark accents.
- **Superficie** (superficie): vitrine card interiors, detail and profile panels, cart-sheet line items and footer, the filter and address modals.
- **Tinta** (tinta): all post-login text, stepped by opacity (see the rule), hairlines (10-15%), control borders (15-25%), quiet fills (2.5-8%), and the solid fill of the dark accents.
- **Daylight ground / ink / card** (background, foreground, card): the shadcn layer behind Artículos, the auth form side and the light dialogs (`ModalMensajes.jsx`, `ConfirmarEliminar.jsx`). Ink is the shadcn primary button fill on auth.
- **Focus Emerald** (ring): the global focus-ring token on shadcn controls.
- **Muted / muted text / border** (muted, muted-foreground, border): secondary fills, helper text and hairlines on the daylight auth form and Artículos.
- **Error Red** (destructive, red-600): inline errors and destructive actions only. In the Artículos table, low stock uses amber (amber-50 fill, amber-200 border, amber-700 text) as a semantic warning beside emerald "in stock" and red "sold out"; it is not an accent.

### Named Rules
**The Two Lights Rule.** The identity is emerald leading and blue following. Emerald may stand alone as a fill or line (badges, hairlines, chip borders); blue never appears alone, only as the far end of an emerald gradient or the second inner tint. Standalone blue is the sky informational tint, nothing else.

**The Gradient Is Identity Rule.** The emerald-to-blue gradient (left to right on buttons and tags; top-left to bottom-right on frames and dots) marks exactly: the primary action, the offer tag, the active checkout step, the selected radio circle, the hover frame of product cards and the detail photo frame (60% ends), and empty-state icon chips (at 25%). Text on a gradient or emerald fill is always tinta. It is never a page, section or panel background and never applied to text.

**The Dark Text on Light Fill Rule.** On white, the bright identity colors are fills only. Any colored text drops to its legible shade: emerald-700 for emerald text, emerald-600 for focus outlines, sky-700/800 for information, red-600 for errors.

**The Ink-by-Opacity Rule.** Post-login text hierarchy is tinta at stepped opacities, not extra grays: 100% headings, prices and active states; 90-95% panel titles and line-item names; 80% secondary links, labels, chip text and receipt row names; 75% ledes and selected address lines; 70% back links and sheet subtitles; 60% descriptions, meta, struck prices and inactive nav. 60% is the floor for anything read as text; lower opacities (down to 40%) are only for decorative icons, hairlines and borders.

**The Neutral Fallback Rule.** When the dress silhouette stands in for a missing photo or an empty state, its waist stroke is forced to currentColor (tinta 60%) so the fallback reads as neutral, not as the brand mark.

## Typography

**Display Font:** Gilda Display (with ui-serif, Georgia, serif), weight 400.
**Body Font:** Inter (with ui-sans-serif, system-ui, sans-serif), weights 400/500/600/700.

**Character:** A soft editorial serif (Gilda Display, chosen by the user over the original high-contrast Bodoni) speaks for the boutique in dark ink; a quiet grotesk handles everything functional. Display is always weight 400; it never carries labels or controls.

**Title scale (user-requested consistency):** page titles are 36px on mobile and 48px from sm (headline-page) on cart, order, profile greeting, item detail and Artículos; section titles 20-36px; the cart sheet and filter modal titles 30px. Only the storefront hero is larger (display). The order page closes with a 36px total and must fit one desktop viewport (checked at 1440×900 and 1280×720).

### Hierarchy
- **Display** (400, clamp 3rem to 5.5rem, line-height 0.98, -0.02em): the home hero headline over the veiled store photo, balanced wrap.
- **Display panel** (400, 3rem rising to 3.75rem at xl, 1.04): the auth editorial panel headline (white on the dark panel).
- **Headline page** (400, 2.25rem rising to 3rem at sm, leading tight): page titles; the profile greeting and the detail product name add -0.02em / -0.015em tracking.
- **Headline** (400, 1.875rem rising to 2.25rem at sm): home section titles ("En oferta", "La colección"); the cart sheet and filter modal titles at 1.875rem.
- **Title serif** (400, 1.5rem): detail panels ("Descripción") and profile section and modal titles.
- **Title panel** (400, 1.25rem): the cart summary title (tinta 90%) and the order receipt row names ("Enviar a", "Tu pedido", "Total") at tinta 80%.
- **Title, page / form** (Inter 700 1.875rem / Inter 600 1.5rem, -0.025em): daylight auth headings.
- **Title, product** (Inter 500, 15px): product name under a vitrine card and in receipt lines, truncated to one line.
- **Body** (Inter 400, 14px): descriptions, helper text, footer. **Lede** (Inter 400, 16px rising to 18px, 1.625, max ~28rem, tinta 75%): hero and profile sentence.
- **Label** (Inter 500, 14px): form labels, nav links, chip text; filter legends at 600.
- **Caption** (Inter 400, 12px): brand above a line item, "qty × unit", savings lines, "Principal".
- **Micro** (Inter 700 or 600, 11px, tabular): counters and badges only (cart badge, Filtros count, filter section counts, quantity dots on cart-sheet items) and compact size/color/discount tags in the cart sheet. Never running text.
- **Price** (Inter 600, 18px, tabular): card prices; struck originals at 14px tinta 60%. **Price total** (Inter 600, 1.875rem, -0.025em): cart sheet total; the cart summary uses 1.5rem rising to 1.875rem at weight 500. **Price receipt** (Gilda 400, 2.25rem, tabular): the closing total of the order receipt only.

### Named Rules
**The Serif Speaks, Sans Works Rule.** Gilda Display is for headlines, panel titles and receipt row names. Buttons, labels, chips, badges and nav are always Inter, and so is every price except one: the order receipt's closing total, set as a headline because it is the page's last word.

**The Micro Step Rule.** 11px exists for numerals in badges and counters and for compact tags; anything a customer must read as a sentence starts at 12px.

## Layout

Post-login pages center content in a max 80rem container (home, NavBar, Footer, profile) or 72rem (cart, detail); the order receipt narrows to 56rem; 20px side gutters on mobile and 32px from sm. Artículos uses a 1400px container with 16-24px gutters. The NavBar is a sticky 64px band.

The home hero is full-bleed: the store photo fills at least min(80svh, 50rem) under a bottom-up lienzo veil (solid to 60% to 5%) plus, from lg, a left veil (70% to 20%); content is pinned bottom-left (max ~42rem) with the search capsule (max ~36rem) under the lede, and on lg three real products "En vitrina" bottom-right in 8rem thumbnails. Sections are separated by 80px (offers), 64px (collection) and 112px after; each opens with a serif title and a tinta-60% note closed by a tinta-10% hairline. The product grid is 2 columns on mobile, 3 from sm, 4 from lg, 16-24px column gaps, 40px row gaps, 4:5 images. The offer carousel uses 18rem cards with 24px gaps.

Cart, order and detail open with a photo band (16-18rem tall, photo at 25-80% opacity) veiled top-down from lienzo 20-30% to solid lienzo behind the page header; cart and order show the two-step indicator above the title. The cart page splits into one tinted list panel of line items (tinta 2.5% fill, tinta-7% ring, 24px radius, rows ruled at tinta 6%, 4:5 photo 6-7rem wide, line subtotal with "qty × unit" under it, quantity stepper and a labelled "Quitar" action) and a 24rem summary panel of the same material that sticks at 6rem from lg. The order page is a single-column receipt instead (see Components). Detail pairs a thumbnail rail with a gradient-framed 4:5 photo, and on mobile adds a fixed bottom purchase bar (lienzo 95% with blur). The cart sheet is a right-side panel (max 28rem) on lienzo with a photo header, scrolling white line items and a white footer holding the total and checkout button. Auth uses a two-column grid on lg (dark photo panel left, form right); mobile shows only the form.

**Adaptation record: NavBar above the photo, not over it.** The direction asked for a bar over the hero photo. The build ships a solid lienzo band above it, because a route-aware transparent bar needs new hook/state logic and the user forbade logic changes in design passes ("Solo cambia UI y estilos"). Heroes and bands compensate with lienzo veils so band and photo meet without a seam.

**Adaptation record: Artículos stays light.** Artículos is the admin work screen; the user kept it light ("clara para trabajar") even under the former night world, and it is unchanged by this pass. Its header band carries the closet photo under a white scrim with a Gilda page headline, in a 24px-radius white card with a zinc ring.

### Photography
Optimized copies are served from `public/imgDress`, originals beside them: `imghome-2400` (home hero), `imglogin-1400` (auth panel), `imgperfil-2400` (profile hero), `imgcmisasnegras-1200` (cart sheet header and cart band), `imgarticulos-1600` (detail and order bands), `imgcloset-2400` (Artículos header).

## Elevation & Depth

Depth on white comes from tone, hairlines and a few soft shadows: white boxes on a #fafafa ground ringed at tinta 10%, photo veils, the multiplied tint inside vitrine cards, and backdrop blur on glass pieces. Shadows exist only on floating things and are soft zinc: the floating cart (large, zinc-900 25%), carousel arrows and offer tags (large, zinc-900 10%), the search capsule, and modals (extra-large, zinc-900 10%, over a zinc-950 40% blurred backdrop). Daylight auth keeps the shadcn vocabulary: 1px border plus a small shadow on cards, extra-large on dialogs.

### Shadow Vocabulary
- **Capsule glass** (`0 18px 48px -24px rgb(24 24 27 / 0.12)`): the home search capsule at rest, over lienzo 60% with blur and a tinta-20% ring. On focus within, the ring becomes 2px esmeralda at 70% and the glow adds `0 0 0 6px rgb(52 211 153 / 0.12), 0 0 48px -12px rgb(96 165 250 / 0.45)`.
- **Float** (large shadow, zinc-900 10-25%): floating cart, carousel arrows, offer tags.
- **Modal** (extra-large shadow, zinc-900 10%, plus a 1px tinta-10% ring): filter and address modals.
- **Daylight card / dialog** (small shadow plus 1px zinc border; extra-large on dialogs): Artículos, auth card, light dialogs.

### Named Rules
**The Light Not Lift Rule.** A card gains attention by lighting up: the emerald-to-blue frame fades in (opacity 0 to 1, 300ms), the multiplied inner tint rises from 60% to 100%, the arrow chip fills emerald, and the "Ver detalle" pill fades in. The card never rises or scales; the only movement is the pill's 8px settle, under motion-safe.

**The Veil Rule.** Any text over a photo sits on a gradient veil: lienzo on post-login pages (home and profile bottom-up plus a left veil; photo bands top-down to solid lienzo; white on the Artículos header), zinc-950 at 85%/15%/55% on the pre-login auth panel. Veils stay low so the photo reads (user request): the top 35–65% of every post-login photo is clear and the veil only fades in toward the bottom edge or behind the text column (home: from-lienzo → lienzo/55 at 30% → transparent at 65%; photo bands: transparent → lienzo/45 at 55% → lienzo). Photos run at full opacity, except the dark teal-wall band (detail, order) at 55% so dark text above it keeps contrast, and the cart band at 70%. The photo entrance animation is `.encender-foto` (home, profile).

## Shapes

Gently rounded. Controls, inputs, buttons, the Filtros button, thumbnails and the "Ver detalle" pill use 12px. Vitrine cards, panels, sheet line items, the search capsule and modals use 16px; card interiors use 15px so a 1px frame wraps them exactly. The cart page panels, the detail photo frame and the Artículos header use 24px. Fully round forms are reserved for chips, tags, badges, step dots, radio circles, quantity steppers, carousel arrows, arrow chips and the floating cart. Borders are 1px hairlines: tinta 10% for panel rings and dividers, 15% for receipt rules, 15-25% for control outlines, zinc on daylight auth. Product images are cropped 4:5 with object-cover.

## Components

### Buttons
Restrained, with one lit action per view and a few dark accents for weight.
- **Identity (primary everywhere post-login, and on Artículos):** emerald-to-blue gradient left to right, tinta text, semibold, 12px radius; 48px for page actions (44px in compact spots, full width in the sheet and cart summary). Hover: brightness 110%. Focus: 3px emerald ring at 50%. Disabled: 50% opacity.
- **Tinta (dark accent):** tinta fill, lienzo text, hover zinc-800, 48px semibold: the Filtros button in the search capsule and the profile's primary actions. Carousel arrows (44px round) and the detail size chip share the fill.
- **Outline:** transparent, tinta text, tinta-20-25% border, tinta-10% hover fill (detail "add to cart" alternate, profile secondary).
- **Ghost:** transparent, tinta 60% text, tinta-10% hover fill (logout, modal close).
- **Text link:** tinta 70-80%, hover tinta with underline at 4-6px offset, 44px min height ("Seguir comprando", "Volver al carrito", "Ver toda la colección").
- **Primary (daylight auth):** ink fill, near-white text, 44px, full width in forms; hover emerald-700; loading shows a spinner and "…".

### Chips
- **Filter chip:** 44px pill, tinta-15% border over tinta 3% fill, tinta-80% text; optional 14px color swatch with a tinta-30% ring. Hover: border tinta 35%, text tinta. Checked: border esmeralda 70%, fill esmeralda 15%, tinta text, and an emerald-700 check mark at the end. Keyboard focus: 3px emerald ring at 50%.
- **Section count:** each filter legend shows the number chosen as a micro emerald-700 on esmeralda-15% pill.

### Cards / Containers
- **Vitrine card (signature):** a 1px frame (tinta 10% at rest) wrapping a 15px-radius white box with a 4:5 photo. Inside, two multiply-blended radial tints: emerald from the top-left, blue from the bottom-right, at 60%. Hover or focus: the gradient frame fades in, the tint goes to full, a "Ver detalle" pill (lienzo 75%, blur, tinta-15% ring, emerald-700 chevron) fades in at the bottom of the photo, and the arrow chip beside the price (tinta 8% at rest) fills emerald. Name, one-line description (tinta 60%) and price sit below the box. Offer cards add the gradient percentage tag top-left, the discounted price in emerald-700 and a sky-700 savings line.
- **Panel:** superficie, 16px radius, tinta-10% ring, 24px padding: detail price and spec blocks, profile forms and sidebar.
- **Tinted panel (cart page):** tinta 2.5% fill, tinta-7% ring, 24px radius: the line-item list and the order summary.
- **Sheet line item:** superficie, 16px radius, 12px padding, tinta-10% ring, thumbnail with a micro quantity badge, tinta-8% meta pills for size and color, sky discount tag.
- **Daylight card:** white, 1px zinc border, small shadow, 12-16px radius (auth, Artículos).

**Adaptation record: product photos on white.** Product photos come from the API and are often white-background shots. On the white box they read as one seamless tile; the multiplied emerald/blue tint warms them slightly. This is a data reality, not a styling defect to patch with filters.

### Order Receipt (signature, order page)
The order page reads as a printed receipt, distinct from the cart page's panels. Single column (max 56rem), opened by a tinta-15% top rule; each row (`SeccionRecibo`) is closed by a tinta-15% hairline with 24px vertical padding, the row name in title panel at tinta 80% (optional tinta-60% detail under it) in a 9rem left column from sm; on mobile they stack.
- **Enviar a:** a radiogroup of address rows (`FilaDireccion`) separated by tinta-10% dividers, never boxed. Each row: a 20px circle (tinta-35% ring, 60% on hover) that fills with the emerald-to-blue gradient and a lienzo center dot when selected; recipient at 16px Inter 500 (tinta selected, 80% otherwise); "Principal" as plain emerald-700 caption; address at 14px (tinta 75% selected, 60% otherwise). Focus: emerald-600 outline inset.
- **Tu pedido:** a typographic list with tinta-10% dividers in a max 14rem scroll: 40x50 thumbnail, name at 15px Inter 500, "Talla · color · qty × unit" at tinta 60%, line total at 15px right-aligned.
- **Closing row:** "Total" as the row name, the amount in price receipt, then the identity button "Confirmar compra" (48px, min 14rem from sm) with a quiet "Volver al carrito" text link beside it.

### Inputs / Fields
- **Search capsule (signature):** one 16px container on lienzo 60% with blur and a tinta-20% ring, holding a leading emerald-700 search icon, a borderless input (tinta text, tinta-50% placeholder) and the dark Filtros button, which shows an emerald count badge when filters are active. Emerald ring and emerald/blue glow on focus within.
- **Store field** (`tono="noche"` in `CamposConIcono.jsx`; the prop name is historical, it now renders light): 44px, lienzo 60% fill, tinta-15% border, leading icon at tinta 60% that turns emerald-700 on focus; focus border esmeralda, ring esmeralda 30%. Used on profile and address forms.
- **Daylight field:** white, 1px zinc border, 12px radius, 44px, leading zinc icon that turns emerald-600 on focus; emerald focus ring (auth, Artículos).
- **Error:** destructive border and ring plus an inline alert block (12px radius, red 5% fill, 20% border, alert icon, red-600 text).

### Navigation
- **NavBar:** sticky 64px lienzo band with a tinta-10% bottom hairline, the non-light Logo left (dark mark, "Shopy" in emerald-600), links right (Inter 500, 14px). Inactive tinta 60%, hover tinta; active tinta with a 1px esmeralda hairline that scales in from the left (300ms). Mobile: menu button opens a lienzo drop panel with 44px link targets.
- **Footer:** lienzo band with a tinta-10% top hairline, tinta-60% text, the non-light Logo, 44px links that darken to tinta.
- **Steps (checkout):** "Carrito → Confirmar" as 24px numbered dots joined by a 40px hairline. Active: gradient dot with tinta number, tinta label. Done: esmeralda-15% dot with esmeralda-40% ring and emerald-700 check and label, esmeralda-60% connector. Pending: tinta-25% ring, tinta-60% label, tinta-20% connector.

### Tags and Badges
- **Offer tag:** emerald-to-blue gradient pill, bold tinta tabular text, float shadow, top-left over the photo.
- **Info tag:** sky-700 text on sky-400 at 10% with a sky 25% ring, pill, optional percent icon.
- **Count badge:** esmeralda pill, tinta micro text, with a 2px ring in the surface color where it sits on an edge (white on the floating cart, superficie on sheet items).

### Cart Sheet and Floating Cart
A 56px round tinta button with a white cart icon, fixed bottom-right, float shadow, hover zinc-800, emerald-600 focus outline; it opens the right-side cart sheet: lienzo panel, photo header veiled into lienzo with a 30px Gilda title and a round blurred lienzo close button, white line items, and a white footer with the price total and a full-width identity button.

### Photo Band and Product Photo
`BandaFoto` places a store photo behind the page header (at 25-80% opacity) under a lienzo veil (30% to 75% to solid). `FotoProducto` shows the product image on a tinta-5% fill with a tinta-10% ring, falling back to the neutral silhouette.

### Store Photo Hero (motion)
`index.css` defines a one-time settle for the home and profile photos (`encender-vitrina`: scale 1.06 and brightness 0.55 to rest over 1.6s on an expo-out curve, disabled under prefers-reduced-motion). It is not currently wired: both photos carry the class `encender-superficie`, which the stylesheet does not define, so they render static.

## Do's and Don'ts

### Do:
- **Do** build new post-login surfaces on lienzo with superficie boxes and tinta text, emerald for focus, active and selected states, and the emerald-to-blue gradient for the one primary action.
- **Do** keep bright emerald and blue as fills with tinta text on them; use emerald-700 for emerald text, emerald-600 for focus outlines, sky-700 for information and red-600 for errors.
- **Do** build text hierarchy from tinta opacity with 60% as the floor for readable text.
- **Do** keep blue paired with emerald; use the sky tint only for small informational tags.
- **Do** set headlines in Gilda Display at weight 400 and everything functional in Inter; page titles at 36px, 48px from sm.
- **Do** present products in vitrine cards: white box, 4:5 crop, tinta-10% frame that turns gradient on hover, multiplied inner tint.
- **Do** head main pages with a store photo veiled into lienzo, and put a veil under any text on a photo.
- **Do** mark active navigation with a 1px emerald hairline, not a filled pill.
- **Do** build confirmation steps as a receipt: hairline rows with serif names on the left, no boxes; keep panels for the cart.
- **Do** use the 11px micro step only for counters, badges and compact tags.
- **Do** force the dress waist stroke to currentColor whenever the silhouette is a fallback or empty state.
- **Do** keep 44px minimum touch targets and honor prefers-reduced-motion.

### Don't:
- **Don't** set text in bright esmeralda (#34d399), azul or sky-400 on white.
- **Don't** use blue alone as a fill, outline or glow.
- **Don't** use the identity gradient as a page, section or panel background, or on text.
- **Don't** reintroduce a dark page ground on post-login views; dark is reserved for the small accents named above and the pre-login auth panel.
- **Don't** reintroduce amber as an accent; amber appears only as the low-stock warning on admin tables.
- **Don't** set buttons, labels, badges or chips in Gilda Display.
- **Don't** lift or scale cards on hover; light them instead.
- **Don't** treat `design-system.md` as authority where it conflicts with this file.
