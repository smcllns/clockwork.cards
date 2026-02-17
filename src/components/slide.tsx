// ── Shared card layout primitives ────────────────────────────────

export const css = {
  primary: { color: "var(--text-primary)" } as const,
  secondary: { color: "var(--text-secondary)" } as const,
  sectionHead: { color: "var(--text-secondary)", borderColor: "var(--border-color)" } as const,
  card: { background: "var(--bg-card)", borderColor: "var(--border-color)" } as const,
  formula: { fontFamily: "var(--font-stat)", color: "var(--text-accent)", fontSize: "1.1rem" } as const,
};

type Props = { children: React.ReactNode; className?: string };

export function IdTag({ id }: { id: string }) {
  return (
    <span
      className="text-xs font-mono select-all"
      style={{ color: "var(--text-secondary)", opacity: 0.4 }}
    >
      #{id}
    </span>
  );
}

export function Slide({ children, alt, id, className }: Props & { alt?: boolean; id: string }) {
  return (
    <div
      className={`flex items-center justify-center px-6 relative snap-section ${className ?? ""}`}
      style={{ minHeight: "100dvh", background: alt ? "var(--bg-secondary)" : "var(--bg-primary)" }}
    >
      <div className="absolute top-4 right-6"><IdTag id={id} /></div>
      <div className="max-w-xl w-full py-16">{children}</div>
    </div>
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

export function Title({ children, className }: Props) {
  return <p className={`text-4xl sm:text-5xl font-light mb-6 ${className ?? ""}`} style={css.primary}>{children}</p>;
}

export function Headline({ children, className }: Props) {
  return <p className={`text-xl font-semibold mb-6 ${className ?? ""}`} style={css.primary}>{children}</p>;
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

export function TileContainer({ children, id, title, className }: Props & { id: string; title: string }) {
  return (
    <div
      className={`flex items-center justify-center px-6 relative snap-section ${className ?? ""}`}
      style={{ minHeight: "100dvh", background: "var(--bg-secondary)" }}
    >
      <div className="absolute top-4 right-6"><IdTag id={id} /></div>
      <div className="w-full py-16">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-8 pb-3 border-b max-w-2xl mx-auto"
          style={css.sectionHead}
        >
          {title}
        </h3>
        <div className="tile-grid">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Tile({ children, id, span, className }: Props & { id: string; span: number }) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-3 relative ${className ?? ""}`}
      style={{
        "--span": `span ${span}`,
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      } as React.CSSProperties}
      data-card
    >
      <div className="absolute top-3 right-3"><IdTag id={id} /></div>
      {children}
    </div>
  );
}

export function N({ children, className }: Props) {
  return (
    <span className={`font-bold ${className ?? ""}`} style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)" }} data-stat>
      {children}
    </span>
  );
}
