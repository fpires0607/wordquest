/**
 * Progressive secret-word clues. Each paid clue reveals ONE more letter (left to right) of the
 * same word until only its last letter is missing — the player always has to finish the word.
 * `clues[word]` = number of letters already revealed.
 */
export function nextClue(words: string[], found: string[], clues: Record<string, number>): string | null {
  const open = words.filter((w) => !found.includes(w) && (clues[w] ?? 0) < w.length - 1)
  if (!open.length) return null
  const started = open.filter((w) => (clues[w] ?? 0) > 0)
  const pool = started.length ? started : open
  // keep helping the most advanced word; otherwise start with the shortest (alphabetical tie-break)
  return [...pool].sort((a, b) => (clues[b] ?? 0) - (clues[a] ?? 0) || a.length - b.length || a.localeCompare(b))[0]
}
