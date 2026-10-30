import { describe, expect, it } from 'vitest'
import { availableChallenges } from '../engine/challenges'
import { DIALOGUES, dialogueFor } from './dialogues'
import { LEVELS, levelById } from './levels'

describe('dialogues', () => {
  it('every dialogue belongs to a level and its answer is that level main word', () => {
    for (const [id, d] of Object.entries(DIALOGUES)) {
      const level = LEVELS.find((l) => l.id === id)
      expect(level, id).toBeTruthy()
      expect(d.answer, id).toBe(level!.main.text)
    }
  })
  it('exactly one gap, answer among 3 distinct options, every line translated', () => {
    for (const [id, d] of Object.entries(DIALOGUES)) {
      const gaps = d.lines.filter((l) => l.text.includes('___'))
      expect(gaps, id).toHaveLength(1)
      expect(gaps[0].text.split('___')).toHaveLength(2)
      expect(new Set(d.options).size, id).toBe(3)
      expect(d.options, id).toContain(d.answer)
      expect(d.lines.length, id).toBeGreaterThanOrEqual(2)
      for (const l of d.lines) expect(l.pt.length, id).toBeGreaterThan(3)
    }
  })
  it('Business and Movies levels all have one (the worlds where conversation matters)', () => {
    for (const l of LEVELS.filter((x) => x.worldId === 'business' || x.worldId === 'movies')) expect(dialogueFor(l.id), l.id).toBeTruthy()
  })
  it('the dialogue exercise is offered only where a dialogue exists', () => {
    expect(availableChallenges(levelById('business-email'), [], [])).toContain('dialogue')
    expect(availableChallenges(levelById('travel-ticket'), [], [])).not.toContain('dialogue')
  })
})
