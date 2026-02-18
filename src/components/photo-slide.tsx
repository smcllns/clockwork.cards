import { IdTag } from "./page/section";

type PhotoSlideProps = {
  id: string;
  imgLight: string;
  imgShiny: string;
  shiny: boolean;
  gradient?: string;
  objectPosition?: string;
} & (
  | { intro?: string; value: string; unit?: React.ReactNode; headline?: React.ReactNode; body?: React.ReactNode; children?: never }
  | { intro?: never; value?: never; unit?: never; headline?: never; body?: never; children: React.ReactNode }
);

const DEFAULT_GRADIENT = "linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.9) 100%)";

export function PhotoSlide({ id, imgLight, imgShiny, shiny, gradient, objectPosition, children, ...data }: PhotoSlideProps) {
  const imgStyle = objectPosition ? { objectPosition } : undefined;

  return (
    <div
      className="relative snap-section flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      <img
        src={imgLight}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ ...imgStyle, opacity: shiny ? 0 : 1 }}
      />
      <img
        src={imgShiny}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ ...imgStyle, opacity: shiny ? 1 : 0 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: gradient ?? DEFAULT_GRADIENT }}
      />
      <div className="absolute top-14 right-6 z-10"><IdTag id={id} /></div>

      <div className="relative z-10 px-6 pb-16 pt-8 max-w-2xl mx-auto w-full">
        {children ?? (
          <>
            {data.intro && <p className="text-xl font-medium mb-2 text-white/70">{data.intro}</p>}
            <div className="mb-2">
              <span
                className="font-bold leading-none text-white"
                style={{ fontFamily: "var(--font-stat)", fontSize: "clamp(4rem, 12vw, 6rem)" }}
                data-stat
              >
                {data.value}
              </span>
            </div>
            {data.unit && <p className="text-2xl font-medium mb-8 text-white/70">{data.unit}</p>}
            {data.headline && <p className="text-2xl font-semibold mb-6 text-white">{data.headline}</p>}
            {data.body && <p className="text-xl leading-loose text-white/60">{data.body}</p>}
          </>
        )}
      </div>
    </div>
  );
}
