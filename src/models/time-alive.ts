import type { FactFn } from '../lib/types'
import { getTimeAlive } from '../lib/time'
import { formatNumber, formatShortDate } from '../lib/format'

export const Years: FactFn = ({ now, dob, name }) => {
  const ta = getTimeAlive(dob, now)
  return {
    title: 'Years',
    value: ta.years,
    format: 'number',
    subtitle: `${(ta.yearsExact % 1 * 100).toFixed(1)}% through year ${ta.years + 1}`,
    accent: 'warm',
    math: [
      { label: `Starting from ${ta.years} years:` },
      { line: `${ta.years} years = ${ta.years} × 365.25 days` },
      { line: `= ${formatNumber(Math.floor(ta.years * 365.25))} days` },
      { label: 'We use 365.25 to account for leap years (one extra day every 4 years).' },
    ],
    prose: `${name} has been alive for ${ta.years} whole years — that's ${(ta.yearsExact % 1 * 100).toFixed(0)}% of the way through year number ${ta.years + 1}.`,
  }
}

export const Months: FactFn = ({ now, dob }) => {
  const ta = getTimeAlive(dob, now)
  return {
    title: 'Months',
    value: ta.months,
    format: 'number',
    subtitle: `${ta.years} yrs × 12 + ${ta.months % 12}`,
    accent: 'warm',
    math: [
      { label: `From ${ta.years} years:` },
      { line: `${ta.years} years × 12 months/year` },
      { line: `= ${ta.years * 12} months` },
      { line: `+ ${ta.months - (ta.years * 12)} extra months` },
      { line: `= ${ta.months} months`, bold: true },
    ],
    prose: `That's ${formatNumber(ta.months)} months of growing, learning, and being awesome.`,
  }
}

export const Weeks: FactFn = ({ now, dob }) => {
  const ta = getTimeAlive(dob, now)
  return {
    title: 'Weeks',
    value: ta.weeks,
    format: 'number',
    subtitle: `${formatNumber(ta.days)} days ÷ 7`,
    accent: 'cool',
    math: [
      { label: `From ${ta.years} years:` },
      { line: `${ta.years} years × 365.25 ÷ 7` },
      { line: `= ${formatNumber(Math.floor(ta.years * 365.25 / 7))} weeks` },
      { line: `+ ${ta.weeks - Math.floor(ta.years * 365.25 / 7)} extra weeks` },
      { line: `= ${formatNumber(ta.weeks)} weeks`, bold: true },
    ],
    prose: `Every single one of those ${formatNumber(ta.weeks)} weeks had a weekend — that's a lot of Saturdays!`,
  }
}

export const Days: FactFn = ({ now, dob }) => {
  const ta = getTimeAlive(dob, now)
  return {
    title: 'Days',
    value: ta.days,
    format: 'number',
    subtitle: `${ta.years} years × 365.25`,
    accent: 'cool',
    math: [
      { label: `From ${ta.years} years:` },
      { line: `${ta.years} years × 365.25 days/year` },
      { line: `= ${formatNumber(Math.floor(ta.years * 365.25))} days` },
      { line: `+ ${ta.days - Math.floor(ta.years * 365.25)} extra days` },
      { line: `= ${formatNumber(ta.days)} days`, bold: true },
    ],
    prose: `${formatNumber(ta.days)} sunrises and ${formatNumber(ta.days)} sunsets — each one a brand new day.`,
  }
}

export const Hours: FactFn = ({ now, dob }) => {
  const ta = getTimeAlive(dob, now)
  return {
    title: 'Hours',
    value: ta.hours,
    format: 'number',
    subtitle: `${formatNumber(ta.days)} days × 24`,
    accent: 'earth',
    math: [
      { label: `From ${formatNumber(ta.days)} days:` },
      { line: `${formatNumber(ta.days)} days × 24 hours/day` },
      { line: `= ${formatNumber(ta.hours)} hours`, bold: true },
    ],
    prose: `${formatNumber(ta.hours)} hours of life so far — and each hour has 60 minutes packed inside it.`,
  }
}

export const Minutes: FactFn = ({ now, dob, name }) => {
  const ta = getTimeAlive(dob, now)
  return {
    title: 'Minutes',
    value: ta.minutes,
    format: 'number',
    subtitle: `${formatNumber(ta.hours)} hrs × 60`,
    accent: 'earth',
    math: [
      { label: `From ${formatNumber(ta.hours)} hours:` },
      { line: `${formatNumber(ta.hours)} hours × 60 min/hour` },
      { line: `= ${formatNumber(ta.minutes)} minutes`, bold: true },
    ],
    prose: `Right this second, ${name} has been alive for over ${formatNumber(ta.minutes)} minutes.`,
  }
}

export const Seconds: FactFn = ({ now, dob }) => {
  const ta = getTimeAlive(dob, now)
  return {
    title: 'Seconds',
    value: ta.seconds,
    format: 'number',
    subtitle: 'updating live',
    accent: 'neutral',
    live: true,
    math: [
      { label: `From ${formatNumber(ta.minutes)} minutes:` },
      { line: `${formatNumber(ta.minutes)} min × 60 sec/min` },
      { line: `= ${formatNumber(ta.seconds)} seconds`, bold: true },
      { label: `Fun fact: Computers measure time in milliseconds since January 1, 1970. Right now that number is ${formatNumber(ta.diffMs)} ms!` },
    ],
    prose: `${formatNumber(ta.seconds)} seconds alive and counting — a new one ticks by every single second!`,
  }
}
