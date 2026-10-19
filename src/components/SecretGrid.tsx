import type { WordInfo } from '../data/types'

interface Props {
  words: WordInfo[]
  found: string[]
  clues: Record<string, number> // letters revealed by paid clues
  free: number // letters shown for free by difficulty
  peeks: string[] // words whose meaning was bought
  onOpen(word: WordInfo): void
  onPeek(word: WordInfo): void
}

/** One row of boxes per hidden word: shows how many letters each has, never the letters themselves (except found/clued/free ones). */
export function SecretGrid({ words, found, clues, free, peeks, onOpen, onPeek }: Props) {
  // grouped by length (short first) — the order of the curated list is not exposed
  const sorted = [...words].sort((a, b) => a.text.length - b.text.length)
  return (
    <div className="secret-grid" role="list">
      {sorted.map((w) => {
        const isFound = found.includes(w.text)
        const shown = isFound ? w.text.length : Math.max(clues[w.text] ?? 0, free)
        const boxes = (
          <span className="sg-boxes">
            {w.text.split('').map((ch, i) => {
              const on = i < shown
              return (
                <span key={i} className={`sg-box${on ? (isFound ? ' found' : ' clue') : ''}`}>
                  {on ? ch.toUpperCase() : ''}
                </span>
              )
            })}
          </span>
        )
        if (isFound)
          return (
            <button key={w.text} className="sg-word found" role="listitem" onClick={() => onOpen(w)} aria-label={`Found: ${w.text}`}>
              {boxes}
            </button>
          )
        const peeked = peeks.includes(w.text)
        return (
          <button
            key={w.text}
            className={`sg-word open${peeked ? ' peeked' : ''}`}
            role="listitem"
            onClick={() => !peeked && onPeek(w)}
            aria-label={`Hidden word with ${w.text.length} letters${peeked ? `, meaning ${w.translation}` : ', tap to see its meaning'}`}
          >
            {boxes}
            {peeked && <span className="sg-caption">{w.translation}</span>}
          </button>
        )
      })}
    </div>
  )
}
