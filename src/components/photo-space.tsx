import { useState } from "react";
import { InlinePills } from "./controls";
import { useNow } from "./useNow";
import { KM_PER_MILE, EARTH_ORBITAL_MPH, LIGHT_SPEED_MPH } from "../lib/constants";
import { getAge } from "../lib/utils";
import { PhotoSlide } from "./photo-slide";
import imgLight from "../assets/photo-space.png";
import imgShiny from "../assets/photo-space-shiny.png";

export default function SpacePhoto({ dob, name, shiny }: { dob: Date; name: string; shiny: boolean }) {
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const now = useNow();

  const hoursAlive = (now - dob.getTime()) / 3_600_000;
  const milesInSpace = hoursAlive * EARTH_ORBITAL_MPH;
  const lightSpeedHours = milesInSpace / LIGHT_SPEED_MPH;
  const lapsAroundSun = getAge(dob, now);

  const k = unit === "km" ? KM_PER_MILE : 1;
  const unitLabel = unit === "km" ? "kph" : "mph";

  return (
    <PhotoSlide
      id="2"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      intro={`${name} has flown ...`}
      value={`${(milesInSpace * k / 1e9).toFixed(1)} billion`}
      unit={<><InlinePills
        options={[
          { value: "miles" as const, label: "miles" },
          { value: "km" as const, label: "kilometers" },
        ]}
        value={unit}
        onChange={setUnit}
      /> through space</>}
      headline={`${name}'s not just a kid, ${name}'s an interstellar traveler!`}
      body={<>
        Earth flies through our solar system at {Math.round(EARTH_ORBITAL_MPH * k).toLocaleString()} {unitLabel} — and {name} has been going that speed for {lapsAroundSun.toFixed(3)} years. But light would still win: at {Math.round(LIGHT_SPEED_MPH * k).toLocaleString()} {unitLabel}, it'd cover that distance in just {lightSpeedHours.toFixed(1)} hours.
      </>}
    />
  );
}
