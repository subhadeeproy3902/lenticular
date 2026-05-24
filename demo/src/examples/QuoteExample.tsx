import { Lenticular } from 'lenticular-fx'
import { Stage } from './Stage'

function QuoteBlock({ text, variant }: { text: string; variant: 'a' | 'b' }) {
  return (
    <blockquote className={`quote-block${variant === 'b' ? ' quote-block--alt' : ''}`}>
      <span className="quote-mark">“</span>
      <span className="quote-text">{text}</span>
    </blockquote>
  )
}

export function QuoteExample({ slices = 16 }: { slices?: number }) {
  return (
    <Lenticular
      slices={slices}
      ease={0.15}
      hitMargin={80}
      front={
        <Stage width={300} height={150}>
          <QuoteBlock text="It was completely still." variant="a" />
        </Stage>
      }
      back={
        <Stage width={300} height={150}>
          <QuoteBlock text="Now it breathes." variant="b" />
        </Stage>
      }
    />
  )
}
