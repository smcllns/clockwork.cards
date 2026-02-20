import type { useStepsMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { TextSlide } from "../components/page/text-slide";
import { Stat, Intro, Subtitle } from "../components/page/text";
import { InlineStepper, InlineSlider } from "../components/page/controls";
import { his, he } from "../metrics";
import { styles } from "./styles";

type Props = SectionProps & { steps: ReturnType<typeof useStepsMetrics>; age: number };

export function StepsSection({ name, dob, pronouns, steps, age }: Props) {
  return (
    <TextSlide id="4a">
      <Intro>{name} has walked ...</Intro>
      <Stat>{(steps.totalSteps / 1e6).toFixed(1)} million steps</Stat>
      <Subtitle>so far</Subtitle>
      <p className={`${styles.body} pt-8`}>
        That is, assuming {he(pronouns)} walks{" "}
        <InlineSlider value={steps.stepsPerDay} min={2000} max={15000} step={1000} onChange={steps.setStepsPerDay} /> steps a day!
      </p>
    </TextSlide>
  );
}
