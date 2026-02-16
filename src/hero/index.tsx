import { useEffect, useRef, useState } from "react";
import RAPIER from "@dimforge/rapier3d-compat";
import { initV11 } from "./scene";

export type HeroMode = "off" | "on" | "broken";
type VariationHandle = { setMode: (m: HeroMode) => void; dispose: () => void };

export default function Hero({ name, dob, mode }: { name: string; dob: string; mode: HeroMode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<VariationHandle | null>(null);
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

    RAPIER.init().then(() => {
      if (disposed) return;
      const handle = initV11(container, name, dob);
      handleRef.current = handle;
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
    <section ref={containerRef} className="h-full overflow-hidden" />
  );
}
