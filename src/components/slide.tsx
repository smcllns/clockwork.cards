import { ReactNode } from 'react';
import { Section, IdTag } from './section';

// Re-export IdTag for convenience
export { IdTag };

interface SlideProps {
  id?: string;
  children: ReactNode;
}

// Centered max-w-xl column inside Section
export function Slide({ id, children }: SlideProps) {
  return (
    <Section id={id}>
      <div className="max-w-xl w-full flex flex-col gap-6">
        {children}
      </div>
    </Section>
  );
}

interface KeyMetricProps {
  value: string | number;
  unit?: string;
}

// Big number display
export function KeyMetric({ value, unit }: KeyMetricProps) {
  return (
    <div className="text-center" data-stat>
      <div className="text-6xl sm:text-8xl font-bold tracking-tight">
        {value}
      </div>
      {unit && (
        <div className="text-2xl sm:text-3xl font-medium mt-2" style={{ color: 'var(--text-muted)' }}>
          {unit}
        </div>
      )}
    </div>
  );
}

interface TitleProps {
  children: ReactNode;
}

export function Title({ children }: TitleProps) {
  return (
    <h1 className="text-4xl sm:text-5xl font-bold text-center">
      {children}
    </h1>
  );
}

interface HeadlineProps {
  children: ReactNode;
}

export function Headline({ children }: HeadlineProps) {
  return (
    <h2 className="text-3xl sm:text-4xl font-bold text-center">
      {children}
    </h2>
  );
}

interface BodyProps {
  children: ReactNode;
}

export function Body({ children }: BodyProps) {
  return (
    <p className="text-lg sm:text-xl text-center" style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  );
}

interface NarrativeProps {
  children: ReactNode;
}

export function Narrative({ children }: NarrativeProps) {
  return (
    <div className="text-lg sm:text-xl leading-relaxed">
      {children}
    </div>
  );
}

interface UnitProps {
  children: ReactNode;
}

export function Unit({ children }: UnitProps) {
  return (
    <div className="text-xl sm:text-2xl font-medium text-center" style={{ color: 'var(--text-muted)' }}>
      {children}
    </div>
  );
}

interface NProps {
  children: ReactNode;
}

// Inline number highlight in narrative
export function N({ children }: NProps) {
  return (
    <span className="font-bold" style={{ color: 'var(--accent)' }}>
      {children}
    </span>
  );
}
