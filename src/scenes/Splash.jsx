import { useEffect } from 'react'
import Text from '../components/Text.jsx'
import { useInput } from '../input.js'
import { sfx } from '../audio.js'

/** Studio splash: ERROR & EXP. Any click or key skips it; otherwise it auto-advances. The Substack link lives in the controls bar. */
export default function Splash({ onDone }) {
  useEffect(() => {
    sfx.sparkle()
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [])
  useInput((b) => { if (b === 'a' || b === 'b') onDone(); return true })

  return (
    <>
      <div className="abs" style={{ left: 0, top: 36, width: 240, height: 64 }}>
        <Text center y={0} className="big">ERROR</Text>
        <Text center y={22}>&amp;</Text>
        <Text center y={36} className="big">EXP</Text>
        <Text x={64} y={2} className="blink dim">✦</Text>
        <Text x={168} y={30} className="blink">✦</Text>
        <Text x={76} y={50} className="blink dim">✦</Text>
      </div>
      <Text center y={116} className="dim">presents</Text>
    </>
  )
}
