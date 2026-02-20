import type { useSpaceMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/slide/photo-slide";
import { Intro, Stat, Subtitle, Lede, Body } from "../components/text";
import { InlinePills } from "../components/page/controls";
import imgLight from "../assets/photo-space.png";
import imgShiny from "../assets/photo-space-shiny.png";

type Props = SectionProps & { space: ReturnType<typeof useSpaceMetrics> };

export function SpaceSection({ name, pronouns, shiny, space }: Props) {
  return (
    <PhotoSlide id="2" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny}>
      <Intro className="mb-2">
        In {Math.round(space.lapsAroundSun)} laps around the sun, {name} has flown ...
      </Intro>
      <Stat>
        {((space.milesInSpace * space.k) / 1e9).toFixed(1)} billion {space.unit}
      </Stat>
      <Subtitle className="mb-8">
        <InlinePills
          options={[
            { value: "miles", label: "miles" },
            { value: "km", label: "kilometers" },
          ]}
          value={space.unit}
          onChange={space.setUnit}
        />{" "}
        through space
      </Subtitle>
      <Lede>
        {pronouns === "m" ? "He" : "She"}'s not just a kid, {pronouns === "m" ? "he" : "she"}'s an interstellar traveler!
      </Lede>
      <Body>
        But lets be real, light would still whoop {pronouns === "m" ? "him" : "her"} in a race &mdash; at{" "}
        {space.lightSpeed.toLocaleString()} {space.unitLabel} a beam of light would do that in {space.lightSpeedHours.toFixed(1)} hours, not{" "}
        {Math.round(space.lapsAroundSun)} years!
      </Body>
    </PhotoSlide>
  );
}
