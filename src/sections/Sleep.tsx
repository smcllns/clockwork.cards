import { createSignal, onMount, onCleanup, JSX } from "solid-js"
import { StatCard } from "../components/StatCard"
import { Slider } from "../components/Slider"
import { getSleepMetrics, getTimeAlive } from "../utils/metrics"
import { formatNumber, formatCompact } from "../utils/format"

interface SleepProps {
  birthDate: Date
}

export function Sleep(props: SleepProps): JSX.Element {
  const [sleepHours, setSleepHours] = createSignal(10)
  const [now, setNow] = createSignal(new Date())

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    onCleanup(() => clearInterval(interval))
  })

  const t = () => getTimeAlive(props.birthDate, now())
  const sleep = () => getSleepMetrics(t().days + (t().hours % 24) / 24, sleepHours())

  const settingsSlider = () => (
    <div>
      <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", color: "var(--muted-foreground)", "margin-bottom": "8px" }}>
        <span>Hours per night</span>
        <span class="font-mono" style={{ "font-weight": "600", color: "var(--foreground)" }}>{sleepHours()}h</span>
      </div>
      <Slider value={sleepHours()} onChange={setSleepHours} min={6} max={14} step={0.5} />
      <div style={{ display: "flex", "justify-content": "space-between", "font-size": "10px", color: "var(--muted-foreground)", "margin-top": "4px" }}>
        <span>6h</span>
        <span>10h (recommended)</span>
        <span>14h</span>
      </div>
    </div>
  )

  return (
    <section>
      <div class="section-header" style={{ "margin-bottom": "16px" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600", color: "var(--foreground)" }}>Sleep</h2>
        <p style={{ "font-size": "13px", color: "var(--muted-foreground)", "margin-top": "2px" }}>at {sleepHours()} hours per night</p>
      </div>

      <div class="mobile-scroll-container" style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        <StatCard
          title="Total Hours Slept"
          headline={formatCompact(sleep().totalHours)}
          subtitle={`${formatNumber(Math.floor(sleep().totalHours))} hours exactly`}
          accentColor="cool"
          settingsContent={settingsSlider()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Formula:</p>
              <p>days alive × hours per night</p>
              <p>{formatNumber(t().days)} × {sleepHours()}</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(Math.floor(sleep().totalHours))} hours</p>
            </div>
          }
        />

        <StatCard
          title="Days Spent Sleeping"
          headline={formatNumber(sleep().totalDays, 1)}
          subtitle="full 24-hour days"
          accentColor="cool"
          settingsContent={settingsSlider()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Converting hours to days:</p>
              <p>{formatNumber(Math.floor(sleep().totalHours))} hours ÷ 24</p>
              <p style={{ "font-weight": "600" }}>= {sleep().totalDays.toFixed(1)} days</p>
            </div>
          }
        />

        <StatCard
          title="Years Asleep"
          headline={formatNumber(sleep().totalYears, 2)}
          subtitle={`${sleep().percentLife.toFixed(0)}% of your life`}
          accentColor="earth"
          settingsContent={settingsSlider()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Converting days to years:</p>
              <p>{sleep().totalDays.toFixed(1)} days ÷ 365.25</p>
              <p style={{ "font-weight": "600" }}>= {sleep().totalYears.toFixed(2)} years</p>
              <p style={{ "font-size": "12px", color: "var(--muted-foreground)", "margin-top": "8px" }}>
                Out of {t().years} years alive, you have been asleep for {sleep().totalYears.toFixed(1)} of them!
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
