const STYLE_TAG_ATTR = 'data-lenticular-fx'

export function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector(`[${STYLE_TAG_ATTR}]`)) return

  const style = document.createElement('style')
  style.setAttribute(STYLE_TAG_ATTR, '')
  style.textContent = buildCSS()
  document.head.appendChild(style)
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
  isolation: isolate;
  --lenticular-offset: 0;
}

.lenticular-front-base {
  position: relative;
  display: block;
  z-index: 0;
  opacity: 0;
}

.lenticular-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: clip-path;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.lenticular-layer > * {
  width: 100%;
  height: 100%;
  flex: 1;
}

.lenticular-back-layer {
  z-index: 1;
}

.lenticular-front-layer {
  z-index: 2;
}

@media (prefers-reduced-motion: reduce) {
  .lenticular-layer {
    transition: none !important;
  }
}
`
}
