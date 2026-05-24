import { useId, useState } from 'react'
import { CodeBlock } from './components/CodeBlock'
import { HeaderLogo } from './components/HeaderLogo'
import { GitHubIcon, LinkedInIcon, XIcon } from './components/icons'
import { PropsTable } from './components/PropsTable'
import { AlbumCoverExample } from './examples/AlbumCoverExample'
import { AvatarExample } from './examples/AvatarExample'
import { ButtonExample } from './examples/ButtonExample'
import { CardExample } from './examples/CardExample'
import { HeroExample } from './examples/HeroExample'
import { ModeToggleExample } from './examples/ModeToggleExample'
import { NumberCardExample } from './examples/NumberCardExample'
import { PerspectiveExample } from './examples/PerspectiveExample'
import { PlaygroundExample } from './examples/PlaygroundExample'
import { PortraitExample } from './examples/PortraitExample'
import { PriceTagExample } from './examples/PriceTagExample'
import { QuoteExample } from './examples/QuoteExample'
import { StatusPillExample } from './examples/StatusPillExample'
import { SubscribeCtaExample } from './examples/SubscribeCtaExample'
import { TickerExample } from './examples/TickerExample'
import { TradeCardExample } from './examples/TradeCardExample'

const installCmd = 'bun add lenticular-fx'

const usageCode = `import { Lenticular } from 'lenticular-fx'

<Lenticular
  slices={12}
  front={<img src="day.jpg" alt="day" />}
  back={<img src="night.jpg" alt="night" />}
/>`

const cardCode = `<Lenticular
  slices={10}
  ease={0.12}
  front={<ProductFront />}
  back={<ProductSpecs />}
/>`

const avatarCode = `<Lenticular
  slices={20}
  ease={0.08}
  front={<DayFace />}
  back={<NightFace />}
/>`

const buttonCode = `<Lenticular
  slices={6}
  ease={0.18}
  front={<button>Get started →</button>}
  back={<button>Free for 14 days →</button>}
/>`

const tiltCode = `<Lenticular
  slices={18}
  ease={0.12}
  tilt={14}
  perspective={900}
  hitMargin={40}
  front={<Skyline variant="a" />}
  back={<Skyline variant="b" />}
/>`

export function App() {
  const [slices, setSlices] = useState(10)
  const slicesId = useId()

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <main id="main-content" className="app">
        <header className="header">
          <nav aria-label="External links" className="top-bar-links">
            <a className="icon-btn" href="https://github.com/subhadeeproy3902" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a className="icon-btn" href="https://x.com/mvp_Subha" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <XIcon />
            </a>
            <a className="icon-btn" href="https://www.linkedin.com/in/subhadeep3902" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </nav>
          <HeaderLogo />
          <h1 className="title">Lenticular fx</h1>
          <p className="subtitle-sm">
            Slide your cursor — the content restripes into something else. Pure
            CSS clip-path, zero deps.
          </p>
        </header>

        <section className="section section--slider" aria-label="Global slices control">
          <div className="slider-row">
            <label className="control-label" htmlFor={slicesId}>Slices</label>
            <div className="strength-track">
              <div className="strength-fill" style={{ width: `${((slices - 2) / 38) * 100}%` }} />
              <span className="strength-value">{slices}</span>
              <input
                id={slicesId}
                type="range"
                className="strength-input"
                value={slices}
                onChange={(e) => setSlices(parseInt(e.target.value, 10))}
                min={2}
                max={40}
                step={1}
                aria-label="Number of slices (applied to every example below)"
              />
            </div>
          </div>
        </section>

        <section className="section" aria-label="Installation">
          <h2 className="section-title">Installation</h2>
          <CodeBlock code={installCmd} lang="bash" label="Copy install command" compact />
        </section>

        <section className="section" aria-label="Usage">
          <h2 className="section-title section-title--muted">Usage</h2>
          <CodeBlock code={usageCode} lang="tsx" label="Copy usage example" />
        </section>

        {/* Spec'd 3 — CLAUDE.md examples, each with its own code snippet ─── */}

        <section className="example-section" aria-label="Card example">
          <h2 className="example-title">Card</h2>
          <p className="example-caption">Product → specs. The "wow" moment.</p>
          <div className="example-row-full">
            <CardExample slices={slices} />
          </div>
          <CodeBlock code={cardCode} lang="tsx" label="Copy card code" />
        </section>

        <section className="example-section" aria-label="Avatar example">
          <h2 className="example-title">Avatar</h2>
          <p className="example-caption">
            Fine grain — <code className="inline-code">slices={'{20}'}</code>. Two gradient faces, no image assets.
          </p>
          <div className="example-row-full example-row-full--mid">
            <AvatarExample slices={Math.max(20, slices)} />
          </div>
          <CodeBlock code={avatarCode} lang="tsx" label="Copy avatar code" />
        </section>

        <section className="example-section" aria-label="CTA Button example">
          <h2 className="example-title">CTA Button</h2>
          <p className="example-caption">Works on small elements too.</p>
          <div className="example-row-full example-row-full--small">
            <ButtonExample slices={Math.min(8, slices)} />
          </div>
          <CodeBlock code={buttonCode} lang="tsx" label="Copy CTA code" />
        </section>

        <section className="example-section" aria-label="3D perspective tilt example">
          <h2 className="example-title">3D perspective tilt</h2>
          <p className="example-caption">
            Pair the slicing with a live <code className="inline-code">rotateY</code> driven by the
            same offset. The card follows your cursor like a real postcard
            being scrubbed — and <code className="inline-code">hitMargin={'{40}'}</code> guarantees the
            night side fully reveals when you reach the right.
          </p>
          <div className="example-row-full example-row-full--tilt">
            <PerspectiveExample slices={Math.max(14, slices)} />
          </div>
          <CodeBlock code={tiltCode} lang="tsx" label="Copy tilt example code" />
        </section>

        {/* Gallery — the rest of the examples ─────────────────────────── */}

        <section className="example-section" aria-label="More examples">
          <h2 className="example-title">Gallery</h2>
          <p className="example-caption">
            The same component, lots of shapes. Hover any of them.
          </p>

          <HeroExample slices={slices} />

          <div className="example-row-3">
            <div className="example-cell">
              <AlbumCoverExample slices={slices} />
            </div>
            <div className="example-cell">
              <TradeCardExample slices={slices} />
            </div>
            <div className="example-cell">
              <NumberCardExample slices={slices} />
            </div>
          </div>

          <div className="example-row-3">
            <div className="example-cell">
              <ModeToggleExample slices={slices} />
            </div>
            <div className="example-cell">
              <PortraitExample slices={Math.max(14, slices)} />
            </div>
            <div className="example-cell">
              <PriceTagExample slices={slices} />
            </div>
          </div>

          <div className="example-row-split example-row-split--alt">
            <div className="example-cell">
              <StatusPillExample slices={Math.min(12, slices)} />
            </div>
            <div className="example-cell example-cell--quote">
              <QuoteExample slices={Math.max(12, slices)} />
            </div>
          </div>

          <div className="example-row-split">
            <div className="example-cell">
              <SubscribeCtaExample slices={Math.min(10, slices)} />
            </div>
            <div className="example-cell">
              <NumberCardExample slices={slices} />
            </div>
          </div>

          <TickerExample slices={Math.max(16, slices)} />
        </section>

        <PropsTable />

        <PlaygroundExample />

        <footer className="footer">
          <span className="footer-muted">Crafted by</span>{' '}
          <a
            className="footer-name"
            href="https://x.com/mvp_Subha"
            target="_blank"
            rel="noopener noreferrer"
          >
            Subhadeep Roy
          </a>
        </footer>
      </main>
    </>
  )
}
