import { Tile, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, DAYS_PER_YEAR, OLYMPIC_POOL_LITERS, GLASS_ML } from "../constants";
import { fmt } from "../utils";

const GLASSES_PER_DAY = 6;
const LITERS_PER_DAY = (GLASSES_PER_DAY * GLASS_ML) / 1000;

export default function WaterTile({ dob }: { dob: string; name: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const waterLiters = daysAlive * LITERS_PER_DAY;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const poolYearsRemaining = (OLYMPIC_POOL_LITERS - waterLiters) / LITERS_PER_DAY / DAYS_PER_YEAR;

  return (
    <Tile id="5f" span={2}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-1">💧</span>
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
              data-stat
            >{fmt(waterLiters)} L</span>
            <span className="text-sm" style={css.secondary}>of water</span>
          </div>
          <p className="text-sm font-semibold mt-1" style={css.primary}>{waterPoolPercent.toFixed(1)}% of an Olympic pool</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>
        An Olympic swimming pool holds 2.5 million liters. At this rate, it would take you about {fmt(poolYearsRemaining)} more years to drink the rest.
      </p>
    </Tile>
  );
}
