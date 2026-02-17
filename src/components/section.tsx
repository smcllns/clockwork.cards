import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Shared snap-scrolling wrapper (100dvh, centered, background)
export function Section({ id, children, className = '', style }: SectionProps) {
  return (
    <section
      id={id}
      className={`min-h-[100dvh] flex items-center justify-center px-4 py-8 ${className}`}
      style={{
        backgroundColor: 'var(--section-bg)',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

interface IdTagProps {
  id: string;
}

// Muted ID tag for development feedback
export function IdTag({ id }: IdTagProps) {
  return (
    <span className="text-xs opacity-30 font-mono">
      #{id}
    </span>
  );
}
