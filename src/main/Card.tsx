import { useState } from "react";

interface CardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export default function Card({ front, back }: CardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="min-h-[220px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
      data-card
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-center border"
          style={{
            backfaceVisibility: "hidden",
            background: "var(--bg-card)",
            borderColor: "var(--border-color)",
            boxShadow: "var(--shadow-md)",
            color: "var(--text-primary)",
          }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-center border text-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            boxShadow: "var(--shadow-md)",
            color: "var(--text-secondary)",
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
