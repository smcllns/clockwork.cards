import { Tile } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, HARD_PLAY_LITERS_PER_MIN } from "../constants";
import { fmtBig } from "../utils";

export default function LungsTile({ dob }: { dob: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const lungExtraLiters = daysAlive * 1 * 60 * HARD_PLAY_LITERS_PER_MIN;

  return (
    <Tile
      id="5e" span={3} emoji="💪"
      value={fmtBig(lungExtraLiters)}
      unit="extra liters of air"
      headline="Your lungs are getting seriously strong"
      body="Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs."
    />
  );
}
