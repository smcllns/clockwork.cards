import { useState } from "react";
import { InlineSlider, InlineStepper, InlinePills } from "../components/controls";
import { useNow } from "../components/useNow";
import { daysSinceAge } from "../utils";
import { PhotoSlide } from "../components/photo-slide";
import imgLight from "../assets/photo-yogurt.png";
import imgShiny from "../assets/photo-yogurt-shiny.png";

function hippoHeadline(yogurtKg: number): string {
  const ratio = yogurtKg / 40;
  if (ratio < 0.9) return `That's about ${Math.round(ratio * 100)}% the weight of a baby hippo.`;
  if (ratio < 1.15) return "About the weight of a baby hippo.";
  return `That's about ${(ratio).toFixed(1)}× the weight of a baby hippo.`;
}

export default function YogurtPhoto({ dob, name, shiny }: { dob: string; name: string; shiny: boolean }) {
  const [gramsPerDay, setGramsPerDay] = useState(50);
  const [startAge, setStartAge] = useState(4);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const now = useNow();

  const yogurtKg = (daysSinceAge(new Date(dob), startAge, now) * gramsPerDay) / 1000;
  const display = unit === "lbs" ? Math.floor(yogurtKg * 2.205) : Math.floor(yogurtKg);

  return (
    <PhotoSlide
      id="3"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      objectPosition="center 30%"
      gradient="linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)"
    >
      <p className="text-lg font-medium mb-1 text-white/70">{name} has eaten ...</p>
      <div className="mb-1">
        <span
          className="font-bold leading-none text-white"
          style={{ fontFamily: "var(--font-stat)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
          data-stat
        >
          {display.toLocaleString()}
        </span>
      </div>
      <p className="text-lg font-medium mb-8 text-white/70">
        <InlinePills
          options={[
            { value: "kg" as const, label: "kilograms" },
            { value: "lbs" as const, label: "pounds" },
          ]}
          value={unit}
          onChange={setUnit}
        /> of yogurt
      </p>
      <p className="text-lg font-semibold mb-4 text-white">
        {hippoHeadline(yogurtKg)}
      </p>
      <p className="text-sm leading-relaxed text-white/60">
        Assuming {name} eats{" "}
        <InlineSlider value={gramsPerDay} min={10} max={150} step={10} onChange={setGramsPerDay} />{" "}
        grams of yogurt every day, since age <InlineStepper value={startAge} min={1} max={7} step={1} onChange={setStartAge} />
      </p>
    </PhotoSlide>
  );
}
