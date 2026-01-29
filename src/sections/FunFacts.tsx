import { createSignal, onMount, onCleanup, For, JSX } from "solid-js"
import { getTimeAlive, getHeartbeatMetrics, getSpaceMetrics } from "../utils/metrics"
import { formatNumber, formatCompact } from "../utils/format"

interface FunFactsProps {
  birthDate: Date
  name: string
}

interface Fact {
  text: string
  math: string
}

export function FunFacts(props: FunFactsProps): JSX.Element {
  const [now, setNow] = createSignal(new Date())
  const [expanded, setExpanded] = createSignal<number | null>(null)

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 5000)
    onCleanup(() => clearInterval(interval))
  })

  const t = () => getTimeAlive(props.birthDate, now())
  const heart = () => getHeartbeatMetrics(t().minutes, 90)
  const space = () => getSpaceMetrics(t().hours, t().yearsExact)

  const facts = (): Fact[] => [
    {
      text: `${props.name} has been alive for ${formatNumber(t().days)} days`,
      math: `${t().years} years × 365.25 days/year + extra days = ${formatNumber(t().days)} days`,
    },
    {
      text: `${props.name}'s heart has beaten about ${formatCompact(heart().totalBeats)} times`,
      math: `${formatNumber(t().minutes)} minutes × 90 bpm = ${formatNumber(Math.floor(heart().totalBeats))}`,
    },
    {
      text: `${props.name} has orbited the sun ${t().yearsExact.toFixed(2)} times`,
      math: `Earth completes 1 orbit per year, so years alive = orbits`,
    },
    {
      text: `${props.name} has traveled ${formatCompact(space().milesThroughGalaxy)} miles through the galaxy`,
      math: `${formatNumber(t().hours)} hours × 450,000 mph = ${space().milesThroughGalaxy.toExponential(2)} miles`,
    },
    {
      text: `${props.name} has lived through about ${formatNumber(t().weeks)} weekends`,
      math: `${formatNumber(t().days)} days ÷ 7 = ${formatNumber(t().weeks)} weeks (each with a weekend!)`,
    },
  ]

  return (
    <section>
      <div class="section-header" style={{ "margin-bottom": "16px" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600", color: "var(--foreground)" }}>Fun Facts</h2>
        <p style={{ "font-size": "13px", color: "var(--muted-foreground)", "margin-top": "2px" }}>tap to see the math</p>
      </div>

      <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
        <For each={facts()}>
          {(fact, i) => (
            <div
              onClick={() => setExpanded(expanded() === i() ? null : i())}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                "border-radius": "var(--radius)",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              class="card-glow"
            >
              <p style={{ "font-size": "16px", color: "var(--foreground)", "line-height": "1.5" }}>
                {fact.text}
              </p>
              {expanded() === i() && (
                <p class="font-mono" style={{
                  "font-size": "13px",
                  color: "var(--muted-foreground)",
                  "margin-top": "8px",
                  "padding-top": "8px",
                  "border-top": "1px solid var(--border)",
                }}>
                  {fact.math}
                </p>
              )}
            </div>
          )}
        </For>
      </div>
    </section>
  )
}
