import type { useSpaceMetrics } from "../hooks";
import { PhotoSlide } from "../components/content/photo-slide";
import { InlinePills } from "../components/page/controls";
import imgLight from "../assets/photo-space.png";
import imgShiny from "../assets/photo-space-shiny.png";

type Props = { name: string; shiny: boolean; space: ReturnType<typeof useSpaceMetrics> };

export function SpaceSection({ name, shiny, space }: Props) {
  return (
    <PhotoSlide id="2" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny}
      intro={`${name} has flown ...`}
      value={`${(space.milesInSpace * space.k / 1e9).toFixed(1)} billion`}
      unit={<><InlinePills
        options={[{ value: "miles" as const, label: "miles" }, { value: "km" as const, label: "kilometers" }]}
        value={space.unit} onChange={space.setUnit}
      /> through space</>}
      headline={`${name}'s not just a kid, ${name}'s an interstellar traveler!`}
      body={<>Earth flies through our solar system at {space.orbitalSpeed.toLocaleString()} {space.unitLabel} — and {name} has been going that speed for {space.lapsAroundSun.toFixed(3)} years. But light would still win: at {space.lightSpeed.toLocaleString()} {space.unitLabel}, it'd cover that distance in just {space.lightSpeedHours.toFixed(1)} hours.</>}
    />
  );
}
