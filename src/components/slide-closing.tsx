import { Slide, Headline, Body } from "./slide";
import { FlipCard } from "./flip-card";
import { css } from "./section";
import { useNow } from "./useNow";
import { getAge } from "../lib/utils";
import { expandBase, describeBase, ordinalSuffix } from "./binary";

const BASE10 = "#22c55e";
const BASE2 = "#a855f7";

export default function ClosingCard({ dob, name }: { dob: Date; name: string }) {
  const now = useNow();
  const age = Math.floor(getAge(dob, now));
  const binary = age.toString(2);

  return (
    <Slide id="7">
      <Headline lg>{age} is {binary} in binary.</Headline>

      <p className="text-lg mb-6" style={css.secondary}>
        "Binary" just means base 2.
      </p>

      <FlipCard
        frontColor={BASE10}
        backColor={BASE2}
        frontHint="tap to see base 2"
        backHint="tap to see base 10"
        front={
          <>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: BASE10 }}>
              Base 10
            </p>
            <p className="text-sm font-medium mb-2" style={css.primary}>Humans normally write numbers in base 10.</p>
            <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside" style={css.primary}>
              <li>In base 10, there are ten numbers (0–9)</li>
              <li>Each additional digit means another power of ten: 10 → 100 → 1000</li>
              <li>Think of "{age}" as meaning: {describeBase(age, 10, 3)}</li>
            </ul>
          </>
        }
        back={
          <>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: BASE2 }}>
              Base 2
            </p>
            <p className="text-sm font-medium mb-2" style={css.primary}>Computers often use binary (base 2) numbers.</p>
            <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside" style={css.primary}>
              <li>In base 2, there are only two numbers (0 and 1)</li>
              <li>Each additional digit means another power of two: 2 → 4 → 8 → 16</li>
              <li>In base 2, "{binary}" means: {describeBase(age, 2)}</li>
            </ul>
          </>
        }
      />

      <div className="mt-6">
        <p className="text-lg font-semibold mb-4" style={css.primary}>
          And {age} in base₁₀ and {binary} in base₂ are actually the same!
        </p>

        <div className="space-y-3 mb-6">
          <div className="text-sm" style={{ color: BASE10, fontFamily: "var(--font-stat)", fontVariantNumeric: "tabular-nums" }}>
            {expandBase(age, 10, 3).map((line, i) => <p key={i}>{line}</p>)}
          </div>
          <div className="text-sm" style={{ color: BASE2, fontFamily: "var(--font-stat)", fontVariantNumeric: "tabular-nums" }}>
            {expandBase(age, 2).map((line, i) => <p key={i}>{line}</p>)}
          </div>
        </div>

        <Body>
          It's like how "nine", "neuf", "nueve", and "九" all mean the same thing
          in different languages. {age} and {binary} are the same number in different bases.
        </Body>
      </div>

      <div className="mt-10 text-center">
        <p className="text-4xl mb-4">❤️</p>
        <p className="text-2xl sm:text-3xl font-semibold leading-snug" style={css.primary}>
          We love you, we love your mind,<br />
          happy {binary}{ordinalSuffix(binary)} birthday {name}.
        </p>
      </div>
    </Slide>
  );
}
