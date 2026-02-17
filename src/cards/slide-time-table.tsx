import { Slide, Headline, IdTag } from '../components/slide';
import { useNow } from '../components/useNow';

interface SlideTimeTableProps {
  dob: Date;
}

// All units at once in a table
export function SlideTimeTable({ dob }: SlideTimeTableProps) {
  const now = useNow();

  // Calculate age in milliseconds
  const ageMs = now - dob.getTime();

  const units = [
    { label: 'Years', value: (ageMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2) },
    { label: 'Months', value: (ageMs / (1000 * 60 * 60 * 24 * 30.44)).toFixed(1) },
    { label: 'Weeks', value: (ageMs / (1000 * 60 * 60 * 24 * 7)).toFixed(0) },
    { label: 'Days', value: (ageMs / (1000 * 60 * 60 * 24)).toFixed(0) },
    { label: 'Hours', value: (ageMs / (1000 * 60 * 60)).toLocaleString('en-US', { maximumFractionDigits: 0 }) },
    { label: 'Minutes', value: (ageMs / (1000 * 60)).toLocaleString('en-US', { maximumFractionDigits: 0 }) },
    { label: 'Seconds', value: (ageMs / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 }) },
  ];

  return (
    <Slide id="time-table">
      <IdTag id="time-table" />
      <Headline>Your age, every way</Headline>
      <div className="w-full">
        <table className="w-full border-collapse">
          <tbody>
            {units.map((unit, index) => (
              <tr
                key={unit.label}
                className="border-b"
                style={{
                  borderColor: 'var(--border)',
                }}
              >
                <td className="py-3 text-left font-medium" style={{ color: 'var(--text-muted)' }}>
                  {unit.label}
                </td>
                <td className="py-3 text-right text-2xl font-bold" data-stat>
                  {unit.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Slide>
  );
}
