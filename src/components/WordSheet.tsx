import { useMemo, useState } from 'react'
import type { WordInfo } from '../data/types'
import { exampleResolver, type Resolved } from '../engine/dictionary'
import { DictionaryCard } from './DictionaryCard'
import { LiveSentence } from './LiveSentence'
import { Sheet, SpeakButton } from './ui'

interface Props {
  word: WordInfo
  kind: 'main' | 'secret' | 'known'
  reward?: number
  cta: string
  onClose(): void
}

export function WordSheet({ word, kind, reward, cta, onClose }: Props) {
  const [card, setCard] = useState<{ surface: string; resolved: Resolved } | null>(null)
  const resolve = useMemo(() => exampleResolver(word.example, word, (word as { senseId?: string }).senseId), [word])
  return (
    <>
    <Sheet>
      <div className={`word-card ${kind}`}>
        {kind === 'secret' && (
          <div className="ribbon">
            🗝️ Secret word! {reward ? <b>+{reward} 🪙</b> : null}
          </div>
        )}
        {kind === 'main' && (
          <div className="ribbon main">
            🎉 You found it! {reward ? <b>+{reward} 🪙</b> : null}
          </div>
        )}
        <div className="word-big">
          {word.text.toUpperCase()} <SpeakButton text={word.text} big />
        </div>
        <div className="translation">{word.translation}</div>
        {word.meaning && <p className="meaning">{word.meaning}</p>}
        <div className="example">
          <span className="ex-label">Example</span>
          <p>
            <LiveSentence text={word.example} resolve={resolve} onWord={(surface, resolved) => setCard({ surface, resolved })} />
          </p>
          <SpeakButton text={word.example} label="Listen" />
        </div>
        <button className="btn primary" onClick={onClose}>
          {cta}
        </button>
      </div>
    </Sheet>
    {card && <DictionaryCard surface={card.surface} resolved={card.resolved} context={{ text: word.example }} onClose={() => setCard(null)} />}
    </>
  )
}
