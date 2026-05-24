import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function StatusPill({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <span className={`status-pill${a ? '' : ' status-pill--live'}`}>
      <span className={`status-dot status-dot--${a ? 'idle' : 'live'}`} />
      <span className="status-text">{a ? 'Idle' : 'Live now'}</span>
    </span>
  )
}

export function StatusPillExample({ slices = 10 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.18}
      front={<Stage width={170} height={48}><StatusPill variant="a" /></Stage>}
      back={<Stage width={170} height={48}><StatusPill variant="b" /></Stage>}
    />
  )
}
