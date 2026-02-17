export default function Nav({ name, shiny, onToggleShiny }: { name: string; shiny: boolean; onToggleShiny: () => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        backgroundColor: shiny ? "rgba(10,10,15,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: shiny ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
        transition: "background-color 0.5s, border-color 0.5s",
      }}
    >
      <span
        className="text-sm font-medium"
        style={{
          color: shiny ? "#7a7a9a" : "#71717a",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          transition: "color 0.5s",
        }}
      >
        clockwork.cards/{name.toLowerCase()}
      </span>

      <div
        className="select-none flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300"
        style={{
          backgroundColor: shiny ? "rgba(245,158,11,0.15)" : "transparent",
          border: shiny ? "1px solid rgba(217,119,6,0.3)" : "1px solid transparent",
          transition: "all 0.3s",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: shiny ? "#f59e0b" : "#d97706",
            transition: "color 0.3s",
          }}
        >✨ Cyberpunk</span>
        <button
          onClick={onToggleShiny}
          className="relative transition-all duration-300 cursor-pointer"
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            backgroundColor: shiny ? "#f59e0b" : "#e5e5e5",
            boxShadow: shiny
              ? "0 0 8px rgba(245,158,11,0.5), inset 0 1px 2px rgba(255,255,255,0.2)"
              : "inset 0 1px 2px rgba(0,0,0,0.1)",
            border: shiny ? "1px solid #d97706" : "1px solid #d4d4d4",
            transition: "all 0.3s",
          }}
        >
          <div
            className="absolute top-[2px] rounded-full bg-white transition-all duration-300"
            style={{
              width: 14,
              height: 14,
              left: shiny ? 19 : 2,
              boxShadow: shiny
                ? "0 1px 3px rgba(0,0,0,0.2), 0 0 4px rgba(245,158,11,0.3)"
                : "0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>
    </nav>
  );
}
