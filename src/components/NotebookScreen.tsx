import { useMemo, useState } from 'react'
import { LEVELS } from '../data/levels'
import type { WordInfo } from '../data/types'
import { WORLDS, worldById } from '../data/worlds'
import { buildNotebook, filterNotebook } from '../engine/notebook'
import { useProgress } from '../state/store'
import { CoinBadge, SoundToggle, SpeakButton } from './ui'
import { WordSheet } from './WordSheet'

/** Everything the player has learned so far, searchable and grouped by world. Hidden secrets never show here. */
export function NotebookScreen({ onBack }: { onBack(): void }) {
  const p = useProgress()
  const all = useMemo(() => buildNotebook(LEVELS, p.levels, p.meanings), [p.levels, p.meanings])
  const [query, setQuery] = useState('')
  const [world, setWorld] = useState<string>('all')
  const [open, setOpen] = useState<WordInfo | null>(null)

  const shown = filterNotebook(all, query, world)
  const worldsWithWords = WORLDS.filter((w) => all.some((e) => e.worldId === w.id))
  const groups = worldsWithWords
    .map((w) => ({ world: w, entries: shown.filter((e) => e.worldId === w.id) }))
    .filter((g) => g.entries.length)
  const mains = all.filter((e) => e.kind === 'main').length
  const secrets = all.length - mains

  return (
    <div className="screen notebook">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="top-title">
          <small>
            {mains} words · {secrets} secrets
          </small>
          <b>📒 Word notebook</b>
        </div>
        <SoundToggle />
        <CoinBadge />
      </header>

      {all.length === 0 ? (
        <div className="empty">
          <div className="big-emoji">📒</div>
          <b>Your notebook is empty</b>
          <p className="soft">Solve a level or find a secret word and it will show up here, ready to review.</p>
        </div>
      ) : (
        <>
          <input className="search" placeholder="Search English or Portuguese…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="chips-row">
            <button className={`chipf${world === 'all' ? ' on' : ''}`} onClick={() => setWorld('all')}>
              All
            </button>
            {worldsWithWords.map((w) => (
              <button key={w.id} className={`chipf${world === w.id ? ' on' : ''}`} onClick={() => setWorld(w.id)}>
                {w.icon}
              </button>
            ))}
          </div>

          {groups.length === 0 && <p className="soft center">Nothing matches “{query}”.</p>}
          {groups.map((g) => (
            <section key={g.world.id} className="nb-group">
              <h3>
                {g.world.icon} {worldById(g.world.id).title}
              </h3>
              {g.entries.map((e) => (
                <div key={`${e.levelId}-${e.word.text}`} className="nb-row" role="button" tabIndex={0} onClick={() => setOpen(e.word)}>
                  <span className={`nb-tag ${e.kind}`}>{e.kind === 'main' ? '⭐' : '🗝️'}</span>
                  <span className="nb-text">
                    <b>{e.word.text}</b>
                    <small>{e.word.translation}</small>
                  </span>
                  {e.reviews > 0 && <span className="nb-rev">🔁 {e.reviews}</span>}
                  <SpeakButton text={e.word.text} />
                </div>
              ))}
            </section>
          ))}
        </>
      )}

      {open && <WordSheet word={open} kind="known" cta="Close" onClose={() => setOpen(null)} />}
    </div>
  )
}
