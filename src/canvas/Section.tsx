import { createSignal, For, Show, JSX } from 'solid-js'
import type { FactFn, FactData, ParamDef } from '../lib/types'
import { FlipCard } from '../widgets/FlipCard'
import { Editable } from '../widgets/Editable'
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
          <Editable
            id={`section-title-${props.name}`}
            default={props.name}
            textOverrides={store.textOverrides()}
            onOverride={store.setTextOverride}
            onClear={store.clearTextOverride}
          />
        </h2>
        <Show when={props.subtitle}>
          <p style={{ 'font-size': '13px', color: 'var(--muted-foreground)', 'margin-top': '2px' }}>
            {props.subtitle}
          </p>
        </Show>
      </div>

      <div
        class="mobile-scroll-container"
        style={{ display: 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}
      >
        <For each={facts()}>
          {(fact) => (
            <FlipCard
              fact={fact}
              params={props.params}
              paramValues={paramValues()}
              onParamChange={updateParam}
            />
          )}
        </For>
      </div>
    </section>
  )
}
