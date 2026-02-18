import { useState } from "react";
import { Slide, Narrative, N, KeyMetric, Headline, Unit } from "./slide";
import { InlineStepper, InlineSlider } from "./controls";
import { useNow } from "../lib/useNow";
import { getAge, daysSinceAge, his, he } from "../lib/utils";

export default function StepsCard({ dob, name, pronouns }: { dob: Date; name: string; pronouns: "m" | "f" }) {
  const [stepsPerDay, setStepsPerDay] = useState(8_000);
  const [startAge, setStartAge] = useState(3);
  const now = useNow();
  const totalSteps = daysSinceAge(dob, startAge, now) * stepsPerDay;

  return (
    <Slide id="4a">
      <Headline>{name} has walked ...</Headline>
      <KeyMetric>{(totalSteps / 1e6).toFixed(1)} million steps</KeyMetric>
      <Unit>so far in {his(pronouns)} {getAge(dob, now, 2)} years</Unit>

      <Narrative className="pt-8">
        That is, assuming {he(pronouns)} walks{" "}
        <InlineSlider value={stepsPerDay} min={2000} max={15000} step={1000}
          onChange={setStepsPerDay} />{" "}
        steps a day since {he(pronouns)} was{" "}
        <InlineStepper value={startAge} min={1} max={5} step={1}
          onChange={setStartAge} /> years old.
      </Narrative>
    </Slide>
  );
}
