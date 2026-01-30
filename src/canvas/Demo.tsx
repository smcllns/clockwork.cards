import { createSignal, onMount, onCleanup, Show, JSX } from 'solid-js'
import { useStore } from './store'
import { Section } from './Section'
import { Prose } from './Prose'
import { Hero } from '../widgets/Hero'
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
        <Hero
          age={age()}
          name={store.name}
          dob={formatDate(store.dob)}
          subtitle={`You are ${ageWord()}`}
          hint="Tap any card to see the math"
        />

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
