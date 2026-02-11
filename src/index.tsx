import { createRoot } from "react-dom/client";

const params = new URLSearchParams(window.location.search);
const name = params.get("name") ?? process.env.DEFAULT_NAME ?? "Birthday Star";
const dob = params.get("dob") ?? process.env.DEFAULT_DOB ?? "2017-01-01";
const sex = params.get("sex") ?? process.env.DEFAULT_SEX ?? "neutral";

function App() {
  return (
    <div className="max-w-[1024px] mx-auto">
      <Hero />
      <div className="h-dvh flex flex-col">
        <Main />
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <section className="h-dvh flex flex-col bg-amber-100">
      <nav className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-medium text-zinc-500">clockwork.cards/{name.toLowerCase()}</span>
      </nav>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 text-center px-6">
          Happy {age}th Birthday {name}
        </h1>
      </div>
    </section>
  );
}

function Main() {
  return (
    <section className="flex-1 bg-sky-100 flex items-center justify-center p-6">
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Widget label="Widget 1" />
        <Widget label="Widget 2" />
        <Widget label="Widget 3" />
      </div>
    </section>
  );
}

function Widget({ label }: { label: string }) {
  return (
    <div className="bg-emerald-200 rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
      <span className="text-lg font-semibold text-zinc-700">{label}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-zinc-100 px-6 py-4 flex items-center justify-between text-sm text-zinc-400">
      <span>&copy; 2025 clockwork.cards</span>
      <button className="text-zinc-500 border border-zinc-300 rounded-full px-3 py-1">
        ✨ Shiny
      </button>
    </footer>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
