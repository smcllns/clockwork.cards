import type { SectionConfig, MetricContext } from '../types'
import { getTimeAlive, getHeartbeatMetrics, getSleepMetrics } from '../utils/metrics'
import { formatNumber, formatCompact } from '../utils/format'

export const funFacts: SectionConfig = {
  id: 'fun-facts',
  title: 'Fun Facts',
  subtitle: () => 'tap to see the math',
  mode: 'prose',
  metrics: [
    {
      id: 'fact-blinks',
      title: 'Blinks',
      value: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        const wakingHours = ta.hours * (1 - ctx.settings.sleepHours / 24)
        return Math.floor(wakingHours * 60 * 15)
      },
      format: 'compact',
      accent: 'cool',
      math: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        const wakingHours = ta.hours * (1 - ctx.settings.sleepHours / 24)
        const blinks = Math.floor(wakingHours * 60 * 15)
        return [
          { label: 'Average person blinks ~15 times per minute while awake:' },
          { line: `${formatNumber(Math.floor(wakingHours))} waking hours × 60 min × 15 blinks` },
          { line: `= ${formatNumber(blinks)} blinks`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        const wakingHours = ta.hours * (1 - ctx.settings.sleepHours / 24)
        const blinks = Math.floor(wakingHours * 60 * 15)
        return `Those eyes have blinked about ${formatCompact(blinks)} times — you blink around 15 times every minute without even thinking about it!`
      },
    },
    {
      id: 'fact-breaths',
      title: 'Breaths',
      value: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return Math.floor(ta.minutes * 18)
      },
      format: 'compact',
      accent: 'warm',
      math: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        const breaths = Math.floor(ta.minutes * 18)
        return [
          { label: 'Kids breathe about 18 times per minute:' },
          { line: `${formatNumber(ta.minutes)} minutes × 18 breaths/min` },
          { line: `= ${formatNumber(breaths)} breaths`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        const breaths = Math.floor(ta.minutes * 18)
        return `${ctx.name} has taken about ${formatCompact(breaths)} breaths. In and out, in and out — your lungs never take a day off!`
      },
    },
    {
      id: 'fact-meals',
      title: 'Meals',
      value: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return Math.floor(ta.days * 3)
      },
      format: 'number',
      accent: 'earth',
      math: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return [
          { label: 'About 3 meals per day:' },
          { line: `${formatNumber(ta.days)} days × 3 meals/day` },
          { line: `= ${formatNumber(ta.days * 3)} meals`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return `About ${formatNumber(ta.days * 3)} meals eaten so far. That's breakfast, lunch, and dinner, every single day!`
      },
    },
    {
      id: 'fact-poop',
      title: 'Poops',
      value: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return Math.floor(ta.days * 1.2)
      },
      format: 'number',
      accent: 'neutral',
      math: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return [
          { label: 'Kids average about 1-2 times per day:' },
          { line: `${formatNumber(ta.days)} days × 1.2 per day` },
          { line: `= ~${formatNumber(Math.floor(ta.days * 1.2))} poops`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return `And yes... ${ctx.name} has pooped approximately ${formatNumber(Math.floor(ta.days * 1.2))} times. Everybody does it!`
      },
    },
    {
      id: 'fact-hair',
      title: 'Hair Growth',
      value: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        return ta.days * 0.5 / 25.4
      },
      format: 'decimal1',
      accent: 'cool',
      math: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        const inches = ta.days * 0.5 / 25.4
        return [
          { label: 'Hair grows about 0.5mm per day:' },
          { line: `${formatNumber(ta.days)} days × 0.5mm/day` },
          { line: `= ${formatNumber(Math.floor(ta.days * 0.5))}mm = ${inches.toFixed(1)} inches`, bold: true },
          { label: 'If you never cut it, one strand would be over 4 feet long!' },
        ]
      },
      prose: (ctx) => {
        const ta = getTimeAlive(ctx.birthDate, ctx.now)
        const inches = ta.days * 0.5 / 25.4
        const feet = inches / 12
        return `If ${ctx.name} never got a haircut, a single strand would be ${feet.toFixed(1)} feet long by now!`
      },
    },
  ],
}
