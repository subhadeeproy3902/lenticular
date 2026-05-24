import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function NumberCard({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`num-card${a ? '' : ' num-card--alt'}`}>
      <span className="num-card-label">vol.</span>
      <span className="num-card-digit">{a ? '01' : '02'}</span>
      <span className="num-card-sub">{a ? 'static' : 'kinetic'}</span>
    </div>
  )
}

export function NumberCardExample({ slices = 12 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.14}
      front={<Stage width={180} height={200}><NumberCard variant="a" /></Stage>}
      back={<Stage width={180} height={200}><NumberCard variant="b" /></Stage>}
    />
  )
}
