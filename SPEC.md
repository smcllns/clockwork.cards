# Clockwork Cards — Golden Spec
<!-- ~116 lines spec -->

Digital birthday card for Oscar (DOB 2017-02-20). Live-updating stats about time alive, space travel, body facts. Numbers are the star. Designed for a kid who loves math.

## Stack
Bun (runtime/bundler/dev), React 19, Tailwind v4 (`bun-plugin-tailwind`), Three.js + Rapier 3D physics. Deploy: Cloudflare Pages via Wrangler. Font: Space Grotesk (display + stats in both themes).

## Architecture
```
index.html → src/index.tsx → Nav + Hero + Slides + TileContainer + Footer
```
URL params: `?name=`, `?dob=` (defaults from `.env` via Bun env inlining). Single-page, no routing.

`index.tsx` owns only `shiny` state. Every card is self-contained: owns its own state, does math inline, imports shared primitives from `components/` and lookup facts from `constants.ts`.

## Layout
```
┌───────────────────────────┐
│ NAV: clockwork.cards/name │  ← fixed top, cyberpunk toggle
├───────────────────────────┤
│     HERO (90dvh)          │  ← Three.js canvas, chaos toggle bottom-left
├───────────────────────────┤
│  SLIDE: Time       (100dvh)│
│  SLIDE: Time Table (100dvh)│
│  SLIDE: Space      (100dvh)│  7 snap slides + 1 tile grid section
│  SLIDE: Yogurt     (100dvh)│
│  SLIDE: Steps      (100dvh)│
│  SLIDE: Brushing   (100dvh)│
│  SLIDE: Poops      (100dvh)│
│  TILES: Brain&Body (100dvh)│  ← bento grid (6 tiles)
├───────────────────────────┤
│  FOOTER: © 2026           │
└───────────────────────────┘
```
Scroll-snap: `y mandatory` on html. Each section is `snap-section` (scroll-snap-align: start).

Device priority: iPad Mini (744px) > iPhone (390px) > Desktop (max-width contained). Breakpoint: 640px (sm:).

## Component Hierarchy

`Section` (section.tsx) is the shared snap-scrolling wrapper. Both `Slide` and `TileContainer` use Section — neither depends on the other.

`Slide` wraps children in centered `max-w-xl`. Cards compose freely with `Headline`, `KeyMetric`, `Body`, `Narrative`, `N`, etc.

`Tile` accepts data props (`emoji`, `value`, `unit`, `headline`, `body: ReactNode`) or `children`. `TileContainer` wraps tiles in a 5-column bento grid. Tiles declare span via `span` prop → CSS `--span` variable.

## Hero — 3D Physics Birthday Text
**What it shows:** "9 / HAPPY / BIRTHDAY / OSCAR / FEBRUARY 20 2017" as spheres arranged in a 5x7 bitmap font grid. Multi-scale: age digits 2.5x, words 1.4x, date 0.45x.

**Tech:** Three.js scene + Rapier WASM physics. Spheres spring-anchored to origin (velocity steering, stiffness 20). Drag spins scene around Y. Grab near balls to throw (multi-grab, radius 3).

**Four modes** (derived from `shiny × chaos`):
- **off:** Greyscale Lambert, no bloom, direct render. Faint circuit-board decorations.
- **on:** Dark bg, neon MeshPhysicalMaterial (emissive, metalness 0.6, clearcoat 0.5). Bloom pass. Circuits animate, LEDs pulse.
- **broken:** Gravity -80y. Staggered radial release (0-0.8s). Balls spark → dying lightbulb flicker. Death times heavy-tailed (80% 5-60s, 15% 60-180s, 5% 180-6000s). Bloom tracks max survivor.
- **broken-off:** Broken mode with off-mode materials.

**Perf:** Pixel ratio 1. Low-poly spheres (8x6). Lambert in off mode. canSleep(false). IntersectionObserver pauses when offscreen.

## Toggles — Reverse Psychology UX
Top-right: "✨ Cyberpunk" in gold. Toggles off↔on.

Bottom-left of hero (visible only when shiny on): "🚫 Do not touch" in red. One press → broken permanently. Toggle goes dead.

## Cards

**Slide cards** (full-viewport snap sections):
- **Time** — Big number + unit dropdown (years through seconds). Years show 3 decimal places.
- **Time Table** — All time units displayed simultaneously in a table.
- **Space** — Miles/km through space (67,000 mph × hours alive). Light-speed comparison. InlinePills toggle.
- **Yogurt** — Kg eaten since configurable age. Baby hippo comparison. InlineSlider + InlineStepper.
- **Steps** — Steps walked. InlineSlider for steps/day, InlineStepper for start age.
- **Brushing** — Brush time + strokes + blinks. Two InlineSteppers.
- **Poops** — Poop count. InlineStepper for frequency.

**Tile cards** (bento grid, 5-col brick pattern on sm:, 1-col mobile):
- **Sleep** — Sleep years. Stepper: hrs/night (default 10, range 7-13).
- **Heartbeats** — Total beats. 80 BPM (medical fact, not adjustable).
- **Fruit** — Servings count. Stepper: servings/day (default 3, range 1-8).
- **Hugs** — Hug count. Stepper: hugs/day (default 2, range 1-10).
- **Lungs** — Extra air liters. Stepper: hrs hard play/day (default 1, range 1-4).
- **Water** — Liters + Olympic pool %. Stepper: glasses/day (default 6, range 2-12).

## Inline Controls
Not form fields. Steppers (`‹ value ›`) and sliders appear *inside sentences*, styled as accent-colored chips with `color-mix()` backgrounds. All kid-specific assumptions exposed as interactive controls.

## Theming
CSS custom properties on `:root` / `:root.shiny`. One classList toggle on `<html>`.

Light: white bg, greyscale text, blue accent (#3b82f6), Space Grotesk.
Shiny: dark bg (#0a0a0f), cyan accent (#00ffff), neon-pulse + glow-border keyframes on `[data-card]`, text-shadow glow on `[data-stat]`.

Transitions scoped to body/section/footer/`[data-card]` for scroll perf.

## What Belongs Where
**constants.ts:** Lookup facts (orbital speed, BPM, pool liters). NOT unit conversions, NOT kid-specific habits.

**utils.ts:** `getAge()` + `daysSinceAge()` only — tricky calendar math.

**Inline in cards:** All formatting, all simple math. Each card is a complete story.

## Key Files
```
src/index.tsx              — App shell, shiny state, section order
src/theme.css              — CSS custom properties, animations
src/index.css              — Scroll snap, tile grid responsive
src/constants.ts           — 6 lookup constants (space, body, food)
src/utils.ts               — 2 functions (getAge, daysSinceAge)
src/components/section.tsx — Section, IdTag, css (shared by slide + tile)
src/components/slide.tsx   — Slide, KeyMetric, Title, Headline, Body, Narrative, Unit, N
src/components/tile.tsx    — TileContainer, Tile
src/components/controls.tsx — InlineStepper, InlineSlider, InlineDropdown, InlinePills
src/components/useNow.ts   — 1-second tick hook
src/components/nav.tsx     — Fixed nav bar
src/components/footer.tsx  — © line
src/cards/hero-cyberpunk/  — Three.js + Rapier 3D scene (5 files)
src/cards/slide-*.tsx      — 7 full-viewport snap slides
src/cards/tile-*.tsx       — 6 bento grid tiles
```
