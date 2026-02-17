import { Tile, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { AVG_CHILD_BPM } from "../constants";
import { fmt, fmtBig } from "../utils";

export default function HeartbeatsTile({ dob }: { dob: string; name: string }) {
  const now = useNow();
  const minutesAlive = (now - new Date(dob).getTime()) / 60_000;
  const totalHeartbeats = minutesAlive * AVG_CHILD_BPM;
  const heartbeatsPerDay = AVG_CHILD_BPM * 60 * 24;

  return (
    <Tile id="5b" span={2}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-1">❤️</span>
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
              data-stat
            >{fmtBig(totalHeartbeats)}</span>
            <span className="text-sm" style={css.secondary}>heartbeats</span>
          </div>
          <p className="text-sm font-semibold mt-1" style={css.primary}>{fmt(heartbeatsPerDay)} beats per day</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>
        Your heart beats about 80 times per minute — and it hasn't taken a single break since the day you were born. Not one.
      </p>
    </Tile>
  );
}
