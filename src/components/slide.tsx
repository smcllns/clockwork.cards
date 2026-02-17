import { css, Section } from "./section";

type Props = { children: React.ReactNode; className?: string };

export function Slide({ children, alt, id, className }: Props & { alt?: boolean; id: string }) {
  return (
    <Section id={id} bg={alt ? "secondary" : "primary"} className={className}>
      <div className="max-w-xl w-full py-16">{children}</div>
    </Section>
  );
}

export function KeyMetric({ children, className }: Props) {
  return (
    <div className={`mb-1 ${className ?? ""}`}>
      <span
        className="font-bold leading-none"
        style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
        data-stat
      >
        {children}
      </span>
    </div>
  );
}

export function Unit({ children, className }: Props) {
  return <p className={`text-lg font-medium mb-6 ${className ?? ""}`} style={css.secondary}>{children}</p>;
}

export function Headline({ children, lg, className }: Props & { lg?: boolean }) {
  const base = lg ? "text-4xl sm:text-5xl font-light mb-6" : "text-xl font-semibold mb-6";
  return <p className={`${base} ${className ?? ""}`} style={css.primary}>{children}</p>;
}

export function Body({ children, className }: Props) {
  return <p className={`text-lg leading-loose mb-8 ${className ?? ""}`} style={css.secondary}>{children}</p>;
}

export function Narrative({ children, sm, className }: Props & { sm?: boolean }) {
  const base = sm ? "text-2xl sm:text-3xl font-medium mb-12" : "text-xl sm:text-2xl leading-relaxed mb-12";
  return (
    <p className={`${base} ${className ?? ""}`} style={css.primary}>
      {children}
    </p>
  );
}

export function N({ children, className }: Props) {
  return (
    <span className={`font-bold ${className ?? ""}`} style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)" }} data-stat>
      {children}
    </span>
  );
}
