import { useState } from "react";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { IdTag } from "../components/section";
import imgLight from "../assets/photo-sleep.png";
import imgShiny from "../assets/photo-sleep-shiny.png";

export default function SleepPhoto({ dob, name, shiny }: { dob: string; name: string; shiny: boolean }) {
  const [hoursPerNight, setHoursPerNight] = useState(10);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const sleepHours = daysAlive * hoursPerNight;
  const sleepYears = sleepHours / (24 * 365.25);

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
      <div className="absolute top-4 right-6 z-10"><IdTag id="5a" /></div>

      <div className="relative z-10 px-6 pb-12 pt-8 max-w-xl mx-auto w-full">
        <p className="text-lg font-medium mb-1 text-white/70">{name}'s brain has filed ...</p>
        <div className="mb-1">
          <span
            className="font-bold leading-none text-white"
            style={{ fontFamily: "var(--font-stat)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
            data-stat
          >
            {sleepYears.toFixed(3)}
          </span>
        </div>
        <p className="text-lg font-medium mb-5 text-white/70">years of memories</p>
        <p className="text-xl font-semibold mb-5 text-white">
          {sleepHours.toLocaleString()} hours of sleep so far.
        </p>
        <p className="text-base leading-relaxed text-white/60">
          Every night while {name} sleeps, the brain sorts through everything learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
          <InlineStepper value={hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={setHoursPerNight} />{" "}
          per night.
        </p>
      </div>
    </div>
  );
}
