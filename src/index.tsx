import { useState } from "react";
import { createRoot } from "react-dom/client";
import { useNow } from "./components/useNow";
import Nav from "./components/nav";
import Footer from "./components/footer";
import HeroCyberpunk from "./cards/hero-cyberpunk";
import { Slide, KeyMetric, Headline, Unit, N } from "./components/slide";
import { PhotoSlide } from "./components/photo-slide";
import { TileContainer, Tile } from "./components/tile";
import { FlipCard } from "./components/flip-card";
import { css } from "./components/section";
import { InlinePills, InlineDropdown, InlineStepper, InlineSlider } from "./components/controls";
import { his, he } from "./utils";
import { expandBase, describeBase, ordinalSuffix } from "./cards/binary";
import {
  useTimeMetrics, useSpaceMetrics, useStepsMetrics, useYogurtMetrics,
  useHeartMetrics, useFruitMetrics, useHugsMetrics, useLungsMetrics,
  useSleepMetrics, useBrushingMetrics, useWaterMetrics, usePoopsMetrics,
  useHairMetrics, useClosingMetrics, TIME_UNITS,
} from "./hooks";

import imgTimeLight from "./assets/photo-time.png";
import imgTimeShiny from "./assets/photo-time-shiny.png";
import imgSpaceLight from "./assets/photo-space.png";
import imgSpaceShiny from "./assets/photo-space-shiny.png";
import imgYogurtLight from "./assets/photo-yogurt.png";
import imgYogurtShiny from "./assets/photo-yogurt-shiny.png";
import imgSleepLight from "./assets/photo-sleep.png";
import imgSleepShiny from "./assets/photo-sleep-shiny.png";
import imgWaterLight from "./assets/photo-water.png";
import imgWaterShiny from "./assets/photo-water-shiny.png";
import imgPoopsLight from "./assets/photo-poops.png";
import imgPoopsShiny from "./assets/photo-poops-shiny.png";

const params = new URLSearchParams(window.location.search);
const rawName = params.get("name") ?? process.env.DEFAULT_NAME ?? "Oscar";
const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
const dob = new Date(params.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-02-20");
const pronouns = (params.get("pronouns") ?? process.env.DEFAULT_SEX ?? "m") as "m" | "f";

const styles = {
  narrative: "text-xl sm:text-2xl leading-relaxed mb-12 font-medium text-(--text-primary)",
  body: "text-lg leading-loose mb-8 text-(--text-secondary)",
  stat: "font-bold font-(--font-stat) text-(--text-primary)",
};

const BASE10 = "#22c55e";
const BASE2 = "#a855f7";

function App() {
  const [shiny, setShiny] = useState(false);
  const now = useNow();

  const time = useTimeMetrics(dob, now);
  const space = useSpaceMetrics(dob, now);
  const steps = useStepsMetrics(dob, now);
  const yogurt = useYogurtMetrics(dob, now);
  const heart = useHeartMetrics(dob, now);
  const fruit = useFruitMetrics(dob, now);
  const hugs = useHugsMetrics(dob, now);
  const lungs = useLungsMetrics(dob, now);
  const sleep = useSleepMetrics(dob, now);
  const brushing = useBrushingMetrics(dob, now);
  const water = useWaterMetrics(dob, now);
  const poops = usePoopsMetrics(dob, now);
  const hair = useHairMetrics(dob, now);
  const closing = useClosingMetrics(dob, now);

  function toggleShiny() {
    const next = !shiny;
    setShiny(next);
    document.documentElement.classList.toggle("shiny", next);
  }

  return (
    <div>
      <Nav name={name} shiny={shiny} onToggleShiny={toggleShiny} />
      <HeroCyberpunk name={name} dob={dob} shiny={shiny} />

      <section style={{ background: "var(--bg-primary)" }}>

        {/* Time — photo */}
        <PhotoSlide id="1" imgLight={imgTimeLight} imgShiny={imgTimeShiny} shiny={shiny}
          intro={`${name} is ...`}
          value={time.formattedValue}
          unit={<><InlineDropdown options={TIME_UNITS} value={time.timeUnit} onChange={time.setTimeUnit} /> old, right now</>}
        />

        {/* Time — table */}
        <Slide id="1b">
          <Headline>That is, precisely ...</Headline>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {([
                ["years",   time.values.years.toFixed(3)],
                ["months",  Math.floor(time.values.months).toLocaleString()],
                ["weeks",   Math.floor(time.values.weeks).toLocaleString()],
                ["days",    Math.floor(time.values.days).toLocaleString()],
                ["hours",   Math.floor(time.values.hours).toLocaleString()],
                ["minutes", Math.floor(time.values.minutes).toLocaleString()],
                ["seconds", Math.floor(time.values.seconds).toLocaleString()],
              ] as [string, string][]).map(([label, value]) => (
                <tr key={label} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td className="text-right font-bold py-2 pr-4"
                    style={{ fontFamily: "var(--font-stat)", fontVariantNumeric: "tabular-nums", color: "var(--text-primary)", fontSize: "clamp(1.5rem, 5vw, 2.5rem)", whiteSpace: "nowrap" }}
                    data-stat>
                    {value}
                  </td>
                  <td className="text-left py-2 pl-2" style={{ color: "var(--text-secondary)", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
                    {label} old
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Slide>

        {/* Space — photo */}
        <PhotoSlide id="2" imgLight={imgSpaceLight} imgShiny={imgSpaceShiny} shiny={shiny}
          intro={`${name} has flown ...`}
          value={`${(space.milesInSpace * space.k / 1e9).toFixed(1)} billion`}
          unit={<><InlinePills
            options={[{ value: "miles" as const, label: "miles" }, { value: "km" as const, label: "kilometers" }]}
            value={space.unit} onChange={space.setUnit}
          /> through space</>}
          headline={`${name}'s not just a kid, ${name}'s an interstellar traveler!`}
          body={<>Earth flies through our solar system at {space.orbitalSpeed.toLocaleString()} {space.unitLabel} — and {name} has been going that speed for {space.lapsAroundSun.toFixed(3)} years. But light would still win: at {space.lightSpeed.toLocaleString()} {space.unitLabel}, it'd cover that distance in just {space.lightSpeedHours.toFixed(1)} hours.</>}
        />

        {/* Steps */}
        <Slide id="4a">
          <Headline>{name} has walked ...</Headline>
          <KeyMetric>{(steps.totalSteps / 1e6).toFixed(1)} million steps</KeyMetric>
          <Unit>so far in {his(pronouns)} {steps.age} years</Unit>
          <p className={`${styles.narrative} pt-8`}>
            That is, assuming {he(pronouns)} walks{" "}
            <InlineSlider value={steps.stepsPerDay} min={2000} max={15000} step={1000} onChange={steps.setStepsPerDay} />{" "}
            steps a day since {he(pronouns)} was{" "}
            <InlineStepper value={steps.startAge} min={1} max={5} step={1} onChange={steps.setStartAge} /> years old.
          </p>
        </Slide>

        {/* Yogurt — photo */}
        <PhotoSlide id="3" imgLight={imgYogurtLight} imgShiny={imgYogurtShiny} shiny={shiny}
          objectPosition="center 30%"
          intro={`${name} has eaten ...`}
          value={yogurt.display.toLocaleString()}
          unit={<><InlinePills
            options={[{ value: "kg" as const, label: "kilograms" }, { value: "lbs" as const, label: "pounds" }]}
            value={yogurt.unit} onChange={yogurt.setUnit}
          /> of yogurt</>}
          headline={yogurt.hippoHeadline}
          body={<>Assuming {name} eats <InlineSlider value={yogurt.gramsPerDay} min={10} max={150} step={10} onChange={yogurt.setGramsPerDay} /> grams of yogurt every day, since age <InlineStepper value={yogurt.startAge} min={1} max={7} step={1} onChange={yogurt.setStartAge} /></>}
        />

        {/* Tiles — brain & body */}
        <TileContainer id="5" title={`${name}'s brain & body`}>
          <Tile id="5b" emoji="❤️"
            value={`${(heart.totalHeartbeats / 1e6).toFixed(1)} million`}
            unit="heartbeats"
            headline={`${heart.heartbeatsPerDay.toLocaleString()} beats per day`}
            body={`${name}'s heart beats about 80 times per minute — and it hasn't taken a single break since the day ${name} was born. Not one.`}
          />
          <Tile id="5c" emoji="🥦"
            value={fruit.fruitServings.toLocaleString()}
            unit="cell repair kits"
            headline="Delivered by fruits & veggies"
            body={<>Every time {name} eats fruits and vegetables, those vitamins help protect cells from damage. At{" "}
              <InlineStepper value={fruit.servingsPerDay} min={1} max={8} step={1} onChange={fruit.setServingsPerDay} />{" "}
              servings a day, {name}'s body has had plenty of supplies to work with.</>}
          />
          <Tile id="5d" emoji="🤗"
            value={hugs.totalHugs.toLocaleString()}
            unit="hugs"
            headline="Moments of connection"
            body={<>When {name} hugs someone for 10 seconds, the body releases oxytocin, which helps feel calm and safe. At{" "}
              <InlineStepper value={hugs.hugsPerDay} min={1} max={10} step={1} onChange={hugs.setHugsPerDay} />{" "}
              hugs a day, that's {hugs.totalHugs.toLocaleString()} moments of "this person matters to me."</>}
          />
          <Tile id="5e" emoji="💪"
            value={`${(lungs.lungExtraLiters / 1e6).toFixed(1)} million`}
            unit="extra liters of air"
            headline={`${name}'s lungs are getting seriously strong`}
            body={<>Every minute spent running or playing hard, the lungs pull in 40–60 liters of air, compared with 5–8 when resting. At{" "}
              <InlineStepper value={lungs.hoursPerDay} min={1} max={4} step={1} unit=" hr" onChange={lungs.setHoursPerDay} />{" "}
              of hard play per day, that's a serious workout.</>}
          />
        </TileContainer>

        {/* Sleep — photo */}
        <PhotoSlide id="5a" imgLight={imgSleepLight} imgShiny={imgSleepShiny} shiny={shiny}
          objectPosition="center 30%"
          intro={`${name}'s brain has filed ...`}
          value={sleep.sleepYears.toFixed(3)}
          unit="years of memories"
          headline={`${sleep.sleepHours.toLocaleString()} hours of sleep so far.`}
          body={<>Every night while {name} sleeps, the brain sorts through everything learned that day and files it into long-term memory — like a librarian working the night shift. Assuming{" "}
            <InlineStepper value={sleep.hoursPerNight} min={7} max={13} step={1} unit=" hrs" onChange={sleep.setHoursPerNight} />{" "}
            per night.</>}
        />

        {/* Brushing */}
        <Slide id="4b">
          <p className={styles.narrative}>
            If {name} spends <InlineStepper value={brushing.minutes} min={0} max={10} step={0.5} unit=" min" onChange={brushing.setMinutes} /> brushing
            teeth each morning and night — so <span className={styles.stat}>{brushing.minutes * 2} minutes</span> each day — that's over{" "}
            <span className={styles.stat}>{(brushing.brushStrokes / 1e6).toFixed(1)} million brush strokes*</span> so far!
          </p>
          <p className={styles.body}>
            Think that's a lot? {name}'s eyes have blinked about {(brushing.totalBlinks / 1e6).toFixed(1)} million times. Getting the reps in!
          </p>
          <p className={styles.body}>
            * assuming: <InlineStepper value={brushing.strokesPerMin} min={100} max={300} step={10} onChange={brushing.setStrokesPerMin} /> brush strokes per minute
          </p>
        </Slide>

        {/* Water — photo */}
        <PhotoSlide id="5f" imgLight={imgWaterLight} imgShiny={imgWaterShiny} shiny={shiny}
          objectPosition="center 30%"
          intro={`${name} has drunk ...`}
          value={Math.floor(water.waterLiters).toLocaleString()}
          unit="liters of water"
          headline={`That's ${water.waterPoolPercent.toFixed(1)}% of an Olympic swimming pool.`}
          body={<>An Olympic pool holds 2.5 million liters. At{" "}
            <InlineStepper value={water.glassesPerDay} min={2} max={12} step={1} onChange={water.setGlassesPerDay} />{" "}
            glasses a day, it would take {name} about {Math.floor(water.poolYearsRemaining).toLocaleString()} more years to drink the rest.</>}
        />

        {/* Hair */}
        <Slide id="4c">
          <p className={styles.narrative}>
            {name}'s hair grows about{" "}
            <InlineStepper value={hair.cmPerMonth} min={0.6} max={2.0} step={0.1} unit=" cm" onChange={hair.setCmPerMonth} />{" "}
            per month. If {name} had never had a haircut, it would now be <span className={styles.stat}>{hair.totalM.toFixed(1)} meters</span> long!
          </p>
        </Slide>

        {/* Poops — photo */}
        <PhotoSlide id="4e" imgLight={imgPoopsLight} imgShiny={imgPoopsShiny} shiny={shiny}
          objectPosition="center 30%"
          value={poops.totalPoops.toLocaleString()}
          headline="poops so far"
          body={<>Everyone poops. At{" "}
            <InlineStepper value={poops.perDay} min={0.5} max={4} step={0.5} decimals={1} onChange={poops.setPerDay} />{" "}
            poops a day, by the time you're {poops.age} years old, you'll have done around {poops.totalPoops.toLocaleString()} poops. Maybe even a cyberpunk poop.</>}
        />

        {/* Closing — binary */}
        <Slide id="7">
          <Headline lg>{closing.age} is {closing.binary} in binary.</Headline>
          <p className="text-lg mb-6" style={css.secondary}>"Binary" just means base 2.</p>
          <FlipCard
            frontColor={BASE10} backColor={BASE2}
            frontHint="tap to see base 2" backHint="tap to see base 10"
            front={<>
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: BASE10 }}>Base 10</p>
              <p className="text-sm font-medium mb-2" style={css.primary}>Humans normally write numbers in base 10.</p>
              <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside" style={css.primary}>
                <li>In base 10, there are ten numbers (0–9)</li>
                <li>Each additional digit means another power of ten: 10 → 100 → 1000</li>
                <li>Think of "{closing.age}" as meaning: {describeBase(closing.age, 10, 3)}</li>
              </ul>
            </>}
            back={<>
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: BASE2 }}>Base 2</p>
              <p className="text-sm font-medium mb-2" style={css.primary}>Computers often use binary (base 2) numbers.</p>
              <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside" style={css.primary}>
                <li>In base 2, there are only two numbers (0 and 1)</li>
                <li>Each additional digit means another power of two: 2 → 4 → 8 → 16</li>
                <li>In base 2, "{closing.binary}" means: {describeBase(closing.age, 2)}</li>
              </ul>
            </>}
          />
          <div className="mt-6">
            <p className="text-lg font-semibold mb-4" style={css.primary}>
              And {closing.age} in base₁₀ and {closing.binary} in base₂ are actually the same!
            </p>
            <div className="space-y-3 mb-6">
              <div className="text-sm" style={{ color: BASE10, fontFamily: "var(--font-stat)", fontVariantNumeric: "tabular-nums" }}>
                {expandBase(closing.age, 10, 3).map((line, i) => <p key={i}>{line}</p>)}
              </div>
              <div className="text-sm" style={{ color: BASE2, fontFamily: "var(--font-stat)", fontVariantNumeric: "tabular-nums" }}>
                {expandBase(closing.age, 2).map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
            <p className={styles.body}>
              It's like how "nine", "neuf", "nueve", and "九" all mean the same thing
              in different languages. {closing.age} and {closing.binary} are the same number in different bases.
            </p>
          </div>
          <div className="mt-10 text-center">
            <p className="text-4xl mb-4">❤️</p>
            <p className="text-2xl sm:text-3xl font-semibold leading-snug" style={css.primary}>
              We love you, we love your mind,<br />
              happy {closing.binary}{ordinalSuffix(closing.binary)} birthday {name}.
            </p>
          </div>
        </Slide>

      </section>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
