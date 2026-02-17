import { ReactNode } from 'react';

interface InlineStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

// Stepper: ‹ value ›
export function InlineStepper({ value, onChange, min = 0, max = 100, step = 1 }: InlineStepperProps) {
  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium cursor-default select-none"
      style={{
        backgroundColor: `color-mix(in srgb, var(--accent) 15%, transparent)`,
        color: 'var(--accent)',
      }}
    >
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="hover:opacity-70 disabled:opacity-30 transition-opacity"
        aria-label="Decrease"
      >
        ‹
      </button>
      <span className="min-w-[2ch] text-center">{value}</span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="hover:opacity-70 disabled:opacity-30 transition-opacity"
        aria-label="Increase"
      >
        ›
      </button>
    </span>
  );
}

interface InlineSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

// Slider styled as accent-colored chip
export function InlineSlider({ value, onChange, min, max, step = 1 }: InlineSliderProps) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium"
      style={{
        backgroundColor: `color-mix(in srgb, var(--accent) 15%, transparent)`,
        color: 'var(--accent)',
      }}
    >
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-24 accent-current"
      />
      <span className="min-w-[3ch] text-center">{value}</span>
    </span>
  );
}

interface InlineDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

// Dropdown styled as accent-colored chip
export function InlineDropdown({ value, onChange, options }: InlineDropdownProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full font-medium"
      style={{
        backgroundColor: `color-mix(in srgb, var(--accent) 15%, transparent)`,
        color: 'var(--accent)',
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none cursor-pointer"
        style={{ color: 'var(--accent)' }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </span>
  );
}

interface InlinePillsProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

// Pills: multiple buttons styled as chips
export function InlinePills({ value, onChange, options }: InlinePillsProps) {
  return (
    <span className="inline-flex items-center gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-3 py-1 rounded-full font-medium transition-all"
          style={{
            backgroundColor:
              value === opt.value
                ? 'var(--accent)'
                : `color-mix(in srgb, var(--accent) 15%, transparent)`,
            color: value === opt.value ? 'white' : 'var(--accent)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </span>
  );
}
