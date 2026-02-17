import { useState, useEffect } from "react";
import { Slide, BigNum, SlideUnit, SlideHeadline, SlideBody } from "./layout";
import { InlineDropdown } from "./controls";
import { fmt, fmtYears } from "./stats";

const MS_PER_SEC = 1000;
const MS_PER_MIN = MS_PER_SEC * 60;
const MS_PER_HOUR = MS_PER_MIN * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const DAYS_PER_YEAR = 365.25;

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

function computeTime(dob: string, now: number) {
  const msAlive = now - new Date(dob).getTime();
  const daysAlive = msAlive / MS_PER_DAY;
  const hoursAlive = msAlive / MS_PER_HOUR;
  const minutesAlive = msAlive / MS_PER_MIN;
  const secondsAlive = msAlive / MS_PER_SEC;
  const monthsAlive = daysAlive / (DAYS_PER_YEAR / 12);

  const dobDate = new Date(dob);
  const nowDate = new Date(now);
  let age = nowDate.getFullYear() - dobDate.getFullYear();
  const monthDiff = nowDate.getMonth() - dobDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && nowDate.getDate() < dobDate.getDate())) {
    age--;
  }
  const lastBirthday = new Date(dobDate);
  lastBirthday.setFullYear(dobDate.getFullYear() + age);
  const nextBirthday = new Date(dobDate);
  nextBirthday.setFullYear(dobDate.getFullYear() + age + 1);
  const yearMs = nextBirthday.getTime() - lastBirthday.getTime();
  const elapsed = now - lastBirthday.getTime();
  const yearsAlive = age + elapsed / yearMs;

  return {
    yearsAlive,
    monthsAlive: Math.floor(monthsAlive),
    weeksAlive: Math.floor(daysAlive / 7),
    daysAlive: Math.floor(daysAlive),
    hoursAlive: Math.floor(hoursAlive),
    minutesAlive: Math.floor(minutesAlive),
    secondsAlive: Math.floor(secondsAlive),
  };
}

export default function TimeCard({ dob, name }: { dob: string; name: string }) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("seconds");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = computeTime(dob, now);
  const values: Record<TimeUnit, number> = {
    years: t.yearsAlive, months: t.monthsAlive, weeks: t.weeksAlive,
    days: t.daysAlive, hours: t.hoursAlive, minutes: t.minutesAlive, seconds: t.secondsAlive,
  };

  return (
    <Slide id="1">
      <span className="text-4xl block mb-4">{name} is ...</span>
      <BigNum>{timeUnit === "years" ? fmtYears(values[timeUnit]) : fmt(values[timeUnit])}</BigNum>
      {/* <SlideUnit>{timeUnit} old</SlideUnit> */}
      <SlideHeadline><InlineDropdown options={TIME_UNITS} value={timeUnit} onChange={setTimeUnit} /> old right now</SlideHeadline>
      {/* <SlideBody>
        That's {fmtYears(t.yearsAlive)} years, {fmt(t.monthsAlive)} months, {fmt(t.weeksAlive)} weeks, {fmt(t.daysAlive)} days,{" "}
        {fmt(t.hoursAlive)} hours, {fmt(t.minutesAlive)} minutes,
        or {fmt(t.secondsAlive)} seconds — every single one of them yours.
      </SlideBody> */}
        
    </Slide>
  );
}
