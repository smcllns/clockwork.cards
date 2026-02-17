import { useState } from "react";
import { createRoot } from "react-dom/client";
import Nav from "./components/nav";
import HeroCyberpunk from "./cards/hero-cyberpunk";
import TimeCard from "./cards/slide-time";
import TimeTableCard from "./cards/slide-time-table";
import SpaceCard from "./cards/slide-space";
import YogurtCard from "./cards/slide-yogurt";
import YogurtPhoto from "./cards/photo-yogurt";
import TimePhoto from "./cards/photo-time";
import SpacePhoto from "./cards/photo-space";
import StepsCard from "./cards/slide-steps";
import BrushingCard from "./cards/slide-brushing";
import PoopsCard from "./cards/slide-poops";
import SleepPhoto from "./cards/photo-sleep";
import SleepPhotoAlt from "./cards/photo-sleep-alt";
import WaterPhoto from "./cards/photo-water";
import PoopsPhoto from "./cards/photo-poops";
import { TileContainer } from "./components/tile";
import HeartbeatsTile from "./cards/tile-heartbeats";
import FruitTile from "./cards/tile-fruit";
import HugsTile from "./cards/tile-hugs";
import LungsTile from "./cards/tile-lungs";
import HairCard from "./cards/slide-hair";
import ClosingCard from "./cards/slide-closing";
import Footer from "./components/footer";

const params = new URLSearchParams(window.location.search);
const rawName = params.get("name") ?? process.env.DEFAULT_NAME ?? "Oscar";
const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
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
        <TimePhoto dob={dob} name={name} shiny={shiny} />
        <TimeTableCard dob={dob} name={name} />
        <SpacePhoto dob={dob} name={name} shiny={shiny} />
        <StepsCard dob={dob} name={name} />
        <YogurtPhoto dob={dob} name={name} shiny={shiny} />
        <TileContainer id="5" title={`${name}'s brain & body`}>
          <HeartbeatsTile dob={dob} name={name} />
          <FruitTile dob={dob} name={name} />
          <HugsTile dob={dob} name={name} />
          <LungsTile dob={dob} name={name} />
        </TileContainer>
        <SleepPhoto dob={dob} name={name} shiny={shiny} />
        <SleepPhotoAlt dob={dob} name={name} shiny={shiny} />
        <BrushingCard dob={dob} name={name} />
        <WaterPhoto dob={dob} name={name} shiny={shiny} />
        <HairCard dob={dob} name={name} />
        <PoopsPhoto dob={dob} shiny={shiny} />
        <ClosingCard dob={dob} name={name} />
      </section>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
