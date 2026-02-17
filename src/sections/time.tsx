import { useState } from "react";
import { Slide, KeyMetric, Title, Unit } from "../components/slide";
import { InlineDropdown } from "../components/controls";
import { useNow } from "../components/useNow";
import { MS_PER_SEC, MS_PER_MIN, MS_PER_HOUR, MS_PER_DAY, DAYS_PER_YEAR } from "../constants";
import { preciseAge, fmt, fmtYears } from "../utils";

const TIME_UNITS = [
  { value: "years", label: "years" },
  { value: "months", label: "months" },
  { value: "weeks", label: "weeks" },
  { value: "days", label: "days" },
  { value: "hours", label: "hours" },
  { value: "minutes", label: "minutes" },
  { value: "seconds", label: "seconds" },
] as const;
type TimeUnit = typeof TIME_UNITS[number]["value"];

export default function TimeCard({ dob, name }: { dob: string; name: string }) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("seconds");
  const now = useNow();

  const msAlive = now - new Date(dob).getTime();
  const daysAlive = msAlive / MS_PER_DAY;

  const values: Record<TimeUnit, number> = {
    years: preciseAge(new Date(dob), now),
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
      <KeyMetric>{timeUnit === "years" ? fmtYears(values[timeUnit]) : fmt(values[timeUnit])}</KeyMetric>
      <Unit><InlineDropdown options={TIME_UNITS} value={timeUnit} onChange={setTimeUnit} /> old, right now</Unit>
    </Slide>
  );
}
