import { render } from "solid-js/web"
import { App } from "./App"
import type { Theme } from "./components/ThemeToggle"

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
const dob = params.get("dob") || defaultDob
const themeParam = params.get("theme")
const initialTheme: Theme = themeParam === "minimalist" ? "minimalist" : "cyberpunk"

const root = document.getElementById("app")
if (!root) throw new Error("No #app element found")

render(() => <App name={name} dateOfBirth={dob} initialTheme={initialTheme} />, root)
