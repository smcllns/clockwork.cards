import type { SectionConfig, MetricContext } from '../types'
import { getHeartbeatMetrics } from '../utils/metrics'
import { formatNumber, formatCompact } from '../utils/format'

function heartData(ctx: MetricContext) {
  const minutesAlive = (ctx.now.getTime() - ctx.birthDate.getTime()) / (1000 * 60)
  return getHeartbeatMetrics(minutesAlive, ctx.settings.bpm)
}

export const heartbeats: SectionConfig = {
  id: 'heartbeats',
  title: 'Heartbeats',
  subtitle: (ctx) => `at ${ctx.settings.bpm} beats per minute`,
  settings: [
    {
      key: 'bpm',
      label: 'Heart rate (BPM)',
      min: 60,
      max: 120,
      step: 1,
      marks: ['60 resting', '90 average', '120 active'],
    },
  ],
  metrics: [
    {
      id: 'heartbeats-total',
      title: 'Total Heartbeats',
      value: (ctx) => heartData(ctx).totalBeats,
      format: 'compact',
      subtitle: (ctx) => `${heartData(ctx).millions.toFixed(1)} million`,
      accent: 'warm',
      live: true,
      math: (ctx) => {
        const h = heartData(ctx)
        const minutesAlive = (ctx.now.getTime() - ctx.birthDate.getTime()) / (1000 * 60)
        return [
          { label: 'BPM = Beats Per Minute' },
          { line: 'minutes alive × BPM' },
          { line: `${formatNumber(Math.floor(minutesAlive))} × ${ctx.settings.bpm}` },
          { line: `= ${formatNumber(Math.floor(h.totalBeats))}`, bold: true },
        ]
      },
      prose: (ctx) => {
        const h = heartData(ctx)
        return `${ctx.name}'s heart has beaten about ${formatCompact(h.totalBeats)} times — without ever taking a break!`
      },
    },
    {
      id: 'heartbeats-per-day',
      title: 'Beats Per Day',
      value: (ctx) => heartData(ctx).beatsPerDay,
      format: 'number',
      subtitle: (ctx) => `${ctx.settings.bpm} × 60 × 24`,
      accent: 'warm',
      math: (ctx) => {
        const h = heartData(ctx)
        return [
          { label: 'How many beats in one day:' },
          { line: `${ctx.settings.bpm} beats/min × 60 min/hr × 24 hr/day` },
          { line: `= ${formatNumber(h.beatsPerDay)} beats/day`, bold: true },
        ]
      },
      prose: (ctx) => {
        const h = heartData(ctx)
        return `Every single day, that little heart beats ${formatNumber(h.beatsPerDay)} times. It never stops, even while sleeping!`
      },
    },
    {
      id: 'heartbeats-millions',
      title: 'Millions of Beats',
      value: (ctx) => heartData(ctx).millions,
      format: 'decimal1',
      subtitle: 'and counting',
      accent: 'earth',
      live: true,
      math: (ctx) => {
        const h = heartData(ctx)
        return [
          { label: 'Dividing by 1,000,000:' },
          { line: `${formatNumber(Math.floor(h.totalBeats))} ÷ 1,000,000` },
          { line: `= ${h.millions.toFixed(1)} million`, bold: true },
          { label: 'Your heart never stops! It beats about 100,000 times every single day.' },
        ]
      },
      prose: (ctx) => {
        const h = heartData(ctx)
        return `Over ${Math.floor(h.millions)} million heartbeats and counting — your heart is the hardest-working muscle in your whole body.`
      },
    },
  ],
}
