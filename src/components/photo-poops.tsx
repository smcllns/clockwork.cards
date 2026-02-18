import { useState } from "react";
import { InlineStepper } from "./controls";
import { useNow } from "./useNow";
import { getAge } from "../lib/utils";
import { PhotoSlide } from "./photo-slide";
import imgLight from "../assets/photo-poops.png";
import imgShiny from "../assets/photo-poops-shiny.png";

export default function PoopsPhoto({ dob, shiny }: { dob: Date; shiny: boolean }) {
  const [perDay, setPerDay] = useState(1.5);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const totalPoops = Math.floor(daysAlive * perDay);
  const age = getAge(dob, now, 2);

  return (
    <PhotoSlide
      id="4e"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      objectPosition="center 30%"
      value={totalPoops.toLocaleString()}
      headline="poops so far"
      body={<>
        Everyone poops. At{" "}
        <InlineStepper value={perDay} min={0.5} max={4} step={0.5} decimals={1} onChange={setPerDay} />{" "}
        poops a day, by the time you're {age} years old, you'll have done around {totalPoops.toLocaleString()} poops. Maybe even a cyberpunk poop.
      </>}
    />
  );
}
