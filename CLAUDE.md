# Happy Metrics

Interactive birthday metrics app. Shows live-updating stats about time alive, heartbeats, steps, sleep, and space travel with 3D flip cards that reveal the math.

## Stack
- **SolidJS** — UI (signals, no virtual DOM)
- **Vite** — dev server + build
- **Bun** — package manager
- **Vanilla CSS** — custom properties for theming

## Commands
- `bun run dev` — dev server on :3000
- `bun run build` — production build to `dist/`

## URL Parameters
- `?name=Alice` — display name (default: "Birthday Star")
- `?dob=2017-02-19` — date of birth, YYYY-MM-DD (default: 2017-02-20)
- `?theme=minimalist` — override default cyberpunk theme

## Project Structure
```
src/
├── index.tsx              # Entry point, URL param parsing
├── App.tsx                # Root component, theme state
├── components/
│   ├── StatCard.tsx        # 3D flip card (front/math/settings)
│   ├── Slider.tsx          # Custom range input
│   ├── ThemeToggle.tsx     # Cyberpunk ↔ Minimalist toggle
│   └── Confetti.tsx        # Celebration particles
├── sections/              # Each section = a group of StatCards
│   ├── Hero.tsx            # Name, age, birthday countdown
│   ├── TimeAlive.tsx       # Years/months/weeks/days/hours/min/sec
│   ├── Sleep.tsx           # Adjustable hours/night
│   ├── Heartbeats.tsx      # Adjustable BPM
│   ├── Steps.tsx           # Adjustable stride/steps/walking age
│   ├── Space.tsx           # Orbits, rotation, galaxy travel
│   └── FunFacts.tsx        # Sentence-form stats, tap for math
├── utils/
│   ├── metrics.ts          # All birthday math
│   └── format.ts           # Number formatting
└── styles/
    └── themes.css          # 2 themes (cyberpunk default, minimalist), animations
```

## Key Patterns
- **Theming**: CSS custom properties on `:root` (cyberpunk) and `.theme-minimalist`. Toggle applies/removes the class and updates URL via `history.replaceState`.
- **Live updates**: `setInterval` in `onMount` with `onCleanup` for teardown. Seconds tick every 1s, sleep/steps every 60s.
- **StatCard**: 3D CSS transforms (`rotateY(180deg)`, `rotateX(180deg)`) with `backface-visibility: hidden`. Three faces: front (metric), math (calculation), settings (sliders).
- **Calculations**: Centralized in `utils/metrics.ts`. Sections call these functions with signals.

## Notes
See `.llm/notes/` for architecture decisions and context.
