import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

export interface LenticularProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Content shown when the cursor is on the left edge (offset = 0).
   * Renders as the base layer that defines layout dimensions.
   */
  front: ReactNode

  /**
   * Content shown when the cursor is on the right edge (offset = 1).
   * Sits in interleaved vertical slices on top of the front layer.
   */
  back: ReactNode

  /**
   * Number of vertical columns used to interleave the two layers.
   * More slices means finer grain. Clamped to [2, 40].
   * @default 10
   */
  slices?: number

  /**
   * Linear-interpolation factor used per RAF tick to smooth the cursor
   * position. 1 = instant, 0.01 = very slow. Clamped to (0, 1].
   * @default 0.12
   */
  ease?: number

  /**
   * Track mouse movement across the entire window instead of just the
   * element bounds. Useful for hero sections.
   * @default false
   */
  trackWindow?: boolean

  /**
   * Extra hit-area (in pixels) added on every side of the wrapper. The
   * cursor is normalized to the wrapper bounds, but the listener stays
   * active while the cursor is within `hitMargin` of those bounds — so
   * the back view stays fully revealed even if the user slightly
   * overshoots the visible edge. Set to `0` to disable. Listens on the
   * window when greater than `0`.
   * @default 24
   */
  hitMargin?: number

  /**
   * Drive the offset from the element's scroll progress through the
   * viewport instead of the cursor. As the wrapper scrolls from the
   * bottom of the viewport up through the top, the offset travels from
   * `0` → `1`. Mouse / touch / gyroscope listeners are disabled while
   * this is on. Useful for "reveal as you scroll" hero sections.
   * @default false
   */
  scroll?: boolean

  /**
   * Use device orientation (gyroscope) instead of mouse on supported
   * devices. Falls back to mouse if `DeviceOrientationEvent` is missing.
   * @default false
   */
  gyroscope?: boolean

  /**
   * Freeze on the current frame. The slices remain visible but no
   * further updates are applied.
   * @default false
   */
  paused?: boolean

  /**
   * Which face is shown at rest, before any user interaction and after
   * the cursor leaves the element.
   * @default 'front'
   */
  defaultSide?: 'front' | 'back'

  /**
   * Called each animation frame with the current lerped offset (0 → 1).
   * Useful for live debugging or driving external UI from the cursor
   * position. Do not setState in this callback — use a ref.
   */
  onOffsetChange?: (offset: number) => void

  /**
   * 3D perspective tilt, in degrees, applied to the wrapper as
   * `rotateY` driven by the same lerped offset. `0` disables, any
   * positive number turns it on (typical range: 6–20). At offset = 0
   * the right edge of the card faces the viewer; at offset = 1 the
   * left edge does; at 0.5 it sits flat. Lenticular slicing still
   * happens normally underneath.
   * @default 0
   */
  tilt?: number

  /**
   * CSS perspective in pixels used for the tilt. Lower = stronger
   * 3D effect. Only used when `tilt > 0`.
   * @default 900
   */
  perspective?: number

  /**
   * Extra class names applied to the wrapper `<div>`.
   */
  className?: string

  /**
   * Extra inline styles applied to the wrapper `<div>`.
   */
  style?: CSSProperties
}
