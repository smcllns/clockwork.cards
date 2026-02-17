import { useState } from "react";
import { Tile } from "../components/tile";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { HARD_PLAY_LITERS_PER_MIN } from "../constants";

export default function LungsTile({ dob }: { dob: string }) {
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const lungExtraLiters = daysAlive * hoursPerDay * 60 * HARD_PLAY_LITERS_PER_MIN;

  return (
    <Tile
      id="5e" span={3} emoji="💪"
      value={`${(lungExtraLiters / 1e6).toFixed(1)} million`}
      unit="extra liters of air"
      headline="Your lungs are getting seriously strong"
      body={<>Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. At{" "}
        <InlineStepper value={hoursPerDay} min={1} max={4} step={1} unit=" hr" onChange={setHoursPerDay} />{" "}
        of hard play per day, that's a serious workout for your lungs.</>}
    />
  );
}
