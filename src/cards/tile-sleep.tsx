import { useState } from 'react';
import { Tile } from '../components/tile';
import { InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';

interface TileSleepProps {
  dob: Date;
  span?: number;
}

// Sleep years (stepper: hrs/night, default 10)
export function TileSleep({ dob, span = 1 }: TileSleepProps) {
  const now = useNow();

  const [hoursPerNight, setHoursPerNight] = useState(10);

  // Days alive
  const ageMs = now - dob.getTime();
  const daysAlive = ageMs / (1000 * 60 * 60 * 24);

  // Total sleep hours
  const totalSleepHours = daysAlive * hoursPerNight;
  const sleepYears = totalSleepHours / (24 * 365.25);

  return (
    <Tile
      emoji="😴"
      value={sleepYears.toFixed(1)}
      unit="years"
      headline="asleep"
      body={
        <>
          At <InlineStepper value={hoursPerNight} onChange={setHoursPerNight} min={6} max={14} /> hours per night
        </>
      }
      span={span}
    />
  );
}
