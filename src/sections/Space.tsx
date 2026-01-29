import { createSignal, onMount, onCleanup, JSX } from "solid-js"
import { StatCard } from "../components/StatCard"
import { getSpaceMetrics, SPACE_CONSTANTS } from "../utils/metrics"
import { formatNumber, formatCompact } from "../utils/format"

interface SpaceProps {
  birthDate: Date
}

export function Space(props: SpaceProps): JSX.Element {
  const [now, setNow] = createSignal(new Date())

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  const hoursAlive = () => (now().getTime() - props.birthDate.getTime()) / (1000 * 60 * 60)
  const yearsAlive = () => hoursAlive() / 24 / 365.25
  const space = () => getSpaceMetrics(hoursAlive(), yearsAlive())

  return (
    <section>
      <div class="section-header" style={{ "margin-bottom": "16px" }}>
        <h2 style={{ "font-size": "20px", "font-weight": "600", color: "var(--foreground)" }}>Space Travel</h2>
        <p style={{ "font-size": "13px", color: "var(--muted-foreground)", "margin-top": "2px" }}>without leaving Earth</p>
      </div>

      <div class="mobile-scroll-container" style={{ display: "grid", "grid-template-columns": "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
        <StatCard
          title="Trips Around Sun"
          headline={formatNumber(space().orbitsAroundSun, 3)}
          subtitle="1 trip = 1 year"
          accentColor="warm"
          live
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Earth takes 1 year to orbit the sun:</p>
              <p>trips = years alive</p>
              <p style={{ "font-weight": "600" }}>= {space().orbitsAroundSun.toFixed(3)} orbits</p>
              <p style={{ "font-size": "12px", color: "var(--muted-foreground)", "margin-top": "8px" }}>
                Each orbit is about 584 million miles!
              </p>
            </div>
          }
        />

        <StatCard
          title="Miles from Rotation"
          headline={formatCompact(space().milesFromRotation)}
          subtitle={`Earth spins at ${formatNumber(SPACE_CONSTANTS.ROTATION_MPH)} mph`}
          accentColor="cool"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Earth spins once per day:</p>
              <p>{formatNumber(Math.floor(hoursAlive()))} hrs × {formatNumber(SPACE_CONSTANTS.ROTATION_MPH)} mph</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(Math.floor(space().milesFromRotation))} miles</p>
            </div>
          }
        />

        <StatCard
          title="Miles Around Sun"
          headline={formatCompact(space().milesAroundSun)}
          subtitle={`orbiting at ${formatNumber(SPACE_CONSTANTS.ORBIT_MPH)} mph`}
          accentColor="earth"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Earth orbits the sun:</p>
              <p>{formatNumber(Math.floor(hoursAlive()))} hrs × {formatNumber(SPACE_CONSTANTS.ORBIT_MPH)} mph</p>
              <p style={{ "font-weight": "600" }}>= {space().milesAroundSun.toExponential(2)} miles</p>
            </div>
          }
        />

        <StatCard
          title="Moon Trips"
          headline={formatNumber(space().moonTrips)}
          subtitle={`could reach the Moon ${formatNumber(Math.floor(space().moonTrips))}×`}
          accentColor="neutral"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Moon is {formatNumber(SPACE_CONSTANTS.MOON_DISTANCE)} miles away:</p>
              <p>{space().milesAroundSun.toExponential(2)} ÷ {formatNumber(SPACE_CONSTANTS.MOON_DISTANCE)}</p>
              <p style={{ "font-weight": "600" }}>= {formatNumber(Math.floor(space().moonTrips))} trips</p>
            </div>
          }
        />

        <StatCard
          title="Through the Galaxy"
          headline={formatCompact(space().milesThroughGalaxy)}
          subtitle={`at ${formatNumber(SPACE_CONSTANTS.GALAXY_MPH)} mph`}
          accentColor="cool"
          mathContent={
            <div style={{ display: "flex", "flex-direction": "column", gap: "8px" }}>
              <p style={{ color: "var(--muted-foreground)", "font-size": "12px" }}>Our solar system moves through the Milky Way:</p>
              <p>{formatNumber(Math.floor(hoursAlive()))} hrs × {formatNumber(SPACE_CONSTANTS.GALAXY_MPH)} mph</p>
              <p style={{ "font-weight": "600" }}>= {space().milesThroughGalaxy.toExponential(2)} miles</p>
              <p style={{ "font-size": "12px", color: "var(--muted-foreground)", "margin-top": "8px" }}>
                You are a space traveler and you didn't even know it!
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
