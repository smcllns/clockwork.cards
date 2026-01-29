import { createSignal, createContext, useContext, onMount, onCleanup } from 'solid-js'
import type { MetricContext } from './types'

const STORAGE_KEY = 'happy-metrics'

type StoredState = {
  settings: MetricContext['settings']
  textOverrides: Record<string, string>
}

function loadStored(): Partial<StoredState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function saveStored(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const DEFAULTS: MetricContext['settings'] = {
  sleepHours: 10,
  bpm: 90,
  stepsPerDay: 8000,
  strideInches: 20,
  walkingAge: 1,
}

export function createPageState(birthDate: Date, name: string) {
  const stored = loadStored()
  const initialSettings = { ...DEFAULTS, ...stored.settings }

  const [now, setNow] = createSignal(new Date())
  const [sleepHours, setSleepHours] = createSignal(initialSettings.sleepHours)
  const [bpm, setBpm] = createSignal(initialSettings.bpm)
  const [stepsPerDay, setStepsPerDay] = createSignal(initialSettings.stepsPerDay)
  const [strideInches, setStrideInches] = createSignal(initialSettings.strideInches)
  const [walkingAge, setWalkingAge] = createSignal(initialSettings.walkingAge)
  const [textOverrides, setTextOverrides] = createSignal<Record<string, string>>(stored.textOverrides ?? {})

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  function settings(): MetricContext['settings'] {
    return {
      sleepHours: sleepHours(),
      bpm: bpm(),
      stepsPerDay: stepsPerDay(),
      strideInches: strideInches(),
      walkingAge: walkingAge(),
    }
  }

  function ctx(): MetricContext {
    return { birthDate, now: now(), name, settings: settings() }
  }

  function persist() {
    saveStored({ settings: settings(), textOverrides: textOverrides() })
  }

  function setSetting(key: keyof MetricContext['settings'], value: number) {
    const setters: Record<keyof MetricContext['settings'], (v: number) => void> = {
      sleepHours: setSleepHours,
      bpm: setBpm,
      stepsPerDay: setStepsPerDay,
      strideInches: setStrideInches,
      walkingAge: setWalkingAge,
    }
    setters[key](value)
    persist()
  }

  function setTextOverride(key: string, value: string) {
    setTextOverrides(prev => {
      const next = { ...prev, [key]: value }
      saveStored({ settings: settings(), textOverrides: next })
      return next
    })
  }

  function clearTextOverride(key: string) {
    setTextOverrides(prev => {
      const next = { ...prev }
      delete next[key]
      saveStored({ settings: settings(), textOverrides: next })
      return next
    })
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY)
    setSleepHours(DEFAULTS.sleepHours)
    setBpm(DEFAULTS.bpm)
    setStepsPerDay(DEFAULTS.stepsPerDay)
    setStrideInches(DEFAULTS.strideInches)
    setWalkingAge(DEFAULTS.walkingAge)
    setTextOverrides({})
  }

  return { ctx, setSetting, textOverrides, setTextOverride, clearTextOverride, resetAll }
}

export type PageState = ReturnType<typeof createPageState>

const PageContext = createContext<PageState>()

export const PageProvider = PageContext.Provider
export function usePageState(): PageState {
  const ctx = useContext(PageContext)
  if (!ctx) throw new Error('usePageState must be used within PageProvider')
  return ctx
}
