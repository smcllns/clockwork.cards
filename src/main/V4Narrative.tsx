import { Stats, fmt, fmtBig, fmtDecimal } from "./stats";

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

export default function V4Narrative({ stats: s, name }: { stats: Stats; name: string }) {
  return (
    <div className="px-6 py-12 max-w-2xl mx-auto">
      <article
        className="space-y-8 text-base leading-relaxed"
        style={{ color: "var(--text-primary)" }}
      >
        {/* Time & Space */}
        <section>
          <p>
            That's <N>{fmt(s.daysAlive)}</N> days of being awesome. Or{" "}
            <N>{fmt(s.hoursAlive)}</N> hours. Or <N>{fmt(s.minutesAlive)}</N>{" "}
            minutes. Or <N>{fmt(s.secondsAlive)}</N> seconds — and counting.
          </p>
        </section>

        <section>
          <p>
            That's <N>{s.lapsAroundSun}</N> laps around the sun. And since Earth
            moves at 67,000 mph, you've traveled
          </p>
          <BigN>{fmtBig(s.milesInSpace)} miles</BigN>
          <p>
            through space so far. You're not just a kid — you're an interstellar
            traveler. Though let's be real, light would still whoop you in a race:
            at 669,600,000 mph, it would cover that distance in just{" "}
            <N>{fmtDecimal(s.lightSpeedHours)}</N> hours.
          </p>
        </section>

        {/* Divider */}
        <hr style={{ borderColor: "var(--border-color)" }} />

        {/* Life in Numbers */}
        <section>
          <h3
            className="text-sm font-semibold uppercase tracking-[0.15em] mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Your life in numbers
          </h3>

          <p>
            If you've eaten 50g of yogurt every day since you were 4, that's about{" "}
            <N>{fmt(s.yogurtKg)} kg</N> — roughly the weight of a baby hippo.
          </p>

          <p className="mt-4">
            If you've walked 8,000 steps a day since you were 3, you've taken about{" "}
            <N>{fmtBig(s.totalSteps)} steps</N> in your life so far.
          </p>

          <p className="mt-4">
            If you spend 2 minutes brushing your teeth every morning and night since
            age 3, you've spent over <N>{fmtDecimal(s.brushingDays)} solid days</N>{" "}
            brushing, and done over <N>{fmtBig(s.brushStrokes)} brush strokes</N>!
          </p>

          <p className="mt-4">
            Think that's a lot? You've blinked about{" "}
            <N>{fmtBig(s.totalBlinks)} times</N> so far.
          </p>

          <p className="mt-4">
            Your hair grows about 1.2 cm per month. If you'd never had a haircut,
            your hair would now be about{" "}
            <N>{fmtDecimal(s.hairLengthCm / 100)} meters</N> long!
          </p>

          <p className="mt-4">
            If you poop 1.5 times per day on average, you've pooped around{" "}
            <N>{fmt(s.totalPoops)} times</N> so far.
          </p>
        </section>

        {/* Divider */}
        <hr style={{ borderColor: "var(--border-color)" }} />

        {/* Brain & Body */}
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
            working the night shift. If you sleep 10 hours a night, your brain has
            had about <N>{fmt(s.sleepHours)} hours</N> of filing time. That's almost{" "}
            <N>{fmtDecimal(s.sleepYears)} years</N> of a tiny librarian organizing
            your entire life so far.
          </p>

          <p className="mt-4">
            Every time you eat fruits and vegetables, you're getting vitamins that
            help protect your cells. If you eat 3 servings a day, you've delivered
            about <N>{fmt(s.fruitServings)} "repair kits"</N> to your cells since
            you were born.
          </p>

          <p className="mt-4">
            If you hug someone for 10 seconds, your body releases oxytocin, which
            helps you feel calm and safe. If you've given about 2 hugs a day since
            you were born, that's roughly <N>{fmt(s.totalHugs)} moments</N> where
            your body is quietly saying: "This person matters to me."
          </p>

          <p className="mt-4">
            Every minute you spend running or playing hard, your lungs pull in 40–60
            liters of air, compared with 5–8 when resting. If you play hard for 1
            hour a day, your lungs have handled around{" "}
            <N>{fmtBig(s.lungExtraLiters)} extra liters</N> of air. Running around
            isn't just fun — it's a workout for your lungs, and yours are getting
            seriously strong.
          </p>

          <p className="mt-4">
            If you drink about 6 glasses of water a day, you've drunk roughly{" "}
            <N>{fmt(s.waterLiters)} liters</N> in your life. That sounds like a
            lot — but an Olympic swimming pool holds 2.5 million liters, so you've
            only drunk <N>{fmtDecimal(s.waterPoolPercent)}%</N> of one. At this
            rate, it would take you about{" "}
            <N>{fmt(s.poolYearsRemaining)} more years</N> to drink the rest of the
            pool.
          </p>
        </section>
      </article>
    </div>
  );
}
