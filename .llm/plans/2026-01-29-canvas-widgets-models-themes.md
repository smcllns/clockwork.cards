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

## Next: Cleanup & Real Card

Priority is a cleanup pass to prepare for implementing the real kids birthday card. A fresh Claude should handle this.

### Cleanup tasks
- **Remove dead code in FlipCard** — settings face, gear icon, params/paramValues/onParamChange props are no longer used by any caller. Strip them.
- **Extract Hero widget** — hero is inline in Demo.tsx, should be a widget for customization
- **Update all docs** — CLAUDE.md, notes, file map to reflect current state after cleanup
- **Minimize abstractions** — look for anything unnecessary and simplify

### After cleanup
- **Build the real kids card** — implement Sam's actual birthday card. This will surface real needs and drive further feature decisions.

### Deferred (wait for real need)
- **CSS/theming** — wait until product features are more settled. When doing themes: support custom Google Fonts as a first-class feature so users can specify a font when creating a custom style.
- **Cross-section param sharing** — WON'T SUPPORT unless a real need arises. Don't add to any backlog.
- **Divider widget** — not yet needed
