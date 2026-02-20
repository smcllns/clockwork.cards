import type { useSleepMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/slide/photo-slide";
import { Intro, Stat, Subtitle, Lede, Body } from "../components/text";
import { InlineStepper } from "../components/page/controls";
import imgLight from "../assets/photo-sleep.png";
import imgShiny from "../assets/photo-sleep-shiny.png";

type Props = SectionProps & { sleep: ReturnType<typeof useSleepMetrics> };

export function SleepSection({ name, shiny, sleep }: Props) {
  return (
    <PhotoSlide id="5a" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny} objectPosition="center 30%">
      <Intro className="mb-2">{name}'s brain has filed ...</Intro>
      <Stat>{sleep.sleepYears.toFixed(3)}</Stat>
      <Subtitle>years of memories</Subtitle>
      <Lede>{sleep.sleepHours.toLocaleString()} hours of sleep so far.</Lede>
      <Body>
        Every night while {name} sleeps, the brain sorts through everything learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
        <InlineStepper value={sleep.hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={sleep.setHoursPerNight} />{" "}
        per night.
      </Body>
    </PhotoSlide>
  );
}
