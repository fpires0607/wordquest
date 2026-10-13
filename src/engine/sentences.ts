export function sentenceTokens(text: string): { words: string[]; end: string } {
  const m = text.match(/[.?!]$/)
  const end = m ? m[0] : ''
  const words = text.slice(0, text.length - end.length).split(' ').filter(Boolean)
  return { words, end }
}

/** Per-slot correctness for a (possibly partial) arrangement. */
export function checkSentence(placed: (string | null)[], target: string[]): boolean[] {
  return placed.map((w, i) => w !== null && w.toLowerCase() === target[i].toLowerCase())
}

/** Rotates variants so a replay shows a different sentence. */
export function pickVariant<T>(variants: T[], plays: number): T {
  return variants[plays % variants.length]
}
