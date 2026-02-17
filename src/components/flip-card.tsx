import { useState, useCallback } from "react";
import { css } from "./slide";

export function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = useCallback(() => setFlipped(f => !f), []);

  const face = (visible: boolean): React.CSSProperties => ({
    ...css.card,
    transition: "opacity 0.2s ease, transform 0.2s ease",
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.97)",
    pointerEvents: visible ? "auto" : "none",
  });

  return (
    <div className="mb-10 cursor-pointer relative" onClick={toggle}>
      <div className="rounded-xl border p-5 space-y-3" style={face(!flipped)} data-card>
        {front}
      </div>
      <div className="rounded-xl border p-5 space-y-3 absolute inset-0" style={face(flipped)} data-card>
        {back}
      </div>
    </div>
  );
}
