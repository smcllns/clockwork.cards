import { describe, test, expect } from 'bun:test'
import { formatNumber, formatCompact, numberToWord } from './format'

describe('formatNumber', () => {
  test('formats integers with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  test('floors by default', () => {
    expect(formatNumber(1234.7)).toBe('1,234')
  })

  test('formats with decimals', () => {
    expect(formatNumber(1234.567, 1)).toBe('1,234.6')
  })
})

describe('formatCompact', () => {
  test('formats billions', () => {
    expect(formatCompact(1_500_000_000)).toBe('1.5B')
  })

  test('formats millions', () => {
    expect(formatCompact(2_300_000)).toBe('2.3M')
  })

  test('formats thousands', () => {
    expect(formatCompact(45_000)).toBe('45K')
  })

  test('formats small numbers normally', () => {
    expect(formatCompact(999)).toBe('999')
  })
})

describe('numberToWord', () => {
  test('single digits', () => {
    expect(numberToWord(0)).toBe('zero')
    expect(numberToWord(5)).toBe('five')
  })

  test('teens', () => {
    expect(numberToWord(13)).toBe('thirteen')
    expect(numberToWord(19)).toBe('nineteen')
  })

  test('tens', () => {
    expect(numberToWord(20)).toBe('twenty')
    expect(numberToWord(42)).toBe('forty-two')
  })

  test('100+ returns string', () => {
    expect(numberToWord(100)).toBe('100')
  })
})
