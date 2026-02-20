import { useNow } from "./metrics";
import {
  useAgeMetrics,
  useTimeMetrics,
  useSpaceMetrics,
  useStepsMetrics,
  useYogurtMetrics,
  useBrushingMetrics,
  useWaterMetrics,
  usePoopsMetrics,
} from "./metrics";
import { HeroSection } from "./sections/00_hero";
import { TimeSection } from "./sections/01_time";
import { TimeTableSection } from "./sections/01b_time_table";
import { SpaceSection } from "./sections/02_space";
import { StepsSection } from "./sections/03_steps";
import { YogurtSection } from "./sections/04_yogurt";
import { BrushingSection } from "./sections/07_brushing";
import { WaterSection } from "./sections/08_water";
import { PoopsSection } from "./sections/10_poops";
import { BinarySection } from "./sections/11_binary";
import { ClosingSection } from "./sections/12_closing";

import type { SectionProps } from "./sections/types";

export function Card({ name, dob, pronouns, shiny }: SectionProps) {
  const now = useNow();
  const age = useAgeMetrics(dob, now);
  const time = useTimeMetrics(dob, now);
  const space = useSpaceMetrics(dob, now);
  const steps = useStepsMetrics(dob, now);
  const yogurt = useYogurtMetrics(dob, now);
  const brushing = useBrushingMetrics(dob, now);
  const water = useWaterMetrics(dob, now);
  const poops = usePoopsMetrics(dob, now);

  return (
    <>
      <HeroSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} />
      <TimeSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} time={time} />
      <TimeTableSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} time={time} />
      <SpaceSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} space={space} />
      <StepsSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} steps={steps} age={age.decimal2} />
      <YogurtSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} yogurt={yogurt} />
      <BrushingSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} brushing={brushing} />
      <WaterSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} water={water} />
      <BinarySection name={name} dob={dob} pronouns={pronouns} shiny={shiny} age={age.rounded} />
      <PoopsSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} poops={poops} age={age.decimal2} />
      <ClosingSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} age={age.rounded} />
    </>
  );
}
