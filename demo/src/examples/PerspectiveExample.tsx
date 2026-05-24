import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function Skyline({ variant }: { variant: 'a' | 'b' }) {
  const a = variant === 'a'
  return (
    <div className={`skyline${a ? ' skyline--day' : ' skyline--night'}`}>
      <div className="skyline-sky" aria-hidden="true">
        <div className="skyline-orb" />
        {!a && (
          <>
            <span className="skyline-star skyline-star-1" />
            <span className="skyline-star skyline-star-2" />
            <span className="skyline-star skyline-star-3" />
            <span className="skyline-star skyline-star-4" />
            <span className="skyline-star skyline-star-5" />
          </>
        )}
      </div>
      <svg
        className="skyline-buildings"
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <g fill="currentColor">
          <rect x="0" y="60" width="44" height="60" />
          <rect x="46" y="40" width="32" height="80" />
          <rect x="80" y="70" width="28" height="50" />
          <rect x="110" y="20" width="38" height="100" />
          <rect x="150" y="50" width="30" height="70" />
          <rect x="182" y="34" width="44" height="86" />
          <rect x="228" y="58" width="28" height="62" />
          <rect x="258" y="44" width="34" height="76" />
          <rect x="294" y="22" width="40" height="98" />
          <rect x="336" y="52" width="26" height="68" />
          <rect x="364" y="38" width="36" height="82" />
        </g>
        {!a && (
          <g fill="#ffe16a">
            <rect x="6" y="74" width="3" height="3" />
            <rect x="14" y="80" width="3" height="3" />
            <rect x="30" y="68" width="3" height="3" />
            <rect x="56" y="56" width="3" height="3" />
            <rect x="66" y="68" width="3" height="3" />
            <rect x="120" y="44" width="3" height="3" />
            <rect x="132" y="60" width="3" height="3" />
            <rect x="138" y="80" width="3" height="3" />
            <rect x="190" y="50" width="3" height="3" />
            <rect x="208" y="70" width="3" height="3" />
            <rect x="244" y="74" width="3" height="3" />
            <rect x="268" y="60" width="3" height="3" />
            <rect x="278" y="80" width="3" height="3" />
            <rect x="306" y="42" width="3" height="3" />
            <rect x="316" y="64" width="3" height="3" />
            <rect x="324" y="86" width="3" height="3" />
            <rect x="346" y="68" width="3" height="3" />
            <rect x="374" y="56" width="3" height="3" />
            <rect x="382" y="78" width="3" height="3" />
          </g>
        )}
      </svg>
      <div className="skyline-meta">
        <span className="skyline-eyebrow">{a ? 'postcard · day' : 'postcard · night'}</span>
        <span className="skyline-title">{a ? 'Wish you were here' : 'Lights stay on'}</span>
      </div>
    </div>
  )
}

export function PerspectiveExample({ slices = 18 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.12}
      tilt={14}
      perspective={900}
      hitMargin={40}
      front={<Stage width={420} height={260}><Skyline variant="a" /></Stage>}
      back={<Stage width={420} height={260}><Skyline variant="b" /></Stage>}
    />
  )
}
