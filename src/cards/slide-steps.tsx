import { useState } from "react";
import { Slide, Narrative, N, KeyMetric, Headline, Unit } from "../components/slide";
import { InlineStepper, InlineSlider } from "../components/controls";
import { useNow } from "../components/useNow";
import { getAge, daysSinceAge } from "../utils";

export default function StepsCard({ dob, name }: { dob: string; name: string }) {
  const [stepsPerDay, setStepsPerDay] = useState(8_000);
  const [startAge, setStartAge] = useState(3);
  const now = useNow();
  const totalSteps = daysSinceAge(new Date(dob), startAge, now) * stepsPerDay;

  return (
    <Slide id="4a">
      <Headline>{name} has walked ...</Headline>
      <KeyMetric>{(totalSteps / 1e6).toFixed(1)} million steps</KeyMetric>
      <Unit>so far in his {getAge(new Date(dob), now, 2)} years</Unit>

      <Narrative className="pt-8">
        That is, assuming he walks{" "}
        <InlineSlider value={stepsPerDay} min={2000} max={15000} step={1000}
          onChange={setStepsPerDay} />{" "}
        steps a day since he was{" "}
        <InlineStepper value={startAge} min={1} max={5} step={1}
          onChange={setStartAge} /> years old.
      </Narrative>
    </Slide>
  );
}
