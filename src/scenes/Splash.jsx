import { useEffect } from 'react'
import Text from '../components/Text.jsx'
import { useInput } from '../input.js'
import { sfx } from '../audio.js'

/** Studio splash: ERROR & EXP. Click the logo for the Substack, otherwise it auto-advances. */
export default function Splash({ onDone, substack }) {
  useEffect(() => {
    sfx.sparkle()
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [])
  useInput((b) => { if (b === 'a' || b === 'b') onDone(); return true })

  return (
    <>
      <div
        className="abs"
        style={{ left: 0, top: 36, width: 160, height: 64 }}
        onClick={(e) => { e.stopPropagation(); window.open(substack, '_blank', 'noopener') }}
        title="Error & EXP on Substack"
      >
        <Text x={40} y={0} className="big">ERROR</Text>
        <Text x={76} y={22}>&amp;</Text>
        <Text x={56} y={36} className="big">EXP</Text>
        <Text x={24} y={2} className="blink dim">✦</Text>
        <Text x={128} y={30} className="blink">✦</Text>
        <Text x={36} y={50} className="blink dim">✦</Text>
      </div>
      <Text x={48} y={116} className="dim">presents</Text>
    </>
  )
}
