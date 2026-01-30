import { describe, test, expect } from 'bun:test'
import { SPACE, getDistanceComparison } from './constants'

describe('SPACE constants', () => {
  test('has expected values', () => {
    expect(SPACE.ROTATION_MPH).toBe(1040)
    expect(SPACE.ORBIT_MPH).toBe(67000)
    expect(SPACE.GALAXY_MPH).toBe(450000)
    expect(SPACE.MOON_DISTANCE).toBe(238900)
  })
})

describe('getDistanceComparison', () => {
  test('short distance', () => {
    expect(getDistanceComparison(50)).toBe('a few towns over')
  })

  test('medium distance', () => {
    expect(getDistanceComparison(500)).toBe('New York to Chicago')
  })

  test('long distance', () => {
    expect(getDistanceComparison(5000)).toBe('across the USA and back')
  })
})
