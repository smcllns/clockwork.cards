import { createSignal, createContext, useContext, onMount, onCleanup } from 'solid-js'

export function createStore(dob: Date, name: string, gender: 'boy' | 'girl' | 'neutral') {
  const [now, setNow] = createSignal(new Date())

  onMount(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    onCleanup(() => clearInterval(interval))
  })

  return { now, dob, name, gender }
}

export type Store = ReturnType<typeof createStore>

const StoreContext = createContext<Store>()

export const StoreProvider = StoreContext.Provider
export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used within StoreProvider')
  return store
}
