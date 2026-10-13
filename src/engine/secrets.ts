import { canForm } from './letters'
import type { WordInfo } from '../data/types'

export type SecretResult =
  | { status: 'new'; word: WordInfo }
  | { status: 'duplicate'; word: WordInfo }
  | { status: 'invalid' }

/**
 * Secret-word validation. Deliberately independent from evaluate.ts:
 * a secret is valid only if it is in the level's curated list AND can be
 * formed from the wheel letters respecting each letter's max frequency.
 * It awards nothing by itself; the caller decides rewards from `status`.
 */
export function validateSecretWord(
  guess: string,
  wheelLetters: string,
  curated: WordInfo[],
  alreadyFound: string[],
): SecretResult {
  const g = guess.toLowerCase()
  if (g.length < 2 || !canForm(g, wheelLetters)) return { status: 'invalid' }
  const word = curated.find((w) => w.text === g)
  if (!word) return { status: 'invalid' }
  return alreadyFound.includes(g) ? { status: 'duplicate', word } : { status: 'new', word }
}
