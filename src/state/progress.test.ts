import { beforeEach, describe, expect, it } from 'vitest'
import { migrateProgress, freshProgress } from './migrate'
import { actions, getState, levelProgress } from './store'

const v1 = {
  version: 1,
  coins: 42,
  playerLevel: 'intermediate',
  sound: false,
  levels: {
    'city-bread': { completed: true, sentenceDone: true, secrets: ['beard', 'read'], plays: 3 },
    'music-guitar': { completed: false, sentenceDone: false, secrets: ['rug'], plays: 1 },
  },
  words: { bread: { reviews: 2, lastSeen: 111 } },
}

describe('progress migration v1 → v2', () => {
  it('keeps coins, settings and every level record untouched', () => {
    const p = migrateProgress(v1)
    expect(p.version).toBe(2)
    expect(p.coins).toBe(42)
    expect(p.playerLevel).toBe('intermediate')
    expect(p.sound).toBe(false)
    expect(p.levels).toEqual(v1.levels)
  })
  it('moves word mastery from spelling to the sense taught by that level', () => {
    const p = migrateProgress(v1)
    expect(p.meanings['bread#food']).toEqual({ reviews: 2, lastSeen: 111 })
    expect('words' in p).toBe(false)
  })
  it('infers interests from worlds already played (renamed city → everyday) and skips onboarding', () => {
    const p = migrateProgress(v1)
    expect(p.interests.sort()).toEqual(['everyday', 'music'])
    expect(p.onboarded).toBe(true)
  })
  it('a v1 save with no activity asks for onboarding', () => {
    const p = migrateProgress({ version: 1, coins: 5, levels: {}, words: {} })
    expect(p.interests).toEqual([])
    expect(p.onboarded).toBe(false)
  })
  it('mystery progress survives although Mystery is now a mode (not an interest)', () => {
    const p = migrateProgress({ version: 1, coins: 9, levels: { 'mystery-secret': { completed: true, sentenceDone: false, secrets: [], plays: 1 } }, words: {} })
    expect(p.levels['mystery-secret'].completed).toBe(true)
    expect(p.interests).not.toContain('mystery')
  })
  it('is idempotent on v2 and safe on garbage', () => {
    const p = migrateProgress(v1)
    expect(migrateProgress(p)).toEqual(p)
    expect(migrateProgress(null)).toEqual(freshProgress())
    expect(migrateProgress({ version: 99 })).toEqual(freshProgress())
    expect(migrateProgress('nope')).toEqual(freshProgress())
  })
  it('drops unknown interest ids', () => {
    expect(migrateProgress({ ...freshProgress(), interests: ['travel', 'mystery', 'bogus', 'travel'] }).interests).toEqual(['travel'])
  })
})

describe('interests and meanings in the store', () => {
  beforeEach(() => actions.reset())

  it('onboarding stores level + multiple interests; later edits keep all progress', () => {
    actions.completeOnboarding('advanced', ['travel', 'music', 'nope'])
    expect(getState()).toMatchObject({ onboarded: true, playerLevel: 'advanced', interests: ['travel', 'music'] })
    actions.completeMain('travel-ticket', 'ticket#pass', 5)
    actions.addSecret('travel-ticket', 'kite')
    const coins = getState().coins
    actions.setInterests(['business'])
    expect(getState().interests).toEqual(['business'])
    expect(getState().playerLevel).toBe('advanced') // proficiency is independent from interest
    expect(getState().coins).toBe(coins)
    expect(levelProgress(getState(), 'travel-ticket')).toMatchObject({ completed: true, secrets: ['kite'] })
  })
  it('mastering one sense does not master another sense of the same word', () => {
    actions.completeMain('travel-ticket', 'ticket#pass', 5)
    expect(getState().meanings['ticket#pass']).toBeTruthy()
    expect(getState().meanings['ticket#support-request']).toBeUndefined()
    actions.reviewed('ticket#pass')
    expect(getState().meanings['ticket#pass'].reviews).toBe(1)
  })
  it('rewards stay once-only (existing engine rules unchanged)', () => {
    const c0 = getState().coins
    expect(actions.completeMain('city-bread', 'bread#food', 5)).toBe(true)
    expect(actions.completeMain('city-bread', 'bread#food', 5)).toBe(false)
    expect(actions.addSecret('city-bread', 'beard')).toBe(true)
    expect(actions.addSecret('city-bread', 'beard')).toBe(false)
    expect(getState().coins).toBe(c0 + 6)
  })
})
