export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

// ── Content model ─────────────────────────────────────────────────────────
// Word (lemma)  →  Sense (contextual meaning, id "lemma#slug")  →  appears in Sentences (via gloss)
// Challenge = Level (belongs to one World/Mode)   ·   Learning history = per Sense (state/store.ts)

export interface WordInfo {
  text: string // lowercase
  translation: string // pt-BR
  example: string // original English sentence
  meaning?: string // short English explanation
}

/** A contextual meaning of a word. Same lemma can have many senses ("ticket#pass", "ticket#support-request"). */
export interface Sense {
  id: string // "lemma#slug"; lemma part may use "-" for multiword expressions ("break-a-leg#luck")
  lemma: string
  translation: string // pt-BR, valid for this context
  usage: string // short English explanation of use
  example?: string
}

export interface MainWord extends WordInfo {
  meaning: string
  /** Sense this level teaches. Mastery is tracked per sense, never per spelling. */
  senseId: string
  /** Cloze used in review: sentence containing ___ , plus wrong options. */
  cloze: { sentence: string; distractors: [string, string] }
}

/**
 * Licensing metadata. All content shipped today is `original`.
 * Real song excerpts (future) must carry a non-original status plus explicit permissions.
 */
export interface LicenseInfo {
  status: 'original' | 'public-domain' | 'licensed' | 'unverified'
  holder?: string
  licenseRef?: string // contract / license id
  source?: string
  expires?: string // ISO date
  allow?: { text?: boolean; translation?: boolean; audio?: boolean }
}

export interface SentenceChallenge {
  text: string // original sentence (may end with . ? !)
  translation: string
  /**
   * Live-dictionary data: space-separated, one item per word of `text`.
   * `lemma#slug` = sense id · `-` = no reviewed entry · `~` = continues the previous item (multiword expression).
   */
  gloss?: string
  license?: LicenseInfo // omitted = original
}

export interface Level {
  id: string // stable: saved progress is keyed by it
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
  /** 'interest' = thematic world the player picks in onboarding; 'mode' = special challenge mode. */
  kind: 'interest' | 'mode'
  title: string
  description: string
  icon: string
  theme: { from: string; to: string; accent: string; deco: string[] }
  categories: string[]
  levelIds: string[]
}

// ── Music World (planned, not integrated yet) ─────────────────────────────
export interface FigurativeNote {
  span: [number, number] // word indexes [from, to]
  literal: string
  meaning: string // pt-BR
}
export interface MusicChallenge {
  id: string
  track: { title: string; artist: string; isrc?: string }
  lines: SentenceChallenge[] // excerpt; each line may carry its own license
  license: LicenseInfo
  figurative?: FigurativeNote[]
  audio?: { url: string; startSec: number; endSec: number }
}
