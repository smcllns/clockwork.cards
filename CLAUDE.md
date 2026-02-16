# Clockwork Cards

Digital birthday card for a specific kid. Live-updating stats about time alive, heartbeats, steps, sleep, space travel — designed for kids who love numbers.

## Philosophy
- **Small working code.** Every change should leave the app running.
- **Incremental.** Build the simplest thing, see it work, then add.
- **No premature abstraction.** One card first. Card builder comes later.

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
├── index.tsx       # App shell, page chrome, mode state
├── index.css       # Tailwind + scroll snap + responsive overrides
├── theme.css       # CSS custom properties (light + shiny themes)
├── footer.tsx      # Copyright
├── hero/           # 3D physics birthday text (Three.js + Rapier)
│   ├── index.tsx   # Pure scene component (name, dob, mode props)
│   ├── scene.ts    # Three.js + Rapier setup, animation loop, modes
│   ├── font.ts     # 5×7 bitmap font engine
│   ├── colors.ts   # Light + neon palettes
│   └── shared.ts   # Layout specs, shared types
└── cards/          # Stat card slides
    ├── index.tsx   # 6 full-viewport slides, local config/tick state
    ├── controls.tsx # Inline steppers, sliders, pills
    ├── stats.ts    # Pure computation: DOB + config → all metrics
    └── stats.test.ts
```

## Architecture Notes
- `index.tsx` owns page-level state (hero mode, shiny/chaos toggles). Cards own their own config state locally.
- Hero is a pure component — receives `{ name, dob, mode }`, renders a canvas, no UI chrome.
- `.llm/` is gitignored (plans, config, learnings stay local). Notes moved to `docs/`.
- Screenshots saved to `screenshots/` (gitignored).
