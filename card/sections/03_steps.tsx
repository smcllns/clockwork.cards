import type { useStepsMetrics } from "../hooks";
import { Slide, KeyMetric, Headline, Unit } from "../../src/components/slide";
import { InlineStepper, InlineSlider } from "../../src/components/controls";
import { his, he } from "../../src/utils";
import { styles } from "./styles";

type Props = { name: string; pronouns: "m" | "f"; steps: ReturnType<typeof useStepsMetrics> };

export function StepsSection({ name, pronouns, steps }: Props) {
  return (
    <Slide id="4a">
      <Headline>{name} has walked ...</Headline>
      <KeyMetric>{(steps.totalSteps / 1e6).toFixed(1)} million steps</KeyMetric>
      <Unit>so far in {his(pronouns)} {steps.age} years</Unit>
      <p className={`${styles.narrative} pt-8`}>
        That is, assuming {he(pronouns)} walks{" "}
        <InlineSlider value={steps.stepsPerDay} min={2000} max={15000} step={1000} onChange={steps.setStepsPerDay} />{" "}
        steps a day since {he(pronouns)} was{" "}
        <InlineStepper value={steps.startAge} min={1} max={5} step={1} onChange={steps.setStartAge} /> years old.
      </p>
    </Slide>
  );
}
