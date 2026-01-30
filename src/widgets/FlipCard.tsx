import { createSignal, Show, For, JSX } from 'solid-js'
import { Slider } from './Slider'
import type { FactData, MathStep, ParamDef } from '../lib/types'
import { formatNumber, formatCompact } from '../lib/format'

type WidgetFace = 'front' | 'math' | 'settings'

const accentColors = {
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
  fact: FactData
  params?: Record<string, ParamDef>
  paramValues?: Record<string, number>
  onParamChange?: (key: string, value: number) => void
}

export function FlipCard(props: FlipCardProps): JSX.Element {
  const [face, setFace] = createSignal<WidgetFace>('front')

  const handleCardClick = () => {
    if (face() === 'front') setFace('math')
    else if (face() === 'math') setFace('front')
  }

  const handleSettingsClick = (e: MouseEvent) => {
    e.stopPropagation()
    setFace(face() === 'settings' ? 'front' : 'settings')
  }

  const accent = () => accentColors[props.fact.accent ?? 'neutral']

  const cardTransform = (): string => {
    if (face() === 'math' || face() === 'settings') return 'rotateY(180deg)'
    return ''
  }

  const displayValue = () => formatValue(props.fact.value, props.fact.format)
  const isStringValue = () => typeof props.fact.value === 'string'
  const hasParams = () => props.params && Object.keys(props.params).length > 0

  return (
    <div class="perspective-1000" style={{ height: '100%' }}>
      <div
        class="transform-style-preserve-3d"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          'min-height': '160px',
          transition: 'transform 0.5s',
          transform: cardTransform(),
        }}
      >
        {/* Front Face */}
        <div
          onClick={handleCardClick}
          class={`backface-hidden stat-card ${props.fact.live ? 'neon-border' : 'card-glow'}`}
          style={{
            position: 'absolute',
            inset: '0',
            cursor: 'pointer',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            'border-radius': 'var(--radius)',
            padding: '12px 16px',
            display: 'flex',
            'flex-direction': 'column',
            'border-left': `4px solid ${accent()}`,
            transition: 'all 0.2s',
          }}
        >
          <Show when={hasParams()}>
            <button
              onClick={handleSettingsClick}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '6px',
                background: 'transparent',
                border: 'none',
                'border-radius': '6px',
                cursor: 'pointer',
                color: 'var(--muted-foreground)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </Show>

          <p style={{
            'font-size': '11px',
            'font-weight': '500',
            'text-transform': 'uppercase',
            'letter-spacing': '0.05em',
            color: 'var(--muted-foreground)',
            'margin-bottom': '8px',
          }}>{props.fact.title}</p>

          <p
            class={`font-mono tabular-nums ${props.fact.live ? 'glow counting' : ''}`}
            style={{
              'font-weight': '600',
              color: props.fact.live ? 'var(--primary)' : 'var(--foreground)',
              'font-size': isStringValue() ? '16px' : '24px',
              'line-height': '1.2',
            }}
          >
            {displayValue()}
          </p>

          <Show when={props.fact.subtitle}>
            <p style={{ 'font-size': '14px', color: 'var(--muted-foreground)', 'margin-top': '4px' }}>
              {props.fact.subtitle}
            </p>
          </Show>

          <div style={{ flex: '1' }} />
          <Show when={props.fact.math}>
            <p style={{ 'font-size': '10px', color: 'var(--muted-foreground)', opacity: '0.5', 'text-align': 'right', 'margin-top': '8px' }}>
              tap for math
            </p>
          </Show>
        </div>

        {/* Math Face */}
        <Show when={props.fact.math}>
          <div
            onClick={handleCardClick}
            class="backface-hidden rotate-y-180"
            style={{
              position: 'absolute',
              inset: '0',
              cursor: 'pointer',
              background: 'color-mix(in oklch, var(--muted) 50%, transparent)',
              border: '1px solid var(--border)',
              'border-radius': 'var(--radius)',
              padding: '16px',
              'border-left': `4px solid ${accent()}`,
              display: face() === 'settings' ? 'none' : 'flex',
              'flex-direction': 'column',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'margin-bottom': '12px', 'flex-shrink': '0' }}>
              <p style={{ 'font-size': '11px', 'font-weight': '500', 'text-transform': 'uppercase', 'letter-spacing': '0.05em', color: 'var(--muted-foreground)' }}>
                The Math
              </p>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </div>
            <div class="font-mono" style={{ 'font-size': '14px', color: 'var(--foreground)', opacity: '0.9', overflow: 'auto', flex: '1', 'min-height': '0' }}>
              <MathSteps steps={props.fact.math!} />
            </div>
          </div>
        </Show>

        {/* Settings Face */}
        <Show when={hasParams()}>
          <div
            class="backface-hidden rotate-y-180"
            style={{
              position: 'absolute',
              inset: '0',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              'border-radius': 'var(--radius)',
              padding: '16px',
              'border-left': `4px solid ${accent()}`,
              display: face() === 'math' ? 'none' : undefined,
            }}
          >
            <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'margin-bottom': '12px' }}>
              <p style={{ 'font-size': '11px', 'font-weight': '500', 'text-transform': 'uppercase', 'letter-spacing': '0.05em', color: 'var(--muted-foreground)' }}>
                Adjust Variables
              </p>
              <button
                onClick={handleSettingsClick}
                style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', 'border-radius': '4px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', 'flex-direction': 'column', gap: '16px' }}>
              <For each={Object.entries(props.params ?? {})}>
                {([key, def]) => (
                  <div>
                    <div style={{ display: 'flex', 'justify-content': 'space-between', 'font-size': '12px', color: 'var(--muted-foreground)', 'margin-bottom': '8px' }}>
                      <span>{def.label}</span>
                      <span class="font-mono" style={{ 'font-weight': '600', color: 'var(--foreground)' }}>
                        {formatNumber(props.paramValues?.[key] ?? def.default)}{def.unit ?? ''}
                      </span>
                    </div>
                    <Slider
                      value={props.paramValues?.[key] ?? def.default}
                      onChange={(v) => props.onParamChange?.(key, v)}
                      min={def.min}
                      max={def.max}
                      step={def.step}
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

function MathSteps(props: { steps: MathStep[] }): JSX.Element {
  return (
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '8px' }}>
      <For each={props.steps}>
        {(step) => (
          <p style={{
            'font-weight': step.bold ? '600' : undefined,
            'font-size': step.label && !step.bold ? '12px' : undefined,
            color: step.label && !step.bold ? 'var(--muted-foreground)' : undefined,
            'margin-top': step.label && !step.bold ? '8px' : undefined,
          }}>
            {step.label ?? step.line}
          </p>
        )}
      </For>
    </div>
  )
}
