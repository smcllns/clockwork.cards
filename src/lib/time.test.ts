import { describe, test, expect } from 'bun:test'
import { getTimeAlive, getAge, getNextBirthday, getDaysUntilBirthday, isBirthdayToday, diffDays, diffHours, diffMinutes } from './time'

const dob = new Date('2017-02-19T00:00:00')
const now = new Date('2025-02-19T12:00:00')

describe('getTimeAlive', () => {
  test('returns correct years', () => {
    const ta = getTimeAlive(dob, now)
    expect(ta.years).toBe(8)
  })

  test('returns correct days', () => {
    const ta = getTimeAlive(dob, now)
    expect(ta.days).toBe(2922)
  })

  test('returns correct hours', () => {
    const ta = getTimeAlive(dob, now)
    expect(ta.hours).toBe(2922 * 24 + 12)
  })

  test('returns exact years as decimal', () => {
    const ta = getTimeAlive(dob, now)
    expect(ta.yearsExact).toBeCloseTo(8.0, 0)
  })
})

describe('getAge', () => {
  test('returns floor of years', () => {
    expect(getAge(dob, now)).toBe(8)
  })

  test('returns 0 for newborn', () => {
    expect(getAge(dob, new Date('2017-06-01T00:00:00'))).toBe(0)
  })
})

describe('getNextBirthday', () => {
  test('returns next year if birthday passed', () => {
    const next = getNextBirthday(dob, new Date('2025-03-01T00:00:00'))
    expect(next.getFullYear()).toBe(2026)
    expect(next.getMonth()).toBe(1) // Feb
    expect(next.getDate()).toBe(19)
  })

  test('returns this year if birthday ahead', () => {
    const next = getNextBirthday(dob, new Date('2025-01-01T00:00:00'))
    expect(next.getFullYear()).toBe(2025)
  })
})

describe('getDaysUntilBirthday', () => {
  test('returns positive days when birthday ahead', () => {
    const days = getDaysUntilBirthday(dob, new Date('2025-02-10T00:00:00'))
    expect(days).toBe(9)
  })
})

describe('isBirthdayToday', () => {
  test('true on birthday', () => {
    expect(isBirthdayToday(dob, new Date('2025-02-19T12:00:00'))).toBe(true)
  })

  test('false on other days', () => {
    expect(isBirthdayToday(dob, new Date('2025-03-01T00:00:00'))).toBe(false)
  })
})

describe('diff helpers', () => {
  test('diffDays', () => {
    expect(diffDays(now, dob)).toBe(2922)
  })

  test('diffHours', () => {
    expect(diffHours(now, dob)).toBeCloseTo(2922 * 24 + 12, 0)
  })

  test('diffMinutes', () => {
    expect(diffMinutes(now, dob)).toBeCloseTo((2922 * 24 + 12) * 60, 0)
  })
})
