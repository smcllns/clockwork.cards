import { Section, IdTag } from "./section";

type Props = { children: React.ReactNode; className?: string };

export function TileSlide({ children, id, title, className }: Props & { id: string; title: string }) {
  return (
    <Section id={id} bg="secondary" className={className}>
      <div className="w-full py-16">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-8 pb-3 border-b max-w-[900px] mx-auto text-(--text-secondary) border-(--border-color)"
        >
          {title}
        </h3>
        <div className="tile-grid">
          {children}
        </div>
      </div>
    </Section>
  );
}

type TileProps = {
  id: string;
  className?: string;
} & (
  | { emoji: string; value: string; unit: string; lede: string; body: React.ReactNode; children?: never }
  | { emoji?: never; value?: never; unit?: never; lede?: never; body?: never; children: React.ReactNode }
);

export function Tile({ id, className, children, emoji, value, unit, lede, body }: TileProps) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-3 relative ${className ?? ""}`}
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      }}
      data-card
    >
      <div className="absolute top-3 right-3"><IdTag id={id} /></div>
      {children ?? (
        <>
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0 mt-1">{emoji}</span>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="font-bold text-(--text-primary) font-(--font-stat)"
                  style={{ fontSize: "1.75rem", lineHeight: 1.1 }}
                  data-stat
                >{value}</span>
                <span className="text-sm text-(--text-secondary)">{unit}</span>
              </div>
              <p className="text-sm font-semibold mt-1 text-(--text-primary)">{lede}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-(--text-secondary)" style={{ paddingLeft: "44px" }}>{body}</p>
        </>
      )}
    </div>
  );
}
