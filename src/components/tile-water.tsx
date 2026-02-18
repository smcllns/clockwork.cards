import { useState } from "react";
import { Tile } from "./tile";
import { InlineStepper } from "./controls";
import { useNow } from "./useNow";
import { OLYMPIC_POOL_LITERS, GLASS_ML } from "../lib/constants";

export default function WaterTile({ dob, name }: { dob: Date; name: string }) {
  const [glassesPerDay, setGlassesPerDay] = useState(6);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const litersPerDay = (glassesPerDay * GLASS_ML) / 1000;
  const waterLiters = daysAlive * litersPerDay;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const poolYearsRemaining = (OLYMPIC_POOL_LITERS - waterLiters) / litersPerDay / 365.25;

  return (
    <Tile
      id="5f" emoji="💧"
      value={`${Math.floor(waterLiters).toLocaleString()} L`}
      unit="of water"
      headline={`${waterPoolPercent.toFixed(1)}% of an Olympic pool`}
      body={<>An Olympic swimming pool holds 2.5 million liters. At{" "}
        <InlineStepper value={glassesPerDay} min={2} max={12} step={1} onChange={setGlassesPerDay} />{" "}
        glasses a day, it would take {name} about {Math.floor(poolYearsRemaining).toLocaleString()} more years to drink the rest.</>}
    />
  );
}
