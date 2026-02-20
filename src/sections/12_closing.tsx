import type { SectionProps } from "./types";
import { TextSlide } from "../components/page/text-slide";
import { ordinalSuffix } from "./11_binary/binary";
import { styles } from "./styles";

export function ClosingSection({ name, age }: SectionProps & { age: number }) {
  const nearestBirthdayAge = age;
  return (
    <TextSlide id="12">
      <div className="mt-10 text-center">
        <p className="text-4xl mb-4">❤️</p>
        <p className={styles.body}>
          We love you, we love your mind,
          <br />
          happy {nearestBirthdayAge}
          {ordinalSuffix(nearestBirthdayAge.toString(10))} birthday {name}.
        </p>
      </div>

    </TextSlide>
  );
}
