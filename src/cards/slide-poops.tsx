import { useState } from "react";
import { Slide, Narrative, N } from "../components/slide";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { getAge } from "../utils";

export default function PoopsCard({ dob }: { dob: string }) {
  const [perDay, setPerDay] = useState(1.5);
  const now = useNow();
  const dobDate = new Date(dob);
  const daysAlive = Math.floor((now - dobDate.getTime()) / 86_400_000);
  const age = getAge(dobDate, now, 2);

  return (
    <Slide id="4e">
      <Narrative>
        Everyone poops. At{" "}
        <InlineStepper value={perDay} min={0.5} max={4} step={0.5} decimals={1}
          onChange={setPerDay} />{" "}
        times a day, by the time you're <N>{age}</N> years old, you'll have done around{" "}
        <N>{Math.floor(daysAlive * perDay).toLocaleString()} poops</N>. That's a lot of flushes.
      </Narrative>
    </Slide>
  );
}
