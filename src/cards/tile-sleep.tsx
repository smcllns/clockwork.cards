import { Tile, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, DAYS_PER_YEAR } from "../constants";
import { fmt, fmtYears } from "../utils";

export default function SleepTile({ dob }: { dob: string; name: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const sleepHours = daysAlive * 10;
  const sleepYears = sleepHours / (24 * DAYS_PER_YEAR);

  return (
    <Tile id="5a" span={3}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-1">🧠</span>
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
              data-stat
            >{fmtYears(sleepYears)} years</span>
            <span className="text-sm" style={css.secondary}>of brain filing time</span>
          </div>
          <p className="text-sm font-semibold mt-1" style={css.primary}>{fmt(sleepHours)} hours of sleep so far</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>
        Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift.
      </p>
    </Tile>
  );
}
