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
  // Chaos MUST NOT persist across reloads — reload is the only escape hatch. Never init from localStorage/sessionStorage/URL.
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

  return (
    <div className="h-[100svh] relative" style={{ flexShrink: 0 }}>
      {/* Background image — both variants always rendered; opacity switches instantly on shiny toggle */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden" style={{ bottom: "var(--nav-height, 48px)" }}>
        <img
          src={forestLight}
          className="absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-700"
          alt=""
          style={{ opacity: shiny ? 0 : 1, pointerEvents: "none" }}
          fetchPriority="high"
        />
        <img
          src={forestShiny}
          className="absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-700"
          alt=""
          style={{ opacity: shiny ? 1 : 0, pointerEvents: "none" }}
        />
      </div>

      {/* Subtle vignette — shiny sky is naturally dark, light needs gentle center dim for text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: shiny
            ? "radial-gradient(ellipse 85% 80% at 50% 52%, rgba(0,0,12,0.45) 0%, rgba(0,0,12,0.25) 55%, rgba(0,0,12,0) 100%)"
            : "radial-gradient(ellipse 70% 75% at 50% 40%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Three.js canvas — stops at nav top so balls settle on visible cliff, not behind nav */}
      <section ref={containerRef} className="absolute top-0 left-0 right-0 overflow-hidden" style={{ bottom: "var(--nav-height, 48px)" }} />

      <div
        className="absolute top-4 right-4 z-10"
        style={{ opacity: shiny ? 1 : 0, pointerEvents: shiny ? "auto" : "none", transition: "opacity 0.5s" }}
      >
        <div
          className="select-none flex flex-col items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg"
          style={{
            backgroundColor: chaos ? "rgba(41,37,36,0.85)" : "rgba(15,5,30,0.85)",
            backdropFilter: "blur(8px)",
            border: chaos ? "1px solid #44403c" : "1px solid rgba(168,85,247,0.55)",
            boxShadow: chaos ? "0 2px 8px rgba(0,0,0,0.3)" : undefined,
            cursor: !chaos ? "pointer" : "default",
            color: chaos ? "#57534e" : "#c084fc",
          }}
          onClick={!chaos ? () => setChaos(true) : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-triangle-alert-icon lucide-triangle-alert"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              maxWidth: "8rem",
              textAlign: "center",
            }}
          >
            Do <em>NOT</em> press this button!
          </span>
          <button
            className={`relative flex-shrink-0 ${!chaos ? "cursor-pointer" : "cursor-default"}`}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              backgroundColor: chaos ? "#292524" : "rgba(88,28,135,0.7)",
              boxShadow: chaos ? "inset 0 1px 3px rgba(0,0,0,0.4)" : "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 6px rgba(168,85,247,0.3)",
              border: chaos ? "1px solid #44403c" : "1px solid #a855f7",
            }}
          >
            <div
              className="absolute top-[2px] rounded-full"
              style={{
                width: 14,
                height: 14,
                left: chaos ? 19 : 2,
                backgroundColor: chaos ? "#57534e" : "#e879f9",
                boxShadow: chaos ? "0 1px 2px rgba(0,0,0,0.2)" : "0 0 6px rgba(232,121,249,0.7)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
