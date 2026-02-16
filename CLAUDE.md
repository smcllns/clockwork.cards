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
- **Zustand** — state (when needed)

## Commands
- `bun run dev` — dev server on :3000 with HMR
- `bun run build` — production build to `dist/`
- `bun run deploy` — build + deploy to Cloudflare Pages

## URL Parameters
- `?name=Oscar` — display name (default from env: "Birthday Star")
- `?dob=2017-02-20` — date of birth, YYYY-MM-DD (default from env)
- `?sex=m` — m, f, or neutral (default from env: neutral)

Defaults live in `.env` as `DEFAULT_NAME`, `DEFAULT_DOB`, `DEFAULT_SEX`. Bun inlines `process.env.DEFAULT_*` at build time via `bunfig.toml` `env` config.

## Project Structure
```
index.html          # Entry point (Bun serves this directly)
bunfig.toml         # Bun config (Tailwind plugin, env inlining)
.env                # Default URL param values (gitignored)
src/
├── index.tsx        # App entry, URL param parsing, render
├── index.css        # Tailwind import + custom styles
└── (components added incrementally)
```

## Current Milestone: First Card MVP
Hero banner (name, age) + 3-5 live-updating stat cards. Minimal/clean design — white space, typography-focused, let the numbers speak. Built for a real kid's birthday with real DOB.

## Design Direction
Minimal and clean. No dark themes or heavy decoration. Typography and numbers are the star. Color used sparingly for emphasis.

## Screenshots
Save all screenshots to `screenshots/`. Keep them out of the repo root.
