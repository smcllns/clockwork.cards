import { createSignal, onMount, For, JSX } from "solid-js"

interface Particle {
  id: number
  x: number
  delay: number
  duration: number
  colorVar: string
  size: number
}

const COLOR_VARS = ["--primary", "--accent", "--chart-1", "--chart-2", "--chart-3"]

export function Confetti(): JSX.Element {
  const [particles, setParticles] = createSignal<Particle[]>([])

  onMount(() => {
    const newParticles: Particle[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      colorVar: COLOR_VARS[Math.floor(Math.random() * COLOR_VARS.length)],
      size: 6 + Math.random() * 4,
    }))
    setParticles(newParticles)
  })

  return (
    <div style={{
      position: "fixed",
      inset: "0",
      "pointer-events": "none",
      overflow: "hidden",
      "z-index": "50",
    }}>
      <For each={particles()}>
        {(p) => (
          <div
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: "-12px",
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: `var(${p.colorVar})`,
              "border-radius": "2px",
              opacity: "0.7",
              animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
            }}
          />
        )}
      </For>
    </div>
  )
}
