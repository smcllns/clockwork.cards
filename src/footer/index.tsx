import { useTheme } from "../store/theme";
import "./theme.css";

export default function Footer() {
  const { shiny, toggle } = useTheme();

  return (
    <footer className="px-6 py-4 flex items-center justify-between text-sm"
      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
      <span>&copy; 2025 clockwork.cards</span>
      <button
        onClick={toggle}
        className="border rounded-full px-3 py-1 cursor-pointer transition-all"
        style={{
          borderColor: shiny ? "var(--accent-1)" : "var(--border-color)",
          color: shiny ? "var(--accent-1)" : "var(--text-secondary)",
          boxShadow: shiny ? "0 0 12px rgba(0,255,255,0.3)" : "none",
        }}
      >
        {shiny ? "🌙 Shiny" : "✨ Shiny"}
      </button>
    </footer>
  );
}
