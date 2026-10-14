import { describe, expect, it } from 'vitest'
import { LEVELS } from '../data/levels'
import { SENSES } from '../data/senses'
import type { Sense, SentenceChallenge } from '../data/types'
import { exampleResolver, parseGloss, sentenceResolver, tokenizeText } from './dictionary'
import { sentenceTokens } from './sentences'
import { canUse } from './licensing'

const sentencesOf = (levelId: string) => LEVELS.find((l) => l.id === levelId)!.sentences
const wordIndex = (text: string, word: string, nth = 0) => {
  const hits = tokenizeText(text).filter((p) => p.kind === 'word' && p.text.toLowerCase() === word.toLowerCase())
  const h = hits[nth]
  if (!h || h.kind !== 'word') throw new Error(`no "${word}"`)
  return h.index
}

describe('tokenizeText', () => {
  it('preserves spaces, punctuation and apostrophes exactly', () => {
    for (const t of ["Don't forget your passport, please!", 'Can we move the meeting to Friday?', 'Hello — “quoted” text...']) {
      expect(
        tokenizeText(t)
          .map((p) => p.text)
          .join(''),
      ).toBe(t)
    }
    expect(tokenizeText("Don't stop").filter((p) => p.kind === 'word')).toHaveLength(2)
  })
  it('word indexes match the sentence-builder tokens', () => {
    for (const l of LEVELS)
      for (const s of l.sentences) {
        expect(tokenizeText(s.text).filter((p) => p.kind === 'word')).toHaveLength(sentenceTokens(s.text).words.length)
      }
  })
})

describe('contextual translation', () => {
  it('same spelling, different sense per context: ticket (travel vs business)', () => {
    const travel = sentencesOf('travel-ticket')[0]
    const biz = sentencesOf('business-meeting')[2]
    const a = sentenceResolver(travel, SENSES)(wordIndex(travel.text, 'ticket')).entry
    const b = sentenceResolver(biz, SENSES)(wordIndex(biz.text, 'ticket')).entry
    expect(a?.translation).toBe('passagem / ingresso')
    expect(b?.translation).toBe('chamado (de suporte)')
    expect(a?.senseId).not.toBe(b?.senseId)
  })
  it('same spelling, different sense inside the same world: mystery', () => {
    const [main, genre] = sentencesOf('mystery-mystery')
    expect(sentenceResolver(main, SENSES)(wordIndex(main.text, 'mystery')).entry?.senseId).toBe('mystery#unknown')
    expect(sentenceResolver(genre, SENSES)(wordIndex(genre.text, 'mystery')).entry?.senseId).toBe('mystery#story-genre')
  })
  it('inflected forms show the base form and the right sense', () => {
    const s = sentencesOf('travel-ticket')[1] // "Where can I buy a train ticket?"
    expect(sentenceResolver(s, SENSES)(wordIndex(s.text, 'can')).entry?.senseId).toBe('can#possibility')
    const bought = sentencesOf('music-guitar')[0]
    const e = sentenceResolver(bought, SENSES)(wordIndex(bought.text, 'bought')).entry
    expect(e?.lemma).toBe('buy')
    expect(e?.translation).toBe('comprar')
  })
  it('expressions resolve as one unit from any of their words', () => {
    const s = sentencesOf('slang-chill')[1] // "Just chill and break a leg tonight!"
    const r = sentenceResolver(s, SENSES)
    const first = r(wordIndex(s.text, 'break'))
    expect(first).toMatchObject({ start: 3, span: 3 })
    expect(first.entry?.translation).toContain('boa sorte')
    expect(r(wordIndex(s.text, 'leg'))).toMatchObject({ start: 3, span: 3 })
  })
  it('missing entry → null (fallback), never invented', () => {
    const s: SentenceChallenge = { text: 'Zorp the cat', translation: 'x', gloss: '- the#article -' }
    const r = sentenceResolver(s, SENSES)
    expect(r(0).entry).toBeNull()
    expect(r(1).entry?.translation).toBe('o / a / os / as')
    expect(sentenceResolver({ text: 'No gloss here', translation: 'x' }, SENSES)(1).entry).toBeNull()
  })
  it('example cards only know the target word', () => {
    const r = exampleResolver('The bus stops on my street.', { text: 'street', translation: 'rua', example: '' }, 'street#road')
    expect(r(wordIndex('The bus stops on my street.', 'street')).entry?.translation).toBe('rua')
    expect(r(0).entry).toBeNull()
  })
})

describe('repeated words in one sentence', () => {
  const senses: Record<string, Sense> = {
    'keep#store': { id: 'keep#store', lemma: 'keep', translation: 'guardar', usage: '' },
    'keep#continue': { id: 'keep#continue', lemma: 'keep', translation: 'continuar', usage: '' },
    'the#article': SENSES['the#article'],
  }
  const s: SentenceChallenge = {
    text: 'Keep the key and keep going',
    translation: '',
    gloss: 'keep#store the#article - and#add keep#continue going#x',
  }
  it('each occurrence resolves to its own position/sense', () => {
    const r = sentenceResolver(s, { ...senses, 'and#add': SENSES['and#add'] })
    const i1 = wordIndex(s.text, 'keep', 0)
    const i2 = wordIndex(s.text, 'keep', 1)
    expect(i1).not.toBe(i2)
    expect(r(i1).entry?.translation).toBe('guardar')
    expect(r(i2).entry?.translation).toBe('continuar')
  })
  it('real content: "the" twice in one sentence resolves at both positions', () => {
    const t = sentencesOf('city-street')[0] // The shop is on the next street.
    const r = sentenceResolver(t, SENSES)
    expect(r(wordIndex(t.text, 'the', 0)).entry?.senseId).toBe('the#article')
    expect(r(wordIndex(t.text, 'the', 1)).entry?.senseId).toBe('the#article')
    expect(wordIndex(t.text, 'the', 1)).toBe(4)
  })
})

describe('gloss data integrity', () => {
  it('every gloss aligns with its sentence and references existing senses', () => {
    const missing: string[] = []
    for (const l of LEVELS)
      for (const s of l.sentences) {
        expect(s.gloss, `${l.id}: ${s.text}`).toBeTruthy()
        const items = parseGloss(s.gloss!)
        expect(items.length, `${l.id}: "${s.text}"`).toBe(sentenceTokens(s.text).words.length)
        for (const id of items) if (id && !SENSES[id]) missing.push(id)
      }
    expect(missing).toEqual([])
  })
  it('malformed continuation is rejected', () => {
    expect(() => parseGloss('~ a#b')).toThrow()
    expect(() => parseGloss('- ~')).toThrow()
  })
  it('each main word registers its own sense', () => {
    for (const l of LEVELS) expect(SENSES[l.main.senseId]?.translation).toBe(l.main.translation)
  })
})

describe('licensing gate (Music World, planned)', () => {
  it('original/absent license is allowed; unverified is blocked', () => {
    expect(canUse(undefined, 'text')).toBe(true)
    expect(canUse({ status: 'original' }, 'audio')).toBe(true)
    expect(canUse({ status: 'unverified', allow: { text: true } }, 'text')).toBe(false)
  })
  it('licensed content needs an explicit grant per feature and must not be expired', () => {
    const lic = { status: 'licensed' as const, allow: { text: true } }
    expect(canUse(lic, 'text')).toBe(true)
    expect(canUse(lic, 'translation')).toBe(false)
    expect(canUse({ ...lic, expires: '2020-01-01' }, 'text')).toBe(false)
  })
  it('all shipped content is original or fully authorized', () => {
    for (const l of LEVELS) for (const s of l.sentences) expect(canUse(s.license, 'text')).toBe(true)
  })
})
