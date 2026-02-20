import { type CSSProperties, useRef } from "react";

// ── Inline stepper: ‹ value › with +/- buttons ────────────────────
interface StepperProps {
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number; // auto-derived from step if omitted
  displayValue?: string; // overrides the readout (use when showing a converted unit)
  onChange: (v: number) => void;
}

const chipBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  borderRadius: "999px",
  padding: "1px 4px",
  verticalAlign: "baseline",
  lineHeight: 1.4,
  background: "color-mix(in srgb, var(--text-accent) 12%, transparent)",
  border: "1px solid color-mix(in srgb, var(--text-accent) 25%, transparent)",
  transition: "color 0.4s, background 0.4s, border-color 0.4s",
};

const statValue: CSSProperties = {
  fontFamily: "var(--font-stat)",
  fontWeight: 700,
  color: "var(--text-accent)",
  fontSize: "inherit",
};

const btnBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  color: "var(--text-accent)",
  fontWeight: 700,
  fontSize: "18px",
  cursor: "pointer",
  lineHeight: 1,
  padding: 0,
  position: "relative" as const,
  transition: "background 0.15s",
};

export function InlineStepper({ value, min, max, step, unit, decimals, displayValue, onChange }: StepperProps) {
  const d = decimals ?? (step.toString().split(".")[1] ?? "").length;
  const clamp = (v: number) => parseFloat(Math.min(max, Math.max(min, v)).toFixed(d));
  const bumpRef = useRef({ count: 0, dir: "up" as "up" | "down" });
  const bump = (v: number, dir: "up" | "down") => { bumpRef.current = { count: bumpRef.current.count + 1, dir }; onChange(v); };
  return (
    <span key={bumpRef.current.count} className={bumpRef.current.dir === "up" ? "stepper-pop-up" : "stepper-pop-down"} style={chipBase}>
      <button
        style={{ ...btnBase, opacity: value <= min ? 0.3 : 1 }}
        onClick={(e) => { e.stopPropagation(); bump(clamp(value - step), "down"); }}
        aria-label="decrease"
      >
        -
      </button>
      <span
        style={{ ...statValue, padding: "0 2px", minWidth: "28px", textAlign: "center" }}
      >
        {displayValue ?? (value.toFixed(d) + (unit ?? ""))}
      </span>
      <button
        style={{ ...btnBase, opacity: value >= max ? 0.3 : 1 }}
        onClick={(e) => { e.stopPropagation(); bump(clamp(value + step), "up"); }}
        aria-label="increase"
      >
        +
      </button>
    </span>
  );
}

// ── Inline dropdown: native <select> in a chip ───────────────────
interface DropdownProps<T extends string> {
  options: readonly (T | { value: T; label: string })[];
  value: T;
  onChange: (v: T) => void;
}

export function InlineDropdown<T extends string>({ options, value, onChange }: DropdownProps<T>) {
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );
  return (
    <span style={{ ...chipBase, padding: "1px 6px", position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          background: "transparent",
          border: "none",
          fontFamily: "var(--font-stat)",
          fontWeight: 700,
          color: "var(--text-accent)",
          fontSize: "inherit",
          cursor: "pointer",
          padding: "1px 16px 1px 4px",
        }}
      >
        {normalized.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg
        width="10" height="6"
        viewBox="0 0 10 6"
        style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fill: "var(--text-accent)" }}
      >
        <path d="M0 0l5 6 5-6z" />
      </svg>
    </span>
  );
}

// ── Inline pill toggle: [ option1 | option2 ] ─────────────────────
interface PillsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function InlinePills<T extends string>({ options, value, onChange }: PillsProps<T>) {
  return (
    <span style={{ ...chipBase, gap: "1px", padding: "2px 3px" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={(e) => { e.stopPropagation(); onChange(opt.value); }}
          style={{
            ...btnBase,
            width: "auto",
            borderRadius: "999px",
            padding: "1px 8px",
            fontSize: "inherit",
            fontWeight: opt.value === value ? 700 : 400,
            color: opt.value === value ? "var(--text-accent)" : "var(--text-secondary)",
            background: opt.value === value
              ? "color-mix(in srgb, var(--text-accent) 15%, transparent)"
              : "transparent",
          }}
        >
          {opt.label}
        </button>
      ))}
    </span>
  );
}

// ── Inline slider with value readout ───────────────────────────────
interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number; // auto-derived from step if omitted
  displayValue?: string; // overrides the readout (use when showing a converted unit)
  onChange: (v: number) => void;
}

export function InlineSlider({ value, min, max, step, unit, decimals, displayValue, onChange }: SliderProps) {
  const d = decimals ?? (step.toString().split(".")[1] ?? "").length;
  return (
    <span style={{ ...chipBase, gap: "6px", padding: "2px 8px" }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(120px, 30vw)",
          height: "4px",
          accentColor: "var(--text-accent)",
          cursor: "pointer",
        }}
      />
      <span style={{ ...statValue, minWidth: "36px" }}>
        {displayValue ?? (value.toFixed(d) + (unit ?? ""))}
      </span>
    </span>
  );
}
