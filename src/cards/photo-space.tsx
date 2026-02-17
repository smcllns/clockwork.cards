import { useState } from "react";
import { InlinePills } from "../components/controls";
import { useNow } from "../components/useNow";
import { KM_PER_MILE, EARTH_ORBITAL_MPH, LIGHT_SPEED_MPH } from "../constants";
import { getAge } from "../utils";
import { PhotoSlide } from "../components/photo-slide";
import imgLight from "../assets/photo-space.png";
import imgShiny from "../assets/photo-space-shiny.png";

export default function SpacePhoto({ dob, name, shiny }: { dob: string; name: string; shiny: boolean }) {
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const now = useNow();

  const hoursAlive = (now - new Date(dob).getTime()) / 3_600_000;
  const milesInSpace = hoursAlive * EARTH_ORBITAL_MPH;
  const lightSpeedHours = milesInSpace / LIGHT_SPEED_MPH;
  const lapsAroundSun = getAge(new Date(dob), now);

  const k = unit === "km" ? KM_PER_MILE : 1;
  const unitLabel = unit === "km" ? "kph" : "mph";

  return (
    <PhotoSlide
      id="2"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      gradient="linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.9) 100%)"
    >
      <p className="text-lg font-medium mb-1 text-white/70">{name} has flown ...</p>
      <div className="mb-1">
        <span
          className="font-bold leading-none text-white"
          style={{ fontFamily: "var(--font-stat)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
          data-stat
        >
          {(milesInSpace * k / 1e9).toFixed(1)} billion
        </span>
      </div>
      <p className="text-lg font-medium mb-5 text-white/70">
        <InlinePills
          options={[
            { value: "miles" as const, label: "miles" },
            { value: "km" as const, label: "kilometers" },
          ]}
          value={unit}
          onChange={setUnit}
        /> through space
      </p>
      <p className="text-lg font-semibold mb-4 text-white">
        {name}'s not just a kid, {name}'s an interstellar traveler!
      </p>
      <p className="text-sm leading-relaxed text-white/60">
        Earth flies through our solar system at {Math.round(EARTH_ORBITAL_MPH * k).toLocaleString()} {unitLabel} — and {name} has been going that speed for {lapsAroundSun.toFixed(3)} years. But light would still win: at {Math.round(LIGHT_SPEED_MPH * k).toLocaleString()} {unitLabel}, it'd cover that distance in just {lightSpeedHours.toFixed(1)} hours.
      </p>
    </PhotoSlide>
  );
}
