import { useState } from "react";
import { Slide, KeyMetric, Unit, Headline, Body } from "./slide";
import { InlineSlider, InlineStepper, InlinePills } from "./controls";
import { useNow } from "../lib/useNow";
import { daysSinceAge } from "../lib/utils";

function hippoHeadline(yogurtKg: number): string {
  const ratio = yogurtKg / 40;
  if (ratio < 0.9) return `That's about ${Math.round(ratio * 100)}% the weight of a baby hippo.`;
  if (ratio < 1.15) return "About the weight of a baby hippo.";
  return `That's about ${(ratio).toFixed(1)} times the weight of a baby hippo.`;
}

export default function YogurtCard({ dob, name }: { dob: Date; name: string }) {
  const [gramsPerDay, setGramsPerDay] = useState(50);
  const [startAge, setStartAge] = useState(4);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const now = useNow();

  const yogurtKg = (daysSinceAge(dob, startAge, now) * gramsPerDay) / 1000;
  const display = unit === "lbs" ? Math.floor(yogurtKg * 2.205) : Math.floor(yogurtKg);

  return (
    <Slide id="3">
      <Headline>{name} has eaten ...</Headline>
      <KeyMetric>{display.toLocaleString()}</KeyMetric>
      <Unit>
        <InlinePills
          options={[
            { value: "kg" as const, label: "kilograms" },
            { value: "lbs" as const, label: "pounds" },
          ]}
          value={unit}
          onChange={setUnit}
        /> of yogurt
      </Unit>
      <Headline>{hippoHeadline(yogurtKg)}</Headline>
      <Body>
        Assuming {name} eats{" "}
        <InlineSlider value={gramsPerDay} min={10} max={150} step={10} onChange={setGramsPerDay} />{" "}
        grams of yogurt every day, since age <InlineStepper value={startAge} min={1} max={7} step={1} onChange={setStartAge} />
      </Body>
    </Slide>
  );
}
