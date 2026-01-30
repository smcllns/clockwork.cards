// canvas/Canvas.tsx — the page layout
//
// Canvas authors compose helper components into the page.
// No config arrays — the JSX IS the layout.

import { JSX } from 'solid-js'
import { Section } from './canvas-Section'
import { Prose } from './widget-Prose'
import { TotalBeats, BeatsPerDay, Millions, params as heartbeatParams } from './model-heartbeats'

// Simple facts — no params needed
const TotalPoops = ({ now, dob, name }) => ({
  title: 'Total Poops',
  value: Math.round(((now.getTime() - dob.getTime()) / 86400000) * 1.25),
  prose: `Assuming 1.25 poops/day, ${name} has pooped about ${Math.round(((now.getTime() - dob.getTime()) / 86400000) * 1.25)} times!`,
})

export function Canvas(): JSX.Element {
  return (
    <>
      {/* <Hero /> */}

      <Section name="Heartbeats" params={heartbeatParams}
               facts={[TotalBeats, BeatsPerDay, Millions]} />

      <h2>The Fun Bit</h2>
      <Prose facts={[TotalPoops]} />

      {/* <Divider /> */}
      {/* <Footer /> */}
    </>
  )
}
