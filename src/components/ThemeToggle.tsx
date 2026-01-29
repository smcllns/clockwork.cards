import { JSX } from "solid-js"

export type Theme = "cyberpunk" | "minimalist"

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle(props: ThemeToggleProps): JSX.Element {
  return (
    <button
      onClick={props.onToggle}
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        "z-index": "40",
        display: "flex",
        "align-items": "center",
        gap: "8px",
        padding: "8px 12px",
        background: "var(--card)",
        border: "1px solid var(--border)",
        "border-radius": "9999px",
        "box-shadow": "0 4px 6px -1px rgba(0,0,0,0.1)",
        cursor: "pointer",
        "font-size": "14px",
        "font-weight": "500",
        color: "var(--foreground)",
        transition: "all 0.2s",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" />
      </svg>
      {props.theme === "cyberpunk" ? "Cyberpunk" : "Minimalist"}
    </button>
  )
}
