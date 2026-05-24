type Row = {
  name: string
  type: string
  default: string
  description: string
}

const rows: Row[] = [
  {
    name: 'front',
    type: 'ReactNode',
    default: '—',
    description:
      'Content shown when the cursor is on the left edge (offset = 0). Required.',
  },
  {
    name: 'back',
    type: 'ReactNode',
    default: '—',
    description:
      'Content shown when the cursor is on the right edge (offset = 1). Required.',
  },
  {
    name: 'slices',
    type: 'number',
    default: '10',
    description:
      'Number of interleaved vertical columns. More slices = finer lenticular grain. Clamped to [2, 40].',
  },
  {
    name: 'ease',
    type: 'number',
    default: '0.12',
    description:
      'Lerp factor applied each animation frame. 1 = instant, 0.01 = molasses. Clamped to (0, 1].',
  },
  {
    name: 'defaultSide',
    type: "'front' | 'back'",
    default: "'front'",
    description:
      'Which face shows at rest, before any interaction and after the cursor leaves.',
  },
  {
    name: 'trackWindow',
    type: 'boolean',
    default: 'false',
    description:
      'Track the cursor across the entire viewport instead of just the wrapper. Cursor X is still normalized to the wrapper.',
  },
  {
    name: 'hitMargin',
    type: 'number',
    default: '24',
    description:
      'Extra hit-area in pixels added on every side of the wrapper. Lets you overshoot the visible edge and still hold the back fully revealed. Bump higher (80–120) to make the surrounding card act as the hit target. Set to 0 to disable.',
  },
  {
    name: 'scroll',
    type: 'boolean',
    default: 'false',
    description:
      "Drive the offset from the element's scroll progress through the viewport instead of the cursor. As the wrapper scrolls from the bottom of the viewport up through the top, the offset travels 0 → 1. Mouse / touch listeners are disabled while on.",
  },
  {
    name: 'tilt',
    type: 'number',
    default: '0',
    description:
      '3D perspective tilt in degrees, driven by the same offset. 0 disables. Typical range 6–20: the card rotates around its vertical axis to follow the cursor while the slicing happens.',
  },
  {
    name: 'perspective',
    type: 'number',
    default: '900',
    description:
      'CSS perspective in pixels used for the tilt. Lower = stronger 3D effect. Only applied when tilt > 0.',
  },
  {
    name: 'onOffsetChange',
    type: '(offset: number) => void',
    default: '—',
    description:
      'Called each animation frame with the current lerped offset (0 → 1). Drive external UI from cursor position. Do not setState — use a ref.',
  },
  {
    name: 'gyroscope',
    type: 'boolean',
    default: 'false',
    description:
      "Use device-orientation gamma (-45° → +45°) instead of mouse on supported devices. Falls back to mouse if DeviceOrientationEvent is missing.",
  },
  {
    name: 'paused',
    type: 'boolean',
    default: 'false',
    description:
      'Freeze the animation loop on the current frame. Cancels the RAF tick until set back to false.',
  },
  {
    name: 'className',
    type: 'string',
    default: '—',
    description: 'Extra class names applied to the wrapper <div>.',
  },
  {
    name: 'style',
    type: 'CSSProperties',
    default: '—',
    description: 'Extra inline styles applied to the wrapper <div>.',
  },
]

export function PropsTable() {
  return (
    <section className="section props-section" aria-label="Component props">
      <h2 className="section-title">Props</h2>
      <p className="example-caption">
        All standard <code className="inline-code">HTMLDivElement</code>{' '}
        attributes are forwarded to the wrapper. <code className="inline-code">ref</code> resolves to the wrapper <code className="inline-code">&lt;div&gt;</code>.
      </p>
      <div className="props-table-wrap">
        <table className="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>
                  <code className="props-cell-name">{row.name}</code>
                </td>
                <td>
                  <code className="props-cell-type">{row.type}</code>
                </td>
                <td>
                  <code className="props-cell-default">{row.default}</code>
                </td>
                <td className="props-cell-desc">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
