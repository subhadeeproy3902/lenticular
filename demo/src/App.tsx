import { useId, useState } from "react";
import { CodeBlock } from "./components/CodeBlock";
import { Faq } from "./components/Faq";
import { HeaderLogo } from "./components/HeaderLogo";
import { GitHubIcon, LinkedInIcon, XIcon } from "./components/icons";
import { PropsTable } from "./components/PropsTable";
import { ThemeToggle } from "./components/ThemeToggle";
import { AlbumCoverExample } from "./examples/AlbumCoverExample";
import { AvatarExample } from "./examples/AvatarExample";
import { ButtonExample } from "./examples/ButtonExample";
import { CardExample } from "./examples/CardExample";
import { HeroExample } from "./examples/HeroExample";
import { ModeToggleExample } from "./examples/ModeToggleExample";
import { NumberCardExample } from "./examples/NumberCardExample";
import { PerspectiveExample } from "./examples/PerspectiveExample";
import { PlaygroundExample } from "./examples/PlaygroundExample";
import { PortraitExample } from "./examples/PortraitExample";
import { PriceTagExample } from "./examples/PriceTagExample";
import { QuoteExample } from "./examples/QuoteExample";
import { StatusPillExample } from "./examples/StatusPillExample";
import { SubscribeCtaExample } from "./examples/SubscribeCtaExample";
import { TickerExample } from "./examples/TickerExample";
import { TradeCardExample } from "./examples/TradeCardExample";

const installCmd = "bun add lenticular-fx";

const usageCode = `import { Lenticular } from 'lenticular-fx'

<Lenticular
  slices={12}
  front={<img src="day.jpg" alt="day" />}
  back={<img src="night.jpg" alt="night" />}
/>`;

const cardCode = `<Lenticular
  slices={10}
  ease={0.12}
  front={<ProductFront />}
  back={<ProductSpecs />}
/>`;

const avatarCode = `<Lenticular
  slices={20}
  ease={0.08}
  front={<DayFace />}
  back={<NightFace />}
/>`;

const buttonCode = `<Lenticular
  slices={6}
  ease={0.18}
  front={<button>Get started →</button>}
  back={<button>Free for 14 days →</button>}
/>`;

const tiltCode = `<Lenticular
  slices={18}
  ease={0.12}
  tilt={14}
  perspective={900}
  hitMargin={40}
  front={<Skyline variant="a" />}
  back={<Skyline variant="b" />}
/>`;

export function App() {
  const [slices, setSlices] = useState(10);
  const slicesId = useId();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <main id="main-content" className="app">
        <header className="header">
          <nav aria-label="External links" className="top-bar-links">
            <ThemeToggle />
            <a
              className="icon-btn"
              href="https://github.com/subhadeeproy3902/lenticular"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              className="icon-btn"
              href="https://x.com/mvp_Subha"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
            >
              <XIcon />
            </a>
            <a
              className="icon-btn"
              href="https://www.linkedin.com/in/subhadeep3902"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
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

        <section
          className="section section--slider"
          aria-label="Global slices control"
        >
          <div className="slider-row">
            <label className="control-label" htmlFor={slicesId}>
              Slices
            </label>
            <div className="strength-track">
              <div
                className="strength-fill"
                style={{ width: `${((slices - 2) / 38) * 100}%` }}
              />
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
          <CodeBlock
            code={installCmd}
            lang="bash"
            label="Copy install command"
            compact
          />
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
            Fine grain — <code className="inline-code">slices={"{20}"}</code>.
            Two gradient faces, no image assets.
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

        <section
          className="example-section"
          aria-label="3D perspective tilt example"
        >
          <h2 className="example-title">3D perspective tilt</h2>
          <p className="example-caption">
            Pair the slicing with a live{" "}
            <code className="inline-code">rotateY</code> driven by the same
            offset. The card follows your cursor like a real postcard being
            scrubbed — and{" "}
            <code className="inline-code">hitMargin={"{40}"}</code> guarantees
            the night side fully reveals when you reach the right.
          </p>
          <div className="example-row-full example-row-full--tilt">
            <PerspectiveExample slices={Math.max(14, slices)} />
          </div>
          <CodeBlock
            code={tiltCode}
            lang="tsx"
            label="Copy tilt example code"
          />
        </section>

        <PropsTable />

        <PlaygroundExample />

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
              <StatusPillExample slices={Math.min(12, slices)} />
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
              <ModeToggleExample slices={slices} />
            </div>
            <div className="example-cell example-cell--quote">
              <QuoteExample slices={Math.max(12, slices)} />
            </div>
          </div>

          <TickerExample slices={Math.max(16, slices)} />
        </section>

        <Faq />

        <footer className="footer">
          <span className="footer-muted">Crafted by</span>{" "}
          <a
            className="footer-name"
            href="https://x.com/mvp_Subha"
            target="_blank"
            rel="noopener noreferrer"
          >
            Subhadeep Roy
          </a>
          <span className="footer-muted"> and </span>
          <a
            className="footer-name"
            href="claude"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              preserveAspectRatio="xMidYMid"
              className="size-8"
              viewBox="0 0 256 257"
              width="25"
            >
              <path
                fill="#D97757"
                d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"
              />
            </svg>
          </a>
        </footer>
      </main>
    </>
  );
}
