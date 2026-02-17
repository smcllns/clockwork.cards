# Clockwork Cards

Digital birthday card for a specific kid. Live-updating stats about time alive, heartbeats, steps, sleep, space travel — designed for kids who love numbers.

## Philosophy
- **Small working code.** Every change should leave the app running.
- **Incremental.** Build the simplest thing, see it work, then add.
- **No premature abstraction.** One card first. Card builder comes later.
- **Flat and obvious.** Each section is self-contained with inline math. No compute functions, no formatter indirection — just `.toFixed()` and `.toLocaleString()` where you use them.

## Stack
- **Bun** — runtime, bundler, dev server, package manager
- **React 19** — UI
- **Tailwind v4** — styling via `bun-plugin-tailwind`
- **Zustand 5** — state (installed, not yet used — local state sufficient so far)
- **Three.js + Rapier** — 3D physics hero

## Commands
- `bun run dev` — dev server on :3000 with HMR
- `bun run build` — `tsc && bun run build.ts`, production build to `dist/`
- `bun run deploy` — build + deploy to Cloudflare Pages

## URL Parameters
- `?name=Oscar` — display name
- `?dob=2017-02-20` — date of birth, YYYY-MM-DD

Defaults live in `.env` as `DEFAULT_NAME`, `DEFAULT_DOB`, `DEFAULT_SEX`. Bun inlines `process.env.DEFAULT_*` at build time via `bunfig.toml` `env` config.

## Project Structure
```
src/
├── index.tsx              # App shell — all sections listed here in scroll order
├── index.css              # Tailwind + scroll snap + responsive overrides
├── theme.css              # CSS custom properties (light + shiny themes)
├── constants.ts           # System constants (time, space, body, food)
├── utils.ts               # Shared utilities (getAge, daysSinceAge)
├── cards/                 # Self-contained card components
│   ├── hero-cyberpunk/    # 3D physics birthday text (Three.js + Rapier)
│   │   ├── index.tsx      # HeroCyberpunk component (name, dob, shiny props, owns chaos)
│   │   ├── scene.ts       # Three.js + Rapier setup, animation loop, modes
│   │   ├── font.ts        # 5×7 bitmap font engine
│   │   ├── colors.ts      # Light + neon palettes
│   │   └── shared.ts      # Layout specs, shared types
│   ├── slide-time.tsx     # Time card (dropdown selector, single value)
│   ├── slide-time-table.tsx # Time card (table of all units)
│   ├── slide-space.tsx    # Space travel card (miles/km toggle)
│   ├── slide-yogurt.tsx   # Yogurt consumption (slider + stepper)
│   ├── slide-steps.tsx    # Steps walked (slider + stepper)
│   ├── slide-brushing.tsx # Teeth brushing + blinks
│   ├── slide-poops.tsx    # Lifetime poops
│   └── tile-*.tsx         # Bento grid tiles (sleep, heartbeats, fruit, hugs, lungs, water)
└── components/            # Shared primitives used by cards
    ├── slide.tsx          # Slide, KeyMetric, Headline, Body, Narrative, N, IdTag, css
    ├── tile.tsx           # TileContainer, Tile (bento grid with span-based layout)
    ├── section.tsx        # Section wrapper (snap alignment + background)
    ├── controls.tsx       # InlinePills, InlineDropdown, InlineStepper, InlineSlider
    ├── nav.tsx            # Fixed nav bar with cyberpunk toggle
    ├── footer.tsx         # Copyright
    └── useNow.ts          # 1-second tick hook for live-updating values
```

## Architecture Notes
- `index.tsx` owns only `shiny` state. Each card is self-contained and owns its own state.
- HeroCyberpunk owns chaos state internally — it's specific to cyberpunk theme.
- All cards do their own math inline — no shared compute functions. `constants.ts` has physical/biological constants, `utils.ts` has age calculation helpers.
- Three layout patterns: KeyMetric cards (slide-time, slide-space, slide-yogurt), Narrative cards (slide-steps, slide-brushing, slide-poops), and Tile grids (tile-*).
- No barrel files. Import directly: `from "../components/slide"`, `from "../components/controls"`.
- `.llm/` is gitignored (plans, config, learnings stay local).
- Screenshots saved to `screenshots/` (gitignored).
