import { useState } from "react";
import { InlineDropdown } from "./controls";
import { useNow } from "./useNow";
import { getAge } from "../lib/utils";
import { PhotoSlide } from "./photo-slide";
import imgLight from "../assets/photo-time.png";
import imgShiny from "../assets/photo-time-shiny.png";

const TIME_UNITS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"] as const;
type TimeUnit = typeof TIME_UNITS[number];

export default function TimePhoto({ dob, name, shiny }: { dob: Date; name: string; shiny: boolean }) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("seconds");
  const now = useNow();

  const msAlive = now - dob.getTime();
  const daysAlive = msAlive / 86_400_000;

  const values: Record<TimeUnit, number> = {
    years: getAge(dob, now),
    months: Math.floor(daysAlive / (365.25 / 12)),
    weeks: Math.floor(daysAlive / 7),
    days: Math.floor(daysAlive),
    hours: Math.floor(msAlive / 3_600_000),
    minutes: Math.floor(msAlive / 60_000),
    seconds: Math.floor(msAlive / 1000),
  };

  return (
    <PhotoSlide
      id="1"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      intro={`${name} is ...`}
      value={timeUnit === "years"
        ? values[timeUnit].toFixed(3)
        : Math.floor(values[timeUnit]).toLocaleString()}
      unit={<><InlineDropdown options={TIME_UNITS} value={timeUnit} onChange={setTimeUnit} /> old, right now</>}
    />
  );
}
