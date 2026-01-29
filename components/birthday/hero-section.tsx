"use client"

import { useEffect, useState } from "react"

interface HeroSectionProps {
  name: string
  dateOfBirth: string
}

export function HeroSection({ name, dateOfBirth }: HeroSectionProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const birthDate = new Date(dateOfBirth)
  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  if (nextBirthday <= now) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  
  const age = Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const isBirthdayToday = daysUntilBirthday === 365 || daysUntilBirthday === 0

  const formattedBirthDate = birthDate.toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  })

  return (
    <header className="text-center py-10 md:py-16 lg:py-20 display-hero snap-section">
      <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3 md:mb-4">
        A Numbers Story For
      </p>
      
      <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-4 md:mb-6 glow px-2">
        {name}
      </h1>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="h-px w-12 bg-border" />
        <span className="text-lg font-mono text-muted-foreground">
          {formattedBirthDate}
        </span>
        <span className="h-px w-12 bg-border" />
      </div>

      {isBirthdayToday ? (
        <div className="inline-block card-glow bg-card/50 backdrop-blur-sm rounded-lg px-6 py-4 md:px-8 md:py-6 border border-primary/30 neon-border">
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2 glow">
            Happy {age + 1}th Birthday!
          </p>
          <p className="text-sm md:text-base text-muted-foreground">
            Today marks another trip around the sun.
          </p>
        </div>
      ) : daysUntilBirthday <= 30 ? (
        <div className="inline-block card-glow bg-card/50 backdrop-blur-sm rounded-lg px-6 py-4 md:px-8 md:py-6 border border-primary/30">
          <p className="text-base md:text-lg text-muted-foreground mb-1">Turning {age + 1} in</p>
          <p className="big-number font-mono text-primary glow">
            {daysUntilBirthday}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {daysUntilBirthday === 1 ? "day" : "days"}
          </p>
        </div>
      ) : (
        <div className="inline-block">
          <p className="text-base md:text-lg text-muted-foreground">
            Currently <span className="font-semibold text-primary glow">{age} years old</span>
          </p>
        </div>
      )}

      <p className="mt-8 md:mt-12 text-xs md:text-sm text-muted-foreground max-w-sm md:max-w-md mx-auto leading-relaxed px-4">
        Tap any card to see the math. Tap the gear to adjust variables.
      </p>
    </header>
  )
}
