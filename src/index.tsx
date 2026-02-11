import { createRoot } from "react-dom/client";

const params = new URLSearchParams(window.location.search);
const name = params.get("name") ?? process.env.DEFAULT_NAME ?? "Birthday Star";
const dob = params.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-01-01";
const sex = params.get("sex") ?? process.env.DEFAULT_SEX ?? "neutral";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold">{name} — {dob}</h1>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
