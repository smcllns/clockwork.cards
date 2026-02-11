# Hero Component

## Canvas
- Fills `100dvh` viewport. Parent controls height — you own the interior.
- Nav bar inside at top: `clockwork.cards/{name}` branding, left-aligned. Dev approach switcher links right-aligned.

## Text as Physics
- Birthday message ("HAPPY 8TH BIRTHDAY OSCAR") rendered as physics bodies using a 5x7 pixel bitmap font (`font.ts`).
- Each letter is a compound rigid body made of small blocks at grid positions.
- Bodies start spring-anchored to their text positions. Draggable via multi-grab.
- Bright playful color palette — one color per letter, randomly assigned.

## Two Approaches (switcher via `?hero=d|c`)
- **D (default):** Three.js + Rapier. 3D block letters with lighting and perspective. Letters tumble in 3D.
- **C:** Matter.js 2D. Constraint-cluster circles with anchor springs.

## The Button
- Bottom-right corner: "do not press this button"
- On press: spring anchors removed, gravity enabled, random velocity/spin applied.
- Bodies fall and pile up at container floor. Container walls = physics boundary.
- Draggable after chaos — grab and throw bodies around.
- Refresh to reset.

## Touch Interaction
- Touch on/near bodies → drag (preventDefault, no scroll)
- Touch on empty space → normal page scroll
- Multi-grab: all bodies within radius of touch point are grabbed together

## Props
Component receives: `name: string`, `dob: string`, `approach?: string`

## File Structure
- `index.tsx` — approach switcher, age calculation
- `font.ts` — 5x7 bitmap font data, text layout engine, ordinal suffix
- `approach-d.tsx` — Three.js + Rapier 3D implementation
- `approach-c.tsx` — Matter.js 2D implementation
- `multi-grab.ts` — shared multi-body grab for Matter.js approaches
