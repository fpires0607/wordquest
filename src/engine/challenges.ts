import type { Level } from '../data/types'
import { shuffle } from './letters'

// Mini challenges are generated from existing reviewed data (no new content needed).
// They only use words the player has already met: this level's main word, secrets already found,
// and main words learned in other levels — so nothing hidden is ever revealed.

export type ChallengeKind = 'listen' | 'match'
export interface Pair {
  en: string
  pt: string
}
export interface ListenQuestion {
  say: string // text to pronounce
  options: string[] // Portuguese meanings, shuffled
  answer: string
}

type Rnd = () => number

/** Words the player already knows in this context: main word + found secrets + learned mains from other levels. */
export function knownPairs(level: Level, found: string[], learnedOthers: Level[]): { own: Pair[]; others: Pair[] } {
  const own: Pair[] = [{ en: level.main.text, pt: level.main.translation }]
  for (const w of level.secretWords) if (found.includes(w.text)) own.push({ en: w.text, pt: w.translation })
  const others = learnedOthers.map((l) => ({ en: l.main.text, pt: l.main.translation }))
  return { own, others }
}

/** Up to 3 questions: the level's main word first, then other known words. Always ≥1. */
export function buildListen(level: Level, found: string[], learnedOthers: Level[], all: Level[], rnd: Rnd = Math.random): ListenQuestion[] {
  const { own, others } = knownPairs(level, found, learnedOthers)
  const pool: Pair[] = [own[0], ...shuffle([...own.slice(1), ...others], rnd)].slice(0, 3)
  // distractors: any reviewed translation from the whole game, never the right one
  const allPt = new Set<string>()
  for (const l of all) {
    allPt.add(l.main.translation)
    for (const w of l.secretWords) allPt.add(w.translation)
  }
  return pool.map((p) => {
    const wrong = shuffle([...allPt].filter((t) => t !== p.pt), rnd).slice(0, 2)
    return { say: p.en, answer: p.pt, options: shuffle([p.pt, ...wrong], rnd) }
  })
}

/** 3–4 pairs to connect. Null when the player does not know enough words yet. */
export function buildMatch(level: Level, found: string[], learnedOthers: Level[], rnd: Rnd = Math.random): Pair[] | null {
  const { own, others } = knownPairs(level, found, learnedOthers)
  const pairs = [own[0], ...shuffle([...own.slice(1), ...others], rnd)]
  const seen = new Set<string>()
  const unique = pairs.filter((p) => !seen.has(p.en) && !seen.has(p.pt) && seen.add(p.en) && seen.add(p.pt))
  return unique.length >= 3 ? unique.slice(0, 4) : null
}

export function availableChallenges(level: Level, found: string[], learnedOthers: Level[]): ChallengeKind[] {
  const kinds: ChallengeKind[] = ['listen']
  if (buildMatch(level, found, learnedOthers, () => 0.5)) kinds.push('match')
  return kinds
}

