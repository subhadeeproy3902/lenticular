import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function HeroPhrase({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className="phrase-block">
      <span className="phrase-eyebrow">{a ? 'move →' : '← scrub'}</span>
      <div className="phrase-display">
        <span className="phrase-serif">{a ? 'the still' : 'in living'}</span>
        <span className={`phrase-strong${a ? '' : ' phrase-strong--alt'}`}>
          {a ? 'FRAME' : 'MOTION'}
        </span>
      </div>
    </div>
  )
}

export function HeroExample({ slices = 14 }: { slices?: number }) {
  return (
    <div className="example-row-full">
      <Lenticular
        slices={slices}
        ease={0.16}
        hitMargin={100}
        front={<Stage width={560} height={210}><HeroPhrase variant="a" /></Stage>}
        back={<Stage width={560} height={210}><HeroPhrase variant="b" /></Stage>}
      />
    </div>
  )
}
