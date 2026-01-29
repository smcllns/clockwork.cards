"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { StatWidget } from "./stat-widget"
import { LiveNumber } from "./live-number"

interface StepsSectionProps {
  dateOfBirth: string
}

export function StepsSection({ dateOfBirth }: StepsSectionProps) {
  const [stepsPerDay, setStepsPerDay] = useState(8000)
  const [strideInches, setStrideInches] = useState(20)
  const [walkingAge, setWalkingAge] = useState(1)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const birthDate = new Date(dateOfBirth)
  const walkingStart = new Date(birthDate)
  walkingStart.setFullYear(walkingStart.getFullYear() + walkingAge)

  const msWalking = Math.max(0, now.getTime() - walkingStart.getTime())
  const daysWalking = msWalking / (1000 * 60 * 60 * 24)
  const yearsWalking = daysWalking / 365.25

  const totalSteps = daysWalking * stepsPerDay
  const strideFeet = strideInches / 12
  const totalFeet = totalSteps * strideFeet
  const totalMiles = totalFeet / 5280

  const settingsContent = (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Steps per day</span>
          <span className="font-mono font-semibold text-foreground">{stepsPerDay.toLocaleString()}</span>
        </div>
        <Slider value={[stepsPerDay]} onValueChange={(v) => setStepsPerDay(v[0])} min={3000} max={15000} step={500} />
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Stride length</span>
          <span className="font-mono font-semibold text-foreground">{strideInches}&quot;</span>
        </div>
        <Slider value={[strideInches]} onValueChange={(v) => setStrideInches(v[0])} min={12} max={30} step={1} />
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Started walking at</span>
          <span className="font-mono font-semibold text-foreground">{walkingAge} yr</span>
        </div>
        <Slider value={[walkingAge]} onValueChange={(v) => setWalkingAge(v[0])} min={0.5} max={2} step={0.25} />
      </div>
    </div>
  )

  // Fun distance comparisons
  const getDistanceComparison = () => {
    if (totalMiles < 100) return "a few towns over"
    if (totalMiles < 300) return "New York to Washington DC"
    if (totalMiles < 800) return "New York to Chicago"
    if (totalMiles < 1500) return "New York to Miami"
    if (totalMiles < 2500) return "New York to Denver"
    if (totalMiles < 3000) return "coast to coast"
    return "across the USA and back"
  }

  return (
    <section className="space-y-4 md:space-y-6 snap-section">
      <div className="section-header">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Steps & Distance</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{yearsWalking.toFixed(1)} years of walking</p>
      </div>

      <div className="mobile-scroll-container sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-3">
        <StatWidget
          title="Total Steps"
          headline={<LiveNumber value={totalSteps} compact />}
          subtitle={`${stepsPerDay.toLocaleString()}/day × ${Math.floor(daysWalking).toLocaleString()} days`}
          accentColor="cool"
          settingsContent={settingsContent}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Steps = days walking × steps per day</p>
              <p>{Math.floor(daysWalking).toLocaleString()} × {stepsPerDay.toLocaleString()}</p>
              <p className="font-semibold">= {Math.floor(totalSteps).toLocaleString()} steps</p>
            </div>
          }
        />

        <StatWidget
          title="Total Feet"
          headline={<LiveNumber value={totalFeet} compact />}
          subtitle={`${strideInches}" stride`}
          accentColor="cool"
          settingsContent={settingsContent}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Convert stride to feet, then multiply:</p>
              <p>{strideInches}" ÷ 12 = {strideFeet.toFixed(2)} ft/step</p>
              <p>{Math.floor(totalSteps).toLocaleString()} × {strideFeet.toFixed(2)}</p>
              <p className="font-semibold">= {Math.floor(totalFeet).toLocaleString()} feet</p>
            </div>
          }
        />

        <StatWidget
          title="Miles Walked"
          headline={<LiveNumber value={totalMiles} decimals={1} />}
          subtitle="feet ÷ 5,280"
          accentColor="earth"
          settingsContent={settingsContent}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">There are 5,280 feet in a mile:</p>
              <p>{Math.floor(totalFeet).toLocaleString()} ÷ 5,280</p>
              <p className="font-semibold">= {totalMiles.toFixed(1)} miles</p>
            </div>
          }
        />

        <StatWidget
          title="That's Like..."
          headline={getDistanceComparison()}
          subtitle={`${totalMiles.toFixed(0)} miles`}
          accentColor="warm"
          settingsContent={settingsContent}
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Distance comparisons:</p>
              <p className="text-xs">NYC to DC: ~225 mi</p>
              <p className="text-xs">NYC to Chicago: ~790 mi</p>
              <p className="text-xs">NYC to LA: ~2,800 mi</p>
              <p className="font-semibold mt-2">You've walked {totalMiles.toFixed(0)} miles!</p>
            </div>
          }
        />
      </div>
    </section>
  )
}
