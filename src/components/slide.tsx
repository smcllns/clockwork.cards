// ── Shared card layout primitives ────────────────────────────────

export const css = {
  primary: { color: "var(--text-primary)" } as const,
  secondary: { color: "var(--text-secondary)" } as const,
  sectionHead: { color: "var(--text-secondary)", borderColor: "var(--border-color)" } as const,
  card: { background: "var(--bg-card)", borderColor: "var(--border-color)" } as const,
  formula: { fontFamily: "var(--font-stat)", color: "var(--text-accent)", fontSize: "1.1rem" } as const,
};

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

export function Slide({ children, alt, id }: { children: React.ReactNode; alt?: boolean; id: string }) {
  return (
    <div
      className="flex items-center justify-center px-6 relative snap-section"
      style={{ minHeight: "100dvh", background: alt ? "var(--bg-secondary)" : "var(--bg-primary)" }}
    >
      <div className="absolute top-4 right-6"><IdTag id={id} /></div>
      <div className="max-w-xl w-full py-16">{children}</div>
    </div>
  );
}

export function KeyMetric({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2">
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

export function Unit({ children }: { children: React.ReactNode }) {
  return <p className="text-lg font-medium mb-6" style={css.secondary}>{children}</p>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <p className="text-4xl sm:text-5xl font-light mb-6" style={css.primary}>{children}</p>;
}

export function Headline({ children }: { children: React.ReactNode }) {
  return <p className="text-xl font-semibold mb-4" style={css.primary}>{children}</p>;
}

export function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-base leading-relaxed mb-8" style={css.secondary}>{children}</p>;
}

export function Narrative({ children, sm }: { children: React.ReactNode; sm?: boolean }) {
  return (
    <p
      className={sm ? "text-2xl sm:text-3xl font-medium mb-12" : "text-xl sm:text-2xl leading-relaxed mb-12"}
      style={css.primary}
    >
      {children}
    </p>
  );
}

export function N({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold" style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)" }} data-stat>
      {children}
    </span>
  );
}
