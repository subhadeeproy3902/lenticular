import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import { App } from './App'
import './styles.css'

// Smooth, momentum-based scrolling. Lenis hijacks the native wheel/touch
// scroll and lerps the page transform every frame. The page still scrolls
// at the same total distance; just smoother. Native scrollbar is hidden
// via CSS so this is the only visible scroll indicator.
const lenis = new Lenis({
  duration: 1.1,
  smoothWheel: true,
  // wheelMultiplier 1.0 is conservative; bump if you want it snappier.
  wheelMultiplier: 1,
  touchMultiplier: 1.2,
  // Don't smooth touch scrolling on iOS — feels worse than native.
  syncTouch: false,
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
