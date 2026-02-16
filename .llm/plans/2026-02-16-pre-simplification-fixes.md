# Pre-Simplification Fixes

Before the big V11-only simplification, fix 6 small issues.

## Tasks

- [x] 1. Fix drag freeze bug — moved mousemove/touchmove to window (not canvas), renamed spin state to `spinActive`, bound pointerup to window. Spin only applies when not grabbing balls.
- [x] 2. CSS scroll-snap — `scroll-snap-type: y proximity` on html, `.snap-section` class on hero + all content sections. `min-height: 100dvh` on sections.
- [x] 3. Full-width backgrounds — removed `max-w-[1024px]` from App wrapper. Sections now span full width, content stays centered via internal max-w constraints. Removed hero breakout hack.
- [x] 4. Brain & Body cyberpunk glow — stronger neon-pulse (inset glow, higher opacity), brighter glow-border, gradient card background in shiny mode.
- [x] 5. Life in Numbers styling — N component now uses `--text-primary` (white in shiny, dark in light). Inputs keep `--text-accent` (cyan/green).
- [x] 6. Binary flip card — single card with CSS 3D flip (`perspective`, `rotateY(180deg)`, `backface-visibility: hidden`). "Base 2 — tap to flip" / "Base 10 — tap to flip" labels.

## Next: Merge to main, then simplification.
