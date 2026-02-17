import { useState } from 'react';
import { Slide, KeyMetric, Headline, Body, IdTag, N } from '../components/slide';
import { InlineSlider, InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';
import { daysSinceAge } from '../utils';
import { YOGURT_GRAMS_PER_SERVING, BABY_HIPPO_KG } from '../constants';

interface SlideYogurtProps {
  dob: Date;
}

// Kg eaten, baby hippo comparison, slider + stepper
export function SlideYogurt({ dob }: SlideYogurtProps) {
  const now = useNow();

  const [servingsPerWeek, setServingsPerWeek] = useState(7);
  const [startAge, setStartAge] = useState(1);

  // Days since start age
  const daysSinceStart = daysSinceAge(dob, startAge, new Date(now));

  // Total servings eaten
  const weeksEating = daysSinceStart / 7;
  const totalServings = weeksEating * servingsPerWeek;

  // Weight in kg
  const totalGrams = totalServings * YOGURT_GRAMS_PER_SERVING;
  const totalKg = totalGrams / 1000;

  // Baby hippo comparison
  const hippos = totalKg / BABY_HIPPO_KG;

  return (
    <Slide id="yogurt">
      <IdTag id="yogurt" />
      <Headline>You've eaten</Headline>
      <KeyMetric value={totalKg.toFixed(1)} unit="kg of yogurt" />
      <Body>
        Since age <InlineStepper value={startAge} onChange={setStartAge} min={0} max={8} />,
        eating <InlineSlider value={servingsPerWeek} onChange={setServingsPerWeek} min={0} max={21} /> servings per week.
        That's <N>{hippos.toFixed(2)} baby hippos</N>!
      </Body>
    </Slide>
  );
}
