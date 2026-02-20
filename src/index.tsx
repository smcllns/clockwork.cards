import { preload } from "./preload";
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import useEmblaCarousel from "embla-carousel-react";
import Nav from "./components/page/nav";
import Upsell from "./components/page/upsell";
import { Card } from "./card";

const params = new URLSearchParams(window.location.search);
const rawName = params.get("name") ?? process.env.DEFAULT_NAME!;
const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
const dobStr = params.get("dob") ?? process.env.DEFAULT_DOB;
const [dobY, dobM, dobD] = dobStr!.split("-").map(Number);
const dob = new Date(dobY, dobM - 1, dobD); // local midnight, not UTC
const pronouns = (params.get("pronouns") ?? process.env.DEFAULT_SEX ?? "m") as "m" | "f";

function App() {
  const [shiny, setShiny] = useState(false);
  const [isLastSlide, setIsLastSlide] = useState(false);
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
          <Card name={name} dob={dob} pronouns={pronouns} shiny={shiny} />
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
preload().then(() => root.render(<App />));

if (import.meta.hot) {
  import.meta.hot.accept();
}
