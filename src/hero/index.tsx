import { useEffect, useRef, useState } from "react";
import RAPIER from "@dimforge/rapier3d-compat";

type HeroMode = "off" | "on" | "broken";
type VariationHandle = { setMode: (m: HeroMode) => void; dispose: () => void };

const VARIATION_NAMES = [
  "Holographic Grid",
  "Digital Rain",
  "Blueprint Builder",
  "Particle Nebula",
  "Neon Circuits",
  "Dying Lights",
  "Glass Floor",
  "Neon Letters",
  "Two Buttons",
  "Glass Box",
  "Slow Death",
  "Short Circuit",
];

const TOTAL_VARIATIONS = 12;

function getVariation(): number {
  const v = new URLSearchParams(window.location.search).get("v");
  if (v) {
    const n = parseInt(v, 10);
    if (n >= 1 && n <= TOTAL_VARIATIONS) return n;
  }
  return 1;
}

export default function Hero({ name, dob }: { name: string; dob: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<VariationHandle | null>(null);
  const [mode, setMode] = useState<HeroMode>("off");
  const [variation, setVariation] = useState(getVariation);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    const prev = container.querySelector("canvas");
    if (prev) prev.remove();
    handleRef.current?.dispose();
    handleRef.current = null;
    setReady(false);

    RAPIER.init().then(async () => {
      if (disposed) return;

      let initFn: (container: HTMLElement, name: string, dob: string) => VariationHandle;
      switch (variation) {
        case 1: initFn = (await import("./v1-holographic-grid")).initV1; break;
        case 2: initFn = (await import("./v2-digital-rain")).initV2; break;
        case 3: initFn = (await import("./v3-blueprint")).initV3; break;
        case 4: initFn = (await import("./v4-particle-nebula")).initV4; break;
        case 5: initFn = (await import("./v5-neon-circuits")).initV5; break;
        case 6: initFn = (await import("./v6-dying-lights")).initV6; break;
        case 7: initFn = (await import("./v7-glass-floor")).initV7; break;
        case 8: initFn = (await import("./v8-neon-letters")).initV8; break;
        case 9: initFn = (await import("./v9-two-buttons")).initV9; break;
        case 10: initFn = (await import("./v7b-glass-box")).initV7b; break;
        case 11: initFn = (await import("./v11-slow-death")).initV11; break;
        case 12: initFn = (await import("./v12-short-circuit")).initV12; break;
        default: initFn = (await import("./v1-holographic-grid")).initV1; break;
      }

      if (disposed) return;
      const handle = initFn(container, name, dob);
      handleRef.current = handle;
      setReady(true);
    });

    return () => {
      disposed = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [variation, name, dob]);

  useEffect(() => {
    if (ready && handleRef.current) {
      handleRef.current.setMode(mode);
    }
  }, [mode, ready]);

  function toggleShiny() {
    if (mode === "broken") return;
    const next = mode === "off" ? "on" : "off";
    setMode(next);
    document.documentElement.classList.toggle("shiny", next === "on");
  }

  function breakGlass() {
    if (mode === "broken") return;
    if (mode === "off") {
      handleRef.current?.setMode("on");
      document.documentElement.classList.add("shiny");
    }
    setMode("broken");
  }

  function switchVariation(v: number) {
    setMode("off");
    document.documentElement.classList.remove("shiny");
    setVariation(v);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(v));
    window.history.replaceState({}, "", url.toString());
  }

  const shinyOn = mode === "on" || mode === "broken";

  return (
    <div className="h-[90dvh] relative w-screen -ml-[calc((100vw-100%)/2)]">
      <section
        ref={containerRef}
        className="h-full overflow-hidden"
        style={{ background: mode === "off" ? "#fff" : "#0a0a0f", transition: "background-color 0.5s" }}
      />

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

      {/* Dev: variation switcher (temporary — will be removed when we go V11-only) */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1 max-w-48">
        {Array.from({ length: TOTAL_VARIATIONS }, (_, i) => i + 1).map(v => (
          <button
            key={v}
            onClick={() => switchVariation(v)}
            title={VARIATION_NAMES[v - 1]}
            className="w-6 h-6 rounded-full text-[10px] font-bold cursor-pointer"
            style={{
              background: v === variation
                ? (mode === "off" ? "#18181b" : "#00ffff")
                : (mode === "off" ? "rgba(228,228,231,0.7)" : "rgba(26,26,46,0.7)"),
              color: v === variation
                ? (mode === "off" ? "#fff" : "#000")
                : (mode === "off" ? "#71717a" : "#555"),
              border: "none",
              transition: "all 0.3s",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* 🚨 CHAOS TOGGLE — The fire alarm.
       * Character: A warning panel that says "do not touch." Hazard-striped,
       * industrial, clearly dangerous. The forbidden switch that adults would
       * say no to — which is exactly why a kid wants to flip it.
       * Behavior: One-shot only. Once flipped, it's over. The balls fall, the
       * lights die, and there's no going back. The panel goes dead.
       * Position: Absolute within the hero section. Scrolls away — you leave
       * the scene of the crime behind. */}
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

      {/* ⚡ SHINY TOGGLE — The room's power switch.
       * Character: A clean wall panel labeled "SHINY." Warm, inviting — the main
       * light switch that transforms the whole page from daylight to neon cyberpunk.
       * It glows when on, calling you to flip it. The on-switch for the party.
       * Behavior: Togglable on/off freely. Locks on once chaos triggers.
       * Position: Fixed top-right. Always accessible while scrolling the page. */}
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
  );
}
