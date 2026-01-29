"use client"

import React from "react"

import { useState, type ReactNode } from "react"
import { Settings, X, RotateCcw } from "lucide-react"

type WidgetFace = "front" | "math" | "settings"

interface StatWidgetProps {
  title: string
  headline: ReactNode
  subtitle?: string
  secondaryValue?: ReactNode
  secondaryLabel?: string
  mathContent: ReactNode
  settingsContent?: ReactNode
  accentColor?: "warm" | "cool" | "earth" | "neutral"
  live?: boolean
}

const accentStyles = {
  warm: "border-l-chart-1",
  cool: "border-l-chart-2",
  earth: "border-l-chart-3",
  neutral: "border-l-muted-foreground",
}

export function StatWidget({
  title,
  headline,
  subtitle,
  secondaryValue,
  secondaryLabel,
  mathContent,
  settingsContent,
  accentColor = "neutral",
  live = false,
}: StatWidgetProps) {
  const [face, setFace] = useState<WidgetFace>("front")

  const handleCardClick = () => {
    if (face === "front") {
      setFace("math")
    } else if (face === "math") {
      setFace("front")
    }
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFace(face === "settings" ? "front" : "settings")
  }

  const isStringHeadline = typeof headline === "string"

  return (
    <div className="perspective-1000 h-full">
      <div
        className={`
          relative w-full h-full min-h-[160px] transition-transform duration-500 transform-style-preserve-3d
          ${face === "math" ? "rotate-y-180" : ""}
          ${face === "settings" ? "rotate-x-180" : ""}
        `}
      >
        {/* Front Face */}
        <div
          onClick={handleCardClick}
          className={`
            absolute inset-0 backface-hidden cursor-pointer stat-card
            bg-card border border-border rounded-lg p-3 sm:p-4 flex flex-col
            border-l-4 ${accentStyles[accentColor]}
            hover:shadow-md transition-all active:scale-[0.98]
            ${live ? "ring-1 ring-primary/30 neon-border" : "card-glow"}
          `}
        >
          {settingsContent && (
            <button
              onClick={handleSettingsClick}
              className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            {title}
          </p>

          <p className={`font-semibold text-foreground ${isStringHeadline ? "text-base sm:text-lg md:text-xl leading-tight" : "text-xl sm:text-2xl md:text-3xl font-mono tabular-nums"} ${live ? "text-primary glow counting" : ""}`}>
            {headline}
          </p>

          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}

          {secondaryValue && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-lg font-medium text-foreground/80 font-mono tabular-nums">
                {secondaryValue}
              </p>
              {secondaryLabel && (
                <p className="text-xs text-muted-foreground">{secondaryLabel}</p>
              )}
            </div>
          )}

          <div className="flex-1" />
          <p className="text-[10px] text-muted-foreground/50 text-right mt-2">
            tap for math
          </p>
        </div>

        {/* Math Face (Back - Y rotation) */}
        <div
          onClick={handleCardClick}
          className={`
            absolute inset-0 backface-hidden cursor-pointer rotate-y-180
            bg-muted/50 border border-border rounded-lg p-4
            border-l-4 ${accentStyles[accentColor]}
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              The Math
            </p>
            <RotateCcw className="w-3 h-3 text-muted-foreground" />
          </div>

          <div className="text-sm font-mono space-y-2 text-foreground/90 overflow-auto max-h-[180px]">
            {mathContent}
          </div>
        </div>

        {/* Settings Face (Bottom - X rotation) */}
        {settingsContent && (
          <div
            className={`
              absolute inset-0 backface-hidden rotate-x-180
              bg-card border border-border rounded-lg p-4
              border-l-4 ${accentStyles[accentColor]}
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Adjust Variables
              </p>
              <button
                onClick={handleSettingsClick}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {settingsContent}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
