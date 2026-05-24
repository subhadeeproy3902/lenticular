import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function Ticker({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  const word = a ? 'STILL FRAME' : 'IN MOTION'
  return (
    <div className={`ticker${a ? '' : ' ticker--alt'}`}>
      <div className="ticker-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-word">{word}</span>
            <span className="ticker-dot" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function TickerExample({ slices = 20 }: { slices?: number }) {
  return (
    <div className="example-row-ticker">
      <Lenticular
        slices={slices}
        ease={0.18}
        scroll
        front={<Stage width={780} height={56}><Ticker variant="a" /></Stage>}
        back={<Stage width={780} height={56}><Ticker variant="b" /></Stage>}
      />
    </div>
  )
}
