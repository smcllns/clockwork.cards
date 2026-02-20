import type { useTimeMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/page/photo-slide";
import { Intro, Stat, Subtitle } from "../components/page/text";
import { InlineDropdown } from "../components/page/controls";
import { TIME_UNITS } from "../metrics";
import imgLight from "../assets/photo-time.png";
import imgShiny from "../assets/photo-time-shiny.png";

type Props = SectionProps & { time: ReturnType<typeof useTimeMetrics> };

export function TimeSection({ name, shiny, time }: Props) {
  return (
    <PhotoSlide id="1" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny}>
      <Intro className="mb-2">{name} is ...</Intro>
      <Stat>{time.formattedValue}</Stat>
      <Subtitle className="mb-8">
        <InlineDropdown options={TIME_UNITS} value={time.timeUnit} onChange={time.setTimeUnit} /> old, right now
      </Subtitle>
    </PhotoSlide>
  );
}
