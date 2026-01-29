export type AccentColor = 'warm' | 'cool' | 'earth' | 'neutral'

export type MetricContext = {
  birthDate: Date
  now: Date
  name: string
  settings: {
    sleepHours: number
    bpm: number
    stepsPerDay: number
    strideInches: number
    walkingAge: number
  }
}

export type MathStep = {
  label?: string
  line: string
  bold?: boolean
}

export type MetricConfig = {
  id: string
  title: string
  value: (ctx: MetricContext) => number | string
  format?: 'compact' | 'number' | 'decimal1' | 'decimal2' | 'decimal3'
  subtitle?: string | ((ctx: MetricContext) => string)
  math: (ctx: MetricContext) => MathStep[]
  prose: (ctx: MetricContext) => string
  accent?: AccentColor
  live?: boolean
}

export type SliderConfig = {
  key: keyof MetricContext['settings']
  label: string
  min: number
  max: number
  step: number
  unit?: string
  marks?: string[]
}

export type SectionConfig = {
  id: string
  title: string
  subtitle?: (ctx: MetricContext) => string
  settings?: SliderConfig[]
  metrics: MetricConfig[]
  mode?: 'cards' | 'prose' | 'mixed'
}
