import { useState, useEffect } from "react";
import { computeStats, DEFAULT_CONFIG, type StatsConfig, type Stats, fmt, fmtBig, fmtDecimal } from "./stats";
import { InlineStepper, InlineSlider, InlinePills, BlockControl, BlockSlider, BlockStepper } from "./Controls";

// ── ID tag (small muted label for feedback reference) ──────────────
function IdTag({ id }: { id: string }) {
  return (
    <span
      className="text-xs font-mono select-all"
      style={{ color: "var(--text-secondary)", opacity: 0.4 }}
    >
      #{id}
    </span>
  );
}

// ── Reusable V8-style full-viewport slide ──────────────────────────
function Slide({ children, alt, id }: { children: React.ReactNode; alt?: boolean; id: string }) {
  return (
    <div
      className="flex items-center justify-center px-6 relative"
      style={{ minHeight: "100vh", background: alt ? "var(--bg-secondary)" : "var(--bg-primary)" }}
    >
      <div className="absolute top-4 right-6"><IdTag id={id} /></div>
      <div className="max-w-xl w-full py-16">{children}</div>
    </div>
  );
}

function BigNum({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <span
        className="font-bold leading-none"
        style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "clamp(3rem, 10vw, 5rem)" }}
        data-stat
      >
        {children}
      </span>
    </div>
  );
}

function SlideUnit({ children }: { children: React.ReactNode }) {
  return <p className="text-lg font-medium mb-6" style={{ color: "var(--text-secondary)" }}>{children}</p>;
}

function SlideHeadline({ children }: { children: React.ReactNode }) {
  return <p className="text-xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>{children}</p>;
}

function SlideBody({ children }: { children: React.ReactNode }) {
  return <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>{children}</p>;
}

// ── V6-style inline highlight ──────────────────────────────────────
function N({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-bold text-lg" style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }} data-stat>
      {children}
    </span>
  );
}

// ── Types ──────────────────────────────────────────────────────────
type TimeUnit = "days" | "hours" | "minutes" | "seconds";
type SpaceUnit = "miles" | "km";
const KM_PER_MILE = 1.60934;

// ════════════════════════════════════════════════════════════════════
export default function CuratedMain({ name, dob }: { name: string; dob: string }) {
  const [config, setConfig] = useState<StatsConfig>({ ...DEFAULT_CONFIG });
  const [now, setNow] = useState(Date.now());
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("days");
  const [spaceUnit, setSpaceUnit] = useState<SpaceUnit>("miles");

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = computeStats(dob, config, now);
  const set = <K extends keyof StatsConfig>(key: K, val: StatsConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: val }));

  const timeValues: Record<TimeUnit, number> = {
    days: s.daysAlive, hours: s.hoursAlive, minutes: s.minutesAlive, seconds: s.secondsAlive,
  };
  const spaceVal = spaceUnit === "miles" ? s.milesInSpace : s.milesInSpace * KM_PER_MILE;

  return (
    <section style={{ background: "var(--bg-primary)" }}>

      {/* ──────────────────────────────────────────────────────────
          1. TIME (V8 style)
          ────────────────────────────────────────────────────────── */}
      <Slide id="1">
        <span className="text-4xl block mb-4">⏳</span>
        <BigNum>{fmt(timeValues[timeUnit])}</BigNum>
        <SlideUnit>{timeUnit} of being awesome</SlideUnit>
        <SlideHeadline>And counting.</SlideHeadline>
        <SlideBody>
          That's {fmt(s.daysAlive)} days, {fmt(s.hoursAlive)} hours, {fmt(s.minutesAlive)} minutes,
          or {fmt(s.secondsAlive)} seconds — every single one of them yours.
        </SlideBody>
        <BlockControl label="Show as">
          <InlinePills
            options={[
              { value: "days" as TimeUnit, label: "days" },
              { value: "hours" as TimeUnit, label: "hours" },
              { value: "minutes" as TimeUnit, label: "min" },
              { value: "seconds" as TimeUnit, label: "sec" },
            ]}
            value={timeUnit}
            onChange={setTimeUnit}
          />
        </BlockControl>
      </Slide>

      {/* ──────────────────────────────────────────────────────────
          2. SPACE (V8 style)
          ────────────────────────────────────────────────────────── */}
      <Slide alt id="2">
        <span className="text-4xl block mb-4">🚀</span>
        <BigNum>{fmtBig(spaceVal)}</BigNum>
        <SlideUnit>{spaceUnit} through space</SlideUnit>
        <SlideHeadline>You're an interstellar traveler.</SlideHeadline>
        <SlideBody>
          {s.lapsAroundSun} laps around the sun. Earth moves at 67,000 mph — you're not just a kid,
          you're an interstellar traveler. Though let's be real, light would still whoop you in a race:
          at 669,600,000 mph, it would cover that distance in just {fmtDecimal(s.lightSpeedHours)} hours.
        </SlideBody>
        <BlockControl label="Units">
          <InlinePills
            options={[
              { value: "miles" as SpaceUnit, label: "miles" },
              { value: "km" as SpaceUnit, label: "km" },
            ]}
            value={spaceUnit}
            onChange={setSpaceUnit}
          />
        </BlockControl>
      </Slide>

      {/* ──────────────────────────────────────────────────────────
          3. YOGURT (V8 style)
          ────────────────────────────────────────────────────────── */}
      <Slide id="3">
        <span className="text-4xl block mb-4">🥄</span>
        <BigNum>{fmt(s.yogurtKg)} kg</BigNum>
        <SlideUnit>of yogurt</SlideUnit>
        <SlideHeadline>Roughly the weight of a baby hippo.</SlideHeadline>
        <SlideBody>
          If you've eaten yogurt every day since you were little, that's {fmt(s.yogurtKg)} kg of
          creamy, tangy fuel. Baby hippos weigh about 25–55 kg at birth — you've eaten past that.
        </SlideBody>
        <div className="space-y-3">
          <BlockControl label="Grams per day">
            <BlockSlider value={config.yogurtGramsPerDay} min={10} max={150} step={10} unit="g"
              onChange={(v) => set("yogurtGramsPerDay", v)} />
          </BlockControl>
          <BlockControl label="Since age">
            <BlockStepper value={config.yogurtStartAge} min={1} max={7} step={1}
              onChange={(v) => set("yogurtStartAge", v)} />
          </BlockControl>
        </div>
      </Slide>

      {/* ──────────────────────────────────────────────────────────
          4. YOUR LIFE IN NUMBERS (V6 style — narrative + controls)
          ────────────────────────────────────────────────────────── */}
      <div className="px-6 py-16 max-w-2xl mx-auto relative">
        <div className="absolute top-4 right-6"><IdTag id="4" /></div>
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-10 pb-3 border-b"
          style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
        >
          Your life in numbers
        </h3>
        <article className="space-y-6 text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
          <p>
            <IdTag id="4a" />{" "}If you've walked{" "}
            <InlineSlider value={config.stepsPerDay} min={2000} max={15000} step={1000}
              onChange={(v) => set("stepsPerDay", v)} />{" "}
            steps a day since you were{" "}
            <InlineStepper value={config.stepsStartAge} min={1} max={5} step={1}
              onChange={(v) => set("stepsStartAge", v)} />{" "}
            , you've taken about <N>{fmtBig(s.totalSteps)} steps</N> in your life so far.
          </p>

          <p>
            <IdTag id="4b" />{" "}If you spend{" "}
            <InlineStepper value={config.brushMinutes} min={1} max={5} step={1} unit=" min"
              onChange={(v) => set("brushMinutes", v)} />{" "}
            brushing your teeth every morning and night since age{" "}
            <InlineStepper value={config.brushStartAge} min={1} max={5} step={1}
              onChange={(v) => set("brushStartAge", v)} />{" "}
            , you've spent over <N>{fmtDecimal(s.brushingDays)} solid days</N> brushing,
            and done over <N>{fmtBig(s.brushStrokes)} brush strokes</N>!
          </p>

          <p>
            <IdTag id="4c" />{" "}Think that's a lot? You've blinked about <N>{fmtBig(s.totalBlinks)} times</N> so far.
          </p>

          <p>
            <IdTag id="4d" />{" "}Your hair grows about{" "}
            <InlineStepper value={config.hairGrowthCmPerMonth} min={0.5} max={2.0} step={0.1}
              unit=" cm" decimals={1} onChange={(v) => set("hairGrowthCmPerMonth", v)} />{" "}
            per month. If you'd never had a haircut, your hair would now be about{" "}
            <N>{fmtDecimal(s.hairLengthCm / 100)} meters</N> long!
          </p>

          <p>
            <IdTag id="4e" />{" "}If you poop{" "}
            <InlineStepper value={config.poopsPerDay} min={0.5} max={4} step={0.5} decimals={1}
              onChange={(v) => set("poopsPerDay", v)} />{" "}
            times per day on average, you've pooped around <N>{fmt(s.totalPoops)} times</N> so far.
          </p>
        </article>
      </div>

      {/* ──────────────────────────────────────────────────────────
          5. YOUR BRAIN & BODY (V7 style — rich bento)
          ────────────────────────────────────────────────────────── */}
      <div className="px-6 py-16 relative" style={{ background: "var(--bg-secondary)" }}>
        <div className="absolute top-4 right-6"><IdTag id="5" /></div>
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-8 pb-3 border-b max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
        >
          Your brain &amp; body
        </h3>
        <div
          data-brain-bento
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}
        >
          {brainTiles(s).map((tile, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 flex flex-col gap-3 relative"
              style={{
                gridColumn: tile.wide ? "span 2" : "span 1",
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
                      style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: tile.wide ? "2.25rem" : "1.75rem", lineHeight: 1.1 }}
                      data-stat
                    >{tile.value}</span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{tile.unit}</span>
                  </div>
                  <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{tile.headline}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", paddingLeft: "44px" }}>{tile.body}</p>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 767px) {
            [data-brain-bento] { grid-template-columns: 1fr !important; }
            [data-brain-bento] > * { grid-column: span 1 !important; }
          }
        `}</style>
      </div>

      {/* ──────────────────────────────────────────────────────────
          6. BINARY / BASE 2 (V8 style)
          ────────────────────────────────────────────────────────── */}
      <Slide id="6">
        <span className="text-4xl block mb-4">💻</span>
        <BigNum>1001</BigNum>
        <SlideUnit>is {s.ageYears} in binary</SlideUnit>
        <SlideHeadline>One more thing.</SlideHeadline>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <p>
            "Binary" is what computers use — it just means base 2. Humans write numbers in base 10,
            where digits grow in powers of ten: 10 → 100 → 1000. Binary is the same idea but
            with powers of 2: 2 → 4 → 8 → 16.
          </p>
          <div
            className="rounded-xl p-4 border space-y-2"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
          >
            <p style={{ color: "var(--text-primary)" }}>In base 2, there are only two numbers: <strong>0</strong> and <strong>1</strong>.</p>
            <p>1001 means: 1 eight, 0 fours, 0 twos, and 1 one.</p>
            <p className="mt-2" style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }}>
              1001₂ = (1×2³) + (0×2²) + (0×2¹) + (1×2⁰) = 8 + 0 + 0 + 1 = <strong>{s.ageYears}</strong>
            </p>
          </div>
          <div
            className="rounded-xl p-4 border space-y-2"
            style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}
          >
            <p style={{ color: "var(--text-primary)" }}>In base 10, there are 10 numbers: 0 – 9.</p>
            <p>{s.ageYears} is … {s.ageYears}. But to write it the same way: 0 hundreds, 0 tens, {s.ageYears} ones.</p>
            <p className="mt-2" style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }}>
              {s.ageYears}₁₀ = (0×10²) + (0×10¹) + ({s.ageYears}×10⁰) = 0 + 0 + {s.ageYears} = <strong>{s.ageYears}</strong>
            </p>
          </div>
          <p>
            Any problem you can solve in base 10, you can also solve in base 2 — or base 3, or any base.
            You're just writing the numbers differently. It's like how "nine", "neuf", "nueve", and "九"
            all mean the same thing in different languages. {s.ageYears} and 1001 are the same number in different bases.
          </p>
        </div>
      </Slide>

      {/* ──────────────────────────────────────────────────────────
          7. CLOSING (V8 style)
          ────────────────────────────────────────────────────────── */}
      <Slide alt id="7">
        <div className="text-center">
          <p className="text-6xl mb-8">❤️</p>
          <p
            className="text-2xl sm:text-3xl font-semibold leading-snug mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            We love you, we love your mind,
            <br />
            happy <span style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }}>1001</span>st birthday {name}.
          </p>
        </div>
      </Slide>

      {/* ──────────────────────────────────────────────────────────
          8. APPENDIX (V5 style — compact ticker of all facts)
          ────────────────────────────────────────────────────────── */}
      <div className="px-6 py-16 max-w-2xl mx-auto relative">
        <div className="absolute top-4 right-6"><IdTag id="8" /></div>
        <h3
          className="text-xs font-semibold uppercase tracking-[0.2em] mb-6 pb-2 border-b"
          style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
        >
          All the numbers
        </h3>
        {tickerGroups(s, spaceUnit, spaceVal).map((g) => (
          <div key={g.section} className="mb-8">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {g.section}
            </h4>
            {g.rows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between py-2 border-b"
                style={{ borderColor: i < g.rows.length - 1 ? "var(--border-color)" : "transparent" }}
              >
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                <span className="text-base font-bold tabular-nums" style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)" }} data-stat>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Brain & Body tiles ─────────────────────────────────────────────
function brainTiles(s: Stats) {
  return [
    {
      id: "5a", wide: true, emoji: "🧠",
      value: `${fmtDecimal(s.sleepYears)} years`, unit: "of brain filing time",
      headline: `${fmt(s.sleepHours)} hours of sleep so far`,
      body: "Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift. That's years of a tiny librarian organizing your entire life.",
    },
    {
      id: "5b", wide: false, emoji: "🥦",
      value: fmt(s.fruitServings), unit: "cell repair kits",
      headline: "Delivered by fruits & veggies",
      body: "Every time you eat fruits and vegetables, you're getting vitamins that help protect your cells. Your body does the hard work — your job is to keep sending supplies.",
    },
    {
      id: "5c", wide: false, emoji: "🤗",
      value: fmt(s.totalHugs), unit: "hugs",
      headline: "Moments of connection",
      body: `If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${fmt(s.totalHugs)} moments where your body is quietly saying: "This person matters to me."`,
    },
    {
      id: "5d", wide: true, emoji: "💪",
      value: fmtBig(s.lungExtraLiters), unit: "extra liters of air",
      headline: "Your lungs are getting seriously strong",
      body: "Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs.",
    },
    {
      id: "5e", wide: false, emoji: "💧",
      value: `${fmt(s.waterLiters)} L`, unit: "of water",
      headline: `${fmtDecimal(s.waterPoolPercent)}% of an Olympic pool`,
      body: `An Olympic swimming pool holds 2.5 million liters. At this rate, it would take you about ${fmt(s.poolYearsRemaining)} more years to drink the rest.`,
    },
  ];
}

// ── Appendix ticker rows ───────────────────────────────────────────
function tickerGroups(s: Stats, spaceUnit: SpaceUnit, spaceVal: number) {
  return [
    {
      section: "Time & Space",
      rows: [
        { label: "Days alive", value: fmt(s.daysAlive) },
        { label: "Hours alive", value: fmt(s.hoursAlive) },
        { label: "Minutes alive", value: fmt(s.minutesAlive) },
        { label: "Seconds alive", value: fmt(s.secondsAlive) },
        { label: "Laps around the sun", value: String(s.lapsAroundSun) },
        { label: `${spaceUnit === "miles" ? "Miles" : "Km"} through space`, value: fmtBig(spaceVal) },
        { label: "Light speed equivalent", value: `${fmtDecimal(s.lightSpeedHours)} hrs` },
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
        { label: "Hours of sleep", value: fmt(s.sleepHours) },
        { label: "Years of brain filing", value: `${fmtDecimal(s.sleepYears)} yrs` },
        { label: "Fruit & veg servings", value: fmt(s.fruitServings) },
        { label: "Hugs given", value: fmt(s.totalHugs) },
        { label: "Extra liters of air (lungs)", value: fmtBig(s.lungExtraLiters) },
        { label: "Water consumed", value: `${fmt(s.waterLiters)} L` },
        { label: "% of Olympic pool", value: `${fmtDecimal(s.waterPoolPercent)}%` },
      ],
    },
  ];
}
