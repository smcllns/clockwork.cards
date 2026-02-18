import type { usePoopsMetrics } from "../hooks";
import { PhotoSlide } from "../components/content/photo-slide";
import { InlineStepper } from "../components/page/controls";
import imgLight from "../assets/photo-poops.png";
import imgShiny from "../assets/photo-poops-shiny.png";

type Props = { shiny: boolean; poops: ReturnType<typeof usePoopsMetrics> };

export function PoopsSection({ shiny, poops }: Props) {
  return (
    <PhotoSlide id="4e" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny}
      objectPosition="center 30%"
      value={poops.totalPoops.toLocaleString()}
      headline="poops so far"
      body={<>Everyone poops. At{" "}
        <InlineStepper value={poops.perDay} min={0.5} max={4} step={0.5} decimals={1} onChange={poops.setPerDay} />{" "}
        poops a day, by the time you're {poops.age} years old, you'll have done around {poops.totalPoops.toLocaleString()} poops. Maybe even a cyberpunk poop.</>}
    />
  );
}
