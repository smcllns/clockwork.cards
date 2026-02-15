import { useStats } from "./stats";
import V1CompactGrid from "./V1CompactGrid";
import V2Magazine from "./V2Magazine";
import V3BentoBox from "./V3BentoBox";
import V4Narrative from "./V4Narrative";
import V5Ticker from "./V5Ticker";

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

export default function Main({ name, dob }: { name: string; dob: string }) {
  const stats = useStats(dob);

  return (
    <section style={{ background: "var(--bg-primary)" }}>
      <SectionLabel
        number={1}
        title="Compact Grid"
        description="Uniform cards in a responsive grid. Each card: emoji, big number, label, one-line context. Clean and scannable."
      />
      <V1CompactGrid stats={stats} name={name} />

      <SectionLabel
        number={2}
        title="Magazine / Editorial"
        description="Full-width horizontal layout. Large number left-aligned, explanation text right. Generous whitespace, reads like a high-end infographic."
      />
      <V2Magazine stats={stats} />

      <SectionLabel
        number={3}
        title="Bento Box"
        description="Mixed-size tiles in a CSS grid. Featured stats get wider tiles. Creates visual hierarchy — modern, app-like."
      />
      <V3BentoBox stats={stats} />

      <SectionLabel
        number={4}
        title="Narrative Scroll"
        description="Story-style flow. Numbers are inline with prose — reads like the actual content doc. For a more personal, book-like feel."
      />
      <V4Narrative stats={stats} name={name} />

      <SectionLabel
        number={5}
        title="Ticker / Ledger"
        description="Clean tabular list. Label left, number right. Dense but readable — like a receipt or data printout."
      />
      <V5Ticker stats={stats} />
    </section>
  );
}
