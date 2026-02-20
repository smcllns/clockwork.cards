export default function Upsell({ shiny }: { shiny: boolean }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-3 px-6 py-3 text-sm"
      style={{
        backgroundColor: shiny ? "rgba(10,10,15,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: shiny ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
        transition: "background-color 0.5s, border-color 0.5s",
        color: shiny ? "#7a7a9a" : "#71717a",
        fontFamily: "'Space Grotesk', system-ui, sans-serif",
      }}
    >
      <p>
        <a href="/buy" style={{ color: "var(--text-accent)", fontWeight: 600 }}>
          Make your own Clockwork Card &rarr;
        </a>
      </p>
    </div>
  );
}
