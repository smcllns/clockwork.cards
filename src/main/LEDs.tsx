import { useTheme } from "../store/theme";

const LED_COUNT = 8;
const COLORS_LIGHT = ["#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4", "#8b5cf6", "#ec4899", "#06b6d4", "#8b5cf6"];
const COLORS_SHINY = ["#00ffff", "#bf5af2", "#ff2d55", "#39ff14", "#00f0ff", "#ff10f0", "#00ff88", "#3b82f6"];

export default function LEDs() {
  const shiny = useTheme(s => s.shiny);
  const colors = shiny ? COLORS_SHINY : COLORS_LIGHT;

  return (
    <div className="flex gap-2 justify-center items-center py-2">
      {Array.from({ length: LED_COUNT }, (_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            backgroundColor: colors[i],
            boxShadow: shiny ? `0 0 6px ${colors[i]}, 0 0 12px ${colors[i]}40` : "none",
            animation: `led-blink ${shiny ? 0.8 : 2}s ease-in-out infinite`,
            animationDelay: `${i * (shiny ? 0.1 : 0.25)}s`,
          }}
        />
      ))}
    </div>
  );
}
