import { create } from "zustand"

type CardState = {
  name: string
  dob: string
  setName: (name: string) => void
  setDob: (dob: string) => void
}

const defaultDob = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 16)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
})()

export const useCardStore = create<CardState>((set) => ({
  name: "Birthday Star",
  dob: defaultDob,
  setName: (name) => set({ name }),
  setDob: (dob) => set({ dob }),
}))

