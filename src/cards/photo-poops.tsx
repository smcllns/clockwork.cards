import { useState } from "react";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { getAge } from "../utils";
import { IdTag } from "../components/section";
import imgLight from "../assets/photo-poops.png";
import imgShiny from "../assets/photo-poops-shiny.png";

export default function PoopsPhoto({ dob, shiny }: { dob: string; shiny: boolean }) {
  const [perDay, setPerDay] = useState(1.5);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const totalPoops = Math.floor(daysAlive * perDay);

  return (
    <div
      className="relative snap-section flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <img
        src={imgLight}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ objectPosition: "center 30%", opacity: shiny ? 0 : 1 }}
      />
      <img
        src={imgShiny}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ objectPosition: "center 30%", opacity: shiny ? 1 : 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div className="absolute top-4 right-6 z-10"><IdTag id="4e" /></div>

      <div className="relative z-10 px-6 pb-12 pt-8 max-w-xl mx-auto w-full">
        <div className="mb-1">
          <span
            className="font-bold leading-none text-white"
            style={{ fontFamily: "var(--font-stat)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
            data-stat
          >
            {totalPoops.toLocaleString()}
          </span>
        </div>
        <p className="text-xl font-semibold mb-5 text-white">
          poops so far
        </p>
        <p className="text-base leading-relaxed text-white/60">
          If you poop{" "}
          <InlineStepper value={perDay} min={0.5} max={4} step={0.5} decimals={1} onChange={setPerDay} />{" "}
          times per day on average, that's a lot of flushes.
        </p>
      </div>
    </div>
  );
}
