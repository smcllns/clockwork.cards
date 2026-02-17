import { useState } from "react";
import { InlineDropdown } from "../components/controls";
import { useNow } from "../components/useNow";
import { getAge } from "../utils";
import { IdTag } from "../components/section";
import imgLight from "../assets/photo-time.png";
import imgShiny from "../assets/photo-time-shiny.png";

const TIME_UNITS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"] as const;
type TimeUnit = typeof TIME_UNITS[number];

export default function TimePhoto({ dob, name, shiny }: { dob: string; name: string; shiny: boolean }) {
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
    <div
      className="relative snap-section flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <img
        src={imgLight}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: shiny ? 0 : 1 }}
      />
      <img
        src={imgShiny}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: shiny ? 1 : 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      <div className="absolute top-4 right-6 z-10"><IdTag id="1" /></div>

      <div className="relative z-10 px-6 pb-12 pt-8 max-w-xl mx-auto w-full">
        <p className="text-lg font-medium mb-1 text-white/70">{name} is ...</p>
        <div className="mb-1">
          <span
            className="font-bold leading-none text-white"
            style={{ fontFamily: "var(--font-stat)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
            data-stat
          >
            {timeUnit === "years"
              ? values[timeUnit].toFixed(3)
              : Math.floor(values[timeUnit]).toLocaleString()}
          </span>
        </div>
        <p className="text-lg font-medium mb-5 text-white/70">
          <InlineDropdown options={TIME_UNITS} value={timeUnit} onChange={setTimeUnit} /> old, right now
        </p>
      </div>
    </div>
  );
}
