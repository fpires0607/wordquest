import { beforeEach, describe, expect, it } from 'vitest'
import { LEVELS } from '../data/levels'
import { WORLDS, levelsOfWorld } from '../data/worlds'
import { migrateProgress } from '../state/migrate'
import { actions, getState, onAchievements } from '../state/store'
import { ACHIEVEMENTS, achievementProgress, metrics, newlyUnlocked, unlockedIds } from './achievements'
import { buildNotebook, filterNotebook } from './notebook'
import { emptyStreak } from './streak'

const none = { levels: {}, bosses: {}, streak: emptyStreak() }
const doneAll = (ids: string[]) => Object.fromEntries(ids.map((id) => {
  const l = LEVELS.find((x) => x.id === id)!
  return [id, { completed: true, sentenceDone: true, secrets: l.secretWords.map((w) => w.text), plays: 1 }]
}))

describe('achievements', () => {
  it('ids are unique and targets positive', () => {
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length)
    for (const a of ACHIEVEMENTS) expect(a.target).toBeGreaterThan(0)
  })
  it('nothing is unlocked for a new player', () => {
    expect(unlockedIds(none)).toEqual([])
  })
  it('first word, 3 stars and secrets are derived from progress', () => {
    const p = { ...none, levels: doneAll(['travel-ticket']) }
    const m = metrics(p)
    expect(m).toMatchObject({ levels: 1, perfect: 1, sentences: 1, stars: 3, worldsPlayed: 1 })
    expect(unlockedIds(p)).toEqual(expect.arrayContaining(['first-steps', 'perfect-1']))
    expect(unlockedIds(p)).not.toContain('word-10')
  })
  it('world mastery needs every level of that world', () => {
    const ids = levelsOfWorld('slang').map((l) => l.id)
    expect(unlockedIds({ ...none, levels: doneAll(ids.slice(1)) })).not.toContain('master-1')
    expect(unlockedIds({ ...none, levels: doneAll(ids) })).toContain('master-1')
  })
  it('bosses and flawless medals, best streak', () => {
    const p = { ...none, bosses: { travel: 3, music: 1 }, streak: { count: 1, best: 8, lastDay: '2026-10-14' } }
    const u = unlockedIds(p)
    expect(u).toEqual(expect.arrayContaining(['boss-1', 'flawless', 'streak-3', 'streak-7']))
    expect(u).not.toContain('boss-all')
    expect(u).not.toContain('streak-30')
  })
  it('"all" targets follow the content size', () => {
    expect(ACHIEVEMENTS.find((a) => a.id === 'word-all')!.target).toBe(LEVELS.length)
    expect(ACHIEVEMENTS.find((a) => a.id === 'boss-all')!.target).toBe(WORLDS.length)
  })
  it('progress is capped at the target and flags done', () => {
    const a = ACHIEVEMENTS.find((x) => x.id === 'word-10')!
    expect(achievementProgress(a, { ...metrics(none), levels: 4 })).toEqual({ value: 4, target: 10, done: false })
    expect(achievementProgress(a, { ...metrics(none), levels: 99 })).toEqual({ value: 10, target: 10, done: true })
  })
  it('newlyUnlocked ignores what is already recorded', () => {
    const p = { ...none, levels: doneAll(['travel-ticket']) }
    expect(newlyUnlocked(p, {})).toEqual(expect.arrayContaining(['first-steps']))
    expect(newlyUnlocked(p, { 'first-steps': '2026-10-30', 'perfect-1': '2026-10-30' })).toEqual([])
  })
})

describe('achievements in the store and in old saves', () => {
  beforeEach(() => actions.reset())
  it('fires once per unlock and records the day', () => {
    const seen: string[][] = []
    const off = onAchievements((ids) => seen.push(ids))
    actions.completeMain('travel-ticket', 'ticket#pass', 3)
    actions.completeMain('travel-ticket', 'ticket#pass', 3) // repeat: no new unlock
    off()
    expect(seen.flat()).toEqual(['first-steps'])
    expect(Object.keys(getState().achievements)).toEqual(['first-steps'])
  })
  it('older saves are credited silently (no achievements field → catch-up, no popups)', () => {
    const old = migrateProgress({ version: 2, coins: 9, interests: ['travel'], onboarded: true, levels: doneAll(['travel-ticket', 'travel-hotel']), meanings: {} })
    expect(Object.keys(old.achievements)).toEqual(expect.arrayContaining(['first-steps', 'perfect-1']))
    expect(migrateProgress(old)).toEqual(old) // idempotent
  })
  it('unknown ids and bad values are dropped', () => {
    const p = migrateProgress({ ...migrateProgress(null), achievements: { 'first-steps': '2026-01-01', nope: '2026-01-01', 'word-10': 5 } })
    expect(p.achievements).toEqual({ 'first-steps': '2026-01-01' })
  })
})

describe('notebook', () => {
  const progress = {
    'travel-ticket': { completed: true, sentenceDone: true, secrets: ['ice', 'tie'] },
    'travel-hotel': { completed: false, sentenceDone: false, secrets: ['hat'] }, // not completed, but a secret was found
  }
  const entries = buildNotebook(LEVELS, progress, { 'ticket#pass': { reviews: 3 } })

  it('lists completed main words and found secrets only', () => {
    expect(entries.map((e) => e.word.text).sort()).toEqual(['hat', 'ice', 'ticket', 'tie'])
    expect(entries.find((e) => e.word.text === 'ticket')).toMatchObject({ kind: 'main', reviews: 3 })
    expect(entries.find((e) => e.word.text === 'hat')!.kind).toBe('secret')
  })
  it('never exposes hidden secrets', () => {
    const hidden = LEVELS.find((l) => l.id === 'travel-ticket')!.secretWords.map((w) => w.text).filter((t) => !['ice', 'tie'].includes(t))
    for (const h of hidden) expect(entries.map((e) => e.word.text)).not.toContain(h)
  })
  it('searches English and Portuguese, and filters by world', () => {
    expect(filterNotebook(entries, 'ICE', 'all').map((e) => e.word.text)).toEqual(['ice'])
    expect(filterNotebook(entries, 'gravata', 'all').map((e) => e.word.text)).toEqual(['tie'])
    expect(filterNotebook(entries, '', 'music')).toEqual([])
    expect(filterNotebook(entries, '', 'travel')).toHaveLength(4)
  })
})
