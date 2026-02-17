import { useState } from "react";
import { Tile } from "../components/tile";
import { InlineStepper } from "../components/controls";
import { useNow } from "../components/useNow";


export default function FruitTile({ dob }: { dob: string }) {
  const [servingsPerDay, setServingsPerDay] = useState(3);
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const fruitServings = daysAlive * servingsPerDay;

  return (
    <Tile
      id="5c" span={3} emoji="🥦"
      value={fruitServings.toLocaleString()}
      unit="cell repair kits"
      headline="Delivered by fruits & veggies"
      body={<>Every time you eat fruits and vegetables, you're getting vitamins that help protect your cells. At{" "}
        <InlineStepper value={servingsPerDay} min={1} max={8} step={1} onChange={setServingsPerDay} />{" "}
        servings a day, your body has had plenty of supplies to work with.</>}
    />
  );
}
