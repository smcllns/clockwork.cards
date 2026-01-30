import { createSignal, onMount, onCleanup, Show, For, JSX } from 'solid-js'
import { useStore } from './store'
import { getAge, getTimeAlive, diffHours } from '../lib/time'
import { formatNumber, formatCompact, numberToWord, formatDate } from '../lib/format'
import { SPACE } from '../lib/constants'
import { Confetti } from '../widgets/Confetti'
import type { FactFn, MathStep, ParamDef } from '../lib/types'

import { TotalBeats } from '../models/heartbeats'
import { TotalHoursSlept } from '../models/sleep'
import { MilesWalked } from '../models/steps'
import { TripsAroundSun, MilesAroundSun } from '../models/space'
import { Breaths, Meals, Poops, HairGrowth, Blinks, params as funFactParams } from '../models/fun-facts'

const PARAM_STORAGE_PREFIX = 'happy-metrics.params.'

function loadParam(key: string, def: number): number {
  try {
    const raw = localStorage.getItem(PARAM_STORAGE_PREFIX + key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return def
}

function saveParam(key: string, value: number) {
  localStorage.setItem(PARAM_STORAGE_PREFIX + key, JSON.stringify(value))
}

export function Proposal(): JSX.Element {
  const store = useStore()
  const [showConfetti, setShowConfetti] = createSignal(true)
  const [bpm, setBpm] = createSignal(loadParam('proposal.bpm', 90))
  const [flippedCard, setFlippedCard] = createSignal<string | null>(null)
  const [distUnit, setDistUnit] = createSignal<'mi' | 'km'>('mi')

  const [blinksPerMin, setBlinksPerMin] = createSignal(loadParam('proposal.blinksPerMin', funFactParams.blinksPerMin.default))
  const [breathsPerMin, setBreathsPerMin] = createSignal(loadParam('proposal.breathsPerMin', funFactParams.breathsPerMin.default))
  const [mealsPerDay, setMealsPerDay] = createSignal(loadParam('proposal.mealsPerDay', funFactParams.mealsPerDay.default))
  const [poopsPerDay, setPoopsPerDay] = createSignal(loadParam('proposal.poopsPerDay', funFactParams.poopsPerDay.default))
  const [hairMmPerDay, setHairMmPerDay] = createSignal(loadParam('proposal.hairMmPerDay', funFactParams.hairMmPerDay.default))

  onMount(() => {
    document.documentElement.classList.add('theme-birthday')
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    onCleanup(() => {
      clearTimeout(timer)
      document.documentElement.classList.remove('theme-birthday')
    })
  })

  const age = () => getAge(store.dob, store.now())
  const ageWord = () => numberToWord(age())

  const ctx = () => ({
    now: store.now(),
    dob: store.dob,
    name: store.name,
    gender: store.gender,
    bpm: bpm(),
    sleepHours: 10,
    stepsPerDay: 8000,
    strideInches: 20,
    walkingAge: 1,
    blinksPerMin: blinksPerMin(),
    breathsPerMin: breathsPerMin(),
    mealsPerDay: mealsPerDay(),
    poopsPerDay: poopsPerDay(),
    hairMmPerDay: hairMmPerDay(),
  })

  const updateBpm = (val: number) => {
    setBpm(val)
    saveParam('proposal.bpm', val)
  }

  function updateFunParam(key: string, setter: (v: number) => void, val: number) {
    setter(val)
    saveParam('proposal.' + key, val)
  }

  const fact = (fn: FactFn) => fn(ctx())
  const toggleFlip = (id: string) => setFlippedCard(flippedCard() === id ? null : id)
  const ta = () => getTimeAlive(store.dob, store.now())

  const toUnit = (miles: number) => distUnit() === 'km' ? miles * 1.60934 : miles
  const orbitSpeed = () => distUnit() === 'km'
    ? formatNumber(Math.floor(SPACE.ORBIT_MPH * 1.60934))
    : formatNumber(SPACE.ORBIT_MPH)
  const speedUnit = () => distUnit() === 'km' ? 'km/h' : 'mph'

  const spaceMath = (): MathStep[] => {
    const hours = Math.floor(diffHours(store.now(), store.dob))
    const totalMiles = hours * SPACE.ORBIT_MPH
    const orbits = hours / 24 / 365.25
    return [
      { label: `Earth orbits the sun at ${formatNumber(SPACE.ORBIT_MPH)} mph:`, line: '' },
      { line: `${formatNumber(hours)} hours × ${formatNumber(SPACE.ORBIT_MPH)} mph` },
      { line: `= ${formatCompact(totalMiles)} miles`, bold: true },
      { label: 'Each orbit ≈ 584 million miles:', line: '' },
      { line: `= ${orbits.toFixed(3)} trips around the sun`, bold: true },
    ]
  }

  return (
    <main class="proposal-canvas" style={{
      background: 'var(--birthday-gradient, var(--background))',
      display: 'flex',
      'flex-direction': 'column',
      'font-family': "'Baloo 2', 'Nunito', sans-serif",
      position: 'relative',
    }}>
      <Show when={showConfetti()}>
        <Confetti />
      </Show>

      {/* ═══ HERO ═══ */}
      <header style={{
        'text-align': 'center',
        padding: 'clamp(10px, 2vh, 24px) 24px clamp(2px, 0.5vh, 6px)',
        'flex-shrink': '0',
      }}>
        <div style={{
          'font-size': 'clamp(3.5rem, 11vw, 7rem)',
          'font-weight': '800',
          'line-height': '1',
          color: 'var(--primary)',
          'font-family': "'Baloo 2', sans-serif",
          position: 'relative',
          display: 'inline-block',
        }}>
          {age()}
          <span style={{
            position: 'absolute',
            top: '-0.15em',
            right: '-0.5em',
            'font-size': '0.22em',
            transform: 'rotate(12deg)',
          }}>&#127881;</span>
        </div>

        <p style={{
          'font-size': 'clamp(0.7rem, 1.8vw, 0.85rem)',
          color: 'var(--muted-foreground)',
          'margin-top': '2px',
          'font-family': "'Nunito', sans-serif",
        }}>
          {ageWord()} years old &middot; {formatDate(store.dob)}
        </p>
      </header>

      {/* ═══ BODY ═══ */}
      <div class="proposal-body">
        <div class="proposal-content">

          {/* HERO CARD: Birthday greeting + Space fact */}
          <Flippable
            id="space"
            flipped={flippedCard() === 'space'}
            onFlip={() => toggleFlip('space')}
            math={spaceMath()}
          >
            <div style={{ 'text-align': 'center' }}>
              <h1 style={{
                'font-size': 'clamp(1.1rem, 3vw, 1.5rem)',
                'font-weight': '700',
                color: 'var(--foreground)',
                'line-height': '1.2',
                'margin-bottom': '4px',
                'font-family': "'Baloo 2', sans-serif",
              }}>
                Happy Birthday, {store.name}!
              </h1>
              <span class="prose-text">
                You've completed{' '}
                <Num value={String(Math.floor(fact(TripsAroundSun).value as number))} color="var(--pop-coral)" />{' '}
                trips around the sun, traveling{' '}
                <Num value={formatCompact(toUnit(fact(MilesAroundSun).value as number))} color="var(--pop-purple)" />{' '}
                {distUnit() === 'km' ? 'km' : 'miles'} through space — and you didn't even know it!
                {' '}That means you've been flying at{' '}
                <Num value={orbitSpeed()} color="var(--pop-teal)" />{' '}
                {speedUnit()} without ever leaving the ground!
              </span>
            </div>
            <div style={{
              display: 'flex', 'justify-content': 'center', 'margin-top': 'clamp(4px, 0.8vh, 8px)',
            }}>
              <UnitToggle value={distUnit()} onChange={(u) => setDistUnit(u)} />
            </div>
          </Flippable>

          {/* ROW 1: Time Alive | Heartbeats */}
          <div class="proposal-pair">
            <ProseBlock>
              You've been alive for{' '}
              <Num value={formatNumber(ta().days)} color="var(--pop-coral)" />{' '}
              days. That's{' '}
              <Num value={formatNumber(ta().hours)} color="var(--pop-teal)" />{' '}
              hours,{' '}
              <Num value={formatNumber(ta().minutes)} color="var(--pop-purple)" />{' '}
              minutes, and{' '}
              <Num value={formatNumber(ta().seconds)} color="var(--pop-coral)" live />{' '}
              seconds — a new one right now.
            </ProseBlock>

            <Flippable
              id="heartbeats"
              flipped={flippedCard() === 'heartbeats'}
              onFlip={() => toggleFlip('heartbeats')}
              math={fact(TotalBeats).math}
            >
              <div>
                <span class="prose-text">
                  Your heart has beaten{' '}
                  <Num value={formatCompact(fact(TotalBeats).value as number)} color="var(--pop-coral)" live />{' '}
                  times — it never stops, not even while you sleep.
                </span>
              </div>
              <div style={{
                'margin-top': 'clamp(6px, 1vh, 10px)',
                display: 'flex',
                'align-items': 'center',
                gap: '10px',
              }}>
                <span style={{ 'font-size': '12px', color: 'var(--muted-foreground)', 'white-space': 'nowrap', 'font-family': "'Nunito', sans-serif" }}>
                  &#x2764;&#xFE0F; {bpm()} bpm
                </span>
                <input
                  type="range" min={60} max={120} step={1}
                  value={bpm()}
                  onInput={(e) => updateBpm(parseInt(e.currentTarget.value))}
                  class="birthday-slider"
                  style={{
                    flex: '1', height: '8px', appearance: 'none',
                    background: `linear-gradient(to right, var(--pop-coral) ${((bpm() - 60) / 60) * 100}%, var(--muted) ${((bpm() - 60) / 60) * 100}%)`,
                    'border-radius': '4px', cursor: 'pointer', outline: 'none',
                  }}
                />
              </div>
            </Flippable>
          </div>

          {/* ROW 2: Sleep | Walking */}
          <div class="proposal-pair">
            <ProseBlock>
              Slept{' '}
              <Num value={formatCompact(fact(TotalHoursSlept).value as number)} color="var(--pop-purple)" />{' '}
              hours — your body needs every one to grow.
            </ProseBlock>
            <ProseBlock>
              Walked{' '}
              <Num value={formatNumber(Math.floor(fact(MilesWalked).value as number))} color="var(--pop-teal)" />{' '}
              miles on those little feet since age one.
            </ProseBlock>
          </div>

          {/* ROW 3: Fun facts grid with varied controls */}
          <div class="proposal-facts">
            <FactSquare emoji="&#x1F4A8;" value={formatCompact(fact(Breaths).value as number)} color="var(--pop-teal)" line="breaths">
              <MiniSlider
                value={breathsPerMin()} min={funFactParams.breathsPerMin.min} max={funFactParams.breathsPerMin.max}
                step={funFactParams.breathsPerMin.step ?? 1} label="/min" color="var(--pop-teal)"
                onChange={(v) => updateFunParam('breathsPerMin', setBreathsPerMin, v)}
              />
            </FactSquare>

            <FactSquare emoji="&#x1F441;" value={formatCompact(fact(Blinks).value as number)} color="var(--pop-coral)" line="blinks">
              <Stepper
                value={blinksPerMin()} label="/min"
                paramDef={funFactParams.blinksPerMin}
                onChange={(v) => updateFunParam('blinksPerMin', setBlinksPerMin, v)}
              />
            </FactSquare>

            <FactSquare emoji="&#x1F35D;" value={formatNumber(fact(Meals).value as number)} color="var(--pop-gold, var(--accent))" line="meals">
              <Pills
                options={[1, 2, 3, 4, 5, 6]} value={mealsPerDay()} label="/day"
                onChange={(v) => updateFunParam('mealsPerDay', setMealsPerDay, v)}
              />
            </FactSquare>

            <FactSquare emoji="&#x1F4A9;" value={formatNumber(fact(Poops).value as number)} color="var(--pop-purple)" line="poops">
              <Chips
                options={[
                  { label: '½×', value: 0.5 },
                  { label: '1×', value: 1 },
                  { label: '2×', value: 2 },
                  { label: '3×', value: 3 },
                ]}
                value={poopsPerDay()} label="/day"
                onChange={(v) => updateFunParam('poopsPerDay', setPoopsPerDay, v)}
              />
            </FactSquare>

            <FactSquare emoji="&#x2702;&#xFE0F;" value={`${(fact(HairGrowth).value as number).toFixed(0)}"`} color="var(--pop-pink, var(--primary))" line="hair grown">
              <Chips
                options={[
                  { label: '\u{1F40C}', value: 0.3 },
                  { label: 'avg', value: 0.5 },
                  { label: '\u{1F407}', value: 0.8 },
                ]}
                value={hairMmPerDay()}
                onChange={(v) => updateFunParam('hairMmPerDay', setHairMmPerDay, v)}
              />
            </FactSquare>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        'text-align': 'center',
        padding: 'clamp(6px, 1vh, 10px) 16px',
        'font-size': '11px',
        color: 'var(--muted-foreground)',
        'flex-shrink': '0',
        'font-family': "'Nunito', sans-serif",
      }}>
        tap any card to see the math
      </footer>
    </main>
  )
}

/* ─── Primitives ─── */

function Num(props: { value: string; color: string; live?: boolean }): JSX.Element {
  return (
    <span
      class="font-mono tabular-nums"
      style={{
        'font-weight': '800',
        color: props.color,
        'font-size': '1.12em',
        'letter-spacing': '-0.02em',
        ...(props.live ? { animation: 'number-breathe 1s ease-in-out infinite' } : {}),
      }}
    >{props.value}</span>
  )
}

function ProseBlock(props: { children: JSX.Element }): JSX.Element {
  return (
    <div class="prose-text" style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      'border-radius': 'var(--radius)',
      padding: 'clamp(10px, 1.8vh, 16px) clamp(12px, 2.5vw, 18px)',
      'box-shadow': '0 1px 4px oklch(0 0 0 / 0.04)',
    }}>
      {props.children}
    </div>
  )
}

function Flippable(props: {
  id: string; flipped: boolean; onFlip: () => void; math?: MathStep[]; children: JSX.Element
}): JSX.Element {
  return (
    <div
      class="perspective-1000"
      onClick={(e) => { if (!(e.target as HTMLElement).closest('input, button')) props.onFlip() }}
      style={{ cursor: 'pointer' }}
    >
      <div class="transform-style-preserve-3d" style={{
        position: 'relative',
        transition: 'transform 0.5s',
        transform: props.flipped ? 'rotateY(180deg)' : '',
      }}>
        <div class="backface-hidden" style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          'border-radius': 'var(--radius)',
          padding: 'clamp(10px, 1.8vh, 16px) clamp(12px, 2.5vw, 18px)',
          'box-shadow': '0 1px 4px oklch(0 0 0 / 0.04)',
          position: 'relative',
        }}>
          {props.children}
          <Show when={props.math}>
            <div style={{
              position: 'absolute', top: '8px', right: '10px',
              'font-size': '10px', color: 'var(--muted-foreground)', opacity: '0.45',
              'font-family': "'Nunito', sans-serif",
            }}>&#128270; math</div>
          </Show>
        </div>

        <Show when={props.math}>
          <div class="backface-hidden rotate-y-180" style={{
            position: 'absolute', inset: '0',
            background: 'var(--card)', border: '1px solid var(--accent)',
            'border-radius': 'var(--radius)',
            padding: 'clamp(10px, 1.8vh, 16px) clamp(12px, 2.5vw, 18px)',
            overflow: 'auto', display: 'flex', 'flex-direction': 'column', gap: '4px',
          }}>
            <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'margin-bottom': '2px' }}>
              <span style={{ 'font-size': '11px', 'font-weight': '700', 'text-transform': 'uppercase', 'letter-spacing': '0.05em', color: 'var(--accent)', 'font-family': "'Baloo 2', sans-serif" }}>How it works</span>
              <span style={{ 'font-size': '10px', color: 'var(--muted-foreground)' }}>tap to flip back</span>
            </div>
            <div class="font-mono" style={{ 'font-size': '12px', color: 'var(--foreground)', 'line-height': '1.5' }}>
              <For each={props.math!}>
                {(step) => (
                  <p style={{
                    'font-weight': step.bold ? '700' : '400',
                    'font-size': step.label && !step.bold ? '10px' : undefined,
                    color: step.bold ? 'var(--primary)' : step.label ? 'var(--muted-foreground)' : undefined,
                    'margin-top': step.label && !step.bold ? '4px' : undefined,
                  }}>{step.label ?? step.line}</p>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}

/* ─── Controls ─── */

function UnitToggle(props: { value: 'mi' | 'km'; onChange: (v: 'mi' | 'km') => void }): JSX.Element {
  const btn = (unit: 'mi' | 'km', label: string): JSX.Element => (
    <button
      onClick={(e) => { e.stopPropagation(); props.onChange(unit) }}
      style={{
        padding: '3px 12px',
        'border-radius': unit === 'mi' ? '8px 0 0 8px' : '0 8px 8px 0',
        border: '1px solid var(--border)',
        'margin-left': unit === 'km' ? '-1px' : '0',
        background: props.value === unit ? 'var(--accent)' : 'var(--muted)',
        color: props.value === unit ? 'white' : 'var(--muted-foreground)',
        'font-size': '12px',
        'font-weight': '600',
        cursor: 'pointer',
        'font-family': "'Nunito', sans-serif",
      }}
    >{label}</button>
  )
  return (
    <div style={{ display: 'inline-flex' }}>
      {btn('mi', 'mi')}
      {btn('km', 'km')}
    </div>
  )
}

function FactSquare(props: {
  emoji: string
  value: string
  color: string
  line: string
  children?: JSX.Element
}): JSX.Element {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      'border-radius': 'var(--radius)',
      padding: 'clamp(8px, 1.2vh, 14px) clamp(6px, 1.2vw, 10px)',
      'text-align': 'center',
      'box-shadow': '0 1px 3px oklch(0 0 0 / 0.03)',
      display: 'flex', 'flex-direction': 'column', 'align-items': 'center',
      gap: '1px',
    }}>
      <div style={{ 'font-size': 'clamp(1rem, 2.5vw, 1.4rem)' }} innerHTML={props.emoji} />
      <div class="font-mono tabular-nums" style={{
        'font-weight': '800', 'font-size': 'clamp(0.9rem, 2.5vw, 1.15rem)',
        color: props.color, 'line-height': '1.2',
      }}>{props.value}</div>
      <div style={{
        'font-size': 'clamp(9px, 1.3vw, 11px)',
        color: 'var(--muted-foreground)',
        'font-family': "'Nunito', sans-serif",
        'line-height': '1.3',
      }}>{props.line}</div>
      {props.children}
    </div>
  )
}

function MiniSlider(props: {
  value: number; min: number; max: number; step: number
  label: string; color: string; onChange: (v: number) => void
}): JSX.Element {
  const pct = () => ((props.value - props.min) / (props.max - props.min)) * 100
  return (
    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', 'align-items': 'center', gap: '4px', 'margin-top': '4px', width: '100%' }}>
      <input
        type="range" min={props.min} max={props.max} step={props.step}
        value={props.value}
        onInput={(e) => props.onChange(parseFloat(e.currentTarget.value))}
        class="birthday-slider"
        style={{
          flex: '1', height: '6px', appearance: 'none',
          background: `linear-gradient(to right, ${props.color} ${pct()}%, var(--muted) ${pct()}%)`,
          'border-radius': '3px', cursor: 'pointer', outline: 'none',
        }}
      />
      <span class="font-mono" style={{ 'font-size': '9px', color: 'var(--muted-foreground)', 'white-space': 'nowrap' }}>
        {props.value}{props.label}
      </span>
    </div>
  )
}

function Stepper(props: {
  value: number; label: string; paramDef: ParamDef; onChange: (v: number) => void
}): JSX.Element {
  const step = () => props.paramDef.step ?? 1
  const canDec = () => props.value - step() >= props.paramDef.min
  const canInc = () => props.value + step() <= props.paramDef.max
  const btnStyle = (enabled: boolean): JSX.CSSProperties => ({
    width: '22px', height: '22px', 'border-radius': '50%',
    border: '1px solid var(--border)', background: 'var(--muted)',
    cursor: enabled ? 'pointer' : 'default', opacity: enabled ? '1' : '0.3',
    display: 'flex', 'align-items': 'center', 'justify-content': 'center',
    'font-size': '14px', 'font-weight': '700', color: 'var(--foreground)',
    padding: '0', 'font-family': "'JetBrains Mono', monospace", 'line-height': '1',
  })

  return (
    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', 'align-items': 'center', gap: '4px', 'margin-top': '4px', 'justify-content': 'center' }}>
      <button
        onClick={() => canDec() && props.onChange(Math.round((props.value - step()) * 100) / 100)}
        disabled={!canDec()} style={btnStyle(canDec())}
      >&minus;</button>
      <span class="font-mono" style={{ 'font-size': '10px', color: 'var(--muted-foreground)', 'min-width': '36px', 'text-align': 'center' }}>
        {props.value}{props.label}
      </span>
      <button
        onClick={() => canInc() && props.onChange(Math.round((props.value + step()) * 100) / 100)}
        disabled={!canInc()} style={btnStyle(canInc())}
      >+</button>
    </div>
  )
}

function Pills(props: {
  options: number[]; value: number; label: string; onChange: (v: number) => void
}): JSX.Element {
  return (
    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '3px', 'margin-top': '4px', 'align-items': 'center', 'justify-content': 'center' }}>
      <For each={props.options}>
        {(opt) => (
          <button
            onClick={() => props.onChange(opt)}
            style={{
              width: '18px', height: '18px', 'border-radius': '4px',
              border: props.value === opt ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: props.value === opt ? 'var(--primary)' : 'var(--muted)',
              color: props.value === opt ? 'white' : 'var(--foreground)',
              'font-size': '10px', 'font-weight': '700', cursor: 'pointer',
              display: 'flex', 'align-items': 'center', 'justify-content': 'center',
              padding: '0', 'font-family': "'Nunito', sans-serif",
            }}
          >{opt}</button>
        )}
      </For>
      <span style={{ 'font-size': '9px', color: 'var(--muted-foreground)', 'margin-left': '1px', 'font-family': "'Nunito', sans-serif" }}>
        {props.label}
      </span>
    </div>
  )
}

function Chips(props: {
  options: { label: string; value: number }[]; value: number; label?: string; onChange: (v: number) => void
}): JSX.Element {
  return (
    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '3px', 'margin-top': '4px', 'align-items': 'center', 'justify-content': 'center' }}>
      <For each={props.options}>
        {(opt) => (
          <button
            onClick={() => props.onChange(opt.value)}
            style={{
              padding: '2px 7px', 'border-radius': '10px',
              border: props.value === opt.value ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              background: props.value === opt.value ? 'var(--accent)' : 'var(--muted)',
              color: props.value === opt.value ? 'white' : 'var(--foreground)',
              'font-size': '10px', 'font-weight': '600', cursor: 'pointer',
              'font-family': "'Nunito', sans-serif",
            }}
          >{opt.label}</button>
        )}
      </For>
      <Show when={props.label}>
        <span style={{ 'font-size': '9px', color: 'var(--muted-foreground)', 'margin-left': '1px', 'font-family': "'Nunito', sans-serif" }}>
          {props.label}
        </span>
      </Show>
    </div>
  )
}
