import { Stats, fmt, fmtBig, fmtDecimal } from "./stats";

interface Metric {
  value: string;
  unit: string;
  headline: string;
  body: string;
}

function makeMetrics(s: Stats): { section: string; metrics: Metric[] }[] {
  return [
    {
      section: "Time & Space",
      metrics: [
        {
          value: fmt(s.daysAlive),
          unit: "days",
          headline: "of being awesome",
          body: `That's ${fmt(s.hoursAlive)} hours, or ${fmt(s.minutesAlive)} minutes, or ${fmt(s.secondsAlive)} seconds — and counting.`,
        },
        {
          value: fmtBig(s.milesInSpace),
          unit: "miles",
          headline: "traveled through space",
          body: `${s.lapsAroundSun} complete laps around the sun. Earth moves at 67,000 mph — you're not just a kid, you're an interstellar traveler.`,
        },
        {
          value: fmtBig(s.totalHeartbeats),
          unit: "beats",
          headline: "of your heart",
          body: `That's about ${fmt(s.heartbeatsPerDay)} beats every day, keeping everything running. Your heart never takes a day off.`,
        },
      ],
    },
    {
      section: "Your Life in Numbers",
      metrics: [
        {
          value: `${fmt(s.yogurtKg)}`,
          unit: "kg of yogurt",
          headline: "Roughly the weight of a baby hippo",
          body: "If you've eaten 50g of yogurt every day since you were 4, that's how much has fueled you so far.",
        },
        {
          value: fmtBig(s.totalSteps),
          unit: "steps",
          headline: "and counting",
          body: "If you've walked 8,000 steps a day since age 3 — that's a lot of ground covered.",
        },
        {
          value: fmtBig(s.totalBlinks),
          unit: "blinks",
          headline: "Think that's a lot?",
          body: "Your eyes blink about 15,000 times a day. Mostly you don't even notice.",
        },
        {
          value: `${fmtDecimal(s.hairLengthCm / 100)}`,
          unit: "meters",
          headline: "of hair if never cut",
          body: `Your hair grows about 1.2 cm per month. If you'd never had a haircut, it would reach ${fmtDecimal(s.hairLengthCm / 100)} meters by now.`,
        },
        {
          value: `${fmtDecimal(s.brushingDays)}`,
          unit: "solid days",
          headline: "spent brushing your teeth",
          body: `2 minutes, twice a day, since age 3. That's over ${fmtBig(s.brushStrokes)} brush strokes.`,
        },
        {
          value: fmt(s.totalPoops),
          unit: "poops",
          headline: "Everyone does it",
          body: "About 1.5 per day on average. That's just math.",
        },
      ],
    },
    {
      section: "Your Brain & Body",
      metrics: [
        {
          value: fmt(s.sleepHours),
          unit: "hours",
          headline: "of brain filing time",
          body: `Every night while you sleep, your brain sorts through everything you learned — like a librarian working the night shift. That's almost ${fmtDecimal(s.sleepYears)} years of a tiny librarian organizing your entire life.`,
        },
        {
          value: fmt(s.fruitServings),
          unit: "repair kits",
          headline: "delivered to your cells",
          body: "Every time you eat fruits and vegetables, you're sending vitamins that help protect your cells. Your body does the hard work — your job is to keep sending supplies.",
        },
        {
          value: fmt(s.totalHugs),
          unit: "hugs",
          headline: "moments of connection",
          body: `If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${fmt(s.totalHugs)} moments where your body quietly says: "This person matters to me."`,
        },
        {
          value: fmtBig(s.lungExtraLiters),
          unit: "extra liters of air",
          headline: "processed by your lungs",
          body: "Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air. Running around isn't just fun — it's a workout for your lungs, and yours are getting seriously strong.",
        },
        {
          value: fmt(s.waterLiters),
          unit: "liters of water",
          headline: `${fmtDecimal(s.waterPoolPercent)}% of an Olympic pool`,
          body: `An Olympic pool holds 2.5 million liters. At this rate, it would take you about ${fmt(s.poolYearsRemaining)} more years to drink the rest.`,
        },
      ],
    },
  ];
}

export default function V2Magazine({ stats }: { stats: Stats }) {
  const groups = makeMetrics(stats);

  return (
    <div className="px-6 py-12">
      {groups.map((group) => (
        <div key={group.section} className="mb-16">
          <h3
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-10 pb-3 border-b"
            style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
          >
            {group.section}
          </h3>
          <div className="space-y-10">
            {group.metrics.map((m, i) => (
              <div
                key={m.unit + i}
                className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8"
              >
                {/* Number */}
                <div className="sm:w-[280px] shrink-0 sm:text-right">
                  <span
                    className="text-5xl sm:text-6xl font-bold leading-none"
                    style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)" }}
                    data-stat
                  >
                    {m.value}
                  </span>
                  <span
                    className="text-lg ml-2 font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {m.unit}
                  </span>
                </div>
                {/* Text */}
                <div className="flex-1 max-w-lg">
                  <p className="font-semibold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                    {m.headline}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
