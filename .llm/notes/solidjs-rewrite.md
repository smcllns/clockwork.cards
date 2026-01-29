# SolidJS Rewrite Notes

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

### Config-Driven Architecture (v2)
After the initial rewrite, sections were converted from bespoke components to a central config system:
- `MetricConfig` defines value, math steps, prose, accent, format
- `SectionConfig` groups metrics with shared settings (sliders)
- One `MetricContext` arg passed to all config functions
- One timer in App via `store.ts`, not per-section
- Math rendered from `MathStep[]` data, not per-card JSX

This means adding/removing/reordering metrics = editing config arrays, not writing components.

### Content-Editable
Static text (hero title, section titles) wrapped in `Editable` component. On blur, saves override to localStorage. On reset, reverts to computed default. Live numbers are NOT editable.

### DOB Parsing
`new Date("2017-02-19")` parses as UTC midnight, showing Feb 18 in US timezones. Fixed by appending `T00:00:00` to parse as local time: `new Date(dob + 'T00:00:00')`.

### SolidJS Gotcha: Dynamic Tags
SolidJS compiles JSX at build time. `const Tag = 'span'; <Tag>` doesn't work — it tries to call `Tag` as a component function. Must use `<Dynamic component={Tag}>` from `solid-js/web` or just use the concrete tag directly.

## File Map

| File | Purpose |
|------|---------|
| `src/index.tsx` | Entry point, URL param parsing |
| `src/App.tsx` | Root component, theme, hero, section loop |
| `src/types.ts` | MetricConfig, SectionConfig, MetricContext, MathStep |
| `src/store.ts` | Single timer, settings signals, localStorage, context |
| `src/metrics/index.ts` | ALL_SECTIONS master list |
| `src/metrics/time-alive.ts` | 7 MetricConfigs |
| `src/metrics/sleep.ts` | 3 MetricConfigs + sleepHours slider |
| `src/metrics/heartbeats.ts` | 3 MetricConfigs + bpm slider |
| `src/metrics/steps.ts` | 4 MetricConfigs + 3 sliders |
| `src/metrics/space.ts` | 5 MetricConfigs |
| `src/metrics/fun-facts.ts` | 5 prose-only MetricConfigs (blinks, breaths, meals, poop, hair) |
| `src/components/WidgetCard.tsx` | 3D flip card consuming MetricConfig |
| `src/components/Prose.tsx` | Sentence rendering with tap-for-math |
| `src/components/Section.tsx` | Renders SectionConfig (header + cards + prose) |
| `src/components/Editable.tsx` | contentEditable wrapper with localStorage |
| `src/components/Slider.tsx` | Custom range input |
| `src/components/ThemeToggle.tsx` | Cyberpunk ↔ Minimalist toggle |
| `src/components/Confetti.tsx` | Celebration particles |
| `src/utils/metrics.ts` | All birthday calculations |
| `src/utils/format.ts` | Number formatting (compact, locale) |
| `src/utils/words.ts` | numberToWord() for hero |
| `src/styles/themes.css` | 2 themes, animations, utilities |

## URL Parameters
- `?name=Alice` - display name
- `?dob=2017-02-19` - date of birth (YYYY-MM-DD)
- `?theme=minimalist` - override default cyberpunk theme

## Running
- `bun run dev` - dev server on :3000
- `bun run build` - production build to dist/

## Bundle Size
- JS: ~46.5KB (gzip: ~15.4KB)
- CSS: ~3KB (gzip: ~1.1KB)
