import { Stats, fmt, fmtBig, fmtDecimal } from "./stats";

interface Tile {
  span: "wide" | "normal";
  emoji: string;
  value: string;
  unit: string;
  headline: string;
  detail?: string;
  accent?: boolean;
}

function makeTiles(s: Stats): Tile[] {
  return [
    // Row 1: featured wide + normal
    {
      span: "wide",
      emoji: "🚀",
      value: fmtBig(s.milesInSpace),
      unit: "miles through space",
      headline: `${s.lapsAroundSun} laps around the sun`,
      detail: `Earth moves at 67,000 mph. Light would cover this in just ${fmtDecimal(s.lightSpeedHours)} hours.`,
      accent: true,
    },
    {
      span: "normal",
      emoji: "⏳",
      value: fmt(s.daysAlive),
      unit: "days alive",
      headline: `${fmt(s.hoursAlive)} hours`,
      detail: `${fmt(s.secondsAlive)} seconds`,
    },
    // Row 2
    {
      span: "normal",
      emoji: "❤️",
      value: fmtBig(s.totalHeartbeats),
      unit: "heartbeats",
      headline: `${fmt(s.heartbeatsPerDay)} per day`,
    },
    {
      span: "normal",
      emoji: "🧠",
      value: `${fmtDecimal(s.sleepYears)}`,
      unit: "years of brain filing",
      headline: `${fmt(s.sleepHours)} hours of sleep`,
      detail: "A tiny librarian organizing your entire life",
    },
    {
      span: "normal",
      emoji: "👟",
      value: fmtBig(s.totalSteps),
      unit: "steps",
      headline: "8,000 per day since age 3",
    },
    // Row 3: wide + normal
    {
      span: "wide",
      emoji: "💪",
      value: fmtBig(s.lungExtraLiters),
      unit: "extra liters of air",
      headline: "Your lungs are getting seriously strong",
      detail: "Every minute running or playing hard, your lungs pull in 40–60 liters of air, vs 5–8 at rest.",
      accent: true,
    },
    {
      span: "normal",
      emoji: "🤗",
      value: fmt(s.totalHugs),
      unit: "hugs",
      headline: `Moments of "this person matters"`,
    },
    // Row 4
    {
      span: "normal",
      emoji: "🥄",
      value: `${fmt(s.yogurtKg)} kg`,
      unit: "of yogurt",
      headline: "Weight of a baby hippo",
    },
    {
      span: "normal",
      emoji: "👁️",
      value: fmtBig(s.totalBlinks),
      unit: "blinks",
      headline: "~15,000 every day",
    },
    {
      span: "normal",
      emoji: "🥦",
      value: fmt(s.fruitServings),
      unit: "cell repair kits",
      headline: "Vitamins from fruits & veggies",
    },
    // Row 5
    {
      span: "normal",
      emoji: "💧",
      value: `${fmt(s.waterLiters)} L`,
      unit: "of water",
      headline: `${fmtDecimal(s.waterPoolPercent)}% of an Olympic pool`,
      detail: `${fmt(s.poolYearsRemaining)} more years to drink the rest`,
    },
    {
      span: "normal",
      emoji: "🪥",
      value: `${fmtDecimal(s.brushingDays)}`,
      unit: "days brushing teeth",
      headline: `${fmtBig(s.brushStrokes)} brush strokes`,
    },
    {
      span: "normal",
      emoji: "💇",
      value: `${fmtDecimal(s.hairLengthCm / 100)} m`,
      unit: "of hair (never cut)",
      headline: "1.2 cm per month",
    },
    {
      span: "normal",
      emoji: "💩",
      value: fmt(s.totalPoops),
      unit: "poops",
      headline: "~1.5 per day. Everyone does it.",
    },
  ];
}

export default function V3BentoBox({ stats }: { stats: Stats }) {
  const tiles = makeTiles(stats);

  return (
    <div className="px-6 py-12">
      <div
        className="gap-4"
        data-bento-grid
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {tiles.map((tile, i) => (
          <div
            key={i}
            className="rounded-2xl border p-5 flex flex-col justify-between"
            style={{
              gridColumn: tile.span === "wide" ? "span 2" : "span 1",
              background: tile.accent ? "var(--bg-secondary)" : "var(--bg-card)",
              borderColor: "var(--border-color)",
              boxShadow: "var(--shadow-sm)",
              minHeight: tile.span === "wide" ? "180px" : "160px",
            }}
            data-card
          >
            <div>
              <span className="text-xl">{tile.emoji}</span>
              <div className="mt-2">
                <span
                  className="text-3xl font-bold"
                  style={{
                    fontFamily: "var(--font-stat)",
                    color: "var(--text-primary)",
                    fontSize: tile.span === "wide" ? "2.5rem" : undefined,
                  }}
                  data-stat
                >
                  {tile.value}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {tile.unit}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {tile.headline}
              </p>
              {tile.detail && (
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {tile.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 639px) {
          [data-bento-grid] { grid-template-columns: 1fr !important; }
          [data-bento-grid] > * { grid-column: span 1 !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          [data-bento-grid] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
