import { useState } from 'react';
import { Slide, KeyMetric, Headline, Body, IdTag, N } from '../components/slide';
import { InlineSlider, InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';
import { daysSinceAge } from '../utils';

interface SlideStepsProps {
  dob: Date;
}

// Steps walked, slider for steps/day, stepper for start age
export function SlideSteps({ dob }: SlideStepsProps) {
  const now = useNow();

  const [stepsPerDay, setStepsPerDay] = useState(8000);
  const [startAge, setStartAge] = useState(2);

  // Days since start age
  const daysSinceStart = daysSinceAge(dob, startAge, new Date(now));

  // Total steps
  const totalSteps = daysSinceStart * stepsPerDay;

  // Distance (average step length for a child ~0.5m)
  const distanceKm = (totalSteps * 0.5) / 1000;
  const distanceMiles = distanceKm * 0.621371;

  return (
    <Slide id="steps">
      <IdTag id="steps" />
      <Headline>Steps taken</Headline>
      <KeyMetric
        value={(totalSteps / 1_000_000).toFixed(1)}
        unit="million steps"
      />
      <Body>
        Since age <InlineStepper value={startAge} onChange={setStartAge} min={1} max={8} />,
        walking <InlineSlider value={stepsPerDay} onChange={setStepsPerDay} min={1000} max={20000} step={500} /> steps per day.
        That's <N>{distanceKm.toLocaleString('en-US', { maximumFractionDigits: 0 })} km</N> or <N>{distanceMiles.toLocaleString('en-US', { maximumFractionDigits: 0 })} miles</N>!
      </Body>
    </Slide>
  );
}
