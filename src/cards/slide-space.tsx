import { useState } from 'react';
import { Slide, KeyMetric, Headline, Body, IdTag, N } from '../components/slide';
import { InlinePills } from '../components/controls';
import { useNow } from '../components/useNow';
import { EARTH_ORBIT_SPEED_KM_H } from '../constants';

interface SlideSpaceProps {
  dob: Date;
}

// Miles/km through space, light-speed comparison
export function SlideSpace({ dob }: SlideSpaceProps) {
  const now = useNow();
  const currentDate = new Date(now);

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');

  // Calculate hours alive
  const ageMs = now - dob.getTime();
  const hoursAlive = ageMs / (1000 * 60 * 60);

  // Distance traveled through space (Earth's orbit)
  const kmTraveled = hoursAlive * EARTH_ORBIT_SPEED_KM_H;
  const milesTraveled = kmTraveled * 0.621371;

  // Light-speed comparison (light travels ~300,000 km/s)
  const lightSecondsEquivalent = kmTraveled / 299_792; // km per second

  const distance = unitSystem === 'metric' ? kmTraveled : milesTraveled;
  const unit = unitSystem === 'metric' ? 'kilometers' : 'miles';

  const units = [
    { value: 'imperial', label: 'miles' },
    { value: 'metric', label: 'km' },
  ];

  return (
    <Slide id="space">
      <IdTag id="space" />
      <Headline>Riding on Earth</Headline>
      <KeyMetric
        value={distance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
      />
      <div className="text-center">
        <InlinePills
          value={unitSystem}
          onChange={(v) => setUnitSystem(v as 'metric' | 'imperial')}
          options={units}
        />
      </div>
      <Body>
        You've traveled <N>{distance.toLocaleString('en-US', { maximumFractionDigits: 0 })} {unit}</N> through space as Earth orbits the Sun. That's <N>{lightSecondsEquivalent.toFixed(1)} light-seconds</N>!
      </Body>
    </Slide>
  );
}
