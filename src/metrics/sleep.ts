import type { SectionConfig, MetricContext } from '../types'
import { getTimeAlive, getSleepMetrics } from '../utils/metrics'
import { formatNumber, formatCompact } from '../utils/format'

function sleepData(ctx: MetricContext) {
  const ta = getTimeAlive(ctx.birthDate, ctx.now)
  const daysAlive = ta.days + (ta.hours % 24) / 24
  return { ta, sleep: getSleepMetrics(daysAlive, ctx.settings.sleepHours) }
}

export const sleep: SectionConfig = {
  id: 'sleep',
  title: 'Sleep',
  subtitle: (ctx) => `at ${ctx.settings.sleepHours} hours per night`,
  settings: [
    {
      key: 'sleepHours',
      label: 'Hours per night',
      min: 6,
      max: 14,
      step: 0.5,
      unit: 'h',
      marks: ['6h', '10h (recommended)', '14h'],
    },
  ],
  metrics: [
    {
      id: 'sleep-total-hours',
      title: 'Total Hours Slept',
      value: (ctx) => sleepData(ctx).sleep.totalHours,
      format: 'compact',
      subtitle: (ctx) => `${formatNumber(Math.floor(sleepData(ctx).sleep.totalHours))} hours exactly`,
      accent: 'cool',
      math: (ctx) => {
        const { ta, sleep } = sleepData(ctx)
        return [
          { label: 'Formula:' },
          { line: 'days alive × hours per night' },
          { line: `${formatNumber(ta.days)} × ${ctx.settings.sleepHours}` },
          { line: `= ${formatNumber(Math.floor(sleep.totalHours))} hours`, bold: true },
        ]
      },
      prose: (ctx) => {
        const { sleep } = sleepData(ctx)
        return `${ctx.name} has spent about ${formatCompact(sleep.totalHours)} hours with eyes closed, dreaming away.`
      },
    },
    {
      id: 'sleep-total-days',
      title: 'Days Spent Sleeping',
      value: (ctx) => sleepData(ctx).sleep.totalDays,
      format: 'decimal1',
      subtitle: 'full 24-hour days',
      accent: 'cool',
      math: (ctx) => {
        const { sleep } = sleepData(ctx)
        return [
          { label: 'Converting hours to days:' },
          { line: `${formatNumber(Math.floor(sleep.totalHours))} hours ÷ 24` },
          { line: `= ${sleep.totalDays.toFixed(1)} days`, bold: true },
        ]
      },
      prose: (ctx) => {
        const { sleep } = sleepData(ctx)
        return `If you added up all that sleep into whole days, it would be ${formatNumber(sleep.totalDays, 1)} days straight of snoozing.`
      },
    },
    {
      id: 'sleep-total-years',
      title: 'Years Asleep',
      value: (ctx) => sleepData(ctx).sleep.totalYears,
      format: 'decimal2',
      subtitle: (ctx) => `${sleepData(ctx).sleep.percentLife.toFixed(0)}% of your life`,
      accent: 'earth',
      math: (ctx) => {
        const { ta, sleep } = sleepData(ctx)
        return [
          { label: 'Converting days to years:' },
          { line: `${sleep.totalDays.toFixed(1)} days ÷ 365.25` },
          { line: `= ${sleep.totalYears.toFixed(2)} years`, bold: true },
          { label: `Out of ${ta.years} years alive, you have been asleep for ${sleep.totalYears.toFixed(1)} of them!` },
        ]
      },
      prose: (ctx) => {
        const { sleep } = sleepData(ctx)
        return `That means about ${sleep.percentLife.toFixed(0)}% of life so far has been spent sleeping — your body needs it to grow!`
      },
    },
  ],
}
