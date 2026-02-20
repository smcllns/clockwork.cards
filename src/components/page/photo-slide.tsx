import { IdTag } from "./section";

type PhotoSlideProps = {
  id: string;
  imgLight: string;
  imgShiny: string;
  shiny: boolean;
  gradient?: string;
  objectPosition?: string;
  children: React.ReactNode;
};

const DEFAULT_GRADIENT = "linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.9) 100%)";

export function PhotoSlide({ id, imgLight, imgShiny, shiny, gradient, objectPosition, children }: PhotoSlideProps) {
  const imgStyle = objectPosition ? { objectPosition } : undefined;

  return (
    <div
      className="relative snap-section flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      <img
        src={imgLight}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ ...imgStyle, opacity: shiny ? 0 : 1 }}
        loading="lazy"
      />
      <img
        src={imgShiny}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ ...imgStyle, opacity: shiny ? 1 : 0 }}
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{ background: gradient ?? DEFAULT_GRADIENT }}
      />
      <div className="absolute top-14 right-6 z-10"><IdTag id={id} /></div>

      <div
        data-photo
        className="relative z-10 px-6 pt-8 max-w-2xl mx-auto w-full"
        style={{ paddingBottom: "calc(var(--nav-height, 48px) + 24px)" }}
      >
        {children}
      </div>
    </div>
  );
}
