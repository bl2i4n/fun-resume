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
      <Sprite src={JOB.sprite} x={8} y={4} w={56} h={56} />
      <Sprite src="brian_front" x={60} y={20} w={32} h={40} />
      <Text x={96} y={8} className="big">GOT</Text>
      <Text x={96} y={26} className="big">IT!</Text>
      <Text x={8} y={64}>{JOB.name}</Text>
      <Text x={8} y={74} className="dim">joined {resume.name.split(' ')[0].toUpperCase()}'s team.</Text>
      <ListMenu x={0} y={86} w={160} h={58} rows={3} rowHeight={12} padX={16} padY={10} items={items} onSelect={pick} />
    </>
  )
}
