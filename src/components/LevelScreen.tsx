import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LEVELS, levelById } from '../data/levels'
import { worldById } from '../data/worlds'
import type { WordInfo } from '../data/types'
import { evaluateGuess, type TileState } from '../engine/evaluate'
import { makeWheel } from '../engine/letters'
import { validateSecretWord } from '../engine/secrets'
import { pickVariant } from '../engine/sentences'
import { sfx } from '../lib/sfx'
import { actions, getState, levelProgress, useProgress } from '../state/store'
import { ReviewCard } from './ReviewCard'
import { SentenceBuilder } from './SentenceBuilder'
import { CoinBadge, Confetti, SoundToggle } from './ui'
import { Wheel } from './Wheel'
import { WordSheet } from './WordSheet'

type Stage = 'word' | 'learn' | 'sentence' | 'review' | 'done' | 'explore'
interface Row {
  letters: string
  states: TileState[]
}
interface SheetState {
  word: WordInfo
  kind: 'main' | 'secret' | 'known'
  reward?: number
  cta: string
  after?: () => void
}

const REWARD_MAIN = 5
const REWARD_SENTENCE = 3
const COST = { letter: 3, meaning: 1, clue: 2 }

interface Props {
  levelId: string
  nextLevelId?: string
  onExit(): void
  onNext(id: string): void
}

export function LevelScreen({ levelId, nextLevelId, onExit, onNext }: Props) {
  const level = levelById(levelId)
  const world = worldById(level.worldId)
  const progress = useProgress()
  const lp = levelProgress(progress, levelId)
  const main = level.main.text
  const pool = main + level.decoys

  const [stage, setStage] = useState<Stage>(lp.completed ? 'explore' : 'word')
  const [wheel, setWheel] = useState(() => makeWheel(main, level.decoys))
  const [sel, setSel] = useState<number[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [hinted, setHinted] = useState<Record<number, string>>({})
  const [meaningShown, setMeaningShown] = useState(false)
  const [clue, setClue] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [shake, setShake] = useState(0)
  const [busy, setBusy] = useState(false)
  const [sheet, setSheet] = useState<SheetState | null>(null)
  const [floaters, setFloaters] = useState<{ id: number; text: string }[]>([])
  const [sentenceRound, setSentenceRound] = useState(0)
  const [reviewLevel, setReviewLevel] = useState<typeof level | null>(null)
  const [earned, setEarned] = useState(0)
  const playIndex = useRef<number | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  const [practice, setPractice] = useState(false)

  // Count this visit once (rotates sentence variants on replays).
  useEffect(() => {
    if (playIndex.current === null) {
      playIndex.current = levelProgress(getState(), levelId).plays
      actions.startPlay(levelId)
    }
  }, [levelId])

  const typed = sel.map((i) => wheel[i]).join('').toLowerCase()

  // letters that are known NOT to be in the main word (from feedback) get dimmed on the wheel
  const dimmed = useMemo(() => {
    const s = new Set<string>()
    rows.forEach((r) => r.states.forEach((st, i) => st === 'absent' && !main.includes(r.letters[i]) && s.add(r.letters[i])))
    return s
  }, [rows, main])

  // pattern line: greens we know about + hinted letters
  const pattern = useMemo(() => {
    const known: string[] = Array(main.length).fill('')
    rows.forEach((r) => r.states.forEach((st, i) => st === 'correct' && (known[i] = r.letters[i])))
    Object.entries(hinted).forEach(([i, ch]) => (known[+i] = ch))
    return lp.completed ? main.split('') : known
  }, [rows, hinted, main, stage, lp.completed])

  const flash = useCallback((msg: string, bad = false) => {
    setToast(msg)
    if (bad) {
      setShake((n) => n + 1)
      sfx('wrong')
    }
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1600)
  }, [])

  const floatCoins = (text: string) => {
    const id = Date.now() + Math.random()
    setFloaters((f) => [...f, { id, text }])
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), 1300)
  }

  const pick = (i: number) => {
    if (busy || sheet || (stage !== 'word' && stage !== 'explore')) return
    if (sel.includes(i)) {
      sfx('undo')
      setSel(sel.filter((x) => x !== i))
      return
    }
    sfx('tap')
    setSel([...sel, i])
  }
  const backspace = () => {
    if (busy || !sel.length) return
    sfx('undo')
    setSel(sel.slice(0, -1))
  }
  const shuffleWheel = () => {
    sfx('tap')
    setSel([])
    setWheel(makeWheel(main, level.decoys))
  }

  const solveMain = () => {
    setRows((r) => [...r, { letters: main, states: Array(main.length).fill('correct') }])
    setSel([])
    setBusy(true)
    sfx('win')
    const first = actions.completeMain(levelId, level.main.senseId, REWARD_MAIN)
    if (first) {
      setEarned((e) => e + REWARD_MAIN)
      floatCoins(`+${REWARD_MAIN} 🪙`)
    }
    setTimeout(() => {
      setBusy(false)
      setStage('learn')
      setSheet({
        word: level.main,
        kind: 'main',
        reward: first ? REWARD_MAIN : undefined,
        cta: 'Build a sentence →',
        after: () => setStage('sentence'),
      })
    }, 1100)
  }

  const submit = () => {
    if (busy || sheet) return
    const guess = typed
    if (guess.length < 2) return flash('Pick at least 2 letters', true)

    if (guess === main) {
      if (stage === 'explore') {
        setSel([])
        return flash('That one is already solved ✔', true)
      }
      return solveMain()
    }

    // secret words use their own validator, independent from main-word evaluation
    const r = validateSecretWord(guess, pool, level.secretWords, levelProgress(getState(), levelId).secrets)
    if (r.status === 'new') {
      if (actions.addSecret(levelId, r.word.text)) {
        sfx('secret')
        setEarned((e) => e + 1)
        floatCoins('+1 🪙')
        setClue(null)
      }
      setSel([])
      setSheet({ word: r.word, kind: 'secret', reward: 1, cta: 'Nice!' })
      return
    }
    if (r.status === 'duplicate') {
      setSel([])
      return flash('You already found that one! No double coins 😉', true)
    }

    if (stage === 'word' && guess.length === main.length) {
      sfx('flip')
      setRows((rs) => [...rs, { letters: guess, states: evaluateGuess(guess, main) }])
      setSel([])
      return
    }
    setSel([])
    flash(stage === 'word' ? 'Not a secret word here — keep exploring!' : 'Not one of the hidden words', true)
  }

  // physical keyboard = bonus on desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (sheet || busy || (stage !== 'word' && stage !== 'explore')) return
      if (e.key === 'Enter') return submit()
      if (e.key === 'Backspace') return backspace()
      if (/^[a-z]$/i.test(e.key)) {
        const ch = e.key.toUpperCase()
        const idx = wheel.findIndex((l, i) => l === ch && !sel.includes(i))
        if (idx >= 0) pick(idx)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // ── hints ──
  const hintLetter = () => {
    if (lp.completed) return flash('Already solved!')
    const missing = main.split('').map((_, i) => i).filter((i) => !hinted[i] && pattern[i] === '')
    if (!missing.length) return flash('You already know every letter!')
    if (!actions.spend(COST.letter)) return flash('Not enough coins 🪙', true)
    const i = missing[Math.floor(Math.random() * missing.length)]
    setHinted((h) => ({ ...h, [i]: main[i] }))
    sfx('coin')
  }
  const hintMeaning = () => {
    if (meaningShown) return
    if (!actions.spend(COST.meaning)) return flash('Not enough coins 🪙', true)
    setMeaningShown(true)
    sfx('coin')
  }
  const hintClue = () => {
    const pending = level.secretWords.filter((s) => !lp.secrets.includes(s.text))
    if (!pending.length) return flash('You found all the secrets! 🏆')
    if (!actions.spend(COST.clue)) return flash('Not enough coins 🪙', true)
    const s = pending[Math.floor(Math.random() * pending.length)].text
    setClue(s[0].toUpperCase() + ' ' + Array(s.length - 1).fill('_').join(' '))
    sfx('coin')
  }

  // ── stage transitions ──
  const afterSentence = () => {
    const first = actions.completeSentence(levelId, REWARD_SENTENCE) // rewarded only once per level
    if (first) {
      setEarned((e) => e + REWARD_SENTENCE)
      floatCoins(`+${REWARD_SENTENCE} 🪙`)
    }
    if (practice) {
      setPractice(false)
      return setStage('explore')
    }
    // review a previously learned word (not this level's) in a new context
    const st = getState()
    const cand = LEVELS.filter((l) => l.id !== levelId && st.meanings[l.main.senseId])
      .sort((a, b) => st.meanings[a.main.senseId].reviews - st.meanings[b.main.senseId].reviews || st.meanings[a.main.senseId].lastSeen - st.meanings[b.main.senseId].lastSeen)[0]
    if (cand) {
      setReviewLevel(cand)
      setStage('review')
    } else {
      setStage('done')
    }
  }

  const secretsLeft = level.secretWords.length - lp.secrets.length
  const sentence = pickVariant(level.sentences, (playIndex.current ?? 0) + sentenceRound)
  const slotCount = Math.max(main.length, sel.length)
  const showBoard = stage === 'word' || stage === 'explore'
  const themeStyle = {
    '--from': world.theme.from,
    '--to': world.theme.to,
    '--accent': world.theme.accent,
  } as React.CSSProperties

  return (
    <div className="screen level-screen" style={themeStyle}>
      <header className="topbar">
        <button className="icon-btn" onClick={onExit} aria-label="Back">
          ←
        </button>
        <div className="top-title">
          <small>
            {world.icon} {world.title}
          </small>
          <b>Level · {level.category}</b>
        </div>
        <SoundToggle />
        <CoinBadge />
      </header>

      <div className="floaters">
        {floaters.map((f) => (
          <span key={f.id} className="floater">
            {f.text}
          </span>
        ))}
      </div>
      {toast && <div className={`toast${shake ? ' show' : ''}`}>{toast}</div>}

      {showBoard && (
        <div className="stage board">
          {/* secret words panel */}
          <div className="secret-panel">
            <div className="secret-head">
              <span>
                🗝️ Secret words <b>{lp.secrets.length}</b>/{level.secretWords.length}
              </span>
              {stage === 'word' && <small>optional · +1 🪙 each</small>}
            </div>
            <div className="secret-chips">
              {level.secretWords
                .filter((s) => lp.secrets.includes(s.text))
                .map((s) => (
                  <button key={s.text} className="secret-chip found" onClick={() => setSheet({ word: s, kind: 'known', cta: 'Got it' })}>
                    {s.text}
                  </button>
                ))}
              {Array.from({ length: secretsLeft }, (_, i) => (
                <span key={i} className="secret-chip locked">
                  🔒
                </span>
              ))}
            </div>
            {clue && <div className="clue">🔍 Clue: {clue}</div>}
          </div>

          {/* mission */}
          <div className="mission">
            {stage === 'word' ? (
              <>
                Find the <b>{main.length}-letter</b> word
                {meaningShown && (
                  <span className="meaning-pill">
                    {' '}
                    · “{level.main.translation}”
                  </span>
                )}
              </>
            ) : (
              <>
                <b>{main.toUpperCase()}</b> solved ✔ — hunt the hidden words!
              </>
            )}
          </div>

          {/* guess history (Wordle-style feedback) */}
          <div className="history">
            {rows.slice(-3).map((r, ri, arr) => (
              <div className="tile-row" key={rows.length - arr.length + ri} style={{ "--n": r.letters.length } as React.CSSProperties}>
                {r.letters.split('').map((ch, i) => (
                  <div key={i} className={`tile ${r.states[i]}`} style={{ animationDelay: `${i * 110}ms` }}>
                    {ch.toUpperCase()}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* pattern + current word */}
          {stage === 'word' && (
            <div className="pattern">
              {pattern.map((c, i) => (
                <span key={i} className={c ? 'on' : ''}>
                  {c ? c.toUpperCase() : '_'}
                </span>
              ))}
            </div>
          )}
          <div className={`tile-row current${shake ? ' shake' : ''}`} key={`cur-${shake}`} style={{ '--n': slotCount } as React.CSSProperties}>
            {Array.from({ length: slotCount }, (_, i) => (
              <button
                key={i}
                className={`tile slot${sel[i] !== undefined ? ' filled' : ''}`}
                onClick={() => sel[i] !== undefined && setSel(sel.filter((_, k) => k !== i))}
              >
                {sel[i] !== undefined ? wheel[sel[i]] : ''}
              </button>
            ))}
          </div>

          <Wheel letters={wheel} selected={sel} dimmed={dimmed} onPick={pick} onShuffle={shuffleWheel} />

          <div className="actions">
            <button className="round-btn" onClick={backspace} aria-label="Delete last letter" disabled={!sel.length}>
              ⌫
            </button>
            <button className="btn primary go" onClick={submit} disabled={sel.length < 2 || busy}>
              GO!
            </button>
            <button className="round-btn" onClick={() => (setSel([]), sfx('undo'))} aria-label="Clear" disabled={!sel.length}>
              ✖
            </button>
          </div>

          {stage === 'word' ? (
            <div className="hints">
              <button className="hint-btn" onClick={hintLetter}>
                💡 Letter <i>{COST.letter}🪙</i>
              </button>
              <button className="hint-btn" onClick={hintMeaning} disabled={meaningShown}>
                🌐 Meaning <i>{COST.meaning}🪙</i>
              </button>
              <button className="hint-btn" onClick={hintClue}>
                🔍 Secret clue <i>{COST.clue}🪙</i>
              </button>
            </div>
          ) : (
            <div className="hints">
              <button className="hint-btn" onClick={hintClue}>
                🔍 Secret clue <i>{COST.clue}🪙</i>
              </button>
              <button
                className="hint-btn"
                onClick={() => {
                  setSentenceRound((n) => n + 1)
                  setPractice(true)
                  setStage('sentence')
                }}
              >
                ✍️ New sentence
              </button>
              {nextLevelId && (
                <button className="hint-btn" onClick={() => onNext(nextLevelId)}>
                  ⏭ Next level
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {stage === 'sentence' && (
        <SentenceBuilder
          key={`s-${sentenceRound}`}
          challenge={sentence}
          onDone={afterSentence}
        />
      )}

      {stage === 'review' && reviewLevel && (
        <ReviewCard
          level={reviewLevel}
          onDone={(firstTry) => {
            actions.reviewed(reviewLevel.main.senseId)
            if (firstTry) {
              actions.earn(1)
              setEarned((e) => e + 1)
              sfx('coin')
            }
            setStage('done')
          }}
        />
      )}

      {stage === 'done' && (
        <div className="stage done-stage">
          <Confetti />
          <div className="trophy">🏆</div>
          <h2>Level complete!</h2>
          <div className="summary">
            <div>
              <b>{main.toUpperCase()}</b>
              <small>word learned</small>
            </div>
            <div>
              <b>
                {lp.secrets.length}/{level.secretWords.length}
              </b>
              <small>secret words</small>
            </div>
            <div>
              <b>+{earned}</b>
              <small>coins this run</small>
            </div>
          </div>
          {secretsLeft > 0 && <p className="soft">Still {secretsLeft} hidden word{secretsLeft > 1 ? 's' : ''} waiting for you…</p>}
          <div className="stack">
            {nextLevelId && (
              <button className="btn primary" onClick={() => onNext(nextLevelId)}>
                Next level →
              </button>
            )}
            <button className="btn" onClick={() => setStage('explore')}>
              🗝️ Hunt secret words
            </button>
            <button className="btn ghost" onClick={onExit}>
              Back to {world.title}
            </button>
          </div>
        </div>
      )}

      {sheet && (
        <WordSheet
          word={sheet.word}
          kind={sheet.kind}
          reward={sheet.reward}
          cta={sheet.cta}
          onClose={() => {
            const after = sheet.after
            setSheet(null)
            after?.()
          }}
        />
      )}
    </div>
  )
}
