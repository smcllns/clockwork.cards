import { For, Show, JSX } from 'solid-js'
import type { SectionConfig, MetricContext } from '../types'
import { WidgetCard } from './WidgetCard'
import { Prose } from './Prose'
import { Editable } from './Editable'

interface SectionProps {
  config: SectionConfig
  ctx: MetricContext
}

export function Section(props: SectionProps): JSX.Element {
  const subtitle = () => {
    const s = props.config.subtitle
    if (!s) return undefined
    return s(props.ctx)
  }

  const mode = () => props.config.mode ?? 'mixed'

  return (
    <section>
      <div class="section-header" style={{ 'margin-bottom': '16px' }}>
        <h2 style={{ 'font-size': '20px', 'font-weight': '600', color: 'var(--foreground)' }}>
          <Editable id={`section-title-${props.config.id}`} default={props.config.title} />
        </h2>
        <Show when={subtitle()}>
          <p style={{ 'font-size': '13px', color: 'var(--muted-foreground)', 'margin-top': '2px' }}>
            {subtitle()}
          </p>
        </Show>
      </div>

      <Show when={mode() === 'cards' || mode() === 'mixed'}>
        <div
          class="mobile-scroll-container"
          style={{ display: 'grid', 'grid-template-columns': 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}
        >
          <For each={props.config.metrics}>
            {(metric) => (
              <WidgetCard
                metric={metric}
                ctx={props.ctx}
                settings={props.config.settings}
              />
            )}
          </For>
        </div>
      </Show>

      <Show when={mode() === 'prose'}>
        <Prose metrics={props.config.metrics} ctx={props.ctx} />
      </Show>

      <Show when={mode() === 'mixed'}>
        <div style={{ 'margin-top': '16px' }}>
          <Prose metrics={props.config.metrics} ctx={props.ctx} />
        </div>
      </Show>
    </section>
  )
}
