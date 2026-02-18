import { useEffect, useRef, useState } from "react";
import RAPIER from "@dimforge/rapier3d-compat";
import { initV11 } from "./scene";
import forestLight from "../../assets/hero-bg-forest-light.png";
import forestShiny from "../../assets/hero-bg-forest-shiny.png";

type HeroMode = import("./shared").HeroMode;
type VariationHandle = { setMode: (m: HeroMode) => void; setBg: (l: string, s: string) => void; dispose: () => void };

export default function HeroCyberpunk({ name, dob, shiny }: { name: string; dob: Date; shiny: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<VariationHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [chaos, setChaos] = useState(false);

  const mode: HeroMode = chaos ? (shiny ? "broken" : "broken-off") : shiny ? "on" : "off";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;

    const prev = container.querySelector("canvas");
    if (prev) prev.remove();
    handleRef.current?.dispose();
    handleRef.current = null;
    setReady(false);

    RAPIER.init().then(() => {
      if (disposed) return;
      const handle = initV11(container, name, dob);
      handleRef.current = handle;
      handle.setBg(forestLight, forestShiny);
      setReady(true);
    });

    return () => {
      disposed = true;
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [name, dob]);

  useEffect(() => {
    if (ready && handleRef.current) {
      handleRef.current.setMode(mode);
    }
  }, [mode, ready]);

  const bgSrc = shiny ? forestShiny : forestLight;

  return (
    <div className="h-[100dvh] relative snap-section">
      {/* Background image — img+object-cover is more reliable than CSS background-size on mobile */}
      <img src={bgSrc} className="absolute inset-0 w-full h-full object-cover" alt="" style={{ pointerEvents: "none" }} />

      {/* Subtle vignette — shiny sky is naturally dark, light needs gentle center dim for text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: shiny
            ? "radial-gradient(ellipse 85% 80% at 50% 52%, rgba(0,0,12,0.45) 0%, rgba(0,0,12,0.25) 55%, rgba(0,0,12,0) 100%)"
            : "radial-gradient(ellipse 70% 75% at 50% 40%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Three.js canvas mounts here */}
      <section ref={containerRef} className="absolute inset-0 overflow-hidden" />

      <div
        className="absolute bottom-4 left-4 z-10"
        style={{ opacity: shiny ? 1 : 0, pointerEvents: shiny ? "auto" : "none", transition: "opacity 0.5s" }}
      >
        <div
          className="select-none flex flex-col items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg"
          style={{
            backgroundColor: chaos ? "rgba(41,37,36,0.85)" : "rgba(10,10,15,0.75)",
            backdropFilter: "blur(8px)",
            border: chaos ? "1px solid #44403c" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: chaos ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: chaos ? "#57534e" : "#dc2626",
            }}
          >🚫 Do not touch</span>
          <button
            onClick={!chaos ? () => setChaos(true) : undefined}
            className={`relative flex-shrink-0 ${!chaos ? "cursor-pointer" : "cursor-default"}`}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              backgroundColor: chaos ? "#292524" : "#57534e",
              boxShadow: chaos
                ? "inset 0 1px 3px rgba(0,0,0,0.4)"
                : "inset 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)",
              border: chaos ? "1px solid #44403c" : "1px solid #a8a29e",
            }}
          >
            <div
              className="absolute top-[2px] rounded-full"
              style={{
                width: 14,
                height: 14,
                left: chaos ? 19 : 2,
                backgroundColor: chaos ? "#57534e" : "#e7e5e4",
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
