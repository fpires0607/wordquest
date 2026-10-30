import type { Level, WordInfo } from '../data/types'
import type { LevelsProgress } from './boss'

export interface NotebookEntry {
  word: WordInfo
  kind: 'main' | 'secret'
  levelId: string
  worldId: string
  reviews: number // practice count for the sense (main words only)
}

/**
 * Everything the player has earned: main words of completed levels and secret words already found.
 * Hidden secrets never appear. `meanings` = Progress.meanings (reviews per sense).
 */
export function buildNotebook(levels: Level[], progress: LevelsProgress, meanings: Record<string, { reviews: number } | undefined>): NotebookEntry[] {
  const out: NotebookEntry[] = []
  for (const l of levels) {
    const p = progress[l.id]
    if (!p) continue
    if (p.completed) out.push({ word: l.main, kind: 'main', levelId: l.id, worldId: l.worldId, reviews: meanings[l.main.senseId]?.reviews ?? 0 })
    for (const w of l.secretWords) if (p.secrets.includes(w.text)) out.push({ word: w, kind: 'secret', levelId: l.id, worldId: l.worldId, reviews: 0 })
  }
  return out
}

/** Case-insensitive search over the English word and its Portuguese meaning. */
export function filterNotebook(entries: NotebookEntry[], query: string, worldId: string | 'all'): NotebookEntry[] {
  const q = query.trim().toLowerCase()
  return entries.filter(
    (e) => (worldId === 'all' || e.worldId === worldId) && (!q || e.word.text.toLowerCase().includes(q) || e.word.translation.toLowerCase().includes(q)),
  )
}
