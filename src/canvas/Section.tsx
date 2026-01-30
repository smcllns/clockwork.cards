import { createSignal, For, Index, Show, JSX } from 'solid-js'
import type { FactFn, FactData, ParamDef } from '../lib/types'
import { formatNumber } from '../lib/format'
import { FlipCard } from '../widgets/FlipCard'
import { Slider } from '../widgets/Slider'
import { useStore } from './store'

const PARAM_STORAGE_PREFIX = 'happy-metrics.params.'

function loadParams(sectionName: string, defaults: Record<string, number>): Record<string, number> {
  try {
    const raw = localStorage.getItem(PARAM_STORAGE_PREFIX + sectionName)
    if (raw) return { ...defaults, ...JSON.parse(raw) }
  } catch {}
  return defaults
}

function saveParams(sectionName: string, values: Record<string, number>) {
  localStorage.setItem(PARAM_STORAGE_PREFIX + sectionName, JSON.stringify(values))
}

interface SectionProps {
  name: string
  facts: FactFn[]
  params?: Record<string, ParamDef>
  subtitle?: string
}

export function Section(props: SectionProps): JSX.Element {
  const store = useStore()

  const defaults = Object.fromEntries(
    Object.entries(props.params ?? {}).map(([k, def]) => [k, def.default])
  )

  const [paramValues, setParamValues] = createSignal<Record<string, number>>(
    loadParams(props.name, defaults)
  )
  const [editing, setEditing] = createSignal(false)

  const updateParam = (key: string, value: number) => {
    setParamValues(prev => {
      const next = { ...prev, [key]: value }
      saveParams(props.name, next)
      return next
    })
  }

  const ctx = () => ({
    now: store.now(),
    dob: store.dob,
    name: store.name,
    gender: store.gender,
    ...paramValues(),
  })

  const facts = (): FactData[] => props.facts.map(fn => fn(ctx()))

  return (
    <section>
      <div class="section-header" style={{ 'margin-bottom': '16px' }}>
        <h2 style={{ 'font-size': '20px', 'font-weight': '600', color: 'var(--foreground)' }}>
          {props.name}
        </h2>
        <Show when={props.subtitle}>
          <p style={{ 'font-size': '13px', color: 'var(--muted-foreground)', 'margin-top': '2px' }}>
            {props.subtitle}
          </p>
        </Show>
      </div>

      <Show when={props.params}>
        <div style={{ display: 'flex', 'align-items': 'center', gap: '12px', 'margin-bottom': '16px', 'flex-wrap': 'wrap' }}>
          <For each={Object.entries(props.params!)}>
            {([key, def]) => (
              <Show when={editing()} fallback={
                <span style={{ 'font-size': '12px', color: 'var(--muted-foreground)' }}>
                  {def.label}: <span class="font-mono" style={{ 'font-weight': '600', color: 'var(--foreground)' }}>{formatNumber(paramValues()[key] ?? def.default)}{def.unit ? ` ${def.unit}` : ''}</span>
                </span>
              }>
                <div style={{ flex: '1', 'min-width': '160px', 'max-width': '280px' }}>
                  <div style={{ display: 'flex', 'justify-content': 'space-between', 'font-size': '12px', color: 'var(--muted-foreground)', 'margin-bottom': '6px' }}>
                    <span>{def.label}</span>
                    <span class="font-mono" style={{ 'font-weight': '600', color: 'var(--foreground)' }}>
                      {formatNumber(paramValues()[key] ?? def.default)}{def.unit ? ` ${def.unit}` : ''}
                    </span>
                  </div>
                  <Slider
                    value={paramValues()[key] ?? def.default}
                    onChange={(v) => updateParam(key, v)}
                    min={def.min}
                    max={def.max}
                    step={def.step}
                  />
                </div>
              </Show>
            )}
          </For>
          <button
            onClick={() => setEditing(!editing())}
            style={{
              padding: '4px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: editing() ? 'var(--primary)' : 'var(--muted-foreground)',
              'margin-left': 'auto',
            }}
            title="Adjust parameters"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </Show>

      <div
        class="mobile-scroll-container"
        style={{ display: 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}
      >
        <Index each={facts()}>
          {(fact) => (
            <FlipCard fact={fact()} />
          )}
        </Index>
      </div>
    </section>
  )
}
