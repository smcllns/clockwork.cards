"use client"

import { useState, useEffect } from "react"
import { Palette } from "lucide-react"

export type ThemeId = "minimalist" | "terminal" | "rainbow" | "cyberpunk" | "fairy"

interface Theme {
  id: ThemeId
  name: string
  description: string
  preview: {
    bg: string
    primary: string
    accent: string
  }
}

const themes: Theme[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean & professional",
    preview: {
      bg: "bg-stone-100",
      primary: "bg-amber-700",
      accent: "bg-teal-600",
    },
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Hacker mode",
    preview: {
      bg: "bg-zinc-900",
      primary: "bg-green-500",
      accent: "bg-green-700",
    },
  },
  {
    id: "rainbow",
    name: "Rainbow",
    description: "Bright & playful",
    preview: {
      bg: "bg-pink-100",
      primary: "bg-pink-500",
      accent: "bg-yellow-400",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon nights",
    preview: {
      bg: "bg-indigo-950",
      primary: "bg-pink-500",
      accent: "bg-cyan-400",
    },
  },
  {
    id: "fairy",
    name: "Fairy",
    description: "Soft & magical",
    preview: {
      bg: "bg-purple-100",
      primary: "bg-purple-400",
      accent: "bg-teal-300",
    },
  },
]

interface ThemeSwitcherProps {
  onThemeChange?: (theme: ThemeId) => void
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("cyberpunk")

  useEffect(() => {
    // Check URL param for theme
    const params = new URLSearchParams(window.location.search)
    const themeParam = params.get("theme") as ThemeId | null
    if (themeParam && themes.some((t) => t.id === themeParam)) {
      setCurrentTheme(themeParam)
      applyTheme(themeParam)
    }
  }, [])

  const applyTheme = (themeId: ThemeId) => {
    const root = document.documentElement
    
    // Remove all theme classes
    root.classList.remove("theme-terminal", "theme-rainbow", "theme-minimalist", "theme-fairy")
    
    // Add new theme class (cyberpunk uses :root defaults now)
    if (themeId !== "cyberpunk") {
      root.classList.add(`theme-${themeId}`)
    }

    // Update URL without reload
    const url = new URL(window.location.href)
    if (themeId === "cyberpunk") {
      url.searchParams.delete("theme")
    } else {
      url.searchParams.set("theme", themeId)
    }
    window.history.replaceState({}, "", url.toString())
  }

  const handleThemeSelect = (themeId: ThemeId) => {
    setCurrentTheme(themeId)
    applyTheme(themeId)
    onThemeChange?.(themeId)
    setIsOpen(false)
  }

  const current = themes.find((t) => t.id === currentTheme)!

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Collapsed button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all text-sm font-medium text-foreground"
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">{current.name}</span>
        </button>
      )}

      {/* Expanded panel */}
      {isOpen && (
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 w-72 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Choose a vibe</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Done
            </button>
          </div>

          <div className="space-y-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all
                  ${currentTheme === theme.id 
                    ? "bg-primary/10 ring-2 ring-primary" 
                    : "hover:bg-muted"
                  }
                `}
              >
                {/* Color preview */}
                <div className={`w-10 h-10 rounded-lg ${theme.preview.bg} flex items-center justify-center overflow-hidden border border-border/50`}>
                  <div className="flex gap-0.5">
                    <div className={`w-2 h-6 ${theme.preview.primary} rounded-sm`} />
                    <div className={`w-2 h-4 ${theme.preview.accent} rounded-sm mt-1`} />
                  </div>
                </div>

                {/* Theme info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">{theme.name}</p>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                </div>

                {/* Selected indicator */}
                {currentTheme === theme.id && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
