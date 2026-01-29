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

### Component Design
- All SolidJS components use `createSignal` for reactive state
- `onMount` + `onCleanup` pattern for intervals (replaces React's `useEffect`)
- Signals are functions (`value()` not `value`) - this is how SolidJS works
- No re-renders - signals update only the DOM nodes that depend on them

## File Map

| File | Purpose |
|------|---------|
| `src/index.tsx` | Entry point, URL param parsing |
| `src/App.tsx` | Root component, theme state, layout |
| `src/components/StatCard.tsx` | 3D flip card (front/math/settings faces) |
| `src/components/Slider.tsx` | Custom range input (no Radix dependency) |
| `src/components/ThemeToggle.tsx` | Cyberpunk ↔ Minimalist toggle |
| `src/components/Confetti.tsx` | Celebration particles using CSS vars |
| `src/sections/Hero.tsx` | Name, birthday countdown |
| `src/sections/TimeAlive.tsx` | Years/months/weeks/days/hours/min/sec |
| `src/sections/Sleep.tsx` | Sleep hours/days/years with adjustable hours |
| `src/sections/Heartbeats.tsx` | Heart beats with adjustable BPM |
| `src/sections/Steps.tsx` | Steps/feet/miles with 3 sliders |
| `src/sections/Space.tsx` | Orbits, rotation, galaxy travel |
| `src/sections/FunFacts.tsx` | Sentence-form summaries (NEW) |
| `src/utils/metrics.ts` | All birthday calculations |
| `src/utils/format.ts` | Number formatting (compact, locale) |
| `src/styles/themes.css` | 2 themes, animations, utilities |

## Key Differences from Original

1. **2 themes** (was 5): cyberpunk (default), minimalist
2. **No Tailwind** - vanilla CSS with custom properties
3. **No React** - SolidJS signals for reactivity
4. **No Radix UI** - custom Slider component
5. **New FunFacts section** with tap-to-reveal math
6. **50KB JS bundle** (was 200KB+ with React + Next.js + Radix)
7. **Bun** for package management, Vite for dev/build

## URL Parameters
- `?name=Alice` - display name
- `?dob=2017-02-19` - date of birth (YYYY-MM-DD)
- `?theme=minimalist` - override default cyberpunk theme

## Running
- `bun run dev` - dev server on :3000
- `bun run build` - production build to dist/

## Remaining Items
- Need manual visual testing of: 3D card flips, glow effects, mobile scroll, confetti
