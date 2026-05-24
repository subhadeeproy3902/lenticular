import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function ModeCard({ variant }: { variant: 'a' | 'b' }) {
  const dark = variant === 'a'
  return (
    <div className={`mode-card${dark ? ' mode-card--dark' : ' mode-card--light'}`}>
      <div className="mode-card-bar">
        <span className="mode-card-dot" />
        <span className="mode-card-dot" />
        <span className="mode-card-dot" />
      </div>
      <div className="mode-card-body">
        <div className="mode-card-row">
          <div className="mode-card-avatar" />
          <div className="mode-card-lines">
            <div className="mode-card-line mode-card-line--wide" />
            <div className="mode-card-line mode-card-line--narrow" />
          </div>
        </div>
        <div className="mode-card-row mode-card-row--stack">
          <div className="mode-card-line" />
          <div className="mode-card-line mode-card-line--mid" />
        </div>
      </div>
      <span className="mode-card-tag">{dark ? 'dark' : 'light'}</span>
    </div>
  )
}

export function ModeToggleExample({ slices = 12 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.14}
      hitMargin={80}
      front={<Stage width={260} height={180}><ModeCard variant="a" /></Stage>}
      back={<Stage width={260} height={180}><ModeCard variant="b" /></Stage>}
    />
  )
}
