import { LEVELS } from '../data/levels'
import type { Difficulty } from '../data/types'
import { INTEREST_WORLDS } from '../data/worlds'
import { ACHIEVEMENTS, unlockedIds } from '../engine/achievements'
import { dayKey, emptyStreak, type Streak } from '../engine/streak'

export interface LevelProgress {
  completed: boolean
  sentenceDone: boolean
  secrets: string[] // secret words already discovered (and rewarded)
  plays: number
  /** letters revealed by paid secret clues, per word (optional: older saves lack it) */
  clues?: Record<string, number>
  /** hidden words whose translation was bought (optional: older saves lack it) */
  peeks?: string[]
  /** mini challenge finished at least once (reward is paid once; optional for older saves) */
  challengeDone?: boolean
}
/** Learning history per SENSE (contextual meaning), main words only. Secrets never count as mastery. */
export interface MeaningProgress {
  reviews: number
  lastSeen: number
}
export interface Progress {
  version: 2
  coins: number
  playerLevel: Difficulty
  sound: boolean
  onboarded: boolean
  interests: string[] // world ids (kind 'interest'); independent from playerLevel
  levels: Record<string, LevelProgress>
  meanings: Record<string, MeaningProgress>
  streak: Streak // days in a row with activity (additive field: older v2 saves get the default)
  bosses: Record<string, number> // best Final Challenge medal (1-3) per world id (additive field)
  achievements: Record<string, string> // earned achievement id -> day earned (additive field)
}

export const CURRENT_VERSION = 2
export const freshProgress = (): Progress => ({
  version: 2,
  coins: 3,
  playerLevel: 'beginner',
  sound: true,
  onboarded: false,
  interests: [],
  levels: {},
  meanings: {},
  streak: emptyStreak(),
  bosses: {},
  achievements: {},
})

const isObj = (v: unknown): v is Record<string, any> => typeof v === 'object' && v !== null && !Array.isArray(v)
const validIds = () => new Set(INTEREST_WORLDS.map((w) => w.id))

export function sanitizeInterests(ids: unknown): string[] {
  if (!Array.isArray(ids)) return []
  const ok = validIds()
  return [...new Set(ids.filter((x): x is string => typeof x === 'string' && ok.has(x)))]
}

function sanitizeBosses(b: unknown): Record<string, number> {
  if (!isObj(b)) return {}
  const out: Record<string, number> = {}
  for (const [k, v] of Object.entries(b)) if (typeof v === 'number' && v >= 1 && v <= 3 && Number.isInteger(v)) out[k] = v
  return out
}

function sanitizeAchievements(a: unknown): Record<string, string> | null {
  if (!isObj(a)) return null
  const known = new Set(ACHIEVEMENTS.map((x) => x.id))
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(a)) if (known.has(k) && typeof v === 'string') out[k] = v
  return out
}

function sanitizeStreak(s: unknown): Streak {
  if (!isObj(s)) return emptyStreak()
  const count = Number.isInteger(s.count) && s.count >= 0 ? s.count : 0
  const best = Number.isInteger(s.best) && s.best >= count ? s.best : count
  const lastDay = typeof s.lastDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.lastDay) ? s.lastDay : null
  return lastDay ? { count, best, lastDay } : emptyStreak()
}

/**
 * Versioned, non-destructive migration. Unknown/corrupt input → fresh progress.
 * v1 → v2: `words[text]` (spelling) becomes `meanings[senseId]` (sense taught by the level with that main word);
 * interests are inferred from worlds the player already played; level progress is kept as is (ids are stable).
 */
export function migrateProgress(raw: unknown): Progress {
  if (!isObj(raw)) return freshProgress()
  let p: any = raw
  if (p.version === 1) {
    const levels: Progress['levels'] = isObj(p.levels) ? p.levels : {}
    const meanings: Progress['meanings'] = {}
    if (isObj(p.words)) {
      for (const [text, wp] of Object.entries(p.words)) {
        const lvl = LEVELS.find((l) => l.main.text === text)
        if (lvl && isObj(wp)) meanings[lvl.main.senseId] = { reviews: Number(wp.reviews) || 0, lastSeen: Number(wp.lastSeen) || 0 }
      }
    }
    const played = new Set(LEVELS.filter((l) => levels[l.id] && (levels[l.id].plays > 0 || levels[l.id].completed)).map((l) => l.worldId))
    const interests = sanitizeInterests([...played])
    p = { ...p, version: 2, levels, meanings, interests, onboarded: interests.length > 0 }
    delete p.words
  }
  if (p.version !== 2) return freshProgress()
  const base = freshProgress()
  const levels = isObj(p.levels) ? p.levels : {}
  const bosses = sanitizeBosses(p.bosses)
  const streak = sanitizeStreak(p.streak)
  // Saves from before achievements existed: credit what is already earned silently (no popup flood).
  const achievements =
    sanitizeAchievements(p.achievements) ?? Object.fromEntries(unlockedIds({ levels, bosses, streak }).map((id) => [id, dayKey()]))
  return {
    ...base,
    coins: Number.isFinite(p.coins) ? p.coins : base.coins,
    playerLevel: ['beginner', 'intermediate', 'advanced'].includes(p.playerLevel) ? p.playerLevel : base.playerLevel,
    sound: typeof p.sound === 'boolean' ? p.sound : base.sound,
    onboarded: !!p.onboarded,
    interests: sanitizeInterests(p.interests),
    levels,
    meanings: isObj(p.meanings) ? p.meanings : {},
    streak,
    bosses,
    achievements,
  }
}
