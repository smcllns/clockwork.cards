import { render } from "solid-js/web"
import { App } from "./App"
import type { Theme } from "./components/ThemeToggle"

const params = new URLSearchParams(window.location.search)
const name = params.get("name") || "Birthday Star"
const dob = params.get("dob") || "2017-02-20"
const themeParam = params.get("theme")
const initialTheme: Theme = themeParam === "minimalist" ? "minimalist" : "cyberpunk"

const root = document.getElementById("app")
if (!root) throw new Error("No #app element found")

render(() => <App name={name} dateOfBirth={dob} initialTheme={initialTheme} />, root)
