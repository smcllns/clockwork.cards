import { useEffect, useState } from "react";
import { useTheme } from "../store/theme";

const SIZE = 120;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CENTER = SIZE / 2;
const ARC_START = 135;
const ARC_SWEEP = 270;

export default function Gauge({ bpm = 80, label = "BPM" }: { bpm?: number; label?: string }) {
  const [angle, setAngle] = useState(ARC_START);
  const shiny = useTheme(s => s.shiny);

  useEffect(() => {
    let frame: number;
    const startTime = performance.now();
    function tick() {
      const elapsed = (performance.now() - startTime) / 1000;
      const current = bpm + Math.sin(elapsed * 0.8) * 5;
      const ratio = Math.max(0, Math.min(1, (current - 40) / 80));
      setAngle(ARC_START + ratio * ARC_SWEEP);
      frame = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(frame);
  }, [bpm]);

  const arcPath = describeArc(CENTER, CENTER, RADIUS, ARC_START, ARC_START + ARC_SWEEP);

  const needleRad = (angle * Math.PI) / 180;
  const needleLen = RADIUS - 8;
  const nx = CENTER + Math.cos(needleRad) * needleLen;
  const ny = CENTER + Math.sin(needleRad) * needleLen;

  const needleColor = shiny ? "var(--accent-1)" : "var(--accent-3)";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {shiny && (
          <defs>
            <filter id="needle-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        )}
        {/* track */}
        <path d={arcPath} fill="none" stroke="var(--border-color)" strokeWidth={STROKE} strokeLinecap="round" />
        {/* tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const a = ((ARC_START + t * ARC_SWEEP) * Math.PI) / 180;
          const x1 = CENTER + Math.cos(a) * (RADIUS - 2);
          const y1 = CENTER + Math.sin(a) * (RADIUS - 2);
          const x2 = CENTER + Math.cos(a) * (RADIUS + 4);
          const y2 = CENTER + Math.sin(a) * (RADIUS + 4);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-secondary)" strokeWidth={1.5} strokeLinecap="round" />;
        })}
        {/* needle */}
        <line
          x1={CENTER} y1={CENTER} x2={nx} y2={ny}
          stroke={needleColor}
          strokeWidth={2}
          strokeLinecap="round"
          filter={shiny ? "url(#needle-glow)" : undefined}
        />
        {/* center dot */}
        <circle cx={CENTER} cy={CENTER} r={3} fill={needleColor} />
        {/* value text */}
        <text
          x={CENTER} y={CENTER + 22}
          textAnchor="middle" fontSize="14" fontWeight="700"
          fill="var(--text-primary)"
          style={{ fontFamily: "var(--font-stat)" }}
          data-stat
        >
          {bpm}
        </text>
        <text x={CENTER} y={CENTER + 34} textAnchor="middle" fontSize="10" fill="var(--text-secondary)">
          {label}
        </text>
      </svg>
    </div>
  );
}

function describeArc(x: number, y: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, r, endAngle);
  const end = polarToCartesian(x, y, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
