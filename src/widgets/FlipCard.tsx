import { createSignal, Show, For, JSX } from 'solid-js'
import type { FactData, MathStep } from '../lib/types'
import { formatNumber, formatCompact } from '../lib/format'

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
}

export function FlipCard(props: FlipCardProps): JSX.Element {
  const [flipped, setFlipped] = createSignal(false)

  const toggle = () => setFlipped(!flipped())

  const accent = () => accentColors[props.fact.accent ?? 'neutral']
  const displayValue = () => formatValue(props.fact.value, props.fact.format)
  const isStringValue = () => typeof props.fact.value === 'string'

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
          transform: flipped() ? 'rotateY(180deg)' : '',
        }}
      >
        {/* Front Face */}
        <div
          onClick={toggle}
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
            onClick={toggle}
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
              display: 'flex',
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
