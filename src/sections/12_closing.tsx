import type { SectionProps } from "./types";
import { Slide } from "../components/page/slide";
import { css } from "../components/page/section";
import { ordinalSuffix } from "../components/content/binary";
import { getAge } from "../lib/utils";

export function ClosingSection({ name, dob }: SectionProps) {
  const nearestBirthdayAge = Math.round(getAge(dob, Date.now()));
  return (
    <Slide id="12">
      <div className="mt-10 text-center">
        <p className="text-4xl mb-4">❤️</p>
        <p className="text-2xl sm:text-3xl font-semibold leading-snug" style={css.primary}>
          We love you, we love your mind,
          <br />
          happy {nearestBirthdayAge}
          {ordinalSuffix(nearestBirthdayAge.toString(10))} birthday {name}.
        </p>
      </div>

    </Slide>
  );
}
