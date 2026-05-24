import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function SubscribeCta({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`cta-btn${a ? '' : ' cta-btn--done'}`}>
      <span className="cta-btn-icon" aria-hidden="true">
        {a ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <span className="cta-btn-text">{a ? 'Subscribe' : 'Subscribed'}</span>
    </div>
  )
}

export function SubscribeCtaExample({ slices = 12 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.16}
      front={<Stage width={220} height={52}><SubscribeCta variant="a" /></Stage>}
      back={<Stage width={220} height={52}><SubscribeCta variant="b" /></Stage>}
    />
  )
}
