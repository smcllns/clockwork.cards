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
      className={`flex flex-col items-center px-6 relative ${className ?? ""}`}
      // overflow-y: auto lets content scroll within a slide if it exceeds 100svh (e.g. small screen, large font)
      // Wheel scroll will still advance slides rather than scrolling within — acceptable for an edge case
      // Spacer divs (flex:1) center content when short; collapse to 0 when tall so content always starts at paddingTop
      style={{ height: "100svh", flexShrink: 0, overflowY: "auto", paddingTop: "env(safe-area-inset-top)", paddingBottom: "var(--nav-height, 48px)", background: bg === "secondary" ? "var(--bg-secondary)" : "var(--bg-primary)" }}
    >
      <div className="absolute top-14 right-6"><IdTag id={id} /></div>
      <div className="flex-1" />
      {children}
      <div className="flex-1" />
    </div>
  );
}
