import { useState } from "react";
import { Tile } from "../page/tile";
import { InlineStepper } from "../page/controls";
import { useNow } from "../../lib/useNow";


export default function HugsTile({ dob, name }: { dob: Date; name: string }) {
  const [hugsPerDay, setHugsPerDay] = useState(2);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const totalHugs = daysAlive * hugsPerDay;

  return (
    <Tile
      id="5d" emoji="🤗"
      value={totalHugs.toLocaleString()}
      unit="hugs"
      headline="Moments of connection"
      body={<>When {name} hugs someone for 10 seconds, the body releases oxytocin, which helps feel calm and safe. At{" "}
        <InlineStepper value={hugsPerDay} min={1} max={10} step={1} onChange={setHugsPerDay} />{" "}
        hugs a day, that's {totalHugs.toLocaleString()} moments of "this person matters to me."</>}
    />
  );
}
