---
version: 1
slug: "src-pages-home-home-jsx"
primary_target: "src/pages/home/home.jsx"
related_targets: ["src/components/NavBar.jsx","src/components/Footer.jsx"]
---

# Surface: Home (vitrina) — src/pages/home/home.jsx

Mode: Persuade (storefront). Audience: boutique shoppers, logged in. Action: search/filter and open a garment. Proof: real catalog products and the store photo (public/imgDress/imghome.jpg). Constraints: UI and styles only; hooks, filters, carousel state, discount split and API calls stay untouched. NavBar and Footer restyled too (shared, logic intact). Real data includes broken product images and often zero offers.

## Direction contract
THESIS: The home is the boutique's window lit at night; it refuses the SaaS hero with metric row and floating collage.
OWN-WORLD: Night ground #0b0b0c, cream text #f4efe6, amber lamp #d9a85b for light and focus, emerald only for offer tags; Bodoni Moda display, Inter UI; products as lit vitrine boxes; active states as hairline rules.
STORY: The visitor sees the store, believes it is curated, searches or browses, opens a garment.
FIRST VIEWPORT: Full-bleed rack photo (~88vh), bottom veil; bottom-left Bodoni headline at ~6.5rem, one-line lede, search bar with Filtros as lit glass inside the window; bottom-right three real products "En vitrina" (desktop only); dark NavBar over the photo.
FORM: Vitrina nocturna, grounded list position 7, seed ccbdc9d0. Signature motion: photo settles from 1.06 scale and dim to rest once on load.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
