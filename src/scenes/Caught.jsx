import Text from '../components/Text.jsx'
import Sprite from '../components/Sprite.jsx'
import ListMenu from '../components/ListMenu.jsx'

/** The catch is the hire button: contact info and links. */
export default function Caught({ resume, onAgain, onPlain }) {
  const JOB = resume.job
  const links = resume.items.filter((it) => !String(it.href).startsWith('TODO'))
  const items = [...links.map((it) => ({ label: it.name })), { label: 'PLAIN RESUME' }, { label: 'PLAY AGAIN' }]

  function pick(i, it) {
    const link = links[i]
    if (it.label === 'PLAY AGAIN') return onAgain()
    if (it.label === 'PLAIN RESUME') return onPlain()
    if (link.action === 'mailto') window.location.href = link.href
    else if (link.action === 'download') { const a = document.createElement('a'); a.href = link.href; a.download = ''; a.click() }
    else window.open(link.href, '_blank', 'noopener')
  }

  return (
    <>
      <div className="bg title" />
      <div className="platform" style={{ left: 8, top: 60, width: 136, height: 22 }} />
      <Sprite src={JOB.sprite} x={14} y={6} w={64} h={64} className="bob" />
      <Sprite src="brian_front" x={84} y={8} w={40} h={64} />
      <Sprite src="chick" x={112} y={26} w={48} h={48} />
      <Text x={164} y={20} className="big light" style={{ textShadow: '2px 2px 0 #305830' }}>GOT</Text>
      <Text x={164} y={40} className="big light" style={{ textShadow: '2px 2px 0 #305830' }}>IT!</Text>
      <Text x={4} y={88} className="light" style={{ fontSize: 7, textShadow: '1px 1px 0 #305830' }}>{JOB.boxName} joined the party!</Text>
      <ListMenu x={0} y={100} w={240} h={60} cols={2} rows={3} colWidth={112} rowHeight={14} padX={18} padY={9} items={items} onSelect={pick} />
    </>
  )
}
