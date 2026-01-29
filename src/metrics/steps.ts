import type { SectionConfig, MetricContext } from '../types'
import { getStepsMetrics, getDistanceComparison } from '../utils/metrics'
import { formatNumber, formatCompact } from '../utils/format'

function stepsData(ctx: MetricContext) {
  return getStepsMetrics(
    ctx.birthDate, ctx.now,
    ctx.settings.walkingAge, ctx.settings.stepsPerDay, ctx.settings.strideInches
  )
}

export const steps: SectionConfig = {
  id: 'steps',
  title: 'Steps & Distance',
  subtitle: (ctx) => `${stepsData(ctx).yearsWalking.toFixed(1)} years of walking`,
  settings: [
    {
      key: 'stepsPerDay',
      label: 'Steps per day',
      min: 3000,
      max: 15000,
      step: 500,
    },
    {
      key: 'strideInches',
      label: 'Stride length',
      min: 12,
      max: 30,
      step: 1,
      unit: '"',
    },
    {
      key: 'walkingAge',
      label: 'Started walking at',
      min: 0.5,
      max: 2,
      step: 0.25,
      unit: ' yr',
    },
  ],
  metrics: [
    {
      id: 'steps-total',
      title: 'Total Steps',
      value: (ctx) => stepsData(ctx).totalSteps,
      format: 'compact',
      subtitle: (ctx) => {
        const s = stepsData(ctx)
        return `${formatNumber(ctx.settings.stepsPerDay)}/day × ${formatNumber(Math.floor(s.daysWalking))} days`
      },
      accent: 'cool',
      math: (ctx) => {
        const s = stepsData(ctx)
        return [
          { label: 'Steps = days walking × steps per day' },
          { line: `${formatNumber(Math.floor(s.daysWalking))} × ${formatNumber(ctx.settings.stepsPerDay)}` },
          { line: `= ${formatNumber(Math.floor(s.totalSteps))} steps`, bold: true },
        ]
      },
      prose: (ctx) => {
        const s = stepsData(ctx)
        return `Since learning to walk, ${ctx.name} has taken about ${formatCompact(s.totalSteps)} steps — that's a lot of little feet moving!`
      },
    },
    {
      id: 'steps-feet',
      title: 'Total Feet',
      value: (ctx) => stepsData(ctx).totalFeet,
      format: 'compact',
      subtitle: (ctx) => `${ctx.settings.strideInches}" stride`,
      accent: 'cool',
      math: (ctx) => {
        const s = stepsData(ctx)
        const strideFeet = ctx.settings.strideInches / 12
        return [
          { label: 'Convert stride to feet, then multiply:' },
          { line: `${ctx.settings.strideInches}" ÷ 12 = ${strideFeet.toFixed(2)} ft/step` },
          { line: `${formatNumber(Math.floor(s.totalSteps))} × ${strideFeet.toFixed(2)}` },
          { line: `= ${formatNumber(Math.floor(s.totalFeet))} feet`, bold: true },
        ]
      },
      prose: (ctx) => {
        const s = stepsData(ctx)
        return `All those steps add up to ${formatCompact(s.totalFeet)} feet — or about ${formatNumber(s.totalMiles, 0)} miles!`
      },
    },
    {
      id: 'steps-miles',
      title: 'Miles Walked',
      value: (ctx) => stepsData(ctx).totalMiles,
      format: 'decimal1',
      subtitle: 'feet ÷ 5,280',
      accent: 'earth',
      math: (ctx) => {
        const s = stepsData(ctx)
        return [
          { label: 'There are 5,280 feet in a mile:' },
          { line: `${formatNumber(Math.floor(s.totalFeet))} ÷ 5,280` },
          { line: `= ${s.totalMiles.toFixed(1)} miles`, bold: true },
        ]
      },
      prose: (ctx) => {
        const s = stepsData(ctx)
        const comparison = getDistanceComparison(s.totalMiles)
        return `${formatNumber(s.totalMiles, 1)} miles on foot — that's like walking ${comparison}!`
      },
    },
    {
      id: 'steps-comparison',
      title: "That's Like...",
      value: (ctx) => getDistanceComparison(stepsData(ctx).totalMiles),
      subtitle: (ctx) => `${stepsData(ctx).totalMiles.toFixed(0)} miles`,
      accent: 'warm',
      math: (ctx) => {
        const s = stepsData(ctx)
        return [
          { label: 'Distance comparisons:' },
          { line: 'NYC to DC: ~225 mi' },
          { line: 'NYC to Chicago: ~790 mi' },
          { line: 'NYC to LA: ~2,800 mi' },
          { line: `You've walked ${s.totalMiles.toFixed(0)} miles!`, bold: true },
        ]
      },
      prose: (ctx) => {
        const s = stepsData(ctx)
        return `If you walked in a straight line, you would have gone ${getDistanceComparison(s.totalMiles)} — just by walking around every day!`
      },
    },
  ],
}
