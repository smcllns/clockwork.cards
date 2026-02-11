# Hero Component

## Canvas
- Fills `100dvh` viewport. Parent controls height — you own the interior.
- Nav bar inside at top: `clockwork.cards/{name}` branding, left-aligned.
- "Happy {age}th Birthday {name}" centered in remaining space.

## Matter.js Visualization
- Birthday message rendered as matter.js physics bodies (colored circles and squares).
- Bodies are static/sleeping initially — arranged to spell out the message.
- Bright, playful colors. Mix of shapes (circles + squares).

## The Button
- Bottom corner of hero: a visually prominent button.
- Small text reads: "do not press this button"
- On press: all matter.js bodies wake up and fall with gravity inside the hero container.
- Hero container acts as the physics boundary — bodies pile up at the bottom.
- Refresh the page to reset.

## Props
Component receives: `name: string`, `dob: string`

## Constraints
- All code in `src/hero/`.
- Export default component from `src/hero/index.tsx`.
- Install `matter-js` and `@types/matter-js` if needed.
- Keep physics contained within the hero section bounds.
