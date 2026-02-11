# Clockwork Cards — UI Spec

## Device Priority
1. iPad Mini (first class)
2. iPhone (second class)
3. Desktop (content centered at ~1024px max-width, no redesign needed)

Breakpoint: 640px (`sm:`). Below = mobile single column. Above = tablet grid.

## Layout

Three sections stacked vertically. Parent defines height; children fill it.

```
┌─────────────────────────┐
│ NAV                      │  ← inside hero, top bar, not sticky
│                         │
│         HERO            │  ← 100dvh, fills viewport
│                         │
├─────────────────────────┤
│                         │
│         MAIN            │  ← fills remaining dvh after footer
│                         │
├─────────────────────────┤
│        FOOTER           │  ← narrow, contains shiny toggle
└─────────────────────────┘
        main+footer = 100dvh
```

### Nav
- Inside Hero, top of viewport, not sticky/fixed
- Left: `clockwork.cards/oscar` share link / branding
- Scrolls away with Hero

### Hero
- `100dvh` — fills viewport
- Placeholder: "Happy 9th Birthday Oscar"
- Nav sits inside at top

### Main
- Main + Footer together = `100dvh`
- Main fills remaining space (flex-1)
- **Mobile:** scrollable single-column stack
- **Tablet+:** 3-column grid

### Footer
- Narrow, bottom of second viewport
- Contains Shiny Toggle (discovered last, not first)
- About / copyright / links
- **Shiny Toggle:** light/dark mode for kids
  - **Light:** neutral white + dark gray, minimal color
  - **Shiny:** dark cyberpunk, neon glows
  - Changes colors/shadows only — shapes, spacing, radii unchanged

## Sizing Rules
- Use `dvh` units (handles mobile browser chrome)
- Parent containers define height; children own their canvas
- Responsive behavior at container/grid level, not inside widgets
