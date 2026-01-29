import { JSX, createEffect, createSignal } from 'solid-js'
import { usePageState } from '../store'

interface EditableProps {
  id: string
  default: string
  style?: JSX.CSSProperties
  class?: string
}

export function Editable(props: EditableProps): JSX.Element {
  const pageState = usePageState()
  let el: HTMLSpanElement | undefined

  const text = () => {
    const overrides = pageState.textOverrides()
    return overrides[props.id] ?? props.default
  }

  const [editing, setEditing] = createSignal(false)

  createEffect(() => {
    if (el && !editing()) {
      el.textContent = text()
    }
  })

  function handleBlur() {
    setEditing(false)
    if (!el) return
    const newText = (el.textContent ?? '').trim()
    if (newText === '' || newText === props.default) {
      pageState.clearTextOverride(props.id)
      el.textContent = props.default
    } else {
      pageState.setTextOverride(props.id, newText)
    }
  }

  function handleFocus() {
    setEditing(true)
  }

  return (
    <span
      ref={el}
      contentEditable
      onBlur={handleBlur}
      onFocus={handleFocus}
      spellcheck={false}
      style={{
        ...props.style,
        outline: 'none',
        cursor: 'text',
        'border-bottom': '1px dashed transparent',
      }}
      class={props.class}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderBottomColor = 'var(--muted-foreground)'
      }}
      onMouseLeave={(e) => {
        if (!editing()) {
          (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'
        }
      }}
    >
      {text()}
    </span>
  )
}
