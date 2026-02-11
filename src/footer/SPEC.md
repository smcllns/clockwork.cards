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
- CSS effects (box-shadow, text-shadow) for HTML elements; JS-driven color/glow updates for physics renderers.

## Theme Implementation
- Zustand store (`src/store/theme.ts`) owns the `shiny` boolean and toggles `.shiny` class on `<html>`.
- CSS custom properties define the theme palette (`src/footer/theme.css`).
- Both themes defined in `:root` / `:root.shiny` blocks.
- Hero physics renderers subscribe to the store and imperatively update colors:
  - Three.js (approach D): swaps material colors + emissive glow
  - Matter.js (approach C): swaps fillStyle + canvas shadowBlur glow
- Shared color palettes in `src/hero/colors.ts` (LIGHT + SHINY, hex numbers + CSS strings).

## Props
Component receives: no props needed (reads from Zustand store).

## Constraints
- Footer code in `src/footer/`. Theme store in `src/store/theme.ts`.
- Export default component from `src/footer/index.tsx`.
- Theme CSS exported/imported so it applies globally.
