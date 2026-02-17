import { useState } from "react";
import { Slide, Narrative, N } from "../components/slide";
import { InlineStepper, InlineSlider } from "../components/controls";
import { useNow } from "../components/useNow";
import { daysSinceAge, fmtBig } from "../utils";

export default function StepsCard({ dob }: { dob: string; name: string }) {
  const [stepsPerDay, setStepsPerDay] = useState(8_000);
  const [startAge, setStartAge] = useState(3);
  const now = useNow();
  const totalSteps = daysSinceAge(new Date(dob), startAge, now) * stepsPerDay;

  return (
    <Slide id="4a">
      <Narrative>
        If you've walked{" "}
        <InlineSlider value={stepsPerDay} min={2000} max={15000} step={1000}
          onChange={setStepsPerDay} />{" "}
        steps a day since you were{" "}
        <InlineStepper value={startAge} min={1} max={5} step={1}
          onChange={setStartAge} />{" "}
        , you've taken about <N>{fmtBig(totalSteps)} steps</N> in your life so far.
      </Narrative>
    </Slide>
  );
}
