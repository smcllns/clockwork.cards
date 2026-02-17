import { Slide, Headline } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_SEC, MS_PER_MIN, MS_PER_HOUR, MS_PER_DAY, DAYS_PER_YEAR } from "../constants";
import { getAge } from "../utils";

export default function TimeTableCard({ dob, name }: { dob: string; name: string }) {
  const now = useNow();

  const msAlive = now - new Date(dob).getTime();
  const daysAlive = msAlive / MS_PER_DAY;

  const t = {
    yearsAlive: getAge(new Date(dob), now),
    monthsAlive: Math.floor(daysAlive / (DAYS_PER_YEAR / 12)),
    weeksAlive: Math.floor(daysAlive / 7),
    daysAlive: Math.floor(daysAlive),
    hoursAlive: Math.floor(msAlive / MS_PER_HOUR),
    minutesAlive: Math.floor(msAlive / MS_PER_MIN),
    secondsAlive: Math.floor(msAlive / MS_PER_SEC),
  };

  const fmt = (n: number) => Math.floor(n).toLocaleString();
  const rows = [
    { key: "yearsAlive" as const, label: "years", format: (n: number) => n.toFixed(3) },
    { key: "monthsAlive" as const, label: "months", format: fmt },
    { key: "weeksAlive" as const, label: "weeks", format: fmt },
    { key: "daysAlive" as const, label: "days", format: fmt },
    { key: "hoursAlive" as const, label: "hours", format: fmt },
    { key: "minutesAlive" as const, label: "minutes", format: fmt },
    { key: "secondsAlive" as const, label: "seconds", format: fmt },
  ];

  return (
    <Slide id="1b">
      <Headline>{name} is, precisely ...</Headline>
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
