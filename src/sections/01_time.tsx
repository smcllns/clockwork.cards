import type { useTimeMetrics } from "../hooks";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/content/photo-slide";
import { Slide, Headline } from "../components/page/slide";
import { InlineDropdown } from "../components/page/controls";
import { TIME_UNITS } from "../hooks";
import imgLight from "../assets/photo-time.png";
import imgShiny from "../assets/photo-time-shiny.png";
import { styles } from "./styles";

const BIRTH_HOUR_OPTIONS = Array.from({ length: 24 }, (_, h) => ({
  value: String(h),
  label: h === 0 ? "midnight" : h === 12 ? "noon" : h < 12 ? `${h} AM` : `${h - 12} PM`,
}));

type Props = SectionProps & { time: ReturnType<typeof useTimeMetrics> };

export function TimeSection({ name, dob, pronouns, shiny, time }: Props) {
  return (
    <>
      <PhotoSlide
        id="1"
        imgLight={imgLight}
        imgShiny={imgShiny}
        shiny={shiny}
        intro={`${name} is ...`}
        value={time.formattedValue}
        unit={
          <>
            <InlineDropdown options={TIME_UNITS} value={time.timeUnit} onChange={time.setTimeUnit} /> old, right now
          </>
        }
      />

      <Slide id="1b">
        <Headline>{name} is precisely ...</Headline>
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
        <p className={styles.body + " mt-8"}>
          (assuming {pronouns === "m" ? "he" : "she"} was born at{" "}
          <InlineDropdown options={BIRTH_HOUR_OPTIONS} value={String(time.birthHour)} onChange={(v) => time.setBirthHour(Number(v))} /> back
          in {dob.getFullYear()})
        </p>
      </Slide>
    </>
  );
}
