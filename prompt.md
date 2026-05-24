# prompt.md — Claude Code Kickoff Prompt

> Paste this as your very first message to Claude Code in a fresh session.
> Do not modify it. The specificity is intentional.

---

## The Prompt

```
Read CLAUDE.md completely before doing anything else. It is the single source of truth for this entire project. Do not make any assumptions that contradict it.

You are building `lenticular-fx` — a focused, production-quality React npm package for a lenticular print effect. Study the reference repos linked in CLAUDE.md to understand the exact quality bar and structural pattern expected.

Work in this exact order. Complete each step fully before moving to the next. Do not skip ahead.

---

STEP 1 — Scaffold the repo

Create the full directory structure from CLAUDE.md:
- /src with index.ts, Lenticular.tsx, types.ts, styles.ts (all empty stubs)
- /demo with its own vite.config.ts, package.json, and src/
- Root-level: package.json, vite.config.ts, tsconfig.json, tsconfig.build.json, .gitignore, .npmignore, LICENSE, README.md

Use the exact package.json from CLAUDE.md — especially the exports map, peerDependencies, sideEffects: false, and the prepublishOnly script. Do not invent fields that aren't in CLAUDE.md.

Use the exact vite.config.ts from CLAUDE.md — library mode, ESM + CJS, react and react-dom as externals.

For tsconfig.json use strict: true, target ES2020, jsx react-jsx.
For tsconfig.build.json exclude demo/ and exclude test files.

---

STEP 2 — Build types.ts

Write the complete LenticularProps interface as defined in CLAUDE.md.
Export it as a named export.
Add JSDoc comments to every prop explaining what it does.

---

STEP 3 — Build styles.ts

Implement the CSS injection singleton:
- injectStyles() function
- Singleton guard using data-lenticular-fx attribute
- SSR guard (typeof document === 'undefined')
- @property registration for --lenticular-offset (syntax: '<number>', inherits: false, initial-value: 0)
- Base CSS for .lenticular-wrapper and .lenticular-layer

Do NOT put any slice geometry logic here. That belongs in the component.

---

STEP 4 — Build Lenticular.tsx (core)

This is the main file. Take your time. Follow CLAUDE.md's architecture section exactly.

DOM structure:
  wrapper div (ref: wrapperRef, position relative, inline-flex)
    └── front-base div (no clip, provides layout dimensions, aria visible)
    └── back-layer div (clip-path to even columns, aria-hidden, pointer-events none)
    └── front-layer div (clip-path to odd columns, aria-hidden, pointer-events none)

Animation loop:
- useRef for currentOffset, targetOffset, rafId
- RAF loop runs tick() which lerps currentOffset toward targetOffset
- Sets --lenticular-offset directly on wrapperRef via style.setProperty()
- Never calls setState inside tick()

Clip-path generation:
- Compute slice polygon strings in JS from slices prop and current element width
- Apply as inline style on back-layer and front-layer divs
- Recompute clip-paths when ResizeObserver fires (debounced via RAF)

Mouse tracking:
- mousemove on wrapper (or window if trackWindow=true)
- Normalize clientX to 0-1 relative to wrapper bounds via getBoundingClientRect()
- Set targetOffset = normalizedX
- On mouseleave, snap targetOffset back to defaultSide === 'front' ? 0 : 1

Gyroscope:
- If gyroscope={true} AND DeviceOrientationEvent is available: listen to deviceorientation
- Map event.gamma from [-45, 45] to [0, 1]
- Falls back to mouse if DeviceOrientationEvent is not available

IntersectionObserver:
- Pause RAF loop when not intersecting
- Resume when intersecting again

ResizeObserver:
- Watch wrapperRef for size changes
- Debounce via RAF — do not call synchronously

prefers-reduced-motion:
- Check window.matchMedia('(prefers-reduced-motion: reduce)').matches on mount
- If true, set ease to 1 (instant snap, no lerp)

SSR:
- Return a simple wrapper div showing front during SSR
- Only attach all observers and RAF after mount (inside useEffect)

Cleanup on unmount:
- cancelAnimationFrame(rafId)
- ResizeObserver.disconnect()
- IntersectionObserver.disconnect()
- Remove mousemove / deviceorientation event listeners

---

STEP 5 — Build src/index.ts

Export Lenticular and LenticularProps. Nothing else.

---

STEP 6 — Build the demo App.tsx

Three examples on a dark (#070707) background:

Example 1 — "Card" (hero example, top of page)
  Use two div cards (front: dark card with a fake product name + price, back: dark card with specs bullets)
  slices={10}, ease={0.12}
  Show the npm install command above it: npm install lenticular-fx
  Show the code snippet below it

Example 2 — "Avatar" (middle)
  Two colored gradient divs simulating two different "faces" (use CSS gradients, not images, so it works without assets)
  slices={20}, ease={0.08}
  Label: "Fine grain — slices={20}"

Example 3 — "CTA Button" (bottom)
  Small element. Front: "Get started →". Back: "Free for 14 days →"  
  slices={6}, ease={0.18}
  Label: "Works on small elements too"

Add a global slices slider at the top that overrides slices on all three examples simultaneously. Range: 2 to 40.

Demo site must run standalone: cd demo && npm install && npm run dev

---

STEP 7 — Build the GitHub Actions workflow

Create .github/workflows/publish.yml exactly as specified in CLAUDE.md.

---

STEP 8 — Write README.md

Sections in this order:
1. Title: lenticular-fx
2. One-line description
3. Install: npm install lenticular-fx
4. Quick start code block (exactly like border-beam's README — minimal, copy-pasteable)
5. Props table (all props, types, defaults, descriptions)
6. How it works (2-3 paragraphs: the physics analogy, the CSS implementation, the performance approach)
7. Examples section (Card, Avatar, CTA — same three as demo)
8. Browser support: CSS @property — Chrome 85+, Safari 15.4+, Firefox 128+
9. License: MIT

---

STEP 9 — Run typecheck

Run: npm run typecheck from the root.
Fix every TypeScript error. Do not suppress with @ts-ignore.
Zero errors is the only acceptable outcome.

---

STEP 10 — Run build

Run: npm run build from the root.
Verify dist/ contains:
  - index.es.js
  - index.cjs.js
  - index.d.ts

If build fails, read the error carefully and fix it. Do not move on until the build is clean.

---

STEP 11 — Run demo

Run: cd demo && npm run dev
Verify it starts without errors.
Confirm all three examples are visible and the lenticular effect works on mousemove.

---

After all 11 steps are done, tell me:
- The exact file tree of what was created
- The exact npm install command
- The exact quick-start snippet
- Any decisions you made that weren't covered in CLAUDE.md (there should be few)

Do not ask me clarifying questions. CLAUDE.md has the answers. If something genuinely isn't covered, make the most conservative, least-surprising choice and note it at the end.
```
