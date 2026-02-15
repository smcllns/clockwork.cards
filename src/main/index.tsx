import { useState, useEffect } from "react";
import { useStats } from "./stats";
import CuratedMain from "./CuratedMain";
import V1CompactGrid from "./V1CompactGrid";
import V2Magazine from "./V2Magazine";
import V3BentoBox from "./V3BentoBox";
import V4Narrative from "./V4Narrative";
import V5Ticker from "./V5Ticker";
import V6InteractiveNarrative from "./V6InteractiveNarrative";
import V7RichBento from "./V7RichBento";
import V8FullViewport from "./V8FullViewport";

// ── Section label for explore page ─────────────────────────────────
function SectionLabel({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div
      className="px-6 py-8 border-b"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: "var(--text-accent)" }}>
        Variation {number}
      </p>
      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      <p className="text-sm max-w-lg" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
    </div>
  );
}

// ── Explore page (all V1-V8 variations) ────────────────────────────
function ExploreMain({ name, dob }: { name: string; dob: string }) {
  const stats = useStats(dob);

  return (
    <section style={{ background: "var(--bg-primary)" }}>
      <SectionLabel number={1} title="Compact Grid"
        description="Uniform cards in a responsive grid. Each card: emoji, big number, label, one-line context. Clean and scannable." />
      <V1CompactGrid stats={stats} name={name} />

      <SectionLabel number={2} title="Magazine / Editorial"
        description="Full-width horizontal layout. Large number left-aligned, explanation text right. Generous whitespace, reads like a high-end infographic." />
      <V2Magazine stats={stats} />

      <SectionLabel number={3} title="Bento Box"
        description="Mixed-size tiles in a CSS grid. Featured stats get wider tiles. Creates visual hierarchy — modern, app-like." />
      <V3BentoBox stats={stats} />

      <SectionLabel number={4} title="Narrative Scroll"
        description="Story-style flow. Numbers are inline with prose — reads like the actual content doc. For a more personal, book-like feel." />
      <V4Narrative stats={stats} name={name} />

      <SectionLabel number={5} title="Ticker / Ledger"
        description="Clean tabular list. Label left, number right. Dense but readable — like a receipt or data printout." />
      <V5Ticker stats={stats} />

      <SectionLabel number={6} title="Interactive Narrative"
        description="Riff on V4 — the prose from the content spec, but every [bracketed] input becomes a playful inline control. Change the inputs and watch the numbers update in real time." />
      <V6InteractiveNarrative dob={dob} name={name} />

      <SectionLabel number={7} title="Rich Bento"
        description="Riff on V3 — same bento grid but each tile includes the full story/explanation. Fewer columns, bigger tiles, more to read per card." />
      <V7RichBento stats={stats} />

      <SectionLabel number={8} title="Full-Viewport Immersive"
        description="Riff on V2 — one fact per screen. Big number, full description, controls to tweak inputs. Scroll through one at a time. More to absorb per view." />
      <V8FullViewport dob={dob} />
    </section>
  );
}

// ── Router ──────────────────────────────────────────────────────────
export default function Main({ name, dob }: { name: string; dob: string }) {
  const [hash, setHash] = useState(location.hash);

  useEffect(() => {
    const onHash = () => {
      setHash(location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (hash === "#explore") {
    return <ExploreMain name={name} dob={dob} />;
  }
  return <CuratedMain name={name} dob={dob} />;
}
