import { useState } from "react";
import { Slide, KeyMetric, Unit, Headline, Body } from "../components/slide";
import { BlockControl, BlockSlider, BlockStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { daysSinceAge } from "../utils";

function hippoHeadline(yogurtKg: number): string {
  const ratio = yogurtKg / 40;
  if (ratio < 0.9) return `That's about ${Math.round(ratio * 100)}% the weight of a baby hippo.`;
  if (ratio < 1.15) return "About the weight of a baby hippo.";
  return `That's about ${(ratio).toFixed(1)}× the weight of a baby hippo.`;
}

export default function YogurtCard({ dob, name }: { dob: string; name: string }) {
  const [gramsPerDay, setGramsPerDay] = useState(50);
  const [startAge, setStartAge] = useState(4);
  const now = useNow();

  const yogurtKg = (daysSinceAge(new Date(dob), startAge, now) * gramsPerDay) / 1000;

  return (
    <Slide id="3">
      <span className="text-4xl block mb-4">🥄</span>
      <KeyMetric>{Math.floor(yogurtKg).toLocaleString()} kg</KeyMetric>
      <Unit>of yogurt</Unit>
      <Headline>{hippoHeadline(yogurtKg)}</Headline>
      <Body>
        If you've eaten yogurt every day since you were little, that's {Math.floor(yogurtKg).toLocaleString()} kg of
        creamy, tangy fuel. Baby hippos weigh about 40 kg at birth.
      </Body>
      <div className="space-y-3">
        <BlockControl label="Grams per day">
          <BlockSlider value={gramsPerDay} min={10} max={150} step={10} unit="g"
            onChange={setGramsPerDay} />
        </BlockControl>
        <BlockControl label="Since age">
          <BlockStepper value={startAge} min={1} max={7} step={1}
            onChange={setStartAge} />
        </BlockControl>
      </div>
    </Slide>
  );
}
