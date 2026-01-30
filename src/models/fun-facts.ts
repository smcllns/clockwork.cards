import type { FactFn } from '../lib/types'
import { getTimeAlive } from '../lib/time'
import { formatNumber, formatCompact } from '../lib/format'

export const Blinks: FactFn = ({ now, dob, sleepHours = 10 }) => {
  const ta = getTimeAlive(dob, now)
  const wakingHours = ta.hours * (1 - sleepHours / 24)
  const blinks = Math.floor(wakingHours * 60 * 15)
  return {
    title: 'Blinks',
    value: blinks,
    format: 'compact',
    accent: 'cool',
    math: [
      { label: 'Average person blinks ~15 times per minute while awake:' },
      { line: `${formatNumber(Math.floor(wakingHours))} waking hours × 60 min × 15 blinks` },
      { line: `= ${formatNumber(blinks)} blinks`, bold: true },
    ],
    prose: `Those eyes have blinked about ${formatCompact(blinks)} times — you blink around 15 times every minute without even thinking about it!`,
  }
}

export const Breaths: FactFn = ({ now, dob, name }) => {
  const ta = getTimeAlive(dob, now)
  const breaths = Math.floor(ta.minutes * 18)
  return {
    title: 'Breaths',
    value: breaths,
    format: 'compact',
    accent: 'warm',
    math: [
      { label: 'Kids breathe about 18 times per minute:' },
      { line: `${formatNumber(ta.minutes)} minutes × 18 breaths/min` },
      { line: `= ${formatNumber(breaths)} breaths`, bold: true },
    ],
    prose: `${name} has taken about ${formatCompact(breaths)} breaths. In and out, in and out — your lungs never take a day off!`,
  }
}

export const Meals: FactFn = ({ now, dob }) => {
  const ta = getTimeAlive(dob, now)
  const meals = Math.floor(ta.days * 3)
  return {
    title: 'Meals',
    value: meals,
    format: 'number',
    accent: 'earth',
    math: [
      { label: 'About 3 meals per day:' },
      { line: `${formatNumber(ta.days)} days × 3 meals/day` },
      { line: `= ${formatNumber(meals)} meals`, bold: true },
    ],
    prose: `About ${formatNumber(meals)} meals eaten so far. That's breakfast, lunch, and dinner, every single day!`,
  }
}

export const Poops: FactFn = ({ now, dob, name }) => {
  const ta = getTimeAlive(dob, now)
  const poops = Math.floor(ta.days * 1.2)
  return {
    title: 'Poops',
    value: poops,
    format: 'number',
    accent: 'neutral',
    math: [
      { label: 'Kids average about 1-2 times per day:' },
      { line: `${formatNumber(ta.days)} days × 1.2 per day` },
      { line: `= ~${formatNumber(poops)} poops`, bold: true },
    ],
    prose: `And yes... ${name} has pooped approximately ${formatNumber(poops)} times. Everybody does it!`,
  }
}

export const HairGrowth: FactFn = ({ now, dob, name }) => {
  const ta = getTimeAlive(dob, now)
  const inches = ta.days * 0.5 / 25.4
  const feet = inches / 12
  return {
    title: 'Hair Growth',
    value: inches,
    format: 'decimal1',
    accent: 'cool',
    math: [
      { label: 'Hair grows about 0.5mm per day:' },
      { line: `${formatNumber(ta.days)} days × 0.5mm/day` },
      { line: `= ${formatNumber(Math.floor(ta.days * 0.5))}mm = ${inches.toFixed(1)} inches`, bold: true },
      { label: 'If you never cut it, one strand would be over 4 feet long!' },
    ],
    prose: `If ${name} never got a haircut, a single strand would be ${feet.toFixed(1)} feet long by now!`,
  }
}
