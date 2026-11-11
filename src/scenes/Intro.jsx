import { useMemo, useState } from 'react'
import Text from '../components/Text.jsx'
import Sprite from '../components/Sprite.jsx'
import TextBox from '../components/TextBox.jsx'
import ListMenu from '../components/ListMenu.jsx'
import { pages } from '../text.js'
import { sfx } from '../audio.js'

const PROF = 'PROF.\u00a0D' // non-breaking space keeps the name on one line
const ME = 'BRIAN'

const BEAT1 = [
  `Hello there! Welcome to the world of SILICON VALLEY!`,
  `My name is ${PROF}! People call me the JOB PROF!`,
]
const BEAT2 = [
  `This world is inhabited by creatures called JOBS!`,
  `For some people, JOBS are a paycheck. Others use them to grow.`,
  `Myself... I study JOBS as a profession.`,
  `But not every JOB is the right one. We need you to catch the RIGHT one.`,
]
const BEAT3 = [`First, what is your name?`]
const BEAT4 = [
  `${ME}! Your very own engineering legend is about to unfold!`,
  `A world of dreams and job offers awaits! Let's go!`,
]

/** The Professor's intro. A SKIP button is always in the corner. */
export default function Intro({ onDone, job }) {
  const [step, setStep] = useState(0) // 0 prof talks, 1 creature, 2 name, 3 name menu, 4 send-off
  const [nameJoke, setNameJoke] = useState(null)

  const p1 = useMemo(() => pages(BEAT1), [])
  const p2 = useMemo(() => pages(BEAT2), [])
  const p3 = useMemo(() => pages(BEAT3), [])
  const pJoke = useMemo(() => pages([`...`, `That's a great name! ${ME} it is!`]), [])
  const p4 = useMemo(() => pages(BEAT4), [])

  const showCreature = step === 1
  const names = [{ label: ME }, { label: ME }, { label: ME }, { label: 'NEW NAME' }]

  function pickName(i, it) {
    if (it.label === 'NEW NAME') { setNameJoke(true); setStep(4) }
    else setStep(5)
  }

  return (
    <>
      <div className="bg lab" />
      <div className="platform" style={{ left: 80, top: 96, width: 80, height: 14 }} />
      {showCreature
        ? <Sprite src="chick" x={96} y={56} w={48} h={48} className="slide-in-right" />
        : <Sprite src="prof" x={96} y={26} w={48} h={80} />}

      {step === 0 && <TextBox pages={p1} onDone={() => { sfx.cry(); setStep(1) }} />}
      {step === 1 && <TextBox pages={p2} onDone={() => setStep(2)} />}
      {step === 2 && <TextBox pages={p3} onDone={() => setStep(3)} />}
      {step === 3 && (
        <>
          <TextBox pages={p3} active={false} />
          <ListMenu x={140} y={20} w={96} h={72} items={names} rowHeight={14} padX={20} padY={10} onSelect={pickName} />
        </>
      )}
      {step === 4 && <TextBox pages={pJoke} onDone={() => setStep(5)} />}
      {step === 5 && <TextBox pages={p4} onDone={onDone} />}

      <div
        className="t blink"
        style={{ right: 4, top: 4, cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); sfx.back(); onDone() }}
        role="button"
        aria-label="Skip intro"
      >
        SKIP▶
      </div>
    </>
  )
}
