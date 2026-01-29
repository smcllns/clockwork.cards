import { createSignal, Show, For, JSX } from 'solid-js'
import type { MetricConfig, MetricContext, MathStep } from '../types'

interface ProseProps {
  metrics: MetricConfig[]
  ctx: MetricContext
}

export function Prose(props: ProseProps): JSX.Element {
  const [expanded, setExpanded] = createSignal<string | null>(null)

  return (
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '8px' }}>
      <For each={props.metrics}>
        {(metric) => (
          <div
            onClick={() => setExpanded(expanded() === metric.id ? null : metric.id)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              'border-radius': 'var(--radius)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            class="card-glow"
          >
            <p style={{ 'font-size': '16px', color: 'var(--foreground)', 'line-height': '1.5' }}>
              {metric.prose(props.ctx)}
            </p>
            <Show when={expanded() === metric.id}>
              <div class="font-mono" style={{
                'font-size': '13px',
                color: 'var(--muted-foreground)',
                'margin-top': '8px',
                'padding-top': '8px',
                'border-top': '1px solid var(--border)',
                display: 'flex',
                'flex-direction': 'column',
                gap: '4px',
              }}>
                <ProseSteps steps={metric.math(props.ctx)} />
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  )
}

function ProseSteps(props: { steps: MathStep[] }): JSX.Element {
  return (
    <>
      <For each={props.steps}>
        {(step) => (
          <p style={{
            'font-weight': step.bold ? '600' : undefined,
            'font-size': step.label && !step.bold ? '11px' : undefined,
            color: step.label ? 'var(--muted-foreground)' : undefined,
          }}>
            {step.label ?? step.line}
          </p>
        )}
      </For>
    </>
  )
}
