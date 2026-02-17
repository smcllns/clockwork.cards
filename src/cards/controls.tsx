import { type CSSProperties } from "react";

// ── Inline stepper: ‹ value › with +/- buttons ────────────────────
interface StepperProps {
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  decimals?: number;
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
  transition: "background 0.2s",
};

const btnBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  border: "none",
  background: "transparent",
  color: "var(--text-accent)",
  fontWeight: 700,
  fontSize: "14px",
  cursor: "pointer",
  lineHeight: 1,
  padding: 0,
  transition: "background 0.15s",
};

export function InlineStepper({ value, min, max, step, unit, decimals = 0, onChange }: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  return (
    <span style={chipBase}>
      <button
        style={{ ...btnBase, opacity: value <= min ? 0.3 : 1 }}
        onClick={(e) => { e.stopPropagation(); onChange(clamp(value - step)); }}
        aria-label="decrease"
      >
        -
      </button>
      <span
        style={{
          fontFamily: "var(--font-stat)",
          fontWeight: 700,
          color: "var(--text-accent)",
          padding: "0 2px",
          minWidth: "28px",
          textAlign: "center",
          fontSize: "inherit",
        }}
      >
        {decimals > 0 ? value.toFixed(decimals) : value}{unit ?? ""}
      </span>
      <button
        style={{ ...btnBase, opacity: value >= max ? 0.3 : 1 }}
        onClick={(e) => { e.stopPropagation(); onChange(clamp(value + step)); }}
        aria-label="increase"
      >
        +
      </button>
    </span>
  );
}

// ── Inline dropdown: native <select> in a chip ───────────────────
interface DropdownProps<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function InlineDropdown<T extends string>({ options, value, onChange }: DropdownProps<T>) {
  return (
    <span style={{ ...chipBase, padding: "1px 6px" }}>
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 2px center",
          backgroundSize: "10px 6px",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
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
  decimals?: number;
  onChange: (v: number) => void;
}

export function InlineSlider({ value, min, max, step, unit, decimals = 0, onChange }: SliderProps) {
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
          width: "80px",
          height: "4px",
          accentColor: "var(--text-accent)",
          cursor: "pointer",
        }}
      />
      <span style={{
        fontFamily: "var(--font-stat)",
        fontWeight: 700,
        color: "var(--text-accent)",
        minWidth: "36px",
        fontSize: "inherit",
      }}>
        {decimals > 0 ? value.toFixed(decimals) : value}{unit ?? ""}
      </span>
    </span>
  );
}

// ── Block-level control row (for V8 full-viewport) ─────────────────
interface BlockControlProps {
  label: string;
  children: React.ReactNode;
}

export function BlockControl({ label, children }: BlockControlProps) {
  return (
    <div
      className="flex items-center gap-4 py-3 px-4 rounded-xl"
      style={{
        background: "color-mix(in srgb, var(--text-accent) 6%, transparent)",
        border: "1px solid color-mix(in srgb, var(--text-accent) 15%, transparent)",
      }}
    >
      <span className="text-sm shrink-0" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <div className="flex items-center gap-2 flex-1">
        {children}
      </div>
    </div>
  );
}

// ── Block slider (wider, for V8) ───────────────────────────────────
export function BlockSlider({ value, min, max, step, unit, decimals = 0, onChange }: SliderProps) {
  return (
    <div className="flex items-center gap-3 flex-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          flex: 1,
          height: "6px",
          accentColor: "var(--text-accent)",
          cursor: "pointer",
        }}
      />
      <span
        className="text-lg font-bold tabular-nums"
        style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)", minWidth: "48px" }}
      >
        {decimals > 0 ? value.toFixed(decimals) : value}{unit ?? ""}
      </span>
    </div>
  );
}

// ── Block stepper (for V8) ─────────────────────────────────────────
export function BlockStepper({ value, min, max, step, unit, decimals = 0, onChange }: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(clamp(value - step))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer"
        style={{
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          color: "var(--text-accent)",
          opacity: value <= min ? 0.3 : 1,
        }}
      >
        -
      </button>
      <span
        className="text-lg font-bold tabular-nums min-w-[48px] text-center"
        style={{ fontFamily: "var(--font-stat)", color: "var(--text-accent)" }}
      >
        {decimals > 0 ? value.toFixed(decimals) : value}{unit ?? ""}
      </span>
      <button
        onClick={() => onChange(clamp(value + step))}
        className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold cursor-pointer"
        style={{
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          color: "var(--text-accent)",
          opacity: value >= max ? 0.3 : 1,
        }}
      >
        +
      </button>
    </div>
  );
}
