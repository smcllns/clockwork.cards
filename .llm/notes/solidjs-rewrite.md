# Architecture Notes

## Architecture Decisions

### Why Vite instead of pure Bun
Bun's built-in bundler can compile SolidJS JSX but doesn't have a dev server with HMR for SolidJS. Vite + `vite-plugin-solid` gives us proper JSX compilation, HMR, optimized builds, standard tooling.

### Why vanilla CSS instead of Tailwind
~3KB CSS total vs Tailwind overhead. CSS custom properties for theming. Inline styles on components for layout (SolidJS convention).

### Facts as Pure Functions (v3 architecture)
`FactFn = (ctx: FactContext) => FactData` — each fact is a standalone arrow function. No config wrappers. Facts import from `lib/` but never touch DOM/SolidJS. Params exported separately as `Record<string, ParamDef>`. Canvas wires params to sections.

Module-scope computation was rejected because it evaluates once at import time, breaking `live: true` facts that need to update every second.

### Canvas as JSX (not config array)
Canvas is a JSX component, not a config array. The JSX IS the layout. Two canvases: `/` → Demo.tsx, `/dev` → Dev.tsx. Pathname routing in `index.tsx`, no router library.

### Section-Local Params
Params (BPM, sleep hours) are local to each `<Section>`. Each Section creates its own signals, persists to `localStorage` under `happy-metrics.params.{SectionName}`. Params displayed as inline values below the section title with a gear icon to toggle sliders for editing.

### Minimal Store
Store is just: `now` (1s timer signal), `dob`, `name`, `gender`. That's it. No settings, no params, no text overrides.

### DOB Parsing
`new Date("2017-02-19")` parses as UTC midnight, showing Feb 18 in US timezones. Fixed by appending `T00:00:00` to parse as local time.

### SolidJS Gotchas
- **Dynamic Tags**: `const Tag = 'span'; <Tag>` doesn't work — SolidJS compiles JSX at build time. Must use `<Dynamic component={Tag}>` or the concrete tag.
- **`<For>` vs `<Index>`**: `<For>` keys by reference identity. If the array contains new objects every tick (e.g. from a 1s timer signal), `<For>` destroys/recreates DOM, resetting CSS animations. Use `<Index>` for position-stable lists where items recompute but position is fixed.
- **3D card faces**: Both math and settings faces use `rotateY(180deg)`. Using `rotateX` for settings caused upside-down content. When two back-faces share the same rotation, use `display: none` to hide the inactive one.

## File Map

| File | Purpose |
|------|---------|
| `src/index.tsx` | Entry point, URL param parsing, pathname routing |
| `src/canvas/Demo.tsx` | Canonical birthday card canvas (served at /) |
| `src/canvas/Dev.tsx` | Sandbox canvas (served at /dev) |
| `src/canvas/Section.tsx` | Renders fact cards + section-level param sliders |
| `src/canvas/Prose.tsx` | Renders fact prose sentences with tap-for-math |
| `src/canvas/store.ts` | Timer (now), dob, name, gender |
| `src/models/time-alive.ts` | 7 fact functions (Years → Seconds) |
| `src/models/sleep.ts` | 3 fact functions + sleepHours param |
| `src/models/heartbeats.ts` | 3 fact functions + bpm param |
| `src/models/steps.ts` | 4 fact functions + 3 params |
| `src/models/space.ts` | 5 fact functions |
| `src/models/fun-facts.ts` | 5 fact functions (blinks, breaths, meals, poops, hair) |
| `src/widgets/FlipCard.tsx` | 3D flip card: value + math faces (⚠️ has dead settings face code) |
| `src/widgets/Slider.tsx` | Range input |
| `src/widgets/ThemeToggle.tsx` | Cyberpunk ↔ Minimalist toggle |
| `src/widgets/Confetti.tsx` | Celebration particles |
| `src/lib/types.ts` | FactFn, FactData, FactContext, ParamDef, MathStep |
| `src/lib/time.ts` | Time calculations, birthday helpers |
| `src/lib/format.ts` | Number formatting, numberToWord |
| `src/lib/constants.ts` | Space speeds, distance comparisons |
| `src/themes/cyberpunk.css` | Dark theme with neon accents |
| `src/themes/minimalist.css` | Clean light theme |
| `src/index.css` | Animations, utility classes, layout |

## Running
- `bun run dev` — dev server on :3000
- `bun run build` — production build to dist/
- `bun test` — 57 tests (lib + models)

## Bundle Size
- JS: ~45.3KB (gzip: ~15.0KB)
- CSS: ~3.0KB (gzip: ~1.1KB)

## Cleanup Needed
- **FlipCard dead code** — settings face, gear icon, params/paramValues/onParamChange props are unused. Strip them.
- **Extract Hero widget** — hero section is inline in Demo.tsx, should be its own widget for customization.

## Product Decisions
- **Cross-section param sharing** — WON'T SUPPORT. Wait for real need to arise.
- **CSS/theming** — deferred until product features are settled. When implementing: support custom Google Fonts as a first-class feature.
- **ContentEditable** — removed. Titles are plain text driven by models/canvas.
