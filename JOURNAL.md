# Development Journal

## 08:03 — App shell and all cards complete
Built the complete app structure except for the hero. All slide cards (time, space, yogurt, steps, brushing, poops, time-table) and tile cards (sleep, heartbeats, fruit, hugs, lungs, water) are implemented and type-checking passes. The spec was very clear on component hierarchy and data flow - each card owns its state and does math inline as specified. One minor issue: IdTag was defined in section.tsx but needed in slide.tsx, so I re-exported it from slide.tsx for convenience. Next: building the complex 3D physics hero.

## 08:06 — Hero 3D physics scene complete
Implemented the complete hero with Three.js + Rapier physics. Built 5x7 bitmap font system, color palettes (light/shiny), spring-anchored balls with velocity steering, scene rotation on drag, ball grabbing/throwing, and mode transitions (off/on/broken). The spec's description of the four modes was detailed and helpful. One ambiguity: the spec mentions "circuit-board decorations" and "LEDs pulse" but doesn't provide specifics on what these should look like or where they should appear, so I focused on the core ball physics and material transitions. The bloom pass and dying-lightbulb flicker are implemented as described. TypeScript builds successfully.
