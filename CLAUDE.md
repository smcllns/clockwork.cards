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
- `bun run build` — production build to `dist/`
- `bun run deploy` — build + deploy to Cloudflare Pages
- `bun test` — run tests (37 tests, stats computation + formatting)

## URL Parameters
- `?name=Oscar` — display name
- `?dob=2017-02-20` — date of birth, YYYY-MM-DD

Defaults live in `.env` as `DEFAULT_NAME`, `DEFAULT_DOB`, `DEFAULT_SEX`. Bun inlines `process.env.DEFAULT_*` at build time via `bunfig.toml` `env` config.

## Project Structure
```
src/
├── index.tsx            # App shell — all sections listed here in scroll order
├── index.css            # Tailwind + scroll snap + responsive overrides
├── theme.css            # CSS custom properties (light + shiny themes)
├── stats.ts             # Pure computation: DOB + config → all metrics
├── stats.test.ts
├── sections/            # Page sections, in scroll order
│   ├── nav.tsx          # Fixed nav bar with cyberpunk toggle
│   ├── hero-cyberpunk/  # 3D physics birthday text (Three.js + Rapier)
│   │   ├── index.tsx    # HeroCyberpunk component (name, dob, shiny props, owns chaos)
│   │   ├── scene.ts     # Three.js + Rapier setup, animation loop, modes
│   │   ├── font.ts      # 5×7 bitmap font engine
│   │   ├── colors.ts    # Light + neon palettes
│   │   └── shared.ts    # Layout specs, shared types
│   ├── time.tsx         # Time card (dropdown selector, single value)
│   ├── time-table.tsx   # Time card (table of all units)
│   ├── space.tsx        # Space travel card (miles/km toggle)
│   ├── remaining.tsx    # Yogurt, life-in-numbers, brain & body, binary (not yet extracted)
│   └── footer.tsx       # Copyright
└── components/          # Shared primitives used by sections
    ├── slide.tsx        # Slide, KeyMetric, Title, Headline, Body, Unit, N, IdTag, css
    ├── controls.tsx     # InlinePills, InlineDropdown, InlineStepper, InlineSlider, Block*
    └── useNow.ts        # 1-second tick hook for live-updating values
```

## Architecture Notes
- `index.tsx` owns only `shiny` state. Each section is self-contained and owns its own state.
- HeroCyberpunk owns chaos state internally — it's specific to cyberpunk theme.
- Extracted sections (time, space) do their own math inline — no shared compute functions. `stats.ts` still used by `remaining.tsx` until those sections are extracted.
- Shared layout primitives: `Slide` wraps a full-viewport snap section; `Title`, `Headline`, `Body`, `Unit`, `KeyMetric` are text elements within it.
- No barrel files. Import directly: `from "../components/slide"`, `from "../components/controls"`.
- `.llm/` is gitignored (plans, config, learnings stay local). Notes moved to `docs/`.
- Screenshots saved to `screenshots/` (gitignored).
