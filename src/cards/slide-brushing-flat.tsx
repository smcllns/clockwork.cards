import { useState } from "react";
import { Slide } from "../components/slide";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";
import { daysSinceAge } from "../utils";
import { MS_PER_DAY, AVG_BLINKS_PER_DAY } from "../constants";

export default function BrushingCardFlat({ dob, name }: { dob: Date; name: string }) {
  const [minutes, setMinutes] = useState(2);
  const [strokesPerMin, setStrokesPerMin] = useState(170);
  const [blinksPerDay, setBlinksPerDay] = useState(AVG_BLINKS_PER_DAY);
  const now = useNow();
  const minutesTotal = daysSinceAge(dob, 3, now) * minutes * 2;
  const brushStrokes = minutesTotal * strokesPerMin;
  const daysAlive = Math.floor((now - dob.getTime()) / MS_PER_DAY);
  const totalBlinks = daysAlive * blinksPerDay;

  const styles = {
    narrative: "text-xl sm:text-2xl leading-relaxed mb-12 font-medium text-(--text-primary)",
    narrativeSm: "text-2xl sm:text-3xl font-medium mb-12 text-(--text-primary)",
    body: "text-lg leading-loose mb-8 text-(--text-secondary)",
    stat: "font-bold font-(--font-stat) text-(--text-primary)",
  };

  return (
    <Slide id="4b-flat">
      <p className={styles.narrative}>
        If {name} spends <InlineStepper value={minutes} min={0} max={10} step={0.5} unit=" min" onChange={setMinutes} /> brushing teeth each
        morning and night &mdash; so <span className={styles.stat}>{minutes * 2} minutes</span> each day &mdash; that's over{" "}
        <span className={styles.stat}>{(brushStrokes / 1e6).toFixed(1)} million brush strokes*</span>
        so far!
      </p>
      <p className={styles.body}>
        Think that's a lot? {name}'s eyes have blinked about {(totalBlinks / 1e6).toFixed(1)} million times. Getting the reps in!
      </p>
      <p className={styles.body}>
        * assuming: <InlineStepper value={strokesPerMin} min={100} max={300} step={10} onChange={setStrokesPerMin} /> brush strokes per
        minute
      </p>
    </Slide>
  );
}
