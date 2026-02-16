# Session Checkpoint — 2026-02-11 (updated session 2)

## What happened (session 2)
- Merged `creatable` → `main`, now working on main directly
- Built hero text-as-physics-shapes: pixel font (5x7 bitmap) spells "HAPPY 8TH BIRTHDAY OSCAR"
- Explored 4 approaches (A-D), settled on C and D
- Added Three.js + Rapier for 3D approach (D)
- Shared `font.ts` with bitmap font A-Z + 0-9, layout engine, ordinal suffix
- Multi-grab with touch/scroll coexistence

## Current state on `main`
- **D (Three.js + Rapier):** Default. 3D block letters, spring-anchored, fall on chaos, draggable. Walls match viewport frustum.
- **C (Matter.js):** 2D constraint clusters with anchors. Circles scatter on chaos.
- **Switcher:** `?hero=d` (default) or `?hero=c`. Dev nav links in both.
- **Main:** 3 flip cards — parked.
- **Footer:** Shiny toggle + themes — parked.
- **⚠️ Uncommitted:** All hero work needs a commit.

## Key decisions
- Pixel font over SVG/vertex letter shapes — simpler, no poly-decomp
- Velocity-based grab (setLinvel) over force-based — stable, no accumulation
- canSleep(false) on Rapier bodies to prevent wall sticking
- Walls from camera frustum, not text bounds

## Files added/modified this session
- `src/hero/font.ts` — bitmap font, layout, ordinal suffix
- `src/hero/approach-c.tsx` — Matter.js constraint clusters
- `src/hero/approach-d.tsx` — Three.js + Rapier 3D letters
- `src/hero/multi-grab.ts` — shared multi-grab for Matter.js
- `src/hero/index.tsx` — switcher for C/D
- `src/index.tsx` — parses `?hero=` URL param
- `package.json` — added three, @dimforge/rapier3d-compat, @types/three

## Next steps
1. Hero D: tweak colors, geometry, materials/style
2. Hero C: may evolve or get dropped
3. Main/Footer: parked
