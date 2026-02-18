import type { useBrushingMetrics } from "../hooks";
import { Slide } from "../../components/slide";
import { InlineStepper } from "../../components/controls";
import { styles } from "./styles";

type Props = { name: string; brushing: ReturnType<typeof useBrushingMetrics> };

export function BrushingSection({ name, brushing }: Props) {
  return (
    <Slide id="4b">
      <p className={styles.narrative}>
        If {name} spends <InlineStepper value={brushing.minutes} min={0} max={10} step={0.5} unit=" min" onChange={brushing.setMinutes} /> brushing
        teeth each morning and night — so <span className={styles.stat}>{brushing.minutes * 2} minutes</span> each day — that's over{" "}
        <span className={styles.stat}>{(brushing.brushStrokes / 1e6).toFixed(1)} million brush strokes*</span> so far!
      </p>
      <p className={styles.body}>
        Think that's a lot? {name}'s eyes have blinked about {(brushing.totalBlinks / 1e6).toFixed(1)} million times. Getting the reps in!
      </p>
      <p className={styles.body}>
        * assuming: <InlineStepper value={brushing.strokesPerMin} min={100} max={300} step={10} onChange={brushing.setStrokesPerMin} /> brush strokes per minute
      </p>
    </Slide>
  );
}
