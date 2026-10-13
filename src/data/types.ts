export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface WordInfo {
  text: string // lowercase
  translation: string // pt-BR
  example: string // original English sentence
  meaning?: string // short English explanation
}

export interface MainWord extends WordInfo {
  meaning: string
  /** Cloze used in review: sentence containing ___ , plus wrong options. */
  cloze: { sentence: string; distractors: [string, string] }
}

export interface SentenceChallenge {
  text: string // original sentence (may end with . ? !)
  translation: string
}

export interface Level {
  id: string
  worldId: string
  difficulty: Difficulty
  category: string
  main: MainWord
  /** Extra letters shown on the wheel that are not in the main word. */
  decoys: string
  /** Curated, validated secondary words. Only these count. */
  secretWords: WordInfo[]
  /** Variants rotate on each play (anti-repetition). */
  sentences: SentenceChallenge[]
}

export interface World {
  id: string
  title: string
  description: string
  icon: string
  theme: { from: string; to: string; accent: string; deco: string[] }
  categories: string[]
  levelIds: string[]
}
