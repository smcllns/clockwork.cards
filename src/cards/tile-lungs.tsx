import { useState } from 'react';
import { Tile } from '../components/tile';
import { InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';

interface TileLungsProps {
  dob: Date;
  span?: number;
}

// Extra air liters (stepper: hrs hard play/day, default 1)
export function TileLungs({ dob, span = 1 }: TileLungsProps) {
  const now = useNow();

  const [hoursHardPlay, setHoursHardPlay] = useState(1);

  // Days alive
  const ageMs = now - dob.getTime();
  const daysAlive = ageMs / (1000 * 60 * 60 * 24);

  // Extra air while playing hard (assuming ~20L/min during hard play vs ~6L/min at rest)
  const extraLitersPerMinute = 14; // 20 - 6
  const totalMinutesHardPlay = daysAlive * hoursHardPlay * 60;
  const totalExtraLiters = totalMinutesHardPlay * extraLitersPerMinute;

  return (
    <Tile
      emoji="🫁"
      value={totalExtraLiters.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      unit="L"
      headline="extra air (hard play)"
      body={
        <>
          At <InlineStepper value={hoursHardPlay} onChange={setHoursHardPlay} min={0} max={8} /> hrs/day
        </>
      }
      span={span}
    />
  );
}
