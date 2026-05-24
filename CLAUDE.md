# CLAUDE.md — lenticular-fx

> Read this entire file before writing a single line of code.
> This is the source of truth for every decision in this project.

---

## What This Project Is

`lenticular-fx` is a hyper-focused, single-concept React npm package that adds a **lenticular print effect** to any element. Moving the mouse left → right reveals two different pieces of content through interleaved vertical slices — exactly like physical lenticular stickers, trading cards, or album covers.

---

## The Effect — Understand This Deeply Before Coding

A lenticular print physically works like this: alternating vertical columns of two images are printed and placed behind a ribbed lens. The lens redirects light depending on viewing angle, so one eye sees columns from image A and the other sees columns from image B.

On the web we simulate it like this:

1. Take two children (`front` and `back`)
2. Slice them into `N` vertical columns using `clip-path`
3. Odd columns always show `front`, even columns always show `back`
4. On `mousemove`, read the cursor X position relative to the wrapper (0 → 1)
5. Shift the `clip-path` columns using a CSS custom property `--lenticular-offset`
6. As offset moves from 0 to 1, the slices flip — `front` goes from fully visible to fully hidden

The output feels like dragging a lenticular card across your field of view. It is pure CSS + `mousemove`. **No WebGL. No canvas. No external dependencies.**

### Slice mechanics

```
slices = 10 (default)

Each slice is 1/slices wide (10% of the total width).
front occupies odd slices: 0%, 20%, 40%, 60%, 80%
back  occupies even slices: 10%, 30%, 50%, 70%, 90%

As --lenticular-offset goes from 0 → 1,
the clip-path boundaries shift by one full slice width.
At offset=0: fully front
At offset=0.5: 50/50 mix
At offset=1: fully back
```

---

## Project Structure

Mirror this exactly. No deviations.

```
lenticular-fx/
├── src/
│   ├── index.ts              # Public exports only
│   ├── Lenticular.tsx        # The one component
│   ├── types.ts              # All TypeScript types/interfaces
│   └── styles.ts             # CSS generation (returns style string injected via <style>)
├── demo/                     # Vite + React demo site (separate from lib)
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx           # All demo examples live here
│       └── examples/         # Individual example components
│           ├── CardExample.tsx
│           ├── ButtonExample.tsx
│           └── HeroExample.tsx
├── dist/                     # Built output — never edit manually
├── .github/
│   └── workflows/
│       └── publish.yml       # Auto-publish to npm on release tag
├── .gitignore
├── .npmignore
├── LICENSE                   # MIT
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── vite.config.ts
```

---

## Component API

### `<Lenticular>`

The one and only export. Wraps two children.

```tsx
import { Lenticular } from 'lenticular-fx';

<Lenticular front={<CardFront />} back={<CardBack />} />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `front` | `ReactNode` | — | Content shown when cursor is on the left |
| `back` | `ReactNode` | — | Content shown when cursor is on the right |
| `slices` | `number` | `10` | Number of vertical columns. More = finer grain. Min 2, max 40 |
| `ease` | `number` | `0.12` | Lerp factor for cursor smoothing (0.01 slow, 1 instant) |
| `trackWindow` | `boolean` | `false` | Track mouse across entire window instead of just the element |
| `gyroscope` | `boolean` | `false` | Use device orientation (beta) on mobile instead of mouse |
| `paused` | `boolean` | `false` | Freezes on current frame, keeps slices visible |
| `defaultSide` | `'front' \| 'back'` | `'front'` | Which face shows at rest (no hover) |
| `className` | `string` | — | Extra class on the wrapper div |
| `style` | `CSSProperties` | — | Extra inline styles on the wrapper div |

### Forwarded props

All standard `HTMLDivElement` attributes are forwarded to the wrapper `<div>`.

---

## Implementation Rules — Non-Negotiable

### 1. Zero runtime dependencies
`peerDependencies`: only `react` and `react-dom`.
`dependencies`: nothing. Not framer-motion, not gsap, not anything.

### 2. Effect layers must never steal interactions
Every overlay div uses `pointer-events: none`. The wrapped children stay fully clickable, focusable, selectable.

### 3. SSR safe
The component must render a static placeholder (showing `front` fully) during SSR. The `mousemove` listener and `clip-path` animation only attach after hydration. No `window` access at module level.

### 4. CSS injection via `<style>` tag, not CSS files
Like border-beam's `styles.ts`, generate the CSS as a string and inject it once into `document.head` using a singleton pattern. This avoids bundler CSS configuration issues for consumers. The style tag gets a `data-lenticular-fx` attribute so it's only injected once.

### 5. ResizeObserver for dimensions
Never cache element dimensions at mount. Use `ResizeObserver` to track the wrapper's width. Debounce via `requestAnimationFrame`. Clean up on unmount.

### 6. Lerp the cursor position
Do NOT set `--lenticular-offset` directly from raw `mousemove`. Use a `requestAnimationFrame` loop with linear interpolation:

```ts
current += (target - current) * ease;
```

This gives the smooth "dragging a physical card" feeling. Cancel the RAF loop when `paused` is true or when the element is off-screen.

### 7. IntersectionObserver to pause off-screen
When the component scrolls out of the viewport, cancel the RAF loop entirely. Resume when it re-enters. This is exactly what metal-fx does.

### 8. Clip-path generation in CSS

The slice grid is generated in `styles.ts` as a CSS string. Each slice is a `polygon()` clip-path. The `--lenticular-offset` custom property (registered via `@property`) drives the column boundaries.

`@property` registration:
```css
@property --lenticular-offset {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}
```

### 9. Gyroscope support
When `gyroscope={true}`, listen to `deviceorientation` instead of `mousemove`. Map `event.gamma` (-90° to 90°) to 0–1 offset. Gate behind feature detection (`window.DeviceOrientationEvent`).

### 10. `prefers-reduced-motion`
When the user has `prefers-reduced-motion: reduce` set, snap offset to 0 or 1 instantly (no lerp, no animation). The content still reveals on interaction, just without the smooth transition.

---

## `src/index.ts`

Only export what consumers need:

```ts
export { Lenticular } from './Lenticular';
export type { LenticularProps } from './types';
```

---

## `src/types.ts`

```ts
import type { CSSProperties, ReactNode } from 'react';

export interface LenticularProps {
  front: ReactNode;
  back: ReactNode;
  slices?: number;
  ease?: number;
  trackWindow?: boolean;
  gyroscope?: boolean;
  paused?: boolean;
  defaultSide?: 'front' | 'back';
  className?: string;
  style?: CSSProperties;
}
```

---

## `src/styles.ts`

Responsibilities:
- Generate the wrapper CSS (position: relative, display: inline-flex, overflow: hidden)
- Generate the overlay layer CSS (position: absolute, inset: 0, pointer-events: none)
- Register `@property --lenticular-offset`
- Inject once into `document.head` via singleton

```ts
const STYLE_TAG_ATTR = 'data-lenticular-fx';

export function injectStyles(): void {
  if (typeof document === 'undefined') return; // SSR guard
  if (document.querySelector(`[${STYLE_TAG_ATTR}]`)) return; // already injected
  const style = document.createElement('style');
  style.setAttribute(STYLE_TAG_ATTR, '');
  style.textContent = buildCSS();
  document.head.appendChild(style);
}

function buildCSS(): string {
  return `
    @property --lenticular-offset {
      syntax: '<number>';
      inherits: false;
      initial-value: 0;
    }
    .lenticular-wrapper {
      position: relative;
      display: inline-flex;
    }
    .lenticular-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
  `;
}
```

---

## `src/Lenticular.tsx` — Architecture

```
<div className="lenticular-wrapper" ref={wrapperRef}>
  {/* Always rendered, acts as the base/layout source */}
  <div className="lenticular-front-base">{front}</div>

  {/* Sliced overlay layers — pointer-events: none */}
  <div className="lenticular-layer lenticular-back-layer">
    {/* back content, clipped to even columns */}
    {back}
  </div>
  <div className="lenticular-layer lenticular-front-layer">
    {/* front content, clipped to odd columns */}
    {front}
  </div>
</div>
```

The front base div is rendered without clipping to provide natural layout dimensions. The two overlay layers sit on top of it, each clipped to their respective column pattern. As `--lenticular-offset` changes, `clip-path` boundaries shift.

### RAF loop structure

```ts
let rafId: number;
let currentOffset = defaultSide === 'front' ? 0 : 1;
let targetOffset = currentOffset;

function tick() {
  currentOffset += (targetOffset - currentOffset) * ease;
  // set CSS custom property on wrapperRef.current
  wrapperRef.current?.style.setProperty(
    '--lenticular-offset',
    currentOffset.toFixed(4)
  );
  rafId = requestAnimationFrame(tick);
}
```

Clip-path is computed in JS from `slices` count and applied as inline style strings, or as a dynamically generated `<style>` block with the computed polygons as CSS custom property consumers.

---

## `vite.config.ts` — Copy Exactly

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LenticularFx',
      fileName: (format) => `index.${format === 'es' ? 'es' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
});
```

---

## `package.json` — Copy This Pattern Exactly

```json
{
  "name": "lenticular-fx",
  "version": "1.0.0",
  "description": "Animated lenticular print effect for React",
  "type": "module",
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.es.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.cjs.js"
      }
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.7.0"
  },
  "keywords": [
    "react", "animation", "lenticular", "effect",
    "css", "parallax", "hover", "reveal"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/lenticular-fx.git"
  },
}
```

---

## `.npmignore`

```
demo/
src/
*.config.ts
tsconfig*.json
.github/
```

---

## `.github/workflows/publish.yml`

Auto-publish to npm when a version tag is pushed:

```yaml
name: Publish to npm
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Demo Site (`demo/`)

The demo site is a standalone Vite app. It must show THREE examples minimum:

### Example 1 — Card (Hero example, first thing visible)
Two states of a product card. Front: product image + name. Back: specs/details. Dark background. This is the "wow" moment.

### Example 2 — Avatar / Profile
Two photos of the same person (or two characters). `slices={20}` for fine grain. Demonstrates the effect on images.

### Example 3 — Button / CTA
A CTA button. Front: "Get started". Back: a price or "14-day free trial". Small, tight. Shows the effect works on tiny elements too.

### Demo site aesthetic
- Dark background `#070707` (same as metal and beam demos)
- Monospace or clean sans-serif
- Each example has a label showing its code usage below it
- A `slices` slider that updates all examples live
- Show the npm install command: `npm install lenticular-fx`

---

## TypeScript Rules

- `strict: true` always
- No `any`. Use `unknown` and narrow properly.
- All props typed via `LenticularProps` from `types.ts`
- Ref types: `RefObject<HTMLDivElement>`
- Event types: `MouseEvent`, `DeviceOrientationEvent`
- Use `useCallback` for `mousemove` and `deviceorientation` handlers
- Use `useRef` for RAF id, current/target offset, and observer instances — NOT `useState` (avoids re-renders in the animation loop)

---

## Performance Constraints

- The RAF loop runs at most once per frame globally, not per instance
- `ResizeObserver` callbacks are debounced through RAF (not `setTimeout`)
- `IntersectionObserver` disconnects the RAF when hidden, reconnects when visible
- Style property updates go directly on `element.style.setProperty()` — never trigger React re-renders
- No `setState` inside the animation loop

---

## Accessibility

- All overlay layers: `aria-hidden="true"` and `pointer-events: none`
- The `front` base layer is the accessible content — screen readers see it
- Keyboard users: `defaultSide` is always fully visible, no interaction required
- `prefers-reduced-motion`: when active, skip lerp — snap to target immediately
- Component forwards `tabIndex` and all aria attributes to the wrapper

---

## What NOT to Do

- ❌ Do not use `useState` for animation values (causes re-renders)
- ❌ Do not use CSS transitions on `clip-path` — you control the animation via RAF
- ❌ Do not use `framer-motion` or any animation library
- ❌ Do not add a canvas or WebGL context — this is pure CSS + JS
- ❌ Do not cache `getBoundingClientRect()` on mount — use `ResizeObserver`
- ❌ Do not import CSS files — inject via `styles.ts` singleton
- ❌ Do not expose internal implementation details as props
- ❌ Do not add a `children` prop — the API is `front` and `back` only
- ❌ Do not add `defaultProps` — use default parameter values in the function signature

---

## Code Style

- Functional components only
- Named exports only (no default exports from `src/`)
- Arrow functions for event handlers, regular functions for components
- 2-space indentation
- Single quotes
- No semicolons in TS files (follow the border-beam style)
- Descriptive variable names: `targetOffset` not `t`, `wrapperRef` not `ref`

---

## Definition of Done

Before considering any part complete, verify:

- [ ] `npm run build` exits with 0 errors
- [ ] `npm run typecheck` exits with 0 errors
- [ ] `dist/index.es.js`, `dist/index.cjs.js`, `dist/index.d.ts` all exist after build
- [ ] Component renders correctly on dark background
- [ ] Mouse movement reveals back content progressively
- [ ] Slices are visually clean with no gaps or rendering artifacts
- [ ] `pointer-events: none` confirmed (children are clickable)
- [ ] Works on SSR (no `window` access at module level)
- [ ] Demo site runs on `npm run dev` from `/demo`
- [ ] All three demo examples render and animate
- [ ] `prefers-reduced-motion` snaps without animation
- [ ] `gyroscope` prop works on mobile Chrome/Firefox
