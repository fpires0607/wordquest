import type { Sense, SentenceChallenge, WordInfo } from '../data/types'

/** Card data shown by the live dictionary. `null` entry = nothing reviewed for that word. */
export interface Entry {
  lemma?: string
  translation: string
  usage?: string
  example?: string
  senseId?: string
}
export interface Resolved {
  start: number // first word index of the clickable unit
  span: number // number of words (>1 for expressions)
  entry: Entry | null
}
export type Resolver = (wordIndex: number) => Resolved

export type Piece = { kind: 'word'; text: string; index: number } | { kind: 'gap'; text: string }

/** Splits text into words and everything else (spaces, punctuation) — joining pieces gives back the exact input. */
export function tokenizeText(text: string): Piece[] {
  const re = /([A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*)|([^A-Za-z0-9]+)/g
  const out: Piece[] = []
  let index = 0
  for (const m of text.matchAll(re)) {
    if (m[1]) out.push({ kind: 'word', text: m[1], index: index++ })
    else out.push({ kind: 'gap', text: m[2] })
  }
  return out
}

/** Reads a gloss string into per-word sense ids (undefined = no entry). Throws on malformed input. */
export function parseGloss(gloss: string): (string | undefined)[] {
  const items = gloss.trim().split(/\s+/)
  items.forEach((it, i) => {
    if (it === '~' && (i === 0 || items[i - 1] === '-')) throw new Error(`gloss: "~" must continue an entry (item ${i})`)
  })
  return items.map((it) => (it === '-' || it === '~' ? undefined : it))
}

const toEntry = (s: Sense): Entry => ({ lemma: s.lemma, translation: s.translation, usage: s.usage, example: s.example, senseId: s.id })

/** Resolver for a practice sentence: contextual meaning comes from the sentence's own gloss. */
export function sentenceResolver(sentence: SentenceChallenge, senses: Record<string, Sense>): Resolver {
  const items = sentence.gloss ? sentence.gloss.trim().split(/\s+/) : []
  return (i) => {
    let start = i
    while (start > 0 && items[start] === '~') start--
    const id = items[start]
    if (!id || id === '-' || id === '~') return { start: i, span: 1, entry: null }
    let span = 1
    while (items[start + span] === '~') span++
    const sense = senses[id]
    return { start, span, entry: sense ? toEntry(sense) : null }
  }
}

/** Resolver for a free example sentence where only the target word is known (main/secret word cards). */
export function exampleResolver(text: string, word: WordInfo, senseId?: string): Resolver {
  const target = tokenizeText(text).find((p) => p.kind === 'word' && p.text.toLowerCase().startsWith(word.text.toLowerCase()))
  return (i) => ({
    start: i,
    span: 1,
    entry:
      target && target.kind === 'word' && target.index === i
        ? { lemma: word.text, translation: word.translation, usage: word.meaning, senseId }
        : null,
  })
}
