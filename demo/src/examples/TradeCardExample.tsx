import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function TradeCard({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`trade-card${a ? ' trade-card--ember' : ' trade-card--frost'}`}>
      <div className="trade-card-head">
        <span className="trade-card-name">{a ? 'Ember' : 'Frost'}</span>
        <span className="trade-card-hp">{a ? '80 hp' : '95 hp'}</span>
      </div>
      <div className="trade-card-glyph" aria-hidden="true">
        {a ? (
          <svg width="60" height="60" viewBox="0 0 60 60">
            <path d="M30 5 L42 28 L36 28 L42 50 L18 50 L24 28 L18 28 Z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="60" height="60" viewBox="0 0 60 60">
            <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="30" y1="8" x2="30" y2="52" />
              <line x1="10" y1="30" x2="50" y2="30" />
              <line x1="15" y1="15" x2="45" y2="45" />
              <line x1="45" y1="15" x2="15" y2="45" />
            </g>
          </svg>
        )}
      </div>
      <div className="trade-card-stats">
        <span>type</span>
        <span>{a ? 'fire' : 'ice'}</span>
        <span>spd</span>
        <span>{a ? '12' : '08'}</span>
      </div>
    </div>
  )
}

export function TradeCardExample({ slices = 10 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.16}
      hitMargin={80}
      front={<Stage width={180} height={240}><TradeCard variant="a" /></Stage>}
      back={<Stage width={180} height={240}><TradeCard variant="b" /></Stage>}
    />
  )
}
