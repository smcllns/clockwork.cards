import "./theme.css";

export default function Footer() {
  return (
    <footer className="px-6 py-4 flex items-center justify-center text-sm"
      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
      <span>&copy; 2026 clockwork.cards</span>
    </footer>
  );
}
