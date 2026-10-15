import type { WordInfo } from '../data/types'

interface Props {
  words: WordInfo[]
  found: string[]
  clues: Record<string, number> // letters revealed by paid clues
  onOpen(word: WordInfo): void
}

/** One row of boxes per hidden word: shows how many letters each has, never the letters themselves (except found/clued ones). */
export function SecretGrid({ words, found, clues, onOpen }: Props) {
  // grouped by length (short first) — the order of the curated list is not exposed
  const sorted = [...words].sort((a, b) => a.text.length - b.text.length)
  return (
    <div className="secret-grid" role="list">
      {sorted.map((w) => {
        const isFound = found.includes(w.text)
        const shown = isFound ? w.text.length : clues[w.text] ?? 0
        const boxes = w.text.split('').map((ch, i) => {
          const on = i < shown
          return (
            <span key={i} className={`sg-box${on ? (isFound ? ' found' : ' clue') : ''}`}>
              {on ? ch.toUpperCase() : ''}
            </span>
          )
        })
        return isFound ? (
          <button key={w.text} className="sg-word found" role="listitem" onClick={() => onOpen(w)} aria-label={`Found: ${w.text}`}>
            {boxes}
          </button>
        ) : (
          <div key={w.text} className="sg-word" role="listitem" aria-label={`Hidden word with ${w.text.length} letters`}>
            {boxes}
          </div>
        )
      })}
    </div>
  )
}
