export const css = {
  primary: { color: "var(--text-primary)" } as const,
  secondary: { color: "var(--text-secondary)" } as const,
  sectionHead: { color: "var(--text-secondary)", borderColor: "var(--border-color)" } as const,
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

export function Section({ children, id, bg = "primary", className }: Props & { id: string; bg?: "primary" | "secondary" }) {
  return (
    <div
      className={`flex items-center justify-center px-6 relative ${className ?? ""}`}
      style={{ height: "100dvh", flexShrink: 0, background: bg === "secondary" ? "var(--bg-secondary)" : "var(--bg-primary)" }}
    >
      <div className="absolute top-14 right-6"><IdTag id={id} /></div>
      {children}
    </div>
  );
}
