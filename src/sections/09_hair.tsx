import type { useHairMetrics } from "../metrics";
import type { SectionProps } from "./types";
import { TextSlide } from "../components/page/text-slide";
import { InlineStepper } from "../components/page/controls";
import { styles } from "./styles";

type Props = SectionProps & { hair: ReturnType<typeof useHairMetrics> };

export function HairSection({ name, hair }: Props) {
  return (
    <TextSlide id="4c">
      <p className={styles.body}>
        {name}'s hair grows about{" "}
        <InlineStepper value={hair.cmPerMonth} min={0.6} max={2.0} step={0.1} unit=" cm" onChange={hair.setCmPerMonth} />{" "}
        per month. If {name} had never had a haircut, it would now be <span className={styles.stat}>{hair.totalM.toFixed(1)} meters</span> long!
      </p>
    </TextSlide>
  );
}
