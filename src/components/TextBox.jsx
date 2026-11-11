import { useEffect, useRef, useState } from 'react'
import Frame from './Frame.jsx'
import { useInput } from '../input.js'
import { sfx } from '../audio.js'

/**
 * Emerald-style text box with typewriter output.
 *   pages   : array of pages, each an array of (<= 2) lines. See text.js pages().
 *   onDone  : called after the last page is dismissed with A.
 *   active  : when false the box renders but ignores input (menus overlay it).
 *   speed   : ms per character.
 */
export default function TextBox({ pages = [], onDone, active = true, speed = 28, x = 0, y = 112, w = 240, h = 48, pause = 0 }) {
  const [pageIdx, setPageIdx] = useState(0)
  const [count, setCount] = useState(0)
  const page = pages[pageIdx] || []
  const total = page.reduce((n, l) => n + l.length, 0)
  const done = count >= total
  const doneRef = useRef(false)

  // reset when the pages change
  useEffect(() => { setPageIdx(0); setCount(0); doneRef.current = false }, [pages])

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => setCount((c) => c + 1), speed)
    return () => clearTimeout(t)
  }, [count, done, speed, pageIdx])

  // optional auto-advance (used for cinematic moments)
  useEffect(() => {
    if (!pause || !done) return
    const t = setTimeout(advance, pause)
    return () => clearTimeout(t)
  })

  function advance() {
    if (!done) { setCount(total); return }
    if (pageIdx + 1 < pages.length) {
      sfx.blip()
      setPageIdx(pageIdx + 1)
      setCount(0)
    } else if (!doneRef.current) {
      doneRef.current = true
      onDone && onDone()
    }
  }

  useInput((b) => {
    if (!active) return false
    if (b === 'a' || b === 'b') { advance(); return true }
    return true // swallow d-pad while text is showing
  })

  // render the visible slice of the page
  let remaining = count
  const lines = page.map((l) => {
    const s = l.slice(0, Math.max(0, remaining))
    remaining -= l.length
    return s
  })

  return (
    <Frame x={x + 3} y={y + 3} w={w - 6} h={h - 6} className="textbox">
      {lines.map((l, i) => (
        <div key={i} className="t" style={{ left: 8, top: 9 + i * 15 }}>{l}</div>
      ))}
      {active && done && pages.length > 0 && (
        <div className="t blink" style={{ right: 6, bottom: 4, color: '#f86858' }}>▼</div>
      )}
    </Frame>
  )
}
