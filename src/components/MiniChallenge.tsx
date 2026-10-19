import { useEffect, useMemo, useState } from 'react'
import type { ListenQuestion, Pair } from '../engine/challenges'
import { shuffle } from '../engine/letters'
import { speak } from '../lib/speech'
import { sfx } from '../lib/sfx'
import { SpeakButton } from './ui'

/** "Listen & choose": hear a word, pick its meaning. */
export function ListenChallenge({ questions, onDone }: { questions: ListenQuestion[]; onDone(perfect: boolean): void }) {
  const [i, setI] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState<string | null>(null)
  const [right, setRight] = useState<string | null>(null)
  const q = questions[i]

  useEffect(() => {
    const t = setTimeout(() => speak(q.say), 250) // best effort: some browsers block audio until a tap
    return () => clearTimeout(t)
  }, [q.say])

  const pick = (o: string) => {
    if (right) return
    if (o === q.answer) {
      sfx('secret')
      setRight(o)
      setTimeout(() => {
        if (i + 1 >= questions.length) return onDone(mistakes === 0)
        setI(i + 1)
        setRight(null)
      }, 700)
    } else {
      sfx('wrong')
      setMistakes((m) => m + 1)
      setShake(o)
      setTimeout(() => setShake(null), 400)
    }
  }

  return (
    <div className="stage challenge-stage">
      <div className="stage-title">🎧 Listen & choose</div>
      <div className="dots">
        {questions.map((_, k) => (
          <i key={k} className={k < i ? 'done' : k === i ? 'now' : ''} />
        ))}
      </div>
      <p className="prompt">What does this word mean?</p>
      <button className="listen-big" onClick={() => speak(q.say)} aria-label="Play the word again">
        🔊
      </button>
      <div className="options">
        {q.options.map((o) => (
          <button key={o} className={`btn option${shake === o ? ' shake' : ''}${right === o ? ' good' : ''}`} onClick={() => pick(o)}>
            {o}
          </button>
        ))}
      </div>
      {right && (
        <p className="soft">
          <b>{q.say}</b> = {q.answer}
        </p>
      )}
    </div>
  )
}

/** "Match pairs": connect each English word with its meaning. */
export function MatchChallenge({ pairs, onDone }: { pairs: Pair[]; onDone(perfect: boolean): void }) {
  const right = useMemo(() => shuffle(pairs.map((p) => p.pt)), [pairs])
  const [sel, setSel] = useState<string | null>(null) // selected English word
  const [solved, setSolved] = useState<string[]>([]) // solved English words
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState<string | null>(null)

  const choosePt = (pt: string) => {
    if (!sel) return
    const pair = pairs.find((p) => p.en === sel)!
    if (pair.pt === pt) {
      sfx('secret')
      speak(pair.en)
      const next = [...solved, pair.en]
      setSolved(next)
      setSel(null)
      if (next.length === pairs.length) setTimeout(() => onDone(mistakes === 0), 700)
    } else {
      sfx('wrong')
      setMistakes((m) => m + 1)
      setShake(pt)
      setTimeout(() => setShake(null), 400)
    }
  }

  const donePt = new Set(pairs.filter((p) => solved.includes(p.en)).map((p) => p.pt))
  return (
    <div className="stage challenge-stage">
      <div className="stage-title">🔗 Match the pairs</div>
      <p className="prompt">Tap an English word, then its meaning.</p>
      <div className="match-grid">
        <div className="match-col">
          {pairs.map((p) => (
            <button
              key={p.en}
              className={`btn option${sel === p.en ? ' sel' : ''}${solved.includes(p.en) ? ' good' : ''}`}
              disabled={solved.includes(p.en)}
              onClick={() => {
                sfx('tap')
                setSel(p.en)
              }}
            >
              {p.en}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((pt) => (
            <button
              key={pt}
              className={`btn option${shake === pt ? ' shake' : ''}${donePt.has(pt) ? ' good' : ''}`}
              disabled={donePt.has(pt)}
              onClick={() => choosePt(pt)}
            >
              {pt}
            </button>
          ))}
        </div>
      </div>
      <div className="row-center">{solved.length > 0 && <SpeakButton text={solved[solved.length - 1]} label="Listen" />}</div>
    </div>
  )
}
