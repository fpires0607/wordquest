import { describe, expect, it } from 'vitest'
import { LEVELS } from './levels'
import { INTEREST_WORLDS, MODES, WORLDS, isInterestId, levelsOfWorld, worldById } from './worlds'

describe('world structure', () => {
  it('has the six interest worlds and Mystery as a special mode', () => {
    expect(INTEREST_WORLDS.map((w) => w.title)).toEqual(['Travel World', 'Business World', 'Music World', 'Movies & Series', 'Everyday Life', 'Slang & Culture'])
    expect(MODES.map((w) => w.id)).toEqual(['mystery'])
    expect(isInterestId('mystery')).toBe(false)
  })
  it('every level belongs to an existing world and ids are unique', () => {
    const ids = new Set<string>()
    for (const l of LEVELS) {
      expect(worldById(l.worldId), l.id).toBeTruthy()
      expect(ids.has(l.id)).toBe(false)
      ids.add(l.id)
    }
  })
  it('world.levelIds matches the levels that declare that world; no world is empty', () => {
    for (const w of WORLDS) {
      expect(w.levelIds).toEqual(levelsOfWorld(w.id).map((l) => l.id))
      expect(w.levelIds.length, w.id).toBeGreaterThan(0)
    }
  })
  it('legacy level ids (saved progress keys) still exist and map to the right worlds', () => {
    const legacy: Record<string, string> = {
      'city-bread': 'everyday', 'city-street': 'everyday', 'city-pharmacy': 'everyday',
      'music-guitar': 'music', 'music-melody': 'music', 'music-symphony': 'music',
      'travel-ticket': 'travel', 'travel-airport': 'travel', 'travel-passport': 'travel',
      'mystery-secret': 'mystery', 'mystery-mystery': 'mystery', 'mystery-labyrinth': 'mystery',
    }
    for (const [id, world] of Object.entries(legacy)) expect(LEVELS.find((l) => l.id === id)?.worldId, id).toBe(world)
  })
  it('proficiency and interest are independent: worlds mix difficulties', () => {
    for (const id of ['travel', 'music', 'everyday', 'mystery']) {
      expect(new Set(levelsOfWorld(id).map((l) => l.difficulty)).size, id).toBeGreaterThan(1)
    }
    // any world can be filtered by level without changing its membership
    expect(levelsOfWorld('travel').filter((l) => l.difficulty === 'advanced').map((l) => l.id)).toEqual(['travel-passport'])
  })
  it('categories declared by a world cover its levels', () => {
    for (const w of WORLDS) for (const l of levelsOfWorld(w.id)) expect(w.categories, l.id).toContain(l.category)
  })
})
