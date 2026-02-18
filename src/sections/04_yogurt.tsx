import type { useYogurtMetrics } from "../hooks";
import { PhotoSlide } from "../components/photo-slide";
import { InlinePills, InlineSlider, InlineStepper } from "../page/controls";
import imgLight from "../assets/photo-yogurt.png";
import imgShiny from "../assets/photo-yogurt-shiny.png";

type Props = { name: string; shiny: boolean; yogurt: ReturnType<typeof useYogurtMetrics> };

export function YogurtSection({ name, shiny, yogurt }: Props) {
  return (
    <PhotoSlide id="3" imgLight={imgLight} imgShiny={imgShiny} shiny={shiny}
      objectPosition="center 30%"
      intro={`${name} has eaten ...`}
      value={yogurt.display.toLocaleString()}
      unit={<><InlinePills
        options={[{ value: "kg" as const, label: "kilograms" }, { value: "lbs" as const, label: "pounds" }]}
        value={yogurt.unit} onChange={yogurt.setUnit}
      /> of yogurt</>}
      headline={yogurt.hippoHeadline}
      body={<>Assuming {name} eats <InlineSlider value={yogurt.gramsPerDay} min={10} max={150} step={10} onChange={yogurt.setGramsPerDay} /> grams of yogurt every day, since age <InlineStepper value={yogurt.startAge} min={1} max={7} step={1} onChange={yogurt.setStartAge} /></>}
    />
  );
}
