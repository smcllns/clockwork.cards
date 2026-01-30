import { createSignal, Show, Index, For, JSX } from 'solid-js'
import type { FactFn, FactData, MathStep } from '../lib/types'
import { useStore } from './store'

interface ProseProps {
  facts: FactFn[]
}

export function Prose(props: ProseProps): JSX.Element {
  const store = useStore()
  const [expanded, setExpanded] = createSignal<number | null>(null)

  const ctx = () => ({
    now: store.now(),
    dob: store.dob,
    name: store.name,
    gender: store.gender,
  })

  const facts = (): FactData[] => props.facts.map(fn => fn(ctx()))

  return (
    <div style={{ display: 'flex', 'flex-direction': 'column', gap: '8px' }}>
      <Index each={facts()}>
        {(fact, i) => (
          <div
            onClick={() => setExpanded(expanded() === i ? null : i)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              'border-radius': 'var(--radius)',
              padding: '16px',
              cursor: fact().math ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            class="card-glow"
          >
            <p style={{ 'font-size': '16px', color: 'var(--foreground)', 'line-height': '1.5' }}>
              {fact().prose}
            </p>
            <Show when={expanded() === i && fact().math}>
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
                <ProseSteps steps={fact().math!} />
              </div>
            </Show>
          </div>
        )}
      </Index>
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
