import { useState } from "react";
import { Slide, Narrative, Body, N } from "../components/slide";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";


const BLINKS_PER_DAY = 15_000;
const BRUSH_STROKES_PER_MIN = 170;
import { daysSinceAge } from "../utils";

export default function BrushingCard({ dob, name }: { dob: string; name: string }) {
  const [minutes, setMinutes] = useState(2);
  const [startAge, setStartAge] = useState(3);
  const now = useNow();
  const dobDate = new Date(dob);
  const minutesTotal = daysSinceAge(dobDate, startAge, now) * minutes * 2;
  const brushingDays = minutesTotal / (60 * 24);
  const brushStrokes = minutesTotal * BRUSH_STROKES_PER_MIN;
  const daysAlive = Math.floor((now - dobDate.getTime()) / 86_400_000);
  const totalBlinks = daysAlive * BLINKS_PER_DAY;

  return (
    <Slide id="4b">
      <Narrative>
        If {name} spends{" "}
        <InlineStepper value={minutes} min={1} max={5} step={0.5} unit=" min"
          onChange={setMinutes} />{" "}
        brushing teeth each morning and night &mdash; so <N>{minutes*2} minutes</N> total each day &mdash; that's over <N>{(brushStrokes / 1e6).toFixed(1)} million brush strokes</N> so far!
      </Narrative>
      <Body>
        Think that's a lot? {name}'s eyes have blinked about {(totalBlinks / 1e6).toFixed(1)} million times. Getting the reps in!
      </Body>
      <Body>
        Assuming: [make these changeable:]
        <ul>
          <li>170 brush strokes per minute</li>
          <li>15,000 blinks per day</li>
        </ul>
      </Body>
      {/* <Body>
        And at [STEPPER: 80] beats per minute, {name}'s heart has beat around {(totalBlinks / 1e6).toFixed(0)} million times.
      </Body> */}
    </Slide>
  );
}
