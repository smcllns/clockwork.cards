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

export function getTimeAlive(dob: Date, now: Date): TimeAlive {
  const diffMs = now.getTime() - dob.getTime()
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

export function getAge(dob: Date, now: Date): number {
  return Math.floor((now.getTime() - dob.getTime()) / (DAYS_PER_YEAR * MS_PER_DAY))
}

export function getNextBirthday(dob: Date, now: Date): Date {
  const nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
  if (nextBirthday <= now) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  return nextBirthday
}

export function getDaysUntilBirthday(dob: Date, now: Date): number {
  const nextBirthday = getNextBirthday(dob, now)
  return Math.ceil((nextBirthday.getTime() - now.getTime()) / MS_PER_DAY)
}

export function isBirthdayToday(dob: Date, now: Date): boolean {
  const daysUntil = getDaysUntilBirthday(dob, now)
  return daysUntil === 365 || daysUntil === 366 || daysUntil === 0
}

export function diffDays(now: Date, dob: Date): number {
  return Math.floor((now.getTime() - dob.getTime()) / MS_PER_DAY)
}

export function diffHours(now: Date, dob: Date): number {
  return (now.getTime() - dob.getTime()) / MS_PER_HOUR
}

export function diffMinutes(now: Date, dob: Date): number {
  return (now.getTime() - dob.getTime()) / MS_PER_MINUTE
}
