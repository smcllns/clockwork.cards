# Extract Page Chrome from Hero

## Status: COMPLETE

## Changes
- `src/hero/index.tsx` — pure scene component (~47 lines). Props: `{ name, dob, mode }`. Exports `HeroMode` type. No UI chrome, no state, no DOM class toggling.
- `src/index.tsx` — owns mode state, toggleShiny(), breakGlass(), shinyOn, 90dvh container with bg transition, nav, chaos toggle, shiny toggle.

## Verification
- [x] `bun run build` succeeds
- [x] `bun run dev` — hero loads, off mode correct
- [x] Shiny toggle: off → on → off works, dark bg + bloom + neon
- [x] Chaos from shiny: on → broken, shiny locks, toggle grey
- [x] Chaos from off: off → broken works (scene handles direct transition)
- [x] `.shiny` class toggles on `<html>`
- [x] Nav shows in all modes

## Note
Original `breakGlass()` called `handleRef.current?.setMode("on")` before setting "broken" when coming from "off" mode. This was redundant — scene's `setMode("broken")` independently sets up shiny materials. Removed the intermediate call.
