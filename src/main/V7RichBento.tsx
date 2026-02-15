import { Stats, fmt, fmtBig, fmtDecimal } from "./stats";

interface Tile {
  span: "wide" | "normal";
  emoji: string;
  value: string;
  unit: string;
  headline: string;
  body: string;
  accent?: boolean;
}

function makeTiles(s: Stats): Tile[] {
  return [
    {
      span: "wide",
      emoji: "🚀",
      value: fmtBig(s.milesInSpace),
      unit: "miles through space",
      headline: `${s.lapsAroundSun} laps around the sun`,
      body: `Earth moves at 67,000 mph — you're not just a kid, you're an interstellar traveler. Light would still whoop you in a race though: at 669,600,000 mph, it would cover your distance in just ${fmtDecimal(s.lightSpeedHours)} hours.`,
      accent: true,
    },
    {
      span: "normal",
      emoji: "⏳",
      value: fmt(s.daysAlive),
      unit: "days alive",
      headline: `${fmt(s.hoursAlive)} hours of being awesome`,
      body: `That's ${fmt(s.minutesAlive)} minutes or ${fmt(s.secondsAlive)} seconds — and counting every single one.`,
    },
    {
      span: "normal",
      emoji: "❤️",
      value: fmtBig(s.totalHeartbeats),
      unit: "heartbeats",
      headline: `${fmt(s.heartbeatsPerDay)} beats per day`,
      body: "Your heart beats about 80 times a minute, every minute, keeping everything running. It never takes a day off.",
    },
    {
      span: "wide",
      emoji: "🧠",
      value: `${fmtDecimal(s.sleepYears)} years`,
      unit: "of brain filing time",
      headline: `${fmt(s.sleepHours)} hours of sleep so far`,
      body: "Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift. That's almost 4 years of a tiny librarian organizing your entire life.",
      accent: true,
    },
    {
      span: "normal",
      emoji: "👟",
      value: fmtBig(s.totalSteps),
      unit: "steps",
      headline: "8,000 per day since age 3",
      body: "If you've walked 8,000 steps a day since you were 3, that's a lot of ground covered. Your legs have carried you further than you probably realize.",
    },
    {
      span: "normal",
      emoji: "🥄",
      value: `${fmt(s.yogurtKg)} kg`,
      unit: "of yogurt eaten",
      headline: "Roughly the weight of a baby hippo",
      body: "If you've eaten 50g of yogurt every day since you were 4, that's how much has fueled you so far. Baby hippos weigh about 25-55 kg at birth — you've eaten past that.",
    },
    {
      span: "normal",
      emoji: "🤗",
      value: fmt(s.totalHugs),
      unit: "hugs given",
      headline: "Moments of connection",
      body: `If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${fmt(s.totalHugs)} moments where your body is quietly saying: "This person matters to me."`,
    },
    {
      span: "wide",
      emoji: "💪",
      value: fmtBig(s.lungExtraLiters),
      unit: "extra liters of air",
      headline: "Your lungs are getting seriously strong",
      body: "Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs.",
      accent: true,
    },
    {
      span: "normal",
      emoji: "👁️",
      value: fmtBig(s.totalBlinks),
      unit: "blinks",
      headline: "About 15,000 every single day",
      body: "Your eyes blink automatically to stay moist and protected. You barely notice it, but your eyelids have been doing serious work since day one.",
    },
    {
      span: "normal",
      emoji: "🥦",
      value: fmt(s.fruitServings),
      unit: "cell repair kits",
      headline: "Delivered by fruits & veggies",
      body: "Every time you eat fruits and vegetables, you're getting vitamins that help protect your cells. Your body does the hard work — your job is to keep sending supplies.",
    },
    {
      span: "normal",
      emoji: "💧",
      value: `${fmt(s.waterLiters)} L`,
      unit: "of water consumed",
      headline: `${fmtDecimal(s.waterPoolPercent)}% of an Olympic pool`,
      body: `An Olympic swimming pool holds 2.5 million liters. You've drunk ${fmt(s.waterLiters)} liters so far. At this rate, it would take you about ${fmt(s.poolYearsRemaining)} more years to drink the rest.`,
    },
    {
      span: "normal",
      emoji: "🪥",
      value: `${fmtDecimal(s.brushingDays)} days`,
      unit: "spent brushing teeth",
      headline: `Over ${fmtBig(s.brushStrokes)} brush strokes`,
      body: "2 minutes, twice a day, since age 3. All those tiny back-and-forth motions add up to a seriously impressive number.",
    },
    {
      span: "normal",
      emoji: "💇",
      value: `${fmtDecimal(s.hairLengthCm / 100)} m`,
      unit: "of hair (never cut)",
      headline: "Growing 1.2 cm per month",
      body: `If you'd never had a haircut, your hair would now be about ${fmtDecimal(s.hairLengthCm / 100)} meters long. That's taller than most adults!`,
    },
    {
      span: "normal",
      emoji: "💩",
      value: fmt(s.totalPoops),
      unit: "poops",
      headline: "~1.5 per day. Everyone does it.",
      body: "That's just math. And biology. Some things are universal.",
    },
  ];
}

export default function V7RichBento({ stats }: { stats: Stats }) {
  const tiles = makeTiles(stats);

  return (
    <div className="px-6 py-12">
      <div
        className="gap-5"
        data-rich-bento
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
        }}
      >
        {tiles.map((tile, i) => (
          <div
            key={i}
            className="rounded-2xl border p-6 flex flex-col gap-3"
            style={{
              gridColumn: tile.span === "wide" ? "span 2" : "span 1",
              background: tile.accent ? "var(--bg-secondary)" : "var(--bg-card)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
            data-card
          >
            {/* Header: emoji + number */}
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-1">{tile.emoji}</span>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="font-bold"
                    style={{
                      fontFamily: "var(--font-stat)",
                      color: "var(--text-primary)",
                      fontSize: tile.span === "wide" ? "2.25rem" : "1.75rem",
                      lineHeight: 1.1,
                    }}
                    data-stat
                  >
                    {tile.value}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {tile.unit}
                  </span>
                </div>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {tile.headline}
                </p>
              </div>
            </div>

            {/* Body text */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)", paddingLeft: "44px" }}
            >
              {tile.body}
            </p>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 767px) {
          [data-rich-bento] { grid-template-columns: 1fr !important; }
          [data-rich-bento] > * { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  );
}
