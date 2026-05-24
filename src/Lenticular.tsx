import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import type { CSSProperties } from 'react'
import type { LenticularProps } from './types'
import { injectStyles } from './styles'

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v

function buildFrontPath(
  offset: number,
  slices: number,
  w: number,
  h: number,
): string {
  if (w <= 0 || h <= 0) return ''
  const sliceWidth = w / slices
  const stripeWidth = (1 - offset) * sliceWidth
  if (stripeWidth < 0.5) return ''
  if (stripeWidth >= sliceWidth - 0.5) {
    return `M0 0L${w} 0L${w} ${h}L0 ${h}Z`
  }
  let path = ''
  for (let i = 0; i < slices; i++) {
    const x1 = i * sliceWidth
    const x2 = x1 + stripeWidth
    path += `M${x1} 0L${x2} 0L${x2} ${h}L${x1} ${h}Z`
  }
  return path
}

function buildBackPath(
  offset: number,
  slices: number,
  w: number,
  h: number,
): string {
  if (w <= 0 || h <= 0) return ''
  const sliceWidth = w / slices
  const frontWidth = (1 - offset) * sliceWidth
  const backWidth = sliceWidth - frontWidth
  if (backWidth < 0.5) return ''
  if (backWidth >= sliceWidth - 0.5) {
    return `M0 0L${w} 0L${w} ${h}L0 ${h}Z`
  }
  let path = ''
  for (let i = 0; i < slices; i++) {
    const x1 = i * sliceWidth + frontWidth
    const x2 = (i + 1) * sliceWidth
    path += `M${x1} 0L${x2} 0L${x2} ${h}L${x1} ${h}Z`
  }
  return path
}

export const Lenticular = forwardRef<HTMLDivElement, LenticularProps>(
  function Lenticular(props, forwardedRef) {
    const {
      front,
      back,
      slices = 10,
      ease = 0.12,
      trackWindow = false,
      hitMargin = 24,
      triggerParent = false,
      scroll = false,
      gyroscope = false,
      paused = false,
      defaultSide = 'front',
      tilt = 0,
      perspective = 900,
      onOffsetChange,
      className,
      style,
      ...rest
    } = props

    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const frontLayerRef = useRef<HTMLDivElement | null>(null)
    const backLayerRef = useRef<HTMLDivElement | null>(null)

    useImperativeHandle(
      forwardedRef,
      () => wrapperRef.current as HTMLDivElement,
      [],
    )

    const safeSlices = useMemo(
      () => Math.round(clamp(slices, 2, 40)),
      [slices],
    )

    const initialOffset = defaultSide === 'front' ? 0 : 1
    const currentOffsetRef = useRef(initialOffset)
    const targetOffsetRef = useRef(initialOffset)
    const rafIdRef = useRef<number | null>(null)
    const isVisibleRef = useRef(true)
    const isHoverRef = useRef(false)
    const reduceMotionRef = useRef(false)
    const widthRef = useRef(0)
    const heightRef = useRef(0)

    const easeRef = useRef(ease)
    const pausedRef = useRef(paused)
    const defaultSideRef = useRef(defaultSide)
    const gyroscopeRef = useRef(gyroscope)
    const slicesRef = useRef(safeSlices)
    const hitMarginRef = useRef(hitMargin)
    const triggerParentRef = useRef(triggerParent)
    const scrollRef = useRef(scroll)
    const tiltRef = useRef(tilt)
    const perspectiveRef = useRef(perspective)
    const onOffsetChangeRef = useRef(onOffsetChange)

    useEffect(() => {
      easeRef.current = ease
    }, [ease])

    useEffect(() => {
      pausedRef.current = paused
    }, [paused])

    useEffect(() => {
      defaultSideRef.current = defaultSide
      if (!isHoverRef.current && !gyroscopeRef.current) {
        targetOffsetRef.current = defaultSide === 'front' ? 0 : 1
      }
    }, [defaultSide])

    useEffect(() => {
      gyroscopeRef.current = gyroscope
    }, [gyroscope])

    useEffect(() => {
      hitMarginRef.current = Math.max(0, hitMargin)
    }, [hitMargin])

    useEffect(() => {
      scrollRef.current = scroll
    }, [scroll])

    useEffect(() => {
      triggerParentRef.current = triggerParent
    }, [triggerParent])

    useEffect(() => {
      onOffsetChangeRef.current = onOffsetChange
    }, [onOffsetChange])

    useEffect(() => {
      tiltRef.current = Math.max(0, tilt)
    }, [tilt])

    useEffect(() => {
      perspectiveRef.current = Math.max(200, perspective)
    }, [perspective])

    const updateClipPaths = useCallback(() => {
      const w = widthRef.current
      const h = heightRef.current
      if (w <= 0 || h <= 0) return
      const o = currentOffsetRef.current
      const n = slicesRef.current
      const frontPath = buildFrontPath(o, n, w, h)
      const backPath = buildBackPath(o, n, w, h)
      const frontEl = frontLayerRef.current
      const backEl = backLayerRef.current
      const wrapper = wrapperRef.current
      if (wrapper) {
        wrapper.style.setProperty('--lenticular-offset', o.toFixed(4))
      }
      if (frontEl) {
        frontEl.style.clipPath = frontPath
          ? `path('${frontPath}')`
          : 'inset(50%)'
      }
      if (backEl) {
        backEl.style.clipPath = backPath
          ? `path('${backPath}')`
          : 'inset(50%)'
      }
      if (wrapper) {
        const t = tiltRef.current
        if (t > 0) {
          // offset 0 → +tilt (right edge toward viewer)
          // offset 1 → -tilt (left edge toward viewer)
          // offset 0.5 → flat
          const deg = (0.5 - o) * 2 * t
          const persp = perspectiveRef.current
          wrapper.style.transform = `perspective(${persp}px) rotateY(${deg.toFixed(2)}deg)`
        } else if (wrapper.style.transform) {
          wrapper.style.transform = ''
        }
      }
      onOffsetChangeRef.current?.(o)
    }, [])

    useEffect(() => {
      slicesRef.current = safeSlices
      updateClipPaths()
    }, [safeSlices, updateClipPaths])

    const tick = useCallback(() => {
      const wrapper = wrapperRef.current
      if (!wrapper) {
        rafIdRef.current = null
        return
      }
      if (pausedRef.current || !isVisibleRef.current) {
        rafIdRef.current = null
        return
      }

      const current = currentOffsetRef.current
      const target = targetOffsetRef.current
      const rm = reduceMotionRef.current
      const e = rm ? 1 : clamp(easeRef.current, 0.001, 1)
      const next = current + (target - current) * e
      const delta = Math.abs(target - next)
      const snapped = delta < 0.0005 ? target : next
      currentOffsetRef.current = snapped

      updateClipPaths()

      if (delta < 0.0005) {
        rafIdRef.current = null
        return
      }
      rafIdRef.current = requestAnimationFrame(tick)
    }, [updateClipPaths])

    const requestTick = useCallback(() => {
      if (rafIdRef.current != null) return
      if (pausedRef.current || !isVisibleRef.current) return
      rafIdRef.current = requestAnimationFrame(tick)
    }, [tick])

    const handlePointerMove = useCallback(
      (clientX: number) => {
        const wrapper = wrapperRef.current
        if (!wrapper) return
        const rect = wrapper.getBoundingClientRect()
        if (rect.width <= 0) return
        const nx = clamp((clientX - rect.left) / rect.width, 0, 1)
        targetOffsetRef.current = nx
        isHoverRef.current = true
        requestTick()
      },
      [requestTick],
    )

    const handlePointerLeave = useCallback(() => {
      isHoverRef.current = false
      targetOffsetRef.current = defaultSideRef.current === 'front' ? 0 : 1
      requestTick()
    }, [requestTick])

    useEffect(() => {
      injectStyles()
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
      reduceMotionRef.current = mql.matches
      const handleMql = (e: MediaQueryListEvent) => {
        reduceMotionRef.current = e.matches
      }
      if (mql.addEventListener) {
        mql.addEventListener('change', handleMql)
      } else {
        mql.addListener(handleMql)
      }

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isVisibleRef.current = entry.isIntersecting
            if (entry.isIntersecting) requestTick()
          }
        },
        { threshold: 0 },
      )
      io.observe(wrapper)

      let resizeRaf: number | null = null
      const ro = new ResizeObserver((entries) => {
        if (resizeRaf != null) cancelAnimationFrame(resizeRaf)
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = null
          for (const entry of entries) {
            const cr = entry.contentRect
            widthRef.current = cr.width
            heightRef.current = cr.height
          }
          updateClipPaths()
        })
      })
      ro.observe(wrapper)

      const rect = wrapper.getBoundingClientRect()
      widthRef.current = rect.width
      heightRef.current = rect.height
      updateClipPaths()

      return () => {
        io.disconnect()
        ro.disconnect()
        if (resizeRaf != null) cancelAnimationFrame(resizeRaf)
        if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handleMql)
        } else {
          mql.removeListener(handleMql)
        }
      }
    }, [requestTick, updateClipPaths])

    useEffect(() => {
      if (!scroll) return
      const wrapper = wrapperRef.current
      if (!wrapper) return

      // Map element position to offset 0 → 1 using only the middle 70% of the
      // viewport, so the effect completes well before the element leaves the
      // screen (rather than spanning a full element-pass-through). Anchor on
      // the element's vertical center.
      //   center at vh * 0.85 → offset = 0  (just entered the bottom)
      //   center at vh * 0.15 → offset = 1  (about to leave the top)
      const compute = () => {
        const rect = wrapper.getBoundingClientRect()
        const vh = window.innerHeight || 0
        if (vh <= 0) return
        const center = rect.top + rect.height / 2
        const start = vh * 0.85
        const end = vh * 0.15
        const nx = clamp((start - center) / (start - end), 0, 1)
        targetOffsetRef.current = nx
        requestTick()
      }

      compute()
      window.addEventListener('scroll', compute, { passive: true })
      window.addEventListener('resize', compute, { passive: true })
      return () => {
        window.removeEventListener('scroll', compute)
        window.removeEventListener('resize', compute)
      }
    }, [scroll, requestTick])

    useEffect(() => {
      if (gyroscope) return
      if (scroll) return
      const wrapper = wrapperRef.current
      if (!wrapper) return

      const onMove = (e: MouseEvent) => handlePointerMove(e.clientX)
      const onTouchMove = (e: TouchEvent) => {
        const t = e.touches[0]
        if (t) handlePointerMove(t.clientX)
      }

      // triggerParent: listen on the wrapper's parent element so the
      // whole surrounding container is the hit area. Cursor X is
      // normalized to the PARENT's bounds (cursor anywhere in the
      // parent maps 0 → 1 across the parent's width).
      const parent = wrapper.parentElement
      if (triggerParent && parent) {
        const handleParentMove = (clientX: number) => {
          const r = parent.getBoundingClientRect()
          if (r.width <= 0) return
          const nx = clamp((clientX - r.left) / r.width, 0, 1)
          targetOffsetRef.current = nx
          isHoverRef.current = true
          requestTick()
        }
        const onParentMouse = (e: MouseEvent) => handleParentMove(e.clientX)
        const onParentTouch = (e: TouchEvent) => {
          const t = e.touches[0]
          if (t) handleParentMove(t.clientX)
        }
        const onParentEnter = () => { isHoverRef.current = true }
        const onParentLeave = () => handlePointerLeave()
        const onParentTouchEnd = () => handlePointerLeave()

        parent.addEventListener('mousemove', onParentMouse, { passive: true })
        parent.addEventListener('mouseenter', onParentEnter, { passive: true })
        parent.addEventListener('mouseleave', onParentLeave, { passive: true })
        parent.addEventListener('touchmove', onParentTouch, { passive: true })
        parent.addEventListener('touchend', onParentTouchEnd, { passive: true })
        parent.addEventListener('touchcancel', onParentTouchEnd, { passive: true })

        return () => {
          parent.removeEventListener('mousemove', onParentMouse)
          parent.removeEventListener('mouseenter', onParentEnter)
          parent.removeEventListener('mouseleave', onParentLeave)
          parent.removeEventListener('touchmove', onParentTouch)
          parent.removeEventListener('touchend', onParentTouchEnd)
          parent.removeEventListener('touchcancel', onParentTouchEnd)
        }
      }

      if (trackWindow) {
        window.addEventListener('mousemove', onMove, { passive: true })
        window.addEventListener('touchmove', onTouchMove, { passive: true })
        return () => {
          window.removeEventListener('mousemove', onMove)
          window.removeEventListener('touchmove', onTouchMove)
        }
      }

      // hitMargin > 0: listen on window with expanded bounds so the cursor
      // can slightly overshoot the wrapper and still hold the offset at the
      // extreme. This is what makes "all the way to the right" actually
      // pin offset = 1 even if the user moves a few pixels past the edge.
      if (hitMarginRef.current > 0) {
        const onWindowMove = (e: MouseEvent) => {
          const rect = wrapper.getBoundingClientRect()
          if (rect.width <= 0) return
          const m = hitMarginRef.current
          const inX = e.clientX >= rect.left - m && e.clientX <= rect.right + m
          const inY = e.clientY >= rect.top - m && e.clientY <= rect.bottom + m
          if (!inX || !inY) {
            if (isHoverRef.current) handlePointerLeave()
            return
          }
          handlePointerMove(e.clientX)
        }
        const onWindowTouchMove = (e: TouchEvent) => {
          const t = e.touches[0]
          if (!t) return
          const rect = wrapper.getBoundingClientRect()
          if (rect.width <= 0) return
          const m = hitMarginRef.current
          const inX = t.clientX >= rect.left - m && t.clientX <= rect.right + m
          const inY = t.clientY >= rect.top - m && t.clientY <= rect.bottom + m
          if (!inX || !inY) {
            if (isHoverRef.current) handlePointerLeave()
            return
          }
          handlePointerMove(t.clientX)
        }
        const onTouchEnd = () => handlePointerLeave()
        window.addEventListener('mousemove', onWindowMove, { passive: true })
        window.addEventListener('touchmove', onWindowTouchMove, { passive: true })
        window.addEventListener('touchend', onTouchEnd, { passive: true })
        window.addEventListener('touchcancel', onTouchEnd, { passive: true })
        return () => {
          window.removeEventListener('mousemove', onWindowMove)
          window.removeEventListener('touchmove', onWindowTouchMove)
          window.removeEventListener('touchend', onTouchEnd)
          window.removeEventListener('touchcancel', onTouchEnd)
        }
      }

      const onEnter = () => {
        isHoverRef.current = true
      }
      const onLeave = () => handlePointerLeave()
      const onTouchEnd = () => handlePointerLeave()

      wrapper.addEventListener('mousemove', onMove, { passive: true })
      wrapper.addEventListener('mouseenter', onEnter, { passive: true })
      wrapper.addEventListener('mouseleave', onLeave, { passive: true })
      wrapper.addEventListener('touchmove', onTouchMove, { passive: true })
      wrapper.addEventListener('touchend', onTouchEnd, { passive: true })
      wrapper.addEventListener('touchcancel', onTouchEnd, { passive: true })

      return () => {
        wrapper.removeEventListener('mousemove', onMove)
        wrapper.removeEventListener('mouseenter', onEnter)
        wrapper.removeEventListener('mouseleave', onLeave)
        wrapper.removeEventListener('touchmove', onTouchMove)
        wrapper.removeEventListener('touchend', onTouchEnd)
        wrapper.removeEventListener('touchcancel', onTouchEnd)
      }
    }, [trackWindow, gyroscope, scroll, triggerParent, handlePointerMove, handlePointerLeave, requestTick])

    useEffect(() => {
      if (!gyroscope || typeof window === 'undefined') return
      if (!('DeviceOrientationEvent' in window)) return
      const onOrient = (e: DeviceOrientationEvent) => {
        if (e.gamma == null) return
        const nx = clamp((e.gamma + 45) / 90, 0, 1)
        targetOffsetRef.current = nx
        requestTick()
      }
      window.addEventListener('deviceorientation', onOrient)
      return () => window.removeEventListener('deviceorientation', onOrient)
    }, [gyroscope, requestTick])

    useEffect(() => {
      if (paused) {
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
      } else {
        requestTick()
      }
    }, [paused, requestTick])

    const wrapperStyle = useMemo<CSSProperties>(
      () => ({
        position: 'relative',
        display: 'inline-flex',
        isolation: 'isolate',
        ...style,
      }),
      [style],
    )

    const composedClassName = useMemo(() => {
      const parts = ['lenticular-wrapper']
      if (className) parts.push(className)
      return parts.join(' ')
    }, [className])

    const initialFrontClip = defaultSide === 'front' ? 'inset(0)' : 'inset(50%)'
    const initialBackClip = defaultSide === 'front' ? 'inset(50%)' : 'inset(0)'

    return (
      <div
        ref={wrapperRef}
        className={composedClassName}
        style={wrapperStyle}
        {...rest}
      >
        {/* Always rendered — provides natural layout dimensions and is the
            accessible content seen by screen readers. Visually invisible
            (opacity: 0) so the two clipped overlay layers do all painting. */}
        <div className="lenticular-front-base">{front}</div>

        <div
          ref={backLayerRef}
          className="lenticular-layer lenticular-back-layer"
          aria-hidden="true"
          style={{ clipPath: initialBackClip }}
        >
          {back}
        </div>
        <div
          ref={frontLayerRef}
          className="lenticular-layer lenticular-front-layer"
          aria-hidden="true"
          style={{ clipPath: initialFrontClip }}
        >
          {front}
        </div>
      </div>
    )
  },
)

Lenticular.displayName = 'Lenticular'
