import { beforeEach, describe, expect, it } from 'vitest'
import { LEVELS, levelById } from '../data/levels'
import { actions, getState, levelProgress } from '../state/store'
import { availableChallenges, buildListen, buildMatch } from './challenges'
import { nextStarGoal, starsFor } from './stars'

const base = { completed: true, sentenceDone: false, secrets: [] as string[] }

describe('stars', () => {
  it('0 until the main word is solved, then 1', () => {
    expect(starsFor(6, { ...base, completed: false })).toBe(0)
    expect(starsFor(6, base)).toBe(1)
  })
  it('2 needs the sentence AND at least half of the secrets', () => {
    expect(starsFor(6, { ...base, sentenceDone: true, secrets: ['a', 'b'] })).toBe(1)
    expect(starsFor(6, { ...base, sentenceDone: false, secrets: ['a', 'b', 'c'] })).toBe(1)
    expect(starsFor(6, { ...base, sentenceDone: true, secrets: ['a', 'b', 'c'] })).toBe(2)
    expect(starsFor(5, { ...base, sentenceDone: true, secrets: ['a', 'b', 'c'] })).toBe(2) // 5 words: 3 is "half"
  })
  it('3 needs every secret word (and the 2-star conditions)', () => {
    const all = ['a', 'b', 'c', 'd', 'e']
    expect(starsFor(5, { ...base, sentenceDone: true, secrets: all })).toBe(3)
    expect(starsFor(5, { ...base, sentenceDone: false, secrets: all })).toBe(1)
  })
  it('explains the next goal', () => {
    expect(nextStarGoal(6, { ...base, completed: false })).toContain('first star')
    expect(nextStarGoal(6, base)).toBe('Next star: finish the sentence and find 3 more secret words')
    expect(nextStarGoal(6, { ...base, sentenceDone: true, secrets: ['a'] })).toBe('Next star: find 2 more secret words')
    expect(nextStarGoal(6, { ...base, sentenceDone: true, secrets: ['a', 'b', 'c', 'd', 'e'] })).toBe('Last star: find the 1 remaining secret word')
    expect(nextStarGoal(2, { ...base, sentenceDone: true, secrets: ['a', 'b'] })).toBeNull()
  })
  it('old saves (no new fields) still produce stars', () => {
    expect(starsFor(5, { completed: true, sentenceDone: true, secrets: [] })).toBe(1)
  })
})

describe('mini challenges only use words the player already knows', () => {
  const lvl = levelById('music-guitar')
  const none: typeof LEVELS = []
  const secretTexts = new Set(lvl.secretWords.map((w) => w.text))
  const noRnd = () => 0.3

  it('listen: first question is the level word; unfound secrets never appear', () => {
    const qs = buildListen(lvl, [], none, LEVELS, noRnd)
    expect(qs).toHaveLength(1)
    expect(qs[0].say).toBe('guitar')
    for (const q of buildListen(lvl, ['air'], none, LEVELS, noRnd)) {
      expect(['guitar', 'air']).toContain(q.say) // 'air' was found; the other 4 secrets stay hidden
      if (q.say !== 'guitar') expect(secretTexts.has(q.say)).toBe(true)
    }
  })
  it('listen: 3 distinct options with exactly one correct, no duplicates', () => {
    const learned = [levelById('city-bread'), levelById('travel-ticket')]
    const qs = buildListen(lvl, ['air'], learned, LEVELS)
    expect(qs).toHaveLength(3)
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.options.filter((o) => o === q.answer)).toHaveLength(1)
    }
  })
  it('match: needs at least 3 known words, never includes an unfound secret', () => {
    expect(buildMatch(lvl, [], none)).toBeNull()
    expect(buildMatch(lvl, ['air'], none)).toBeNull() // only 2 known
    const pairs = buildMatch(lvl, ['air', 'art'], none)!
    expect(pairs.map((p) => p.en).sort()).toEqual(['air', 'art', 'guitar'])
    const withOthers = buildMatch(lvl, [], [levelById('city-bread'), levelById('travel-ticket')])!
    expect(withOthers.map((p) => p.en).sort()).toEqual(['bread', 'guitar', 'ticket'])
    for (const p of buildMatch(lvl, ['air'], [levelById('city-bread'), levelById('travel-ticket')])!) {
      expect(['guitar', 'air', 'bread', 'ticket']).toContain(p.en)
    }
  })
  it('availability: listen always, match once enough words are known', () => {
    expect(availableChallenges(lvl, [], none)).toEqual(['listen'])
    expect(availableChallenges(lvl, ['air', 'art'], none)).toEqual(['listen', 'match'])
  })
})

describe('challenge reward', () => {
  beforeEach(() => actions.reset())
  it('pays once per level but always counts as activity', () => {
    const c0 = getState().coins
    expect(actions.completeChallenge('music-guitar', 1)).toBe(true)
    expect(actions.completeChallenge('music-guitar', 1)).toBe(false)
    expect(getState().coins).toBe(c0 + 1)
    expect(levelProgress(getState(), 'music-guitar').challengeDone).toBe(true)
    expect(getState().streak.count).toBe(1)
  })
})
