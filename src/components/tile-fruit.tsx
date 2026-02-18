import { useState } from "react";
import { Tile } from "./tile";
import { InlineStepper } from "./controls";
import { useNow } from "./useNow";


export default function FruitTile({ dob, name }: { dob: Date; name: string }) {
  const [servingsPerDay, setServingsPerDay] = useState(3);
  const now = useNow();
  const daysAlive = Math.floor((now - dob.getTime()) / 86_400_000);
  const fruitServings = daysAlive * servingsPerDay;

  return (
    <Tile
      id="5c" emoji="🥦"
      value={fruitServings.toLocaleString()}
      unit="cell repair kits"
      headline="Delivered by fruits & veggies"
      body={<>Every time {name} eats fruits and vegetables, those vitamins help protect cells from damage. At{" "}
        <InlineStepper value={servingsPerDay} min={1} max={8} step={1} onChange={setServingsPerDay} />{" "}
        servings a day, {name}'s body has had plenty of supplies to work with.</>}
    />
  );
}
