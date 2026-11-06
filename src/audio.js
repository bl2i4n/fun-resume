/*
 * Tiny Web Audio synth for Game Boy style sound effects.
 * Everything is generated — no copyrighted audio. Music tracks are optional
 * files in /public/audio; if they are missing, the game is just quieter.
 */
let ctx = null
let enabled = false
let masterGain = null
const listeners = new Set()

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.12
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function isEnabled() { return enabled }
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn) }
export function setEnabled(v) {
  enabled = v
  if (v) ensure()
  else music.stop()
  listeners.forEach((fn) => fn(v))
}
export function toggle() { setEnabled(!enabled) }

/** Play a square/triangle note. freq in Hz, dur in seconds. */
function tone({ freq = 440, dur = 0.08, type = 'square', at = 0, slide = 0, vol = 1 }) {
  if (!enabled) return
  const c = ensure()
  if (!c) return
  const t0 = c.currentTime + at
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + dur)
  g.gain.setValueAtTime(vol, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(g)
  g.connect(masterGain)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noise({ dur = 0.2, at = 0, vol = 0.6 }) {
  if (!enabled) return
  const c = ensure()
  if (!c) return
  const t0 = c.currentTime + at
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const g = c.createGain()
  g.gain.setValueAtTime(vol, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  src.connect(g)
  g.connect(masterGain)
  src.start(t0)
}

export const sfx = {
  blip: () => tone({ freq: 1200, dur: 0.03, vol: 0.5 }),            // text advance
  cursor: () => tone({ freq: 900, dur: 0.05 }),                     // menu move
  confirm: () => { tone({ freq: 700, dur: 0.06 }); tone({ freq: 1050, dur: 0.08, at: 0.06 }) },
  back: () => tone({ freq: 500, dur: 0.06, slide: -200 }),
  sparkle: () => {                                                  // studio splash
    ;[880, 1175, 1480, 1760, 2093].forEach((f, i) => tone({ freq: f, dur: 0.12, at: i * 0.07, type: 'triangle' }))
  },
  encounter: () => {                                                // battle start sting
    ;[0, 1, 2, 3, 4, 5].forEach((i) => tone({ freq: 220 + i * 90, dur: 0.06, at: i * 0.05 }))
    tone({ freq: 880, dur: 0.25, at: 0.32, type: 'triangle' })
  },
  hit: () => { noise({ dur: 0.18 }); tone({ freq: 200, dur: 0.18, slide: -150 }) },
  superEffective: () => { noise({ dur: 0.3, vol: 0.8 }); tone({ freq: 160, dur: 0.3, slide: -120 }) },
  throwBall: () => tone({ freq: 500, dur: 0.25, slide: 500, type: 'triangle' }),
  shake: () => tone({ freq: 300, dur: 0.1, slide: -120 }),
  breakFree: () => { noise({ dur: 0.25 }); tone({ freq: 400, dur: 0.3, slide: 300 }) },
  caught: () => {                                                  // little victory jingle
    ;[523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.14, at: i * 0.12 }))
    tone({ freq: 1047, dur: 0.5, at: 0.5, type: 'triangle' })
  },
  faint: () => tone({ freq: 600, dur: 0.5, slide: -550 }),
  cry: () => { tone({ freq: 1500, dur: 0.08, slide: 400, type: 'triangle' }); tone({ freq: 1900, dur: 0.1, at: 0.1, type: 'triangle' }) }, // notification ping
}

/* ---- optional music files: public/audio/<name>.mp3 ---- */
let current = null
let currentName = null
export const music = {
  play(name) {
    if (!enabled || currentName === name) return
    music.stop()
    const el = new Audio(`/audio/${name}.mp3`)
    el.loop = true
    el.volume = 0.35
    el.play().catch(() => { /* no track yet: stay quiet */ })
    current = el
    currentName = name
  },
  stop() {
    if (current) { current.pause(); current = null; currentName = null }
  },
}
