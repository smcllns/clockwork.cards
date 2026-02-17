import { useState } from "react";
import { Slide, KeyMetric, Unit, Headline, Body } from "../components/slide";
import { InlineSlider, InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { daysSinceAge } from "../utils";

function hippoHeadline(yogurtKg: number): string {
  const ratio = yogurtKg / 40;
  if (ratio < 0.9) return `That's about ${Math.round(ratio * 100)}% the weight of a baby hippo.`;
  if (ratio < 1.15) return "About the weight of a baby hippo.";
  return `That's about ${(ratio).toFixed(1)} times the weight of a baby hippo.`;
}

export default function YogurtCard({ dob, name }: { dob: string; name: string }) {
  const [gramsPerDay, setGramsPerDay] = useState(50);
  const [startAge, setStartAge] = useState(4);
  const now = useNow();

  const yogurtKg = (daysSinceAge(new Date(dob), startAge, now) * gramsPerDay) / 1000;

  return (
    <Slide id="3">
      <Headline>{name} has eaten around ...</Headline>
      <KeyMetric>{Math.floor(yogurtKg).toLocaleString()} kg of yogurt</KeyMetric>
      <Headline>{hippoHeadline(yogurtKg)}</Headline>
      <Body>
        If {name} has eaten{" "}
        <InlineSlider value={gramsPerDay} min={10} max={150} step={10} onChange={setGramsPerDay} />{" "}
        grams of yogurt every day since age{" "}
        <InlineStepper value={startAge} min={1} max={7} step={1} onChange={setStartAge} />{" "}
        , that's {Math.floor(yogurtKg).toLocaleString()} kg of creamy, protein-rich fuel.
      </Body>
    </Slide>
  );
}
