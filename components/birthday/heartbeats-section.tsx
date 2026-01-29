"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { StatWidget } from "./stat-widget"
import { LiveNumber } from "./live-number"

interface HeartbeatsSectionProps {
  dateOfBirth: string
}

export function HeartbeatsSection({ dateOfBirth }: HeartbeatsSectionProps) {
  const [bpm, setBpm] = useState(90)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const birthDate = new Date(dateOfBirth)
  const diffMs = now.getTime() - birthDate.getTime()
  const minutesAlive = diffMs / (1000 * 60)

  const totalHeartbeats = minutesAlive * bpm
  const beatsPerDay = bpm * 60 * 24
  const millions = totalHeartbeats / 1_000_000

  const settingsSlider = (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>Heart rate (BPM)</span>
        <span className="font-mono font-semibold text-foreground">{bpm}</span>
      </div>
      <Slider
        value={[bpm]}
        onValueChange={(v) => setBpm(v[0])}
        min={60}
        max={120}
        step={1}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>60 resting</span>
        <span>90 average</span>
        <span>120 active</span>
      </div>
    </div>
  )

  return (
    <section className="space-y-4 md:space-y-6 snap-section">
      <div className="section-header">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Heartbeats</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">at {bpm} beats per minute</p>
      </div>

      <div className="mobile-scroll-container sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-3">
        <StatWidget
          title="Total Heartbeats"
          headline={<LiveNumber value={totalHeartbeats} compact />}
          subtitle={`${millions.toFixed(1)} million`}
          accentColor="warm"
          live
          settingsContent={settingsSlider}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">BPM = Beats Per Minute</p>
              <p>minutes alive × BPM</p>
              <p>{Math.floor(minutesAlive).toLocaleString()} × {bpm}</p>
              <p className="font-semibold">= {Math.floor(totalHeartbeats).toLocaleString()}</p>
            </div>
          }
        />

        <StatWidget
          title="Beats Per Day"
          headline={<LiveNumber value={beatsPerDay} />}
          subtitle={`${bpm} × 60 × 24`}
          accentColor="warm"
          settingsContent={settingsSlider}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">How many beats in one day:</p>
              <p>{bpm} beats/min × 60 min/hr × 24 hr/day</p>
              <p className="font-semibold">= {beatsPerDay.toLocaleString()} beats/day</p>
            </div>
          }
        />

        <StatWidget
          title="Millions of Beats"
          headline={<LiveNumber value={millions} decimals={1} />}
          subtitle="and counting"
          accentColor="earth"
          live
          settingsContent={settingsSlider}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Dividing by 1,000,000:</p>
              <p>{Math.floor(totalHeartbeats).toLocaleString()} ÷ 1,000,000</p>
              <p className="font-semibold">= {millions.toFixed(1)} million</p>
              <p className="text-xs text-muted-foreground mt-2">
                Your heart never stops! It beats about 100,000 times every single day.
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
