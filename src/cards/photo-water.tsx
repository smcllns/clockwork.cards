import { useState } from "react";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { OLYMPIC_POOL_LITERS, GLASS_ML } from "../constants";
import { IdTag } from "../components/section";
import imgLight from "../assets/photo-water.png";
import imgShiny from "../assets/photo-water-shiny.png";

export default function WaterPhoto({ dob, name, shiny }: { dob: string; name: string; shiny: boolean }) {
  const [glassesPerDay, setGlassesPerDay] = useState(6);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const litersPerDay = (glassesPerDay * GLASS_ML) / 1000;
  const waterLiters = daysAlive * litersPerDay;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const poolYearsRemaining = (OLYMPIC_POOL_LITERS - waterLiters) / litersPerDay / 365.25;

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
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div className="absolute top-4 right-6 z-10"><IdTag id="5f" /></div>

      <div className="relative z-10 px-6 pb-12 pt-8 max-w-xl mx-auto w-full">
        <p className="text-lg font-medium mb-1 text-white/70">{name} has drunk ...</p>
        <div className="mb-1">
          <span
            className="font-bold leading-none text-white"
            style={{ fontFamily: "var(--font-stat)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
            data-stat
          >
            {Math.floor(waterLiters).toLocaleString()}
          </span>
        </div>
        <p className="text-lg font-medium mb-5 text-white/70">liters of water</p>
        <p className="text-xl font-semibold mb-5 text-white">
          That's {waterPoolPercent.toFixed(1)}% of an Olympic swimming pool.
        </p>
        <p className="text-base leading-relaxed text-white/60">
          An Olympic pool holds 2.5 million liters. At{" "}
          <InlineStepper value={glassesPerDay} min={2} max={12} step={1} onChange={setGlassesPerDay} />{" "}
          glasses a day, it would take {name} about {Math.floor(poolYearsRemaining).toLocaleString()} more years to drink the rest.
        </p>
      </div>
    </div>
  );
}
