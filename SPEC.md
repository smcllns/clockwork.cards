# Clockwork Cards — UI Spec

## Device Priority
1. iPad Mini (first class)
2. iPhone (second class)
3. Desktop (content centered at ~1024px max-width)

Breakpoint: 640px (`sm:`). Below = mobile single column. Above = tablet grid.

## Layout

Two viewport sections stacked. Horizontal scroll disabled page-wide.

```
┌─────────────────────────┐
│ NAV         [shiny ●━]  │  ← inside hero, sliding toggle top-right
│                         │
│         HERO            │  ← 100dvh, 3D physics text
│                         │
│              [🔴 button]│  ← chaos button, bottom-right
├─────────────────────────┤
│                         │
│         MAIN            │  ← flex-1, metric flip cards
│                         │
├─────────────────────────┤
│        FOOTER           │  ← copyright
└─────────────────────────┘
       main+footer = 100dvh
```

### Hero (`src/hero/index.tsx`)
- `100dvh`, Three.js + Rapier 3D physics
- Multi-scale bitmap text: age (2.5x), words (1.4x each on own line), date (0.45x)
- Greyscale cubes on white background
- Drag horizontally to spin the whole phrase around Y axis
- Letters locked in place (anchored mode); throwable after chaos
- Chaos button: glowing red circle, Caveat handwritten label, one-shot (goes broken)

### Nav
- Inside Hero, top of viewport, not sticky
- Left: `clockwork.cards/oscar` branding
- Right: shiny sliding toggle

### Main (`src/main/`)
- Main + Footer = `100dvh`
- 3 metric flip cards: age, sun distance, heartbeats
- **Mobile:** single-column stack
- **Tablet+:** 3-column grid

### Footer (`src/footer/`)
- Copyright line
- Theme CSS custom properties + shiny mode styles

## Shiny Mode
- Sliding toggle in hero nav
- **Light:** white bg, greyscale cubes, minimal
- **Shiny:** dark bg, neon palette, bloom, particles, emissive pulse, CRT overlays
- Age digits get always-bright hue-cycling glow
- CSS custom properties swap via `.shiny` class on `<html>`

## Sizing Rules
- `dvh` units (handles mobile browser chrome)
- Parent containers define height; children own their canvas
- `overflow-x: hidden` on html+body
