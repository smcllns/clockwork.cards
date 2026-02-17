import { Tile, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY } from "../constants";
import { fmt } from "../utils";

export default function HugsTile({ dob }: { dob: string; name: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const totalHugs = daysAlive * 2;

  return (
    <Tile id="5d" span={2}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-1">🤗</span>
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
              data-stat
            >{fmt(totalHugs)}</span>
            <span className="text-sm" style={css.secondary}>hugs</span>
          </div>
          <p className="text-sm font-semibold mt-1" style={css.primary}>Moments of connection</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>
        If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's {fmt(totalHugs)} moments where your body is quietly saying: "This person matters to me."
      </p>
    </Tile>
  );
}
