// widgets/FlipCard.tsx — example widget (proprietary, users don't modify)
//
// Receives Fact (plain data) + param definitions for auto-generating controls.
// No model logic here — just rendering.
// All visual styling via semantic classes in widget-FlipCard.css.

import { createSignal, Show, For, JSX } from 'solid-js'
import { Slider } from '../src/components/Slider'
import type { Fact, ParamDef } from './types'
import { formatNumber, formatCompact } from '../src/utils/format'

type Face = 'front' | 'math' | 'settings'

const accentVar = {
  warm: 'var(--chart-1)',
  cool: 'var(--chart-2)',
  earth: 'var(--chart-3)',
  neutral: 'var(--muted-foreground)',
} as const

function formatValue(value: number | string, format?: string): string {
  if (typeof value === 'string') return value
  switch (format) {
    case 'compact': return formatCompact(value)
    case 'decimal1': return formatNumber(value, 1)
    case 'decimal2': return formatNumber(value, 2)
    case 'decimal3': return formatNumber(value, 3)
    case 'number':
    default: return formatNumber(value)
  }
}

interface FlipCardProps {
  fact: Fact
  params?: Record<string, ParamDef>
  paramValues?: Record<string, number>
  onParamChange?: (key: string, value: number) => void
}

export function FlipCard(props: FlipCardProps): JSX.Element {
  const [face, setFace] = createSignal<Face>('front')

  const handleCardClick = () => {
    setFace(face() === 'front' ? 'math' : 'front')
  }

  const handleSettingsClick = (e: MouseEvent) => {
    e.stopPropagation()
    setFace(face() === 'settings' ? 'front' : 'settings')
  }

  const hasParams = () => props.params && Object.keys(props.params).length > 0

  const cardTransform = (): string => {
    if (face() === 'math') return 'rotateY(180deg)'
    if (face() === 'settings') return 'rotateX(180deg)'
    return ''
  }

  return (
    <div
      class="flip-card"
      style={{ '--accent': accentVar[props.fact.accent ?? 'neutral'] }}
    >
      <div
        class="flip-card-inner"
        style={{ transform: cardTransform() }}
      >
        {/* Front Face */}
        <div
          onClick={handleCardClick}
          class={`flip-card-face flip-card-front ${props.fact.live ? 'neon-border' : 'card-glow'}`}
        >
          <Show when={hasParams()}>
            <button onClick={handleSettingsClick} class="flip-card-settings-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </Show>

          <p class="flip-card-title">{props.fact.title}</p>

          <p class={`flip-card-value font-mono tabular-nums ${props.fact.live ? 'glow counting' : ''}`}>
            {formatValue(props.fact.value, props.fact.format)}
          </p>

          <Show when={props.fact.subtitle}>
            <p class="flip-card-subtitle">{props.fact.subtitle}</p>
          </Show>

          <div class="flip-card-spacer" />
          <p class="flip-card-hint">tap for math</p>
        </div>

        {/* Math Face */}
        <div
          onClick={handleCardClick}
          class="flip-card-face flip-card-math backface-hidden rotate-y-180"
        >
          <div class="flip-card-face-header">
            <p class="flip-card-face-label">The Math</p>
          </div>
          <div class="flip-card-math-steps font-mono">
            <For each={props.fact.math}>
              {(step) => (
                <p class={`math-step ${step.bold ? 'math-step-bold' : ''} ${step.label && !step.bold ? 'math-step-label' : ''}`}>
                  {step.label ?? step.line}
                </p>
              )}
            </For>
          </div>
        </div>

        {/* Settings Face — auto-generated from model params */}
        <Show when={hasParams()}>
          <div class="flip-card-face flip-card-settings backface-hidden rotate-x-180">
            <div class="flip-card-face-header">
              <p class="flip-card-face-label">Adjust Variables</p>
              <button onClick={handleSettingsClick} class="flip-card-close-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div class="flip-card-sliders">
              <For each={Object.entries(props.params!)}>
                {([key, def]) => (
                  <div class="flip-card-slider-group">
                    <div class="flip-card-slider-header">
                      <span>{def.label}</span>
                      <span class="flip-card-slider-value font-mono">
                        {formatNumber(props.paramValues?.[key] ?? def.default)}{def.unit ?? ''}
                      </span>
                    </div>
                    <Slider
                      value={props.paramValues?.[key] ?? def.default}
                      onChange={(v) => props.onParamChange?.(key, v)}
                      min={def.min}
                      max={def.max}
                      step={def.step ?? 1}
                    />
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}
