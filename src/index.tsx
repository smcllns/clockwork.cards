import { createRoot } from "react-dom/client";
import Hero from "./hero";
import Main from "./main";
import Footer from "./footer";

const params = new URLSearchParams(window.location.search);
const name = params.get("name") ?? process.env.DEFAULT_NAME ?? "Birthday Star";
const dob = params.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-01-01";
const hero = params.get("hero") ?? "a";

function App() {
  return (
    <div className="max-w-[1024px] mx-auto">
      <Hero name={name} dob={dob} approach={hero} />
      <Main name={name} dob={dob} />
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept();
}
