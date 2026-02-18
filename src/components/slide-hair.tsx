import { useState } from "react";
import { Slide, Narrative, N } from "../page/slide";
import { InlineStepper } from "../page/controls";
import { useNow } from "../lib/useNow";
import { getAge } from "../lib/utils";

const CM_PER_MONTH = 1.2;

export default function HairCard({ dob, name }: { dob: Date; name: string }) {
  const [cmPerMonth, setCmPerMonth] = useState(CM_PER_MONTH);
  const now = useNow();
  const age = getAge(dob, now);
  const months = age * 12;
  const totalCm = months * cmPerMonth;
  const totalM = totalCm / 100;

  return (
    <Slide id="4c">
      <Narrative>
        {name}'s hair grows about{" "}
        <InlineStepper value={cmPerMonth} min={0.6} max={2.0} step={0.1} unit=" cm"
          onChange={setCmPerMonth} />{" "}
        per month. If {name} had never had a haircut, it would now
        be <N>{totalM.toFixed(1)} meters</N> long!
      </Narrative>
    </Slide>
  );
}
