import { IdTag, css } from "../components/slide";
import { useNow } from "../components/useNow";
import { MS_PER_DAY, DAYS_PER_YEAR, AVG_CHILD_BPM, HARD_PLAY_LITERS_PER_MIN, OLYMPIC_POOL_LITERS, GLASS_ML } from "../constants";
import { fmt, fmtBig, fmtDecimal, fmtYears } from "../utils";

const SLEEP_HOURS_PER_NIGHT = 10;
const FRUIT_SERVINGS_PER_DAY = 3;
const HUGS_PER_DAY = 2;
const PLAY_HOURS_PER_DAY = 1;
const WATER_GLASSES_PER_DAY = 6;

export default function BrainBodyCard({ dob }: { dob: string; name: string }) {
  const now = useNow();
  const dobDate = new Date(dob);
  const msAlive = now - dobDate.getTime();
  const daysAlive = Math.floor(msAlive / MS_PER_DAY);
  const minutesAlive = msAlive / 60_000;

  const sleepHours = daysAlive * SLEEP_HOURS_PER_NIGHT;
  const sleepYears = sleepHours / (24 * DAYS_PER_YEAR);
  const totalHeartbeats = minutesAlive * AVG_CHILD_BPM;
  const heartbeatsPerDay = AVG_CHILD_BPM * 60 * 24;
  const fruitServings = daysAlive * FRUIT_SERVINGS_PER_DAY;
  const totalHugs = daysAlive * HUGS_PER_DAY;
  const lungExtraLiters = daysAlive * PLAY_HOURS_PER_DAY * 60 * HARD_PLAY_LITERS_PER_MIN;
  const waterLitersPerDay = (WATER_GLASSES_PER_DAY * GLASS_ML) / 1000;
  const waterLiters = daysAlive * waterLitersPerDay;
  const waterPoolPercent = (waterLiters / OLYMPIC_POOL_LITERS) * 100;
  const litersRemaining = OLYMPIC_POOL_LITERS - waterLiters;
  const poolYearsRemaining = litersRemaining / waterLitersPerDay / DAYS_PER_YEAR;

  const tiles = [
    {
      id: "5a", emoji: "🧠",
      value: `${fmtYears(sleepYears)} years`, unit: "of brain filing time",
      headline: `${fmt(sleepHours)} hours of sleep so far`,
      body: "Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift.",
    },
    {
      id: "5b", emoji: "❤️",
      value: fmtBig(totalHeartbeats), unit: "heartbeats",
      headline: `${fmt(heartbeatsPerDay)} beats per day`,
      body: "Your heart beats about 80 times per minute — and it hasn't taken a single break since the day you were born. Not one.",
    },
    {
      id: "5c", emoji: "🥦",
      value: fmt(fruitServings), unit: "cell repair kits",
      headline: "Delivered by fruits & veggies",
      body: "Every time you eat fruits and vegetables, you're getting vitamins that help protect your cells. Your body does the hard work — your job is to keep sending supplies.",
    },
    {
      id: "5d", emoji: "🤗",
      value: fmt(totalHugs), unit: "hugs",
      headline: "Moments of connection",
      body: `If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${fmt(totalHugs)} moments where your body is quietly saying: "This person matters to me."`,
    },
    {
      id: "5e", emoji: "💪",
      value: fmtBig(lungExtraLiters), unit: "extra liters of air",
      headline: "Your lungs are getting seriously strong",
      body: "Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs.",
    },
    {
      id: "5f", emoji: "💧",
      value: `${fmt(waterLiters)} L`, unit: "of water",
      headline: `${fmtDecimal(waterPoolPercent)}% of an Olympic pool`,
      body: `An Olympic swimming pool holds 2.5 million liters. At this rate, it would take you about ${fmt(poolYearsRemaining)} more years to drink the rest.`,
    },
  ];

  return (
    <div className="flex items-center justify-center px-6 relative snap-section" style={{ minHeight: "100dvh", background: "var(--bg-secondary)" }}>
      <div className="absolute top-4 right-6"><IdTag id="5" /></div>
      <div className="w-full py-16">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-8 pb-3 border-b max-w-2xl mx-auto"
          style={css.sectionHead}
        >
          Your brain &amp; body
        </h3>
        <div
          data-brain-bento
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", maxWidth: "900px", margin: "0 auto" }}
        >
          {tiles.map((tile, i) => {
            const row = Math.floor(i / 2);
            const isFirst = i % 2 === 0;
            const span = (row % 2 === 0) === isFirst ? 3 : 2;
            return (
              <div
                key={tile.id}
                className="rounded-2xl border p-6 flex flex-col gap-3 relative"
                style={{
                  gridColumn: `span ${span}`,
                  background: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                  boxShadow: "var(--shadow-sm)",
                }}
                data-card
              >
                <div className="absolute top-3 right-3"><IdTag id={tile.id} /></div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-1">{tile.emoji}</span>
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="font-bold"
                        style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
                        data-stat
                      >{tile.value}</span>
                      <span className="text-sm" style={css.secondary}>{tile.unit}</span>
                    </div>
                    <p className="text-sm font-semibold mt-1" style={css.primary}>{tile.headline}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>{tile.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
