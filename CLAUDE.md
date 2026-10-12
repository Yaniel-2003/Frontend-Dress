# CLAUDE.md

## Flujo de UI

- Para crear o rediseñar UI usa la skill `impeccable`, respetando `PRODUCT.md`.
- En componentes React aplica las skills `react-best-practices` y `composition-patterns`.
- Antes de dar por terminado un cambio de UI:
  1. Levanta el dev server (`pnpm dev`).
  2. Verifica el render en Chrome con `chrome-devtools` a 375px y 1440px de ancho.
  3. Corre `web-design-guidelines` sobre los archivos tocados y corrige los hallazgos.
