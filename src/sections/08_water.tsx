import type { useWaterMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/page/photo-slide";
import { Intro, Stat, Subtitle, Lede, Body } from "../components/page/text";
import { InlinePills, InlineStepper } from "../components/page/controls";
import imgLight from "../assets/photo-water.png";
import imgShiny from "../assets/photo-water-shiny.png";

type Props = SectionProps & { water: ReturnType<typeof useWaterMetrics> };

export function WaterSection({ name, shiny, water }: Props) {
  return (
    <PhotoSlide id="5f" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny} objectPosition="center 30%">
      <Intro className="mb-2">{name} has drank ...</Intro>
      <Stat>{water.display.toLocaleString()}</Stat>
      <Subtitle className="mb-8">
        <InlinePills
          options={[
            { value: "liters" as const, label: "liters" },
            { value: "cups" as const, label: "cups" },
          ]}
          value={water.unit}
          onChange={water.setUnit}
        />{" "}of water
      </Subtitle>
      <Lede>That's {water.waterPoolPercent.toFixed(1)}% of an Olympic swimming pool.</Lede>
      <Body>
        An Olympic pool holds 2.5 million liters. At{" "}
        <InlineStepper
          value={water.mlPerDay}
          min={250}
          max={3000}
          step={water.unit === "cups" ? 237 : 250}
          onChange={water.setMlPerDay}
          displayValue={water.unit === "cups" ? `${Math.round(water.mlPerDay / 237)} cups` : `${(water.mlPerDay / 1000).toFixed(1)}L`}
        />{" "}
        per day, it would take {name} about {Math.floor(water.poolYearsRemaining).toLocaleString()} more years to drink the rest.
      </Body>
    </PhotoSlide>
  );
}
