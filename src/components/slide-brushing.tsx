import { useState } from "react";
import { Slide, Narrative, Body, N } from "./slide";
import { InlineStepper } from "./controls";
import { useNow } from "./useNow";
import { daysSinceAge } from "../lib/utils";

export default function BrushingCard({ dob, name }: { dob: Date; name: string }) {
  const [minutes, setMinutes] = useState(2);
  const [startAge, setStartAge] = useState(3);
  const [strokesPerMin, setStrokesPerMin] = useState(170);
  const [blinksPerDay, setBlinksPerDay] = useState(15_000);
  const now = useNow();
  const minutesTotal = daysSinceAge(dob, startAge, now) * minutes * 2;
  const brushStrokes = minutesTotal * strokesPerMin;
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const totalBlinks = daysAlive * blinksPerDay;

  return (
    <Slide id="4b">
      <Narrative>
        If {name} spends <InlineStepper value={minutes} min={0} max={10} step={0.5} unit=" min" onChange={setMinutes} /> brushing teeth each
        morning and night &mdash; so <N>{minutes * 2} minutes</N> each day &mdash; that's over{" "}
        <N>{(brushStrokes / 1e6).toFixed(1)} million brush strokes*</N> so far!
      </Narrative>
      <Body>
        Think that's a lot? {name}'s eyes have blinked about {(totalBlinks / 1e6).toFixed(1)} million times. Getting the reps in!
      </Body>
      <Body>
        * assuming: <InlineStepper value={strokesPerMin} min={100} max={300} step={10} onChange={setStrokesPerMin} /> brush strokes per
        minute
      </Body>
    </Slide>
  );
}
