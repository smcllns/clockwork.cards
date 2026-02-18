import { useState } from "react";
import { InlineSlider, InlineStepper, InlinePills } from "./controls";
import { useNow } from "./useNow";
import { daysSinceAge } from "../lib/utils";
import { PhotoSlide } from "./photo-slide";
import imgLight from "../assets/photo-yogurt.png";
import imgShiny from "../assets/photo-yogurt-shiny.png";

function hippoHeadline(yogurtKg: number): string {
  const ratio = yogurtKg / 40;
  if (ratio < 0.9) return `That's about ${Math.round(ratio * 100)}% the weight of a baby hippo.`;
  if (ratio < 1.15) return "About the weight of a baby hippo.";
  return `That's about ${ratio.toFixed(1)}× the weight of a baby hippo.`;
}

export default function YogurtPhoto({ dob, name, shiny }: { dob: Date; name: string; shiny: boolean }) {
  const [gramsPerDay, setGramsPerDay] = useState(50);
  const [startAge, setStartAge] = useState(4);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const now = useNow();

  const yogurtKg = (daysSinceAge(dob, startAge, now) * gramsPerDay) / 1000;
  const display = unit === "lbs" ? Math.floor(yogurtKg * 2.205) : Math.floor(yogurtKg);

  return (
    <PhotoSlide
      id="3"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      objectPosition="center 30%"
      intro={`${name} has eaten ...`}
      value={display.toLocaleString()}
      unit={
        <>
          <InlinePills
            options={[
              { value: "kg" as const, label: "kilograms" },
              { value: "lbs" as const, label: "pounds" },
            ]}
            value={unit}
            onChange={setUnit}
          />{" "}
          of yogurt
        </>
      }
      headline={hippoHeadline(yogurtKg)}
      body={
        <>
          Assuming {name} eats <InlineSlider value={gramsPerDay} min={10} max={150} step={10} onChange={setGramsPerDay} /> grams of yogurt
          every day, since age <InlineStepper value={startAge} min={1} max={7} step={1} onChange={setStartAge} />
        </>
      }
    />
  );
}
