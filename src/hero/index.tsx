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
];

const TOTAL_VARIATIONS = 11;

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

  const isV9 = variation === 9;

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

      {/* Variation switcher */}
      <div className="absolute top-4 right-4 z-10 flex gap-1">
        {Array.from({ length: TOTAL_VARIATIONS }, (_, i) => i + 1).map(v => (
          <button
            key={v}
            onClick={() => switchVariation(v)}
            title={VARIATION_NAMES[v - 1]}
            className="w-7 h-7 rounded-full text-xs font-bold cursor-pointer"
            style={{
              background: v === variation
                ? (mode === "off" ? "#18181b" : "#00ffff")
                : (mode === "off" ? "#e4e4e7" : "#1a1a2e"),
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

      {/* Variation label */}
      <div
        className="absolute top-14 right-4 z-10 text-xs"
        style={{
          color: mode === "off" ? "#a1a1aa" : "#555577",
          fontFamily: "'Space Mono', monospace",
          transition: "color 0.5s",
        }}
      >
        V{variation}: {VARIATION_NAMES[variation - 1]}
      </div>

      {/* V9: Two-button layout */}
      {isV9 ? (
        <V9Buttons mode={mode} toggleShiny={toggleShiny} breakGlass={breakGlass} />
      ) : (
        /* Default bottom buttons */
        <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
          <button
            onClick={toggleShiny}
            disabled={mode === "broken"}
            className="cursor-pointer disabled:cursor-default"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.75rem",
              padding: "6px 14px",
              borderRadius: "6px",
              border: mode === "on"
                ? "1px solid rgba(0,255,255,0.4)"
                : "1px solid #d4d4d8",
              background: mode === "on"
                ? "rgba(0,255,255,0.1)"
                : mode === "broken" ? "#e4e4e7" : "#fff",
              color: mode === "on"
                ? "#00ffff"
                : mode === "broken" ? "#a1a1aa" : "#18181b",
              boxShadow: mode === "on"
                ? "0 0 12px rgba(0,255,255,0.2)"
                : "0 1px 3px rgba(0,0,0,0.1)",
              transition: "all 0.3s",
              opacity: mode === "broken" ? 0.4 : 1,
            }}
          >
            {mode === "on" ? "SHINY: ON" : "SHINY: OFF"}
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={mode !== "broken" ? breakGlass : undefined}
              className={`relative w-10 h-10 rounded-full ${
                mode === "broken"
                  ? "cursor-default scale-90"
                  : "cursor-pointer hover:scale-105 active:scale-95"
              }`}
              style={{
                background: mode === "broken"
                  ? "radial-gradient(circle at 40% 35%, #666, #333)"
                  : "radial-gradient(circle at 40% 35%, #ff4444, #cc0000)",
                boxShadow: mode === "broken"
                  ? "0 2px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.3)"
                  : "0 0 12px rgba(255,0,0,0.4), 0 0 24px rgba(255,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,100,100,0.3)",
                border: mode === "broken" ? "3px solid #555" : "3px solid #990000",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            />
            <span
              className="text-center leading-tight max-w-24"
              style={{
                fontFamily: "'Caveat', 'Segoe Script', cursive",
                color: mode === "broken" ? "#777" : (mode === "off" ? "#18181b" : "#e2e2ff"),
                opacity: mode === "broken" ? 0.4 : 0.7,
                fontSize: "0.95rem",
                transition: "color 0.5s, opacity 0.3s",
              }}
            >
              {mode === "broken" ? "Oops..." : "Break glass"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function V9Buttons({
  mode,
  toggleShiny,
  breakGlass,
}: {
  mode: HeroMode;
  toggleShiny: () => void;
  breakGlass: () => void;
}) {
  return (
    <>
      {/* "Press this button" — centered, big, inviting CTA */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center">
        <button
          onClick={toggleShiny}
          disabled={mode === "broken"}
          className="cursor-pointer disabled:cursor-default group"
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: mode === "on" ? "1rem" : "1.15rem",
            fontWeight: 600,
            padding: mode === "on" ? "12px 32px" : "16px 48px",
            borderRadius: "60px",
            border: mode === "on"
              ? "2px solid rgba(0,255,255,0.5)"
              : mode === "broken"
                ? "2px solid #333"
                : "2px solid #18181b",
            background: mode === "on"
              ? "linear-gradient(135deg, rgba(0,255,255,0.15), rgba(0,200,255,0.1))"
              : mode === "broken"
                ? "#222"
                : "linear-gradient(135deg, #18181b, #27272a)",
            color: mode === "on"
              ? "#00ffff"
              : mode === "broken"
                ? "#555"
                : "#fff",
            boxShadow: mode === "on"
              ? "0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(0,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)"
              : mode === "broken"
                ? "none"
                : "0 4px 20px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            letterSpacing: "0.05em",
            opacity: mode === "broken" ? 0.3 : 1,
            transform: mode === "broken" ? "scale(0.9)" : undefined,
          }}
        >
          {mode === "on" ? "✨ It's on!" : mode === "broken" ? "..." : "Press this button"}
        </button>
      </div>

      {/* "Never press this button" — bottom-right, smaller, dangerous */}
      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={mode !== "broken" ? breakGlass : undefined}
          className={`group ${
            mode === "broken"
              ? "cursor-default"
              : "cursor-pointer"
          }`}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.7rem",
            fontWeight: 400,
            padding: "8px 16px",
            borderRadius: "8px",
            border: mode === "broken"
              ? "1px solid #333"
              : "1px solid rgba(255,0,0,0.3)",
            background: mode === "broken"
              ? "rgba(30,30,30,0.8)"
              : "rgba(40,0,0,0.6)",
            color: mode === "broken"
              ? "#444"
              : "#ff4444",
            boxShadow: mode === "broken"
              ? "none"
              : "0 0 8px rgba(255,0,0,0.15), 0 0 20px rgba(255,0,0,0.05)",
            transition: "all 0.3s",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            opacity: mode === "broken" ? 0.3 : 0.8,
            backdropFilter: "blur(4px)",
          }}
        >
          {mode === "broken" ? "too late" : "Never press this button"}
        </button>
      </div>

      {/* Scroll hint — only when shiny is on */}
      {mode === "on" && (
        <div
          className="absolute bottom-8 left-0 right-0 z-10 flex justify-center pointer-events-none"
          style={{
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.15em",
            }}
          >
            SCROLL DOWN
          </span>
        </div>
      )}
    </>
  );
}
