import { createSignal, onMount, onCleanup, JSX } from "solid-js"
import { StatCard } from "../components/StatCard"
import { getTimeAlive } from "../utils/metrics"
import { formatNumber, formatShortDate } from "../utils/format"

interface TimeAliveProps {
  birthDate: Date
}

export function TimeAlive(props: TimeAliveProps): JSX.Element {
  const [now, setNow] = createSignal(new Date())

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  const t = () => getTimeAlive(props.birthDate, now())

  return (
    <section>
      <div class="section-header" style={{ "margin-bottom": "16px" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600", color: "var(--foreground)" }}>Time Alive</h2>
        <p style={{ "font-size": "13px", color: "var(--muted-foreground)", "margin-top": "2px" }}>
          since {formatShortDate(props.birthDate)}
        </p>
      </div>

      <div class="mobile-scroll-container" style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        <StatCard
          title="Years"
          headline={formatNumber(t().years)}
          subtitle={`${(t().yearsExact % 1 * 100).toFixed(1)}% through year ${t().years + 1}`}
          accentColor="warm"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Starting from {t().years} years:</p>
              <p>{t().years} years = {t().years} × 365.25 days</p>
              <p>= {formatNumber(Math.floor(t().years * 365.25))} days</p>
              <p style={{ "font-size": "12px", color: "var(--muted-foreground)", "margin-top": "8px" }}>
                We use 365.25 to account for leap years (one extra day every 4 years).
              </p>
            </div>
          }
        />

        <StatCard
          title="Months"
          headline={formatNumber(t().months)}
          subtitle={`${t().years} yrs × 12 + ${t().months % 12}`}
          accentColor="warm"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>From {t().years} years:</p>
              <p>{t().years} years × 12 months/year</p>
              <p>= {t().years * 12} months</p>
              <p>+ {t().months - (t().years * 12)} extra months</p>
              <p style={{ "font-weight": "600" }}>= {t().months} months</p>
            </div>
          }
        />

        <StatCard
          title="Weeks"
          headline={formatNumber(t().weeks)}
          subtitle={`${formatNumber(t().days)} days ÷ 7`}
          accentColor="cool"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>From {t().years} years:</p>
              <p>{t().years} years × 365.25 ÷ 7</p>
              <p>= {formatNumber(Math.floor(t().years * 365.25 / 7))} weeks</p>
              <p>+ {t().weeks - Math.floor(t().years * 365.25 / 7)} extra weeks</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(t().weeks)} weeks</p>
            </div>
          }
        />

        <StatCard
          title="Days"
          headline={formatNumber(t().days)}
          subtitle={`${t().years} years × 365.25`}
          accentColor="cool"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>From {t().years} years:</p>
              <p>{t().years} years × 365.25 days/year</p>
              <p>= {formatNumber(Math.floor(t().years * 365.25))} days</p>
              <p>+ {t().days - Math.floor(t().years * 365.25)} extra days</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(t().days)} days</p>
            </div>
          }
        />

        <StatCard
          title="Hours"
          headline={formatNumber(t().hours)}
          subtitle={`${formatNumber(t().days)} days × 24`}
          accentColor="earth"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>From {formatNumber(t().days)} days:</p>
              <p>{formatNumber(t().days)} days × 24 hours/day</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(t().hours)} hours</p>
            </div>
          }
        />

        <StatCard
          title="Minutes"
          headline={formatNumber(t().minutes)}
          subtitle={`${formatNumber(t().hours)} hrs × 60`}
          accentColor="earth"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>From {formatNumber(t().hours)} hours:</p>
              <p>{formatNumber(t().hours)} hours × 60 min/hour</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(t().minutes)} minutes</p>
            </div>
          }
        />

        <StatCard
          title="Seconds"
          headline={formatNumber(t().seconds)}
          subtitle="updating live"
          accentColor="neutral"
          live
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>From {formatNumber(t().minutes)} minutes:</p>
              <p>{formatNumber(t().minutes)} min × 60 sec/min</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(t().seconds)} seconds</p>
              <p style={{ "font-size": "12px", color: "var(--muted-foreground)", "margin-top": "12px" }}>
                Fun fact: Computers measure time in milliseconds since January 1, 1970.
                Right now that number is {formatNumber(t().diffMs)} ms!
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
