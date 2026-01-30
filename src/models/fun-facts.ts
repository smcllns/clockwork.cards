import type { FactFn, ParamDef } from '../lib/types'
import { getTimeAlive } from '../lib/time'
import { formatNumber, formatCompact } from '../lib/format'

export const params = {
  blinksPerMin: { default: 15, min: 5, max: 30, step: 1, label: 'Blinks per minute' },
  breathsPerMin: { default: 18, min: 8, max: 30, step: 1, label: 'Breaths per minute' },
  mealsPerDay: { default: 3, min: 1, max: 6, step: 1, label: 'Meals per day' },
  poopsPerDay: { default: 1.2, min: 0.5, max: 3, step: 0.1, label: 'Poops per day' },
  hairMmPerDay: { default: 0.5, min: 0.2, max: 1, step: 0.1, label: 'Hair growth', unit: 'mm/day' },
} satisfies Record<string, ParamDef>

export const Blinks: FactFn = ({ now, dob, sleepHours = 10, blinksPerMin = 15 }) => {
  const ta = getTimeAlive(dob, now)
  const wakingHours = ta.hours * (1 - sleepHours / 24)
  const blinks = Math.floor(wakingHours * 60 * blinksPerMin)
  return {
    title: 'Blinks',
    value: blinks,
    format: 'compact',
    accent: 'cool',
    math: [
      { label: `Average person blinks ~${blinksPerMin} times per minute while awake:` },
      { line: `${formatNumber(Math.floor(wakingHours))} waking hours × 60 min × ${blinksPerMin} blinks` },
      { line: `= ${formatNumber(blinks)} blinks`, bold: true },
    ],
    prose: `Those eyes have blinked about ${formatCompact(blinks)} times — you blink around ${blinksPerMin} times every minute without even thinking about it!`,
  }
}

export const Breaths: FactFn = ({ now, dob, name, breathsPerMin = 18 }) => {
  const ta = getTimeAlive(dob, now)
  const breaths = Math.floor(ta.minutes * breathsPerMin)
  return {
    title: 'Breaths',
    value: breaths,
    format: 'compact',
    accent: 'warm',
    math: [
      { label: `Kids breathe about ${breathsPerMin} times per minute:` },
      { line: `${formatNumber(ta.minutes)} minutes × ${breathsPerMin} breaths/min` },
      { line: `= ${formatNumber(breaths)} breaths`, bold: true },
    ],
    prose: `${name} has taken about ${formatCompact(breaths)} breaths. In and out, in and out — your lungs never take a day off!`,
  }
}

export const Meals: FactFn = ({ now, dob, mealsPerDay = 3 }) => {
  const ta = getTimeAlive(dob, now)
  const meals = Math.floor(ta.days * mealsPerDay)
  return {
    title: 'Meals',
    value: meals,
    format: 'number',
    accent: 'earth',
    math: [
      { label: `About ${mealsPerDay} meals per day:` },
      { line: `${formatNumber(ta.days)} days × ${mealsPerDay} meals/day` },
      { line: `= ${formatNumber(meals)} meals`, bold: true },
    ],
    prose: `About ${formatNumber(meals)} meals eaten so far. That's breakfast, lunch, and dinner, every single day!`,
  }
}

export const Poops: FactFn = ({ now, dob, name, poopsPerDay = 1.2 }) => {
  const ta = getTimeAlive(dob, now)
  const poops = Math.floor(ta.days * poopsPerDay)
  return {
    title: 'Poops',
    value: poops,
    format: 'number',
    accent: 'neutral',
    math: [
      { label: `Kids average about ${poopsPerDay} times per day:` },
      { line: `${formatNumber(ta.days)} days × ${poopsPerDay} per day` },
      { line: `= ~${formatNumber(poops)} poops`, bold: true },
    ],
    prose: `And yes... ${name} has pooped approximately ${formatNumber(poops)} times. Everybody does it!`,
  }
}

export const HairGrowth: FactFn = ({ now, dob, name, hairMmPerDay = 0.5 }) => {
  const ta = getTimeAlive(dob, now)
  const inches = ta.days * hairMmPerDay / 25.4
  const feet = inches / 12
  return {
    title: 'Hair Growth',
    value: inches,
    format: 'decimal1',
    accent: 'cool',
    math: [
      { label: `Hair grows about ${hairMmPerDay}mm per day:` },
      { line: `${formatNumber(ta.days)} days × ${hairMmPerDay}mm/day` },
      { line: `= ${formatNumber(Math.floor(ta.days * hairMmPerDay))}mm = ${inches.toFixed(1)} inches`, bold: true },
      { label: `If you never cut it, one strand would be ${feet.toFixed(1)} feet long!` },
    ],
    prose: `If ${name} never got a haircut, a single strand would be ${feet.toFixed(1)} feet long by now!`,
  }
}
