type Props = { children: React.ReactNode; className?: string };

export function Intro({ children, className }: Props) {
  return <p className={`text-xl font-semibold mb-6 text-(--text-primary) ${className ?? ""}`}>{children}</p>;
}

export function Stat({ children, lg, className }: Props & { lg?: boolean }) {
  if (lg) {
    return <p className={`text-4xl sm:text-5xl font-light mb-6 text-(--text-primary) ${className ?? ""}`}>{children}</p>;
  }
  return (
    <div className={`mb-1 ${className ?? ""}`}>
      <span
        className="font-bold leading-none text-(--text-primary) font-(--font-stat)"
        style={{ fontSize: "var(--stat-size, clamp(3rem, 10vw, 5rem))" }}
        data-stat
      >
        {children}
      </span>
    </div>
  );
}

export function Subtitle({ children, className }: Props) {
  return <p className={`text-lg font-medium mb-6 text-(--text-secondary) ${className ?? ""}`}>{children}</p>;
}

export function Lede({ children, className }: Props) {
  return <p className={`text-2xl font-semibold mb-6 text-(--text-primary) ${className ?? ""}`}>{children}</p>;
}

export function Body({ children, className }: Props) {
  return <p className={`text-xl leading-loose text-(--text-secondary) ${className ?? ""}`}>{children}</p>;
}
