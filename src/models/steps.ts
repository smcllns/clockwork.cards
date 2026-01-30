import type { FactFn, ParamDef } from '../lib/types'
import { formatNumber, formatCompact } from '../lib/format'
import { getDistanceComparison } from '../lib/constants'

export const params = {
  stepsPerDay: { default: 8000, min: 3000, max: 15000, step: 500, label: 'Steps per day' },
  strideInches: { default: 20, min: 12, max: 30, step: 1, label: 'Stride length', unit: '"' },
  walkingAge: { default: 1, min: 0.5, max: 2, step: 0.25, label: 'Started walking at', unit: ' yr' },
} satisfies Record<string, ParamDef>

function stepsData(dob: Date, now: Date, walkingAge: number, stepsPerDay: number, strideInches: number) {
  const walkingStart = new Date(dob)
  walkingStart.setFullYear(walkingStart.getFullYear() + walkingAge)
  const msWalking = Math.max(0, now.getTime() - walkingStart.getTime())
  const daysWalking = msWalking / (1000 * 60 * 60 * 24)
  const yearsWalking = daysWalking / 365.25
  const totalSteps = daysWalking * stepsPerDay
  const strideFeet = strideInches / 12
  const totalFeet = totalSteps * strideFeet
  const totalMiles = totalFeet / 5280
  return { totalSteps, totalFeet, totalMiles, daysWalking, yearsWalking }
}

export const TotalSteps: FactFn = ({ now, dob, name, stepsPerDay, strideInches, walkingAge }) => {
  const s = stepsData(dob, now, walkingAge, stepsPerDay, strideInches)
  return {
    title: 'Total Steps',
    value: s.totalSteps,
    format: 'compact',
    subtitle: `${formatNumber(stepsPerDay)}/day × ${formatNumber(Math.floor(s.daysWalking))} days`,
    accent: 'cool',
    math: [
      { label: 'Steps = days walking × steps per day' },
      { line: `${formatNumber(Math.floor(s.daysWalking))} × ${formatNumber(stepsPerDay)}` },
      { line: `= ${formatNumber(Math.floor(s.totalSteps))} steps`, bold: true },
    ],
    prose: `Since learning to walk, ${name} has taken about ${formatCompact(s.totalSteps)} steps — that's a lot of little feet moving!`,
  }
}

export const TotalFeet: FactFn = ({ now, dob, stepsPerDay, strideInches, walkingAge }) => {
  const s = stepsData(dob, now, walkingAge, stepsPerDay, strideInches)
  const strideFt = strideInches / 12
  return {
    title: 'Total Feet',
    value: s.totalFeet,
    format: 'compact',
    subtitle: `${strideInches}" stride`,
    accent: 'cool',
    math: [
      { label: 'Convert stride to feet, then multiply:' },
      { line: `${strideInches}" ÷ 12 = ${strideFt.toFixed(2)} ft/step` },
      { line: `${formatNumber(Math.floor(s.totalSteps))} × ${strideFt.toFixed(2)}` },
      { line: `= ${formatNumber(Math.floor(s.totalFeet))} feet`, bold: true },
    ],
    prose: `All those steps add up to ${formatCompact(s.totalFeet)} feet — or about ${formatNumber(s.totalMiles, 0)} miles!`,
  }
}

export const MilesWalked: FactFn = ({ now, dob, stepsPerDay, strideInches, walkingAge }) => {
  const s = stepsData(dob, now, walkingAge, stepsPerDay, strideInches)
  const comparison = getDistanceComparison(s.totalMiles)
  return {
    title: 'Miles Walked',
    value: s.totalMiles,
    format: 'decimal1',
    subtitle: 'feet ÷ 5,280',
    accent: 'earth',
    math: [
      { label: 'There are 5,280 feet in a mile:' },
      { line: `${formatNumber(Math.floor(s.totalFeet))} ÷ 5,280` },
      { line: `= ${s.totalMiles.toFixed(1)} miles`, bold: true },
    ],
    prose: `${formatNumber(s.totalMiles, 1)} miles on foot — that's like walking ${comparison}!`,
  }
}

export const DistanceComparison: FactFn = ({ now, dob, stepsPerDay, strideInches, walkingAge }) => {
  const s = stepsData(dob, now, walkingAge, stepsPerDay, strideInches)
  return {
    title: "That's Like...",
    value: getDistanceComparison(s.totalMiles),
    subtitle: `${s.totalMiles.toFixed(0)} miles`,
    accent: 'warm',
    math: [
      { label: 'Distance comparisons:' },
      { line: 'NYC to DC: ~225 mi' },
      { line: 'NYC to Chicago: ~790 mi' },
      { line: 'NYC to LA: ~2,800 mi' },
      { line: `You've walked ${s.totalMiles.toFixed(0)} miles!`, bold: true },
    ],
    prose: `If you walked in a straight line, you would have gone ${getDistanceComparison(s.totalMiles)} — just by walking around every day!`,
  }
}
