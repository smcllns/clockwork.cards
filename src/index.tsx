import { useState } from "react";
import { createRoot } from "react-dom/client";
import Nav from "./components/nav";
import HeroCyberpunk from "./cards/hero-cyberpunk";
import TimeCard from "./cards/slide-time";
import TimeTableCard from "./cards/slide-time-table";
import SpaceCard from "./cards/slide-space";
import YogurtCard from "./cards/slide-yogurt";
import StepsCard from "./cards/slide-steps";
import BrushingCard from "./cards/slide-brushing";
import PoopsCard from "./cards/slide-poops";
import { TileContainer } from "./components/tile";
import SleepTile from "./cards/tile-sleep";
import HeartbeatsTile from "./cards/tile-heartbeats";
import FruitTile from "./cards/tile-fruit";
import HugsTile from "./cards/tile-hugs";
import LungsTile from "./cards/tile-lungs";
import WaterTile from "./cards/tile-water";
import Footer from "./components/footer";

const params = new URLSearchParams(window.location.search);
const name = params.get("name") ?? process.env.DEFAULT_NAME ?? "Oscar";
const dob = params.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-02-20";

function App() {
  const [shiny, setShiny] = useState(false);

  function toggleShiny() {
    const next = !shiny;
    setShiny(next);
    document.documentElement.classList.toggle("shiny", next);
  }

  return (
    <div>
      <Nav name={name} shiny={shiny} onToggleShiny={toggleShiny} />
      <HeroCyberpunk name={name} dob={dob} shiny={shiny} />
      <section style={{ background: "var(--bg-primary)" }}>
        <TimeCard dob={dob} name={name} />
        <TimeTableCard dob={dob} name={name} />
        <SpaceCard dob={dob} name={name} />
        <YogurtCard dob={dob} name={name} />
        <StepsCard dob={dob} name={name} />
        <BrushingCard dob={dob} />
        <PoopsCard dob={dob} />
        <TileContainer id="5" title="Your brain &amp; body">
          <SleepTile dob={dob} />
          <HeartbeatsTile dob={dob} />
          <FruitTile dob={dob} />
          <HugsTile dob={dob} />
          <LungsTile dob={dob} />
          <WaterTile dob={dob} />
        </TileContainer>
      </section>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
