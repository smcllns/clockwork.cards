import { JSX } from 'solid-js'
import { useStore } from './store'
import { Section } from './Section'
import { Prose } from './Prose'
import { getAge } from '../lib/time'

import { Years, Days, Seconds } from '../models/time-alive'
import { TotalBeats, BeatsPerDay, params as heartbeatParams } from '../models/heartbeats'
import { Poops, Breaths } from '../models/fun-facts'

export function Dev(): JSX.Element {
  const store = useStore()
  const age = () => getAge(store.dob, store.now())

  return (
    <main style={{
      "min-height": "100vh",
      background: "var(--background)",
      "overflow-x": "hidden",
    }}>
      <div style={{
        "max-width": "800px",
        margin: "0 auto",
        padding: "40px 16px 80px",
      }}>
        <header style={{ "text-align": "center", "margin-bottom": "48px" }}>
          <div class="font-mono" style={{
            "font-size": "clamp(4rem, 20vw, 8rem)",
            "font-weight": "700",
            "line-height": "1",
            color: "var(--primary)",
          }}>
            {age()}
          </div>
          <h1 style={{ "font-size": "1.5rem", "font-weight": "600", color: "var(--foreground)", "margin-top": "8px" }}>
            {store.name}'s Stats
          </h1>
          <p style={{ "font-size": "13px", color: "var(--muted-foreground)", "margin-top": "8px" }}>
            Dev sandbox — edit this canvas freely
          </p>
        </header>

        <div style={{ display: "flex", "flex-direction": "column", gap: "40px" }}>
          <Section name="Quick Stats" facts={[Years, Days, Seconds]} />
          <Section name="Heart" params={heartbeatParams} facts={[TotalBeats, BeatsPerDay]} />
          <Prose facts={[Poops, Breaths]} />
        </div>
      </div>
    </main>
  )
}
