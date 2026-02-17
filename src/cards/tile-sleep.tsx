import { useState } from "react";
import { Tile } from "../components/tile";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";


export default function SleepTile({ dob }: { dob: string }) {
  const [hoursPerNight, setHoursPerNight] = useState(10);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const sleepHours = daysAlive * hoursPerNight;
  const sleepYears = sleepHours / (24 * 365.25);

  return (
    <Tile
      id="5a" span={3} emoji="🧠"
      value={`${sleepYears.toFixed(3)} years`}
      unit="of brain filing time"
      headline={`${sleepHours.toLocaleString()} hours of sleep so far`}
      body={<>Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
        <InlineStepper value={hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={setHoursPerNight} />{" "}
        per night.</>}
    />
  );
}
