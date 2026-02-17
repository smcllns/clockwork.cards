import { useState } from "react";
import { Slide, KeyMetric, Unit, Headline, Body } from "../components/slide";
import { InlinePills } from "../components/controls";
import { useNow } from "../components/useNow";
import { KM_PER_MILE, EARTH_ORBITAL_MPH, LIGHT_SPEED_MPH } from "../constants";
import { getAge } from "../utils";

export default function SpaceCard({ dob, name }: { dob: string; name: string }) {
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const now = useNow();

  const hoursAlive = (now - new Date(dob).getTime()) / 3_600_000;
  const milesInSpace = hoursAlive * EARTH_ORBITAL_MPH;
  const lightSpeedHours = milesInSpace / LIGHT_SPEED_MPH;
  const lapsAroundSun = getAge(new Date(dob), now);

  const k = unit === "km" ? KM_PER_MILE : 1;
  const unitLabel = unit === "km" ? "kph" : "mph";

  return (
    <Slide alt id="2">
      <Headline>🚀 {name} has flown ...</Headline>
      <KeyMetric>{(milesInSpace * k / 1e9).toFixed(1)} billion</KeyMetric>
      <Unit>
        <InlinePills
          options={[
            { value: "miles" as const, label: "miles" },
            { value: "km" as const, label: "kilometers" },
          ]}
          value={unit}
          onChange={setUnit}
        />{" "}through space
      </Unit>
      <Headline>{name}'s not just a kid, {name}'s an interstellar traveler!</Headline>
      <Body>
        Because Earth is flying through our solar system at {Math.round(EARTH_ORBITAL_MPH * k).toLocaleString()} {unitLabel} and {name} has been going that speed for {lapsAroundSun.toFixed(3)} years!
      </Body>
      <Body>
        But also, let's be real, light would still whoop {name} in a race. Traveling at {Math.round(LIGHT_SPEED_MPH * k).toLocaleString()} {unitLabel}, a beam of light would cover that same distance in just {lightSpeedHours.toFixed(1)} hours.
      </Body>
    </Slide>
  );
}
