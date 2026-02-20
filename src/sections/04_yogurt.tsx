import type { useYogurtMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { PhotoSlide } from "../components/slide/photo-slide";
import { Intro, Stat, Subtitle, Lede, Body } from "../components/text";
import { InlinePills, InlineSlider, InlineStepper } from "../components/page/controls";
import imgLight from "../assets/photo-yogurt.png";
import imgShiny from "../assets/photo-yogurt-shiny.png";

type Props = SectionProps & { yogurt: ReturnType<typeof useYogurtMetrics> };

export function YogurtSection({ name, shiny, yogurt }: Props) {
  return (
    <PhotoSlide id="3" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny} objectPosition="center 30%">
      <Intro className="mb-2">{name} has eaten ...</Intro>
      <Stat>
        {yogurt.display.toLocaleString()} {yogurt.unit} of yogurt
      </Stat>
      <Subtitle className="mb-8">
        <InlinePills
          options={[
            { value: "kg" as const, label: "kilograms" },
            { value: "lbs" as const, label: "pounds" },
          ]}
          value={yogurt.unit}
          onChange={yogurt.setUnit}
        />
      </Subtitle>
      <Lede>{yogurt.hippoHeadline}</Lede>
      <Body>
        Assuming {name} eats{" "}
        <InlineSlider
          value={yogurt.gramsPerDay}
          min={10}
          max={340}
          step={10}
          onChange={yogurt.setGramsPerDay}
          displayValue={yogurt.unit === "lbs" ? `${Math.round(yogurt.gramsPerDay / 28.35)}oz` : `${yogurt.gramsPerDay}g`}
        />{" "}
        of yogurt every night before bed!
      </Body>
    </PhotoSlide>
  );
}
