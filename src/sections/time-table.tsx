import { Slide, Title, Headline, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { fmt, fmtYears } from "../stats";

const MS_PER_SEC = 1000;
const MS_PER_MIN = MS_PER_SEC * 60;
const MS_PER_HOUR = MS_PER_MIN * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
const DAYS_PER_YEAR = 365.25;

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

const rows = [
  { key: "yearsAlive", label: "years", format: fmtYears },
  { key: "monthsAlive", label: "months", format: fmt },
  { key: "weeksAlive", label: "weeks", format: fmt },
  { key: "daysAlive", label: "days", format: fmt },
  { key: "hoursAlive", label: "hours", format: fmt },
  { key: "minutesAlive", label: "minutes", format: fmt },
  { key: "secondsAlive", label: "seconds", format: fmt },
] as const;

export default function TimeTableCard({ dob, name }: { dob: string; name: string }) {
  const now = useNow();

  const t = computeTime(dob, now);

  return (
    <Slide id="1">
      <Headline>Precisely, {name} is...</Headline>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map(({ key, label, format }) => (
            <tr key={key} style={{ borderBottom: "1px solid var(--border-color)" }}>
              <td
                className="text-right font-bold py-2 pr-4"
                style={{
                  fontFamily: "var(--font-stat)",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--text-primary)",
                  fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                  whiteSpace: "nowrap",
                }}
                data-stat
              >
                {format(t[key])}
              </td>
              <td
                className="text-left py-2 pl-2"
                style={{ color: "var(--text-secondary)", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}
              >
                {label} old
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Slide>
  );
}
