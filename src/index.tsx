import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import useEmblaCarousel from "embla-carousel-react";
import { useNow } from "./lib/useNow";
import Nav from "./components/page/nav";
import {
  useTimeMetrics, useSpaceMetrics, useStepsMetrics, useYogurtMetrics,
  useHeartMetrics, useFruitMetrics, useHugsMetrics, useLungsMetrics,
  useSleepMetrics, useBrushingMetrics, useWaterMetrics, usePoopsMetrics,
  useHairMetrics, useClosingMetrics,
} from "./hooks";
import { HeroSection } from "./sections/00_hero";
import { TimeSection } from "./sections/01_time";
import { SpaceSection } from "./sections/02_space";
import { StepsSection } from "./sections/03_steps";
import { YogurtSection } from "./sections/04_yogurt";
import { TilesHealthSection } from "./sections/05_tiles_health";
import { SleepSection } from "./sections/06_sleep";
import { BrushingSection } from "./sections/07_brushing";
import { WaterSection } from "./sections/08_water";
import { HairSection } from "./sections/09_hair";
import { PoopsSection } from "./sections/10_poops";
import { ClosingSection } from "./sections/11_closing";

const params = new URLSearchParams(window.location.search);
const rawName = params.get("name") ?? process.env.DEFAULT_NAME ?? "Oscar";
const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
const dob = new Date(params.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-02-20");
const pronouns = (params.get("pronouns") ?? process.env.DEFAULT_SEX ?? "m") as "m" | "f";

function App() {
  const [shiny, setShiny] = useState(false);
  const now = useNow();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y", watchResize: true, dragFree: false,
    // Don't intercept mouse drags on the Three.js canvas — let ball interaction work.
    // Touch drags are always passed through so mobile swiping still works on all slides.
    watchDrag: (_api, evt) => !(evt instanceof MouseEvent && evt.target instanceof HTMLCanvasElement),
  });

  useEffect(() => {
    if (!emblaApi) return;
    let locked = false;
    let quietTimer: ReturnType<typeof setTimeout> | null = null;

    const unlock = () => { locked = false; quietTimer = null; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const abs = Math.abs(e.deltaY);

      if (locked) {
        // Trackpad inertia decays to near-zero — unlock as soon as it dies
        if (abs < 5) unlock();
        // Mouse wheel (no decay): reset quiet timer, unlock 200ms after events stop
        else { if (quietTimer) clearTimeout(quietTimer); quietTimer = setTimeout(unlock, 200); }
        return;
      }

      // Hysteresis: require abs >= 15 to start a scroll (avoids re-triggering on residual inertia after unlock)
      if (abs < 15) return;
      locked = true;
      if (e.deltaY > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    };

    const el = emblaApi.rootNode();
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("wheel", onWheel); if (quietTimer) clearTimeout(quietTimer); };
  }, [emblaApi]);

  const time    = useTimeMetrics(dob, now);
  const space   = useSpaceMetrics(dob, now);
  const steps   = useStepsMetrics(dob, now);
  const yogurt  = useYogurtMetrics(dob, now);
  const heart   = useHeartMetrics(dob, now);
  const fruit   = useFruitMetrics(dob, now);
  const hugs    = useHugsMetrics(dob, now);
  const lungs   = useLungsMetrics(dob, now);
  const sleep   = useSleepMetrics(dob, now);
  const brushing = useBrushingMetrics(dob, now);
  const water   = useWaterMetrics(dob, now);
  const poops   = usePoopsMetrics(dob, now);
  const hair    = useHairMetrics(dob, now);
  const closing = useClosingMetrics(dob, now);

  function toggleShiny() {
    const next = !shiny;
    setShiny(next);
    document.documentElement.classList.toggle("shiny", next);
  }

  return (
    <div>
      <Nav name={name} shiny={shiny} onToggleShiny={toggleShiny} />
      {/* svh (not dvh): Embla scrolls via CSS transform, never native scroll, so Safari's address bar never collapses */}
      <div ref={emblaRef} style={{ height: "100svh", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100svh" }}>
          <HeroSection         name={name}     dob={dob} shiny={shiny} />
          <TimeSection         name={name}     shiny={shiny} time={time} />
          <SpaceSection        name={name}     shiny={shiny} space={space} />
          <StepsSection        name={name}     pronouns={pronouns} steps={steps} />
          <YogurtSection       name={name}     shiny={shiny} yogurt={yogurt} />
          <TilesHealthSection  name={name}     heart={heart} fruit={fruit} hugs={hugs} lungs={lungs} />
          <SleepSection        name={name}     shiny={shiny} sleep={sleep} />
          <BrushingSection     name={name}     brushing={brushing} />
          <WaterSection        name={name}     shiny={shiny} water={water} />
          <HairSection         name={name}     hair={hair} />
          <PoopsSection                        shiny={shiny} poops={poops} />
          <ClosingSection      name={name}     closing={closing} />
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
