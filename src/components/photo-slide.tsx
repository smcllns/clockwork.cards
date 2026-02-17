import { IdTag } from "./section";

interface PhotoSlideProps {
  id: string;
  imgLight: string;
  imgShiny: string;
  shiny: boolean;
  children: React.ReactNode;
  gradient?: string;
  objectPosition?: string;
}

const DEFAULT_GRADIENT = "linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.9) 100%)";

export function PhotoSlide({ id, imgLight, imgShiny, shiny, children, gradient, objectPosition }: PhotoSlideProps) {
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

      <div className="relative z-10 px-6 pb-16 pt-8 max-w-xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
