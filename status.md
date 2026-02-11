# Happy Metrics — Status Review (2026-02-10)

## Current State

- **Branch:** `main` (only branch, clean working tree)
- **No remote** — not pushed anywhere yet
- **Tests:** 57/57 passing
- **No stashes**

## What's Been Completed

Architecture restructure plan (`2026-01-29`) fully done — all 21 steps:

- SolidJS rewrite from Next.js/React
- Facts-as-pure-functions architecture (`FactFn → FactData`)
- Canvas/widgets/models/themes structure
- 6 model files (time-alive, sleep, heartbeats, steps, space, fun-facts)
- FlipCard with 3D flip animations (bug fixed: `<For>` → `<Index>`)
- Section-local params with localStorage persistence
- Cyberpunk + minimalist themes
- Hero widget extraction, dead code cleanup
- 57 tests across lib + models

## Three Canvases Currently

| Route | Canvas | Purpose |
|-------|--------|---------|
| `/` | `Demo.tsx` | Generic birthday card — sections with FlipCards, uses shared Section/Prose widgets |
| `/dev` | `Dev.tsx` | Sandbox |
| `/proposal` | `Proposal.tsx` | **The real birthday card** — custom layout with space hero, prose blocks, varied controls (sliders, steppers, pills, chips), bright theme |

## What Needs Decision

1. **Demo vs Proposal** — these are competing canvases. Demo uses the shared Section/Prose architecture; Proposal bypasses it with its own bespoke layout (~590 lines, inlined primitives). Which direction is the MVP?

2. **Proposal duplication** — Proposal inlines its own Flippable, ProseBlock, Num, FactSquare, MiniSlider, Stepper, Pills, Chips, UnitToggle rather than using shared widgets. Some overlap with existing FlipCard/Slider. Should we extract, or is bespoke fine for a one-off card?

3. **`theme-birthday` CSS** — referenced in Proposal but may not be fully defined. Needs checking.

4. **Target use case** — is this for a specific birthday (URL params like `?name=Ellie&dob=2017-02-19&gender=girl`), or a general tool?

5. **Deploy** — no remote set up. Where should this live? (Vercel/Netlify/static?)

6. **Scope trim** — anything to cut for MVP?
