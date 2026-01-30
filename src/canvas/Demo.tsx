import { createSignal, onMount, onCleanup, Show, JSX } from 'solid-js'
import { useStore } from './store'
import { Section } from './Section'
import { Prose } from './Prose'
import { Confetti } from '../widgets/Confetti'
import { ThemeToggle, type Theme } from '../widgets/ThemeToggle'
import { getAge } from '../lib/time'
import { numberToWord, formatDate } from '../lib/format'

import { Years, Months, Weeks, Days, Hours, Minutes, Seconds } from '../models/time-alive'
import { TotalHoursSlept, DaysSpentSleeping, YearsAsleep, params as sleepParams } from '../models/sleep'
import { TotalBeats, BeatsPerDay, MillionsOfBeats, params as heartbeatParams } from '../models/heartbeats'
import { TotalSteps, TotalFeet, MilesWalked, DistanceComparison, params as stepsParams } from '../models/steps'
import { TripsAroundSun, MilesFromRotation, MilesAroundSun, MoonTrips, ThroughTheGalaxy } from '../models/space'
import { Blinks, Breaths, Meals, Poops, HairGrowth } from '../models/fun-facts'

interface DemoProps {
  initialTheme: Theme
}

export function Demo(props: DemoProps): JSX.Element {
  const store = useStore()
  const [showConfetti, setShowConfetti] = createSignal(true)
  const [theme, setTheme] = createSignal<Theme>(props.initialTheme)

  onMount(() => {
    applyTheme(props.initialTheme)
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    onCleanup(() => clearTimeout(timer))
  })

  function applyTheme(t: Theme) {
    const root = document.documentElement
    root.classList.remove("theme-minimalist")
    if (t === "minimalist") root.classList.add("theme-minimalist")
    const url = new URL(window.location.href)
    if (t === "cyberpunk") url.searchParams.delete("theme")
    else url.searchParams.set("theme", t)
    window.history.replaceState({}, "", url.toString())
  }

  function toggleTheme() {
    const next = theme() === "cyberpunk" ? "minimalist" : "cyberpunk"
    setTheme(next)
    applyTheme(next)
  }

  const age = () => getAge(store.dob, store.now())
  const ageWord = () => numberToWord(age())

  return (
    <main style={{
      "min-height": "100vh",
      background: "var(--background)",
      transition: "color 0.3s, background 0.3s",
      "overflow-x": "hidden",
    }}>
      <Show when={showConfetti()}>
        <Confetti />
      </Show>
      <ThemeToggle theme={theme()} onToggle={toggleTheme} />

      <div style={{
        "max-width": "1024px",
        margin: "0 auto",
        padding: "0 16px 80px",
      }}>
        {/* Hero */}
        <header class="display-hero" style={{
          "text-align": "center",
          padding: "40px 16px 64px",
        }}>
          <div class="hero-age glow font-mono" style={{
            "font-size": "clamp(6rem, 25vw, 12rem)",
            "font-weight": "700",
            "line-height": "1",
            color: "var(--primary)",
            "margin-bottom": "8px",
          }}>
            {age()}
          </div>

          <h1 style={{
            "font-size": "clamp(1.5rem, 5vw, 2.5rem)",
            "font-weight": "600",
            color: "var(--foreground)",
            "margin-bottom": "16px",
          }}>
            Happy Birthday {store.name}
          </h1>

          <p style={{
            "font-size": "clamp(1rem, 3vw, 1.25rem)",
            color: "var(--muted-foreground)",
            "line-height": "1.6",
            "max-width": "500px",
            margin: "0 auto 12px",
          }}>
            You are {ageWord()}
          </p>

          <p class="glow font-mono" style={{
            "font-size": "clamp(1rem, 3vw, 1.25rem)",
            color: "var(--primary)",
            "font-weight": "600",
            "margin-bottom": "32px",
          }}>
            {formatDate(store.dob)}
          </p>

          <p style={{
            "font-size": "13px",
            color: "var(--muted-foreground)",
            opacity: "0.7",
          }}>
            Tap any card to see the math. Tap the gear to adjust variables.
          </p>
        </header>

        {/* Sections */}
        <div style={{ display: "flex", "flex-direction": "column", gap: "40px" }}>
          <Section name="Time Alive" facts={[Years, Months, Weeks, Days, Hours, Minutes, Seconds]} />
          <Section name="Sleep" params={sleepParams} facts={[TotalHoursSlept, DaysSpentSleeping, YearsAsleep]} />
          <Section name="Heartbeats" params={heartbeatParams} facts={[TotalBeats, BeatsPerDay, MillionsOfBeats]} />
          <Section name="Steps & Distance" params={stepsParams} facts={[TotalSteps, TotalFeet, MilesWalked, DistanceComparison]} />
          <Section name="Space Travel" facts={[TripsAroundSun, MilesFromRotation, MilesAroundSun, MoonTrips, ThroughTheGalaxy]} />

          <div>
            <div class="section-header" style={{ 'margin-bottom': '16px' }}>
              <h2 style={{ 'font-size': '20px', 'font-weight': '600', color: 'var(--foreground)' }}>Fun Facts</h2>
              <p style={{ 'font-size': '13px', color: 'var(--muted-foreground)', 'margin-top': '2px' }}>
                tap to see the math
              </p>
            </div>
            <Prose facts={[Blinks, Breaths, Meals, Poops, HairGrowth]} />
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          "margin-top": "64px",
          "padding-top": "24px",
          "border-top": "1px solid var(--border)",
          "text-align": "center",
        }}>
          <p style={{ "font-size": "13px", color: "var(--muted-foreground)" }}>
            Made with curiosity and math
          </p>
        </footer>
      </div>
    </main>
  )
}
