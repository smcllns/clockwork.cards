import { Tile } from "../components/tiles";
import { useNow } from "../components/useNow";
import { HARD_PLAY_LITERS_PER_MIN } from "../constants";

export default function LungsTile({ dob }: { dob: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / 86_400_000);
  const lungExtraLiters = daysAlive * 1 * 60 * HARD_PLAY_LITERS_PER_MIN;

  return (
    <Tile
      id="5e" span={3} emoji="💪"
      value={`${(lungExtraLiters / 1e6).toFixed(1)} million`}
      unit="extra liters of air"
      headline="Your lungs are getting seriously strong"
      body="Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs."
    />
  );
}
