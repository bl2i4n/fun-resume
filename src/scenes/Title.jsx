import { useEffect, useState } from 'react'
import Text from '../components/Text.jsx'
import Sprite from '../components/Sprite.jsx'
import ListMenu from '../components/ListMenu.jsx'
import { useInput } from '../input.js'
import { sfx, music } from '../audio.js'

const STARS = [[12, 40], [30, 120], [64, 52], [200, 44], [222, 96], [180, 130], [10, 92], [118, 44]]

/** Title screen: BRIAN'S RESUME, the partner creatures on a grass patch, PRESS START. */
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
      <div className="bg title" />
      {STARS.map(([x, y], i) => (
        <span key={i} className={`star ${i % 2 ? 'blink' : ''}`} style={{ left: x, top: y }}>★</span>
      ))}
      <Text x={8} y={10} className="big light" style={{ textShadow: '2px 2px 0 #305830' }}>BRIAN'S RESUME</Text>
      <Text x={52} y={30} style={{ color: '#305830', textShadow: '1px 1px 0 #e0f0d0' }}>(in Pokémon form)</Text>

      <div className="platform" style={{ left: 40, top: 98, width: 160, height: 32 }} />
      <Sprite src="sprout" x={66} y={82} w={32} h={32} className="bob" />
      <Sprite src="chick" x={104} y={66} w={48} h={48} />
      <Sprite src="brian_front" x={150} y={52} w={40} h={64} />

      {!menu && <Text x={76} y={136} className="blink" style={{ color: '#305830', textShadow: '1px 1px 0 #e0f0d0' }}>PRESS START</Text>}
      <Text x={4} y={151} style={{ fontSize: 5, lineHeight: '5px', color: '#487048', textShadow: 'none' }}>© 2026 ERROR &amp; EXP · FAN PROJECT</Text>
      {menu && (
        <ListMenu
          x={72} y={104} w={96} h={44} items={items} rowHeight={14} padX={20} padY={10}
          onSelect={(i, it) => (it.label === 'CONTINUE' ? onContinue() : onNew())}
          onCancel={() => setMenu(false)}
        />
      )}
    </>
  )
}
