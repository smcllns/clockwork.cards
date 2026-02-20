import type { SectionProps } from "../types";
import { TextSlide } from "../../components/page/text-slide";
import { Stat, Lede, Subtitle } from "../../components/page/text";
import { FlipCard } from "../../components/page/flip-card";
import { expandBase, describeBase } from "./binary";
import { styles } from "../styles";

const BASE10 = "#22c55e";
const BASE2 = "#a855f7";

export function BinarySection({ age }: SectionProps & { age: number }) {
  return (
    <TextSlide id="11">
      <Stat>Did you know?</Stat>
      <Lede>
        In binary, {age} is {age.toString(2)}
      </Lede>
      <Subtitle>&ldquo;Binary&rdquo; is another name for &ldquo;base 2&rdquo;. Computers use base 2. Humans usually use base 10.</Subtitle>

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
            <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside text-(--text-primary)">
              <li>"Base 10" means there are ten numbers (0–9)</li>
              <li>When we go past 9, we add a 1 in the "tens" place, and start over: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11...</li>
              <li>Each new number means another power of ten: 10 → 100 → 1000</li>
            </ul>
            <p className="text-sm font-medium text-(--text-primary)">
              You can think of &ldquo;{age}&rdquo; in base 10 as meaning: &ldquo;{describeBase(age, 10, 3)}&rdquo;
            </p>

            {/* <div className="text-sm" style={{ color: BASE10, fontFamily: "var(--font-stat)", fontVariantNumeric: "tabular-nums" }}>
              {expandBase(age, 10, 3).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div> */}
          </>
        }
        back={
          <>
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: BASE2 }}>
              Base 2
            </p>
            <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside text-(--text-primary)">
              <li>"Base 2" means there are two numbers (0 and 1)</li>
              <li>When we go past 1, we add a 1 to the left, and start over: 0, 1, 10, 11, 100, 101, 110, 111...</li>
              <li>Each new number means another power of two: 2 → 4 → 8 → 16</li>
            </ul>
            <p className="text-sm font-medium text-(--text-primary)">
              You can think of &ldquo;{age.toString(2)}&rdquo; in base 2 as meaning: &ldquo;{describeBase(age, 2)}&rdquo;
            </p>
            {/* <div className="space-y-3 mb-6">
              <div className="text-sm" style={{ color: BASE2, fontFamily: "var(--font-stat)", fontVariantNumeric: "tabular-nums" }}>
                {expandBase(age, 2).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div> */}
          </>
        }
      />

      <p className={styles.footnote + " mt-6"}>
        So {age} in base₁₀ and {age.toString(2)} in base₂ are actually the same! It's like how "nine", "neuf", "nueve", and "九" all mean
        the same thing in different languages. {age} and {age.toString(2)} are the same number in different bases.
      </p>
    </TextSlide>
  );
}
