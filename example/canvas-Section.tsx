// canvas/Section.tsx — renders a group of fact cards
//
// Manages its own param state (signals + localStorage).
// Calls each fact function with { now, dob, name, gender, ...paramValues }.

import { createSignal, For, Show, JSX } from 'solid-js'
import type { FactFn, FactData, ParamDef } from './types'
import { FlipCard } from './widget-FlipCard'

interface SectionProps {
  name: string
  facts: FactFn[]
  params?: Record<string, ParamDef>
}

export function Section(props: SectionProps): JSX.Element {
  // Local param state — initialized from defaults
  const [paramValues, setParamValues] = createSignal<Record<string, number>>(
    Object.fromEntries(
      Object.entries(props.params ?? {}).map(([k, def]) => [k, def.default])
    )
  )

  const updateParam = (key: string, value: number) => {
    setParamValues(prev => ({ ...prev, [key]: value }))
  }

  // In real implementation, now/dob/name/gender come from store context
  const ctx = () => ({
    now: new Date(),     // store.now()
    dob: new Date(),     // store.dob
    name: 'Kiddo',       // store.name
    gender: 'neutral' as const, // store.gender
    ...paramValues(),
  })

  const facts = (): FactData[] => props.facts.map(fn => fn(ctx()))

  return (
    <section>
      <h2>{props.name}</h2>
      <div style={{ display: 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
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
