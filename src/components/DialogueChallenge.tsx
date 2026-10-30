import { useMemo, useState } from 'react'
import type { Dialogue, Level } from '../data/types'
import { exampleResolver, type Resolved } from '../engine/dictionary'
import { shuffle } from '../engine/letters'
import { sfx } from '../lib/sfx'
import { DictionaryCard } from './DictionaryCard'
import { LiveSentence } from './LiveSentence'
import { SpeakButton } from './ui'

/** "Complete the dialogue": pick the word that fits the gap, then read the whole chat (tap any word). */
export function DialogueChallenge({ level, dialogue, onDone }: { level: Level; dialogue: Dialogue; onDone(perfect: boolean): void }) {
  const options = useMemo(() => shuffle([...dialogue.options]), [dialogue])
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const [card, setCard] = useState<{ surface: string; resolved: Resolved; line: { text: string; translation: string } } | null>(null)

  const pick = (o: string) => {
    if (solved) return
    if (o === dialogue.answer) {
      sfx('secret')
      setSolved(true)
    } else {
      sfx('wrong')
      setMistakes((m) => m + 1)
      setShake(o)
      setTimeout(() => setShake(null), 400)
    }
  }

  return (
    <div className="stage challenge-stage">
      <div className="stage-title">💬 Complete the dialogue</div>
      <div className="chat">
        {dialogue.lines.map((l, i) => {
          const hasGap = l.text.includes('___')
          const filled = l.text.replace('___', dialogue.answer)
          return (
            <div key={i} className={`bubble ${l.who === 'A' ? 'left' : 'right'}`}>
              {hasGap && !solved ? (
                <>
                  {l.text.split('___')[0]}
                  <span className="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  {l.text.split('___')[1]}
                </>
              ) : (
                <LiveSentence
                  text={filled}
                  resolve={hasGap ? exampleResolver(filled, level.main, level.main.senseId) : (idx) => ({ start: idx, span: 1, entry: null })}
                  onWord={(surface, resolved) => setCard({ surface, resolved, line: { text: filled, translation: l.pt } })}
                />
              )}
              {solved && <div className="bubble-pt">{l.pt}</div>}
            </div>
          )
        })}
      </div>
      {!solved ? (
        <div className="options">
          {options.map((o) => (
            <button key={o} className={`btn option${shake === o ? ' shake' : ''}`} onClick={() => pick(o)}>
              {o}
            </button>
          ))}
        </div>
      ) : (
        <div className="result-card">
          <SpeakButton text={dialogue.lines.map((l) => l.text.replace('___', dialogue.answer)).join(' ')} label="Listen" />
          <p className="soft">Tap any word to see what it means.</p>
          <button className="btn primary" onClick={() => onDone(mistakes === 0)}>
            Continue →
          </button>
        </div>
      )}
      {card && <DictionaryCard surface={card.surface} resolved={card.resolved} context={card.line} onClose={() => setCard(null)} />}
    </div>
  )
}
