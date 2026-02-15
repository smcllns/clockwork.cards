import { useState, useEffect } from "react";
import { computeStats, DEFAULT_CONFIG, type StatsConfig, fmt, fmtBig, fmtDecimal } from "./stats";
import { BlockControl, BlockSlider, BlockStepper } from "./Controls";
import { InlinePills } from "./Controls";

type TimeUnit = "days" | "hours" | "minutes" | "seconds";
type SpaceUnit = "miles" | "km";
const KM_PER_MILE = 1.60934;

// ── Each "slide" definition ────────────────────────────────────────
interface Slide {
  emoji: string;
  getValue: (s: ReturnType<typeof computeStats>, extra: ExtraState) => string;
  getUnit: (extra: ExtraState) => string;
  headline: string;
  getBody: (s: ReturnType<typeof computeStats>, extra: ExtraState) => string;
  controls?: (
    config: StatsConfig,
    setConfig: (fn: (c: StatsConfig) => StatsConfig) => void,
    extra: ExtraState,
    setExtra: (fn: (e: ExtraState) => ExtraState) => void,
  ) => React.ReactNode;
}

interface ExtraState {
  timeUnit: TimeUnit;
  spaceUnit: SpaceUnit;
}

function makeSlides(): Slide[] {
  return [
    // 1. Time
    {
      emoji: "⏳",
      getValue: (s, x) => {
        const m: Record<TimeUnit, number> = { days: s.daysAlive, hours: s.hoursAlive, minutes: s.minutesAlive, seconds: s.secondsAlive };
        return fmt(m[x.timeUnit]);
      },
      getUnit: (x) => x.timeUnit,
      headline: "of being awesome — and counting",
      getBody: (s) =>
        `That's ${fmt(s.daysAlive)} days, ${fmt(s.hoursAlive)} hours, ${fmt(s.minutesAlive)} minutes, or ${fmt(s.secondsAlive)} seconds. Every single one of them yours.`,
      controls: (_c, _sc, extra, setExtra) => (
        <BlockControl label="Show as">
          <InlinePills
            options={[
              { value: "days" as TimeUnit, label: "days" },
              { value: "hours" as TimeUnit, label: "hours" },
              { value: "minutes" as TimeUnit, label: "min" },
              { value: "seconds" as TimeUnit, label: "sec" },
            ]}
            value={extra.timeUnit}
            onChange={(v) => setExtra((e) => ({ ...e, timeUnit: v }))}
          />
        </BlockControl>
      ),
    },
    // 2. Space
    {
      emoji: "🚀",
      getValue: (s, x) => {
        const v = x.spaceUnit === "miles" ? s.milesInSpace : s.milesInSpace * KM_PER_MILE;
        return fmtBig(v);
      },
      getUnit: (x) => x.spaceUnit + " through space",
      headline: "You're an interstellar traveler",
      getBody: (s, x) => {
        const laps = s.lapsAroundSun;
        const speed = x.spaceUnit === "miles" ? "67,000 mph" : "107,000 kph";
        return `${laps} complete laps around the sun. Earth moves at ${speed}. Light would still whoop you though — at 669,600,000 mph, it would cover your distance in just ${fmtDecimal(s.lightSpeedHours)} hours.`;
      },
      controls: (_c, _sc, extra, setExtra) => (
        <BlockControl label="Units">
          <InlinePills
            options={[
              { value: "miles" as SpaceUnit, label: "miles" },
              { value: "km" as SpaceUnit, label: "km" },
            ]}
            value={extra.spaceUnit}
            onChange={(v) => setExtra((e) => ({ ...e, spaceUnit: v }))}
          />
        </BlockControl>
      ),
    },
    // 3. Heartbeats
    {
      emoji: "❤️",
      getValue: (s) => fmtBig(s.totalHeartbeats),
      getUnit: () => "heartbeats",
      headline: "Your heart never takes a day off",
      getBody: (s) =>
        `About 80 beats per minute, ${fmt(s.heartbeatsPerDay)} per day. It started beating before you were born and hasn't stopped since.`,
    },
    // 4. Yogurt
    {
      emoji: "🥄",
      getValue: (s) => `${fmt(s.yogurtKg)}`,
      getUnit: () => "kg of yogurt",
      headline: "Roughly the weight of a baby hippo",
      getBody: (s) =>
        `If you've eaten yogurt every day since you were little, that's ${fmt(s.yogurtKg)} kg of creamy, tangy fuel. Baby hippos weigh about 25–55 kg at birth — you've eaten past that.`,
      controls: (config, setConfig) => (
        <>
          <BlockControl label="Grams per day">
            <BlockSlider value={config.yogurtGramsPerDay} min={10} max={150} step={10} unit="g" onChange={(v) => setConfig((c) => ({ ...c, yogurtGramsPerDay: v }))} />
          </BlockControl>
          <BlockControl label="Since age">
            <BlockStepper value={config.yogurtStartAge} min={1} max={7} step={1} onChange={(v) => setConfig((c) => ({ ...c, yogurtStartAge: v }))} />
          </BlockControl>
        </>
      ),
    },
    // 5. Steps
    {
      emoji: "👟",
      getValue: (s) => fmtBig(s.totalSteps),
      getUnit: () => "steps taken",
      headline: "That's a lot of ground covered",
      getBody: () =>
        "Every step is a tiny adventure. Across the house, around the park, up the stairs, through the puddle. They all count.",
      controls: (config, setConfig) => (
        <>
          <BlockControl label="Steps per day">
            <BlockSlider value={config.stepsPerDay} min={2000} max={15000} step={1000} onChange={(v) => setConfig((c) => ({ ...c, stepsPerDay: v }))} />
          </BlockControl>
          <BlockControl label="Since age">
            <BlockStepper value={config.stepsStartAge} min={1} max={5} step={1} onChange={(v) => setConfig((c) => ({ ...c, stepsStartAge: v }))} />
          </BlockControl>
        </>
      ),
    },
    // 6. Brushing
    {
      emoji: "🪥",
      getValue: (s) => fmtDecimal(s.brushingDays),
      getUnit: () => "solid days brushing teeth",
      headline: `A LOT of brush strokes`,
      getBody: (s) =>
        `Morning and night, every day. That's over ${fmtBig(s.brushStrokes)} tiny back-and-forth motions. Your dentist would be proud.`,
      controls: (config, setConfig) => (
        <>
          <BlockControl label="Minutes per session">
            <BlockStepper value={config.brushMinutes} min={1} max={5} step={1} unit=" min" onChange={(v) => setConfig((c) => ({ ...c, brushMinutes: v }))} />
          </BlockControl>
          <BlockControl label="Since age">
            <BlockStepper value={config.brushStartAge} min={1} max={5} step={1} onChange={(v) => setConfig((c) => ({ ...c, brushStartAge: v }))} />
          </BlockControl>
        </>
      ),
    },
    // 7. Blinks
    {
      emoji: "👁️",
      getValue: (s) => fmtBig(s.totalBlinks),
      getUnit: () => "blinks",
      headline: "Think that's a lot?",
      getBody: () =>
        "Your eyes blink about 15,000 times a day to stay moist and protected. Mostly you don't even notice. Your eyelids have been doing serious work since day one.",
    },
    // 8. Hair
    {
      emoji: "💇",
      getValue: (s) => fmtDecimal(s.hairLengthCm / 100),
      getUnit: () => "meters of hair (never cut)",
      headline: "That would be taller than most adults",
      getBody: (s) =>
        `Your hair grows a little bit every single day. If you'd never had a haircut, it would now be about ${fmtDecimal(s.hairLengthCm)} cm — or ${fmtDecimal(s.hairLengthCm / 100)} meters long.`,
      controls: (config, setConfig) => (
        <BlockControl label="Growth per month">
          <BlockSlider value={config.hairGrowthCmPerMonth} min={0.5} max={2.0} step={0.1} unit=" cm" decimals={1} onChange={(v) => setConfig((c) => ({ ...c, hairGrowthCmPerMonth: v }))} />
        </BlockControl>
      ),
    },
    // 9. Poops
    {
      emoji: "💩",
      getValue: (s) => fmt(s.totalPoops),
      getUnit: () => "poops",
      headline: "Everyone does it",
      getBody: () =>
        "That's just math. And biology. Some things are universal. Kings poop. Astronauts poop. Dinosaurs pooped. You're in good company.",
      controls: (config, setConfig) => (
        <BlockControl label="Per day">
          <BlockStepper value={config.poopsPerDay} min={0.5} max={4} step={0.5} decimals={1} onChange={(v) => setConfig((c) => ({ ...c, poopsPerDay: v }))} />
        </BlockControl>
      ),
    },
    // 10. Sleep / Brain
    {
      emoji: "🧠",
      getValue: (s) => fmt(s.sleepHours),
      getUnit: () => "hours of brain filing time",
      headline: "A tiny librarian organizing your entire life",
      getBody: (s) =>
        `Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift. That's almost ${fmtDecimal(s.sleepYears)} years of organizing.`,
      controls: (config, setConfig) => (
        <BlockControl label="Hours per night">
          <BlockSlider value={config.sleepHoursPerNight} min={7} max={12} step={0.5} unit=" hrs" onChange={(v) => setConfig((c) => ({ ...c, sleepHoursPerNight: v }))} />
        </BlockControl>
      ),
    },
    // 11. Hugs
    {
      emoji: "🤗",
      getValue: (s) => fmt(s.totalHugs),
      getUnit: () => "hugs",
      headline: "\"This person matters to me\"",
      getBody: (s) =>
        `If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${fmt(s.totalHugs)} moments where your body is quietly saying it.`,
      controls: (config, setConfig) => (
        <BlockControl label="Hugs per day">
          <BlockStepper value={config.hugsPerDay} min={1} max={10} step={1} onChange={(v) => setConfig((c) => ({ ...c, hugsPerDay: v }))} />
        </BlockControl>
      ),
    },
    // 12. Lungs
    {
      emoji: "💪",
      getValue: (s) => fmtBig(s.lungExtraLiters),
      getUnit: () => "extra liters of air",
      headline: "Your lungs are getting seriously strong",
      getBody: () =>
        "Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs.",
      controls: (config, setConfig) => (
        <BlockControl label="Hours of hard play per day">
          <BlockSlider value={config.playHoursPerDay} min={0.5} max={4} step={0.5} unit=" hr" decimals={1} onChange={(v) => setConfig((c) => ({ ...c, playHoursPerDay: v }))} />
        </BlockControl>
      ),
    },
    // 13. Water
    {
      emoji: "💧",
      getValue: (s) => fmt(s.waterLiters),
      getUnit: () => "liters of water",
      headline: "Only a tiny fraction of an Olympic pool",
      getBody: (s) =>
        `An Olympic swimming pool holds 2.5 million liters. You've drunk ${fmtDecimal(s.waterPoolPercent)}% of one. At this rate, it would take you about ${fmt(s.poolYearsRemaining)} more years to drink the rest.`,
      controls: (config, setConfig) => (
        <BlockControl label="Glasses per day">
          <BlockStepper value={config.waterGlassesPerDay} min={2} max={12} step={1} onChange={(v) => setConfig((c) => ({ ...c, waterGlassesPerDay: v }))} />
        </BlockControl>
      ),
    },
  ];
}

export default function V8FullViewport({ dob }: { dob: string }) {
  const [config, setConfig] = useState<StatsConfig>({ ...DEFAULT_CONFIG });
  const [extra, setExtra] = useState<ExtraState>({ timeUnit: "days", spaceUnit: "miles" });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const stats = computeStats(dob, config, now);
  const slides = makeSlides();

  return (
    <div>
      {slides.map((slide, i) => (
        <div
          key={i}
          className="flex items-center justify-center px-6"
          style={{
            minHeight: "100vh",
            background: i % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)",
          }}
        >
          <div className="max-w-xl w-full py-16">
            {/* Emoji */}
            <span className="text-4xl block mb-4">{slide.emoji}</span>

            {/* Big number */}
            <div className="mb-2">
              <span
                className="font-bold leading-none"
                style={{
                  fontFamily: "var(--font-stat)",
                  color: "var(--text-primary)",
                  fontSize: "clamp(3rem, 10vw, 5rem)",
                }}
                data-stat
              >
                {slide.getValue(stats, extra)}
              </span>
            </div>

            {/* Unit */}
            <p
              className="text-lg font-medium mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              {slide.getUnit(extra)}
            </p>

            {/* Headline */}
            <p
              className="text-xl font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {slide.headline}
            </p>

            {/* Body */}
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              {slide.getBody(stats, extra)}
            </p>

            {/* Controls */}
            {slide.controls && (
              <div className="space-y-3">
                {slide.controls(config, setConfig, extra, setExtra)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
