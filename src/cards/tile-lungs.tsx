import { Tile, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, HARD_PLAY_LITERS_PER_MIN } from "../constants";
import { fmtBig } from "../utils";

export default function LungsTile({ dob }: { dob: string; name: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const lungExtraLiters = daysAlive * 1 * 60 * HARD_PLAY_LITERS_PER_MIN;

  return (
    <Tile id="5e" span={3}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-1">💪</span>
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
              data-stat
            >{fmtBig(lungExtraLiters)}</span>
            <span className="text-sm" style={css.secondary}>extra liters of air</span>
          </div>
          <p className="text-sm font-semibold mt-1" style={css.primary}>Your lungs are getting seriously strong</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>
        Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs.
      </p>
    </Tile>
  );
}
