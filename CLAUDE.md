# Happy Metrics

Interactive birthday metrics app. Shows live-updating stats about time alive, heartbeats, steps, sleep, and space travel with 3D flip cards that reveal the math. Prose sentences below each section. Content-editable static text with localStorage persistence.

## Stack
- **SolidJS** — UI (signals, no virtual DOM)
- **Vite** — dev server + build
- **Bun** — package manager
- **Vanilla CSS** — custom properties for theming

## Commands
- `bun run dev` — dev server on :3000
- `bun run build` — production build to `dist/`

## URL Parameters
- `?name=Alice` — display name (default: "Birthday Star")
- `?dob=2017-02-19` — date of birth, YYYY-MM-DD (default: 2017-02-20)
- `?theme=minimalist` — override default cyberpunk theme

## Project Structure
```
src/
├── index.tsx              # Entry point, URL param parsing
├── App.tsx                # Root component, hero, theme, section loop
├── types.ts               # MetricConfig, SectionConfig, MetricContext, MathStep
├── store.ts               # Single timer, settings signals, localStorage, context
├── components/
│   ├── WidgetCard.tsx      # 3D flip card consuming MetricConfig
│   ├── Prose.tsx           # Sentence rendering with tap-for-math
│   ├── Section.tsx         # Renders SectionConfig (header + cards + prose)
│   ├── Editable.tsx        # contentEditable wrapper with localStorage
│   ├── Slider.tsx          # Custom range input
│   ├── ThemeToggle.tsx     # Cyberpunk ↔ Minimalist toggle
│   └── Confetti.tsx        # Celebration particles
├── metrics/               # Config-driven metric definitions
│   ├── index.ts            # ALL_SECTIONS master list
│   ├── time-alive.ts       # 7 MetricConfigs
│   ├── sleep.ts            # 3 MetricConfigs + sleepHours slider
│   ├── heartbeats.ts       # 3 MetricConfigs + bpm slider
│   ├── steps.ts            # 4 MetricConfigs + 3 sliders
│   ├── space.ts            # 5 MetricConfigs
│   └── fun-facts.ts        # 5 prose-only MetricConfigs
├── utils/
│   ├── metrics.ts          # All birthday math
│   ├── format.ts           # Number formatting
│   └── words.ts            # numberToWord() for hero
└── styles/
    └── themes.css          # 2 themes (cyberpunk default, minimalist), animations
```

## Key Patterns

### Config-Driven Metrics
Metrics are defined as data in `src/metrics/*.ts`, not as bespoke components. Each `MetricConfig` declares its value function, math steps, prose text, accent color, and format. `SectionConfig` groups metrics and declares shared slider settings. Adding/removing metrics = editing arrays.

### Single Timer
One `setInterval` in `store.ts` updates `now` every 1s. All sections read from the same context — no per-section intervals.

### Math as Data
`MathStep[]` array instead of per-card JSX. One renderer (`WidgetCard`) for all math faces.

### Section Modes
- `cards` — grid of WidgetCards only
- `prose` — sentence list only (fun-facts)
- `mixed` — cards + prose below (default)

### Theming
CSS custom properties on `:root` (cyberpunk) and `.theme-minimalist`. Toggle applies/removes the class and updates URL via `history.replaceState`.

### Content-Editable
`Editable` component wraps static text (hero title, section titles). On blur, saves to localStorage. "Reset all customizations" button in footer clears localStorage.

### localStorage
Single key `happy-metrics` stores `{ settings, textOverrides }`. Settings persist slider values. Text overrides persist edited labels.

## Notes
See `.llm/notes/` for architecture decisions and context.
