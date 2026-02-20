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
      // overflow-y: auto lets content scroll within a slide if it exceeds 100svh (e.g. small screen, large font)
      // Wheel scroll will still advance slides rather than scrolling within — acceptable for an edge case
      style={{ height: "100svh", flexShrink: 0, overflowY: "auto", paddingTop: "env(safe-area-inset-top)", paddingBottom: "var(--nav-height, 48px)", background: bg === "secondary" ? "var(--bg-secondary)" : "var(--bg-primary)" }}
    >
      <div className="absolute top-14 right-6"><IdTag id={id} /></div>
      {children}
    </div>
  );
}
