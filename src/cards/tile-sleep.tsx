import { Tile } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, DAYS_PER_YEAR } from "../constants";
import { fmt, fmtYears } from "../utils";

export default function SleepTile({ dob }: { dob: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const sleepHours = daysAlive * 10;
  const sleepYears = sleepHours / (24 * DAYS_PER_YEAR);

  return (
    <Tile
      id="5a" span={3} emoji="🧠"
      value={`${fmtYears(sleepYears)} years`}
      unit="of brain filing time"
      headline={`${fmt(sleepHours)} hours of sleep so far`}
      body="Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift."
    />
  );
}
