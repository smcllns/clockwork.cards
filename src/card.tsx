import { useNow } from "./metrics";
import {
  useAgeMetrics,
  useTimeMetrics,
  useSpaceMetrics,
  useStepsMetrics,
  useYogurtMetrics,
  useHeartMetrics,
  useFruitMetrics,
  useHugsMetrics,
  useLungsMetrics,
  useSleepMetrics,
  useBrushingMetrics,
  useWaterMetrics,
  usePoopsMetrics,
  useHairMetrics,
} from "./metrics";
import { HeroSection } from "./sections/00_hero";
import { TimeSection } from "./sections/01_time";
import { TimeTableSection } from "./sections/01b_time_table";
import { SpaceSection } from "./sections/02_space";
import { StepsSection } from "./sections/03_steps";
import { YogurtSection } from "./sections/04_yogurt";
import { TilesHealthSection } from "./sections/05_tiles_health";
import { SleepSection } from "./sections/06_sleep";
import { BrushingSection } from "./sections/07_brushing";
import { WaterSection } from "./sections/08_water";
import { HairSection } from "./sections/09_hair";
import { PoopsSection } from "./sections/10_poops";
import { BinarySection } from "./sections/11_binary";
import { ClosingSection } from "./sections/12_closing";

type CardProps = {
  name: string;
  dob: Date;
  pronouns: "m" | "f";
  shiny: boolean;
};

export function Card({ name, dob, pronouns, shiny }: CardProps) {
  const now = useNow();
  const age = useAgeMetrics(dob, now);
  const time = useTimeMetrics(dob, now);
  const space = useSpaceMetrics(dob, now);
  const steps = useStepsMetrics(dob, now);
  const yogurt = useYogurtMetrics(dob, now);
  const heart = useHeartMetrics(dob, now);
  const fruit = useFruitMetrics(dob, now);
  const hugs = useHugsMetrics(dob, now);
  const lungs = useLungsMetrics(dob, now);
  const sleep = useSleepMetrics(dob, now);
  const brushing = useBrushingMetrics(dob, now);
  const water = useWaterMetrics(dob, now);
  const poops = usePoopsMetrics(dob, now);
  const hair = useHairMetrics(dob, now);

  return (
    <>
      <HeroSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} />
      <TimeSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} time={time} />
      <TimeTableSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} time={time} />
      <SpaceSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} space={space} />
      <StepsSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} steps={steps} age={age.decimal2} />
      <YogurtSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} yogurt={yogurt} />
      <TilesHealthSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} heart={heart} fruit={fruit} hugs={hugs} lungs={lungs} />
      <SleepSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} sleep={sleep} />
      <BrushingSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} brushing={brushing} />
      <WaterSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} water={water} />
      <HairSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} hair={hair} />
      <PoopsSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} poops={poops} age={age.decimal2} />
      <BinarySection name={name} dob={dob} pronouns={pronouns} shiny={shiny} age={age.floor} />
      <ClosingSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} age={age.rounded} />
    </>
  );
}
