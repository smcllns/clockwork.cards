import { Tile } from "../components/slide";
import { useNow } from "../components/useNow";
import { AVG_CHILD_BPM } from "../constants";
import { fmt, fmtBig } from "../utils";

export default function HeartbeatsTile({ dob }: { dob: string }) {
  const now = useNow();
  const minutesAlive = (now - new Date(dob).getTime()) / 60_000;
  const totalHeartbeats = minutesAlive * AVG_CHILD_BPM;
  const heartbeatsPerDay = AVG_CHILD_BPM * 60 * 24;

  return (
    <Tile
      id="5b" span={2} emoji="❤️"
      value={fmtBig(totalHeartbeats)}
      unit="heartbeats"
      headline={`${fmt(heartbeatsPerDay)} beats per day`}
      body="Your heart beats about 80 times per minute — and it hasn't taken a single break since the day you were born. Not one."
    />
  );
}
