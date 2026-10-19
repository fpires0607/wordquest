import { describe, expect, it } from 'vitest'
import { evaluateGuess } from './evaluate'
import { canForm } from './letters'
import { validateSecretWord } from './secrets'
import { checkSentence, sentenceTokens } from './sentences'
import { LEVELS } from '../data/levels'

describe('evaluateGuess', () => {
  it('marks all correct', () => {
    expect(evaluateGuess('bread', 'bread')).toEqual(Array(5).fill('correct'))
  })
  it('greens consume copies: extra guessed copies are absent', () => {
    expect(evaluateGuess('tttttt', 'street')).toEqual(['absent', 'correct', 'absent', 'absent', 'absent', 'correct'])
  })
  it('a green consumes the only copy, so an earlier duplicate is not yellow', () => {
    expect(evaluateGuess('eerie', 'crane')).toEqual(['absent', 'absent', 'present', 'absent', 'correct'])
  })
  it('yellow only for remaining copies', () => {
    expect(evaluateGuess('seeter', 'street')).toEqual(['correct', 'present', 'absent', 'present', 'correct', 'present'])
  })
  it('decoy letters are absent', () => {
    expect(evaluateGuess('board', 'bread')).toEqual(['correct', 'absent', 'present', 'present', 'correct'])
  })
})

describe('secret validation', () => {
  const curated = [{ text: 'tree', translation: 'árvore', example: '' }]
  it('respects letter frequency', () => {
    expect(canForm('tree', 'street')).toBe(true)
    expect(canForm('treee', 'street')).toBe(false)
    expect(canForm('tent', 'street')).toBe(false)
  })
  it('new, duplicate, invalid', () => {
    expect(validateSecretWord('tree', 'street', curated, []).status).toBe('new')
    expect(validateSecretWord('tree', 'street', curated, ['tree']).status).toBe('duplicate')
    expect(validateSecretWord('rest', 'street', curated, []).status).toBe('invalid')
  })
})

describe('sentences', () => {
  it('tokenizes and checks', () => {
    const { words, end } = sentenceTokens('Can you keep a secret?')
    expect(end).toBe('?')
    expect(checkSentence(['Can', 'you', null, 'a', 'x'], words)).toEqual([true, true, false, true, false])
  })
})

describe('difficulty budget for secret words', () => {
  // keeps secrets fair: easy levels only use short words (the curated lists use common vocabulary)
  const budget = { beginner: { max: 5, len: 5 }, intermediate: { max: 6, len: 6 }, advanced: { max: 8, len: 9 } }
  for (const l of LEVELS) {
    it(`${l.id} (${l.difficulty})`, () => {
      const b = budget[l.difficulty]
      expect(l.secretWords.length).toBeLessThanOrEqual(b.max)
      for (const w of l.secretWords) expect(w.text.length, w.text).toBeLessThanOrEqual(b.len)
    })
  }
})

describe('level content integrity', () => {
  for (const l of LEVELS) {
    it(`${l.id}: secrets are formable, unique and well-formed`, () => {
      const pool = l.main.text + l.decoys
      expect(l.decoys.split('').every((d) => !l.main.text.includes(d))).toBe(true)
      const seen = new Set<string>()
      for (const s of l.secretWords) {
        expect(canForm(s.text, pool), s.text).toBe(true)
        expect(seen.has(s.text), `dup ${s.text}`).toBe(false)
        expect(s.example.length).toBeGreaterThan(5)
        seen.add(s.text)
      }
      expect(l.secretWords.length).toBeGreaterThanOrEqual(5)
      expect(l.sentences.length).toBeGreaterThanOrEqual(2)
      expect(l.main.cloze.sentence).toContain('___')
    })
  }
})
