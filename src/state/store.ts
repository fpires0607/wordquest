import { useSyncExternalStore } from 'react'
import type { Difficulty } from '../data/types'

export interface LevelProgress {
  completed: boolean
  sentenceDone: boolean
  secrets: string[] // secret words already discovered (and rewarded)
  plays: number
}
export interface WordProgress {
  reviews: number
  lastSeen: number
}
export interface Progress {
  version: 1
  coins: number
  playerLevel: Difficulty
  sound: boolean
  levels: Record<string, LevelProgress>
  words: Record<string, WordProgress> // main words only (secrets don't count as mastery)
}

const KEY = 'wordquest:v1'
const fresh = (): Progress => ({ version: 1, coins: 5, playerLevel: 'beginner', sound: true, levels: {}, words: {} })

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (p?.version === 1) return { ...fresh(), ...p }
    }
  } catch {
    /* storage unavailable or corrupted: start fresh */
  }
  return fresh()
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

export const actions = {
  startPlay: (id: string) => patchLevel(id, (l) => ({ ...l, plays: l.plays + 1 })),
  /** Returns true only on the first completion (reward granted once). */
  completeMain(id: string, word: string, reward: number) {
    const l = levelProgress(state, id)
    if (l.completed) return false
    patchLevel(id, (x) => ({ ...x, completed: true }), reward)
    commit({ ...state, words: { ...state.words, [word]: state.words[word] ?? { reviews: 0, lastSeen: Date.now() } } })
    return true
  },
  completeSentence(id: string, reward: number) {
    if (levelProgress(state, id).sentenceDone) return false
    patchLevel(id, (x) => ({ ...x, sentenceDone: true }), reward)
    return true
  },
  /** +1 coin per never-found secret; duplicates are ignored here too (defence in depth). */
  addSecret(id: string, word: string) {
    if (levelProgress(state, id).secrets.includes(word)) return false
    patchLevel(id, (x) => ({ ...x, secrets: [...x.secrets, word] }), 1)
    return true
  },
  spend(cost: number) {
    if (state.coins < cost) return false
    commit({ ...state, coins: state.coins - cost })
    return true
  },
  earn: (n: number) => commit({ ...state, coins: state.coins + n }),
  reviewed(word: string) {
    const prev = state.words[word] ?? { reviews: 0, lastSeen: 0 }
    commit({ ...state, words: { ...state.words, [word]: { reviews: prev.reviews + 1, lastSeen: Date.now() } } })
  },
  setPlayerLevel: (playerLevel: Difficulty) => commit({ ...state, playerLevel }),
  toggleSound: () => commit({ ...state, sound: !state.sound }),
  reset: () => commit(fresh()),
}
