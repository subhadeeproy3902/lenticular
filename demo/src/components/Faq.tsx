const items = [
  {
    q: 'What is lenticular-fx?',
    a: 'A React component that recreates the lenticular print effect on any content. Wrap two children (front and back), slide the cursor across the wrapper, and the back face restripes into view through interleaved vertical clip-path columns — exactly like a physical lenticular sticker, trading card, or postcard.',
  },
  {
    q: 'How do I install lenticular-fx?',
    a: 'bun add lenticular-fx, npm install lenticular-fx, or pnpm add lenticular-fx. It declares react and react-dom as peer dependencies and has zero runtime dependencies of its own. About 10 kB packed, gzip ~3 kB.',
  },
  {
    q: 'Does it work with server-side rendering?',
    a: 'Yes — SSR-safe. No window access at module level. Styles are injected once on the client via a singleton style tag. The initial render shows the front face statically; mouse listeners and the requestAnimationFrame loop only attach after hydration.',
  },
  {
    q: 'Can the card tilt in 3D as I slide the cursor?',
    a: 'Yes. Pass the tilt prop in degrees (e.g. tilt={14}) and the wrapper applies transform: perspective(900px) rotateY(...) each frame driven by the same lerped offset. A perspective prop lets you tune the depth.',
  },
  {
    q: 'Why does the back face not fully reveal at the rightmost edge?',
    a: 'Without hitMargin you have to land the cursor on the exact wrapper edge. lenticular-fx defaults hitMargin to 24 pixels — extra hit-area on every side — so you can overshoot the visible edge and still pin the offset at 1, keeping the back fully revealed. Bump it higher (40–60) for chunkier cards.',
  },
  {
    q: 'Which browsers are supported?',
    a: 'Chrome / Edge 88+, Safari 14.1+, Firefox 63+. The effect uses clip-path: path() with multiple sub-paths plus standard ResizeObserver and IntersectionObserver APIs — all available in evergreen browsers.',
  },
  {
    q: 'Does it respect prefers-reduced-motion?',
    a: 'Yes. When the user has prefers-reduced-motion: reduce set, the lerp is short-circuited to an instant snap. The content still reveals on interaction, just without the smooth interpolation.',
  },
]

export function Faq() {
  return (
    <section className="section faq-section" aria-label="Frequently asked questions">
      <h2 className="section-title">FAQ</h2>
      <p className="example-caption">
        Quick answers for both humans and AI search engines (this section is
        also serialized as <code className="inline-code">FAQPage</code> JSON-LD
        in the document head).
      </p>
      <div className="faq-list">
        {items.map(({ q, a }) => (
          <details key={q} className="faq-item">
            <summary className="faq-q">{q}</summary>
            <p className="faq-a">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
