import { useState } from 'react';
import { Slide, Headline, KeyMetric, Body, IdTag, N } from '../components/slide';
import { InlineStepper } from '../components/controls';
import { useNow } from '../components/useNow';
import { getAge } from '../utils';

interface SlidePoopsProps {
  dob: Date;
}

// Poop count, stepper for frequency
export function SlidePoops({ dob }: SlidePoopsProps) {
  const now = useNow();

  const [poopsPerDay, setPoopsPerDay] = useState(1);

  // Days alive
  const ageMs = now - dob.getTime();
  const daysAlive = ageMs / (1000 * 60 * 60 * 24);

  // Total poops
  const totalPoops = Math.floor(daysAlive * poopsPerDay);

  return (
    <Slide id="poops">
      <IdTag id="poops" />
      <Headline>Life's necessities</Headline>
      <KeyMetric
        value={totalPoops.toLocaleString('en-US')}
        unit="poops"
      />
      <Body>
        At <InlineStepper value={poopsPerDay} onChange={setPoopsPerDay} min={1} max={3} /> per day,
        you've made <N>{totalPoops.toLocaleString('en-US')} trips</N> to the bathroom.
        That's a lot of reading time!
      </Body>
    </Slide>
  );
}
