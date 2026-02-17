import { Tile, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY } from "../constants";
import { fmt } from "../utils";

export default function FruitTile({ dob }: { dob: string; name: string }) {
  const now = useNow();
  const daysAlive = Math.floor((now - new Date(dob).getTime()) / MS_PER_DAY);
  const fruitServings = daysAlive * 3;

  return (
    <Tile id="5c" span={3}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-1">🥦</span>
        <div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
              data-stat
            >{fmt(fruitServings)}</span>
            <span className="text-sm" style={css.secondary}>cell repair kits</span>
          </div>
          <p className="text-sm font-semibold mt-1" style={css.primary}>Delivered by fruits & veggies</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>
        Every time you eat fruits and vegetables, you're getting vitamins that help protect your cells. Your body does the hard work — your job is to keep sending supplies.
      </p>
    </Tile>
  );
}
