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
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", watchResize: true, dragFree: false });

  useEffect(() => {
    if (!emblaApi) return;
    let cooldown = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown) return;
      cooldown = true;
      if (e.deltaY > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
      setTimeout(() => { cooldown = false; }, 800);
    };
    const el = emblaApi.rootNode();
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
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
      <div ref={emblaRef} style={{ height: "100dvh", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
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
