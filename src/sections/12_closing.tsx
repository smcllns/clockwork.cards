import type { useClosingMetrics } from "../hooks";
import type { SectionProps } from "./types";
import { Slide } from "../components/page/slide";
import { css } from "../components/page/section";
import { ordinalSuffix } from "../components/content/binary";

type Props = SectionProps & { closing: ReturnType<typeof useClosingMetrics> };

export function ClosingSection({ name, closing }: Props) {
  return (
    <Slide id="12">
      <div className="mt-10 text-center">
        <p className="text-4xl mb-4">❤️</p>
        <p className="text-2xl sm:text-3xl font-semibold leading-snug" style={css.primary}>
          We love you, we love your mind,<br />
          happy {closing.binary}{ordinalSuffix(closing.binary)} birthday {name}.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-6" style={{ paddingBottom: "calc(var(--nav-height, 48px) + 1.5rem)" }}>
        <div className="flex flex-col items-center gap-2 text-center px-6">
          <p className="text-sm font-medium" style={css.secondary}>
            Know a kid who'd love their own clockwork card?
          </p>
          <a
            href="https://clockwork.cards"
            className="text-sm font-semibold underline underline-offset-2"
            style={{ color: "var(--text-accent)" }}
          >
            clockwork.cards — make one for someone you love →
          </a>
        </div>
      </div>
    </Slide>
  );
}
