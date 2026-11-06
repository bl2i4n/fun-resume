import { useEffect, useState } from 'react'
import Text from '../components/Text.jsx'
import Sprite from '../components/Sprite.jsx'
import ListMenu from '../components/ListMenu.jsx'
import { useInput } from '../input.js'
import { sfx, music } from '../audio.js'

/** Title screen: our own logo, Brian, the creature, PRESS START, then NEW GAME / CONTINUE. */
export default function Title({ onNew, onContinue, canContinue }) {
  const [menu, setMenu] = useState(false)
  useEffect(() => { music.play('title') }, [])
  useInput((b) => {
    if (!menu && b === 'a') { sfx.confirm(); setMenu(true) }
    return true
  })

  const items = canContinue
    ? [{ label: 'CONTINUE' }, { label: 'NEW GAME' }]
    : [{ label: 'NEW GAME' }]

  return (
    <>
      <Text x={16} y={10} className="big">JOB HUNT</Text>
      <Text x={28} y={30} className="dim">GREEN VERSION</Text>
      <Sprite src="brian_front" x={24} y={48} w={32} h={40} />
      <Sprite src="linkachu" x={88} y={40} w={56} h={56} />
      <Sprite src="ball" x={64} y={70} w={16} h={16} />
      {!menu && <Text x={36} y={120} className="blink">PRESS START</Text>}
      <Text x={8} y={134} className="dim" style={{ fontSize: 6 }}>© 2025 ERROR &amp; EXP</Text>
      {menu && (
        <ListMenu
          x={32} y={92} w={96} h={44} items={items} rowHeight={14} padY={8}
          onSelect={(i, it) => (it.label === 'CONTINUE' ? onContinue() : onNew())}
          onCancel={() => setMenu(false)}
        />
      )}
    </>
  )
}
