export function HeaderLogo() {
  return (
    <div className="header-logo" aria-hidden="true">
      <svg viewBox="0 0 200 140" width="100" height="46">
        <defs>
          <linearGradient id="strpA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff8a5b" />
            <stop offset="1" stopColor="#ff3d7f" />
          </linearGradient>
          <linearGradient id="strpB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7afcff" />
            <stop offset="1" stopColor="#3d7fff" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={i}
            x={i * 20 + 4}
            y="18"
            width="10"
            height="104"
            rx="5"
            fill={i % 2 === 0 ? 'url(#strpA)' : 'url(#strpB)'}
          />
        ))}
      </svg>
    </div>
  )
}
