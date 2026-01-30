# Happy Metrics

Interactive birthday metrics app. Shows live-updating stats about time alive, heartbeats, steps, sleep, and space travel with 3D flip cards that reveal the math.

## Stack
- **SolidJS** — UI (signals, no virtual DOM)
- **Vite** — dev server + build
- **Bun** — package manager + native test runner (`bun test`)
- **Vanilla CSS** — custom properties for theming

## Commands
- `bun run dev` — dev server on :3000
- `bun run build` — production build to `dist/`
- `bun test` — run all tests (lib + models)

## URL Parameters
- `?name=Alice` — display name (default: "Birthday Star")
- `?dob=2017-02-19` — date of birth, YYYY-MM-DD (default: 16 years ago from today)
- `?gender=boy` — gender for pronouns: boy, girl, neutral (default: neutral)
- `?theme=minimalist` — override default cyberpunk theme

## Routes
- `/` — Demo canvas (canonical birthday card)
- `/dev` — Dev canvas (sandbox for experimentation)

## Project Structure
```
src/
├── canvas/           # Page layouts
│   ├── Demo.tsx       # Canonical birthday card (served at /)
│   ├── Dev.tsx        # Sandbox for experimentation (served at /dev)
│   ├── Section.tsx    # Renders fact cards + section-level param sliders
│   ├── Prose.tsx      # Renders fact prose sentences
│   └── store.ts       # Timer (now), dob, name, gender
│
├── widgets/          # UI renderers
│   ├── FlipCard.tsx   # 3D flip card: value + math faces
│   ├── Slider.tsx     # Range input
│   ├── ThemeToggle.tsx
│   └── Confetti.tsx
│
├── models/           # Fact functions + params
│   ├── time-alive.ts  # Years, Months, Weeks, Days, Hours, Minutes, Seconds
│   ├── sleep.ts       # TotalHoursSlept, DaysSpentSleeping, YearsAsleep + params
│   ├── heartbeats.ts  # TotalBeats, BeatsPerDay, MillionsOfBeats + params
│   ├── steps.ts       # TotalSteps, TotalFeet, MilesWalked, DistanceComparison + params
│   ├── space.ts       # TripsAroundSun, MilesFromRotation, MilesAroundSun, MoonTrips, ThroughTheGalaxy
│   └── fun-facts.ts   # Blinks, Breaths, Meals, Poops, HairGrowth
│
├── themes/           # CSS (not yet refined)
│   ├── cyberpunk.css
│   └── minimalist.css
│
├── lib/              # Standard library for fact authors
│   ├── types.ts       # FactFn, FactData, FactContext, ParamDef, MathStep
│   ├── time.ts        # getTimeAlive, getAge, birthday helpers, diff helpers
│   ├── format.ts      # formatNumber, formatCompact, numberToWord, formatDate
│   └── constants.ts   # Space speeds, distance comparisons
│
├── index.tsx          # Entry point, URL param parsing, pathname routing
└── index.css          # Animations, utility classes, layout helpers
```

## Key Patterns

### Facts as Pure Functions
Each fact is a `FactFn = (ctx: FactContext) => FactData`. No DOM, no SolidJS, no side effects. Receives context (including param values), returns data.

### Canvas as JSX
Each canvas is a JSX component that composes `<Section>`, `<Prose>`, etc. The JSX IS the layout.

### Section-Local Params
Each `<Section>` manages its own param signals. Params displayed as inline values with a gear icon to toggle edit mode (sliders). Persisted to localStorage (`happy-metrics.params.{SectionName}`).

### Minimal Store
Just runtime context: `now` (1s timer), `dob`, `name`, `gender`.

### SolidJS: `<Index>` for Reactive Lists
Section and Prose use `<Index>` (not `<For>`) because fact data recomputes every tick. `<Index>` keys by position (stable DOM), `<For>` keys by reference (new objects = DOM recreation = animation resets).

### Math as Data
`MathStep[]` array rendered by FlipCard. One renderer for all math faces.

### Theming
CSS custom properties on `:root` (cyberpunk) and `.theme-minimalist`. Toggle applies/removes the class and updates URL via `history.replaceState`.

## Notes
See `.llm/notes/` for architecture decisions and context.
