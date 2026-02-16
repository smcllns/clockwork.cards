# clockwork.cards

A birthday card that counts. Live-updating stats about time alive, space travel, heartbeats, yogurt consumed, and more — built for a kid who loves numbers.

**[clockwork.cards/oscar](https://clockwork.cards)**

## What it does

A 3D physics hero spells out "Happy Birthday" in throwable ball-letter clusters. Below it, six full-viewport slides present the birthday kid's life in numbers — seconds alive (ticking), miles through space, yogurt eaten vs. baby hippo weight, and a base-2 math lesson. Most stats have inline controls so the kid can tweak assumptions and watch numbers change.

Two modes beyond the default: **Shiny** (cyberpunk neon + bloom) and **Chaos** (break the hero — gravity, sparks, dying lightbulb flicker). Chaos is a one-way trip.

## Run it

```bash
bun install
bun run dev        # localhost:3000
bun run build      # production → dist/
bun run deploy     # → Cloudflare Pages
```

Personalize via URL params or `.env`:

```
?name=Oscar&dob=2017-02-20
```

## Stack

Bun, React 19, Tailwind v4, Three.js + Rapier (3D physics), Cloudflare Pages.

## Structure

```
src/
├── index.tsx       App shell, page chrome, mode state
├── theme.css       CSS custom properties (light + shiny)
├── footer.tsx      Copyright
├── hero/           3D physics birthday text
│   ├── index.tsx   Pure scene component (name, dob, mode)
│   ├── scene.ts    Three.js + Rapier setup, animation, modes
│   ├── font.ts     5×7 bitmap font engine
│   ├── colors.ts   Light + neon palettes
│   └── shared.ts   Layout specs, shared types
└── cards/          Stat card slides
    ├── index.tsx   6 slides, config state, rendering
    ├── controls.tsx Inline steppers, sliders, pills
    └── stats.ts    Pure computation from DOB + config
```

## Tests

```bash
bun test    # 37 tests — stats computation, formatting, edge cases
```
