import { useSyncExternalStore } from 'react'
import type { Difficulty } from '../data/types'
import { bumpStreak, dayKey } from '../engine/streak'
import { freshProgress, migrateProgress, sanitizeInterests, type LevelProgress, type Progress } from './migrate'

export type { LevelProgress, Progress, MeaningProgress } from './migrate'

const KEY = 'wordquest:v1' // key kept on purpose: the payload carries its own `version`, migrated on load

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return migrateProgress(JSON.parse(raw))
  } catch {
    /* storage unavailable or corrupted: start fresh */
  }
  return freshProgress()
}

let state: Progress = load()
const listeners = new Set<() => void>()

function commit(next: Progress) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore quota/private-mode errors */
  }
  listeners.forEach((l) => l())
}

export const getState = () => state
export const useProgress = () =>
  useSyncExternalStore(
    (cb) => (listeners.add(cb), () => listeners.delete(cb)),
    getState,
  )

const emptyLevel = (): LevelProgress => ({ completed: false, sentenceDone: false, secrets: [], plays: 0 })
export const levelProgress = (p: Progress, id: string): LevelProgress => p.levels[id] ?? emptyLevel()

function patchLevel(id: string, fn: (l: LevelProgress) => LevelProgress, coins = 0) {
  commit({ ...state, coins: state.coins + coins, levels: { ...state.levels, [id]: fn(levelProgress(state, id)) } })
}

/** Counts today as an active day. Called only from real progress (solving, finding, finishing), not from just opening the app. */
function markActive() {
  const streak = bumpStreak(state.streak, dayKey())
  if (streak !== state.streak) commit({ ...state, streak })
}

export const actions = {
  startPlay: (id: string) => patchLevel(id, (l) => ({ ...l, plays: l.plays + 1 })),
  /** Returns true only on the first completion (reward granted once). Mastery is recorded for that level's sense only. */
  completeMain(id: string, senseId: string, reward: number) {
    const l = levelProgress(state, id)
    if (l.completed) return false
    patchLevel(id, (x) => ({ ...x, completed: true }), reward)
    commit({ ...state, meanings: { ...state.meanings, [senseId]: state.meanings[senseId] ?? { reviews: 0, lastSeen: Date.now() } } })
    markActive()
    return true
  },
  completeSentence(id: string, reward: number) {
    if (levelProgress(state, id).sentenceDone) return false
    patchLevel(id, (x) => ({ ...x, sentenceDone: true }), reward)
    markActive()
    return true
  },
  /** Mini challenge (listen / match). Pays once per level; always counts as activity for the streak. */
  completeChallenge(id: string, reward: number) {
    const first = !levelProgress(state, id).challengeDone
    if (first) patchLevel(id, (x) => ({ ...x, challengeDone: true }), reward)
    markActive()
    return first
  },
  /** +1 coin per never-found secret; duplicates are ignored here too (defence in depth). */
  addSecret(id: string, word: string) {
    if (levelProgress(state, id).secrets.includes(word)) return false
    patchLevel(id, (x) => ({ ...x, secrets: [...x.secrets, word] }), 1)
    markActive()
    return true
  },
  /**
   * Buys one more revealed letter for `word`. Charges only when it succeeds, so a failed or
   * impossible clue never costs coins. Returns the new revealed count, or null.
   */
  buyClue(id: string, word: string, cost: number, free = 0): number | null {
    if (state.coins < cost) return null
    const lp = levelProgress(state, id)
    const next = Math.max(lp.clues?.[word] ?? 0, free) + 1 // free letters are already visible, so paying starts after them
    patchLevel(id, (x) => ({ ...x, clues: { ...x.clues, [word]: next } }), -cost)
    return next
  },
  /** Buys the Portuguese meaning of a hidden word. Never charges twice, nor when it can't afford it. */
  buyPeek(id: string, word: string, cost: number): boolean {
    const lp = levelProgress(state, id)
    if (lp.peeks?.includes(word) || state.coins < cost) return false
    patchLevel(id, (x) => ({ ...x, peeks: [...(x.peeks ?? []), word] }), -cost)
    return true
  },
  spend(cost: number) {
    if (state.coins < cost) return false
    commit({ ...state, coins: state.coins - cost })
    return true
  },
  earn: (n: number) => commit({ ...state, coins: state.coins + n }),
  reviewed(senseId: string) {
    const prev = state.meanings[senseId] ?? { reviews: 0, lastSeen: 0 }
    commit({ ...state, meanings: { ...state.meanings, [senseId]: { reviews: prev.reviews + 1, lastSeen: Date.now() } } })
    markActive()
  },
  setPlayerLevel: (playerLevel: Difficulty) => commit({ ...state, playerLevel }),
  /** Replaces the player's interests (unknown ids dropped). Level progress is never touched. */
  setInterests: (ids: string[]) => commit({ ...state, interests: sanitizeInterests(ids) }),
  completeOnboarding: (playerLevel: Difficulty, interests: string[]) =>
    commit({ ...state, playerLevel, interests: sanitizeInterests(interests), onboarded: true }),
  toggleSound: () => commit({ ...state, sound: !state.sound }),
  reset: () => commit(freshProgress()),
}
