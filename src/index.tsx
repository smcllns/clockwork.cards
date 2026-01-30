import { render } from "solid-js/web"
import { createStore, StoreProvider } from "./canvas/store"
import { Demo } from "./canvas/Demo"
import { Dev } from "./canvas/Dev"
import type { Theme } from "./widgets/ThemeToggle"

const params = new URLSearchParams(window.location.search)
const name = params.get("name") || "Birthday Star"
const defaultDob = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 16)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})()
const dob = new Date((params.get("dob") || defaultDob) + 'T00:00:00')
const gender = (params.get("gender") as 'boy' | 'girl' | 'neutral') || 'neutral'
const themeParam = params.get("theme")
const initialTheme: Theme = themeParam === "minimalist" ? "minimalist" : "cyberpunk"

const isDev = window.location.pathname === '/dev'

const root = document.getElementById("app")
if (!root) throw new Error("No #app element found")

render(() => {
  const store = createStore(dob, name, gender)
  return (
    <StoreProvider value={store}>
      {isDev ? <Dev /> : <Demo initialTheme={initialTheme} />}
    </StoreProvider>
  )
}, root)
