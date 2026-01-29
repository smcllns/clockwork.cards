# OpenCode Agent Guide

This repo is a small, front-end-only SolidJS app. The goal is to move fast without breaking the live, time-based metrics and 3D card interactions. Read this file first, then skim `CLAUDE.md` and `.llm/notes/` before touching code.

## What This App Is
An interactive birthday metrics page that computes "time alive" stats (heartbeats, sleep, steps, space travel) and renders them as 3D flip cards. The math is centralized; the UI is mostly presentational with a few sliders and toggles.

## System Sketch
```
query params + config
  `src/index.tsx` (URL params)
  `src/App.tsx` (theme + layout)
         |
         v
metrics math
  `src/utils/metrics.ts`
  `src/utils/format.ts`
         |
         v
visually rich UI
  `src/sections/*` (cards grouped by topic)
  `src/components/*` (StatCard, Slider, ThemeToggle, Confetti)
  `src/styles/themes.css` (themes + animations)
```

## Stack + How It Works
- SolidJS + Vite + Bun; vanilla CSS for theming.
- Live updates: timers on mount, cleaned up on unmount.
- Theming: CSS custom properties on `:root` and `.theme-minimalist`.
- Cards: 3 faces (front/math/settings) with 3D transforms.

## Project Map (Start Here)
- `src/index.tsx`: entry point, URL params.
- `src/App.tsx`: theme state + layout.
- `src/components/StatCard.tsx`: 3D flip card (front/math/settings faces).
- `src/components/Slider.tsx`: custom range input.
- `src/components/ThemeToggle.tsx`: theme switch.
- `src/components/Confetti.tsx`: celebration particles.
- `src/sections/*`: each section is a group of cards.
- `src/utils/metrics.ts`: all birthday math (single source of truth).
- `src/utils/format.ts`: number formatting.
- `src/styles/themes.css`: theme variables + animations.

## Commands
- `bun run dev`
- `bun run build`

## Working Principles
- Prefer the simplest change that satisfies the ask. This app is small; avoid extra abstractions.
- Keep all calculations in `src/utils/metrics.ts`. Components should consume, not derive.
- Use SolidJS signals correctly (callable functions, not values).
- Avoid defensive try/catch or silent fallbacks for invalid data; fail loudly.
- Keep CSS in `src/styles/themes.css` and component-specific styles inline if needed.

## Common Tasks
### Add a new metric card
1. Add a calc in `src/utils/metrics.ts`.
2. Add a card in the relevant `src/sections/*.tsx` file.
3. Format numbers with helpers from `src/utils/format.ts`.
4. If it needs a slider, use `src/components/Slider.tsx` and keep state in the section.

### Add a new theme or tune existing theme
1. Extend CSS variables in `src/styles/themes.css`.
2. Ensure the toggle logic in `src/App.tsx` still maps to a single class.

## Testing Expectations
- No automated tests today. Always run `bun run build` before handing off.
- Manually sanity-check: time-alive counts tick, flip cards work, sliders update math, theme toggle applies variables.
- If you add tests or mocks later, read `src/testing-anti-patterns.md` first.
- Prefer high-value behavior tests that should survive refactors; add opportunistically when touching related code.

## Current Context
- This repo is a SolidJS rewrite; see `.llm/notes/solidjs-rewrite.md` and `.llm/plans/2026-01-28-solidjs-rewrite.md`.
- Remaining known TODO: manual browser QA (3D flips, glow effects, mobile scroll, confetti).

## When You Need More Context
- Read `CLAUDE.md` for high-level architecture and patterns.
- Skim `.llm/notes/` for prior decisions and tradeoffs.
- If you must change foundational behavior, note it in `.llm/notes/`.
