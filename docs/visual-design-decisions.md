# Visual Design Decisions

## Typography
- **Space Grotesk** (display/body) + **Space Mono** (shiny stats) from Google Fonts
- CSS var `--font-stat` switches between display (light) and mono (shiny) automatically
- `data-stat` attribute triggers shiny text-shadow glow

## 3D Hero (approach-d)
- `MeshPhysicalMaterial` with clearcoat for light mode — toy-like candy feel
- `ExtrudeGeometry` from rounded `THREE.Shape` for chamfered block edges (0.04 bevel)
- `HemisphereLight` (warm bottom, cool top) + directional with PCFSoftShadowMap
- `EffectComposer` with `UnrealBloomPass` — only active in shiny mode (strength=1.2, radius=0.4, threshold=0.2). Disabled by setting strength=0 + threshold=1 in light mode
- `THREE.Points` with canvas-generated sparkle texture for floating particles (~60 count). AdditiveBlending, opacity toggles 0/0.6 with shiny
- Per-letter emissive pulse: sine wave with random phase per letter group, animated in the render loop
- `ACESFilmicToneMapping` for consistent HDR look

## 2D Hero (approach-c)
- Light mode: radial gradient fills (white→color) per circle, 1px outline, canvas drop shadow (blur=6, offsetY=2)
- Shiny mode: double fill pass with high shadowBlur (24px), shadow color = fill color for intense glow

## CSS Overlay System
- `data-dot-grid`: radial-gradient dot pattern (24px grid, 3% white) — applied to hero + widget sections
- `data-shiny-overlay`: combined `::after` with CRT scanlines (repeating-linear-gradient 2px/4px) + vignette (radial-gradient darkening edges). z-index:5, pointer-events:none
- `.shiny [data-card] > div > div`: backdrop-filter blur for glass panel effect
- LED blink animation: `@keyframes led-blink` with opacity 0.3→1, staggered delay per dot

## New Widget Components
- **Gauge.tsx**: SVG circular gauge, animated needle oscillating around BPM value. Shiny mode adds SVG filter glow on needle
- **LEDs.tsx**: 8 colored dots with blink animation. Shiny mode = faster, brighter, more glow
- **Toggle.tsx**: Segmented control replacing plain buttons. Active item gets card bg + accent color + shadow
- **StatusText.tsx**: Typewriter-animated status messages, only visible in shiny mode. Uses Space Mono, cyan with text-shadow glow

## Key Gotchas
- Can't have two `::after` on same element → combined CRT + vignette into one `data-shiny-overlay`
- Bloom pass needs `OutputPass` after it for correct output
- Particle positions must be wrapped (visH bounds) in animation loop
- `emissiveIntensity` requires casting through `MeshPhysicalMaterial` type
