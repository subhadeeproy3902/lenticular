import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'
import { CodeBlock } from '../components/CodeBlock'

type ContentKey = 'text' | 'card' | 'avatar' | 'mode'

// ───────── Content variants ────────────────────────────────

function TextFace({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`pg-text pg-text--${variant}`}>
      <span className="pg-text-line">{a ? 'before' : 'after'}</span>
      <span className="pg-text-line pg-text-line--big">{a ? 'SLIDE' : 'REVEAL'}</span>
      <span className="pg-text-line pg-text-line--small">
        {a ? 'hover left ←' : '→ hover right'}
      </span>
    </div>
  )
}

function CardFace({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`card ${a ? 'card--front' : 'card--back'}`}>
      {a ? (
        <>
          <span className="card-eyebrow">new release</span>
          <span className="card-name">Nimbus 03</span>
          <span className="card-price">$129</span>
        </>
      ) : (
        <>
          <span className="card-eyebrow">specs</span>
          <ul className="card-specs">
            <li>40 mm titanium driver</li>
            <li>32 h playback</li>
            <li>Adaptive ANC</li>
            <li>USB-C · Bluetooth 5.4</li>
          </ul>
        </>
      )}
    </div>
  )
}

function AvatarFace({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`avatar ${a ? 'avatar--day' : 'avatar--night'}`} aria-hidden="true">
      <div className="avatar-glow avatar-glow--a" />
      <div className="avatar-glow avatar-glow--b" />
      <div className="avatar-glow avatar-glow--c" />
    </div>
  )
}

function ModeFace({ variant }: { variant: 'a' | 'b' }) {
  const dark = variant === 'a'
  return (
    <div className={`mode-card${dark ? ' mode-card--dark' : ' mode-card--light'}`}>
      <div className="mode-card-bar">
        <span className="mode-card-dot" />
        <span className="mode-card-dot" />
        <span className="mode-card-dot" />
      </div>
      <div className="mode-card-body">
        <div className="mode-card-row">
          <div className="mode-card-avatar" />
          <div className="mode-card-lines">
            <div className="mode-card-line mode-card-line--wide" />
            <div className="mode-card-line mode-card-line--narrow" />
          </div>
        </div>
        <div className="mode-card-row mode-card-row--stack">
          <div className="mode-card-line" />
          <div className="mode-card-line mode-card-line--mid" />
        </div>
      </div>
      <span className="mode-card-tag">{dark ? 'dark' : 'light'}</span>
    </div>
  )
}

const CONTENT_REGISTRY: Record<
  ContentKey,
  {
    label: string
    suggestedWidth: number
    suggestedHeight: number
    render: (v: 'a' | 'b') => React.ReactNode
  }
> = {
  text: { label: 'Text', suggestedWidth: 460, suggestedHeight: 240, render: (v) => <TextFace variant={v} /> },
  card: { label: 'Card', suggestedWidth: 320, suggestedHeight: 220, render: (v) => <CardFace variant={v} /> },
  avatar: { label: 'Avatar', suggestedWidth: 220, suggestedHeight: 220, render: (v) => <AvatarFace variant={v} /> },
  mode: { label: 'UI mockup', suggestedWidth: 280, suggestedHeight: 200, render: (v) => <ModeFace variant={v} /> },
}

// ───────── Defaults ────────────────────────────────────────

const DEFAULTS = {
  content: 'text' as ContentKey,
  slices: 12,
  ease: 0.14,
  hitMargin: 24,
  tilt: 0,
  width: 460,
  height: 240,
  paused: false,
  defaultSide: 'front' as 'front' | 'back',
  trackWindow: false,
  scroll: false,
  triggerParent: false,
  showSliceOverlay: false,
}

// ───────── Component ──────────────────────────────────────

export function PlaygroundExample() {
  const [content, setContent] = useState<ContentKey>(DEFAULTS.content)
  const [slices, setSlices] = useState(DEFAULTS.slices)
  const [ease, setEase] = useState(DEFAULTS.ease)
  const [hitMargin, setHitMargin] = useState(DEFAULTS.hitMargin)
  const [tilt, setTilt] = useState(DEFAULTS.tilt)
  const [width, setWidth] = useState(DEFAULTS.width)
  const [height, setHeight] = useState(DEFAULTS.height)
  const [paused, setPaused] = useState(DEFAULTS.paused)
  const [defaultSide, setDefaultSide] = useState<'front' | 'back'>(DEFAULTS.defaultSide)
  const [trackWindow, setTrackWindow] = useState(DEFAULTS.trackWindow)
  const [scrollMode, setScrollMode] = useState(DEFAULTS.scroll)
  const [triggerParent, setTriggerParent] = useState(DEFAULTS.triggerParent)
  const [showSliceOverlay, setShowSliceOverlay] = useState(DEFAULTS.showSliceOverlay)

  const slicesId = useId()
  const easeId = useId()
  const hitId = useId()
  const tiltId = useId()
  const widthId = useId()
  const heightId = useId()

  // Live offset readout — read directly from the DOM each rAF so we don't
  // re-render React every frame.
  const offsetBarRef = useRef<HTMLDivElement | null>(null)
  const offsetTextRef = useRef<HTMLSpanElement | null>(null)
  const handleOffset = useCallback((o: number) => {
    if (offsetBarRef.current) {
      offsetBarRef.current.style.width = `${o * 100}%`
    }
    if (offsetTextRef.current) {
      offsetTextRef.current.textContent = o.toFixed(3)
    }
  }, [])

  const meta = CONTENT_REGISTRY[content]
  const code = useMemo(() => {
    const lines = [`<Lenticular`]
    lines.push(`  slices={${slices}}`)
    lines.push(`  ease={${ease}}`)
    if (hitMargin !== 24) lines.push(`  hitMargin={${hitMargin}}`)
    if (tilt > 0) lines.push(`  tilt={${tilt}}`)
    if (paused) lines.push(`  paused`)
    if (defaultSide === 'back') lines.push(`  defaultSide="back"`)
    if (scrollMode) lines.push(`  scroll`)
    else if (triggerParent) lines.push(`  triggerParent`)
    else if (trackWindow) lines.push(`  trackWindow`)
    lines.push(`  front={<${meta.label.replace(' ', '')}Face variant="a" />}`)
    lines.push(`  back={<${meta.label.replace(' ', '')}Face variant="b" />}`)
    lines.push(`/>`)
    return lines.join('\n')
  }, [slices, ease, hitMargin, tilt, paused, defaultSide, trackWindow, scrollMode, triggerParent, meta])

  const resetAll = () => {
    setContent(DEFAULTS.content)
    setSlices(DEFAULTS.slices)
    setEase(DEFAULTS.ease)
    setHitMargin(DEFAULTS.hitMargin)
    setTilt(DEFAULTS.tilt)
    setWidth(DEFAULTS.width)
    setHeight(DEFAULTS.height)
    setPaused(DEFAULTS.paused)
    setDefaultSide(DEFAULTS.defaultSide)
    setTrackWindow(DEFAULTS.trackWindow)
    setScrollMode(DEFAULTS.scroll)
    setTriggerParent(DEFAULTS.triggerParent)
    setShowSliceOverlay(DEFAULTS.showSliceOverlay)
  }

  const handleContent = (key: ContentKey) => {
    setContent(key)
    const next = CONTENT_REGISTRY[key]
    setWidth(next.suggestedWidth)
    setHeight(next.suggestedHeight)
  }

  return (
    <section className="playground-section" aria-label="Interactive playground">
      <h2 className="section-title">Playground</h2>
      <p className="example-caption">
        Every prop, live. Swap content, scrub sliders, watch the offset tick by
        on each frame. Hit-margin {hitMargin > 0 ? `pads the wrapper by ${hitMargin}px so you can overshoot the edge.` : 'is off — only the wrapper itself is interactive.'}
      </p>

      <div className="pg2-preview" style={{ minHeight: height + 80 }}>
        <div className="pg2-stage-wrap">
          <Lenticular
            key={`${trackWindow}-${defaultSide}-${content}-${scrollMode}-${triggerParent}`}
            slices={slices}
            ease={ease}
            hitMargin={hitMargin}
            tilt={tilt}
            paused={paused}
            defaultSide={defaultSide}
            trackWindow={!scrollMode && !triggerParent && trackWindow}
            triggerParent={!scrollMode && triggerParent}
            scroll={scrollMode}
            onOffsetChange={handleOffset}
            front={<Stage width={width} height={height}>{meta.render('a')}</Stage>}
            back={<Stage width={width} height={height}>{meta.render('b')}</Stage>}
          />

          {showSliceOverlay ? (
            <div
              className="pg2-slice-overlay"
              aria-hidden="true"
              style={{ width, height }}
            >
              {Array.from({ length: slices - 1 }).map((_, i) => (
                <span
                  key={i}
                  className="pg2-slice-line"
                  style={{ left: `${((i + 1) / slices) * 100}%` }}
                />
              ))}
            </div>
          ) : null}
        </div>

        <span className="pg2-hint">
          {trackWindow ? 'tracking the window' : `hit margin · ${hitMargin}px`}
        </span>
      </div>

      <div className="pg2-offset-readout">
        <span className="pg2-offset-label">offset</span>
        <div className="pg2-offset-bar">
          <div ref={offsetBarRef} className="pg2-offset-fill" />
        </div>
        <span ref={offsetTextRef} className="pg2-offset-value">
          0.000
        </span>
      </div>

      <div className="pg2-controls">
        <div className="pg2-group pg2-group--full" role="radiogroup" aria-label="Content">
          <span className="control-label">Content</span>
          <div className="control-options control-options--wrap">
            {(Object.keys(CONTENT_REGISTRY) as ContentKey[]).map((key) => (
              <button
                key={key}
                className="tab-btn"
                role="radio"
                aria-checked={content === key}
                data-active={content === key}
                onClick={() => handleContent(key)}
              >
                {CONTENT_REGISTRY[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="pg2-group" role="radiogroup" aria-label="Default side">
          <span className="control-label">Rest at</span>
          <div className="control-options">
            <button
              className="tab-btn"
              role="radio"
              aria-checked={defaultSide === 'front'}
              data-active={defaultSide === 'front'}
              onClick={() => setDefaultSide('front')}
            >
              Front
            </button>
            <button
              className="tab-btn"
              role="radio"
              aria-checked={defaultSide === 'back'}
              data-active={defaultSide === 'back'}
              onClick={() => setDefaultSide('back')}
            >
              Back
            </button>
          </div>
        </div>

        <div className="pg2-group">
          <span className="control-label">Animation</span>
          <div className="control-options">
            <button className="tab-btn" data-active={!paused} onClick={() => setPaused(false)}>
              Play
            </button>
            <button className="tab-btn" data-active={paused} onClick={() => setPaused(true)}>
              Pause
            </button>
          </div>
        </div>

        <div className="pg2-group">
          <span className="control-label">Track</span>
          <div className="control-options">
            <button className="tab-btn" data-active={!trackWindow} onClick={() => setTrackWindow(false)} disabled={scrollMode}>
              Element
            </button>
            <button className="tab-btn" data-active={trackWindow} onClick={() => setTrackWindow(true)} disabled={scrollMode}>
              Window
            </button>
          </div>
        </div>

        <div className="pg2-group">
          <span className="control-label">Driver</span>
          <div className="control-options">
            <button className="tab-btn" data-active={!scrollMode} onClick={() => setScrollMode(false)}>
              Cursor
            </button>
            <button className="tab-btn" data-active={scrollMode} onClick={() => setScrollMode(true)}>
              Scroll
            </button>
          </div>
        </div>

        <div className="pg2-group">
          <span className="control-label">Hit area</span>
          <div className="control-options">
            <button className="tab-btn" data-active={!triggerParent} onClick={() => setTriggerParent(false)} disabled={scrollMode}>
              Wrapper
            </button>
            <button className="tab-btn" data-active={triggerParent} onClick={() => setTriggerParent(true)} disabled={scrollMode}>
              Parent
            </button>
          </div>
        </div>

        <div className="pg2-group">
          <span className="control-label">Overlay</span>
          <div className="control-options">
            <button
              className="tab-btn"
              data-active={!showSliceOverlay}
              onClick={() => setShowSliceOverlay(false)}
            >
              Off
            </button>
            <button
              className="tab-btn"
              data-active={showSliceOverlay}
              onClick={() => setShowSliceOverlay(true)}
            >
              Slices
            </button>
          </div>
        </div>

        <div className="pg2-group pg2-group--range">
          <label className="control-label" htmlFor={slicesId}>
            Slices · <span className="pg2-val">{slices}</span>
          </label>
          <input
            id={slicesId}
            type="range"
            className="pg2-range"
            value={slices}
            onChange={(e) => setSlices(parseInt(e.target.value, 10))}
            min={2}
            max={40}
            step={1}
            aria-label="Slices"
          />
        </div>

        <div className="pg2-group pg2-group--range">
          <label className="control-label" htmlFor={easeId}>
            Ease · <span className="pg2-val">{ease.toFixed(2)}</span>
          </label>
          <input
            id={easeId}
            type="range"
            className="pg2-range"
            value={ease}
            onChange={(e) => setEase(parseFloat(e.target.value))}
            min={0.02}
            max={1}
            step={0.01}
            aria-label="Ease"
          />
        </div>

        <div className="pg2-group pg2-group--range">
          <label className="control-label" htmlFor={hitId}>
            Hit margin · <span className="pg2-val">{hitMargin}px</span>
          </label>
          <input
            id={hitId}
            type="range"
            className="pg2-range"
            value={hitMargin}
            onChange={(e) => setHitMargin(parseInt(e.target.value, 10))}
            min={0}
            max={120}
            step={1}
            aria-label="Hit margin in pixels"
          />
        </div>

        <div className="pg2-group pg2-group--range">
          <label className="control-label" htmlFor={tiltId}>
            Tilt · <span className="pg2-val">{tilt}°</span>
          </label>
          <input
            id={tiltId}
            type="range"
            className="pg2-range"
            value={tilt}
            onChange={(e) => setTilt(parseInt(e.target.value, 10))}
            min={0}
            max={30}
            step={1}
            aria-label="3D perspective tilt in degrees"
          />
        </div>

        <div className="pg2-group pg2-group--range">
          <label className="control-label" htmlFor={widthId}>
            Width · <span className="pg2-val">{width}px</span>
          </label>
          <input
            id={widthId}
            type="range"
            className="pg2-range"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value, 10))}
            min={140}
            max={680}
            step={10}
            aria-label="Stage width"
          />
        </div>

        <div className="pg2-group pg2-group--range">
          <label className="control-label" htmlFor={heightId}>
            Height · <span className="pg2-val">{height}px</span>
          </label>
          <input
            id={heightId}
            type="range"
            className="pg2-range"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value, 10))}
            min={80}
            max={420}
            step={10}
            aria-label="Stage height"
          />
        </div>

        <div className="pg2-group pg2-group--actions">
          <button className="pg2-reset" onClick={resetAll}>
            Reset all
          </button>
        </div>
      </div>

      <CodeBlock code={code} lang="tsx" label="Copy playground code" />
    </section>
  )
}
