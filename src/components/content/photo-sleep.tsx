import { useState } from "react";
import { InlineStepper } from "../page/controls";
import { useNow } from "../../metrics";
import { PhotoSlide } from "./photo-slide";
import imgLight from "../../assets/photo-sleep.png";
import imgShiny from "../../assets/photo-sleep-shiny.png";

export default function SleepPhoto({ dob, name, shiny }: { dob: Date; name: string; shiny: boolean }) {
  const [hoursPerNight, setHoursPerNight] = useState(10);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const sleepHours = daysAlive * hoursPerNight;
  const sleepYears = sleepHours / (24 * 365.25);

  return (
    <PhotoSlide
      id="5a"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      objectPosition="center 30%"
      intro={`${name}'s brain has filed ...`}
      value={sleepYears.toFixed(3)}
      unit="years of memories"
      headline={`${sleepHours.toLocaleString()} hours of sleep so far.`}
      body={<>
        Every night while {name} sleeps, the brain sorts through everything learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
        <InlineStepper value={hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={setHoursPerNight} />{" "}
        per night.
      </>}
    />
  );
}
