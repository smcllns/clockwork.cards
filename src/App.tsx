import { createSignal, onMount, onCleanup, Show, JSX } from "solid-js"
import { Confetti } from "./components/Confetti"
import { ThemeToggle, type Theme } from "./components/ThemeToggle"
import { Hero } from "./sections/Hero"
import { TimeAlive } from "./sections/TimeAlive"
import { Sleep } from "./sections/Sleep"
import { Heartbeats } from "./sections/Heartbeats"
import { Steps } from "./sections/Steps"
import { Space } from "./sections/Space"
import { FunFacts } from "./sections/FunFacts"

interface AppProps {
  name: string
  dateOfBirth: string
  initialTheme: Theme
}

export function App(props: AppProps): JSX.Element {
  const [showConfetti, setShowConfetti] = createSignal(true)
  const [theme, setTheme] = createSignal<Theme>(props.initialTheme)

  const birthDate = new Date(props.dateOfBirth)

  onMount(() => {
    applyTheme(props.initialTheme)
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    onCleanup(() => clearTimeout(timer))
  })

  function applyTheme(t: Theme) {
    const root = document.documentElement
    root.classList.remove("theme-minimalist")
    if (t === "minimalist") {
      root.classList.add("theme-minimalist")
    }
    const url = new URL(window.location.href)
    if (t === "cyberpunk") {
      url.searchParams.delete("theme")
    } else {
      url.searchParams.set("theme", t)
    }
    window.history.replaceState({}, "", url.toString())
  }

  function toggleTheme() {
    const next = theme() === "cyberpunk" ? "minimalist" : "cyberpunk"
    setTheme(next)
    applyTheme(next)
  }

  return (
    <main style={{
      "min-height": "100vh",
      background: "var(--background)",
      transition: "color 0.3s, background 0.3s",
      "overflow-x": "hidden",
    }}>
      <Show when={showConfetti()}>
        <Confetti />
      </Show>
      <ThemeToggle theme={theme()} onToggle={toggleTheme} />

      <div style={{
        "max-width": "1024px",
        margin: "0 auto",
        padding: "0 16px 80px",
      }}>
        <Hero name={props.name} birthDate={birthDate} />

        <div style={{ display: "flex", "flex-direction": "column", gap: "40px" }}>
          <TimeAlive birthDate={birthDate} />
          <Sleep birthDate={birthDate} />
          <Heartbeats birthDate={birthDate} />
          <Steps birthDate={birthDate} />
          <Space birthDate={birthDate} />
          <FunFacts birthDate={birthDate} name={props.name} />
        </div>

        <footer style={{
          "margin-top": "64px",
          "padding-top": "24px",
          "border-top": "1px solid var(--border)",
          "text-align": "center",
        }}>
          <p style={{ "font-size": "13px", color: "var(--muted-foreground)" }}>
            Made with curiosity and math
          </p>
        </footer>
      </div>
    </main>
  )
}
