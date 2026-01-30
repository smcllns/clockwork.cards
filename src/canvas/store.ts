import { createSignal, createContext, useContext, onMount, onCleanup } from 'solid-js'

const STORAGE_KEY = 'happy-metrics'

type StoredState = {
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

export function createStore(dob: Date, name: string, gender: 'boy' | 'girl' | 'neutral') {
  const stored = loadStored()

  const [now, setNow] = createSignal(new Date())
  const [textOverrides, setTextOverrides] = createSignal<Record<string, string>>(stored.textOverrides ?? {})

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  function setTextOverride(key: string, value: string) {
    setTextOverrides(prev => {
      const next = { ...prev, [key]: value }
      saveStored({ textOverrides: next })
      return next
    })
  }

  function clearTextOverride(key: string) {
    setTextOverrides(prev => {
      const next = { ...prev }
      delete next[key]
      saveStored({ textOverrides: next })
      return next
    })
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY)
    setTextOverrides({})
  }

  return { now, dob, name, gender, textOverrides, setTextOverride, clearTextOverride, resetAll }
}

export type Store = ReturnType<typeof createStore>

const StoreContext = createContext<Store>()

export const StoreProvider = StoreContext.Provider
export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used within StoreProvider')
  return store
}
