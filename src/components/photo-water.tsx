import { useState } from "react";
import { InlineStepper } from "../page/controls";
import { useNow } from "../lib/useNow";
import { OLYMPIC_POOL_LITERS, GLASS_ML } from "../lib/constants";
import { PhotoSlide } from "./photo-slide";
import imgLight from "../assets/photo-water.png";
import imgShiny from "../assets/photo-water-shiny.png";

export default function WaterPhoto({ dob, name, shiny }: { dob: Date; name: string; shiny: boolean }) {
  const [glassesPerDay, setGlassesPerDay] = useState(6);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const litersPerDay = (glassesPerDay * GLASS_ML) / 1000;
  const waterLiters = daysAlive * litersPerDay;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const poolYearsRemaining = (OLYMPIC_POOL_LITERS - waterLiters) / litersPerDay / 365.25;

  return (
    <PhotoSlide
      id="5f"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      objectPosition="center 30%"
      intro={`${name} has drunk ...`}
      value={Math.floor(waterLiters).toLocaleString()}
      unit="liters of water"
      headline={`That's ${waterPoolPercent.toFixed(1)}% of an Olympic swimming pool.`}
      body={<>
        An Olympic pool holds 2.5 million liters. At{" "}
        <InlineStepper value={glassesPerDay} min={2} max={12} step={1} onChange={setGlassesPerDay} />{" "}
        glasses a day, it would take {name} about {Math.floor(poolYearsRemaining).toLocaleString()} more years to drink the rest.
      </>}
    />
  );
}
