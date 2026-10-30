import type { Level, SentenceChallenge } from '../data/types'
import { starsFor } from './stars'
import type { Pair } from './challenges'

/** Stars a player must earn inside a world to unlock its Final Challenge. */
export const BOSS_STARS = 6
/** Coins for the first win only. */
export const BOSS_REWARD = 5

export type LevelsProgress = Record<string, { completed: boolean; sentenceDone: boolean; secrets: string[] } | undefined>
const empty = { completed: false, sentenceDone: false, secrets: [] as string[] }

export function worldStars(levels: Level[], progress: LevelsProgress): number {
  return levels.reduce((n, l) => n + starsFor(l.secretWords.length, progress[l.id] ?? empty), 0)
}

export function bossStatus(levels: Level[], progress: LevelsProgress, medal: number | undefined) {
  const stars = worldStars(levels, progress)
  return { stars, needed: BOSS_STARS, unlocked: stars >= BOSS_STARS, medal: medal ?? 0 }
}

/** 3 = flawless, 2 = one slip, 1 = finished. `imperfectRounds` = rounds not done perfectly on the first try. */
export function bossMedal(imperfectRounds: number): 1 | 2 | 3 {
  return imperfectRounds === 0 ? 3 : imperfectRounds === 1 ? 2 : 1
}

export interface BossPool {
  pairs: Pair[] // main words of completed levels + secret words already found there
  cloze: Level[] // completed levels (their main word has a flashback sentence)
  sentences: SentenceChallenge[]
}

/** Only content the player has earned: completed levels' words, found secrets, and their sentences. */
export function buildBossPool(levels: Level[], progress: LevelsProgress): BossPool {
  const done = levels.filter((l) => progress[l.id]?.completed)
  const pairs: Pair[] = []
  for (const l of done) {
    pairs.push({ en: l.main.text, pt: l.main.translation })
    for (const w of l.secretWords) if (progress[l.id]!.secrets.includes(w.text)) pairs.push({ en: w.text, pt: w.translation })
  }
  return { pairs, cloze: done, sentences: done.flatMap((l) => l.sentences) }
}
