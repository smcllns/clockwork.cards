# Clockwork Cards v1 — Golden Spec

A birthday card for a specific kid (Oscar, DOB 2017-02-20) who loves numbers. Static SPA on Cloudflare Pages. Hero is a 3D physics scene; below it, snap-scrolling slides and tiles that tick every second. Two secret modes designed to be irresistible to a kid.

## Architecture

```
src/
├── index.tsx              # App shell. Owns only `shiny` state. Reads like a table of contents.
├── index.css              # Scroll snap (y mandatory), tile grid (5-col bento on sm:)
├── theme.css              # CSS custom properties: :root (light) / :root.shiny (cyberpunk)
├── constants.ts           # Lookup facts only (orbital speed, BPM, pool liters). No formulas.
├── utils.ts               # getAge(), daysSinceAge() — calendar math too tricky to inline.
├── components/
│   ├── section.tsx        # Section (shared snap wrapper), IdTag, css object
│   ├── slide.tsx          # Slide (centered max-w-xl inside Section), KeyMetric, Title, Headline, Body, Narrative, Unit, N
│   ├── tile.tsx           # TileContainer (Section + grid), Tile (data props or children)
│   ├── controls.tsx       # InlineStepper, InlineSlider, InlineDropdown, InlinePills
│   ├── useNow.ts          # 1-second tick hook → Date.now()
│   ├── nav.tsx            # Fixed top bar with cyberpunk toggle
│   └── footer.tsx         # © line
└── cards/
    ├── hero-cyberpunk/    # Three.js + Rapier 3D physics birthday text
    │   ├── index.tsx      # Component (name, dob, shiny props). Owns chaos state.
    │   ├── scene.ts       # Three.js + Rapier setup, animation loop, mode transitions
    │   ├── font.ts        # 5×7 bitmap font → sphere positions
    │   ├── colors.ts      # Light (greyscale) + shiny (neon) palettes
    │   └── shared.ts      # Layout specs, camera fit, wall/ball creation, grab handlers
    ├── slide-time.tsx     # Big number + unit dropdown (years through seconds)
    ├── slide-time-table.tsx  # All units at once in a table
    ├── slide-space.tsx    # Miles/km through space, light-speed comparison
    ├── slide-yogurt.tsx   # Kg eaten, baby hippo comparison, slider + stepper
    ├── slide-steps.tsx    # Steps walked, slider for steps/day, stepper for start age
    ├── slide-brushing.tsx # Brush time + strokes + blinks, steppers for mins and start age
    ├── slide-poops.tsx    # Poop count, stepper for frequency
    ├── tile-sleep.tsx     # Sleep years (stepper: hrs/night, default 10)
    ├── tile-heartbeats.tsx  # Heartbeat count (80 BPM, medical fact, not adjustable)
    ├── tile-fruit.tsx     # Fruit servings (stepper: servings/day, default 3)
    ├── tile-hugs.tsx      # Hug count (stepper: hugs/day, default 2)
    ├── tile-lungs.tsx     # Extra air liters (stepper: hrs hard play/day, default 1)
    └── tile-water.tsx     # Water liters + Olympic pool % (stepper: glasses/day, default 6)
```

Every card is self-contained: owns state, does math inline, imports only shared primitives. No compute functions, no formatter indirection — `.toFixed()` and `.toLocaleString()` where you use them. Formatting IS the product.

## Component hierarchy

`Section` is the shared snap-scrolling wrapper (100dvh, centered, background). Both `Slide` and `TileContainer` use `Section` — neither depends on the other.

`Slide` wraps children in a centered `max-w-xl` column. Cards compose freely with `Headline`, `KeyMetric`, `Body`, `Narrative`, `N`, etc. Three patterns emerge but aren't enforced:
- KeyMetric card (time, space, yogurt): Headline → KeyMetric → Unit
- Narrative card (brushing, poops): prose with inline controls and `<N>` values
- KeyMetric + Narrative (steps): big number plus explanatory prose

`Tile` accepts either data props (`emoji`, `value`, `unit`, `headline`, `body`) for the common layout, or `children` for custom markup. `body` is ReactNode so it can hold InlineSteppers. `TileContainer` wraps tiles in a 5-column bento grid (collapses to 1-col mobile). Tiles declare their span via `span` prop → CSS `--span` variable.

## Hero — 3D physics birthday text

Each pixel of a 5×7 bitmap font becomes a Three.js sphere with Rapier physics. Display: "9 / HAPPY / BIRTHDAY / OSCAR / FEBRUARY 20 2017". Multi-scale: age at 2.5×, words at 1.4×, date at 0.45×.

Balls spring-anchored to origin (velocity steering, stiffness 20). Drag spins scene around Y. Grab near balls to throw them (multi-grab, radius 3).

Four modes: `off | on | broken | broken-off`. Mode derived from `shiny × chaos`.

**Off:** Greyscale Lambert, no bloom, `renderer.render()` direct. Circuit-board decorations at opacity 0.12.

**On (shiny):** `.shiny` on `<html>`. MeshPhysicalMaterial with emissive glow, metalness 0.6, clearcoat 0.5. Bloom pass. Circuits animate, LEDs pulse.

**Broken:** Gravity -80y. Staggered radial wave release (0–0.8s). Ground hit → spark → dying-lightbulb flicker. Death times heavy-tailed: 80% in 5–60s, 15% in 60–180s, 5% in 3–100 minutes. Bloom tracks brightest survivor.

## The two toggles are reverse-psychology UX

Top-right: "✨ Cyberpunk" toggle in gold. Toggles off↔on.

Bottom-left of hero (only visible when shiny is on): "🚫 Do not touch" in red with grey toggle. A kid *will* press it. Triggers broken permanently. Toggle goes dead.

## Inline controls in prose

Not form fields below content. Steppers (`‹ value ›`) and sliders appear *inside sentences*, styled as accent-colored chips with `color-mix()` backgrounds. All assumptions about the kid's habits are exposed as interactive controls — you tune the numbers by tweaking assumptions within the narrative.

## Theming

CSS custom properties on `:root` / `:root.shiny`. One `classList.toggle("shiny")` on `<html>` flips everything.

Light: white bg, greyscale text, blue accent (#3b82f6), Space Grotesk for display + stats.
Shiny: dark bg (#0a0a0f), cyan accent (#00ffff), neon-pulse + glow-border keyframes on `[data-card]`, text-shadow glow on `[data-stat]`.

Theme transitions scoped to body/section/footer/`[data-card]` only (not `*`) for scroll perf.

## What belongs where

**constants.ts:** Arbitrary facts you'd look up — orbital speed, child BPM, pool liters. NOT unit conversions (86_400_000 is self-documenting inline), NOT kid-specific habits (those are useState + InlineStepper in each card).

**utils.ts:** Only `getAge()` and `daysSinceAge()` — calendar-aware math you'd get wrong reimplementing. Two functions, both >5 lines.

**Inline in cards:** Everything else. Each card does its own math with `.toFixed()` and `.toLocaleString()`. No shared formatting functions. If heartbeats says "378.3 million" while steps says "17.5 million", each card just does what it needs.

## Perf choices

- Pixel ratio forced to 1 (skip retina).
- Off mode: Lambert + direct render (no bloom compositor).
- Low-poly spheres (8×6 segments).
- `canSleep(false)` — constant simulation avoids wake jitter.
- IntersectionObserver pauses animation when hero scrolls offscreen.

## IdTags

Every slide and tile has a muted `#id` tag. Purpose: feedback during development — "change something on #5d." Not for end users.

## Stack

Bun (runtime/bundler/dev), React 19, Tailwind v4 (`bun-plugin-tailwind`), Three.js + Rapier 3D. Deploy: Cloudflare Pages. Font: Space Grotesk. URL params: `?name=`, `?dob=` (defaults from `.env`).

## Device priority

iPad Mini (744px) first, iPhone (390px) second, desktop contained. Breakpoint: 640px (sm:).
