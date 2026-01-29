"use client"

import { useEffect, useState } from "react"
import { StatWidget } from "./stat-widget"
import { LiveNumber } from "./live-number"

interface TimeAliveSectionProps {
  dateOfBirth: string
}

export function TimeAliveSection({ dateOfBirth }: TimeAliveSectionProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const birthDate = new Date(dateOfBirth)
  const diffMs = now.getTime() - birthDate.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30.44)
  const years = Math.floor(days / 365.25)

  // For the 9-year-old anchored math explanation
  const yearsExact = days / 365.25

  return (
    <section className="space-y-4 md:space-y-6 snap-section">
      <div className="section-header">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Time Alive</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">since {birthDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
      </div>

      <div className="mobile-scroll-container sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-3">
        <StatWidget
          title="Years"
          headline={<LiveNumber value={years} />}
          subtitle={`${(yearsExact % 1 * 100).toFixed(1)}% through year ${years + 1}`}
          accentColor="warm"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Starting from {years} years:</p>
              <p>{years} years = {years} × 365.25 days</p>
              <p>= {Math.floor(years * 365.25).toLocaleString()} days</p>
              <p className="text-xs text-muted-foreground mt-2">
                We use 365.25 to account for leap years (one extra day every 4 years).
              </p>
            </div>
          }
        />

        <StatWidget
          title="Months"
          headline={<LiveNumber value={months} />}
          subtitle={`${years} yrs × 12 + ${months % 12}`}
          accentColor="warm"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">From {years} years:</p>
              <p>{years} years × 12 months/year</p>
              <p>= {years * 12} months</p>
              <p>+ {months - (years * 12)} extra months</p>
              <p className="font-semibold">= {months} months</p>
            </div>
          }
        />

        <StatWidget
          title="Weeks"
          headline={<LiveNumber value={weeks} />}
          subtitle={`${days} days ÷ 7`}
          accentColor="cool"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">From {years} years:</p>
              <p>{years} years × 365.25 days × (1 week / 7 days)</p>
              <p>= {Math.floor(years * 365.25 / 7).toLocaleString()} weeks</p>
              <p>+ {weeks - Math.floor(years * 365.25 / 7)} extra weeks</p>
              <p className="font-semibold">= {weeks.toLocaleString()} weeks</p>
            </div>
          }
        />

        <StatWidget
          title="Days"
          headline={<LiveNumber value={days} />}
          subtitle={`${years} years × 365.25`}
          accentColor="cool"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">From {years} years:</p>
              <p>{years} years × 365.25 days/year</p>
              <p>= {Math.floor(years * 365.25).toLocaleString()} days</p>
              <p>+ {days - Math.floor(years * 365.25)} extra days</p>
              <p className="font-semibold">= {days.toLocaleString()} days</p>
            </div>
          }
        />

        <StatWidget
          title="Hours"
          headline={<LiveNumber value={hours} />}
          subtitle={`${days.toLocaleString()} days × 24`}
          accentColor="earth"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">From {days.toLocaleString()} days:</p>
              <p>{days.toLocaleString()} days × 24 hours/day</p>
              <p className="font-semibold">= {hours.toLocaleString()} hours</p>
            </div>
          }
        />

        <StatWidget
          title="Minutes"
          headline={<LiveNumber value={minutes} />}
          subtitle={`${hours.toLocaleString()} hrs × 60`}
          accentColor="earth"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">From {hours.toLocaleString()} hours:</p>
              <p>{hours.toLocaleString()} hours × 60 min/hour</p>
              <p className="font-semibold">= {minutes.toLocaleString()} minutes</p>
            </div>
          }
        />

        <StatWidget
          title="Seconds"
          headline={<LiveNumber value={seconds} />}
          subtitle="updating live"
          accentColor="neutral"
          live
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">From {minutes.toLocaleString()} minutes:</p>
              <p>{minutes.toLocaleString()} min × 60 sec/min</p>
              <p className="font-semibold">= {seconds.toLocaleString()} seconds</p>
              <p className="text-xs text-muted-foreground mt-3">
                Fun fact: Computers measure time in milliseconds since January 1, 1970. 
                Right now that number is {diffMs.toLocaleString()} ms!
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
