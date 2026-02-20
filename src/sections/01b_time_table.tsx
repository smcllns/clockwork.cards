import type { useTimeMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { TextSlide } from "../components/page/text-slide";
import { Intro } from "../components/page/text";
import { InlineDropdown } from "../components/page/controls";
import { styles } from "./styles";

const BIRTH_HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => ({
  value: String(h),
  label: h === 0 ? "midnight" : h === 12 ? "noon" : h < 12 ? `${h} AM` : `${h - 12} PM`,
}));

type Props = SectionProps & { time: ReturnType<typeof useTimeMetrics> };

export function TimeTableSection({ name, dob, pronouns, time }: Props) {
  return (
    <TextSlide id="1b">
      <Intro>{name} is precisely ...</Intro>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {(
            [
              ["years", time.values.years.toFixed(3)],
              ["months", Math.floor(time.values.months).toLocaleString()],
              ["weeks", Math.floor(time.values.weeks).toLocaleString()],
              ["days", Math.floor(time.values.days).toLocaleString()],
              ["hours", Math.floor(time.values.hours).toLocaleString()],
              ["minutes", Math.floor(time.values.minutes).toLocaleString()],
              ["seconds", Math.floor(time.values.seconds).toLocaleString()],
            ] as [string, string][]
          ).map(([label, value]) => (
            <tr key={label} style={{ borderBottom: "1px solid var(--border-color)" }}>
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
                {value}
              </td>
              <td className="text-left py-2 pl-2" style={{ color: "var(--text-secondary)", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
                {label} old
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.footnote + " mt-8"}>
        (assuming {pronouns === "m" ? "he" : "she"} was born at{" "}
        <InlineDropdown options={BIRTH_HOUR_OPTIONS} value={String(time.birthHour)} onChange={(v) => time.setBirthHour(Number(v))} /> back
        in {dob.getFullYear()})
      </p>
    </TextSlide>
  );
}
