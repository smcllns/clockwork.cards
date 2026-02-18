import type { useHeartMetrics, useFruitMetrics, useHugsMetrics, useLungsMetrics } from "../hooks";
import { TileContainer, Tile } from "../../components/tile";
import { InlineStepper } from "../../components/controls";

type Props = {
  name: string;
  heart: ReturnType<typeof useHeartMetrics>;
  fruit: ReturnType<typeof useFruitMetrics>;
  hugs: ReturnType<typeof useHugsMetrics>;
  lungs: ReturnType<typeof useLungsMetrics>;
};

export function TilesHealthSection({ name, heart, fruit, hugs, lungs }: Props) {
  return (
    <TileContainer id="5" title={`${name}'s brain & body`}>
      <Tile id="5b" emoji="❤️"
        value={`${(heart.totalHeartbeats / 1e6).toFixed(1)} million`}
        unit="heartbeats"
        headline={`${heart.heartbeatsPerDay.toLocaleString()} beats per day`}
        body={`${name}'s heart beats about 80 times per minute — and it hasn't taken a single break since the day ${name} was born. Not one.`}
      />
      <Tile id="5c" emoji="🥦"
        value={fruit.fruitServings.toLocaleString()}
        unit="cell repair kits"
        headline="Delivered by fruits & veggies"
        body={<>Every time {name} eats fruits and vegetables, those vitamins help protect cells from damage. At{" "}
          <InlineStepper value={fruit.servingsPerDay} min={1} max={8} step={1} onChange={fruit.setServingsPerDay} />{" "}
          servings a day, {name}'s body has had plenty of supplies to work with.</>}
      />
      <Tile id="5d" emoji="🤗"
        value={hugs.totalHugs.toLocaleString()}
        unit="hugs"
        headline="Moments of connection"
        body={<>When {name} hugs someone for 10 seconds, the body releases oxytocin, which helps feel calm and safe. At{" "}
          <InlineStepper value={hugs.hugsPerDay} min={1} max={10} step={1} onChange={hugs.setHugsPerDay} />{" "}
          hugs a day, that's {hugs.totalHugs.toLocaleString()} moments of "this person matters to me."</>}
      />
      <Tile id="5e" emoji="💪"
        value={`${(lungs.lungExtraLiters / 1e6).toFixed(1)} million`}
        unit="extra liters of air"
        headline={`${name}'s lungs are getting seriously strong`}
        body={<>Every minute spent running or playing hard, the lungs pull in 40–60 liters of air, compared with 5–8 when resting. At{" "}
          <InlineStepper value={lungs.hoursPerDay} min={1} max={4} step={1} unit=" hr" onChange={lungs.setHoursPerDay} />{" "}
          of hard play per day, that's a serious workout.</>}
      />
    </TileContainer>
  );
}
