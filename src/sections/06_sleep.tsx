import type { useSleepMetrics } from "../hooks";
import { PhotoSlide } from "../components/photo-slide";
import { InlineStepper } from "../components/page/controls";
import imgLight from "../assets/photo-sleep.png";
import imgShiny from "../assets/photo-sleep-shiny.png";

type Props = { name: string; shiny: boolean; sleep: ReturnType<typeof useSleepMetrics> };

export function SleepSection({ name, shiny, sleep }: Props) {
  return (
    <PhotoSlide id="5a" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny}
      objectPosition="center 30%"
      intro={`${name}'s brain has filed ...`}
      value={sleep.sleepYears.toFixed(3)}
      unit="years of memories"
      headline={`${sleep.sleepHours.toLocaleString()} hours of sleep so far.`}
      body={<>Every night while {name} sleeps, the brain sorts through everything learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
        <InlineStepper value={sleep.hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={sleep.setHoursPerNight} />{" "}
        per night.</>}
    />
  );
}
