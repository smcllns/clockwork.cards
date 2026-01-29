import { createSignal, onMount, onCleanup, Show, JSX } from "solid-js"
import { getAge, getDaysUntilBirthday, isBirthdayToday } from "../utils/metrics"
import { formatDate } from "../utils/format"

interface HeroProps {
  name: string
  birthDate: Date
}

export function Hero(props: HeroProps): JSX.Element {
  const [now, setNow] = createSignal(new Date())

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  const age = () => getAge(props.birthDate, now())
  const daysUntilBirthday = () => getDaysUntilBirthday(props.birthDate, now())
  const birthdayToday = () => isBirthdayToday(props.birthDate, now())
  const formattedBirthDate = () => formatDate(props.birthDate)

  return (
    <header class="display-hero" style={{
      "text-align": "center",
      padding: "40px 16px 64px",
    }}>
      <p style={{
        "font-size": "12px",
        "font-weight": "500",
        "letter-spacing": "0.2em",
        "text-transform": "uppercase",
        color: "var(--muted-foreground)",
        "margin-bottom": "12px",
      }}>A Numbers Story For</p>

      <h1 class="glow" style={{
        "font-size": "clamp(2.5rem, 10vw, 5rem)",
        "font-weight": "700",
        "letter-spacing": "-0.02em",
        color: "var(--foreground)",
        "margin-bottom": "16px",
      }}>{props.name}</h1>

      <div style={{
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        gap: "12px",
        "margin-bottom": "32px",
      }}>
        <span style={{ height: "1px", width: "48px", background: "var(--border)" }} />
        <span class="font-mono" style={{ "font-size": "18px", color: "var(--muted-foreground)" }}>
          {formattedBirthDate()}
        </span>
        <span style={{ height: "1px", width: "48px", background: "var(--border)" }} />
      </div>

      <Show when={birthdayToday()}>
        <div class="card-glow neon-border" style={{
          display: "inline-block",
          background: "color-mix(in oklch, var(--card) 50%, transparent)",
          "backdrop-filter": "blur(8px)",
          "border-radius": "var(--radius)",
          padding: "16px 24px",
          border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
        }}>
          <p class="glow" style={{
            "font-size": "clamp(1.25rem, 4vw, 1.75rem)",
            "font-weight": "600",
            color: "var(--foreground)",
            "margin-bottom": "8px",
          }}>
            Happy {age() + 1}{getOrdinalSuffix(age() + 1)} Birthday!
          </p>
          <p style={{ "font-size": "14px", color: "var(--muted-foreground)" }}>
            Today marks another trip around the sun.
          </p>
        </div>
      </Show>

      <Show when={!birthdayToday() && daysUntilBirthday() <= 30}>
        <div class="card-glow" style={{
          display: "inline-block",
          background: "color-mix(in oklch, var(--card) 50%, transparent)",
          "backdrop-filter": "blur(8px)",
          "border-radius": "var(--radius)",
          padding: "16px 32px",
          border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
        }}>
          <p style={{ "font-size": "16px", color: "var(--muted-foreground)", "margin-bottom": "4px" }}>
            Turning {age() + 1} in
          </p>
          <p class="big-number font-mono glow" style={{ color: "var(--primary)" }}>
            {daysUntilBirthday()}
          </p>
          <p style={{ "font-size": "14px", color: "var(--muted-foreground)", "margin-top": "4px" }}>
            {daysUntilBirthday() === 1 ? "day" : "days"}
          </p>
        </div>
      </Show>

      <Show when={!birthdayToday() && daysUntilBirthday() > 30}>
        <div style={{ display: "inline-block" }}>
          <p style={{ "font-size": "16px", color: "var(--muted-foreground)" }}>
            Currently <span class="glow" style={{ "font-weight": "600", color: "var(--primary)" }}>{age()} years old</span>
          </p>
        </div>
      </Show>

      <p style={{
        "margin-top": "48px",
        "font-size": "13px",
        color: "var(--muted-foreground)",
        "max-width": "400px",
        "margin-left": "auto",
        "margin-right": "auto",
        "line-height": "1.5",
      }}>
        Tap any card to see the math. Tap the gear to adjust variables.
      </p>
    </header>
  )
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
