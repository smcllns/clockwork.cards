import { createSignal, onMount, onCleanup, JSX } from "solid-js"
import { StatCard } from "../components/StatCard"
import { Slider } from "../components/Slider"
import { getHeartbeatMetrics } from "../utils/metrics"
import { formatNumber, formatCompact } from "../utils/format"

interface HeartbeatsProps {
  birthDate: Date
}

export function Heartbeats(props: HeartbeatsProps): JSX.Element {
  const [bpm, setBpm] = createSignal(90)
  const [now, setNow] = createSignal(new Date())

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  const minutesAlive = () => (now().getTime() - props.birthDate.getTime()) / (1000 * 60)
  const heart = () => getHeartbeatMetrics(minutesAlive(), bpm())

  const settingsSlider = () => (
    <div>
      <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", color: "var(--muted-foreground)", "margin-bottom": "8px" }}>
        <span>Heart rate (BPM)</span>
        <span class="font-mono" style={{ "font-weight": "600", color: "var(--foreground)" }}>{bpm()}</span>
      </div>
      <Slider value={bpm()} onChange={setBpm} min={60} max={120} step={1} />
      <div style={{ display: "flex", "justify-content": "space-between", "font-size": "10px", color: "var(--muted-foreground)", "margin-top": "4px" }}>
        <span>60 resting</span>
        <span>90 average</span>
        <span>120 active</span>
      </div>
    </div>
  )

  return (
    <section>
      <div class="section-header" style={{ "margin-bottom": "16px" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600", color: "var(--foreground)" }}>Heartbeats</h2>
        <p style={{ "font-size": "13px", color: "var(--muted-foreground)", "margin-top": "2px" }}>at {bpm()} beats per minute</p>
      </div>

      <div class="mobile-scroll-container" style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        <StatCard
          title="Total Heartbeats"
          headline={formatCompact(heart().totalBeats)}
          subtitle={`${heart().millions.toFixed(1)} million`}
          accentColor="warm"
          live
          settingsContent={settingsSlider()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>BPM = Beats Per Minute</p>
              <p>minutes alive × BPM</p>
              <p>{formatNumber(Math.floor(minutesAlive()))} × {bpm()}</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(Math.floor(heart().totalBeats))}</p>
            </div>
          }
        />

        <StatCard
          title="Beats Per Day"
          headline={formatNumber(heart().beatsPerDay)}
          subtitle={`${bpm()} × 60 × 24`}
          accentColor="warm"
          settingsContent={settingsSlider()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>How many beats in one day:</p>
              <p>{bpm()} beats/min × 60 min/hr × 24 hr/day</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(heart().beatsPerDay)} beats/day</p>
            </div>
          }
        />

        <StatCard
          title="Millions of Beats"
          headline={formatNumber(heart().millions, 1)}
          subtitle="and counting"
          accentColor="earth"
          live
          settingsContent={settingsSlider()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Dividing by 1,000,000:</p>
              <p>{formatNumber(Math.floor(heart().totalBeats))} ÷ 1,000,000</p>
              <p style={{ "font-weight": "600" }}>= {heart().millions.toFixed(1)} million</p>
              <p style={{ "font-size": "12px", color: "var(--muted-foreground)", "margin-top": "8px" }}>
                Your heart never stops! It beats about 100,000 times every single day.
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
