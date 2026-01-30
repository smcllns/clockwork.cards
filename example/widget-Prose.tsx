// widgets/Prose.tsx — example widget (proprietary)
//
// Renders facts as prose sentences with tap-to-expand math.
// All visual styling via semantic classes in widget-Prose.css.

import { createSignal, For, Show, JSX } from 'solid-js'
import type { Fact } from './types'

interface ProseProps {
  facts: Fact[]
}

export function Prose(props: ProseProps): JSX.Element {
  const [expanded, setExpanded] = createSignal<string | null>(null)

  return (
    <div class="prose-list">
      <For each={props.facts}>
        {(fact) => (
          <div
            onClick={() => setExpanded(expanded() === fact.id ? null : fact.id)}
            class="prose-card card-glow"
          >
            <p class="prose-text">{fact.prose}</p>
            <Show when={expanded() === fact.id}>
              <div class="prose-math font-mono">
                <For each={fact.math}>
                  {(step) => (
                    <p class={`math-step ${step.bold ? 'math-step-bold' : ''} ${step.label ? 'math-step-label' : ''}`}>
                      {step.label ?? step.line}
                    </p>
                  )}
                </For>
              </div>
            </Show>
          </div>
        )}
      </For>
    </div>
  )
}
