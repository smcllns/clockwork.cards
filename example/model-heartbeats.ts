// models/heartbeats.ts — fact functions + params
//
// Each fact is a pure function: (ctx) => FactData
// No DOM, no SolidJS, no side effects.

import type { FactFn, ParamDef } from './types'
import { formatNumber, formatCompact } from '../src/utils/format'

export const params = {
  bpm: { default: 90, min: 60, max: 120, step: 1, label: 'Heart rate', unit: 'BPM' },
} satisfies Record<string, ParamDef>

export const TotalBeats: FactFn = ({ now, dob, name, bpm }) => {
  const minutesAlive = (now.getTime() - dob.getTime()) / 60000
  const totalBeats = minutesAlive * bpm
  const millions = totalBeats / 1_000_000

  return {
    title: 'Total Heartbeats',
    value: totalBeats,
    format: 'compact',
    subtitle: `${millions.toFixed(1)} million`,
    accent: 'warm',
    live: true,
    math: [
      { label: 'BPM = Beats Per Minute' },
      { line: `${formatNumber(Math.floor(minutesAlive))} × ${bpm}` },
      { line: `= ${formatNumber(Math.floor(totalBeats))}`, bold: true },
    ],
    prose: `${name}'s heart has beaten about ${formatCompact(totalBeats)} times — without ever taking a break!`,
  }
}

export const BeatsPerDay: FactFn = ({ bpm }) => {
  const beatsPerDay = bpm * 60 * 24
  return {
    title: 'Beats Per Day',
    value: beatsPerDay,
    format: 'number',
    subtitle: `${bpm} × 60 × 24`,
    accent: 'warm',
    math: [
      { line: `${bpm} beats/min × 60 min/hr × 24 hr/day` },
      { line: `= ${formatNumber(beatsPerDay)} beats/day`, bold: true },
    ],
    prose: `Every single day, that little heart beats ${formatNumber(beatsPerDay)} times. It never stops, even while sleeping!`,
  }
}

export const Millions: FactFn = ({ now, dob, bpm }) => {
  const minutesAlive = (now.getTime() - dob.getTime()) / 60000
  const totalBeats = minutesAlive * bpm
  const millions = totalBeats / 1_000_000

  return {
    title: 'Millions of Beats',
    value: millions,
    format: 'decimal1',
    subtitle: 'and counting',
    accent: 'earth',
    live: true,
    math: [
      { line: `${formatNumber(Math.floor(totalBeats))} ÷ 1,000,000` },
      { line: `= ${millions.toFixed(1)} million`, bold: true },
    ],
    prose: `Over ${Math.floor(millions)} million heartbeats and counting — your heart is the hardest-working muscle in your whole body.`,
  }
}
