import { useState } from "react";
import { InlineSlider, InlineStepper, InlinePills } from "../components/controls";
import { useNow } from "../components/useNow";
import { daysSinceAge } from "../utils";
import { IdTag } from "../components/section";
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
    <div
      className="relative snap-section flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <img
        src={imgLight}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ objectPosition: "center 30%", opacity: shiny ? 0 : 1 }}
      />
      <img
        src={imgShiny}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ objectPosition: "center 30%", opacity: shiny ? 1 : 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div className="absolute top-4 right-6 z-10"><IdTag id="3" /></div>

      <div className="relative z-10 px-6 pb-12 pt-8 max-w-xl mx-auto w-full">
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
        <p className="text-lg font-medium mb-5 text-white/70">
          <InlinePills
            options={[
              { value: "kg" as const, label: "kilograms" },
              { value: "lbs" as const, label: "pounds" },
            ]}
            value={unit}
            onChange={setUnit}
          /> of yogurt
        </p>
        <p className="text-xl font-semibold mb-5 text-white">
          {hippoHeadline(yogurtKg)}
        </p>
        <p className="text-base leading-relaxed text-white/60">
          Assuming {name} eats{" "}
          <InlineSlider value={gramsPerDay} min={10} max={150} step={10} onChange={setGramsPerDay} />{" "}
          grams of yogurt every day, since age <InlineStepper value={startAge} min={1} max={7} step={1} onChange={setStartAge} />
        </p>
      </div>
    </div>
  );
}
