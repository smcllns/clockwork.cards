import { useState, useEffect } from "react";
import { computeStats, DEFAULT_CONFIG, type StatsConfig, fmt, fmtBig, fmtDecimal } from "./stats";
import { InlineStepper, InlineSlider, InlinePills } from "./Controls";

// Highlighted computed value
function N({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-bold text-lg"
      style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }}
      data-stat
    >
      {children}
    </span>
  );
}

function BigN({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-bold text-4xl block my-4"
      style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)" }}
      data-stat
    >
      {children}
    </span>
  );
}

type TimeUnit = "days" | "hours" | "minutes" | "seconds";
type SpaceUnit = "miles" | "km";

const KM_PER_MILE = 1.60934;

export default function V6InteractiveNarrative({ dob, name }: { dob: string; name: string }) {
  const [config, setConfig] = useState<StatsConfig>({ ...DEFAULT_CONFIG });
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("days");
  const [spaceUnit, setSpaceUnit] = useState<SpaceUnit>("miles");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = computeStats(dob, config, now);

  const set = <K extends keyof StatsConfig>(key: K, val: StatsConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: val }));

  const timeValues: Record<TimeUnit, number> = {
    days: s.daysAlive,
    hours: s.hoursAlive,
    minutes: s.minutesAlive,
    seconds: s.secondsAlive,
  };

  const spaceMiles = s.milesInSpace;
  const spaceKm = spaceMiles * KM_PER_MILE;
  const spaceValue = spaceUnit === "miles" ? spaceMiles : spaceKm;

  return (
    <div className="px-6 py-12 max-w-2xl mx-auto">
      <article
        className="space-y-8 text-base leading-relaxed"
        style={{ color: "var(--text-primary)" }}
      >
        {/* ─── Time & Space ─────────────────────────────────── */}
        <section>
          <p>
            That's <N>{fmt(timeValues[timeUnit])}</N>{" "}
            <InlinePills
              options={[
                { value: "days" as TimeUnit, label: "days" },
                { value: "hours" as TimeUnit, label: "hours" },
                { value: "minutes" as TimeUnit, label: "min" },
                { value: "seconds" as TimeUnit, label: "sec" },
              ]}
              value={timeUnit}
              onChange={setTimeUnit}
            />{" "}
            of being awesome — and counting.
          </p>
        </section>

        <section>
          <p>
            That's <N>{s.lapsAroundSun}</N> laps around the sun. And since Earth
            moves at 67,000 mph, you've traveled
          </p>
          <BigN>
            {fmtBig(spaceValue)}{" "}
            <InlinePills
              options={[
                { value: "miles" as SpaceUnit, label: "miles" },
                { value: "km" as SpaceUnit, label: "km" },
              ]}
              value={spaceUnit}
              onChange={setSpaceUnit}
            />
          </BigN>
          <p>
            through space so far. You're not just a kid — you're an interstellar
            traveler. Though let's be real, light would still whoop you in a race:
            at 669,600,000 mph, it would cover that distance in just{" "}
            <N>{fmtDecimal(s.lightSpeedHours)}</N> hours.
          </p>
        </section>

        <hr style={{ borderColor: "var(--border-color)" }} />

        {/* ─── Life in Numbers ──────────────────────────────── */}
        <section>
          <h3
            className="text-sm font-semibold uppercase tracking-[0.15em] mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Your life in numbers
          </h3>

          <p>
            If you've eaten{" "}
            <InlineStepper
              value={config.yogurtGramsPerDay}
              min={10}
              max={150}
              step={10}
              unit="g"
              onChange={(v) => set("yogurtGramsPerDay", v)}
            />{" "}
            of yogurt every day since you were{" "}
            <InlineStepper
              value={config.yogurtStartAge}
              min={1}
              max={7}
              step={1}
              onChange={(v) => set("yogurtStartAge", v)}
            />{" "}
            , that's about <N>{fmt(s.yogurtKg)} kg</N> — roughly the weight of
            a baby hippo.
          </p>

          <p className="mt-5">
            If you've walked{" "}
            <InlineSlider
              value={config.stepsPerDay}
              min={2000}
              max={15000}
              step={1000}
              onChange={(v) => set("stepsPerDay", v)}
            />{" "}
            steps a day since you were{" "}
            <InlineStepper
              value={config.stepsStartAge}
              min={1}
              max={5}
              step={1}
              onChange={(v) => set("stepsStartAge", v)}
            />{" "}
            , you've taken about <N>{fmtBig(s.totalSteps)} steps</N> in your
            life so far.
          </p>

          <p className="mt-5">
            If you spend{" "}
            <InlineStepper
              value={config.brushMinutes}
              min={1}
              max={5}
              step={1}
              unit=" min"
              onChange={(v) => set("brushMinutes", v)}
            />{" "}
            brushing your teeth every morning and night since age{" "}
            <InlineStepper
              value={config.brushStartAge}
              min={1}
              max={5}
              step={1}
              onChange={(v) => set("brushStartAge", v)}
            />{" "}
            , you've spent over{" "}
            <N>{fmtDecimal(s.brushingDays)} solid days</N> brushing, and done
            over <N>{fmtBig(s.brushStrokes)} brush strokes</N>!
          </p>

          <p className="mt-5">
            Think that's a lot? You've blinked about{" "}
            <N>{fmtBig(s.totalBlinks)} times</N> so far.
          </p>

          <p className="mt-5">
            Your hair grows about{" "}
            <InlineStepper
              value={config.hairGrowthCmPerMonth}
              min={0.5}
              max={2.0}
              step={0.1}
              unit=" cm"
              decimals={1}
              onChange={(v) => set("hairGrowthCmPerMonth", v)}
            />{" "}
            per month. If you'd never had a haircut, your hair would now be about{" "}
            <N>{fmtDecimal(s.hairLengthCm / 100)} meters</N> long!
          </p>

          <p className="mt-5">
            If you poop{" "}
            <InlineStepper
              value={config.poopsPerDay}
              min={0.5}
              max={4}
              step={0.5}
              decimals={1}
              onChange={(v) => set("poopsPerDay", v)}
            />{" "}
            times per day on average, you've pooped around{" "}
            <N>{fmt(s.totalPoops)} times</N> so far.
          </p>
        </section>

        <hr style={{ borderColor: "var(--border-color)" }} />

        {/* ─── Brain & Body ─────────────────────────────────── */}
        <section>
          <h3
            className="text-sm font-semibold uppercase tracking-[0.15em] mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Your brain & body
          </h3>

          <p>
            Every night while you sleep, your brain sorts through everything you
            learned that day and files it into long-term memory — like a librarian
            working the night shift. If you sleep{" "}
            <InlineStepper
              value={config.sleepHoursPerNight}
              min={7}
              max={12}
              step={0.5}
              unit=" hrs"
              decimals={0}
              onChange={(v) => set("sleepHoursPerNight", v)}
            />{" "}
            a night, your brain has had about <N>{fmt(s.sleepHours)} hours</N> of
            filing time. That's almost{" "}
            <N>{fmtDecimal(s.sleepYears)} years</N> of a tiny librarian
            organizing your entire life so far.
          </p>

          <p className="mt-5">
            Every time you eat fruits and vegetables, you're getting vitamins that
            help protect your cells. If you eat{" "}
            <InlineStepper
              value={config.fruitServingsPerDay}
              min={1}
              max={8}
              step={1}
              onChange={(v) => set("fruitServingsPerDay", v)}
            />{" "}
            servings a day, you've delivered about{" "}
            <N>{fmt(s.fruitServings)} "repair kits"</N> to your cells since you
            were born.
          </p>

          <p className="mt-5">
            If you hug someone for 10 seconds, your body releases oxytocin, which
            helps you feel calm and safe. If you've given about{" "}
            <InlineStepper
              value={config.hugsPerDay}
              min={1}
              max={10}
              step={1}
              onChange={(v) => set("hugsPerDay", v)}
            />{" "}
            hugs a day since you were born, that's roughly{" "}
            <N>{fmt(s.totalHugs)} moments</N> where your body is quietly saying:
            "This person matters to me."
          </p>

          <p className="mt-5">
            Every minute you spend running or playing hard, your lungs pull in
            40–60 liters of air, compared with 5–8 when resting. If you play hard
            for{" "}
            <InlineStepper
              value={config.playHoursPerDay}
              min={0.5}
              max={4}
              step={0.5}
              unit=" hr"
              decimals={1}
              onChange={(v) => set("playHoursPerDay", v)}
            />{" "}
            a day, your lungs have handled around{" "}
            <N>{fmtBig(s.lungExtraLiters)} extra liters</N> of air. Running
            around isn't just fun — it's a workout for your lungs, and yours are
            getting seriously strong.
          </p>

          <p className="mt-5">
            If you drink about{" "}
            <InlineStepper
              value={config.waterGlassesPerDay}
              min={2}
              max={12}
              step={1}
              onChange={(v) => set("waterGlassesPerDay", v)}
            />{" "}
            glasses of water a day, you've drunk roughly{" "}
            <N>{fmt(s.waterLiters)} liters</N> in your life. That sounds like a
            lot — but an Olympic swimming pool holds 2.5 million liters, so you've
            only drunk <N>{fmtDecimal(s.waterPoolPercent)}%</N> of one. At this
            rate, it would take you about{" "}
            <N>{fmt(s.poolYearsRemaining)} more years</N> to drink the rest of
            the pool.
          </p>
        </section>
      </article>
    </div>
  );
}
