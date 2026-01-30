import { describe, test, expect } from 'bun:test'
import type { FactContext } from '../lib/types'

import { Years, Months, Weeks, Days, Hours, Minutes, Seconds } from './time-alive'
import { TotalHoursSlept, DaysSpentSleeping, YearsAsleep } from './sleep'
import { TotalBeats, BeatsPerDay, MillionsOfBeats } from './heartbeats'
import { TotalSteps, TotalFeet, MilesWalked, DistanceComparison } from './steps'
import { TripsAroundSun, MilesFromRotation, MilesAroundSun, MoonTrips, ThroughTheGalaxy } from './space'
import { Blinks, Breaths, Meals, Poops, HairGrowth } from './fun-facts'

const ctx: FactContext = {
  dob: new Date('2017-02-19T00:00:00'),
  now: new Date('2025-02-19T12:00:00'),
  name: 'Kiddo',
  gender: 'neutral',
  bpm: 90,
  sleepHours: 10,
  stepsPerDay: 8000,
  strideInches: 20,
  walkingAge: 1,
}

describe('time-alive', () => {
  test('Years', () => {
    const f = Years(ctx)
    expect(f.title).toBe('Years')
    expect(f.value).toBe(8)
  })

  test('Months', () => {
    const f = Months(ctx)
    expect(f.value).toBeGreaterThan(90)
  })

  test('Weeks', () => {
    const f = Weeks(ctx)
    expect(f.value).toBeGreaterThan(400)
  })

  test('Days', () => {
    const f = Days(ctx)
    expect(f.value).toBe(2922)
  })

  test('Hours', () => {
    const f = Hours(ctx)
    expect(f.value).toBe(2922 * 24 + 12)
  })

  test('Minutes', () => {
    const f = Minutes(ctx)
    expect(f.value).toBe((2922 * 24 + 12) * 60)
  })

  test('Seconds', () => {
    const f = Seconds(ctx)
    expect(f.live).toBe(true)
    expect(f.value).toBeGreaterThan(0)
  })
})

describe('sleep', () => {
  test('TotalHoursSlept', () => {
    const f = TotalHoursSlept(ctx)
    expect(f.value).toBeCloseTo(2922.5 * 10, 0)
  })

  test('DaysSpentSleeping', () => {
    const f = DaysSpentSleeping(ctx)
    expect(f.value).toBeCloseTo(2922 * 10 / 24, 0)
  })

  test('YearsAsleep', () => {
    const f = YearsAsleep(ctx)
    expect(f.value).toBeGreaterThan(3)
    expect(f.value).toBeLessThan(4)
  })
})

describe('heartbeats', () => {
  test('TotalBeats', () => {
    const f = TotalBeats(ctx)
    expect(f.live).toBe(true)
    expect(f.value).toBeGreaterThan(300_000_000)
  })

  test('BeatsPerDay', () => {
    const f = BeatsPerDay(ctx)
    expect(f.value).toBe(90 * 60 * 24)
  })

  test('MillionsOfBeats', () => {
    const f = MillionsOfBeats(ctx)
    expect(f.live).toBe(true)
    expect(f.value).toBeGreaterThan(300)
  })
})

describe('steps', () => {
  test('TotalSteps', () => {
    const f = TotalSteps(ctx)
    expect(f.value).toBeGreaterThan(10_000_000)
  })

  test('TotalFeet', () => {
    const f = TotalFeet(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('MilesWalked', () => {
    const f = MilesWalked(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('DistanceComparison returns a string value', () => {
    const f = DistanceComparison(ctx)
    expect(typeof f.value).toBe('string')
  })
})

describe('space', () => {
  test('TripsAroundSun', () => {
    const f = TripsAroundSun(ctx)
    expect(f.value).toBeCloseTo(8.0, 0)
    expect(f.live).toBe(true)
  })

  test('MilesFromRotation', () => {
    const f = MilesFromRotation(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('MilesAroundSun', () => {
    const f = MilesAroundSun(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('MoonTrips', () => {
    const f = MoonTrips(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('ThroughTheGalaxy', () => {
    const f = ThroughTheGalaxy(ctx)
    expect(f.value).toBeGreaterThan(0)
  })
})

describe('fun-facts', () => {
  test('Blinks', () => {
    const f = Blinks(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('Breaths', () => {
    const f = Breaths(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('Meals', () => {
    const f = Meals(ctx)
    expect(f.value).toBe(Math.floor(2922 * 3))
  })

  test('Poops', () => {
    const f = Poops(ctx)
    expect(f.value).toBe(Math.floor(2922 * 1.2))
  })

  test('HairGrowth', () => {
    const f = HairGrowth(ctx)
    expect(f.value).toBeGreaterThan(0)
  })

  test('all facts return required fields', () => {
    const facts = [Blinks, Breaths, Meals, Poops, HairGrowth]
    for (const fn of facts) {
      const f = fn(ctx)
      expect(f.title).toBeTruthy()
      expect(f.value).toBeDefined()
      expect(f.prose).toBeTruthy()
      expect(f.math).toBeTruthy()
    }
  })
})
