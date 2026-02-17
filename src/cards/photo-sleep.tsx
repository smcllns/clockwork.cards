import { useState } from "react";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { PhotoSlide } from "../components/photo-slide";
import imgLight from "../assets/photo-sleep.png";
import imgShiny from "../assets/photo-sleep-shiny.png";

export default function SleepPhoto({ dob, name, shiny }: { dob: string; name: string; shiny: boolean }) {
  const [hoursPerNight, setHoursPerNight] = useState(10);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const sleepHours = daysAlive * hoursPerNight;
  const sleepYears = sleepHours / (24 * 365.25);

  return (
    <PhotoSlide
      id="5a"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      objectPosition="center 30%"
      gradient="linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)"
    >
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
      <p className="text-lg font-semibold mb-4 text-white">
        {sleepHours.toLocaleString()} hours of sleep so far.
      </p>
      <p className="text-sm leading-relaxed text-white/60">
        Every night while {name} sleeps, the brain sorts through everything learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
        <InlineStepper value={hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={setHoursPerNight} />{" "}
        per night.
      </p>
    </PhotoSlide>
  );
}
