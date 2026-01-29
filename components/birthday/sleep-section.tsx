"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { StatWidget } from "./stat-widget"
import { LiveNumber } from "./live-number"

interface SleepSectionProps {
  dateOfBirth: string
}

export function SleepSection({ dateOfBirth }: SleepSectionProps) {
  const [sleepHours, setSleepHours] = useState(10)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const birthDate = new Date(dateOfBirth)
  const daysAlive = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)
  const years = Math.floor(daysAlive / 365.25)

  const totalSleepHours = daysAlive * sleepHours
  const totalSleepDays = totalSleepHours / 24
  const totalSleepYears = totalSleepDays / 365.25
  const percentLifeAsleep = (sleepHours / 24) * 100

  const settingsSlider = (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>Hours per night</span>
        <span className="font-mono font-semibold text-foreground">{sleepHours}h</span>
      </div>
      <Slider
        value={[sleepHours]}
        onValueChange={(v) => setSleepHours(v[0])}
        min={6}
        max={14}
        step={0.5}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>6h</span>
        <span>10h (recommended)</span>
        <span>14h</span>
      </div>
    </div>
  )

  return (
    <section className="space-y-4 md:space-y-6 snap-section">
      <div className="section-header">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Sleep</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">at {sleepHours} hours per night</p>
      </div>

      <div className="mobile-scroll-container sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-3">
        <StatWidget
          title="Total Hours Slept"
          headline={<LiveNumber value={totalSleepHours} compact />}
          subtitle={`${Math.floor(totalSleepHours).toLocaleString()} hours exactly`}
          accentColor="cool"
          settingsContent={settingsSlider}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Formula:</p>
              <p>days alive × hours per night</p>
              <p>{Math.floor(daysAlive).toLocaleString()} × {sleepHours}</p>
              <p className="font-semibold">= {Math.floor(totalSleepHours).toLocaleString()} hours</p>
            </div>
          }
        />

        <StatWidget
          title="Days Spent Sleeping"
          headline={<LiveNumber value={totalSleepDays} decimals={1} />}
          subtitle="full 24-hour days"
          accentColor="cool"
          settingsContent={settingsSlider}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Converting hours to days:</p>
              <p>{Math.floor(totalSleepHours).toLocaleString()} hours ÷ 24</p>
              <p className="font-semibold">= {totalSleepDays.toFixed(1)} days</p>
            </div>
          }
        />

        <StatWidget
          title="Years Asleep"
          headline={<LiveNumber value={totalSleepYears} decimals={2} />}
          subtitle={`${percentLifeAsleep.toFixed(0)}% of your life`}
          accentColor="earth"
          settingsContent={settingsSlider}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Converting days to years:</p>
              <p>{totalSleepDays.toFixed(1)} days ÷ 365.25</p>
              <p className="font-semibold">= {totalSleepYears.toFixed(2)} years</p>
              <p className="text-xs text-muted-foreground mt-2">
                Out of {years} years alive, you have been asleep for {totalSleepYears.toFixed(1)} of them!
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
