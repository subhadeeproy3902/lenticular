import { Lenticular } from 'lenticular-fx'

function ButtonFront() {
  return <span className="cta">Get started →</span>
}

function ButtonBack() {
  return <span className="cta cta--alt">Free for 14 days →</span>
}

export function ButtonExample({ slices = 6 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.18}
      hitMargin={120}
      front={<ButtonFront />}
      back={<ButtonBack />}
    />
  )
}
