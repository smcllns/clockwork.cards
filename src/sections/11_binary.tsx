import type { SectionProps } from "./types";
import { Slide, Stat } from "../components/page/slide";
import { FlipCard } from "../components/page/flip-card";
import { expandBase, describeBase } from "../components/content/binary";
import { styles } from "./styles";

const BASE10 = "#22c55e";
const BASE2 = "#a855f7";

export function BinarySection({ age }: SectionProps & { age: number }) {
  const binary = age.toString(2);
  return (
    <Slide id="11">
      <Stat lg>{age} is {binary} in binary.</Stat>
      <p className="text-lg mb-6 text-(--text-secondary)">"Binary" just means base 2.</p>

      <FlipCard
        frontColor={BASE10} backColor={BASE2}
        frontHint="tap to see base 2" backHint="tap to see base 10"
        front={<>
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: BASE10 }}>Base 10</p>
          <p className="text-sm font-medium mb-2 text-(--text-primary)">Humans normally write numbers in base 10.</p>
          <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside text-(--text-primary)">
            <li>In base 10, there are ten numbers (0–9)</li>
            <li>Each additional digit means another power of ten: 10 → 100 → 1000</li>
            <li>Think of "{age}" as meaning: {describeBase(age, 10, 3)}</li>
          </ul>
        </>}
        back={<>
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: BASE2 }}>Base 2</p>
          <p className="text-sm font-medium mb-2 text-(--text-primary)">Computers often use binary (base 2) numbers.</p>
          <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside text-(--text-primary)">
            <li>In base 2, there are only two numbers (0 and 1)</li>
            <li>Each additional digit means another power of two: 2 → 4 → 8 → 16</li>
            <li>In base 2, "{binary}" means: {describeBase(age, 2)}</li>
          </ul>
        </>}
      />

      <div className="mt-6">
        <p className="text-lg font-semibold mb-4 text-(--text-primary)">
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
        <p className={styles.footnote}>
          It's like how "nine", "neuf", "nueve", and "九" all mean the same thing
          in different languages. {age} and {binary} are the same number in different bases.
        </p>
      </div>
    </Slide>
  );
}
