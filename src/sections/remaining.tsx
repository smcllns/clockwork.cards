import { useState, useCallback } from "react";
import { computeStats, DEFAULT_CONFIG, type StatsConfig, type Stats, fmt, fmtBig, fmtDecimal, fmtYears, hippoHeadline } from "../stats";
import { Slide, KeyMetric, Unit, Headline, Body, N, IdTag, css } from "../components/slide";
import { InlineStepper, InlineSlider, BlockControl, BlockSlider, BlockStepper } from "../components/controls";
import { useNow } from "../components/useNow";

// ── Flippable binary/base-10 card ─────────────────────────────────
function FlipCard({ ageYears }: { ageYears: number }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = useCallback(() => setFlipped(f => !f), []);

  const face = (visible: boolean): React.CSSProperties => ({
    ...css.card,
    transition: "opacity 0.2s ease, transform 0.2s ease",
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.97)",
    pointerEvents: visible ? "auto" : "none",
  });

  return (
    <div className="mb-10 cursor-pointer relative" onClick={toggle}>
      <div
        className="rounded-xl border p-5 space-y-3"
        style={face(!flipped)}
        data-card
      >
        <p className="text-xs uppercase tracking-widest font-semibold" style={css.secondary}>
          Base 2 — tap to flip
        </p>
        <p style={css.primary}>
          In base 2, there are only two numbers: <strong>0</strong> and <strong>1</strong>.
        </p>
        <p style={css.secondary}>
          1001 means: 1 eight, 0 fours, 0 twos, and 1 one.
        </p>
        <p className="pt-2" style={css.formula} data-stat>
          1001₂ = (1×2³) + (0×2²) + (0×2¹) + (1×2⁰) = 8 + 0 + 0 + 1 = {ageYears}
        </p>
      </div>

      <div
        className="rounded-xl border p-5 space-y-3 absolute inset-0"
        style={face(flipped)}
        data-card
      >
        <p className="text-xs uppercase tracking-widest font-semibold" style={css.secondary}>
          Base 10 — tap to flip
        </p>
        <p style={css.primary}>
          In base 10, there are 10 numbers: 0 – 9.
        </p>
        <p style={css.secondary}>
          {ageYears} is … {ageYears}. But to write it the same way: 0 hundreds, 0 tens, {ageYears} ones.
        </p>
        <p className="pt-2" style={css.formula} data-stat>
          {ageYears}₁₀ = (0×10²) + (0×10¹) + ({ageYears}×10⁰) = 0 + 0 + {ageYears} = {ageYears}
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function RemainingCards({ name, dob }: { name: string; dob: string }) {
  const [config, setConfig] = useState<StatsConfig>({ ...DEFAULT_CONFIG });
  const now = useNow();

  const s = computeStats(dob, config, now);
  const set = <K extends keyof StatsConfig>(key: K, val: StatsConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: val }));

  return (
    <>

      {/* 3. YOGURT */}
      <Slide id="3">
        <span className="text-4xl block mb-4">🥄</span>
        <KeyMetric>{fmt(s.yogurtKg)} kg</KeyMetric>
        <Unit>of yogurt</Unit>
        <Headline>{hippoHeadline(s.yogurtKg)}</Headline>
        <Body>
          If you've eaten yogurt every day since you were little, that's {fmt(s.yogurtKg)} kg of
          creamy, tangy fuel. Baby hippos weigh about 40 kg at birth.
        </Body>
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

      {/* 4. YOUR LIFE IN NUMBERS */}
      <div className="flex items-center justify-center px-6 relative snap-section" style={{ minHeight: "100dvh" }}>
        <div className="absolute top-4 right-6"><IdTag id="4" /></div>
        <div className="max-w-2xl w-full py-16">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-10 pb-3 border-b"
          style={css.sectionHead}
        >
          Your life in numbers
        </h3>
        <article className="space-y-6 text-base leading-relaxed" style={css.primary}>
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
      </div>

      {/* 5. YOUR BRAIN & BODY */}
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
          {brainTiles(s).map((tile, i) => {
            const row = Math.floor(i / 2);
            const isFirst = i % 2 === 0;
            const span = (row % 2 === 0) === isFirst ? 3 : 2;
            return (
              <div
                key={i}
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

      {/* 6. BINARY / BASE 2 */}
      <div className="flex items-center justify-center px-6 relative snap-section" style={{ minHeight: "100dvh", background: "var(--bg-primary)" }}>
        <div className="absolute top-4 right-6"><IdTag id="6" /></div>
        <div className="max-w-2xl w-full py-16">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-10 pb-3 border-b"
          style={css.sectionHead}
        >
          One more thing (hard math! See if you can work it out)
        </h3>

        <p className="text-xl font-semibold mb-8" style={css.primary}>
          In binary, {s.ageYears} is{" "}
          <span style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }} data-stat>1001</span>.
        </p>

        <p className="text-base leading-relaxed mb-10" style={css.secondary}>
          "Binary" is what computers use — it just means base 2. Humans write numbers in base 10,
          where digits grow in powers of ten: 10 → 100 → 1000. Binary is the same idea but
          with powers of 2: 2 → 4 → 8 → 16.
        </p>

        <FlipCard ageYears={s.ageYears} />

        <p className="text-base leading-relaxed mb-12" style={css.secondary}>
          Any problem you can solve in base 10, you can also solve in base 2 — or base 3, or any base.
          You're just writing the numbers differently. It's like how "nine", "neuf", "nueve", and "九"
          all mean the same thing in different languages. {s.ageYears} and 1001 are the same number in different bases.
        </p>

        {/* Closing */}
        <div className="pt-8 border-t text-center" style={{ borderColor: "var(--border-color)" }}>
          <p className="text-4xl mb-6">❤️</p>
          <p
            className="text-2xl sm:text-3xl font-semibold leading-snug"
            style={css.primary}
          >
            We love you, we love your mind,<br />
            happy 1001st birthday {name}.
          </p>
        </div>
        </div>
      </div>

    </>
  );
}

// ── Brain & Body tiles ─────────────────────────────────────────────
function brainTiles(s: Stats) {
  return [
    {
      id: "5a", emoji: "🧠",
      value: `${fmtYears(s.sleepYears)} years`, unit: "of brain filing time",
      headline: `${fmt(s.sleepHours)} hours of sleep so far`,
      body: "Every night while you sleep, your brain sorts through everything you learned that day and files it into long-term memory — like a librarian working the night shift.",
    },
    {
      id: "5b", emoji: "❤️",
      value: fmtBig(s.totalHeartbeats), unit: "heartbeats",
      headline: `${fmt(s.heartbeatsPerDay)} beats per day`,
      body: "Your heart beats about 80 times per minute — and it hasn't taken a single break since the day you were born. Not one.",
    },
    {
      id: "5c", emoji: "🥦",
      value: fmt(s.fruitServings), unit: "cell repair kits",
      headline: "Delivered by fruits & veggies",
      body: "Every time you eat fruits and vegetables, you're getting vitamins that help protect your cells. Your body does the hard work — your job is to keep sending supplies.",
    },
    {
      id: "5d", emoji: "🤗",
      value: fmt(s.totalHugs), unit: "hugs",
      headline: "Moments of connection",
      body: `If you hug someone for 10 seconds, your body releases oxytocin, which helps you feel calm and safe. That's ${fmt(s.totalHugs)} moments where your body is quietly saying: "This person matters to me."`,
    },
    {
      id: "5e", emoji: "💪",
      value: fmtBig(s.lungExtraLiters), unit: "extra liters of air",
      headline: "Your lungs are getting seriously strong",
      body: "Every minute you spend running or playing hard, your lungs pull in 40–60 liters of air, compared with 5–8 when resting. Running around isn't just fun — it's a workout for your lungs.",
    },
    {
      id: "5f", emoji: "💧",
      value: `${fmt(s.waterLiters)} L`, unit: "of water",
      headline: `${fmtDecimal(s.waterPoolPercent)}% of an Olympic pool`,
      body: `An Olympic swimming pool holds 2.5 million liters. At this rate, it would take you about ${fmt(s.poolYearsRemaining)} more years to drink the rest.`,
    },
  ];
}
