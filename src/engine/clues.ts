import type { Difficulty } from '../data/types'

/** Letters of every hidden word shown for free: eases beginners in, none for harder levels. */
export const FREE_LETTERS: Record<Difficulty, number> = { beginner: 1, intermediate: 0, advanced: 0 }

/**
 * Progressive secret-word clues. Each paid clue reveals ONE more letter (left to right) of the
 * same word until only its last letter is missing — the player always has to finish the word.
 * `clues[word]` = letters bought; `free` = letters already visible at no cost (counts as revealed).
 */
export function nextClue(words: string[], found: string[], clues: Record<string, number>, free = 0): string | null {
  const shown = (w: string) => Math.max(clues[w] ?? 0, free)
  const open = words.filter((w) => !found.includes(w) && shown(w) < w.length - 1)
  if (!open.length) return null
  const started = open.filter((w) => (clues[w] ?? 0) > 0)
  const pool = started.length ? started : open
  // keep helping the most advanced word; otherwise start with the shortest (alphabetical tie-break)
  return [...pool].sort((a, b) => shown(b) - shown(a) || a.length - b.length || a.localeCompare(b))[0]
}
