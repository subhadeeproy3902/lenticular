import { Lenticular } from 'lenticular-fx'

function CardFront() {
  return (
    <div className="card card--front">
      <span className="card-eyebrow">new release</span>
      <h3 className="card-name">Nimbus 03</h3>
      <span className="card-price">$129</span>
    </div>
  )
}

function CardBack() {
  return (
    <div className="card card--back">
      <span className="card-eyebrow">specs</span>
      <ul className="card-specs">
        <li>40 mm titanium driver</li>
        <li>32 h playback</li>
        <li>Adaptive ANC</li>
        <li>USB-C · Bluetooth 5.4</li>
      </ul>
    </div>
  )
}

export function CardExample({ slices = 10 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.12}
      hitMargin={120}
      front={<CardFront />}
      back={<CardBack />}
    />
  )
}
