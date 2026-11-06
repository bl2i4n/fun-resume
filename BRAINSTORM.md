# Interactive Resume — Brainstorm

Goal: a nostalgic, video-game-style interactive resume that's software-engineering focused and keeps people reading ("wow, keep going").

Reference: http://www.rleonardi.com/interactive-resume/ (scroll-driven side-scroller; see "Why the reference works" below)

## Status / next steps
- [x] Pick a concept — **Pokémon Red/Blue parody** (decided 2026-11-05). Stack Quest and the top-down overworld are shelved.
- [x] Resume content captured in `content/resume.json` (from BrianDeLaCruzResume2025.png). Phone number deliberately left off the web version.
- [x] Studio name: **Error & EXP** (Brian's Substack). Splash links to https://errorandexp.substack.com
- [x] Professor: pixel caricature inspired by Dario Amodei. See "Professor" below for the caveats.
- [x] Art plan: photo→4-shade pixel script for faces, hand-authored pixel grids for creature/UI, swap for Aseprite/licensed sprites later if wanted.
- [x] Professor is `PROF. D` with the Dario likeness (confirmed 2026-11-05). `public/sprites/prof.png` is variant d3 from `tools/prof_variants/`; no lab coat yet. Footer credit still needs the photo's author/license line.
- [ ] Brian provides: GitHub + LinkedIn URLs, the resume PDF, 1–3 PROJECTS (the resume has no projects section)
- [x] The wild Job is a **SOFTWARE ENGINEER** (decided 2026-11-05). HP box shows `SOFTWARE ENG` (Gen 1 boxes fit ~12 chars); text boxes use the full title. LINKACHU is the creature's design/sprite name only. Level TBD (`Lv.5`?)
- [ ] Find/commission original chiptune tracks (title, battle, caught). Can't use the real Pokémon music.
- [x] `git init` done 2026-11-05. Still to pick: hosting (Vercel/Netlify), domain optional
- [x] MVP built 2026-11-05 (`npm run dev`): splash → title → intro (SKIP, NEW GAME/CONTINUE) → battle (FIGHT sub-lists, ITEM, PKMN gag, RUN → plain resume, HIRE BALL with broke-free joke) → caught screen. Name-entry letter grid, rival beat and bug gag not built yet.

## Current direction: Pokémon Red/Blue parody

**Framing:** the visitor plays as **Brian**, looking for a job in **Silicon Valley Town**. The resume *is* the battle screen. No worlds, no scrolling, no overworld — the whole thing is short on purpose.

### 1. Splash
- **Error & EXP** studio logo (Brian's Substack) with the Game Freak-style sparkle and sound. Clicking it opens https://errorandexp.substack.com in a new tab; otherwise it auto-advances after ~2 s.
- Straight to the title screen. No opening cinematic.

### 2. Title screen
- Game Boy 4-shade green palette. Our own logo in the Gen 1 style (not the Pokémon logo — taste and trademark).
- Brian sprite, a cycling set of "creatures" (tech logos / bugs) below, blinking **PRESS START**.
- No Pokémon logo or branding anywhere.

### 3. Intro (skippable)
A pixel-font **SKIP ▶** sits in the bottom corner the whole time. Skip → straight to the battle wipe + music. Returning visitors skip by default.

Beats (keep the whole thing under ~45 s):
1. Professor in the white void, typewriter text box, blinking ▼ to advance. "Hello there! Welcome to the world of SILICON VALLEY! My name is PROF. D! People call me the JOB PROF!"
2. "This world is inhabited by creatures called JOBS!" A Job creature (see "The Job creature") slides into the box. "For some people, JOBS are a paycheck. Others use them to grow. Myself... I study JOBS as a profession."
3. "But not every JOB is the right one. We need you to catch the RIGHT one."
4. "First, what is your name?" Preset list: `BRIAN / BRIAN / BRIAN / NEW NAME`. Picking NEW NAME opens the letter grid — whatever you type spells BRIAN.
5. (Optional, cut if it drags) Rival beat: "This is my grandson. He's been your rival since you were a baby. ...Erm, what was his name again?" Rival name ideas: `LAYOFFS`, `IMPOSTER`, the visitor's company name.
6. "BRIAN! Your very own engineering legend is about to unfold! A world of dreams and job offers awaits! Let's go!" Sprite shrinks, fade to black.

Cut: the bug-squash gag (the creature is a Job now, and squashing a job sends the wrong message). Could come back as a mid-battle interrupt: "A wild BUG appeared!" → giant hand → "BRIAN used DEBUG!"

#### Professor
- Pixel caricature inspired by **Dario Amodei** (dark curly hair, lab coat added). Built by pixelating a CC-licensed photo from Wikimedia Commons to Gen 1 size and quantizing to the 4-shade palette, then hand-cleaning. Credit the photo in the footer.
- Caveats, Brian's call: (1) a recruiter could read a real CEO on the page as an affiliation claim, especially with the Anthropic Academy cert on the resume — keep the name a wink (`PROF. D`), never "Anthropic"; (2) keep it a caricature, not a photo.

### 4. The battle (this is the resume)
Screen wipe + encounter music. Encounter choreography, Gen 1 style:
1. Job creature slides in from the **top right** with its name/level/HP box.
2. Brian's back sprite slides in from the **bottom left** with his own box (HP labeled `CONFIDENCE`, always full).
3. Text box: **"A wild SOFTWARE ENGINEER appeared!"** … then a one-line nod: "BRIAN: I wanna be the very best..." (keep it to that one line; the lyric is copyrighted, don't play the song). Then "Go, BRIAN!" and the menu appears.

Enemy HP bar is labeled **DOUBT** and starts full.

#### The Job creature ("a Pikachu combined with LinkedIn")
In-game name: **SOFTWARE ENGINEER** (`SOFTWARE ENG` in the HP box). Sprite/design name: **LINKACHU**. Type: `NORMAL / REMOTE`. Level = seniority (`Lv.5` = Senior).
- Pikachu-ish silhouette: round body, pointed ears with dark tips, stubby arms.
- Cheeks are the LinkedIn **"in"** circles instead of red circles.
- Tail is a lightning bolt bent into a **briefcase handle**, or it carries a tiny briefcase.
- Wears a tie. Ears are slightly folded like an open laptop lid.
- Cry: a short "ping" like a notification.
Alternates for later/variety: `REQUISAUR` (Bulbasaur with a job req on its back), `OFFERMANDER` (tail flame is an offer letter), `GHOSTED` (a Gastly that stops responding).

Gen 1 battle menu, mapped to resume sections:

| Gen 1 | Resume |
|---|---|
| **FIGHT** | Four moves: `EXPERIENCE`, `SKILLS`, `EDUCATION`, `PROJECTS`. Each opens a sub-list (like a move list with PP): `ONETRUST / NETFLIX / PLAID` under EXPERIENCE; `DEBUG / GIT CLI / PIPELINE / TICKETS / MENTOR` under SKILLS; `OHLONE / BLOC.IO / OPENAI API / AI FLUENCY` under EDUCATION (certs live here); PROJECTS needs content — at minimum `THIS SITE`. |
| Using a move | Hit animation + "It's super effective!" + text box with the bullets/metrics. DOUBT drops. Used moves lose PP so visitors can see what they've already read. |
| **ITEM** (bag) | `RESUME.PDF` (download), `SUBSTACK`, `GITHUB`, `LINKEDIN`, `EMAIL` |
| **PKMN** (party) | The different hats Brian wears (backend, infra, leadership…). Maybe v2. |
| **RUN** | "Can't escape!" … beat … "...just kidding." → clean one-page plain-HTML resume (the recruiter escape hatch). |
| **Poké Ball** | **HIRE BALL.** Throw it: shakes three times. "Gotcha! JOB was caught!" → caught screen with contact info / email CTA. |

Rules:
- Ball is available any time. First throw at full DOUBT: "The JOB broke free!" After that it always works. One joke, no grind.
- Every move reveals content; nothing is hidden behind randomness. Visitors never *lose*.
- Goal is **capture**, not defeat. The catch is the hire button.

Variant considered and dropped: visitor plays as the recruiter battling "Professor Brian." Too adversarial, and the resume content ends up on the passive/defending side.

### Extras (only if cheap)
- Trainer Card = summary / contact screen.
- Pokédex of skills with SEEN / CAUGHT counts.
- Gym badges = jobs.
- Dev-console easter egg (`~`): `help`, `ls projects`, `cat resume.txt`, `sudo hire brian`.
- Konami code → director's commentary on how the site was built.
- Achievement toast after the catch: 🏆 "Actually Read a Resume."

## Why the reference works (still true)
- **Visitors already know the controls.** Scrolling there; A-button / click here.
- **Something new appears every few seconds.** Every move = new content.
- **The content lives inside the world.** It's still a full resume, staged as a game.
- **It's short.** One battle with a clear end, so people finish it.

## Tech approach
| Layer | Pick | Why |
|---|---|---|
| Framework | Vite + React (or Astro) | Fast, simple deploy (Vercel/Netlify) |
| Screens | Plain DOM + CSS, state machine (splash → title → intro → battle → caught) | It's menus and text boxes; no scroll engine needed |
| Sprites/animation | CSS sprite sheets, `image-rendering: pixelated`; PixiJS only if a battle animation needs it | Keep text real DOM for accessibility/SEO |
| Font | Pixel font (e.g. Press Start 2P or a Gen 1-style bitmap font) | |
| Content | `resume.json` → moves, items, text boxes | Update resume without touching game code |
| Art | v1: faces via photo→pixel script, everything else hand-authored pixel grids rendered to canvas. Later: Aseprite / licensed packs drop in | No image generator available; programmer art first, judge it, then upgrade |
| Audio | Howler.js + **original/royalty-free** chiptune | Muted by default; music toggle in the pixel UI |

## Things to get right
- **Mobile:** the Game Boy screen is 160×144 — this design is *better* on phones than the scroller. Tap = A button.
- **Accessibility:** honor `prefers-reduced-motion`, real text in the DOM, RUN always leads to the plain resume.
- **Load time:** splash should not be a loading screen in disguise. Preload the battle assets during the intro.
- **IP:** no Pokémon/Game Freak logos, sprites, or music. Parody the structure and UI, draw everything ourselves. One lyric line as a text-box gag is fine; no audio of it.
- **Privacy:** phone number stays off the site. Email + links only.
- **Content fit:** Gen 1 text box is ~18 chars × 2 lines. Resume bullets are rewritten as short `battleText` lines in `content/resume.json`; the full bullets live in the plain resume (RUN).

## Build order
1. **MVP:** splash → title → battle with FIGHT (4 moves + sub-lists), ITEM, RUN, HIRE BALL, caught screen. Placeholder shapes OK.
2. Intro sequence + SKIP, name-entry joke, bug squash.
3. Audio, animations, PP, "broke free" joke.
4. Polish: PKMN party, Trainer Card, dev console, Konami code, mobile tuning.

## Shelved concepts
- **Stack Quest** 16-bit side-scroller (worlds per job, bugs as enemies, boss fights = incidents, scroll-driven via GSAP).
- **Zelda-style top-down overworld** (companies = buildings, NPC testimonials). Risk: visitors steer and miss content.
- **Game Boy cartridge select** (`EXPERIENCE.gb`, `PROJECTS.gb`).
