import { useState, useCallback } from "react";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  frontColor?: string;
  backColor?: string;
  frontHint?: string;
  backHint?: string;
}

export function FlipCard({ front, back, frontColor = "var(--text-secondary)", backColor = "var(--text-secondary)", frontHint = "tap to flip", backHint = "tap to flip" }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const toggle = useCallback(() => setFlipped(f => !f), []);

  const base: React.CSSProperties = {
    backfaceVisibility: "hidden",
    transition: "transform 0.5s ease",
    transformStyle: "preserve-3d",
  };

  return (
    <div className="cursor-pointer" style={{ perspective: 800 }} onClick={toggle}>
      <div className="relative" style={{ transformStyle: "preserve-3d", transition: "transform 0.5s ease", transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
        <div
          className="rounded-xl border p-5 space-y-2"
          style={{ ...base, borderColor: frontColor, background: `color-mix(in srgb, ${frontColor} 6%, transparent)` }}
        >
          {front}
          <p className="text-xs uppercase tracking-widest pt-1" style={{ color: frontColor, opacity: 0.7 }}>{frontHint}</p>
        </div>
        <div
          className="rounded-xl border p-5 space-y-2 absolute inset-0"
          style={{ ...base, transform: "rotateY(180deg)", borderColor: backColor, background: `color-mix(in srgb, ${backColor} 6%, transparent)` }}
        >
          {back}
          <p className="text-xs uppercase tracking-widest pt-1" style={{ color: backColor, opacity: 0.7 }}>{backHint}</p>
        </div>
      </div>
    </div>
  );
}
