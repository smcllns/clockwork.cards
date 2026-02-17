import { Tile } from "../components/tiles";
import { useNow } from "../components/useNow";


export default function HugsTile({ dob }: { dob: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const totalHugs = daysAlive * 2;

  return (
    <Tile
      id="5d" span={2} emoji="🤗"
      value={totalHugs.toLocaleString()}
      unit="hugs"
      headline="Moments of connection"
      body={`If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${totalHugs.toLocaleString()} moments where your body is quietly saying: "This person matters to me."`}
    />
  );
}
