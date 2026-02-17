import { Tile } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY } from "../constants";
import { fmt } from "../utils";

export default function HugsTile({ dob }: { dob: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const totalHugs = daysAlive * 2;

  return (
    <Tile
      id="5d" span={2} emoji="🤗"
      value={fmt(totalHugs)}
      unit="hugs"
      headline="Moments of connection"
      body={`If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${fmt(totalHugs)} moments where your body is quietly saying: "This person matters to me."`}
    />
  );
}
