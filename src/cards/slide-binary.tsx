import { Slide, Headline, Body, css } from "../components/slide";
import { FlipCard } from "../components/flip-card";
import { useNow } from "../components/useNow";
import { getAge } from "../utils";

export default function BinaryCard({ dob, name }: { dob: string; name: string }) {
  const now = useNow();
  const ageYears = Math.floor(getAge(new Date(dob), now));

  return (
    <Slide id="6">
      <Headline>One more thing (hard math! See if you can work it out)</Headline>

      <p className="text-xl font-semibold mb-8" style={css.primary}>
        In binary, {ageYears} is{" "}
        <span style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }} data-stat>1001</span>.
      </p>

      <Body>
        "Binary" is what computers use — it just means base 2. Humans write numbers in base 10,
        where digits grow in powers of ten: 10 → 100 → 1000. Binary is the same idea but
        with powers of 2: 2 → 4 → 8 → 16.
      </Body>

      <FlipCard
        front={
          <>
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
          </>
        }
        back={
          <>
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
          </>
        }
      />

      <Body>
        Any problem you can solve in base 10, you can also solve in base 2 — or base 3, or any base.
        You're just writing the numbers differently. It's like how "nine", "neuf", "nueve", and "九"
        all mean the same thing in different languages. {ageYears} and 1001 are the same number in different bases.
      </Body>

      <div className="pt-8 border-t text-center" style={{ borderColor: "var(--border-color)" }}>
        <p className="text-4xl mb-6">❤️</p>
        <p className="text-2xl sm:text-3xl font-semibold leading-snug" style={css.primary}>
          We love you, we love your mind,<br />
          happy 1001st birthday {name}.
        </p>
      </div>
    </Slide>
  );
}
