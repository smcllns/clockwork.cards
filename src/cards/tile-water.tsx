import { Tile } from "../components/tiles";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, DAYS_PER_YEAR, OLYMPIC_POOL_LITERS, GLASS_ML } from "../constants";
import { fmt } from "../utils";

const GLASSES_PER_DAY = 6;
const LITERS_PER_DAY = (GLASSES_PER_DAY * GLASS_ML) / 1000;

export default function WaterTile({ dob }: { dob: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const waterLiters = daysAlive * LITERS_PER_DAY;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const poolYearsRemaining = (OLYMPIC_POOL_LITERS - waterLiters) / LITERS_PER_DAY / DAYS_PER_YEAR;

  return (
    <Tile
      id="5f" span={2} emoji="💧"
      value={`${fmt(waterLiters)} L`}
      unit="of water"
      headline={`${waterPoolPercent.toFixed(1)}% of an Olympic pool`}
      body={`An Olympic swimming pool holds 2.5 million liters. At this rate, it would take you about ${fmt(poolYearsRemaining)} more years to drink the rest.`}
    />
  );
}
