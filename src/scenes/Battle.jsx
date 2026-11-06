import { useEffect, useMemo, useRef, useState } from 'react'
import Text from '../components/Text.jsx'
import Sprite from '../components/Sprite.jsx'
import TextBox from '../components/TextBox.jsx'
import ListMenu from '../components/ListMenu.jsx'
import { pages } from '../text.js'
import { sfx, music } from '../audio.js'

const ME = 'BRIAN'
const EMPTY = []

/** Resume sections as the FIGHT moves. Each move has sub-moves that reveal content. */
function buildMoves(r) {
  const used = (m) => `${ME} used ${m}!`
  return [
    { label: 'EXPERIENCE', subs: r.experience.map((e) => ({ label: e.company.toUpperCase(), text: e.battleText })) },
    { label: 'SKILLS', subs: r.skills.map((s) => ({ label: s.move, text: [used(s.move), s.text] })) },
    {
      label: 'EDUCATION',
      subs: [
        ...r.education.map((e) => ({ label: e.move, text: [used(e.move), `${e.degree}, ${e.school} (${e.year}).`] })),
        ...r.certifications.map((c) => ({ label: c.move, text: [used(c.move), `${c.name} - ${c.issuer} (${c.year}).`] })),
      ],
    },
    { label: 'PROJECTS', subs: r.projects.map((p) => ({ label: p.move, text: [used(p.move), p.text] })) },
  ]
}

function HpBar({ x, y, w, pct }) {
  return (
    <>
      <div className="abs" style={{ left: x, top: y, width: w, height: 4, border: '1px solid var(--c3)' }} />
      <div className="hp-bar" style={{ left: x + 1, top: y + 1, width: Math.round((w - 2) * pct / 100) }} />
    </>
  )
}

/**
 * The battle is the resume. FIGHT reveals content and lowers DOUBT; the HIRE BALL
 * (in ITEM) catches the job. RUN leads to the plain resume.
 */
export default function Battle({ resume, onCaught, onRun }) {
  const JOB = resume.job
  const MOVES = useMemo(() => buildMoves(resume), [resume])
  const TOTAL = MOVES.reduce((n, m) => n + m.subs.length, 0)
  const items = useMemo(
    () => [{ name: 'HIRE BALL', action: 'ball' }, ...resume.items.filter((it) => !String(it.href).startsWith('TODO'))],
    [resume],
  )

  // enter | text | menu | fight | sub | item | ball
  const [phase, setPhase] = useState('enter')
  const [box, setBox] = useState({ pages: EMPTY, after: null, pause: 0 })
  const [subOf, setSubOf] = useState(0)
  const [fightIdx, setFightIdx] = useState(0)
  const [used, setUsed] = useState({})
  const [doubt, setDoubt] = useState(100)
  const [enemyFx, setEnemyFx] = useState('')      // '' | flash | hidden
  const [playerIn, setPlayerIn] = useState(false)
  const [ball, setBall] = useState(null)          // { x, y, shake }
  const threw = useRef(false)
  const usedRef = useRef({})
  const doubtRef = useRef(100)
  const timers = useRef([])
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.current.push(t); return t }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function say(lines, after = null, pause = 0) {
    setBox({ pages: pages(lines), after, pause })
    setPhase('text')
  }
  function toMenu() { setPhase('menu') }

  // encounter choreography
  useEffect(() => {
    music.play('battle')
    sfx.encounter()
    later(() => setPlayerIn(true), 900)
    later(() => {
      sfx.cry()
      say([`A wild ${JOB.name} appeared!`, `${ME}: I wanna be the very best...`, `Go, ${ME}!`], toMenu)
    }, 1800)
  }, [])

  function useMove(mi, si) {
    const sub = MOVES[mi].subs[si]
    const key = `${mi}-${si}`
    const first = !usedRef.current[key]
    say([sub.text[0]], () => {
      sfx.superEffective()
      setEnemyFx('flash')
      later(() => setEnemyFx(''), 600)
      let next = doubtRef.current
      if (first) {
        usedRef.current = { ...usedRef.current, [key]: true }
        setUsed(usedRef.current)
        const n = Object.keys(usedRef.current).length
        next = Math.max(0, Math.round(100 - (n * 100) / TOTAL))
        doubtRef.current = next
        setDoubt(next)
      }
      const lines = [`It's super effective!`, ...sub.text.slice(1)]
      if (first && next === 0) lines.push(`${JOB.name}'s DOUBT is gone!`, `Throw a HIRE BALL!`)
      say(lines, toMenu)
    }, 700)
  }

  function useItem(it) {
    if (it.action === 'ball') return throwBall()
    if (it.action === 'link') window.open(it.href, '_blank', 'noopener')
    else if (it.action === 'mailto') window.location.href = it.href
    else if (it.action === 'download') {
      const a = document.createElement('a'); a.href = it.href; a.download = ''; a.click()
    }
    say([`${ME} used ${it.name}!`], toMenu)
  }

  function throwBall() {
    setBox({ pages: pages([`${ME} used HIRE BALL!`]), after: null, pause: 0 })
    setPhase('ball')
    sfx.throwBall()
    setBall({ x: 36, y: 64, shake: 0 })
    later(() => setBall({ x: 124, y: 20, shake: 0 }), 30)
    later(() => setEnemyFx('hidden'), 600)
    ;[1, 2, 3].forEach((n) => later(() => { sfx.shake(); setBall({ x: 124, y: 20, shake: n }) }, 900 + n * 600))
    later(() => {
      if (doubtRef.current === 100 && !threw.current) {
        threw.current = true
        sfx.breakFree()
        setBall(null)
        setEnemyFx('')
        say([`Oh no! The ${JOB.name} broke free!`, `Try FIGHT first. Show it what you've got!`], toMenu)
      } else {
        sfx.caught()
        say([`Gotcha! ${JOB.name} was caught!`], onCaught)
      }
    }, 3300)
  }

  function run() {
    say([`Can't escape!`, `...`, `...just kidding. Here's the plain version.`], onRun)
  }

  const subs = MOVES[subOf].subs
  const menuItems = [{ label: 'FIGHT' }, { label: 'ITEM' }, { label: 'PKMN' }, { label: 'RUN' }]

  return (
    <>
      {/* enemy */}
      <Text x={8} y={2}>{JOB.boxName}</Text>
      <Text x={8} y={12} className="dim">{JOB.hpLabel}</Text>
      <HpBar x={50} y={12} w={50} pct={doubt} />
      <Text x={8} y={22}>Lv{JOB.level}</Text>
      <Sprite
        src={JOB.sprite} x={104} y={0} w={56} h={56}
        className={`${phase === 'enter' ? 'slide-in-right' : ''} ${enemyFx === 'flash' ? 'flash' : ''}`}
        style={{ visibility: enemyFx === 'hidden' ? 'hidden' : 'visible' }}
      />

      {/* player */}
      {playerIn && <Sprite src="brian_back" x={8} y={40} w={56} h={56} className={phase === 'enter' ? 'slide-in-left' : ''} />}
      {playerIn && (
        <>
          <Text x={76} y={58}>{ME}</Text>
          <Text x={128} y={58}>Lv{JOB.level}</Text>
          <Text x={76} y={70} className="dim">CONFIDENCE</Text>
          <HpBar x={76} y={80} w={80} pct={100} />
        </>
      )}

      {/* hire ball */}
      {ball && (
        <Sprite
          key={ball.shake} src="ball" x={ball.x} y={ball.y} w={16} h={16}
          className={ball.shake ? 'shake' : ''}
          style={{ transition: 'left .5s steps(10), top .5s steps(10)' }}
        />
      )}

      {/* text box */}
      <TextBox
        pages={phase === 'text' || phase === 'ball' ? box.pages : EMPTY}
        active={phase === 'text'}
        pause={box.pause}
        onDone={() => (box.after ? box.after() : toMenu())}
      />
      {phase === 'menu' && (
        <>
          <Text x={8} y={110}>What will</Text>
          <Text x={8} y={126}>{ME} do?</Text>
          <ListMenu
            x={64} y={96} w={96} h={48} cols={2} rows={2} colWidth={44} rowHeight={16} padX={16} padY={12}
            items={menuItems}
            onSelect={(i, it) => {
              if (it.label === 'FIGHT') setPhase('fight')
              else if (it.label === 'ITEM') setPhase('item')
              else if (it.label === 'PKMN') say([`${ME} has no other party members.`, `${ME} wears all the hats.`], toMenu)
              else run()
            }}
          />
        </>
      )}
      {phase === 'fight' && (
        <ListMenu
          x={0} y={80} w={160} h={64} rows={4} rowHeight={12} padX={16} padY={10}
          items={MOVES.map((m) => ({ label: m.label }))} initial={fightIdx}
          onSelect={(i) => { setFightIdx(i); setSubOf(i); setPhase('sub') }}
          onCancel={toMenu}
        />
      )}
      {phase === 'sub' && (
        <>
          <ListMenu
            x={0} y={80} w={160} h={64} rows={4} rowHeight={12} padX={16} padY={10}
            items={subs.map((s, i) => ({ label: s.label, dim: !!used[`${subOf}-${i}`] }))}
            onSelect={(i) => useMove(subOf, i)}
            onCancel={() => setPhase('fight')}
          />
          <Text x={104} y={70} className="dim">{MOVES[subOf].label.slice(0, 7)}</Text>
        </>
      )}
      {phase === 'item' && (
        <ListMenu
          x={24} y={24} w={136} h={72} rows={4} rowHeight={12} padX={16} padY={10}
          items={items.map((it) => ({ label: it.name }))}
          onSelect={(i) => useItem(items[i])}
          onCancel={toMenu}
        />
      )}
    </>
  )
}
