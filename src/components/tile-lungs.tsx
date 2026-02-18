import { useState } from "react";
import { Tile } from "./tile";
import { InlineStepper } from "./controls";
import { useNow } from "../lib/useNow";
import { HARD_PLAY_LITERS_PER_MIN } from "../lib/constants";

export default function LungsTile({ dob, name }: { dob: Date; name: string }) {
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const lungExtraLiters = daysAlive * hoursPerDay * 60 * HARD_PLAY_LITERS_PER_MIN;

  return (
    <Tile
      id="5e" emoji="💪"
      value={`${(lungExtraLiters / 1e6).toFixed(1)} million`}
      unit="extra liters of air"
      headline={`${name}'s lungs are getting seriously strong`}
      body={<>Every minute spent running or playing hard, the lungs pull in 40–60 liters of air, compared with 5–8 when resting. At{" "}
        <InlineStepper value={hoursPerDay} min={1} max={4} step={1} unit=" hr" onChange={setHoursPerDay} />{" "}
        of hard play per day, that's a serious workout.</>}
    />
  );
}
