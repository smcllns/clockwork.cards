import { JSX } from "solid-js"

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
}

export function Slider(props: SliderProps): JSX.Element {
  const percent = () => ((props.value - props.min) / (props.max - props.min)) * 100

  return (
    <div style={{ position: "relative", width: "100%", height: "24px", display: "flex", "align-items": "center" }}>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
        style={{
          width: "100%",
          height: "6px",
          appearance: "none",
          background: `linear-gradient(to right, var(--primary) ${percent()}%, var(--muted) ${percent()}%)`,
          "border-radius": "3px",
          cursor: "pointer",
          outline: "none",
        }}
      />
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: white;
          border: 2px solid var(--primary);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: transform 0.1s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: white;
          border: 2px solid var(--primary);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
