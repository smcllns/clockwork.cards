import { Tile } from "../page/tile";
import { useNow } from "../../metrics";
import { AVG_CHILD_BPM } from "../../constants";

export default function HeartbeatsTile({ dob, name }: { dob: Date; name: string }) {
  const now = useNow();
  const minutesAlive = (now - dob.getTime()) / 60_000;
  const totalHeartbeats = minutesAlive * AVG_CHILD_BPM;
  const heartbeatsPerDay = AVG_CHILD_BPM * 60 * 24;

  return (
    <Tile
      id="5b" emoji="❤️"
      value={`${(totalHeartbeats / 1e6).toFixed(1)} million`}
      unit="heartbeats"
      headline={`${heartbeatsPerDay.toLocaleString()} beats per day`}
      body={`${name}'s heart beats about 80 times per minute — and it hasn't taken a single break since the day ${name} was born. Not one.`}
    />
  );
}
