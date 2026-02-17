# Clockwork Cards — Build From Spec

You are implementing a birthday card app from scratch using the golden spec in `SPEC.GOLD.md`.

## Your task

Build the complete app described in SPEC.GOLD.md. You have creative freedom — the spec describes the tent poles (architecture, layout, interactions, theming) but you should make your own decisions about implementation details. Do a great job.

## Stack (already configured)

- **Bun** — runtime, bundler, dev server (`bun run dev` on :3000)
- **React 19** — UI
- **Tailwind v4** — via `bun-plugin-tailwind` (zero config, just use classes)
- **Three.js + Rapier** — 3D physics hero
- **Space Grotesk** — font (loaded in index.html)

Run `bun install` first. Then `bun run dev` to start.

## Journaling

Maintain `JOURNAL.md` at the root. After each major milestone (component done, section working, bug fixed, design decision made), add a timestamped entry. Format:

```
## HH:MM — [What you did]
[1-2 sentences on what happened, decisions made, anything surprising or confusing about the spec]
```

We're using your journal to improve the spec. What we want to know:
- Where was the spec **ambiguous** — you had to guess?
- Where was the spec **wrong** or **contradictory**?
- Where was the spec **missing info** you needed?
- Where did you **deviate** from the spec, and why?
- What was **easy to implement** from the spec vs what was hard?

Be honest. "The spec didn't say X so I guessed Y" is exactly what we want.

## Approach

1. Start with the app shell (index.tsx, theme.css, index.css) and get a blank page rendering
2. Build the component primitives (Section, Slide, Tile, controls)
3. Build cards one at a time, simplest first (time → space → yogurt → etc)
4. Hero last (it's the most complex piece)
5. Theming + polish

Commit frequently. Each card or component should be its own commit.

## When done

1. Take screenshots of light mode and shiny mode (save to `screenshots/`)
2. Make sure `bun run dev` works and `tsc` passes
3. Push your branch and create a PR against `golden-spec-test`
