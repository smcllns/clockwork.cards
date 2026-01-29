import type { SectionConfig, MetricContext } from '../types'
import { getTimeAlive } from '../utils/metrics'
import { formatNumber, formatShortDate } from '../utils/format'

function t(ctx: MetricContext) {
  return getTimeAlive(ctx.birthDate, ctx.now)
}

export const timeAlive: SectionConfig = {
  id: 'time-alive',
  title: 'Time Alive',
  subtitle: (ctx) => `since ${formatShortDate(ctx.birthDate)}`,
  metrics: [
    {
      id: 'years',
      title: 'Years',
      value: (ctx) => t(ctx).years,
      format: 'number',
      subtitle: (ctx) => {
        const ta = t(ctx)
        return `${(ta.yearsExact % 1 * 100).toFixed(1)}% through year ${ta.years + 1}`
      },
      accent: 'warm',
      math: (ctx) => {
        const ta = t(ctx)
        return [
          { label: `Starting from ${ta.years} years:` },
          { line: `${ta.years} years = ${ta.years} × 365.25 days` },
          { line: `= ${formatNumber(Math.floor(ta.years * 365.25))} days` },
          { label: 'We use 365.25 to account for leap years (one extra day every 4 years).' },
        ]
      },
      prose: (ctx) => {
        const ta = t(ctx)
        return `${ctx.name} has been alive for ${ta.years} whole years — that's ${(ta.yearsExact % 1 * 100).toFixed(0)}% of the way through year number ${ta.years + 1}.`
      },
    },
    {
      id: 'months',
      title: 'Months',
      value: (ctx) => t(ctx).months,
      format: 'number',
      subtitle: (ctx) => {
        const ta = t(ctx)
        return `${ta.years} yrs × 12 + ${ta.months % 12}`
      },
      accent: 'warm',
      math: (ctx) => {
        const ta = t(ctx)
        return [
          { label: `From ${ta.years} years:` },
          { line: `${ta.years} years × 12 months/year` },
          { line: `= ${ta.years * 12} months` },
          { line: `+ ${ta.months - (ta.years * 12)} extra months` },
          { line: `= ${ta.months} months`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = t(ctx)
        return `That's ${formatNumber(ta.months)} months of growing, learning, and being awesome.`
      },
    },
    {
      id: 'weeks',
      title: 'Weeks',
      value: (ctx) => t(ctx).weeks,
      format: 'number',
      subtitle: (ctx) => `${formatNumber(t(ctx).days)} days ÷ 7`,
      accent: 'cool',
      math: (ctx) => {
        const ta = t(ctx)
        return [
          { label: `From ${ta.years} years:` },
          { line: `${ta.years} years × 365.25 ÷ 7` },
          { line: `= ${formatNumber(Math.floor(ta.years * 365.25 / 7))} weeks` },
          { line: `+ ${ta.weeks - Math.floor(ta.years * 365.25 / 7)} extra weeks` },
          { line: `= ${formatNumber(ta.weeks)} weeks`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = t(ctx)
        return `Every single one of those ${formatNumber(ta.weeks)} weeks had a weekend — that's a lot of Saturdays!`
      },
    },
    {
      id: 'days',
      title: 'Days',
      value: (ctx) => t(ctx).days,
      format: 'number',
      subtitle: (ctx) => `${t(ctx).years} years × 365.25`,
      accent: 'cool',
      math: (ctx) => {
        const ta = t(ctx)
        return [
          { label: `From ${ta.years} years:` },
          { line: `${ta.years} years × 365.25 days/year` },
          { line: `= ${formatNumber(Math.floor(ta.years * 365.25))} days` },
          { line: `+ ${ta.days - Math.floor(ta.years * 365.25)} extra days` },
          { line: `= ${formatNumber(ta.days)} days`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = t(ctx)
        return `${formatNumber(ta.days)} sunrises and ${formatNumber(ta.days)} sunsets — each one a brand new day.`
      },
    },
    {
      id: 'hours',
      title: 'Hours',
      value: (ctx) => t(ctx).hours,
      format: 'number',
      subtitle: (ctx) => `${formatNumber(t(ctx).days)} days × 24`,
      accent: 'earth',
      math: (ctx) => {
        const ta = t(ctx)
        return [
          { label: `From ${formatNumber(ta.days)} days:` },
          { line: `${formatNumber(ta.days)} days × 24 hours/day` },
          { line: `= ${formatNumber(ta.hours)} hours`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = t(ctx)
        return `${formatNumber(ta.hours)} hours of life so far — and each hour has 60 minutes packed inside it.`
      },
    },
    {
      id: 'minutes',
      title: 'Minutes',
      value: (ctx) => t(ctx).minutes,
      format: 'number',
      subtitle: (ctx) => `${formatNumber(t(ctx).hours)} hrs × 60`,
      accent: 'earth',
      math: (ctx) => {
        const ta = t(ctx)
        return [
          { label: `From ${formatNumber(ta.hours)} hours:` },
          { line: `${formatNumber(ta.hours)} hours × 60 min/hour` },
          { line: `= ${formatNumber(ta.minutes)} minutes`, bold: true },
        ]
      },
      prose: (ctx) => {
        const ta = t(ctx)
        return `Right this second, ${ctx.name} has been alive for over ${formatNumber(ta.minutes)} minutes.`
      },
    },
    {
      id: 'seconds',
      title: 'Seconds',
      value: (ctx) => t(ctx).seconds,
      format: 'number',
      subtitle: 'updating live',
      accent: 'neutral',
      live: true,
      math: (ctx) => {
        const ta = t(ctx)
        return [
          { label: `From ${formatNumber(ta.minutes)} minutes:` },
          { line: `${formatNumber(ta.minutes)} min × 60 sec/min` },
          { line: `= ${formatNumber(ta.seconds)} seconds`, bold: true },
          { label: `Fun fact: Computers measure time in milliseconds since January 1, 1970. Right now that number is ${formatNumber(ta.diffMs)} ms!` },
        ]
      },
      prose: (ctx) => {
        const ta = t(ctx)
        return `${formatNumber(ta.seconds)} seconds alive and counting — a new one ticks by every single second!`
      },
    },
  ],
}
