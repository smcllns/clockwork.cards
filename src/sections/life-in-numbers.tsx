import { useState } from "react";
import { Slide, Headline, Narrative, N } from "../components/slide";
import { InlineStepper, InlineSlider } from "../components/controls";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, DAYS_PER_YEAR, BLINKS_PER_DAY, BRUSH_STROKES_PER_MIN } from "../constants";
import { daysSinceAge, fmtBig } from "../utils";

export default function LifeInNumbersCard({ dob }: { dob: string; name: string }) {
  const [stepsPerDay, setStepsPerDay] = useState(8_000);
  const [stepsStartAge, setStepsStartAge] = useState(3);
  const [brushMinutes, setBrushMinutes] = useState(2);
  const [brushStartAge, setBrushStartAge] = useState(3);
  const [hairCmPerMonth, setHairCmPerMonth] = useState(1.2);
  const [poopsPerDay, setPoopsPerDay] = useState(1.5);
  const now = useNow();

  const dobDate = new Date(dob);
  const msAlive = now - dobDate.getTime();
  const daysAlive = Math.floor(msAlive / MS_PER_DAY);
  const monthsAlive = msAlive / MS_PER_DAY / (DAYS_PER_YEAR / 12);

  const totalSteps = daysSinceAge(dobDate, stepsStartAge, now) * stepsPerDay;
  const brushMinutesTotal = daysSinceAge(dobDate, brushStartAge, now) * brushMinutes * 2;
  const brushingDays = brushMinutesTotal / (60 * 24);
  const brushStrokes = brushMinutesTotal * BRUSH_STROKES_PER_MIN;
  const totalBlinks = daysAlive * BLINKS_PER_DAY;
  const hairLengthCm = monthsAlive * hairCmPerMonth;
  const totalPoops = Math.floor(daysAlive * poopsPerDay);

  return (
    <Slide id="4">
      <Headline>Your life in numbers</Headline>
      <Narrative>
        If you've walked{" "}
        <InlineSlider value={stepsPerDay} min={2000} max={15000} step={1000}
          onChange={setStepsPerDay} />{" "}
        steps a day since you were{" "}
        <InlineStepper value={stepsStartAge} min={1} max={5} step={1}
          onChange={setStepsStartAge} />{" "}
        , you've taken about <N>{fmtBig(totalSteps)} steps</N> in your life so far.
      </Narrative>

      <Narrative>
        If you spend{" "}
        <InlineStepper value={brushMinutes} min={1} max={5} step={1} unit=" min"
          onChange={setBrushMinutes} />{" "}
        brushing your teeth every morning and night since age{" "}
        <InlineStepper value={brushStartAge} min={1} max={5} step={1}
          onChange={setBrushStartAge} />{" "}
        , you've spent over <N>{brushingDays.toFixed(1)} solid days</N> brushing,
        and done over <N>{fmtBig(brushStrokes)} brush strokes</N>!
      </Narrative>

      <Narrative sm>
        Think that's a lot? You've blinked about <N>{fmtBig(totalBlinks)} times</N> so far.
      </Narrative>

      <Narrative>
        Your hair grows about{" "}
        <InlineStepper value={hairCmPerMonth} min={0.5} max={2.0} step={0.1}
          unit=" cm" decimals={1} onChange={setHairCmPerMonth} />{" "}
        per month. If you'd never had a haircut, your hair would now be about{" "}
        <N>{(hairLengthCm / 100).toFixed(1)} meters</N> long!
      </Narrative>

      <Narrative>
        If you poop{" "}
        <InlineStepper value={poopsPerDay} min={0.5} max={4} step={0.5} decimals={1}
          onChange={setPoopsPerDay} />{" "}
        times per day on average, you've pooped around <N>{totalPoops.toLocaleString()} times</N> so far.
      </Narrative>
    </Slide>
  );
}
