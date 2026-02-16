# Clockwork Cards — Golden Spec

Digital birthday card for Oscar (DOB 2017-02-20). Live-updating stats about time alive, space travel, body facts. Numbers are the star. Designed for a kid who loves math.

## Stack
Bun (runtime/bundler/dev), React 19, Tailwind v4 (`bun-plugin-tailwind`), Three.js + Rapier 3D physics. Deploy: Cloudflare Pages via Wrangler. Fonts: Space Grotesk (display), Space Mono (stats in shiny mode).

## Architecture
```
index.html → src/index.tsx → Hero + CuratedMain + Footer
```
URL params: `?name=`, `?dob=` (defaults from `.env` via Bun env inlining). Single-page, no routing.

## Layout
```
┌───────────────────────────┐
│ nav: clockwork.cards/name │  ← inside hero, not sticky
│                           │
│     HERO (90dvh)          │  ← Three.js canvas, full-bleed
│                           │
│  [🚫 chaos]   [✨ shiny] │  ← chaos: absolute in hero; shiny: fixed top-right
├───────────────────────────┤
│  SLIDE 1: Time    (100dvh)│
│  SLIDE 2: Space   (100dvh)│  ← 6 full-viewport snap slides
│  SLIDE 3: Yogurt  (100dvh)│
│  SLIDE 4: Life #s (100dvh)│
│  SLIDE 5: Brain   (100dvh)│
│  SLIDE 6: Binary  (100dvh)│
├───────────────────────────┤
│  FOOTER: © 2026           │
└───────────────────────────┘
```
Scroll-snap: `y proximity` on html. Each slide is `snap-section` (scroll-snap-align: start).

Device priority: iPad Mini (744px) > iPhone (390px) > Desktop (max-width contained). Breakpoint: 768px for brain bento grid collapse.

## Hero — 3D Physics Birthday Text
**What it shows:** "9 / HAPPY / BIRTHDAY / OSCAR / FEBRUARY 20 2017" as spheres arranged in a 5x7 bitmap font grid. Each character = cluster of spheres at pixel positions. Multi-scale: age digits 2.5x, words 1.4x, date 0.45x.

**Tech:** Three.js scene + Rapier WASM physics world. Spheres are dynamic rigid bodies with ball colliders, spring-anchored to origin positions (velocity = (origin - pos) * 20). Walls form a cube around the visible area. Front glass wall at z=3 prevents perspective blowup. Raised floor prevents bottom-edge clipping.

**Three modes:**
- **off:** White bg (#f5f5f0), greyscale Lambert materials, no bloom. Renderer.render() directly (skip composer for perf).
- **on:** Dark bg (#080c10), neon MeshPhysicalMaterial (emissive, metalness 0.6, clearcoat 0.5). Bloom pass active. Circuit paths glow, flow dots animate, LEDs pulse.
- **broken:** One-shot chaos. Gravity -80y. Staggered release from random impact point (0-0.8s spread). Balls hit ground → spark color. Then per-ball dying lightbulb flicker (death times: 80% 5-60s, 15% 60-180s, 5% 180-6000s). Circuits spark then die. LEDs die sequentially. Bloom tracks max survivor intensity.

**Interaction:**
- Drag horizontally → spin entire scene around Y axis (spinAngle += deltaX * 0.01, applied as quaternion to all mesh positions).
- Touch/click near balls → multi-grab (radius 3 world units). Grabbed balls follow pointer via velocity steering (force 12).
- IntersectionObserver pauses animation when hero scrolls off-screen.

**Perf choices:** Pixel ratio capped at 1. Low-poly spheres (8x6). Lambert materials in off mode. Bloom skipped in off mode. canSleep(false) on all bodies (prevents physics stalls).

**Visual layers:** Circuit board background (20 random polylines + endpoint dots + 6 chip rectangles). 5 LED indicators top-left. All dim in off mode, glow in on mode, spark+die in broken mode.

## Main — 6 Curated Slides
Stats engine: `computeStats(dob, config, now)` → pure function, all metrics derived from DOB + configurable params (yogurt grams/day, steps/day, brush minutes, etc.). `config` state in CuratedMain, `now` ticks every 1s via setInterval.

**Slide 1 (Time):** Big number + unit pills (yrs/mo/wks/days/hrs/min/sec). Seconds tick live.
**Slide 2 (Space):** Miles/km through space. Earth orbital speed × hours alive. Light speed comparison.
**Slide 3 (Yogurt):** Kg eaten. Configurable grams/day + start age. Baby hippo weight comparison.
**Slide 4 (Your Life):** Narrative paragraphs with inline controls. Steps, brushing, blinks, hair length, poops. V6-style: stats embedded in prose, controls inline.
**Slide 5 (Brain & Body):** Bento grid (5-col, brick pattern 3/2 alternating). Sleep, heartbeats, fruit, hugs, lungs, water. Pink neon glow in shiny mode.
**Slide 6 (Binary):** Base-2 explanation. FlipCard: crossfade between base-2 and base-10 representations. Closing message: "happy 1001st birthday."

**Controls:** Inline (in prose): InlineStepper (‹ val ›), InlineSlider (range + readout), InlinePills (segmented toggle). Block (standalone): BlockControl (label + child), BlockSlider, BlockStepper. All use CSS custom properties for theming.

## Theming
CSS custom properties on `:root` / `:root.shiny`. Toggle via `document.documentElement.classList.toggle("shiny")` from hero component.

**Light:** White backgrounds, greyscale text, blue accent (#3b82f6), Space Grotesk for stats.
**Shiny:** Dark backgrounds (#0a0a0f), cyan/purple/pink accents, cyan text-accent (#00ffff), Space Mono for stats, neon-pulse + glow-border animations on cards, text-shadow glow on headings and stat numbers.

Brain bento cards override: pink neon glow (neon-pulse-pink, glow-border-pink) instead of default cyan.

Theme transitions scoped to body/section/footer/[data-card] for scroll perf.

## Key Files (post-simplification)
```
src/index.tsx          — App root, URL params, renders Hero + CuratedMain + Footer
src/hero/index.tsx     — React wrapper. RAPIER.init(), mode state, shiny/chaos toggles
src/hero/scene.ts      — initScene(): Three.js + Rapier setup, animation loop, setMode/dispose
src/hero/shared.ts     — layoutBalls, getBirthdaySpecs, setupScene, fitCamera, addWalls, createBalls, setupGrabHandlers
src/hero/font.ts       — 5x7 bitmap font A-Z 0-9. FONT record, CHAR_W/H/GAP, LINE_GAP, SPACE_W
src/hero/colors.ts     — LIGHT (10 greyscale hex) and SHINY (10 neon hex) palettes
src/main/CuratedMain   — 6 slides, stats config state, all slide components
src/main/stats.ts      — computeStats() pure function, formatting helpers (fmt, fmtBig, fmtYears, hippoHeadline)
src/main/Controls.tsx   — InlineStepper, InlineSlider, InlinePills, BlockControl, BlockSlider, BlockStepper
src/footer/index.tsx   — © line
src/footer/theme.css   — CSS custom properties for light/shiny, animations, transitions
src/index.css          — Scroll snap, brain bento responsive, pink glow overrides
```
