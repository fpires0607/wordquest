import { LEVELS } from '../data/levels'
import { WORLDS, levelsOfWorld } from '../data/worlds'
import type { Progress } from '../state/migrate'
import { starsFor } from './stars'

export interface Metrics {
  levels: number // levels completed
  secrets: number // secret words found (all levels)
  stars: number // total stars
  perfect: number // levels with 3 stars
  sentences: number // sentences finished
  worldsPlayed: number // worlds/modes with at least one completed level
  worldsMastered: number // worlds/modes with every level completed
  bosses: number // Final Challenges won
  flawless: number // Final Challenges with the 3-star medal
  streak: number // best streak of active days
  challenges: number // levels with a mini challenge done
}

/** Everything is derived from progress, so achievements work retroactively and never need extra tracking. */
export function metrics(p: Pick<Progress, 'levels' | 'bosses' | 'streak'>): Metrics {
  let levels = 0, secrets = 0, stars = 0, perfect = 0, sentences = 0, challenges = 0
  for (const l of LEVELS) {
    const lp = p.levels[l.id]
    if (!lp) continue
    if (lp.completed) levels++
    secrets += lp.secrets.length
    const s = starsFor(l.secretWords.length, lp)
    stars += s
    if (s === 3) perfect++
    if (lp.sentenceDone) sentences++
    if (lp.challengeDone) challenges++
  }
  const worldsPlayed = WORLDS.filter((w) => levelsOfWorld(w.id).some((l) => p.levels[l.id]?.completed)).length
  const worldsMastered = WORLDS.filter((w) => levelsOfWorld(w.id).every((l) => p.levels[l.id]?.completed)).length
  const medals = Object.values(p.bosses)
  return {
    levels, secrets, stars, perfect, sentences, worldsPlayed, worldsMastered, challenges,
    bosses: medals.length,
    flawless: medals.filter((m) => m === 3).length,
    streak: Math.max(p.streak.best, p.streak.count),
  }
}

export interface Achievement {
  id: string
  icon: string
  title: string
  desc: string
  metric: keyof Metrics
  target: number
}

const A = (id: string, icon: string, title: string, desc: string, metric: keyof Metrics, target: number): Achievement => ({ id, icon, title, desc, metric, target })

export const ACHIEVEMENTS: Achievement[] = [
  A('first-steps', '🌱', 'First steps', 'Solve your first word', 'levels', 1),
  A('word-10', '📗', 'Word Hunter', 'Complete 10 levels', 'levels', 10),
  A('word-25', '📘', 'Word Master', 'Complete 25 levels', 'levels', 25),
  A('word-all', '🏛️', 'Completionist', 'Complete every level', 'levels', LEVELS.length),
  A('secrets-10', '🗝️', 'Secret Seeker', 'Find 10 secret words', 'secrets', 10),
  A('secrets-50', '🔑', 'Key Keeper', 'Find 50 secret words', 'secrets', 50),
  A('secrets-150', '🗃️', 'Vault Cracker', 'Find 150 secret words', 'secrets', 150),
  A('stars-15', '⭐', 'Rising Star', 'Earn 15 stars', 'stars', 15),
  A('stars-50', '🌟', 'Star Collector', 'Earn 50 stars', 'stars', 50),
  A('stars-100', '💫', 'Superstar', 'Earn 100 stars', 'stars', 100),
  A('perfect-1', '🏅', 'Perfectionist', 'Get 3 stars on a level', 'perfect', 1),
  A('perfect-10', '🎖️', 'Gold Standard', 'Get 3 stars on 10 levels', 'perfect', 10),
  A('sentences-10', '✍️', 'Sentence Smith', 'Build 10 sentences', 'sentences', 10),
  A('sentences-30', '📝', 'Storyteller', 'Build 30 sentences', 'sentences', 30),
  A('challenges-10', '🎯', 'Challenger', 'Finish the extra challenge in 10 levels', 'challenges', 10),
  A('worlds-3', '🧭', 'Explorer', 'Play 3 different worlds', 'worldsPlayed', 3),
  A('worlds-all', '🌍', 'Globetrotter', 'Play every world', 'worldsPlayed', WORLDS.length),
  A('master-1', '🏆', 'World Master', 'Complete every level of one world', 'worldsMastered', 1),
  A('boss-1', '⚔️', 'Boss Slayer', 'Win a Final Challenge', 'bosses', 1),
  A('boss-all', '👑', 'Conqueror', 'Win every Final Challenge', 'bosses', WORLDS.length),
  A('flawless', '💎', 'Flawless', 'Win a Final Challenge with 3 stars', 'flawless', 1),
  A('streak-3', '🔥', 'On Fire', 'Play 3 days in a row', 'streak', 3),
  A('streak-7', '🔥', 'Week Warrior', 'Play 7 days in a row', 'streak', 7),
  A('streak-30', '🌋', 'Unstoppable', 'Play 30 days in a row', 'streak', 30),
]

export const achievementById = (id: string) => ACHIEVEMENTS.find((a) => a.id === id)

export function achievementProgress(a: Achievement, m: Metrics) {
  const value = Math.min(m[a.metric], a.target)
  return { value, target: a.target, done: m[a.metric] >= a.target }
}

export function unlockedIds(p: Pick<Progress, 'levels' | 'bosses' | 'streak'>): string[] {
  const m = metrics(p)
  return ACHIEVEMENTS.filter((a) => m[a.metric] >= a.target).map((a) => a.id)
}

/** Unlocked by the current progress but not yet recorded in `earned` (id → day). */
export function newlyUnlocked(p: Pick<Progress, 'levels' | 'bosses' | 'streak'>, earned: Record<string, string>): string[] {
  return unlockedIds(p).filter((id) => !earned[id])
}
