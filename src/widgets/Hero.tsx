import { JSX } from 'solid-js'

interface HeroProps {
  age: number
  name: string
  dob: string
  subtitle?: string
  hint?: string
}

export function Hero(props: HeroProps): JSX.Element {
  return (
    <header class="display-hero" style={{
      "text-align": "center",
      padding: "40px 16px 64px",
    }}>
      <div class="hero-age glow font-mono" style={{
        "font-size": "clamp(6rem, 25vw, 12rem)",
        "font-weight": "700",
        "line-height": "1",
        color: "var(--primary)",
        "margin-bottom": "8px",
      }}>
        {props.age}
      </div>

      <h1 style={{
        "font-size": "clamp(1.5rem, 5vw, 2.5rem)",
        "font-weight": "600",
        color: "var(--foreground)",
        "margin-bottom": "16px",
      }}>
        Happy Birthday {props.name}
      </h1>

      <p style={{
        "font-size": "clamp(1rem, 3vw, 1.25rem)",
        color: "var(--muted-foreground)",
        "line-height": "1.6",
        "max-width": "500px",
        margin: "0 auto 12px",
      }}>
        {props.subtitle}
      </p>

      <p class="glow font-mono" style={{
        "font-size": "clamp(1rem, 3vw, 1.25rem)",
        color: "var(--primary)",
        "font-weight": "600",
        "margin-bottom": "32px",
      }}>
        {props.dob}
      </p>

      <p style={{
        "font-size": "13px",
        color: "var(--muted-foreground)",
        opacity: "0.7",
      }}>
        {props.hint}
      </p>
    </header>
  )
}
