import type { useStepsMetrics } from "../hooks";
import type { SectionProps } from "./types";
import { Slide, KeyMetric, Headline, Unit } from "../components/page/slide";
import { InlineStepper, InlineSlider } from "../components/page/controls";
import { his, he } from "../lib/utils";
import { styles } from "./styles";

type Props = SectionProps & { steps: ReturnType<typeof useStepsMetrics> };

export function StepsSection({ name, pronouns, steps }: Props) {
  return (
    <Slide id="4a">
      <Headline>{name} has walked ...</Headline>
      <KeyMetric>{(steps.totalSteps / 1e6).toFixed(1)} million steps</KeyMetric>
      <Unit>
        so far in {his(pronouns)} {steps.age} years
      </Unit>
      <p className={`${styles.narrative} pt-8`}>
        That is, assuming {he(pronouns)} walks{" "}
        <InlineSlider value={steps.stepsPerDay} min={2000} max={15000} step={1000} onChange={steps.setStepsPerDay} /> steps a day!
      </p>
    </Slide>
  );
}
