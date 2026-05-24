export function HeaderLogo() {
  return (
    <div className="header-logo" aria-hidden="true">
      <svg viewBox="0 0 200 140" width="100" height="46">
        <defs>
          <linearGradient id="strpA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c9c6c7" />
          </linearGradient>
          <linearGradient id="strpB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#484848" />
            <stop offset="1" stopColor="#212121" />
          </linearGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => (
          <rect
            key={i}
            x={i * 20 + 4}
            y="18"
            width="5"
            height="104"
            rx="0"
            fill={i % 2 === 0 ? 'url(#strpA)' : 'url(#strpB)'}
          />
        ))}
      </svg>
    </div>
  )
}
