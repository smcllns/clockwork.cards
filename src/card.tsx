import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useNow } from "./metrics";
import Nav from "./components/page/nav";
import Upsell from "./components/page/upsell";
import {
  useAgeMetrics,
  useTimeMetrics,
  useSpaceMetrics,
  useStepsMetrics,
  useYogurtMetrics,
  useHeartMetrics,
  useFruitMetrics,
  useHugsMetrics,
  useLungsMetrics,
  useSleepMetrics,
  useBrushingMetrics,
  useWaterMetrics,
  usePoopsMetrics,
  useHairMetrics,
} from "./metrics";
import { HeroSection } from "./sections/00_hero";
import { TimeSection } from "./sections/01_time";
import { TimeTableSection } from "./sections/01b_time_table";
import { SpaceSection } from "./sections/02_space";
import { StepsSection } from "./sections/03_steps";
import { YogurtSection } from "./sections/04_yogurt";
import { TilesHealthSection } from "./sections/05_tiles_health";
import { SleepSection } from "./sections/06_sleep";
import { BrushingSection } from "./sections/07_brushing";
import { WaterSection } from "./sections/08_water";
import { HairSection } from "./sections/09_hair";
import { PoopsSection } from "./sections/10_poops";
import { BinarySection } from "./sections/11_binary";
import { ClosingSection } from "./sections/12_closing";

type CardProps = {
  name: string;
  dob: Date;
  pronouns: "m" | "f";
};

export function Card({ name, dob, pronouns }: CardProps) {
  const [shiny, setShiny] = useState(false);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const now = useNow();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    watchResize: true,
    dragFree: false,
    // Don't intercept mouse drags on the Three.js canvas — let ball interaction work.
    // Touch drags are always passed through so mobile swiping still works on all slides.
    watchDrag: (_api, evt) => !(evt instanceof MouseEvent && evt.target instanceof HTMLCanvasElement),
  });

  useEffect(() => {
    if (!emblaApi) return;
    let locked = false;
    let quietTimer: ReturnType<typeof setTimeout> | null = null;

    const unlock = () => {
      locked = false;
      quietTimer = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const abs = Math.abs(e.deltaY);

      if (locked) {
        // Trackpad inertia decays to near-zero — unlock as soon as it dies
        if (abs < 5) unlock();
        // Mouse wheel (no decay): reset quiet timer, unlock 200ms after events stop
        else {
          if (quietTimer) clearTimeout(quietTimer);
          quietTimer = setTimeout(unlock, 200);
        }
        return;
      }

      // Hysteresis: require abs >= 15 to start a scroll (avoids re-triggering on residual inertia after unlock)
      if (abs < 15) return;
      locked = true;
      if (e.deltaY > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        emblaApi.scrollNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        emblaApi.scrollPrev();
      }
    };

    const onSelect = () => setIsLastSlide(emblaApi.selectedScrollSnap() === emblaApi.scrollSnapList().length - 1);
    emblaApi.on("select", onSelect);

    const el = emblaApi.rootNode();
    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      if (quietTimer) clearTimeout(quietTimer);
    };
  }, [emblaApi]);

  const age = useAgeMetrics(dob, now);
  const time = useTimeMetrics(dob, now);
  const space = useSpaceMetrics(dob, now);
  const steps = useStepsMetrics(dob, now);
  const yogurt = useYogurtMetrics(dob, now);
  const heart = useHeartMetrics(dob, now);
  const fruit = useFruitMetrics(dob, now);
  const hugs = useHugsMetrics(dob, now);
  const lungs = useLungsMetrics(dob, now);
  const sleep = useSleepMetrics(dob, now);
  const brushing = useBrushingMetrics(dob, now);
  const water = useWaterMetrics(dob, now);
  const poops = usePoopsMetrics(dob, now);
  const hair = useHairMetrics(dob, now);

  function toggleShiny() {
    const next = !shiny;
    setShiny(next);
    document.documentElement.classList.toggle("shiny", next);
  }

  return (
    <div>
      {isLastSlide ? <Upsell shiny={shiny} /> : <Nav name={name} shiny={shiny} onToggleShiny={toggleShiny} />}
      {/* svh (not dvh): Embla scrolls via CSS transform, never native scroll, so Safari's address bar never collapses */}
      <div ref={emblaRef} style={{ height: "100svh", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100svh" }}>
          <HeroSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} />
          <TimeSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} time={time} />
          <TimeTableSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} time={time} />
          <SpaceSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} space={space} />
          <StepsSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} steps={steps} age={age.decimal2} />
          <YogurtSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} yogurt={yogurt} />
          <BrushingSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} brushing={brushing} />
          <WaterSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} water={water} />
          <BinarySection name={name} dob={dob} pronouns={pronouns} shiny={shiny} age={age.floor} />
          <PoopsSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} poops={poops} age={age.decimal2} />
          <ClosingSection name={name} dob={dob} pronouns={pronouns} shiny={shiny} age={age.rounded} />
        </div>
      </div>
    </div>
  );
}
