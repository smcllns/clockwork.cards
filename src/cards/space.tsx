import { useState, useEffect } from "react";
import { Slide, BigNum, SlideUnit, SlideHeadline, SlideBody } from "./layout";
import { InlinePills } from "./controls";
import { fmt, fmtBig, fmtDecimal, fmtYears } from "./stats";

const MS_PER_HOUR = 1000 * 60 * 60;
const KM_PER_MILE = 1.60934;
const EARTH_ORBITAL_MPH = 67_000;
const LIGHT_SPEED_MPH = 669_600_000;

type SpaceUnit = "miles" | "km";

const UNIT_OPTIONS = [
  { value: "miles" as SpaceUnit, label: "miles" },
  { value: "km" as SpaceUnit, label: "kilometers" },
] as const;

function computeSpace(dob: string, now: number) {
  const hoursAlive = (now - new Date(dob).getTime()) / MS_PER_HOUR;
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
  const elapsed = now - lastBirthday.getTime();
  const lapsAroundSun = age + elapsed / yearMs;

  return { milesInSpace, lightSpeedHours, lapsAroundSun };
}

export default function SpaceCard({ dob }: { dob: string }) {
  const [spaceUnit, setSpaceUnit] = useState<SpaceUnit>("miles");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = computeSpace(dob, now);
  const isMiles = spaceUnit === "miles";
  const toUnit = (mph: number) => isMiles ? mph : mph * KM_PER_MILE;
  const speedLabel = (mph: number) => `${fmt(Math.round(toUnit(mph)))} ${isMiles ? "mph" : "kph"}`;
  const spaceVal = toUnit(s.milesInSpace);

  return (
    <Slide alt id="2">
      <span className="text-4xl block mb-4">🚀</span>
      <BigNum>{fmtBig(spaceVal)}</BigNum>
      <SlideUnit>
        <InlinePills options={UNIT_OPTIONS} value={spaceUnit} onChange={setSpaceUnit} />{" "}through space
      </SlideUnit>
      <SlideHeadline>You're an interstellar traveler.</SlideHeadline>
      <SlideBody>
        {fmtYears(s.lapsAroundSun)} laps around the sun. Earth moves at {speedLabel(EARTH_ORBITAL_MPH)} — you're not just a kid,
        you're an interstellar traveler. Though let's be real, light would still whoop you in a race:
        at {speedLabel(LIGHT_SPEED_MPH)}, it would cover that distance in just {fmtDecimal(s.lightSpeedHours)} hours.
      </SlideBody>
    </Slide>
  );
}
