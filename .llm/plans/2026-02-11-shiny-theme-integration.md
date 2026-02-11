# Shiny Theme Integration — Hero + Footer

## Goal
Connect footer's shiny toggle to Hero physics renderers so toggling shiny mode updates colors/effects everywhere — including Three.js materials and Matter.js canvas drawing.

## Approach
- Zustand store as shared state (already installed, never used)
- Two color palettes (light candy + shiny neon) defined once, used by both renderers
- Imperative material/color updates on toggle (CSS vars don't reach WebGL/Canvas2D)
- Hero section bg via CSS var instead of hardcoded `bg-amber-50`

## Tasks

- [x] **1. Create theme store** — `src/store/theme.ts`
- [x] **2. Wire Footer to store** — `src/footer/index.tsx`
- [x] **3. Define shared color palettes** — `src/hero/colors.ts`
- [x] **4. Update Approach D (Three.js)** — `src/hero/approach-d.tsx`
- [x] **5. Update Approach C (Matter.js)** — `src/hero/approach-c.tsx`
- [x] **6. Add `--bg-hero` to theme.css**
- [x] **7. Test both approaches in both modes** — screenshots in `screenshots/`

## Questions
None — approach approved in conversation.
