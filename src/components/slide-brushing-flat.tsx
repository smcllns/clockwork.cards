import { useState } from "react";
import { Slide } from "../page/slide";
import { InlineStepper } from "../page/controls";
import { useNow } from "../lib/useNow";
import { daysSinceAge } from "../lib/utils";
import { MS_PER_DAY, AVG_BLINKS_PER_DAY } from "../lib/constants";

export default function BrushingCardFlat({ dob, name }: { dob: Date; name: string }) {
  const [minutes, setMinutes] = useState(2);
  const [strokesPerMin, setStrokesPerMin] = useState(170);
  const [blinksPerDay, setBlinksPerDay] = useState(AVG_BLINKS_PER_DAY);
  const now = useNow();
  const minutesTotal = daysSinceAge(dob, 3, now) * minutes * 2;
  const brushStrokes = minutesTotal * strokesPerMin;
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const totalBlinks = daysAlive * blinksPerDay;

  return (
    <Slide id="4b-flat">
      <main>
        <p>
          If {name} spends <InlineStepper value={minutes} min={0} max={10} step={0.5} unit=" min" onChange={setMinutes} /> brushing teeth each
          morning and night &mdash; so <strong>{minutes * 2} minutes</strong> each day &mdash; that's over{" "}
          <strong>{(brushStrokes / 1e6).toFixed(1)} million brush strokes*</strong> so far!
        </p>
      </main>
      <footer>
        <p>Think that's a lot? {name}'s eyes have blinked about {(totalBlinks / 1e6).toFixed(1)} million times. Getting the reps in!</p>
        <p>* assuming: <InlineStepper value={strokesPerMin} min={100} max={300} step={10} onChange={setStrokesPerMin} /> brush strokes per minute</p>
      </footer>
    </Slide>
  );
}
