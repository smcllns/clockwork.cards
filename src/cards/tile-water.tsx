import { useState } from 'react';
import { Tile } from '../components/tile';
import { InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';
import { OLYMPIC_POOL_LITERS } from '../constants';

interface TileWaterProps {
  dob: Date;
  span?: number;
}

// Water liters + Olympic pool % (stepper: glasses/day, default 6)
export function TileWater({ dob, span = 1 }: TileWaterProps) {
  const now = useNow();

  const [glassesPerDay, setGlassesPerDay] = useState(6);

  // Days alive
  const ageMs = now - dob.getTime();
  const daysAlive = ageMs / (1000 * 60 * 60 * 24);

  // Total water (assuming 250ml per glass)
  const mlPerGlass = 250;
  const totalMl = daysAlive * glassesPerDay * mlPerGlass;
  const totalLiters = totalMl / 1000;

  // Olympic pool percentage
  const poolPercentage = (totalLiters / OLYMPIC_POOL_LITERS) * 100;

  return (
    <Tile
      emoji="💧"
      value={totalLiters.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      unit="L"
      headline="water drunk"
      body={
        <>
          <div className="mb-2">
            At <InlineStepper value={glassesPerDay} onChange={setGlassesPerDay} min={1} max={15} /> glasses/day
          </div>
          <div style={{ color: 'var(--accent)' }}>
            {poolPercentage.toFixed(2)}% of an Olympic pool
          </div>
        </>
      }
      span={span}
    />
  );
}
