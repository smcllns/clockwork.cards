import { create } from "zustand";

export const useTheme = create<{ shiny: boolean; toggle: () => void }>((set) => ({
  shiny: false,
  toggle: () => set(s => {
    const next = !s.shiny;
    document.documentElement.classList.toggle("shiny", next);
    return { shiny: next };
  }),
}));
