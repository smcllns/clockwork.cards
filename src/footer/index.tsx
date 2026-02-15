import { useState, useEffect } from "react";
import "./theme.css";

export default function Footer() {
  const [isExplore, setIsExplore] = useState(location.hash === "#explore");

  useEffect(() => {
    const handler = () => setIsExplore(location.hash === "#explore");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return (
    <footer
      className="px-6 py-4 flex items-center justify-between text-sm"
      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
    >
      <span>&copy; 2026 clockwork.cards</span>
      <a
        href={isExplore ? "#" : "#explore"}
        style={{ color: "var(--text-accent)", textDecoration: "none" }}
      >
        {isExplore ? "← Back to card" : "Layout explorations →"}
      </a>
    </footer>
  );
}
