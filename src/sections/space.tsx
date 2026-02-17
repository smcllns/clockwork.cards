import { useState } from "react";
import { Slide, KeyMetric, Unit, Headline, Body } from "../components/slide";
import { InlinePills } from "../components/controls";
import { useNow } from "../components/useNow";
import { KM_PER_MILE, EARTH_ORBITAL_MPH, LIGHT_SPEED_MPH, MS_PER_HOUR } from "../constants";
import { preciseAge, fmtBig } from "../utils";

type SpaceUnit = "miles" | "km";

const UNIT_OPTIONS = [
  { value: "miles" as SpaceUnit, label: "miles" },
  { value: "km" as SpaceUnit, label: "kilometers" },
] as const;

export default function SpaceCard({ dob, name }: { dob: string; name: string }) {
  const [spaceUnit, setSpaceUnit] = useState<SpaceUnit>("miles");
  const now = useNow();

  const hoursAlive = (now - new Date(dob).getTime()) / MS_PER_HOUR;
  const milesInSpace = hoursAlive * EARTH_ORBITAL_MPH;
  const lightSpeedHours = milesInSpace / LIGHT_SPEED_MPH;
  const lapsAroundSun = preciseAge(new Date(dob), now);

  const isMiles = spaceUnit === "miles";
  const convert = (miles: number) => isMiles ? miles : miles * KM_PER_MILE;
  const unit = isMiles ? "mph" : "kph";
  const spaceVal = convert(milesInSpace);
  const earthSpeed = Math.round(convert(EARTH_ORBITAL_MPH)).toLocaleString();
  const lightSpeed = Math.round(convert(LIGHT_SPEED_MPH)).toLocaleString();

  return (
    <Slide alt id="2">
      <Headline>🚀 {name} has flown around the sun {lapsAroundSun.toFixed(3)} times, or ...</Headline>
      <KeyMetric>{fmtBig(spaceVal)}</KeyMetric>
      <Unit>
        <InlinePills options={UNIT_OPTIONS} value={spaceUnit} onChange={setSpaceUnit} />{" "}through space
      </Unit>
      <Headline>He's not just a kid, he's an interstellar traveler!</Headline>
      <Body>
        Because Earth is flying through our solar system at {earthSpeed} {unit}, so you've been going that speed for {lapsAroundSun.toFixed(3)} years!
      </Body>
      <Body>
        But also, let's be real, light would still whoop you in a race. Traveling at {lightSpeed} {unit}, a beam of light would cover that same distance in just {lightSpeedHours.toFixed(1)} hours.
      </Body>
    </Slide>
  );
}
