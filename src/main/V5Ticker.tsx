import { Stats, fmt, fmtBig, fmtDecimal } from "./stats";

interface Row {
  label: string;
  value: string;
  unit?: string;
}

function makeRows(s: Stats): { section: string; rows: Row[] }[] {
  return [
    {
      section: "Time & Space",
      rows: [
        { label: "Days alive", value: fmt(s.daysAlive), unit: "days" },
        { label: "Hours alive", value: fmt(s.hoursAlive), unit: "hrs" },
        { label: "Minutes alive", value: fmt(s.minutesAlive), unit: "min" },
        { label: "Seconds alive", value: fmt(s.secondsAlive), unit: "sec" },
        { label: "Laps around the sun", value: String(s.lapsAroundSun) },
        { label: "Miles through space", value: fmtBig(s.milesInSpace) },
        { label: "Light speed equivalent", value: `${fmtDecimal(s.lightSpeedHours)} hrs` },
      ],
    },
    {
      section: "Heartbeats",
      rows: [
        { label: "Total heartbeats", value: fmtBig(s.totalHeartbeats) },
        { label: "Beats per day", value: fmt(s.heartbeatsPerDay) },
      ],
    },
    {
      section: "Your Life in Numbers",
      rows: [
        { label: "Yogurt consumed", value: `${fmt(s.yogurtKg)} kg` },
        { label: "Steps taken", value: fmtBig(s.totalSteps) },
        { label: "Days brushing teeth", value: fmtDecimal(s.brushingDays) },
        { label: "Brush strokes", value: fmtBig(s.brushStrokes) },
        { label: "Times blinked", value: fmtBig(s.totalBlinks) },
        { label: "Hair length (never cut)", value: `${fmtDecimal(s.hairLengthCm / 100)} m` },
        { label: "Total poops", value: fmt(s.totalPoops) },
      ],
    },
    {
      section: "Your Brain & Body",
      rows: [
        { label: "Hours of sleep", value: fmt(s.sleepHours), unit: "hrs" },
        { label: "Years of brain filing", value: fmtDecimal(s.sleepYears), unit: "yrs" },
        { label: "Fruit & veg servings", value: fmt(s.fruitServings) },
        { label: "Hugs given", value: fmt(s.totalHugs) },
        { label: "Extra liters of air (lungs)", value: fmtBig(s.lungExtraLiters) },
        { label: "Water consumed", value: `${fmt(s.waterLiters)} L` },
        { label: "% of Olympic pool", value: `${fmtDecimal(s.waterPoolPercent)}%` },
      ],
    },
  ];
}

export default function V5Ticker({ stats }: { stats: Stats }) {
  const groups = makeRows(stats);

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto">
      {groups.map((group) => (
        <div key={group.section} className="mb-10">
          <h3
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 pb-2 border-b"
            style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
          >
            {group.section}
          </h3>
          <div className="space-y-0">
            {group.rows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between py-2.5 border-b"
                style={{
                  borderColor: i < group.rows.length - 1 ? "var(--border-color)" : "transparent",
                }}
              >
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {row.label}
                </span>
                <span className="flex items-baseline gap-1">
                  <span
                    className="text-lg font-bold tabular-nums"
                    style={{
                      fontFamily: "var(--font-stat)",
                      color: "var(--text-primary)",
                    }}
                    data-stat
                  >
                    {row.value}
                  </span>
                  {row.unit && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {row.unit}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
