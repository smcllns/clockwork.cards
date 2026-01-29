"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "./birthday/hero-section"
import { TimeAliveSection } from "./birthday/time-alive-section"
import { SleepSection } from "./birthday/sleep-section"
import { HeartbeatsSection } from "./birthday/heartbeats-section"
import { StepsSection } from "./birthday/steps-section"
import { SpaceSection } from "./birthday/space-section"
import { Confetti } from "./birthday/confetti"
import { ThemeSwitcher } from "./birthday/theme-switcher"

interface BirthdayCardProps {
  name: string
  dateOfBirth: string
}

export function BirthdayCard({ name, dateOfBirth }: BirthdayCardProps) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background transition-colors duration-300 overflow-x-hidden">
      {showConfetti && <Confetti />}
      <ThemeSwitcher />
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-20">
        <HeroSection name={name} dateOfBirth={dateOfBirth} />
        
        <div className="space-y-10 md:space-y-16">
          <TimeAliveSection dateOfBirth={dateOfBirth} />
          <SleepSection dateOfBirth={dateOfBirth} />
          <HeartbeatsSection dateOfBirth={dateOfBirth} />
          <StepsSection dateOfBirth={dateOfBirth} />
          <SpaceSection dateOfBirth={dateOfBirth} />
        </div>
        
        <footer className="mt-16 md:mt-20 pt-6 md:pt-8 border-t border-border text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            Made with curiosity and math
          </p>
        </footer>
      </div>
    </main>
  )
}
