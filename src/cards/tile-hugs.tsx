import { useState } from "react";
import { Tile } from "../components/tile";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";


export default function HugsTile({ dob }: { dob: string }) {
  const [hugsPerDay, setHugsPerDay] = useState(2);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const totalHugs = daysAlive * hugsPerDay;

  return (
    <Tile
      id="5d" span={2} emoji="🤗"
      value={totalHugs.toLocaleString()}
      unit="hugs"
      headline="Moments of connection"
      body={<>If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. At{" "}
        <InlineStepper value={hugsPerDay} min={1} max={10} step={1} onChange={setHugsPerDay} />{" "}
        hugs a day, that's {totalHugs.toLocaleString()} moments where your body is quietly saying: "This person matters to me."</>}
    />
  );
}
