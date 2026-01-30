# 3D Hero Number — Debug Task

## Goal
Replace flat CSS age number in hero with a 3D Three.js rendering (rotating, glowing, bloom).

## Current State
Component is written, builds clean, TS clean, but **the canvas never appears in the DOM**. The container div renders empty.

## Status
Resolved: use an explicit `<canvas>` element and pass it to `WebGLRenderer` so Solid does not replace the appended child.

## What Works
- `bun run build` passes
- `npx tsc --noEmit` clean (for our file)
- `onMount` fires, `document.getElementById` finds the element with correct dimensions (960x320)
- Font loads from `/fonts/helvetiker_bold.typeface.json`
- No JS errors in console

## The Bug
`el.appendChild(renderer.domElement)` executes without error but the canvas does not appear as a child of the container div. The div stays empty (`></ div>` in Elements panel). The Three.js scene is created and the animation loop runs (confirmed via console.log and WebGL GPU warnings), but nothing is visible.

## What I've Tried
1. **`let container!: HTMLDivElement` + `ref={container}`** — container was undefined in onMount
2. **`ref={(el) => container = el}` + `onMount`** — same, container empty
3. **`ref={setup}` direct** — ref fires before layout, element has zero dimensions (GL_INVALID_FRAMEBUFFER zero size warnings)
4. **`ref={setup}` + `requestAnimationFrame` deferral** — init runs with correct dimensions, console log confirms, but canvas still not in DOM
5. **`onMount` + `document.getElementById`** — same result: init runs, dimensions correct, canvas not visible

In all cases, `el.appendChild(renderer.domElement)` executes without throwing, but the canvas doesn't show up in the DOM inspector.

## Hypothesis
Something is wrong with how `WebGLRenderer.domElement` interacts with SolidJS's DOM. Possibly:
- SolidJS is replacing/recreating the container after appendChild runs
- The renderer.domElement isn't a standard canvas element
- HMR is interfering (though full page reload shows same behavior)

## Files
- `src/components/HeroNumber3D.tsx` — the component (current approach: onMount + getElementById)
- `src/App.tsx` — imports and uses `<HeroNumber3D number={age()} />`
- `public/fonts/helvetiker_bold.typeface.json` — font file (copied from three.js)

## To Run
```
bun run dev
# Open http://localhost:3000
# Look at hero area — should show 3D "8", currently shows blank space
```

## Fix Applied
- Added a dedicated `<canvas>` inside the container and pass it via `new WebGLRenderer({ canvas })`.
- Swapped `document.getElementById`/`appendChild` for Solid refs on the container + canvas.
- Updated pointer handlers and resize logic to reference the container ref.
