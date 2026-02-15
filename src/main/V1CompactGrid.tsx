import { Stats, fmt, fmtBig, fmtDecimal } from "./stats";

interface MetricCard {
  emoji: string;
  value: string;
  label: string;
  context: string;
}

function makeCards(s: Stats, name: string): { section: string; cards: MetricCard[] }[] {
  return [
    {
      section: "Time & Space",
      cards: [
        { emoji: "⏳", value: fmt(s.daysAlive), label: "days alive", context: `That's ${fmt(s.hoursAlive)} hours or ${fmt(s.minutesAlive)} minutes` },
        { emoji: "🚀", value: fmtBig(s.milesInSpace), label: "miles through space", context: `${s.lapsAroundSun} laps around the sun at ${fmt(67_000)} mph` },
        { emoji: "💡", value: `${fmtDecimal(s.lightSpeedHours)} hrs`, label: "at light speed", context: `Light would cover your distance in just ${fmtDecimal(s.lightSpeedHours)} hours` },
        { emoji: "❤️", value: fmtBig(s.totalHeartbeats), label: "heartbeats", context: `About ${fmt(s.heartbeatsPerDay)} beats every single day` },
      ],
    },
    {
      section: "Your Life in Numbers",
      cards: [
        { emoji: "🥄", value: `${fmt(s.yogurtKg)} kg`, label: "of yogurt eaten", context: "Roughly the weight of a baby hippo" },
        { emoji: "👟", value: fmtBig(s.totalSteps), label: "steps taken", context: `About ${fmt(8_000)} steps every day since age 3` },
        { emoji: "🪥", value: `${fmtDecimal(s.brushingDays)} days`, label: "spent brushing teeth", context: `Over ${fmtBig(s.brushStrokes)} brush strokes` },
        { emoji: "👁️", value: fmtBig(s.totalBlinks), label: "blinks", context: "About 15,000 blinks every day" },
        { emoji: "💇", value: `${fmtDecimal(s.hairLengthCm / 100)} m`, label: "of hair (never cut)", context: `Growing ${fmtDecimal(s.hairLengthCm / s.daysAlive * 30, 1)} cm every month` },
        { emoji: "💩", value: fmt(s.totalPoops), label: "poops", context: "About 1.5 per day on average" },
      ],
    },
    {
      section: "Your Brain & Body",
      cards: [
        { emoji: "🧠", value: `${fmt(s.sleepHours)} hrs`, label: "of brain filing time", context: `Almost ${fmtDecimal(s.sleepYears)} years of a tiny librarian organizing your memories` },
        { emoji: "🥦", value: fmt(s.fruitServings), label: "repair kits delivered", context: "Every fruit & veggie serving protects your cells" },
        { emoji: "🤗", value: fmt(s.totalHugs), label: "hugs given", context: `${fmt(s.totalHugs)} moments of "this person matters to me"` },
        { emoji: "💪", value: fmtBig(s.lungExtraLiters), label: "extra liters of air", context: "Your lungs are getting seriously strong" },
        { emoji: "💧", value: `${fmt(s.waterLiters)} L`, label: "of water consumed", context: `Only ${fmtDecimal(s.waterPoolPercent)}% of an Olympic pool — ${fmt(s.poolYearsRemaining)} more years to drink the rest` },
      ],
    },
  ];
}

export default function V1CompactGrid({ stats, name }: { stats: Stats; name: string }) {
  const groups = makeCards(stats, name);

  return (
    <div className="px-6 py-12">
      {groups.map((group) => (
        <div key={group.section} className="mb-12">
          <h3
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            {group.section}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.cards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border p-5 flex flex-col gap-1"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                  boxShadow: "var(--shadow-sm)",
                }}
                data-card
              >
                <span className="text-2xl mb-1">{card.emoji}</span>
                <p
                  className="text-3xl font-bold"
                  style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)" }}
                  data-stat
                >
                  {card.value}
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {card.label}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  {card.context}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
