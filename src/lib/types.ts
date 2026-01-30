export type ParamDef = {
  default: number
  min: number
  max: number
  step?: number
  label: string
  unit?: string
}

export type MathStep = {
  label?: string
  line: string
  bold?: boolean
}

export type FactContext = {
  now: Date
  dob: Date
  name: string
  gender: 'boy' | 'girl' | 'neutral'
  [key: string]: any
}

export type FactData = {
  title: string
  value: number | string
  format?: 'compact' | 'number' | 'decimal1' | 'decimal2' | 'decimal3'
  subtitle?: string
  math?: MathStep[]
  prose?: string
  accent?: 'warm' | 'cool' | 'earth' | 'neutral'
  live?: boolean
}

export type FactFn = (ctx: FactContext) => FactData
