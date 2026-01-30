# Plan: Architecture Restructure → Facts / Canvas / Widgets / Themes

## Step 0: Rollback ThreeJS

`git reset --hard b57b9bf` — one commit back, before broken ThreeJS. All working functionality preserved.

## Architecture

```
src/
├── canvas/           # Page layouts (proprietary)
│   ├── Demo.tsx       # Canonical birthday card canvas (served at /)
│   ├── Dev.tsx        # Sandbox canvas for experimentation (served at /dev)
│   ├── Section.tsx    # Renders fact cards, manages local param state
│   ├── Prose.tsx      # Renders fact prose sentences (canvas-level)
│   └── store.ts       # Timer (now), dob, name, gender, textOverrides
│
├── widgets/          # UI renderers (proprietary)
│   ├── FlipCard.tsx   # 3D flip card: value, math, settings faces
│   ├── Hero.tsx       # Big hero number
│   ├── Editable.tsx   # contentEditable + localStorage
│   ├── Slider.tsx     # Range input
│   ├── ThemeToggle.tsx
│   ├── Confetti.tsx
│   └── Divider.tsx
│
├── models/           # Fact functions + params (user-extensible)
│   ├── time-alive.ts
│   ├── sleep.ts
│   ├── heartbeats.ts
│   ├── steps.ts
│   ├── space.ts
│   └── fun-facts.ts
│
├── themes/           # CSS (user-extensible, not yet refined)
│   ├── cyberpunk.css
│   └── minimalist.css
│
├── lib/              # Standard library for fact authors
│   ├── types.ts       # FactFn, FactData, FactContext, ParamDef, MathStep
│   ├── time.ts        # getTimeAlive, getAge, birthday helpers
│   ├── format.ts      # formatNumber, formatCompact
│   └── constants.ts   # Space speeds, conversion factors
│
├── index.tsx          # Entry point, URL param parsing
└── index.css          # Base/reset styles
```

## Core Types

```ts
type FactContext = { now: Date, dob: Date, name: string, gender: 'boy' | 'girl' | 'neutral', [key: string]: any }
type FactData = { title: string, value: number | string, format?, subtitle?, math?, prose?, accent?, live? }
type FactFn = (ctx: FactContext) => FactData
type ParamDef = { default: number, min: number, max: number, step?, label: string, unit? }
```

## How Facts Work

A fact is a pure function. No DOM, no SolidJS. Receives context (including any param values), returns data.

```ts
// Simple — no params
export const TotalPoops: FactFn = ({ now, dob, name }) => ({
  title: 'Total Poops',
  value: diffDays(now, dob) * 1.25,
  prose: `${name} has done about ${Math.round(diffDays(now, dob) * 1.25)} poops!`
})

// With params — destructure param values alongside context
export const TotalBeats: FactFn = ({ now, dob, name, bpm }) => {
  const totalBeats = (now.getTime() - dob.getTime()) / 60000 * bpm
  return { title: 'Total Heartbeats', value: totalBeats, live: true, ... }
}
```

Params are exported separately from the model file:
```ts
export const params = {
  bpm: { default: 90, min: 60, max: 120, step: 1, label: 'Heart rate', unit: 'BPM' },
} satisfies Record<string, ParamDef>
```

## How Canvas Works

Each canvas is a JSX component. Helper components compose the page.

Two canvases: `/` → Demo (canonical birthday card), `/dev` → Dev (sandbox).
Simple pathname routing in `index.tsx` — no router library.

```tsx
// canvas/Demo.tsx — matches current birthday card layout
export function Demo() {
  return (
    <>
      <Hero />
      <Section name="Time Alive" facts={[SecondsAlive, MinutesAlive, ...]} />
      <Section name="Heartbeats" params={heartbeatParams}
               facts={[TotalBeats, BeatsPerDay, Millions]} />
      <Prose facts={[TotalPoops, BreathsTaken]} />
      <Footer />
    </>
  )
}
```

## Param State

Params are **local to each Section**. No global param store.
- Section creates signals for its params, initialized from defaults or localStorage
- Param values merged into FactContext: `{ now, dob, name, gender, ...paramValues }`
- FlipCard settings face auto-generates sliders from ParamDef
- localStorage persists per section: `happy-metrics.params.Heartbeats`

## Store

Minimal — just runtime context:
- `now` — 1s timer signal
- `dob`, `name`, `gender` — from URL params
- `textOverrides` — for Editable, persisted to localStorage

## Security Model

Facts are safe by design: pure functions that receive data and return data. No DOM access, no `window`, no `fetch`. The rendering layer (widgets) handles all interaction.

## Implementation Steps

1. [x] **Rollback** — removed ThreeJS deps + HeroNumber3D.tsx (kept plan commit on top)
2. [x] **Create `lib/types.ts`** — FactFn, FactData, FactContext, ParamDef, MathStep
3. [x] **Create `lib/time.ts`** — move time helpers from `utils/metrics.ts`
4. [x] **Create `lib/format.ts`** — move from `utils/format.ts` + `utils/words.ts`
5. [x] **Create `lib/constants.ts`** — space constants + distance comparison
6. [x] **Write lib tests** — 29 tests passing (`bun test`)
7. [x] **Convert models** — 6 model files, all facts as pure functions
8. [x] **Write model tests** — 28 tests passing (`bun test`)
9. [x] **Move themes** — `themes/cyberpunk.css` + `themes/minimalist.css`
10. [x] **Refactor widgets** — FlipCard, Slider, Editable, ThemeToggle, Confetti
11. [x] **Create canvas** — Demo.tsx, Dev.tsx, Section.tsx, Prose.tsx, store.ts
12. [x] **Wire entry point** — pathname routing, URL params (name, dob, gender, theme)
13. [x] **Delete old dirs** — removed components/, metrics/, utils/, styles/, App.tsx, store.ts, types.ts
14. [x] **Smoke test** — dev server, build, 57 tests all passing

## Verification
- `bun run dev` — app loads, sections display, cards flip, sliders work, theme toggles
- `bun test` — lib + model tests pass
- `bun run build` — production build succeeds
- URL params (?name=X&dob=Y&theme=Z&gender=boy) work
- localStorage persistence + reset

## Deferred
- **CSS/theming** — not yet refined, will iterate once further along
- **Cross-section param sharing** — params local to Section for now; can promote to store later if needed
