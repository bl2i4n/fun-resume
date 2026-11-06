import { useEffect, useRef } from 'react'

/*
 * Game Boy buttons mapped to the keyboard.
 *   A      : Enter, Space, Z
 *   B      : X, Backspace, Escape
 *   D-pad  : arrows, WASD
 * Tapping/clicking the screen is A.
 */
const KEYMAP = {
  Enter: 'a', ' ': 'a', z: 'a', Z: 'a',
  x: 'b', X: 'b', Backspace: 'b', Escape: 'b',
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
  W: 'up', S: 'down', A: 'left', D: 'right',
}

const handlers = []

export function dispatch(button) {
  const h = handlers[handlers.length - 1]
  if (h && h.current) h.current(button)
}

let bound = false
function bind() {
  if (bound) return
  bound = true
  window.addEventListener('keydown', (e) => {
    const b = KEYMAP[e.key]
    if (!b) return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
    e.preventDefault()
    dispatch(b)
  })
}

/**
 * Register the active input handler for a screen. The most recently mounted
 * handler wins, so an overlay (menu, name entry) can take over input.
 */
export function useInput(handler) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    bind()
    handlers.push(ref)
    return () => {
      const i = handlers.indexOf(ref)
      if (i >= 0) handlers.splice(i, 1)
    }
  }, [])
}
