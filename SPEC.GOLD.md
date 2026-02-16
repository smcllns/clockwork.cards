# Clockwork Cards v1 — Golden Spec

A birthday card for a specific 9-year-old (Oscar, DOB 2017-02-20) who loves numbers. Ships as a static SPA on Cloudflare Pages. Hero is a 3D physics scene; below it, six full-viewport stat slides that tick every second. Two secret modes designed to be irresistible to a kid.

## The hero is hundreds of physics balls spelling birthday text

Not rendered text. Each pixel of a 5×7 bitmap font becomes a Three.js sphere simulated by Rapier3D WASM. The display reads "9 / HAPPY / BIRTHDAY / OSCAR / FEBRUARY 20 2017" across five lines at different scales: age at 2.5×, words at 1.4×, date at 0.45×. This means the "9" is physically enormous relative to the date line — the age dominates the scene.

Balls are spring-anchored (velocity steering, stiffness 20). Drag anywhere spins all balls around Y-axis. Grab near balls to throw them (multi-grab, radius 3 world units).

## Three mutually exclusive modes: off → on → broken

`"off" | "on" | "broken"`. Broken is terminal — no undo, one-shot.

**Off:** Matte greyscale balls (Lambert material). Faint circuit-board decorations behind (polylines + chip shapes at opacity 0.12). Bloom pass skipped entirely — `renderer.render()` direct for perf.

**On (shiny):** `.shiny` on `<html>` flips all CSS custom properties to cyberpunk palette (dark bg, cyan/purple/pink). 3D scene switches to MeshPhysicalMaterial with emissive glow, metalness 0.6, clearcoat 0.5. Circuit traces animate with flowing dots, LEDs pulse green.

**Broken (chaos):** Gravity -80y slams on. Balls release in a staggered radial wave from a random impact point (normalized to 0–0.8s). On ground hit, each ball sparks orange then begins a dying-lightbulb flicker. Death times follow a heavy tail: 80% die in 5–60s, 15% in 60–180s, 5% survive 3–100 *minutes*. Bloom tracks the brightest survivor. Circuits spark and die. LEDs go red then dark.

## The two toggles are reverse-psychology UX for a kid

Top-right: "✨ Shiny" in gold. Obvious, inviting. Toggles off↔on.

Next to it: "🚫 Do not touch" in red, with a muted grey toggle. Deliberately provocative — a kid *will* press it. One press triggers broken mode permanently. The toggle goes dead/grey. The shiny toggle goes to 50% opacity, disabled.

## Six full-viewport stat slides, live-ticking

`computeStats(dob, config, now)` is a pure function. `now` updates every 1000ms. 37 unit tests cover the math. Slides use scroll-snap (`y proximity`).

1. **Time** — Big number with unit pills (years through seconds). Shows fractional years to 3 decimal places when in years mode.
2. **Space** — Miles through space (Earth orbits at 67,000 mph × hours alive). Light-speed comparison. Inline miles/km toggle.
3. **Yogurt** — Cumulative kg eaten since configurable age. Compared to baby hippo weight (40 kg). Slider + stepper controls.
4. **Life in Numbers** — Narrative prose style, not big-number cards. Stats woven into sentences with inline controls: "If you've walked `‹ 8,000 ›` steps a day since you were `‹ 3 ›`..." Steps, brushing (time + strokes), blinks, hair length if never cut, poops.
5. **Brain & Body** — Bento grid, 5-col brick pattern (alternating 3/2 and 2/3 spans, collapses to 1-col on mobile). Sleep, heartbeats, fruit servings, hugs, lung capacity, water as % of Olympic pool. Pink neon glow in shiny (different from the cyan glow on other cards).
6. **Binary** — "In binary, 9 is 1001." Teaches base-2 via tap-to-flip card showing the number decoded in base 2 and base 10 side by side. Closing: "We love you, we love your mind, happy 1001st birthday Oscar." ❤️

## Inline controls embedded in prose

Not form fields below content. Steppers (`‹ value ›`) and sliders appear *inside sentences*, styled as accent-colored chips with `color-mix()` backgrounds. This is the primary interaction model — you tune the numbers by tweaking assumptions within the narrative.

## Theming is CSS custom properties, not component variants

`:root` = light. `:root.shiny` = cyberpunk. One classList toggle on `<html>` flips everything. Cards use `var(--text-primary)`, `var(--bg-card)`, etc. Shiny mode adds `neon-pulse` and `glow-border` keyframe animations on `[data-card]` elements, text-shadow glow on `[data-stat]` numbers. Theme transitions scoped to body/section/footer/`[data-card]` only (not `*`) for scroll perf.

## Physics perf choices that aren't obvious

- Pixel ratio forced to 1 (skip retina rendering entirely).
- Off mode: Lambert materials + direct render (no bloom compositor at all).
- Low-poly spheres (8×6 segments, swapped in after initial creation with 16×12).
- `canSleep(false)` on all bodies — counterintuitive, but sleep/wake jitter looked worse than constant simulation.
- IntersectionObserver pauses the entire animation loop when hero scrolls offscreen.

## IdTags for feedback

Every slide and sub-stat has a muted `#id` tag (e.g. #4b). Purpose: so the recipient can reference specific parts during review — "change something on #4b." Not for end users.
