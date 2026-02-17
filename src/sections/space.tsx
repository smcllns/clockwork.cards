import { useState } from "react";
import { Slide, KeyMetric, Unit, Headline, Body } from "../components/slide";
import { InlinePills } from "../components/controls";
import { useNow } from "../components/useNow";

const KM_PER_MILE = 1.60934;
const EARTH_ORBITAL_MPH = 67_000;
const LIGHT_SPEED_MPH = 669_600_000;

type SpaceUnit = "miles" | "km";

const UNIT_OPTIONS = [
  { value: "miles" as SpaceUnit, label: "miles" },
  { value: "km" as SpaceUnit, label: "kilometers" },
] as const;

export default function SpaceCard({ dob, name }: { dob: string; name: string }) {
  const [spaceUnit, setSpaceUnit] = useState<SpaceUnit>("miles");
  const now = useNow();

  const msAlive = now - new Date(dob).getTime();
  const hoursAlive = msAlive / (1000 * 60 * 60);
  const milesInSpace = hoursAlive * EARTH_ORBITAL_MPH;
  const lightSpeedHours = milesInSpace / LIGHT_SPEED_MPH;

  const dobDate = new Date(dob);
  const nowDate = new Date(now);
  let age = nowDate.getFullYear() - dobDate.getFullYear();
  const monthDiff = nowDate.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && nowDate.getDate() < dobDate.getDate())) {
    age--;
  }
  const lastBirthday = new Date(dobDate);
  lastBirthday.setFullYear(dobDate.getFullYear() + age);
  const nextBirthday = new Date(dobDate);
  nextBirthday.setFullYear(dobDate.getFullYear() + age + 1);
  const yearMs = nextBirthday.getTime() - lastBirthday.getTime();
  const lapsAroundSun = age + (now - lastBirthday.getTime()) / yearMs;

  const isMiles = spaceUnit === "miles";
  const convert = (miles: number) => isMiles ? miles : miles * KM_PER_MILE;
  const unit = isMiles ? "mph" : "kph";
  const spaceVal = convert(milesInSpace);
  const earthSpeed = Math.round(convert(EARTH_ORBITAL_MPH)).toLocaleString();
  const lightSpeed = Math.round(convert(LIGHT_SPEED_MPH)).toLocaleString();

  const bigNum = spaceVal >= 1e9 ? `${(spaceVal / 1e9).toFixed(1)} billion`
    : spaceVal >= 1e6 ? `${(spaceVal / 1e6).toFixed(1)} million`
    : Math.floor(spaceVal).toLocaleString();

  return (
    <Slide alt id="2">
      <Headline>🚀 {name} has flown around the sun {lapsAroundSun.toFixed(3)} times, or ...</Headline>
      <KeyMetric>{bigNum}</KeyMetric>
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
