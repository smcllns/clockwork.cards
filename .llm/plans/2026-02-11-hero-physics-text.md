# Hero Physics Text — Plan

## Context
Birthday card hero section where colored shapes spell "HAPPY 8TH BIRTHDAY OSCAR" using a 5x7 pixel bitmap font. Two approaches kept:
- **D (default):** Three.js + Rapier — 3D block letters, spring-anchored, tumble on chaos
- **C:** Matter.js — 2D constraint cluster circles, scatter on chaos

## Completed
- [x] Bitmap font system (font.ts) with A-Z, 0-9, layout engine
- [x] Approach D: Three.js scene, Rapier physics, compound letter bodies
- [x] Approach C: Matter.js with constraints + anchor springs
- [x] Multi-grab (touch + mouse) with scroll coexistence
- [x] Chaos button: gravity + scatter
- [x] Walls aligned to viewport frustum (D) / container (C)
- [x] Code simplified into named functions (D)
- [x] Approaches A and B removed

## Next: Hero polish
- [ ] Color palette — current colors are placeholder pastels, need intentional palette
- [ ] Geometry — box size, depth, gaps between blocks, rounded edges?
- [ ] Materials — MeshStandardMaterial is basic, explore metalness/roughness/emissive
- [ ] Lighting — single directional + ambient is flat, consider more dramatic setup
- [ ] Camera angle — currently head-on, slight tilt could add depth
- [ ] Background — bg-amber-50 is placeholder
- [ ] Responsive — test on iPhone (390px), text might be too small
- [ ] Performance — compound bodies with many colliders, test on mobile

## Parked
- Main section (3 flip cards) — working, not priority
- Footer (shiny toggle + themes) — working, not priority
