# Radical Simplification Plan

**Goal:** Strip everything not on the v11 + CuratedMain production path. ~5,900 LOC deleted, 3 unused deps removed, ~25 source files deleted.

## Production import chain (everything outside this dies)

```
index.html → src/index.tsx
  → hero/index.tsx → v11-slow-death.ts → variations.ts + font.ts + colors.ts
  → main/index.tsx → CuratedMain.tsx → stats.ts + Controls.tsx
  → footer/index.tsx → theme.css
```

---

## Phase 1: Delete dead files

### Hero variations (~3,500 LOC)
- [x] `src/hero/v1-holographic-grid.ts`
- [x] `src/hero/v2-digital-rain.ts`
- [x] `src/hero/v3-blueprint.ts`
- [x] `src/hero/v4-particle-nebula.ts`
- [x] `src/hero/v5-neon-circuits.ts`
- [x] `src/hero/v6-dying-lights.ts`
- [x] `src/hero/v7-glass-floor.ts`
- [x] `src/hero/v7b-glass-box.ts`
- [x] `src/hero/v8-neon-letters.ts`
- [x] `src/hero/v9-two-buttons.ts`
- [x] `src/hero/v12-short-circuit.ts`

### Main layout variations (~1,600 LOC)
- [x] `src/main/V1CompactGrid.tsx`
- [x] `src/main/V2Magazine.tsx`
- [x] `src/main/V3BentoBox.tsx`
- [x] `src/main/V4Narrative.tsx`
- [x] `src/main/V5Ticker.tsx`
- [x] `src/main/V6InteractiveNarrative.tsx`
- [x] `src/main/V7RichBento.tsx`
- [x] `src/main/V8FullViewport.tsx`
- [x] `src/main/Card.tsx` (unused, CuratedMain has own FlipCard)

### Dead modules
- [x] `src/store/theme.ts` (Zustand store, never imported — shiny is DOM-based)
- [x] `src/store/` directory

### Dead root files
- [x] `package-lock.json` (npm lockfile, we use Bun)
- [x] `status.md` (stale planning artifact)

### Content iterations
- [x] `content/a.md`, `content/b.md`, `content/c.md`, `content/x.md`, `content/z.md`
- [x] Rename `content/d-FINAL-CANDIDATE.md` → `content/content-directional.md`

### Playwright debug artifacts
- [x] `.playwright-mcp/` — delete entire dir, add to .gitignore

---

## Phase 2: Simplify kept files

### `src/hero/index.tsx` (~310 → ~150 LOC)
Remove:
- `VARIATION_NAMES` array + `TOTAL_VARIATIONS` constant
- `getVariation()` function
- `variation` state, `setVariation`, `switchVariation()`
- Dynamic import switch (entire switch block)
- Variation switcher UI (bottom-left numbered buttons)

Replace with: static import of `initV11`, direct call in useEffect.

### `src/main/index.tsx` (~91 → ~10 LOC)
Remove:
- All V1-V8 imports
- `SectionLabel` component
- `ExploreMain` component
- Hash-based router + listener

Replace with: passthrough to CuratedMain.

### `src/main/stats.ts` — remove `useStats` hook
Only used by dead ExploreMain. Remove hook + its React imports.

### `src/footer/index.tsx` (~27 → ~12 LOC)
Remove: hash state tracking, "Layout explorations" link.

### `src/hero/font.ts` — remove dead exports
Remove: `Pixel` type, `ordinalSuffix()`, `birthdayLines()`, `getTextPixels()` — none imported.

### `src/footer/theme.css` — remove dead CSS
Remove: `.shiny [data-dot-grid]`, `[data-shiny-overlay]::after`, `.shiny [data-shiny-overlay]::after` — attributes never used.

### `index.html` — remove Caveat font
Remove `Caveat:wght@400;700` from Google Fonts URL. Never referenced. Saves ~20KB + a network request.

### `package.json` — remove unused deps
- `matter-js` — never imported (early 2D physics experiment)
- `@types/matter-js` — corresponding types
- `puppeteer-core` — never imported (screenshot automation)

Then `bun install` to regenerate lockfile.

---

## Phase 3: Rename for clarity ✅ APPROVED

- `v11-slow-death.ts` → `scene.ts`
- `variations.ts` → `shared.ts`
- Keep `font.ts` and `colors.ts` as-is

---

## Phase 4: Fix brittle patterns

1. **GC in hot loop** — `v11-slow-death.ts` allocates `new THREE.Color()` every frame for dying balls. Hoist to constant.
2. **Grab handler uses stale dimensions** — `setupGrabHandlers` captures initial w/h. Fine for birthday card, note for future.
3. **No geometry/material disposal** — `dispose()` doesn't clean up Three.js resources. Fine for single-page, leaks on HMR. Low priority.

---

## Final file tree

```
index.html
package.json
bunfig.toml
build.ts
tsconfig.json
vercel.json
.env
CLAUDE.md
SPEC.md                    # golden spec (compressed for LLM rebuild)
content/
  content-directional.md   # renamed from d-FINAL-CANDIDATE.md
src/
  index.tsx                # imports Hero, CuratedMain, Footer directly
  index.css
  hero/
    index.tsx              # wrapper, shiny/chaos toggles
    scene.ts               # v11 physics (renamed from v11-slow-death.ts)
    shared.ts              # scene utilities (renamed from variations.ts)
    font.ts                # bitmap font + layout constants
    colors.ts              # LIGHT/SHINY palettes
  main/
    CuratedMain.tsx        # production card layout (no index.tsx wrapper)
    stats.ts               # stat computation
    stats.test.ts
    helpers.test.ts
    Controls.tsx           # inline steppers, sliders, pills
  footer/
    index.tsx              # copyright (simplified)
    theme.css              # CSS custom properties + shiny theme
```

**~15 source files. All on production path. Trivially traceable.**

---

## Verification

1. `bun test` — stats tests pass
2. `bun run dev` — hero + all 6 curated slides work
3. Manual: shiny toggle, chaos button, drag-to-spin, controls, mobile layout
4. `bun run build` — verify smaller dist/
5. Screenshot light + shiny modes

---

## Resolved questions

1. ✅ **Rename v11/variations** — Yes, do it. Only 2-3 import path changes.
2. ✅ **Delete `main/index.tsx`** — Import CuratedMain directly from src/index.tsx. Simpler.
3. ✅ **content/ dir** — Delete all iterations. Keep `d-FINAL-CANDIDATE.md` renamed to `content-directional.md`.
4. ✅ **SPEC.md files** — Delete hero/SPEC.md and main/SPEC.md. Replace with single root `SPEC.md` (golden spec, compressed for LLM rebuild).
