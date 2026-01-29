import { createSignal, JSX, Show } from "solid-js"

type WidgetFace = "front" | "math" | "settings"
type AccentColor = "warm" | "cool" | "earth" | "neutral"

const accentColors: Record<AccentColor, string> = {
  warm: "var(--chart-1)",
  cool: "var(--chart-2)",
  earth: "var(--chart-3)",
  neutral: "var(--muted-foreground)",
}

interface StatCardProps {
  title: string
  headline: JSX.Element
  subtitle?: string
  secondaryValue?: JSX.Element
  secondaryLabel?: string
  mathContent: JSX.Element
  settingsContent?: JSX.Element
  accentColor?: AccentColor
  live?: boolean
}

export function StatCard(props: StatCardProps): JSX.Element {
  const [face, setFace] = createSignal<WidgetFace>("front")

  const handleCardClick = () => {
    if (face() === "front") setFace("math")
    else if (face() === "math") setFace("front")
  }

  const handleSettingsClick = (e: MouseEvent) => {
    e.stopPropagation()
    setFace(face() === "settings" ? "front" : "settings")
  }

  const accent = () => accentColors[props.accentColor ?? "neutral"]
  const isStringHeadline = typeof props.headline === "string"

  const cardStyle = (): string => {
    let transform = ""
    if (face() === "math") transform = "rotateY(180deg)"
    if (face() === "settings") transform = "rotateX(180deg)"
    return transform
  }

  return (
    <div class="perspective-1000" style={{ height: "100%" }}>
      <div
        class="transform-style-preserve-3d"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          "min-height": "160px",
          transition: "transform 0.5s",
          transform: cardStyle(),
        }}
      >
        {/* Front Face */}
        <div
          onClick={handleCardClick}
          class={`backface-hidden stat-card ${props.live ? "neon-border" : "card-glow"}`}
          style={{
            position: "absolute",
            inset: "0",
            cursor: "pointer",
            background: "var(--card)",
            border: "1px solid var(--border)",
            "border-radius": "var(--radius)",
            padding: "12px 16px",
            display: "flex",
            "flex-direction": "column",
            "border-left": `4px solid ${accent()}`,
            transition: "all 0.2s",
          }}
        >
          <Show when={props.settingsContent}>
            <button
              onClick={handleSettingsClick}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                padding: "6px",
                background: "transparent",
                border: "none",
                "border-radius": "6px",
                cursor: "pointer",
                color: "var(--muted-foreground)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </Show>

          <p style={{
            "font-size": "11px",
            "font-weight": "500",
            "text-transform": "uppercase",
            "letter-spacing": "0.05em",
            color: "var(--muted-foreground)",
            "margin-bottom": "8px",
          }}>{props.title}</p>

          <p
            class={`font-mono tabular-nums ${props.live ? "glow counting" : ""}`}
            style={{
              "font-weight": "600",
              color: props.live ? "var(--primary)" : "var(--foreground)",
              "font-size": isStringHeadline ? "16px" : "24px",
              "line-height": "1.2",
            }}
          >
            {props.headline}
          </p>

          <Show when={props.subtitle}>
            <p style={{ "font-size": "14px", color: "var(--muted-foreground)", "margin-top": "4px" }}>
              {props.subtitle}
            </p>
          </Show>

          <Show when={props.secondaryValue}>
            <div style={{ "margin-top": "12px", "padding-top": "12px", "border-top": "1px solid var(--border)" }}>
              <p class="font-mono tabular-nums" style={{ "font-size": "18px", "font-weight": "500", color: "var(--foreground)", opacity: "0.8" }}>
                {props.secondaryValue}
              </p>
              <Show when={props.secondaryLabel}>
                <p style={{ "font-size": "12px", color: "var(--muted-foreground)" }}>{props.secondaryLabel}</p>
              </Show>
            </div>
          </Show>

          <div style={{ flex: "1" }} />
          <p style={{ "font-size": "10px", color: "var(--muted-foreground)", opacity: "0.5", "text-align": "right", "margin-top": "8px" }}>
            tap for math
          </p>
        </div>

        {/* Math Face (Back - Y rotation) */}
        <div
          onClick={handleCardClick}
          class="backface-hidden rotate-y-180"
          style={{
            position: "absolute",
            inset: "0",
            cursor: "pointer",
            background: "color-mix(in oklch, var(--muted) 50%, transparent)",
            border: "1px solid var(--border)",
            "border-radius": "var(--radius)",
            padding: "16px",
            "border-left": `4px solid ${accent()}`,
          }}
        >
          <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "12px" }}>
            <p style={{ "font-size": "11px", "font-weight": "500", "text-transform": "uppercase", "letter-spacing": "0.05em", color: "var(--muted-foreground)" }}>
              The Math
            </p>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </div>
          <div class="font-mono" style={{ "font-size": "14px", color: "var(--foreground)", opacity: "0.9", "overflow": "auto", "max-height": "180px" }}>
            {props.mathContent}
          </div>
        </div>

        {/* Settings Face (Bottom - X rotation) */}
        <Show when={props.settingsContent}>
          <div
            class="backface-hidden rotate-x-180"
            style={{
              position: "absolute",
              inset: "0",
              background: "var(--card)",
              border: "1px solid var(--border)",
              "border-radius": "var(--radius)",
              padding: "16px",
              "border-left": `4px solid ${accent()}`,
            }}
          >
            <div style={{ display: "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "12px" }}>
              <p style={{ "font-size": "11px", "font-weight": "500", "text-transform": "uppercase", "letter-spacing": "0.05em", color: "var(--muted-foreground)" }}>
                Adjust Variables
              </p>
              <button
                onClick={handleSettingsClick}
                style={{ padding: "4px", background: "transparent", border: "none", cursor: "pointer", "border-radius": "4px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", "flex-direction": "column", gap: "16px" }}>
              {props.settingsContent}
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}
