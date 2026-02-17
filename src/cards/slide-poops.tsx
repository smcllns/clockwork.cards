import { useState } from "react";
import { Slide, Narrative, N } from "../components/slide";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { MS_PER_DAY } from "../constants";

export default function PoopsCard({ dob }: { dob: string }) {
  const [perDay, setPerDay] = useState(1.5);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);

  return (
    <Slide id="4e">
      <Narrative>
        If you poop{" "}
        <InlineStepper value={perDay} min={0.5} max={4} step={0.5} decimals={1}
          onChange={setPerDay} />{" "}
        times per day on average, you've pooped around <N>{Math.floor(daysAlive * perDay).toLocaleString()} times</N> so far.
      </Narrative>
    </Slide>
  );
}
