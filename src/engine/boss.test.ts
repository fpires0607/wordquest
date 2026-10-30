import { beforeEach, describe, expect, it } from 'vitest'
import { levelsOfWorld } from '../data/worlds'
import { migrateProgress } from '../state/migrate'
import { actions, getState } from '../state/store'
import { BOSS_REWARD, BOSS_STARS, bossMedal, bossStatus, buildBossPool, worldStars, type LevelsProgress } from './boss'
import { buildListenFromPairs, buildMatchFromPairs } from './challenges'
import { LEVELS } from '../data/levels'

const travel = levelsOfWorld('travel') // ticket, hotel, airport, luggage, passport, souvenir
const lp = (completed: boolean, sentenceDone: boolean, secrets: string[] = []) => ({ completed, sentenceDone, secrets })

describe('boss unlock', () => {
  it('needs BOSS_STARS stars inside the world', () => {
    const none: LevelsProgress = {}
    expect(worldStars(travel, none)).toBe(0)
    expect(bossStatus(travel, none, undefined).unlocked).toBe(false)
    // five levels at 1 star = 5 (< 6)
    const five: LevelsProgress = Object.fromEntries(travel.slice(0, 5).map((l) => [l.id, lp(true, false)]))
    expect(worldStars(travel, five)).toBe(5)
    expect(bossStatus(travel, five, undefined).unlocked).toBe(false)
    // one more star (a 2-star level) unlocks
    const ticket = travel.find((l) => l.id === 'travel-ticket')!
    five['travel-ticket'] = lp(true, true, ticket.secretWords.slice(0, 3).map((w) => w.text))
    expect(worldStars(travel, five)).toBe(6)
    const st = bossStatus(travel, five, undefined)
    expect(st).toMatchObject({ unlocked: true, needed: BOSS_STARS, medal: 0 })
  })
  it('only counts stars of the same world', () => {
    const other: LevelsProgress = Object.fromEntries(levelsOfWorld('music').map((l) => [l.id, lp(true, true, l.secretWords.map((w) => w.text))]))
    expect(worldStars(travel, other)).toBe(0)
  })
  it('shows the stored medal', () => {
    expect(bossStatus(travel, {}, 2).medal).toBe(2)
  })
})

describe('boss medal', () => {
  it('3 flawless, 2 one slip, 1 otherwise', () => {
    expect([0, 1, 2, 5].map(bossMedal)).toEqual([3, 2, 1, 1])
  })
})

describe('boss content only uses earned words', () => {
  const hotel = travel.find((l) => l.id === 'travel-hotel')!
  const ticket = travel.find((l) => l.id === 'travel-ticket')!
  const progress: LevelsProgress = {
    'travel-ticket': lp(true, true, ['ice', 'tie']),
    'travel-hotel': lp(true, false, []),
    'travel-airport': lp(false, false, ['trip']), // not completed: found secret must NOT leak into the pool
  }
  const pool = buildBossPool(travel, progress)

  it('pairs = completed mains + found secrets; nothing from unfinished or unfound', () => {
    const en = pool.pairs.map((p) => p.en).sort()
    expect(en).toEqual(['hotel', 'ice', 'ticket', 'tie'])
    expect(pool.cloze.map((l) => l.id).sort()).toEqual(['travel-hotel', 'travel-ticket'])
    const unfoundTicket = ticket.secretWords.map((w) => w.text).filter((t) => !['ice', 'tie'].includes(t))
    for (const s of unfoundTicket) expect(en).not.toContain(s)
    expect(en).not.toContain('airport')
    for (const s of hotel.secretWords) expect(en).not.toContain(s.text)
  })
  it('sentences come only from completed levels', () => {
    const all = new Set([...ticket.sentences, ...hotel.sentences].map((s) => s.text))
    expect(pool.sentences.length).toBe(all.size)
    for (const s of pool.sentences) expect(all.has(s.text)).toBe(true)
  })
  it('listen and match builders: valid shapes, null when too few words', () => {
    const qs = buildListenFromPairs(pool.pairs, LEVELS, 4)
    expect(qs).toHaveLength(4)
    for (const q of qs) {
      expect(new Set(q.options).size).toBe(3)
      expect(q.options.filter((o) => o === q.answer)).toHaveLength(1)
    }
    expect(buildMatchFromPairs(pool.pairs, 4)).toHaveLength(4)
    expect(buildMatchFromPairs(pool.pairs.slice(0, 2), 4)).toBeNull()
  })
})

describe('boss rewards and persistence', () => {
  beforeEach(() => actions.reset())
  it('coins only on the first win; the best medal is kept', () => {
    const c0 = getState().coins
    expect(actions.finishBoss('travel', 2, BOSS_REWARD)).toBe(true)
    expect(getState().coins).toBe(c0 + BOSS_REWARD)
    expect(actions.finishBoss('travel', 1, BOSS_REWARD)).toBe(false)
    expect(getState().bosses.travel).toBe(2) // a worse run never lowers the medal
    expect(actions.finishBoss('travel', 3, BOSS_REWARD)).toBe(false)
    expect(getState().bosses.travel).toBe(3)
    expect(getState().coins).toBe(c0 + BOSS_REWARD)
    expect(getState().streak.count).toBe(1)
  })
  it('saves without bosses load fine; invalid entries are dropped', () => {
    const p = migrateProgress({ version: 2, coins: 4, levels: {}, meanings: {}, interests: [], onboarded: true })
    expect(p.bosses).toEqual({})
    expect(migrateProgress({ ...p, bosses: { travel: 3, music: 9, slang: 'x', business: 2 } }).bosses).toEqual({ travel: 3, business: 2 })
  })
})
