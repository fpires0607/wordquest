import { beforeEach, describe, expect, it } from 'vitest'
import { actions, getState, levelProgress } from '../state/store'
import { migrateProgress } from '../state/migrate'
import { FREE_LETTERS, nextClue } from './clues'
import { bumpStreak, currentStreak, dayKey, emptyStreak, type Streak } from './streak'

describe('progressive secret clue', () => {
  const words = ['rug', 'tug', 'great', 'gait']
  it('starts with the shortest word, then keeps helping the same one', () => {
    expect(nextClue(words, [], {})).toBe('rug')
    expect(nextClue(words, [], { rug: 1 })).toBe('rug')
  })
  it('stops one letter short so the player must finish the word', () => {
    expect(nextClue(['rug'], [], { rug: 2 })).toBeNull()
    expect(nextClue(['rug', 'tug'], [], { rug: 2 })).toBe('tug')
  })
  it('moves on when the helped word is found, and never targets found words', () => {
    expect(nextClue(words, ['rug'], { rug: 1 })).toBe('tug')
    expect(nextClue(words, words, {})).toBeNull()
  })
})

describe('free letters by difficulty', () => {
  it('beginner shows the first letter of every word, harder levels none', () => {
    expect(FREE_LETTERS).toEqual({ beginner: 1, intermediate: 0, advanced: 0 })
  })
  it('free letters count as already revealed when choosing the next clue', () => {
    // 3-letter words with 1 free letter can still be clued once (up to length-1 = 2 shown)
    expect(nextClue(['air', 'art'], [], {}, 1)).toBe('air')
    expect(nextClue(['air', 'art'], [], { air: 2 }, 1)).toBe('art')
    expect(nextClue(['hi'], [], {}, 1)).toBeNull() // 2-letter word: 1 free letter leaves exactly the last one
  })
  it('the first paid clue starts AFTER the free letters (no wasted coin)', () => {
    actions.reset()
    actions.earn(10)
    expect(actions.buyClue('music-guitar', 'air', 2, 1)).toBe(2)
    expect(getState().coins).toBe(11)
  })
})

describe('buying the meaning of a hidden word', () => {
  beforeEach(() => actions.reset())
  it('charges once per word, never twice, never without coins', () => {
    expect(actions.buyPeek('music-guitar', 'air', 1)).toBe(true)
    expect(getState().coins).toBe(2)
    expect(actions.buyPeek('music-guitar', 'air', 1)).toBe(false) // already bought
    expect(getState().coins).toBe(2)
    expect(levelProgress(getState(), 'music-guitar').peeks).toEqual(['air'])
    actions.spend(2)
    expect(actions.buyPeek('music-guitar', 'art', 1)).toBe(false) // no coins
    expect(levelProgress(getState(), 'music-guitar').peeks).toEqual(['air'])
  })
})

describe('clue purchase never wastes coins', () => {
  beforeEach(() => actions.reset())
  it('accumulates letters of the same word and charges per letter', () => {
    actions.earn(10) // 3 + 10
    expect(actions.buyClue('music-guitar', 'rug', 2)).toBe(1)
    expect(actions.buyClue('music-guitar', 'rug', 2)).toBe(2)
    expect(levelProgress(getState(), 'music-guitar').clues).toEqual({ rug: 2 })
    expect(getState().coins).toBe(9)
  })
  it('does not charge when the player cannot afford it', () => {
    expect(actions.buyClue('music-guitar', 'rug', 99)).toBeNull()
    expect(getState().coins).toBe(3)
    expect(levelProgress(getState(), 'music-guitar').clues).toBeUndefined()
  })
})

describe('streak (days in a row)', () => {
  it('first activity starts at 1; same day does not change it', () => {
    const a = bumpStreak(emptyStreak(), '2026-10-14')
    expect(a).toEqual({ count: 1, best: 1, lastDay: '2026-10-14' })
    expect(bumpStreak(a, '2026-10-14')).toBe(a)
  })
  it('next day increments; month/year boundaries count as consecutive', () => {
    let s = bumpStreak(emptyStreak(), '2026-12-31')
    s = bumpStreak(s, '2027-01-01')
    expect(s.count).toBe(2)
    s = bumpStreak(s, '2027-01-02')
    expect(s).toMatchObject({ count: 3, best: 3 })
  })
  it('a skipped day restarts at 1 but remembers the best', () => {
    let s: Streak = { count: 5, best: 5, lastDay: '2026-10-10' }
    s = bumpStreak(s, '2026-10-12')
    expect(s).toEqual({ count: 1, best: 5, lastDay: '2026-10-12' })
  })
  it('display: alive until the end of the day after the last activity', () => {
    const s = { count: 4, best: 4, lastDay: '2026-10-14' }
    expect(currentStreak(s, '2026-10-14')).toEqual({ count: 4, doneToday: true })
    expect(currentStreak(s, '2026-10-15')).toEqual({ count: 4, doneToday: false })
    expect(currentStreak(s, '2026-10-16')).toEqual({ count: 0, doneToday: false })
    expect(currentStreak(emptyStreak(), '2026-10-14').count).toBe(0)
  })
  it('dayKey uses the local calendar day', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })
  it('real progress counts as activity; merely existing does not', () => {
    actions.reset()
    expect(getState().streak.count).toBe(0)
    actions.addSecret('music-guitar', 'rug')
    expect(getState().streak).toMatchObject({ count: 1, lastDay: dayKey() })
    actions.completeSentence('music-guitar', 1)
    expect(getState().streak.count).toBe(1) // same day
  })
  it('saves without a streak (older v2) load with the default; bad data is sanitized', () => {
    const base = migrateProgress({ version: 2, coins: 7, levels: {}, meanings: {}, interests: ['travel'], onboarded: true })
    expect(base.streak).toEqual(emptyStreak())
    expect(base.coins).toBe(7)
    expect(migrateProgress({ ...base, streak: { count: 3, best: 1, lastDay: 'yesterday' } }).streak).toEqual(emptyStreak())
    expect(migrateProgress({ ...base, streak: { count: 3, best: 9, lastDay: '2026-10-14' } }).streak).toEqual({ count: 3, best: 9, lastDay: '2026-10-14' })
  })
})
