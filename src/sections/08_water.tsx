import type { useWaterMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/content/photo-slide";
import { Intro, Stat, Subtitle, Lede, Body } from "../components/page/slide";
import { InlineStepper } from "../components/page/controls";
import imgLight from "../assets/photo-water.png";
import imgShiny from "../assets/photo-water-shiny.png";

type Props = SectionProps & { water: ReturnType<typeof useWaterMetrics> };

export function WaterSection({ name, shiny, water }: Props) {
  return (
    <PhotoSlide id="5f" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny} objectPosition="center 30%">
      <Intro className="mb-2">{name} has drunk ...</Intro>
      <Stat>{Math.floor(water.waterLiters).toLocaleString()}</Stat>
      <Subtitle>liters of water</Subtitle>
      <Lede>That's {water.waterPoolPercent.toFixed(1)}% of an Olympic swimming pool.</Lede>
      <Body>
        An Olympic pool holds 2.5 million liters. At{" "}
        <InlineStepper value={water.glassesPerDay} min={2} max={12} step={1} onChange={water.setGlassesPerDay} />{" "}
        glasses a day, it would take {name} about {Math.floor(water.poolYearsRemaining).toLocaleString()} more years to drink the rest.
      </Body>
    </PhotoSlide>
  );
}
