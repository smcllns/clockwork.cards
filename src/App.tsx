import { createSignal, onMount, onCleanup, Show, For, JSX } from "solid-js"
import { Confetti } from "./components/Confetti"
import { ThemeToggle, type Theme } from "./components/ThemeToggle"
import { Section } from "./components/Section"
import { Editable } from "./components/Editable"
import { ALL_SECTIONS } from "./metrics"
import { createPageState, PageProvider } from "./store"
import { getAge } from "./utils/metrics"
import { numberToWord } from "./utils/words"
import { formatDate } from "./utils/format"

interface AppProps {
  name: string
  dateOfBirth: string
  initialTheme: Theme
}

export function App(props: AppProps): JSX.Element {
  const [showConfetti, setShowConfetti] = createSignal(true)
  const [theme, setTheme] = createSignal<Theme>(props.initialTheme)

  const birthDate = new Date(props.dateOfBirth + 'T00:00:00')
  const pageState = createPageState(birthDate, props.name)

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

  const ctx = () => pageState.ctx()
  const age = () => getAge(birthDate, ctx().now)
  const ageWord = () => numberToWord(age())

  return (
    <PageProvider value={pageState}>
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
          {/* Hero */}
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
              {age()}
            </div>

            <h1 style={{
              "font-size": "clamp(1.5rem, 5vw, 2.5rem)",
              "font-weight": "600",
              color: "var(--foreground)",
              "margin-bottom": "16px",
            }}>
              <Editable id="hero-title" default={`Happy Birthday ${props.name}`} />
            </h1>

            <p style={{
              "font-size": "clamp(1rem, 3vw, 1.25rem)",
              color: "var(--muted-foreground)",
              "line-height": "1.6",
              "max-width": "500px",
              margin: "0 auto 32px",
            }}>
              <Editable id="hero-subtitle" default={`You are ${ageWord()}, born ${formatDate(birthDate)}`} />
            </p>

            <p style={{
              "font-size": "13px",
              color: "var(--muted-foreground)",
              opacity: "0.7",
            }}>
              Tap any card to see the math. Tap the gear to adjust variables.
            </p>
          </header>

          {/* Sections */}
          <div style={{ display: "flex", "flex-direction": "column", gap: "40px" }}>
            <For each={ALL_SECTIONS}>
              {(section) => (
                <Section config={section} ctx={ctx()} />
              )}
            </For>
          </div>

          {/* Footer */}
          <footer style={{
            "margin-top": "64px",
            "padding-top": "24px",
            "border-top": "1px solid var(--border)",
            "text-align": "center",
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            gap: "12px",
          }}>
            <button
              onClick={() => pageState.resetAll()}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid var(--border)",
                "border-radius": "var(--radius)",
                color: "var(--muted-foreground)",
                "font-size": "13px",
                cursor: "pointer",
              }}
            >
              Reset all customizations
            </button>
            <p style={{ "font-size": "13px", color: "var(--muted-foreground)" }}>
              Made with curiosity and math
            </p>
          </footer>
        </div>
      </main>
    </PageProvider>
  )
}
