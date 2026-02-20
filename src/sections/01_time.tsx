import type { useTimeMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/content/photo-slide";
import { InlineDropdown } from "../components/page/controls";
import { TIME_UNITS } from "../metrics";
import imgLight from "../assets/photo-time.png";
import imgShiny from "../assets/photo-time-shiny.png";

type Props = SectionProps & { time: ReturnType<typeof useTimeMetrics> };

export function TimeSection({ name, shiny, time }: Props) {
  return (
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
  );
}
