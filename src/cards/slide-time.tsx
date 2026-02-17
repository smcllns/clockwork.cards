import { useState } from "react";
import { Slide, KeyMetric, Title, Unit } from "../components/slide";
import { InlineDropdown } from "../components/controls";
import { useNow } from "../components/useNow";
import { MS_PER_SEC, MS_PER_MIN, MS_PER_HOUR, MS_PER_DAY, DAYS_PER_YEAR } from "../constants";
import { getAge } from "../utils";

const TIME_UNITS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"] as const;
type TimeUnit = typeof TIME_UNITS[number];

export default function TimeCard({ dob, name }: { dob: string; name: string }) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("seconds");
  const now = useNow();

  const msAlive = now - new Date(dob).getTime();
  const daysAlive = msAlive / MS_PER_DAY;

  const values: Record<TimeUnit, number> = {
    years: getAge(new Date(dob), now),
    months: Math.floor(daysAlive / (DAYS_PER_YEAR / 12)),
    weeks: Math.floor(daysAlive / 7),
    days: Math.floor(daysAlive),
    hours: Math.floor(msAlive / MS_PER_HOUR),
    minutes: Math.floor(msAlive / MS_PER_MIN),
    seconds: Math.floor(msAlive / MS_PER_SEC),
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
