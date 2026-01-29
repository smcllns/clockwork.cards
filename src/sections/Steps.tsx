import { createSignal, onMount, onCleanup, JSX } from "solid-js"
import { StatCard } from "../components/StatCard"
import { Slider } from "../components/Slider"
import { getStepsMetrics, getDistanceComparison } from "../utils/metrics"
import { formatNumber, formatCompact } from "../utils/format"

interface StepsProps {
  birthDate: Date
}

export function Steps(props: StepsProps): JSX.Element {
  const [stepsPerDay, setStepsPerDay] = createSignal(8000)
  const [strideInches, setStrideInches] = createSignal(20)
  const [walkingAge, setWalkingAge] = createSignal(1)
  const [now, setNow] = createSignal(new Date())

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    onCleanup(() => clearInterval(interval))
  })

  const steps = () => getStepsMetrics(props.birthDate, now(), walkingAge(), stepsPerDay(), strideInches())
  const strideFeet = () => strideInches() / 12

  const settingsContent = () => (
    <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
      <div>
        <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", color: "var(--muted-foreground)", "margin-bottom": "8px" }}>
          <span>Steps per day</span>
          <span class="font-mono" style={{ "font-weight": "600", color: "var(--foreground)" }}>{formatNumber(stepsPerDay())}</span>
        </div>
        <Slider value={stepsPerDay()} onChange={setStepsPerDay} min={3000} max={15000} step={500} />
      </div>
      <div>
        <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", color: "var(--muted-foreground)", "margin-bottom": "8px" }}>
          <span>Stride length</span>
          <span class="font-mono" style={{ "font-weight": "600", color: "var(--foreground)" }}>{strideInches()}"</span>
        </div>
        <Slider value={strideInches()} onChange={setStrideInches} min={12} max={30} step={1} />
      </div>
      <div>
        <div style={{ display: "flex", "justify-content": "space-between", "font-size": "12px", color: "var(--muted-foreground)", "margin-bottom": "8px" }}>
          <span>Started walking at</span>
          <span class="font-mono" style={{ "font-weight": "600", color: "var(--foreground)" }}>{walkingAge()} yr</span>
        </div>
        <Slider value={walkingAge()} onChange={setWalkingAge} min={0.5} max={2} step={0.25} />
      </div>
    </div>
  )

  return (
    <section>
      <div class="section-header" style={{ "margin-bottom": "16px" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600", color: "var(--foreground)" }}>Steps & Distance</h2>
        <p style={{ "font-size": "13px", color: "var(--muted-foreground)", "margin-top": "2px" }}>{steps().yearsWalking.toFixed(1)} years of walking</p>
      </div>

      <div class="mobile-scroll-container" style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        <StatCard
          title="Total Steps"
          headline={formatCompact(steps().totalSteps)}
          subtitle={`${formatNumber(stepsPerDay())}/day × ${formatNumber(Math.floor(steps().daysWalking))} days`}
          accentColor="cool"
          settingsContent={settingsContent()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Steps = days walking × steps per day</p>
              <p>{formatNumber(Math.floor(steps().daysWalking))} × {formatNumber(stepsPerDay())}</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(Math.floor(steps().totalSteps))} steps</p>
            </div>
          }
        />

        <StatCard
          title="Total Feet"
          headline={formatCompact(steps().totalFeet)}
          subtitle={`${strideInches()}" stride`}
          accentColor="cool"
          settingsContent={settingsContent()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Convert stride to feet, then multiply:</p>
              <p>{strideInches()}" ÷ 12 = {strideFeet().toFixed(2)} ft/step</p>
              <p>{formatNumber(Math.floor(steps().totalSteps))} × {strideFeet().toFixed(2)}</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(Math.floor(steps().totalFeet))} feet</p>
            </div>
          }
        />

        <StatCard
          title="Miles Walked"
          headline={formatNumber(steps().totalMiles, 1)}
          subtitle="feet ÷ 5,280"
          accentColor="earth"
          settingsContent={settingsContent()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>There are 5,280 feet in a mile:</p>
              <p>{formatNumber(Math.floor(steps().totalFeet))} ÷ 5,280</p>
              <p style={{ "font-weight": "600" }}>= {steps().totalMiles.toFixed(1)} miles</p>
            </div>
          }
        />

        <StatCard
          title="That's Like..."
          headline={getDistanceComparison(steps().totalMiles)}
          subtitle={`${steps().totalMiles.toFixed(0)} miles`}
          accentColor="warm"
          settingsContent={settingsContent()}
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Distance comparisons:</p>
              <p style={{ "font-size": "12px" }}>NYC to DC: ~225 mi</p>
              <p style={{ "font-size": "12px" }}>NYC to Chicago: ~790 mi</p>
              <p style={{ "font-size": "12px" }}>NYC to LA: ~2,800 mi</p>
              <p style={{ "font-weight": "600", "margin-top": "8px" }}>You've walked {steps().totalMiles.toFixed(0)} miles!</p>
            </div>
          }
        />
      </div>
    </section>
  )
}
