import { useState } from 'react'
import Frame from './Frame.jsx'
import { useInput } from '../input.js'
import { sfx } from '../audio.js'

/**
 * Cursor-driven menu in a frame.
 *   items     : [{ label, dim?, value? }]
 *   cols      : 1 for a vertical list, 2 for the FIGHT/PKMN grid
 *   rows      : visible rows (scrolls when there are more items)
 *   onSelect(index, item), onCancel()
 */
export default function ListMenu({
  items, x, y, w, h, cols = 1, rows = 4, colWidth = 48, rowHeight = 16,
  padX = 16, padY = 8, onSelect, onCancel, initial = 0, active = true, frame = true,
}) {
  const [idx, setIdx] = useState(Math.min(initial, items.length - 1))
  const [top, setTop] = useState(0)
  const rowOf = (i) => Math.floor(i / cols)

  function move(next) {
    if (next < 0 || next >= items.length) return
    sfx.cursor()
    setIdx(next)
    const r = rowOf(next)
    if (r < top) setTop(r)
    if (r >= top + rows) setTop(r - rows + 1)
  }

  useInput((b) => {
    if (!active) return false
    if (b === 'up') move(idx - cols)
    else if (b === 'down') move(idx + cols)
    else if (b === 'left' && cols > 1) move(idx - 1)
    else if (b === 'right' && cols > 1) move(idx + 1)
    else if (b === 'a') { sfx.confirm(); onSelect && onSelect(idx, items[idx]) }
    else if (b === 'b') { if (onCancel) { sfx.back(); onCancel() } }
    return true
  })

  const visible = items
    .map((it, i) => ({ it, i }))
    .filter(({ i }) => rowOf(i) >= top && rowOf(i) < top + rows)
  const more = rowOf(items.length - 1) >= top + rows
  const Wrap = frame ? Frame : 'div'
  const wrapProps = frame ? { x, y, w, h } : { className: 'abs', style: { left: x, top: y, width: w, height: h } }

  return (
    <Wrap {...wrapProps}>
      {visible.map(({ it, i }) => {
        const r = rowOf(i) - top
        const c = i % cols
        return (
          <div
            key={i}
            className={`t ${i === idx ? 'cursor' : ''} ${it.dim ? 'dim' : ''}`}
            style={{ left: padX + c * colWidth, top: padY + r * rowHeight, paddingLeft: 0 }}
            onClick={(e) => {
              e.stopPropagation()
              if (!active) return
              if (i === idx) { sfx.confirm(); onSelect && onSelect(i, it) }
              else move(i)
            }}
          >
            {it.label}
          </div>
        )
      })}
      {more && <div className="t blink" style={{ right: 6, bottom: 2 }}>▼</div>}
    </Wrap>
  )
}
