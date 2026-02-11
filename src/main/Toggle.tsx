interface ToggleProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onChange: (value: T) => void;
}

export default function Toggle<T extends string>({ options, selected, onChange }: ToggleProps<T>) {
  return (
    <div className="flex gap-0.5 p-0.5 rounded-full" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
      {options.map(opt => {
        const active = opt.value === selected;
        return (
          <button
            key={opt.value}
            onClick={(e) => { e.stopPropagation(); onChange(opt.value); }}
            className="px-2.5 py-0.5 text-xs rounded-full cursor-pointer transition-all duration-200"
            style={{
              background: active ? "var(--bg-card)" : "transparent",
              color: active ? "var(--text-accent)" : "var(--text-secondary)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              fontFamily: "var(--font-display)",
              fontWeight: active ? 600 : 400,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
