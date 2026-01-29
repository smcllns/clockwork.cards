import { createSignal, Show, For, JSX } from 'solid-js'
import { Slider } from './Slider'
import type { MetricConfig, MetricContext, MathStep, SliderConfig } from '../types'
import { formatNumber, formatCompact } from '../utils/format'
import { usePageState } from '../store'

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

interface WidgetCardProps {
  metric: MetricConfig
  ctx: MetricContext
  settings?: SliderConfig[]
}

export function WidgetCard(props: WidgetCardProps): JSX.Element {
  const [face, setFace] = createSignal<WidgetFace>('front')
  const pageState = usePageState()

  const handleCardClick = () => {
    if (face() === 'front') setFace('math')
    else if (face() === 'math') setFace('front')
  }

  const handleSettingsClick = (e: MouseEvent) => {
    e.stopPropagation()
    setFace(face() === 'settings' ? 'front' : 'settings')
  }

  const accent = () => accentColors[props.metric.accent ?? 'neutral']

  const cardTransform = (): string => {
    if (face() === 'math') return 'rotateY(180deg)'
    if (face() === 'settings') return 'rotateX(180deg)'
    return ''
  }

  const displayValue = () => {
    const raw = props.metric.value(props.ctx)
    return formatValue(raw, props.metric.format)
  }

  const subtitle = () => {
    const s = props.metric.subtitle
    if (!s) return undefined
    return typeof s === 'function' ? s(props.ctx) : s
  }

  const isStringValue = () => typeof props.metric.value(props.ctx) === 'string'

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
          class={`backface-hidden stat-card ${props.metric.live ? 'neon-border' : 'card-glow'}`}
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
          <Show when={props.settings?.length}>
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
          }}>{props.metric.title}</p>

          <p
            class={`font-mono tabular-nums ${props.metric.live ? 'glow counting' : ''}`}
            style={{
              'font-weight': '600',
              color: props.metric.live ? 'var(--primary)' : 'var(--foreground)',
              'font-size': isStringValue() ? '16px' : '24px',
              'line-height': '1.2',
            }}
          >
            {displayValue()}
          </p>

          <Show when={subtitle()}>
            <p style={{ 'font-size': '14px', color: 'var(--muted-foreground)', 'margin-top': '4px' }}>
              {subtitle()}
            </p>
          </Show>

          <div style={{ flex: '1' }} />
          <p style={{ 'font-size': '10px', color: 'var(--muted-foreground)', opacity: '0.5', 'text-align': 'right', 'margin-top': '8px' }}>
            tap for math
          </p>
        </div>

        {/* Math Face */}
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
          }}
        >
          <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'margin-bottom': '12px' }}>
            <p style={{ 'font-size': '11px', 'font-weight': '500', 'text-transform': 'uppercase', 'letter-spacing': '0.05em', color: 'var(--muted-foreground)' }}>
              The Math
            </p>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </div>
          <div class="font-mono" style={{ 'font-size': '14px', color: 'var(--foreground)', opacity: '0.9', overflow: 'auto', 'max-height': '180px' }}>
            <MathSteps steps={props.metric.math(props.ctx)} />
          </div>
        </div>

        {/* Settings Face */}
        <Show when={props.settings?.length}>
          <div
            class="backface-hidden rotate-x-180"
            style={{
              position: 'absolute',
              inset: '0',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              'border-radius': 'var(--radius)',
              padding: '16px',
              'border-left': `4px solid ${accent()}`,
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
              <For each={props.settings}>
                {(slider) => (
                  <div>
                    <div style={{ display: 'flex', 'justify-content': 'space-between', 'font-size': '12px', color: 'var(--muted-foreground)', 'margin-bottom': '8px' }}>
                      <span>{slider.label}</span>
                      <span class="font-mono" style={{ 'font-weight': '600', color: 'var(--foreground)' }}>
                        {formatNumber(props.ctx.settings[slider.key])}{slider.unit ?? ''}
                      </span>
                    </div>
                    <Slider
                      value={props.ctx.settings[slider.key]}
                      onChange={(v) => pageState.setSetting(slider.key, v)}
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                    />
                    <Show when={slider.marks}>
                      <div style={{ display: 'flex', 'justify-content': 'space-between', 'font-size': '10px', color: 'var(--muted-foreground)', 'margin-top': '4px' }}>
                        <For each={slider.marks}>
                          {(mark) => <span>{mark}</span>}
                        </For>
                      </div>
                    </Show>
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
