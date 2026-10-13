import { countLetters } from './letters'

export type TileState = 'correct' | 'present' | 'absent'

/**
 * Wordle-style evaluation of a guess against the main word.
 * Pass 1 marks greens and consumes those letters; pass 2 marks yellows
 * only while unconsumed copies remain, so repeated letters are exact.
 */
export function evaluateGuess(guess: string, target: string): TileState[] {
  const g = guess.toLowerCase()
  const t = target.toLowerCase()
  const result: TileState[] = Array(g.length).fill('absent')
  const remaining = countLetters(t)

  for (let i = 0; i < g.length; i++) {
    if (g[i] === t[i]) {
      result[i] = 'correct'
      remaining[g[i]]--
    }
  }
  for (let i = 0; i < g.length; i++) {
    if (result[i] === 'correct') continue
    if (remaining[g[i]] > 0) {
      result[i] = 'present'
      remaining[g[i]]--
    }
  }
  return result
}

export const isMainWord = (guess: string, target: string) => guess.toLowerCase() === target.toLowerCase()
