# Main Component

## Canvas
- Fills remaining space above footer (main + footer = 100dvh via flex-1).
- Contains metric widget cards.

## Layout
- **Mobile (<640px):** single column, full-width stacked cards, scrollable.
- **Tablet+ (≥640px):** 3-column grid, cards fill available space.
- Cards have padding/gap between them.

## Widget Cards (3 total)

Each card has a front face and a back face. Tap/click to flip.

### Card 1: Age
- Front: "You are X years old today!"
- Toggle between: years, months, days, hours, minutes, seconds (live-updating for seconds).
- Back: shows the math (DOB → now, calculation breakdown).

### Card 2: Distance Around the Sun
- Front: "You've travelled Z million miles around the sun!"
- Toggle between: miles and kilometres.
- Back: shows the math (Earth's orbital speed × time alive).

### Card 3: Heartbeats
- Front: "Your heart has beaten X times!"
- Toggle between: total beats, beats per day, millions of beats.
- Back: shows the math (avg BPM × minutes alive).

## Card Flip Behavior
- CSS 3D transform flip (`rotateY(180deg)`).
- Front face shows the stat with toggle buttons.
- Back face shows the math explanation.
- Tap anywhere on card to flip.

## Props
Component receives: `name: string`, `dob: string`

## Constraints
- All code in `src/main/`.
- Export default component from `src/main/index.tsx`.
- Cards are self-contained components within the folder.
- Live-updating values use `setInterval` or `requestAnimationFrame`.
- No external animation libraries — CSS transitions only.
