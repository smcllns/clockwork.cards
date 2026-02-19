import { Section } from "./section";

type Props = { children: React.ReactNode; className?: string };

export function Slide({ children, alt, id, className }: Props & { alt?: boolean; id: string }) {
  return (
    <Section id={id} bg={alt ? "secondary" : "primary"} className={className}>
      <div className="slide max-w-xl w-full py-16">{children}</div>
    </Section>
  );
}

export function KeyMetric({ children, className }: Props) {
  return (
    <div className={`mb-1 ${className ?? ""}`}>
      <span
        className="font-bold leading-none text-(--text-primary) font-(--font-stat)"
        style={{ fontSize: "clamp(3rem, 10vw, 5rem)" }}
        data-stat
      >
        {children}
      </span>
    </div>
  );
}

export function Unit({ children, className }: Props) {
  return <p className={`text-lg font-medium mb-6 text-(--text-secondary) ${className ?? ""}`}>{children}</p>;
}

export function Headline({ children, lg, className }: Props & { lg?: boolean }) {
  const base = lg ? "text-4xl sm:text-5xl font-light mb-6" : "text-xl font-semibold mb-6";
  return <p className={`${base} text-(--text-primary) ${className ?? ""}`}>{children}</p>;
}

export function N({ children, className }: Props) {
  return (
    <span className={`font-bold font-(--font-stat) text-(--text-primary) ${className ?? ""}`} data-stat>
      {children}
    </span>
  );
}
