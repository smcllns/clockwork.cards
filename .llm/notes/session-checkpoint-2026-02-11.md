# Session Checkpoint — 2026-02-11

## What happened
- Reset repo to clean slate: Bun HTML entry point, React 19, Tailwind v4, Zustand
- `bun run dev` = `bun ./index.html` (Bun serves HTML directly with HMR, Tailwind via bun-plugin-tailwind)
- `.env` has DEFAULT_NAME=Oscar, DEFAULT_DOB=2017-02-20, DEFAULT_SEX=m (inlined via bunfig.toml `env = "DEFAULT_*"`)
- Built layout: Hero (100dvh) → Main+Footer (100dvh flex column)
- Created `SPEC.md` (root) and per-component `src/{hero,main,footer}/SPEC.md`
- Built all three components: Hero (matter.js), Main (3 flip cards), Footer (shiny toggle + themes)
- Worktrees used for parallel dev, merged back to `creatable` branch

## Current state on `creatable` branch
- **Hero:** matter.js shapes render, "do not press" button shows. Physics chaos bug JUST FIXED (walls were falling too). Design needs work — Sam said "not quite the right design I had in mind." Need to revisit the visual concept.
- **Main:** 3 flip cards (Age, Sun Distance, Heartbeats) with toggle units and flip-to-math. Good start, parked.
- **Footer:** Shiny toggle + light/cyberpunk CSS themes. Good start, needs checking — some gaps in cyberpunk styles.

## Next steps (from Sam)
1. **Hero: go deep, get this right first.** Current random scatter of shapes isn't the design Sam wanted. Need to discuss what he envisions.
2. Main: parked for now.
3. Footer: check cyberpunk styles when applied, some gaps.

## Key learnings this session
- Bun dev server has HMR. Don't pkill/restart it between edits.
- Subagents can't get tool permissions (Read, Bash) — dispatch failed 3 times. Build directly instead.
- Use `dvh` not `vh` for mobile browser chrome handling.
- `bun-plugin-tailwind` in bunfig.toml handles Tailwind v4 with zero config.

## Worktrees
Three worktrees exist at `clockwork.cards-{hero,main,footer}` — can be cleaned up with `git worktree remove`.

## Dev server
`bun run dev` on port 3000 (user runs it). Claude can start on other ports if needed.
