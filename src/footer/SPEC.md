# Footer Component

## Canvas
- Narrow bar at bottom. Parent controls height (footer + main = 100dvh together).
- Contains copyright text and the Shiny Toggle.

## Layout
- Left: `© 2025 clockwork.cards` + any brief about text
- Right: Shiny Toggle button

## Shiny Toggle (Light/Dark Mode for Kids)
The toggle switches between two themes. It's discovered last — the fun reward at the bottom.

### Light Mode (default)
- Neutral white backgrounds, dark gray typography.
- Minimal color. Clean, typographic.
- Subtle borders, soft shadows.

### Shiny Mode
- Dark cyberpunk aesthetic. Deep blacks, rich dark blues.
- Neon glows: cyan, magenta, electric purple. CSS `box-shadow` and `text-shadow`.
- Same shapes, spacing, border-radii as light mode — only colors/shadows/lighting change.
- Hardware-accelerated where possible (`transform`, `will-change`, `filter`).
- All effects in pure CSS — no JS animation libraries.

## Theme Implementation
- Toggle adds/removes a class on `document.documentElement` (e.g. `.shiny`).
- CSS custom properties define the theme palette.
- Both themes defined in CSS files within `src/footer/`.
- Shiny mode styles use the `.shiny` parent selector.

## Props
Component receives: no props needed (toggle manages its own state).

## Constraints
- All code in `src/footer/`.
- Export default component from `src/footer/index.tsx`.
- Theme CSS exported/imported so it applies globally.
- The toggle state can be simple React state (no Zustand needed yet).
