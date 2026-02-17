import { useState } from "react";
import { Slide, KeyMetric, Title, Unit } from "../components/slide";
import { InlineDropdown } from "../components/controls";
import { useNow } from "../components/useNow";
import { getAge } from "../utils";

const TIME_UNITS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"] as const;
type TimeUnit = typeof TIME_UNITS[number];

export default function TimeCard({ dob, name }: { dob: string; name: string }) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("seconds");
  const now = useNow();

  const msAlive = now - new Date(dob).getTime();
  const daysAlive = msAlive / 86_400_000;

  const values: Record<TimeUnit, number> = {
    years: getAge(new Date(dob), now),
    months: Math.floor(daysAlive / (365.25 / 12)),
    weeks: Math.floor(daysAlive / 7),
    days: Math.floor(daysAlive),
    hours: Math.floor(msAlive / 3_600_000),
    minutes: Math.floor(msAlive / 60_000),
    seconds: Math.floor(msAlive / 1000),
  };

  return (
    <Slide id="1">
      <Title>{name} is ...</Title>
      <KeyMetric>
        {timeUnit === "years"
          ? values[timeUnit].toFixed(3)
          : Math.floor(values[timeUnit]).toLocaleString()}
      </KeyMetric>
      <Unit><InlineDropdown options={TIME_UNITS} value={timeUnit} onChange={setTimeUnit} /> old, right now</Unit>
    </Slide>
  );
}
