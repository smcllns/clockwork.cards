import { useState } from "react";
import { Tile } from "../page/tile";
import { InlineStepper } from "../page/controls";
import { useNow } from "../../lib/useNow";


export default function SleepTile({ dob, name }: { dob: Date; name: string }) {
  const [hoursPerNight, setHoursPerNight] = useState(10);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const sleepHours = daysAlive * hoursPerNight;
  const sleepYears = sleepHours / (24 * 365.25);

  return (
    <Tile
      id="5a" emoji="🧠"
      value={`${sleepYears.toFixed(3)} years`}
      unit="of brain filing time"
      headline={`${sleepHours.toLocaleString()} hours of sleep so far`}
      body={<>Every night while {name} sleeps, the brain sorts through everything learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
        <InlineStepper value={hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={setHoursPerNight} />{" "}
        per night.</>}
    />
  );
}
