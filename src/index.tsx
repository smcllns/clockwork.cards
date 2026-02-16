import { useState } from "react";
import { createRoot } from "react-dom/client";
import Hero from "./hero";
import type { HeroMode } from "./hero";
import CuratedMain from "./main/CuratedMain";
import Footer from "./footer";

const params = new URLSearchParams(window.location.search);
const name = params.get("name") ?? process.env.DEFAULT_NAME ?? "Oscar";
const dob = params.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-02-20";

function App() {
  const [mode, setMode] = useState<HeroMode>("off");
  const shinyOn = mode === "on" || mode === "broken";

  function toggleShiny() {
    if (mode === "broken") return;
    const next = mode === "off" ? "on" : "off";
    setMode(next);
    document.documentElement.classList.toggle("shiny", next === "on");
  }

  function breakGlass() {
    if (mode === "broken") return;
    if (mode === "off") {
      document.documentElement.classList.add("shiny");
    }
    setMode("broken");
  }

  return (
    <div>
      <div
        className="h-[90dvh] relative snap-section"
        style={{ background: mode === "off" ? "#fff" : "#0a0a0f", transition: "background-color 0.5s" }}
      >
        <Hero name={name} dob={dob} mode={mode} />

        {/* Top nav */}
        <nav className="absolute top-0 left-0 right-0 z-10 flex items-center px-6 py-4">
          <span
            className="text-sm font-medium"
            style={{
              color: mode === "off" ? "#71717a" : "#7a7a9a",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              transition: "color 0.5s",
            }}
          >
            clockwork.cards/{name.toLowerCase()}
          </span>
        </nav>

        {/* 🚨 CHAOS TOGGLE */}
        <div
          className="absolute top-3 z-10"
          style={{ right: 92 }}
        >
          <div
            className="select-none flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-500"
            style={{
              backgroundColor: mode === "broken"
                ? "rgba(41,37,36,0.85)"
                : mode === "off" ? "rgba(255,255,255,0.85)" : "rgba(30,10,10,0.85)",
              backdropFilter: "blur(8px)",
              border: mode === "broken"
                ? "1px solid #44403c"
                : mode === "off" ? "1px solid #e7e5e4" : "1px solid rgba(153,27,27,0.5)",
              boxShadow: mode === "broken"
                ? "0 2px 8px rgba(0,0,0,0.3)"
                : "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: mode === "broken"
                  ? "#57534e"
                  : mode === "off" ? "#dc2626" : "#fca5a5",
                transition: "color 0.5s",
              }}
            >🚫 Do not touch</span>
            <button
              onClick={mode !== "broken" ? breakGlass : undefined}
              className={`relative flex-shrink-0 transition-all duration-300 ${
                mode === "broken" ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: mode === "broken"
                  ? "#292524"
                  : mode === "off" ? "#78716c" : "#57534e",
                boxShadow: mode === "broken"
                  ? "inset 0 1px 3px rgba(0,0,0,0.4)"
                  : "inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)",
                border: mode === "broken"
                  ? "1px solid #44403c"
                  : "1px solid #a8a29e",
                transition: "all 0.5s",
              }}
            >
              <div
                className="absolute top-[2px] rounded-full shadow-md transition-all duration-500"
                style={{
                  width: 18,
                  height: 18,
                  left: mode === "broken" ? 23 : 2,
                  backgroundColor: mode === "broken" ? "#57534e" : "#e7e5e4",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        </div>

        {/* ⚡ SHINY TOGGLE */}
        <div className="fixed top-3 right-3 z-50">
          <div
            className={`select-none flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 ${
              mode === "broken" ? "opacity-50" : ""
            }`}
            style={{
              backgroundColor: shinyOn
                ? "rgba(30,20,0,0.85)"
                : "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              border: shinyOn
                ? "1px solid rgba(217,119,6,0.4)"
                : "1px solid #e7e5e4",
              boxShadow: shinyOn
                ? "0 0 16px rgba(245,158,11,0.3), 0 2px 8px rgba(0,0,0,0.2)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "all 0.3s",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: shinyOn ? "#f59e0b" : "#d97706",
                transition: "color 0.3s",
              }}
            >✨ Shiny</span>
            <button
              onClick={toggleShiny}
              disabled={mode === "broken"}
              className={`relative transition-all duration-300 ${
                mode === "broken" ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: shinyOn ? "#f59e0b" : "#fbbf24",
                boxShadow: shinyOn
                  ? "0 0 10px rgba(245,158,11,0.5), inset 0 1px 2px rgba(255,255,255,0.2)"
                  : "0 0 6px rgba(251,191,36,0.4), inset 0 1px 2px rgba(255,255,255,0.15)",
                border: shinyOn
                  ? "1px solid #d97706"
                  : "1px solid #f59e0b",
                transition: "all 0.3s",
              }}
            >
              <div
                className="absolute top-[2px] rounded-full bg-white transition-all duration-300"
                style={{
                  width: 18,
                  height: 18,
                  left: shinyOn ? 23 : 2,
                  boxShadow: shinyOn
                    ? "0 1px 4px rgba(0,0,0,0.2), 0 0 6px rgba(245,158,11,0.3)"
                    : "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <CuratedMain name={name} dob={dob} />
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
