import type { Resolved } from '../engine/dictionary'
import { Sheet, SpeakButton } from './ui'

interface Props {
  surface: string // exactly as it appears in the sentence
  resolved: Resolved
  context?: { text: string; translation?: string }
  onClose(): void
}

/** Live-dictionary card. Never invents content: without a reviewed entry it says so and offers what is known. */
export function DictionaryCard({ surface, resolved, context, onClose }: Props) {
  const e = resolved.entry
  const showLemma = e?.lemma && e.lemma.toLowerCase() !== surface.toLowerCase()
  return (
    <Sheet>
      <div className="word-card dict">
        <div className="ribbon">📖 Live dictionary</div>
        <div className="word-big">
          {surface} <SpeakButton text={surface} big />
        </div>
        {e ? (
          <>
            {showLemma && <div className="lemma">base form: <b>{e.lemma}</b></div>}
            <div className="translation">{e.translation}</div>
            {e.usage && <p className="meaning">{e.usage}</p>}
            {e.example && (
              <div className="example">
                <span className="ex-label">Example</span>
                <p>{e.example}</p>
                <SpeakButton text={e.example} label="Listen" />
              </div>
            )}
          </>
        ) : (
          <div className="no-entry">
            <b>No reviewed entry yet</b>
            <p>We don’t have a translation for “{surface}” in this sentence yet, and we won’t guess.</p>
            {context?.translation && (
              <p className="whole">
                Whole sentence: <i>{context.translation}</i>
              </p>
            )}
          </div>
        )}
        {context && e && <div className="in-context">In: “{context.text}”</div>}
        <button className="btn primary" onClick={onClose}>
          Got it
        </button>
      </div>
    </Sheet>
  )
}
