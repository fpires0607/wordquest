import { useMemo, useState } from 'react'
import type { SentenceChallenge } from '../data/types'
import { checkSentence, sentenceTokens } from '../engine/sentences'
import { shuffle } from '../engine/letters'
import { sfx } from '../lib/sfx'
import { SENSES } from '../data/senses'
import { sentenceResolver, type Resolved } from '../engine/dictionary'
import { DictionaryCard } from './DictionaryCard'
import { LiveSentence } from './LiveSentence'
import { SpeakButton } from './ui'

interface Chip {
  id: number
  word: string
}
interface Props {
  challenge: SentenceChallenge
  onDone(attempts: number): void
}

export function SentenceBuilder({ challenge, onDone }: Props) {
  const { words, end } = useMemo(() => sentenceTokens(challenge.text), [challenge])
  const chips = useMemo<Chip[]>(() => {
    let s = shuffle(words.map((word, id) => ({ id, word })))
    for (let i = 0; i < 6 && s.every((c, k) => c.word === words[k]); i++) s = shuffle(s)
    return s
  }, [words])

  const [placed, setPlaced] = useState<(Chip | null)[]>(() => words.map(() => null))
  const [locked, setLocked] = useState<boolean[]>(() => words.map(() => false))
  const [wrong, setWrong] = useState<boolean[]>(() => words.map(() => false))
  const [attempts, setAttempts] = useState(0)
  const [done, setDone] = useState(false)
  const [checking, setChecking] = useState(false)
  const [lookup, setLookup] = useState(false) // dictionary mode: taps open the card instead of building
  const [card, setCard] = useState<{ surface: string; resolved: Resolved } | null>(null)
  const resolve = useMemo(() => sentenceResolver(challenge, SENSES), [challenge])
  const openCard = (surface: string, resolved: Resolved) => {
    sfx('tap')
    setCard({ surface, resolved })
  }

  const usedIds = new Set(placed.filter(Boolean).map((c) => c!.id))
  const full = placed.every(Boolean)

  const add = (c: Chip) => {
    if (lookup) return openCard(c.word, resolve(c.id))
    const slot = placed.findIndex((p) => p === null)
    if (slot < 0 || done || checking) return
    sfx('tap')
    setPlaced(placed.map((p, i) => (i === slot ? c : p)))
  }
  const remove = (i: number) => {
    if (lookup && placed[i]) return openCard(placed[i]!.word, resolve(placed[i]!.id))
    if (locked[i] || done || checking || !placed[i]) return
    sfx('undo')
    setPlaced(placed.map((p, k) => (k === i ? null : p)))
  }
  const check = () => {
    const ok = checkSentence(placed.map((p) => p?.word ?? null), words)
    setAttempts((a) => a + 1)
    if (ok.every(Boolean)) {
      sfx('win')
      setLocked(words.map(() => true))
      setDone(true)
      return
    }
    // correct words stay locked in place; wrong ones shake, then return to the bank
    sfx('wrong')
    setWrong(ok.map((o) => !o))
    setLocked(ok)
    setChecking(true)
    setTimeout(() => {
      setPlaced((cur) => cur.map((p, i) => (ok[i] ? p : null)))
      setWrong(words.map(() => false))
      setChecking(false)
    }, 650)
  }

  return (
    <div className="stage sentence-stage">
      <div className="stage-title">Build the sentence</div>
      <p className="prompt">“{challenge.translation}”</p>
      {!done && (
        <button className={`hint-btn dict-toggle${lookup ? ' on' : ''}`} onClick={() => setLookup((v) => !v)} aria-pressed={lookup}>
          📖 Look up words: {lookup ? 'ON — tap a word' : 'off'}
        </button>
      )}

      {done ? (
        <div className="sentence-slots finished">
          <LiveSentence text={challenge.text} resolve={resolve} onWord={openCard} />
        </div>
      ) : (
      <div className="sentence-slots">
        {placed.map((p, i) => (
          <button
            key={i}
            className={`chip slot${p ? ' filled' : ''}${locked[i] && p ? ' ok' : ''}${wrong[i] ? ' bad' : ''}`}
            onClick={() => remove(i)}
            aria-label={p ? `Remove ${p.word}` : 'Empty slot'}
          >
            {p?.word ?? ''}
          </button>
        ))}
        {end && <span className="end-mark">{end}</span>}
      </div>
      )}

      {!done ? (
        <>
          <div className="chip-bank">
            {chips.map((c) => (
              <button key={c.id} className={`chip${usedIds.has(c.id) ? ' used' : ''}`} disabled={usedIds.has(c.id)} onClick={() => add(c)}>
                {c.word}
              </button>
            ))}
          </div>
          <button className="btn primary" disabled={!full || checking} onClick={check}>
            Check ✔
          </button>
        </>
      ) : (
        <div className="result-card">
          <div className="big-emoji">🎯</div>
          <b>{attempts === 1 ? 'Perfect!' : 'Nice one!'}</b>
          <p className="soft">Tap any word to see what it means here.</p>
          <div className="row-center">
            <SpeakButton text={challenge.text} label="Listen" />
          </div>
          <button className="btn primary" onClick={() => onDone(attempts)}>
            Continue →
          </button>
        </div>
      )}
      {card && <DictionaryCard surface={card.surface} resolved={card.resolved} context={challenge} onClose={() => setCard(null)} />}
    </div>
  )
}
