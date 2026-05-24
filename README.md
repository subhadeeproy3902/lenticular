# lenticular-fx

Animated lenticular print effect for React. Two children, one wrapper, alternating vertical slices on `mousemove`. Pure CSS `clip-path`, RAF-driven, zero runtime dependencies.

```bash
bun add lenticular-fx
# or: npm install lenticular-fx / pnpm add lenticular-fx
```

## Quick start

```tsx
import { Lenticular } from 'lenticular-fx'

export function Card() {
  return (
    <Lenticular
      front={<img src="day.jpg" alt="Day" />}
      back={<img src="night.jpg" alt="Night" />}
      slices={12}
    />
  )
}
```

That is the whole API. Move the cursor across the wrapper to drag the offset — the back face restripes into view through interleaved vertical columns, exactly like a lenticular print.

## Props

| Prop             | Type                       | Default   | Description                                                                                                                                                            |
| ---------------- | -------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `front`          | `ReactNode`                | —         | Content shown when the cursor is on the left edge (offset = 0). Required.                                                                                              |
| `back`           | `ReactNode`                | —         | Content shown when the cursor is on the right edge (offset = 1). Required.                                                                                             |
| `slices`         | `number`                   | `10`      | Number of interleaved vertical columns. Clamped to `[2, 40]`.                                                                                                          |
| `ease`           | `number`                   | `0.12`    | Lerp factor applied per animation frame. `1` is instant, `0.01` is molasses. Clamped to `(0, 1]`.                                                                      |
| `defaultSide`    | `'front' \| 'back'`        | `'front'` | Which face shows at rest, before any interaction and after the cursor leaves.                                                                                          |
| `trackWindow`    | `boolean`                  | `false`   | Track the cursor across the whole viewport instead of just the wrapper. Cursor X is still normalized to the wrapper.                                                   |
| `hitMargin`      | `number`                   | `24`      | Extra hit-area, in pixels, added on every side of the wrapper. Lets the cursor overshoot the visible edge and still hold the back fully revealed. Set `0` to disable.  |
| `tilt`           | `number`                   | `0`       | 3D perspective tilt in degrees, driven by the same offset. `0` disables. Typical 6–20: the card rotates around its Y axis to follow the cursor while slicing happens.  |
| `perspective`    | `number`                   | `900`     | CSS perspective in pixels used for the tilt. Lower = stronger 3D effect. Only applied when `tilt > 0`.                                                                 |
| `gyroscope`      | `boolean`                  | `false`   | Use `deviceorientation` gamma (-45° → +45°) instead of mouse, on supported devices. Falls back to mouse if `DeviceOrientationEvent` is missing.                        |
| `paused`         | `boolean`                  | `false`   | Freeze the animation loop on the current frame. Cancels the RAF tick until set back to `false`.                                                                        |
| `onOffsetChange` | `(offset: number) => void` | —         | Called each frame with the current lerped offset (`0` → `1`). Useful for live debugging or driving external UI. Do not call `setState` in this callback — use a ref.   |
| `className`      | `string`                   | —         | Extra class names applied to the wrapper `<div>`.                                                                                                                      |
| `style`          | `CSSProperties`            | —         | Extra inline styles applied to the wrapper `<div>`.                                                                                                                    |

All standard `HTMLDivElement` attributes are forwarded to the wrapper. `forwardRef` returns the wrapper `<div>`.

## How it works

A physical lenticular print is alternating columns of two images placed behind a ribbed lens that redirects light by viewing angle — one eye sees columns from image A, the other from image B, and as you tilt the print the visible strips swap. We simulate that with two stacked overlay layers above an invisible layout base, each cut to a set of vertical rectangles by `clip-path: path()`.

On every `mousemove` the cursor X is normalized to `[0, 1]` relative to the wrapper. A `requestAnimationFrame` loop lerps a `currentOffset` ref toward that target — React never re-renders inside the animation loop. Each frame we recompute two clip-path strings (one per layer) where each slice is a rectangle: the front layer's rectangle spans the left `(1 − offset)` of the slice, the back layer's the remaining right portion. When the stripes fill the slice or shrink below half a pixel we collapse to a single rectangle or hide entirely — that kills the sub-pixel anti-aliasing seams you would otherwise see at the extremes.

A `hitMargin` prop (default 24 px) pads the wrapper's invisible interaction zone so the cursor doesn't have to land on the exact visible edge to fully reveal the back. A single `IntersectionObserver` cancels the RAF when the element scrolls out of view; a RAF-debounced `ResizeObserver` keeps the slice width in sync with layout changes. `prefers-reduced-motion: reduce` short-circuits the lerp to a snap. Touch and `deviceorientation` (gamma → 0–1) are wired through the same target-offset pipeline as the mouse.

## Examples

```tsx
// Card — product to specs
<Lenticular slices={10} ease={0.12}
  front={<ProductFront />}
  back={<ProductSpecs />}
/>

// Avatar — fine grain, slow ease
<Lenticular slices={20} ease={0.08}
  front={<DayFace />}
  back={<NightFace />}
/>

// CTA Button — small element, chunky slices
<Lenticular slices={6} ease={0.18}
  front={<button>Get started →</button>}
  back={<button>Free for 14 days →</button>}
/>

// 3D perspective tilt — card follows cursor while slicing
<Lenticular slices={18} ease={0.12} tilt={14} hitMargin={40}
  front={<DayPostcard />}
  back={<NightPostcard />}
/>

// Track the cursor across the whole page
<Lenticular trackWindow slices={20} front={<Day />} back={<Night />} />

// Snap, no lerp
<Lenticular slices={2} ease={1} front={<Before />} back={<After />} />

// Drive external UI from the offset
const barRef = useRef<HTMLDivElement>(null)
<Lenticular
  onOffsetChange={(o) => { barRef.current!.style.width = `${o * 100}%` }}
  front={...}
  back={...}
/>
```

## Browser support

The effect relies on `clip-path: path()` with multiple sub-paths and the standard `ResizeObserver` / `IntersectionObserver` APIs.

- Chrome / Edge 88+
- Safari 14.1+
- Firefox 63+

`@property --lenticular-offset` is registered for compatibility with future styling hooks but is not required — clip paths are computed in JS each frame.

## Credits

Built by [Subhadeep Roy](https://x.com/mvp_Subha) with [Claude](https://claude.com) — pair-programmed end-to-end, from the slice maths and the `clip-path` engine to the demo gallery, the 3D-tilt example, and the SEO/AEO wiring.

## License

MIT © [Subhadeep Roy](https://x.com/mvp_Subha)
