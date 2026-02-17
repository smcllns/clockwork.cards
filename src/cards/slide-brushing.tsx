import { useState } from "react";
import { Slide, Narrative, Body, N } from "../components/slide";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, BLINKS_PER_DAY, BRUSH_STROKES_PER_MIN } from "../constants";
import { daysSinceAge, fmtBig } from "../utils";

export default function BrushingCard({ dob }: { dob: string }) {
  const [minutes, setMinutes] = useState(2);
  const [startAge, setStartAge] = useState(3);
  const now = useNow();
  const dobDate = new Date(dob);
  const minutesTotal = daysSinceAge(dobDate, startAge, now) * minutes * 2;
  const brushingDays = minutesTotal / (60 * 24);
  const brushStrokes = minutesTotal * BRUSH_STROKES_PER_MIN;
  const daysAlive = Math.floor((now - dobDate.getTime()) / MS_PER_DAY);
  const totalBlinks = daysAlive * BLINKS_PER_DAY;

  return (
    <Slide id="4b">
      <Narrative>
        If you spend{" "}
        <InlineStepper value={minutes} min={1} max={5} step={1} unit=" min"
          onChange={setMinutes} />{" "}
        brushing your teeth every morning and night since age{" "}
        <InlineStepper value={startAge} min={1} max={5} step={1}
          onChange={setStartAge} />{" "}
        , you've spent over <N>{brushingDays.toFixed(1)} solid days</N> brushing,
        and done over <N>{fmtBig(brushStrokes)} brush strokes</N>!
      </Narrative>
      <Body>
        Think that's a lot? You've blinked about {fmtBig(totalBlinks)} times so far.
      </Body>
    </Slide>
  );
}
