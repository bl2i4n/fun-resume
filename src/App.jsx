import { useEffect, useRef, useState } from 'react'
import Screen from './components/Screen.jsx'
import Splash from './scenes/Splash.jsx'
import Title from './scenes/Title.jsx'
import Intro from './scenes/Intro.jsx'
import Battle from './scenes/Battle.jsx'
import Caught from './scenes/Caught.jsx'
import Plain from './scenes/Plain.jsx'
import { isEnabled, onChange, toggle } from './audio.js'
import resume from '../content/resume.json'

const seenIntro = () => { try { return !!localStorage.getItem('seenIntro') } catch { return false } }
const markIntro = () => { try { localStorage.setItem('seenIntro', '1') } catch { /* private mode */ } }

/** Scene state machine: splash → title → intro → battle → caught, with the plain resume as the exit. */
export default function App() {
  const [scene, setScene] = useState('splash')
  const [wipe, setWipe] = useState(null)
  const [sound, setSound] = useState(isEnabled())
  const busy = useRef(false)
  useEffect(() => onChange(setSound), [])

  function go(next) {
    if (busy.current) return
    busy.current = true
    setWipe('in')
    setTimeout(() => {
      setScene(next)
      setWipe('out')
      setTimeout(() => { setWipe(null); busy.current = false }, 500)
    }, 500)
  }

  if (scene === 'plain') return <Plain resume={resume} onBack={() => { busy.current = false; setWipe(null); setScene('title') }} />

  return (
    <div className="shell">
      <Screen>
        {scene === 'splash' && <Splash substack={resume.substack} onDone={() => go('title')} />}
        {scene === 'title' && <Title canContinue={seenIntro()} onNew={() => go('intro')} onContinue={() => go('battle')} />}
        {scene === 'intro' && <Intro job={resume.job} onDone={() => { markIntro(); go('battle') }} />}
        {scene === 'battle' && <Battle resume={resume} onCaught={() => go('caught')} onRun={() => go('plain')} />}
        {scene === 'caught' && <Caught resume={resume} onAgain={() => go('title')} onPlain={() => go('plain')} />}
        {wipe && <div className={`wipe ${wipe}`} />}
      </Screen>
      <div className="controls">
        <button onClick={toggle}>SOUND: {sound ? 'ON' : 'OFF'}</button>
        <button onClick={() => go('plain')}>PLAIN RESUME</button>
        <span>A: Enter / Space / tap · B: X / Esc · move: arrows</span>
      </div>
      <p className="credits">
        An interactive resume by {resume.name}. Original pixel art and synthesized sound; not affiliated with Nintendo, Game Freak or The Pokémon Company.
        Professor sprite adapted from a Creative Commons photo on Wikimedia Commons.
      </p>
    </div>
  )
}
