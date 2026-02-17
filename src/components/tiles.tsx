import { css, Section, IdTag } from "./slide";

type Props = { children: React.ReactNode; className?: string };

export function TileContainer({ children, id, title, className }: Props & { id: string; title: string }) {
  return (
    <Section id={id} bg="secondary" className={className}>
      <div className="w-full py-16">
        <h3
          className="text-sm font-semibold uppercase tracking-[0.15em] mb-8 pb-3 border-b max-w-2xl mx-auto"
          style={css.sectionHead}
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
  span: number;
  className?: string;
} & (
  | { emoji: string; value: string; unit: string; headline: string; body: string; children?: never }
  | { emoji?: never; value?: never; unit?: never; headline?: never; body?: never; children: React.ReactNode }
);

export function Tile({ id, span, className, children, emoji, value, unit, headline, body }: TileProps) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-3 relative ${className ?? ""}`}
      style={{
        "--span": `span ${span}`,
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      } as React.CSSProperties}
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
                  className="font-bold"
                  style={{ fontFamily: "var(--font-stat)", color: "var(--text-primary)", fontSize: "1.75rem", lineHeight: 1.1 }}
                  data-stat
                >{value}</span>
                <span className="text-sm" style={css.secondary}>{unit}</span>
              </div>
              <p className="text-sm font-semibold mt-1" style={css.primary}>{headline}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ ...css.secondary, paddingLeft: "44px" }}>{body}</p>
        </>
      )}
    </div>
  );
}
