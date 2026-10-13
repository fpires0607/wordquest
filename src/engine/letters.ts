export type Counts = Record<string, number>

export function countLetters(s: string): Counts {
  const c: Counts = {}
  for (const ch of s.toLowerCase()) c[ch] = (c[ch] ?? 0) + 1
  return c
}

/** True if `word` can be built from `pool` without exceeding any letter's frequency. */
export function canForm(word: string, pool: string): boolean {
  const avail = countLetters(pool)
  for (const ch of word.toLowerCase()) {
    if (!avail[ch]) return false
    avail[ch]--
  }
  return true
}

export function shuffle<T>(arr: T[], rnd: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    const t = a[i]
    a[i] = a[j]
    a[j] = t
  }
  return a
}

/** Wheel letters (main word + decoys), shuffled so they never spell the answer when avoidable. */
export function makeWheel(main: string, decoys: string, rnd: () => number = Math.random): string[] {
  const letters = (main + decoys).toUpperCase().split('')
  let out = shuffle(letters, rnd)
  for (let i = 0; i < 8 && out.join('').toLowerCase().startsWith(main.toLowerCase()); i++) out = shuffle(letters, rnd)
  return out
}
