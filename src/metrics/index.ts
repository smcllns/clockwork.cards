import type { SectionConfig } from '../types'
import { timeAlive } from './time-alive'
import { sleep } from './sleep'
import { heartbeats } from './heartbeats'
import { steps } from './steps'
import { space } from './space'
import { funFacts } from './fun-facts'

export const ALL_SECTIONS: SectionConfig[] = [
  timeAlive,
  sleep,
  heartbeats,
  steps,
  space,
  funFacts,
]
