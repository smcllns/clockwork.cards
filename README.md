# clockwork.cards

A birthday card that counts. Live-updating stats about time alive, space travel, heartbeats, yogurt consumed, and more — built for a kid who loves numbers.

**[clockwork.cards/oscar](https://clockwork.cards)**

## What it does

A 3D physics hero spells out "Happy Birthday" in throwable ball-letter clusters. Below it, full-viewport slides present the birthday kid's life in numbers — seconds alive (ticking), miles through space, yogurt eaten vs. baby hippo weight, steps walked, teeth brushed, and more. Most stats have inline controls so the kid can tweak assumptions and watch numbers change. A bento tile grid covers brain & body stats (sleep, heartbeats, hugs, lungs, water, fruit).

Two modes beyond the default: **Cyberpunk** (neon glow + bloom) and **Chaos** (break the hero — gravity, sparks, dying lightbulb flicker). Chaos is a one-way trip.

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
├── index.tsx              App shell — all sections in scroll order
├── index.css              Tailwind + scroll snap + responsive overrides
├── theme.css              CSS custom properties (light + shiny themes)
├── constants.ts           System constants (time, space, body, food)
├── utils.ts               Shared utilities (getAge, daysSinceAge)
├── cards/                 Self-contained card components
│   ├── hero-cyberpunk/    3D physics birthday text (Three.js + Rapier)
│   ├── slide-time.tsx     Time card (dropdown selector, single value)
│   ├── slide-time-table.tsx  Time card (table of all units)
│   ├── slide-space.tsx    Space travel (miles/km toggle)
│   ├── slide-yogurt.tsx   Yogurt consumption (slider + stepper)
│   ├── slide-steps.tsx    Steps walked (slider + stepper)
│   ├── slide-brushing.tsx Teeth brushing + blinks
│   ├── slide-poops.tsx    Lifetime poops
│   └── tile-*.tsx         Bento grid tiles (sleep, heartbeats, fruit, hugs, lungs, water)
└── components/            Shared primitives
    ├── slide.tsx          Slide, KeyMetric, Headline, Body, Narrative, N, IdTag
    ├── tile.tsx           TileContainer, Tile (bento grid)
    ├── section.tsx        Section wrapper (snap + background)
    ├── controls.tsx       InlinePills, InlineDropdown, InlineStepper, InlineSlider
    ├── nav.tsx            Fixed nav bar with cyberpunk toggle
    ├── footer.tsx         Copyright
    └── useNow.ts          1-second tick hook for live-updating values
```
