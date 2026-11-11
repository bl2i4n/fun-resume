import { useEffect, useState } from 'react'
import { dispatch } from '../input.js'

const W = 240
const H = 160

/** The 240x160 GBA screen, integer-scaled to fit the viewport. */
export default function Screen({ children }) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const fit = () => {
      const s = Math.floor(Math.min((window.innerWidth - 24) / W, (window.innerHeight - 150) / H))
      setScale(Math.max(1, s))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return (
    <div className="screen-wrap" style={{ width: W * scale, height: H * scale }}>
      <div
        className="screen"
        style={{ transform: `scale(${scale})` }}
        onClick={() => dispatch('a')}
        role="application"
        aria-label="Interactive resume game. Use the plain resume link below for a text version."
      >
        {children}
      </div>
    </div>
  )
}
