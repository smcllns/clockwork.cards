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
];

function getVariation(): number {
  const v = new URLSearchParams(window.location.search).get("v");
  if (v) {
    const n = parseInt(v, 10);
    if (n >= 1 && n <= 5) return n;
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

    // Clean any previous canvas
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

  // Sync mode changes to the handle
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

  return (
    <div className="h-dvh relative">
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
        {[1, 2, 3, 4, 5].map(v => (
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

      {/* Bottom buttons */}
      <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
        {/* Shiny Mode toggle */}
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

        {/* Break Glass button */}
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
    </div>
  );
}
