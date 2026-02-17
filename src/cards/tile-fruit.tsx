import { useState } from 'react';
import { Tile } from '../components/tile';
import { InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';

interface TileFruitProps {
  dob: Date;
  span?: number;
}

// Fruit servings (stepper: servings/day, default 3)
export function TileFruit({ dob, span = 1 }: TileFruitProps) {
  const now = useNow();

  const [servingsPerDay, setServingsPerDay] = useState(3);

  // Days alive
  const ageMs = now - dob.getTime();
  const daysAlive = ageMs / (1000 * 60 * 60 * 24);

  // Total servings
  const totalServings = Math.floor(daysAlive * servingsPerDay);

  return (
    <Tile
      emoji="🍎"
      value={totalServings.toLocaleString('en-US')}
      headline="fruit servings"
      body={
        <>
          At <InlineStepper value={servingsPerDay} onChange={setServingsPerDay} min={0} max={10} /> per day
        </>
      }
      span={span}
    />
  );
}
