# Plan: Architecture Restructure → Facts / Canvas / Widgets / Themes

**Status: Complete.** All implementation steps done. Bug fixes applied. Ready for cleanup pass.

## Implementation Steps

1. [x] **Rollback** — removed ThreeJS deps + HeroNumber3D.tsx
2. [x] **Create `lib/`** — types.ts, time.ts, format.ts, constants.ts
3. [x] **Write lib tests** — 29 tests passing
4. [x] **Convert models** — 6 model files, all facts as pure functions
5. [x] **Write model tests** — 28 tests passing
6. [x] **Move themes** — themes/cyberpunk.css + themes/minimalist.css
7. [x] **Refactor widgets** — FlipCard, Slider, ThemeToggle, Confetti
8. [x] **Create canvas** — Demo.tsx, Dev.tsx, Section.tsx, Prose.tsx, store.ts
9. [x] **Wire entry point** — pathname routing, URL params
10. [x] **Delete old dirs** — removed components/, metrics/, utils/, styles/, App.tsx
11. [x] **Smoke test** — 57 tests passing, build succeeds
12. [x] **Fix animation bug** — `<For>` → `<Index>` in Section.tsx + Prose.tsx
13. [x] **Fix settings face rotation** — rotateX → rotateY, display toggling for back-faces
14. [x] **Fix math face text overflow** — flex layout with scrollable content area
15. [x] **Move params to Section level** — sliders in Section header with gear toggle, removed from FlipCard
16. [x] **Remove contentEditable** — deleted Editable.tsx, stripped textOverrides from store

## Known Bugs

None currently known.

## Cleanup Pass (Complete)

17. [x] **Remove dead code in FlipCard** — stripped settings face, gear icon, params props, Slider import. Simplified face to boolean.
18. [x] **Extract Hero widget** — `src/widgets/Hero.tsx` as canvas building block with props (age, name, dob, subtitle, hint).
19. [x] **Fix stale hint text** — removed "Tap the gear to adjust variables" (gear now in Section headers).
20. [x] **Delete example/ directory** — 11 unused design reference files.
21. [x] **Update docs** — CLAUDE.md, notes, plan file updated.

Bundle: ~42.5KB JS (down from 45.3KB).

## Next: Build the Real Card

Implement Sam's actual birthday card. This will surface real needs and drive further feature decisions.

### Deferred (wait for real need)
- **CSS/theming** — wait until product features are more settled. When doing themes: support custom Google Fonts as a first-class feature.
- **Cross-section param sharing** — WON'T SUPPORT unless a real need arises.
- **Divider widget** — not yet needed
