# OpenCode Agent Guide

This repo is a small, front-end-only SolidJS app. The goal is to move fast without breaking the live, time-based metrics and 3D card interactions. Read this file first, then skim `CLAUDE.md` and `.llm/notes/` before touching code.

## What This App Is
An interactive birthday metrics page that computes "time alive" stats (heartbeats, sleep, steps, space travel) and renders them as 3D flip cards plus prose summaries. The math is centralized; the UI is config-driven with sliders and editable labels.

## System Sketch
```
query params + config
  `src/index.tsx` (URL params)
  `src/App.tsx` (theme + hero + section loop)
         |
         v
metrics math
  `src/metrics/*` (MetricConfig + SectionConfig)
  `src/utils/metrics.ts` (birthday calculations)
  `src/utils/format.ts` (format helpers)
  `src/store.ts` (single timer + settings)
         |
         v
visually rich UI
  `src/components/*` (WidgetCard, Section, Prose, Editable, Slider)
  `src/styles/themes.css` (themes + animations)
```

## Stack + How It Works
- SolidJS + Vite + Bun; vanilla CSS for theming.
- Live updates: single timer in `src/store.ts` shared by all metrics.
- Theming: CSS custom properties on `:root` and `.theme-minimalist`.
- Cards: 3 faces (front/math/settings) with 3D transforms.
- Sections: config-driven; prose mode for sentence-only sections.

## Project Map (Start Here)
- `src/index.tsx`: entry point, URL params.
- `src/App.tsx`: theme state + hero + section loop.
- `src/types.ts`: MetricConfig, SectionConfig, MetricContext, MathStep.
- `src/store.ts`: single timer, settings signals, localStorage.
- `src/components/WidgetCard.tsx`: 3D flip card consuming MetricConfig.
- `src/components/Section.tsx`: renders SectionConfig (cards + prose).
- `src/components/Prose.tsx`: sentence rendering with tap-for-math.
- `src/components/Editable.tsx`: contentEditable with localStorage.
- `src/components/Slider.tsx`: custom range input.
- `src/components/ThemeToggle.tsx`: theme switch.
- `src/components/Confetti.tsx`: celebration particles.
- `src/metrics/*`: config-driven metric definitions per section.
- `src/utils/metrics.ts`: all birthday math (single source of truth).
- `src/utils/format.ts`: number formatting.
- `src/utils/words.ts`: number-to-word helper for hero.
- `src/styles/themes.css`: theme variables + animations.

## Commands
- `bun run dev`
- `bun run build`

## Working Principles
- Prefer the simplest change that satisfies the ask. This app is small; avoid extra abstractions.
- Keep calculations in `src/utils/metrics.ts`. Components should consume, not derive.
- Keep metric definitions in `src/metrics/*` (config, not bespoke components).
- Use SolidJS signals correctly (callable functions, not values).
- Avoid defensive try/catch or silent fallbacks for invalid data; fail loudly.
- Keep CSS in `src/styles/themes.css` and component-specific styles inline if needed.

## Common Tasks
### Add a new metric card
1. Add a calc in `src/utils/metrics.ts` if needed.
2. Add a `MetricConfig` in the relevant `src/metrics/*.ts` file.
3. Update `src/metrics/index.ts` if a new section is added.
4. Format numbers with helpers from `src/utils/format.ts`.
5. If it needs a slider, define it on the `SectionConfig` and store state in `src/store.ts`.

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
