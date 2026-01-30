import type { FactFn, ParamDef } from '../lib/types'
import { getTimeAlive } from '../lib/time'
import { formatNumber, formatCompact } from '../lib/format'

export const params = {
  sleepHours: { default: 10, min: 6, max: 14, step: 0.5, label: 'Hours per night', unit: 'h' },
} satisfies Record<string, ParamDef>

function sleepData(dob: Date, now: Date, sleepHours: number) {
  const ta = getTimeAlive(dob, now)
  const daysAlive = ta.days + (ta.hours % 24) / 24
  const totalHours = daysAlive * sleepHours
  const totalDays = totalHours / 24
  const totalYears = totalDays / 365.25
  const percentLife = (sleepHours / 24) * 100
  return { ta, totalHours, totalDays, totalYears, percentLife }
}

export const TotalHoursSlept: FactFn = ({ now, dob, name, sleepHours }) => {
  const s = sleepData(dob, now, sleepHours)
  return {
    title: 'Total Hours Slept',
    value: s.totalHours,
    format: 'compact',
    subtitle: `${formatNumber(Math.floor(s.totalHours))} hours exactly`,
    accent: 'cool',
    math: [
      { label: 'Formula:' },
      { line: 'days alive × hours per night' },
      { line: `${formatNumber(s.ta.days)} × ${sleepHours}` },
      { line: `= ${formatNumber(Math.floor(s.totalHours))} hours`, bold: true },
    ],
    prose: `${name} has spent about ${formatCompact(s.totalHours)} hours with eyes closed, dreaming away.`,
  }
}

export const DaysSpentSleeping: FactFn = ({ now, dob, sleepHours }) => {
  const s = sleepData(dob, now, sleepHours)
  return {
    title: 'Days Spent Sleeping',
    value: s.totalDays,
    format: 'decimal1',
    subtitle: 'full 24-hour days',
    accent: 'cool',
    math: [
      { label: 'Converting hours to days:' },
      { line: `${formatNumber(Math.floor(s.totalHours))} hours ÷ 24` },
      { line: `= ${s.totalDays.toFixed(1)} days`, bold: true },
    ],
    prose: `If you added up all that sleep into whole days, it would be ${formatNumber(s.totalDays, 1)} days straight of snoozing.`,
  }
}

export const YearsAsleep: FactFn = ({ now, dob, sleepHours }) => {
  const s = sleepData(dob, now, sleepHours)
  return {
    title: 'Years Asleep',
    value: s.totalYears,
    format: 'decimal2',
    subtitle: `${s.percentLife.toFixed(0)}% of your life`,
    accent: 'earth',
    math: [
      { label: 'Converting days to years:' },
      { line: `${s.totalDays.toFixed(1)} days ÷ 365.25` },
      { line: `= ${s.totalYears.toFixed(2)} years`, bold: true },
      { label: `Out of ${s.ta.years} years alive, you have been asleep for ${s.totalYears.toFixed(1)} of them!` },
    ],
    prose: `That means about ${s.percentLife.toFixed(0)}% of life so far has been spent sleeping — your body needs it to grow!`,
  }
}
