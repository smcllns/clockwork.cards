import { useState } from 'react';
import { Slide, Headline, Narrative, IdTag, N } from '../components/slide';
import { InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';
import { daysSinceAge } from '../utils';

interface SlideBrushingProps {
  dob: Date;
}

// Brush time + strokes + blinks, steppers for mins and start age
export function SlideBrushing({ dob }: SlideBrushingProps) {
  const now = useNow();

  const [minutesPerBrush, setMinutesPerBrush] = useState(2);
  const [startAge, setStartAge] = useState(2);

  // Days since start age (brushing twice a day)
  const daysSinceStart = daysSinceAge(dob, startAge, new Date(now));
  const totalBrushes = daysSinceStart * 2;

  // Total time brushing
  const totalMinutes = totalBrushes * minutesPerBrush;
  const totalHours = totalMinutes / 60;

  // Strokes (assuming ~120 strokes per minute)
  const strokesPerMinute = 120;
  const totalStrokes = totalMinutes * strokesPerMinute;

  // Blinks (assuming ~15 blinks per minute while brushing)
  const blinksPerMinute = 15;
  const totalBlinks = totalMinutes * blinksPerMinute;

  return (
    <Slide id="brushing">
      <IdTag id="brushing" />
      <Headline>Brushing your teeth</Headline>
      <Narrative>
        <p className="mb-4">
          Since age <InlineStepper value={startAge} onChange={setStartAge} min={1} max={8} />,
          brushing for <InlineStepper value={minutesPerBrush} onChange={setMinutesPerBrush} min={1} max={5} /> minutes
          twice a day, you've spent <N>{totalHours.toFixed(0)} hours</N> with a toothbrush in your mouth.
        </p>
        <p className="mb-4">
          That's <N>{totalStrokes.toLocaleString('en-US', { maximumFractionDigits: 0 })} brush strokes</N> and
          {' '}<N>{totalBlinks.toLocaleString('en-US', { maximumFractionDigits: 0 })} blinks</N> while staring at yourself in the mirror.
        </p>
      </Narrative>
    </Slide>
  );
}
