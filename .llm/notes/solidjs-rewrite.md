# Architecture Notes

## Architecture Decisions

### Why Vite instead of pure Bun
Bun's built-in bundler can compile SolidJS JSX but doesn't have a dev server with HMR for SolidJS. Vite + `vite-plugin-solid` gives us:
- Proper SolidJS JSX compilation (different from React JSX)
- Hot module replacement
- Optimized production builds
- Standard tooling

### Why vanilla CSS instead of Tailwind
- ~3KB CSS total vs Tailwind overhead
- CSS custom properties for theming (the same approach the original used under the hood)
- Inline styles on components for layout since SolidJS recommends them

### Facts as Pure Functions (v3 architecture)
Previous v2 used config-driven `MetricConfig` objects with value/math/prose as functions. v3 simplifies to pure functions:
- `FactFn = (ctx: FactContext) => FactData` — each fact is a standalone arrow function
- No config wrappers, no Section/Metric types, no master arrays
- Facts import from `lib/` (time, format, constants) but never touch DOM/SolidJS
- Params exported separately as `Record<string, ParamDef>` — canvas wires them to sections
- Canvas composes facts using JSX `<Section facts={[TotalBeats, BeatsPerDay]} params={heartbeatParams} />`

Key insight: facts should be dead simple. Module-scope computation was rejected because it evaluates once at import time, breaking `live: true` facts that need to update every second.

### Canvas as JSX (not config array)
Canvas is a JSX component, not a config array → renderer indirection. The JSX IS the layout. Two canvases:
- `/` → `Demo.tsx` — canonical birthday card with all 6 sections
- `/dev` → `Dev.tsx` — sandbox with subset of facts for experimentation
- Pathname routing in `index.tsx` — no router library

### Section-Local Params
Params (like BPM, sleep hours) are local to each `<Section>` — not in the global store. This eliminates: global param store, registration, conflict resolution, cross-section naming collisions. Each Section creates its own signals, persists to `localStorage` under `happy-metrics.params.{SectionName}`.

### Minimal Store
Store shrank from managing all settings/params to just: `now`, `dob`, `name`, `gender`, `textOverrides`. All slider state moved to Section-local signals.

### Content-Editable
Static text (hero title, section titles) wrapped in `Editable` widget. On blur, saves override to localStorage. On reset, reverts to computed default. Live numbers are NOT editable.

### DOB Parsing
`new Date("2017-02-19")` parses as UTC midnight, showing Feb 18 in US timezones. Fixed by appending `T00:00:00` to parse as local time: `new Date(dob + 'T00:00:00')`.

### SolidJS Gotcha: Dynamic Tags
SolidJS compiles JSX at build time. `const Tag = 'span'; <Tag>` doesn't work — it tries to call `Tag` as a component function. Must use `<Dynamic component={Tag}>` from `solid-js/web` or just use the concrete tag directly.

## File Map

| File | Purpose |
|------|---------|
| `src/index.tsx` | Entry point, URL param parsing, pathname routing |
| `src/canvas/Demo.tsx` | Canonical birthday card canvas (served at /) |
| `src/canvas/Dev.tsx` | Sandbox canvas (served at /dev) |
| `src/canvas/Section.tsx` | Renders fact cards, manages local param state |
| `src/canvas/Prose.tsx` | Renders fact prose sentences with tap-for-math |
| `src/canvas/store.ts` | Timer (now), dob, name, gender, textOverrides |
| `src/models/time-alive.ts` | 7 fact functions (Years → Seconds) |
| `src/models/sleep.ts` | 3 fact functions + sleepHours param |
| `src/models/heartbeats.ts` | 3 fact functions + bpm param |
| `src/models/steps.ts` | 4 fact functions + 3 params |
| `src/models/space.ts` | 5 fact functions |
| `src/models/fun-facts.ts` | 5 fact functions (blinks, breaths, meals, poops, hair) |
| `src/widgets/FlipCard.tsx` | 3D flip card: value, math, settings faces |
| `src/widgets/Editable.tsx` | contentEditable wrapper |
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

## URL Parameters
- `?name=Alice` — display name
- `?dob=2017-02-19` — date of birth (YYYY-MM-DD)
- `?gender=boy` — boy, girl, neutral (default: neutral)
- `?theme=minimalist` — override default cyberpunk theme

## Running
- `bun run dev` — dev server on :3000
- `bun run build` — production build to dist/
- `bun test` — 57 tests (lib + models)

## Bundle Size
- JS: ~45.2KB (gzip: ~15.2KB)
- CSS: ~3.0KB (gzip: ~1.1KB)

## Deferred
- **CSS/theming** — not yet refined, will iterate
- **Cross-section param sharing** — params are local to Section; can promote to store later if needed
- **Hero widget** — hero is inline in Demo.tsx, could be extracted to a widget
- **Divider widget** — not yet implemented
