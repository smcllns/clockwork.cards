function Sparkle({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </svg>
  );
}

export default function Nav({ name, shiny, onToggleShiny }: { name: string; shiny: boolean; onToggleShiny: () => void }) {
  return (
    <nav
      ref={(el) => {
        if (el) document.documentElement.style.setProperty("--nav-height", el.offsetHeight + "px");
      }}
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: shiny ? "rgba(10,10,15,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: shiny ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
        transition: "background-color 0.5s, border-color 0.5s",
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
      <span
        className="flex items-center gap-2 text-sm font-medium"
        style={{
          color: shiny ? "#7a7a9a" : "#71717a",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          transition: "color 0.5s",
        }}
      >
        <a href="/oscar" className="flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
          </svg>
          /{name.toLowerCase()}
        </a>
      </span>

      <button
        onClick={onToggleShiny}
        className="select-none flex items-center gap-2.5 px-3.5 py-2 rounded-full cursor-pointer transition-all duration-300"
        style={{
          backgroundColor: shiny ? "rgba(245,158,11,0.15)" : "rgba(100,60,0,0.08)",
          border: shiny ? "1px solid rgba(217,119,6,0.3)" : "1px solid rgba(180,130,50,0.25)",
          boxShadow: shiny ? "0 0 12px rgba(245,158,11,0.2)" : undefined,
          transition: "background-color 0.3s, border-color 0.3s",
        }}
      >
        <Sparkle color={shiny ? "#f59e0b" : "#b8860b"} size={12} />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: shiny ? "#f59e0b" : "#92700a",
            transition: "color 0.3s",
          }}
        >
          Cyberpunk
        </span>
        <div
          className="relative overflow-hidden transition-all duration-300"
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: shiny ? "#f59e0b" : "#d4c9a8",
            boxShadow: shiny ? "0 0 10px rgba(245,158,11,0.5), inset 0 1px 2px rgba(255,255,255,0.2)" : "inset 0 1px 2px rgba(0,0,0,0.15)",
            border: shiny ? "1px solid #d97706" : "1px solid #b8a878",
            transition: "all 0.3s",
          }}
        >
          <div
            className="absolute top-[3px] rounded-full transition-all duration-300"
            style={{
              width: 16,
              height: 16,
              left: shiny ? 24 : 3,
              backgroundColor: shiny ? "#fff" : "#fff",
              boxShadow: shiny ? "0 1px 3px rgba(0,0,0,0.2), 0 0 4px rgba(245,158,11,0.3)" : "0 1px 2px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      </button>
      </div>
      {/* safe-area fill: background extends below content row into home indicator zone, no content */}
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </nav>
  );
}
