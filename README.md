<p align="center">
  <a href="https://lenticular.mvp-subha.me">
    <img src="https://lenticular.mvp-subha.me/og.png" alt="lenticular-fx — animated lenticular print effect for React" width="780" />
  </a>
</p>


<h1 align="center">lenticular-fx</h1>

<p align="center">
  <b>Animated lenticular print effect for React.</b><br />
  Two children, one wrapper. Slide the cursor and the back face restripes through interleaved vertical clip-path columns — exactly like a physical lenticular card.<br />
  Pure CSS <code>clip-path</code>, RAF-driven, optional 3D perspective tilt, zero runtime dependencies.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/lenticular-fx"><img alt="npm version" src="https://img.shields.io/npm/v/lenticular-fx?style=flat-square&color=de2f4f&label=lenticular-fx&labelColor=0a0a0a" /></a>
  <a href="https://www.npmjs.com/package/lenticular-fx"><img alt="downloads / month" src="https://img.shields.io/npm/dm/lenticular-fx?style=flat-square&color=de2f4f&labelColor=0a0a0a" /></a>
  <a href="https://bundlephobia.com/package/lenticular-fx"><img alt="gzipped size" src="https://img.shields.io/bundlephobia/minzip/lenticular-fx?style=flat-square&label=min+gzip&color=de2f4f&labelColor=0a0a0a" /></a>
  <a href="https://www.npmjs.com/package/lenticular-fx"><img alt="TypeScript types" src="https://img.shields.io/npm/types/lenticular-fx?style=flat-square&color=3178c6&labelColor=0a0a0a" /></a>
  <a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/npm/l/lenticular-fx?style=flat-square&color=fbfbfb&labelColor=0a0a0a" /></a>
  <a href="https://github.com/subhadeeproy3902/lenticular/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/subhadeeproy3902/lenticular?style=flat-square&color=ffe080&labelColor=0a0a0a" /></a>
</p>

<p align="center">
  <a href="https://lenticular.mvp-subha.me"><b>Live demo</b></a>
  &nbsp;·&nbsp;
  <a href="#installation">Install</a>
  &nbsp;·&nbsp;
  <a href="#quick-start">Quick start</a>
  &nbsp;·&nbsp;
  <a href="#examples">Examples</a>
  &nbsp;·&nbsp;
  <a href="#api-reference">API</a>
  &nbsp;·&nbsp;
  <a href="#how-it-works">How it works</a>
</p>

---

## Why lenticular-fx?

| | |
|---|---|
| 🖼 **Pure CSS clip-path** | No canvas, no WebGL, no animation library. Just two stacked overlays cut into vertical strips by `clip-path: path()`. |
| 🎯 **2–40 slices** | Crank for fine-grain holographic feel or drop for chunky printed-card vibes. The slice maths are RAF-debounced and pixel-clean. |
| 🌀 **3D perspective tilt** | Optional `tilt` prop applies a live `rotateY` driven by the same offset that scrubs the slicing — feels like dragging a real postcard. |
| 📜 **Scroll, gyroscope, cursor** | Three input modes share one offset pipeline. <code>scroll</code> = page progress, <code>gyroscope</code> = device tilt, default = mouse. |
| 🪟 **Big hit area** | `hitMargin` (default 24 px) pads the interaction zone so the cursor can overshoot the visible edge and still pin the back fully revealed. |
| 🔌 **Triggerable from parent** | `triggerParent` listens on the wrapper's parent — the whole surrounding card becomes the hit target. |
| 📦 **Zero runtime deps** | Just `react` and `react-dom` peer-deps. ~3 kB gzipped. |
| 🟦 **SSR-safe, fully typed** | No `window` access at module level. First-class TypeScript types. Respects `prefers-reduced-motion`. |

## Installation

```bash
bun add lenticular-fx
# or
npm install lenticular-fx
# or
pnpm add lenticular-fx
```

Peer dependencies: `react >= 18`, `react-dom >= 18`.

## Quick start

```tsx
import { Lenticular } from 'lenticular-fx'

export function Card() {
  return (
    <Lenticular
      slices={12}
      front={<img src="/day.jpg" alt="Day" />}
      back={<img src="/night.jpg" alt="Night" />}
    />
  )
}
```

That's the whole API. Move the cursor across the wrapper and the back face restripes into view through interleaved vertical columns. Zero config beyond the two children.

## Examples

```tsx
// Card — product to specs
<Lenticular slices={10} ease={0.12}
  front={<ProductFront />}
  back={<ProductSpecs />}
/>

// Avatar — fine grain, slow lerp
<Lenticular slices={20} ease={0.08}
  front={<DayFace />}
  back={<NightFace />}
/>

// CTA — small element, chunky slices
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
<Lenticular trackWindow slices={20}
  front={<Day />} back={<Night />}
/>

// Scroll-driven — offset follows viewport progress
<Lenticular scroll slices={14}
  front={<Hero variant="a" />} back={<Hero variant="b" />}
/>

// Instant snap, no lerp
<Lenticular slices={2} ease={1}
  front={<Before />} back={<After />}
/>

// Drive external UI from the offset (use a ref, not setState)
const barRef = useRef<HTMLDivElement>(null)

<Lenticular
  onOffsetChange={(o) => {
    if (barRef.current) barRef.current.style.width = `${o * 100}%`
  }}
  front={<Front />}
  back={<Back />}
/>
```

## API reference

`<Lenticular>` is the only export. All standard `HTMLDivElement` attributes are forwarded to the wrapper. `ref` resolves to the wrapper `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `front` | `ReactNode` | **required** | Content shown when the cursor is on the left edge (offset = 0). |
| `back` | `ReactNode` | **required** | Content shown when the cursor is on the right edge (offset = 1). |
| `slices` | `number` | `10` | Number of interleaved vertical columns. Clamped to `[2, 40]`. |
| `ease` | `number` | `0.12` | Lerp factor applied each animation frame. `1` = instant, `0.01` = molasses. Clamped to `(0, 1]`. |
| `defaultSide` | `'front' \| 'back'` | `'front'` | Which face shows at rest, before any interaction and after the cursor leaves. |
| `trackWindow` | `boolean` | `false` | Track the cursor across the whole viewport. X is still normalized to the wrapper. |
| `hitMargin` | `number` | `24` | Extra hit-area in px on every side of the wrapper. Lets the cursor overshoot the visible edge and still pin the back fully revealed. Set `0` to disable. |
| `triggerParent` | `boolean` | `false` | Listen on the wrapper's parent element. Cursor X is normalized to the parent's bounds — the whole surrounding card becomes the hit target. |
| `scroll` | `boolean` | `false` | Drive offset from the element's scroll progress through the viewport instead of the cursor. |
| `tilt` | `number` | `0` | 3D perspective tilt in degrees, driven by the same offset. `0` disables. Typical 6–20. |
| `perspective` | `number` | `900` | CSS perspective in pixels used for the tilt. Lower = stronger 3D effect. Only applied when `tilt > 0`. |
| `gyroscope` | `boolean` | `false` | Use `deviceorientation` gamma (-45° → +45°) instead of mouse, on supported devices. Falls back to mouse if `DeviceOrientationEvent` is missing. |
| `paused` | `boolean` | `false` | Freeze the animation loop on the current frame. |
| `onOffsetChange` | `(offset: number) => void` | — | Called each animation frame with the current lerped offset (`0` → `1`). Use a ref — never call `setState` in this. |
| `className` | `string` | — | Extra class names applied to the wrapper `<div>`. |
| `style` | `CSSProperties` | — | Extra inline styles applied to the wrapper `<div>`. |

## How it works

### The physical effect

A lenticular print is alternating vertical columns of two images placed behind a ribbed lens that redirects light by viewing angle — one eye sees columns from image A, the other from image B, and as you tilt the print the visible strips swap.

We simulate it with **two stacked overlay layers above an invisible layout base**, each cut to a set of vertical rectangles by `clip-path: path()`.

### The slice maths

```
slices = 10

Each slice is 1/slices wide (10% of the total width).
front  occupies odd  slices: 0%, 20%, 40%, 60%, 80%
back   occupies even slices: 10%, 30%, 50%, 70%, 90%

As --lenticular-offset goes 0 → 1, the clip-path boundaries
shift by one full slice width:
  offset = 0   → fully front
  offset = 0.5 → 50/50 mix
  offset = 1   → fully back
```

On every `mousemove` the cursor X is normalized to `[0, 1]` relative to the wrapper. A `requestAnimationFrame` loop lerps a `currentOffset` ref toward that target — React never re-renders inside the animation loop. Each frame we recompute two `clip-path` strings (one per layer) where each slice is a rectangle: the front layer's rectangle spans the left `(1 − offset)` of the slice, the back layer's the remaining right portion. When the stripes fill the slice or shrink below half a pixel we collapse to a single rectangle or hide entirely — that kills the sub-pixel anti-aliasing seams you would otherwise see at the extremes.

### The infrastructure

- `IntersectionObserver` cancels the RAF when the element scrolls out of view; resumes on re-entry
- RAF-debounced `ResizeObserver` keeps the slice width in sync with layout changes — never caches dimensions at mount
- `prefers-reduced-motion: reduce` short-circuits the lerp to an instant snap
- `hitMargin` pads the invisible interaction zone (window-attached listener) so the cursor doesn't have to land on the exact visible edge
- Touch and `deviceorientation` (gamma → 0–1) feed the same target-offset pipeline as the mouse
- `@property --lenticular-offset` is registered for future styling hooks; the clip paths themselves are computed in JS each frame

### Performance

- All animation state lives in refs — `useRef` for RAF id, current/target offset, observer instances. **Zero `setState` calls in the loop.**
- Style updates go straight onto `element.style.setProperty` / `element.style.clipPath` — never React-driven
- Off-screen instances cancel their RAF entirely via `IntersectionObserver`
- Overlay layers are `pointer-events: none` — the wrapped children stay fully clickable, focusable, selectable
- The base layer (visually invisible via `opacity: 0`) provides natural layout dimensions and is the accessible content seen by screen readers

## Browser support

The effect relies on `clip-path: path()` with multiple sub-paths and the standard `ResizeObserver` / `IntersectionObserver` APIs.

- Chrome / Edge **88+**
- Safari **14.1+** (incl. iOS Safari)
- Firefox **63+**

SSR-safe — no `window` access at module level. The component renders a static placeholder (the `front` face fully visible) during SSR; listeners and the RAF loop only attach after hydration.

## Demo

The live demo at **[lenticular.mvp-subha.me](https://lenticular.mvp-subha.me)** ships with:

- A global `slices` slider that updates every example live
- Card / avatar / CTA examples — the three "core" demos from the spec
- A 3D-perspective-tilt example showing `tilt={14}` with `hitMargin={40}`
- A playground with live controls for every prop and an auto-updating code snippet
- Gallery — album cover, trading card, number card, status pill, portrait, price tag, quote, ticker, mode toggle
- Dark / light theme toggle
- Full SEO / AEO meta stack — Open Graph, Twitter card, JSON-LD `SoftwareSourceCode` + `FAQPage`

## Links

- 📦 npm — **[lenticular-fx](https://www.npmjs.com/package/lenticular-fx)**
- 🌐 Demo — **[lenticular.mvp-subha.me](https://lenticular.mvp-subha.me)**
- 💻 GitHub — **[subhadeeproy3902/lenticular](https://github.com/subhadeeproy3902/lenticular)**
- 🐦 Author — **[@mvp_Subha](https://x.com/mvp_Subha)**

## Credits

Built by **[Subhadeep Roy](https://x.com/mvp_Subha)** with **[Claude](https://claude.com)** — pair-programmed end-to-end, from the slice maths and the `clip-path` engine to the demo gallery, the 3D-tilt example, and the SEO/AEO wiring.

## License

MIT © [Subhadeep Roy](https://x.com/mvp_Subha)
