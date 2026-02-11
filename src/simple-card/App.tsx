import { useMemo } from "react"
import { useCardStore } from "./store"

function getAge(dob: string) {
  const birth = new Date(dob + "T00:00:00")
  const now = new Date()
  const diff = now.getTime() - birth.getTime()
  const years = diff / (1000 * 60 * 60 * 24 * 365.25)
  return Math.max(0, years)
}

export function App() {
  const { name, dob, setName, setDob } = useCardStore()

  const ageYears = useMemo(() => getAge(dob), [dob])
  const daysAlive = Math.floor(ageYears * 365.25)
  const heartbeats = Math.floor(ageYears * 42_000_000) // ~42M per year

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="max-w-xl w-full">
        <div className="mb-6 flex flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Happy Metrics (simple)
          </h1>
          <p className="text-sm text-slate-500">
            Tiny neutral card powered by React, Zustand, Tailwind, and Bun.
          </p>
        </div>

        <div className="grid gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-600">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-white text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-1"
              placeholder="Birthday Star"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-600">
              Date of birth
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="h-9 px-3 rounded-lg border border-border bg-white text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-1"
            />
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-xl shadow-card border border-border/70 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/70 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Birthday card
              </span>
              <span className="text-base font-semibold text-slate-900">
                {name || "Birthday Star"}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-slate-50 px-3 py-1 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="px-5 py-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                Age
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {ageYears.toFixed(2)}
                <span className="ml-1 text-xs font-normal text-slate-500">
                  years
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                Days alive
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {daysAlive.toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-400">
                Heartbeats (est)
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {(heartbeats / 1_000_000).toFixed(1)}
                <span className="ml-1 text-xs font-normal text-slate-500">
                  million
                </span>
              </p>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-border/70 bg-slate-50/70 text-xs text-slate-500 flex items-center justify-between gap-2">
            <span>
              Built to be rewritten into nicer modular cards later.
            </span>
            <span className="hidden sm:inline text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
              React · Zustand · Tailwind
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

