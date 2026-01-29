"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
}

// Uses CSS variables so confetti adapts to theme
const COLORS = [
  "bg-primary",
  "bg-accent",
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
]

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 4,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-sm ${p.color} opacity-70`}
          style={{
            left: `${p.x}%`,
            top: "-12px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) rotate(540deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
