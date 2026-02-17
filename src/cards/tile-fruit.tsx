import { Tile } from "../components/tiles";
import { useNow } from "../components/useNow";
import { MS_PER_DAY } from "../constants";

export default function FruitTile({ dob }: { dob: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const fruitServings = daysAlive * 3;

  return (
    <Tile
      id="5c" span={3} emoji="🥦"
      value={fruitServings.toLocaleString()}
      unit="cell repair kits"
      headline="Delivered by fruits & veggies"
      body="Every time you eat fruits and vegetables, you're getting vitamins that help protect your cells. Your body does the hard work — your job is to keep sending supplies."
    />
  );
}
