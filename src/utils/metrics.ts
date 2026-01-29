const MS_PER_SECOND = 1000
const MS_PER_MINUTE = MS_PER_SECOND * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24
const DAYS_PER_YEAR = 365.25

export interface TimeAlive {
  years: number
  months: number
  weeks: number
  days: number
  hours: number
  minutes: number
  seconds: number
  yearsExact: number
  diffMs: number
}

export function getTimeAlive(birthDate: Date, now: Date): TimeAlive {
  const diffMs = now.getTime() - birthDate.getTime()
  const seconds = Math.floor(diffMs / MS_PER_SECOND)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30.44)
  const years = Math.floor(days / DAYS_PER_YEAR)
  const yearsExact = days / DAYS_PER_YEAR

  return { years, months, weeks, days, hours, minutes, seconds, yearsExact, diffMs }
}

export function getAge(birthDate: Date, now: Date): number {
  return Math.floor((now.getTime() - birthDate.getTime()) / (DAYS_PER_YEAR * MS_PER_DAY))
}

export function getNextBirthday(birthDate: Date, now: Date): Date {
  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  if (nextBirthday <= now) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  return nextBirthday
}

export function getDaysUntilBirthday(birthDate: Date, now: Date): number {
  const nextBirthday = getNextBirthday(birthDate, now)
  return Math.ceil((nextBirthday.getTime() - now.getTime()) / MS_PER_DAY)
}

export function isBirthdayToday(birthDate: Date, now: Date): boolean {
  const daysUntil = getDaysUntilBirthday(birthDate, now)
  return daysUntil === 365 || daysUntil === 366 || daysUntil === 0
}

export interface SleepMetrics {
  totalHours: number
  totalDays: number
  totalYears: number
  percentLife: number
}

export function getSleepMetrics(daysAlive: number, sleepHoursPerNight: number): SleepMetrics {
  const totalHours = daysAlive * sleepHoursPerNight
  const totalDays = totalHours / 24
  const totalYears = totalDays / DAYS_PER_YEAR
  const percentLife = (sleepHoursPerNight / 24) * 100
  return { totalHours, totalDays, totalYears, percentLife }
}

export interface HeartbeatMetrics {
  totalBeats: number
  beatsPerDay: number
  millions: number
}

export function getHeartbeatMetrics(minutesAlive: number, bpm: number): HeartbeatMetrics {
  const totalBeats = minutesAlive * bpm
  const beatsPerDay = bpm * 60 * 24
  const millions = totalBeats / 1_000_000
  return { totalBeats, beatsPerDay, millions }
}

export interface StepsMetrics {
  totalSteps: number
  totalFeet: number
  totalMiles: number
  daysWalking: number
  yearsWalking: number
}

export function getStepsMetrics(
  birthDate: Date,
  now: Date,
  walkingAge: number,
  stepsPerDay: number,
  strideInches: number
): StepsMetrics {
  const walkingStart = new Date(birthDate)
  walkingStart.setFullYear(walkingStart.getFullYear() + walkingAge)
  const msWalking = Math.max(0, now.getTime() - walkingStart.getTime())
  const daysWalking = msWalking / MS_PER_DAY
  const yearsWalking = daysWalking / DAYS_PER_YEAR

  const totalSteps = daysWalking * stepsPerDay
  const strideFeet = strideInches / 12
  const totalFeet = totalSteps * strideFeet
  const totalMiles = totalFeet / 5280

  return { totalSteps, totalFeet, totalMiles, daysWalking, yearsWalking }
}

export function getDistanceComparison(miles: number): string {
  if (miles < 100) return "a few towns over"
  if (miles < 300) return "New York to Washington DC"
  if (miles < 800) return "New York to Chicago"
  if (miles < 1500) return "New York to Miami"
  if (miles < 2500) return "New York to Denver"
  if (miles < 3000) return "coast to coast"
  return "across the USA and back"
}

export interface SpaceMetrics {
  orbitsAroundSun: number
  milesFromRotation: number
  milesAroundSun: number
  milesThroughGalaxy: number
  moonTrips: number
}

const ROTATION_MPH = 1040
const ORBIT_MPH = 67000
const GALAXY_MPH = 450000
const MOON_DISTANCE = 238900

export function getSpaceMetrics(hoursAlive: number, yearsAlive: number): SpaceMetrics {
  const orbitsAroundSun = yearsAlive
  const milesFromRotation = hoursAlive * ROTATION_MPH
  const milesAroundSun = hoursAlive * ORBIT_MPH
  const milesThroughGalaxy = hoursAlive * GALAXY_MPH
  const moonTrips = milesAroundSun / MOON_DISTANCE

  return { orbitsAroundSun, milesFromRotation, milesAroundSun, milesThroughGalaxy, moonTrips }
}

export const SPACE_CONSTANTS = { ROTATION_MPH, ORBIT_MPH, GALAXY_MPH, MOON_DISTANCE }
