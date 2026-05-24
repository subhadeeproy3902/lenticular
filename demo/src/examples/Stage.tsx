import type { ReactNode } from 'react'

export function Stage({
  children,
  width,
  height,
}: {
  children: ReactNode
  width: number
  height: number
}) {
  return (
    <div className="stage" style={{ width, height }}>
      {children}
    </div>
  )
}
