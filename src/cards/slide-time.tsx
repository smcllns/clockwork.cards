import { useState } from 'react';
import { Slide, KeyMetric, Headline, IdTag } from '../components/slide';
import { InlineDropdown } from '../components/controls';
import { useNow } from '../components/useNow';
import { getAge } from '../utils';

interface SlideTimeProps {
  dob: Date;
}

// Big number + unit dropdown (years through seconds)
export function SlideTime({ dob }: SlideTimeProps) {
  const now = useNow();
  const currentDate = new Date(now);

  const [unit, setUnit] = useState('years');

  // Calculate age in milliseconds
  const ageMs = now - dob.getTime();

  // Convert to selected unit
  const getValueForUnit = (u: string): string => {
    switch (u) {
      case 'years':
        return (ageMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2);
      case 'months':
        return (ageMs / (1000 * 60 * 60 * 24 * 30.44)).toFixed(1);
      case 'weeks':
        return (ageMs / (1000 * 60 * 60 * 24 * 7)).toFixed(0);
      case 'days':
        return (ageMs / (1000 * 60 * 60 * 24)).toFixed(0);
      case 'hours':
        return (ageMs / (1000 * 60 * 60)).toLocaleString('en-US', { maximumFractionDigits: 0 });
      case 'minutes':
        return (ageMs / (1000 * 60)).toLocaleString('en-US', { maximumFractionDigits: 0 });
      case 'seconds':
        return (ageMs / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 });
      default:
        return '0';
    }
  };

  const units = [
    { value: 'years', label: 'years' },
    { value: 'months', label: 'months' },
    { value: 'weeks', label: 'weeks' },
    { value: 'days', label: 'days' },
    { value: 'hours', label: 'hours' },
    { value: 'minutes', label: 'minutes' },
    { value: 'seconds', label: 'seconds' },
  ];

  return (
    <Slide id="time">
      <IdTag id="time" />
      <Headline>You've been alive for</Headline>
      <KeyMetric value={getValueForUnit(unit)} />
      <div className="text-center">
        <InlineDropdown value={unit} onChange={setUnit} options={units} />
      </div>
    </Slide>
  );
}
