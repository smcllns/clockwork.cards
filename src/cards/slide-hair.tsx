import { useState } from "react";
import { Slide, Narrative, N } from "../components/slide";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, DAYS_PER_YEAR } from "../constants";

export default function HairCard({ dob }: { dob: string }) {
  const [cmPerMonth, setCmPerMonth] = useState(1.2);
  const now = useNow();
  const monthsAlive = (now - new Date(dob).getTime()) / MS_PER_DAY / (DAYS_PER_YEAR / 12);
  const hairLengthCm = monthsAlive * cmPerMonth;

  return (
    <Slide id="4d">
      <Narrative>
        Your hair grows about{" "}
        <InlineStepper value={cmPerMonth} min={0.5} max={2.0} step={0.1}
          unit=" cm" decimals={1} onChange={setCmPerMonth} />{" "}
        per month. If you'd never had a haircut, your hair would now be about{" "}
        <N>{(hairLengthCm / 100).toFixed(1)} meters</N> long!
      </Narrative>
    </Slide>
  );
}
