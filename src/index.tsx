import { useState } from "react";
import { createRoot } from "react-dom/client";
import Nav from "./sections/nav";
import HeroCyberpunk from "./sections/hero-cyberpunk";
import TimeCard from "./sections/time";
import TimeTableCard from "./sections/time-table";
import SpaceCard from "./sections/space";
import YogurtCard from "./sections/yogurt";
import LifeInNumbersCard from "./sections/life-in-numbers";
import BrainBodyCard from "./sections/brain-body";
import BinaryCard from "./sections/binary";
import Footer from "./sections/footer";

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
        <LifeInNumbersCard dob={dob} name={name} />
        <BrainBodyCard dob={dob} name={name} />
        <BinaryCard dob={dob} name={name} />
      </section>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
