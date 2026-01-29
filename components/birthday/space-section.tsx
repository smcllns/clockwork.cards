"use client"

import { useState, useEffect } from "react"
import { StatWidget } from "./stat-widget"
import { LiveNumber } from "./live-number"

interface SpaceSectionProps {
  dateOfBirth: string
}

export function SpaceSection({ dateOfBirth }: SpaceSectionProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const birthDate = new Date(dateOfBirth)
  const diffMs = now.getTime() - birthDate.getTime()
  const hoursAlive = diffMs / (1000 * 60 * 60)
  const daysAlive = hoursAlive / 24
  const yearsAlive = daysAlive / 365.25

  // Earth rotation: ~1,040 mph at equator
  const rotationMph = 1040
  const milesFromRotation = hoursAlive * rotationMph

  // Earth orbit: ~67,000 mph around the sun
  const orbitMph = 67000
  const milesAroundSun = hoursAlive * orbitMph

  // Solar system through galaxy: ~450,000 mph
  const galaxyMph = 450000
  const milesThroughGalaxy = hoursAlive * galaxyMph

  // Trips around the sun = years
  const orbitsAroundSun = yearsAlive

  // Moon distance: 238,900 miles
  const moonDistance = 238900
  const moonTrips = milesAroundSun / moonDistance

  return (
    <section className="space-y-4 md:space-y-6 snap-section">
      <div className="section-header">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">Space Travel</h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">without leaving Earth</p>
      </div>

      <div className="mobile-scroll-container sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-3">
        <StatWidget
          title="Trips Around Sun"
          headline={<LiveNumber value={orbitsAroundSun} decimals={3} />}
          subtitle="1 trip = 1 year"
          accentColor="warm"
          live
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Earth takes 1 year to orbit the sun:</p>
              <p>trips = years alive</p>
              <p className="font-semibold">= {orbitsAroundSun.toFixed(3)} orbits</p>
              <p className="text-xs text-muted-foreground mt-2">
                Each orbit is about 584 million miles!
              </p>
            </div>
          }
        />

        <StatWidget
          title="Miles from Rotation"
          headline={<LiveNumber value={milesFromRotation} compact />}
          subtitle={`Earth spins at ${rotationMph.toLocaleString()} mph`}
          accentColor="cool"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Earth spins once per day:</p>
              <p>{Math.floor(hoursAlive).toLocaleString()} hrs × {rotationMph.toLocaleString()} mph</p>
              <p className="font-semibold">= {Math.floor(milesFromRotation).toLocaleString()} miles</p>
            </div>
          }
        />

        <StatWidget
          title="Miles Around Sun"
          headline={<LiveNumber value={milesAroundSun} compact />}
          subtitle={`orbiting at ${orbitMph.toLocaleString()} mph`}
          accentColor="earth"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Earth orbits the sun:</p>
              <p>{Math.floor(hoursAlive).toLocaleString()} hrs × {orbitMph.toLocaleString()} mph</p>
              <p className="font-semibold">= {milesAroundSun.toExponential(2)} miles</p>
            </div>
          }
        />

        <StatWidget
          title="Moon Trips"
          headline={<LiveNumber value={moonTrips} decimals={0} />}
          subtitle={`could reach the Moon ${Math.floor(moonTrips).toLocaleString()}×`}
          accentColor="neutral"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Moon is {moonDistance.toLocaleString()} miles away:</p>
              <p>{milesAroundSun.toExponential(2)} ÷ {moonDistance.toLocaleString()}</p>
              <p className="font-semibold">= {Math.floor(moonTrips).toLocaleString()} trips</p>
            </div>
          }
        />

        <StatWidget
          title="Through the Galaxy"
          headline={<LiveNumber value={milesThroughGalaxy} compact />}
          subtitle={`at ${galaxyMph.toLocaleString()} mph`}
          accentColor="cool"
          mathContent={
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">Our solar system moves through the Milky Way:</p>
              <p>{Math.floor(hoursAlive).toLocaleString()} hrs × {galaxyMph.toLocaleString()} mph</p>
              <p className="font-semibold">= {milesThroughGalaxy.toExponential(2)} miles</p>
              <p className="text-xs text-muted-foreground mt-2">
                You are a space traveler and you didn't even know it!
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
