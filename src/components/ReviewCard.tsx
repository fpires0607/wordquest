import { useMemo, useState } from 'react'
import type { Level } from '../data/types'
import { shuffle } from '../engine/letters'
import { sfx } from '../lib/sfx'
import { SpeakButton } from './ui'

interface Props {
  level: Level // the level whose word is being reviewed (a previously learned word)
  onDone(firstTry: boolean): void
}

/** Quick cloze: a known word appears again in a brand-new sentence. */
export function ReviewCard({ level, onDone }: Props) {
  const { cloze, text, translation } = level.main
  const options = useMemo(() => shuffle([text, ...cloze.distractors]), [text, cloze])
  const [tries, setTries] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [shake, setShake] = useState<string | null>(null)
  const solved = picked === text

  const pick = (o: string) => {
    if (solved) return
    if (o === text) {
      sfx('secret')
      setPicked(o)
    } else {
      sfx('wrong')
      setTries((t) => t + 1)
      setShake(o)
      setTimeout(() => setShake(null), 400)
    }
  }
  const [before, after] = cloze.sentence.split('___')

  return (
    <div className="stage review-stage">
      <div className="stage-title">⚡ Quick flashback</div>
      <p className="prompt">You met this word before. Where does it fit?</p>
      <div className="cloze">
        {before}
        <span className={`blank${solved ? ' filled' : ''}`}>{solved ? text : '     '}</span>
        {after}
      </div>
      <div className="options">
        {options.map((o) => (
          <button key={o} className={`btn option${shake === o ? ' shake' : ''}${solved && o === text ? ' good' : ''}`} onClick={() => pick(o)}>
            {o}
          </button>
        ))}
      </div>
      {solved && (
        <div className="result-card">
          <div>
            <b>{text}</b> = {translation} <SpeakButton text={cloze.sentence.replace('___', text)} />
          </div>
          <button className="btn primary" onClick={() => onDone(tries === 0)}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
