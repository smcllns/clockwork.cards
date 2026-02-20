import type { useSpaceMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/content/photo-slide";
import { InlinePills } from "../components/page/controls";
import imgLight from "../assets/photo-space.png";
import imgShiny from "../assets/photo-space-shiny.png";

type Props = SectionProps & { space: ReturnType<typeof useSpaceMetrics> };

export function SpaceSection({ name, pronouns, shiny, space }: Props) {
  return (
    <PhotoSlide
      id="2"
      imgLight={imgLight}
      imgShiny={imgShiny}
      shiny={shiny}
      intro={`In ${Math.round(space.lapsAroundSun)} laps around the sun, ${name} has flown ...`}
      value={`${((space.milesInSpace * space.k) / 1e9).toFixed(1)} billion ${space.unit}`}
      unit={
        <>
          <InlinePills
            options={[
              { value: "miles" as const, label: "miles" },
              { value: "km" as const, label: "kilometers" },
            ]}
            value={space.unit}
            onChange={space.setUnit}
          />{" "}
          through space
        </>
      }
      headline={`${pronouns === "m" ? "He" : "She"}'s not just a kid, ${pronouns === "m" ? "he" : "she"}'s an interstellar traveler!`}
      body={
        <>
          But lets be real, light would still whoop {pronouns === "m" ? "him" : "her"} in a race &mdash;at{" "}
          {space.lightSpeed.toLocaleString()} {space.unitLabel} a beam of light would do that in {space.lightSpeedHours.toFixed(1)} hours,
          not {Math.round(space.lapsAroundSun)} years!
        </>
      }
    />
  );
}
