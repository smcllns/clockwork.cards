# Config System, Prose Mode, Hero Redesign

## Goal
Central metric config → prose rendering → hero redesign → content-editable + localStorage.

## Tasks

### Phase 1: Browser Test & Card Fixes
- [x] Launch dev server, test in browser
- [x] Fix card overflow issues (not needed — cards render fine with new system)
- [x] Remove birthday countdown, assume birthday = today

### Phase 2: Metric Config System
- [x] Create types.ts
- [x] Create store.ts (one timer, settings signals, localStorage, context)
- [x] Convert time-alive → MetricConfig[]
- [x] Convert sleep → MetricConfig[] + slider
- [x] Convert heartbeats → MetricConfig[] + slider
- [x] Convert steps → MetricConfig[] + sliders
- [x] Convert space → MetricConfig[]
- [x] Convert fun-facts → prose-only MetricConfig[]
- [x] Create metrics/index.ts master list

### Phase 3: New Rendering Components
- [x] WidgetCard.tsx — renders MetricConfig, math from MathStep[]
- [x] Prose.tsx — sentence with inline number highlighting
- [x] Section.tsx — renders SectionConfig: header + cards + prose
- [ ] icons.ts — extract SVGs (deferred, low priority)

### Phase 4: Hero Redesign
- [x] Big age number, "Happy Birthday [Name]"
- [x] "You are nine, born February 19, 2017"
- [x] utils/words.ts — numberToWord()

### Phase 5: Content-Editable + localStorage
- [x] Editable.tsx wrapper
- [x] Single localStorage key stores settings + textOverrides
- [x] "Reset all customizations" button in footer

### Phase 6: Fun Facts & Prose Polish
- [x] Longer prose per metric, varied sentence openings
- [x] Add poop estimate metric
- [x] Playful tone, 8-10 year old readable

### Phase 7: Cleanup
- [x] Delete old section files
- [x] Delete StatCard.tsx
- [x] Update themes.css (no changes needed, existing CSS works)
- [x] Verify build (46.5KB JS, 3KB CSS)

## Deferred
- icons.ts — SVG extraction. Low priority since icons are only gear/close/refresh, embedded inline.
