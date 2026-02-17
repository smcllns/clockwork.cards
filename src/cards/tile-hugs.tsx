import { useState } from 'react';
import { Tile } from '../components/tile';
import { InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';

interface TileHugsProps {
  dob: Date;
  span?: number;
}

// Hug count (stepper: hugs/day, default 2)
export function TileHugs({ dob, span = 1 }: TileHugsProps) {
  const now = useNow();

  const [hugsPerDay, setHugsPerDay] = useState(2);

  // Days alive
  const ageMs = now - dob.getTime();
  const daysAlive = ageMs / (1000 * 60 * 60 * 24);

  // Total hugs
  const totalHugs = Math.floor(daysAlive * hugsPerDay);

  return (
    <Tile
      emoji="🤗"
      value={totalHugs.toLocaleString('en-US')}
      headline="hugs given"
      body={
        <>
          At <InlineStepper value={hugsPerDay} onChange={setHugsPerDay} min={0} max={20} /> per day
        </>
      }
      span={span}
    />
  );
}
