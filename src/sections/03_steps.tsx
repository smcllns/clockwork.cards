import type { useStepsMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { Slide, Stat, Intro, Subtitle } from "../components/page/slide";
import { InlineStepper, InlineSlider } from "../components/page/controls";
import { his, he } from "../metrics";
import { styles } from "./styles";

type Props = SectionProps & { steps: ReturnType<typeof useStepsMetrics>; age: number };

export function StepsSection({ name, dob, pronouns, steps, age }: Props) {
  return (
    <Slide id="4a">
      <Intro>{name} has walked ...</Intro>
      <Stat>{(steps.totalSteps / 1e6).toFixed(1)} million steps</Stat>
      <Subtitle>so far in {his(pronouns)} {age} years</Subtitle>
      <p className={`${styles.body} pt-8`}>
        That is, assuming {he(pronouns)} walks{" "}
        <InlineSlider value={steps.stepsPerDay} min={2000} max={15000} step={1000} onChange={steps.setStepsPerDay} /> steps a day!
      </p>
    </Slide>
  );
}
