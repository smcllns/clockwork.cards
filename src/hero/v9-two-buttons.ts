// V9: Two Buttons
// Same underlying Three.js scene as V5 (neon circuits) but the variation is
// in the button design — handled in index.tsx. This re-exports V5's init.
// The hero wrapper detects v9 and renders the special button layout.

export { initV5 as initV9 } from "./v5-neon-circuits";
