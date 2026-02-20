import type { SectionProps } from "./types";
import { Slide } from "../components/page/slide";
import { ordinalSuffix } from "../components/content/binary";

export function ClosingSection({ name, age }: SectionProps & { age: number }) {
  const nearestBirthdayAge = age;
  return (
    <Slide id="12">
      <div className="mt-10 text-center">
        <p className="text-4xl mb-4">❤️</p>
        <p className="text-2xl sm:text-3xl font-semibold leading-snug text-(--text-primary)">
          We love you, we love your mind,
          <br />
          happy {nearestBirthdayAge}
          {ordinalSuffix(nearestBirthdayAge.toString(10))} birthday {name}.
        </p>
      </div>

    </Slide>
  );
}
