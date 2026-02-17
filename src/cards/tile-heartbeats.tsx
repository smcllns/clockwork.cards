import { Tile } from '../components/tile';
import { useNow } from '../components/useNow';
import { CHILD_BPM } from '../constants';

interface TileHeartbeatsProps {
  dob: Date;
  span?: number;
}

// Heartbeat count (80 BPM, medical fact, not adjustable)
export function TileHeartbeats({ dob, span = 1 }: TileHeartbeatsProps) {
  const now = useNow();

  // Minutes alive
  const ageMs = now - dob.getTime();
  const minutesAlive = ageMs / (1000 * 60);

  // Total heartbeats
  const totalBeats = minutesAlive * CHILD_BPM;
  const beatsInMillions = totalBeats / 1_000_000;

  return (
    <Tile
      emoji="❤️"
      value={beatsInMillions.toFixed(1)}
      unit="million"
      headline="heartbeats"
      body="At 80 BPM (medical average)"
      span={span}
    />
  );
}
