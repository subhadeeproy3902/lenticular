import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function Portrait({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`portrait${a ? ' portrait--a' : ' portrait--b'}`}>
      <div className="portrait-art" aria-hidden="true">
        <div className="portrait-glow portrait-glow-1" />
        <div className="portrait-glow portrait-glow-2" />
        <div className="portrait-glow portrait-glow-3" />
        <svg className="portrait-silhouette" viewBox="0 0 100 120" aria-hidden="true">
          <circle cx="50" cy="42" r="20" fill="currentColor" opacity="0.95" />
          <path
            d="M16 120 Q16 78 50 78 Q84 78 84 120 Z"
            fill="currentColor"
            opacity="0.95"
          />
        </svg>
      </div>
      <div className="portrait-meta">
        <span className="portrait-name">{a ? 'Iris' : 'Ren'}</span>
        <span className="portrait-role">{a ? 'product designer' : 'staff engineer'}</span>
      </div>
    </div>
  )
}

export function PortraitExample({ slices = 18 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.1}
      triggerParent
      front={<Stage width={200} height={260}><Portrait variant="a" /></Stage>}
      back={<Stage width={200} height={260}><Portrait variant="b" /></Stage>}
    />
  )
}
