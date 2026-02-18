import type { useWaterMetrics } from "../hooks";
import { PhotoSlide } from "../../components/photo-slide";
import { InlineStepper } from "../../components/controls";
import imgLight from "../../assets/photo-water.png";
import imgShiny from "../../assets/photo-water-shiny.png";

type Props = { name: string; shiny: boolean; water: ReturnType<typeof useWaterMetrics> };

export function WaterSection({ name, shiny, water }: Props) {
  return (
    <PhotoSlide id="5f" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny}
      objectPosition="center 30%"
      intro={`${name} has drunk ...`}
      value={Math.floor(water.waterLiters).toLocaleString()}
      unit="liters of water"
      headline={`That's ${water.waterPoolPercent.toFixed(1)}% of an Olympic swimming pool.`}
      body={<>An Olympic pool holds 2.5 million liters. At{" "}
        <InlineStepper value={water.glassesPerDay} min={2} max={12} step={1} onChange={water.setGlassesPerDay} />{" "}
        glasses a day, it would take {name} about {Math.floor(water.poolYearsRemaining).toLocaleString()} more years to drink the rest.</>}
    />
  );
}
