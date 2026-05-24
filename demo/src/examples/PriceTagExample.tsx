import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function PriceTag({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`price-tag${a ? '' : ' price-tag--pro'}`}>
      <span className="price-tag-eyebrow">{a ? 'starter' : 'pro'}</span>
      <span className="price-tag-amount">
        <span className="price-tag-currency">$</span>
        {a ? '0' : '29'}
      </span>
      <span className="price-tag-sub">{a ? 'forever free' : 'per month'}</span>
    </div>
  )
}

export function PriceTagExample({ slices = 10 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.14}
      triggerParent
      front={<Stage width={200} height={150}><PriceTag variant="a" /></Stage>}
      back={<Stage width={200} height={150}><PriceTag variant="b" /></Stage>}
    />
  )
}
