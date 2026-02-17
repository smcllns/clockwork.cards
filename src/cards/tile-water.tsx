import { useState } from "react";
import { Tile } from "../components/tile";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { OLYMPIC_POOL_LITERS, GLASS_ML } from "../constants";

export default function WaterTile({ dob, name }: { dob: string; name: string }) {
  const [glassesPerDay, setGlassesPerDay] = useState(6);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const litersPerDay = (glassesPerDay * GLASS_ML) / 1000;
  const waterLiters = daysAlive * litersPerDay;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const poolYearsRemaining = (OLYMPIC_POOL_LITERS - waterLiters) / litersPerDay / 365.25;

  return (
    <Tile
      id="5f" span={2} emoji="💧"
      value={`${Math.floor(waterLiters).toLocaleString()} L`}
      unit="of water"
      headline={`${waterPoolPercent.toFixed(1)}% of an Olympic pool`}
      body={<>An Olympic swimming pool holds 2.5 million liters. At{" "}
        <InlineStepper value={glassesPerDay} min={2} max={12} step={1} onChange={setGlassesPerDay} />{" "}
        glasses a day, it would take {name} about {Math.floor(poolYearsRemaining).toLocaleString()} more years to drink the rest.</>}
    />
  );
}
