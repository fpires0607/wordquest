import { useState, type CSSProperties } from 'react'
import { LEVELS } from '../data/levels'
import { INTEREST_WORLDS, MODES, levelsOfWorld } from '../data/worlds'
import type { Difficulty, World } from '../data/types'
import { actions, levelProgress, useProgress, type Progress } from '../state/store'
import { Onboarding } from './Onboarding'
import { CoinBadge, SoundToggle } from './ui'

export const DIFF_LABEL: Record<Difficulty, { icon: string; name: string }> = {
  beginner: { icon: '🌱', name: 'Beginner' },
  intermediate: { icon: '🌿', name: 'Intermediate' },
  advanced: { icon: '🌳', name: 'Advanced' },
}

export function worldStats(world: World, p: Progress) {
  const levels = levelsOfWorld(world.id)
  const done = levels.filter((l) => levelProgress(p, l.id).completed).length
  const secrets = levels.reduce((n, l) => n + levelProgress(p, l.id).secrets.length, 0)
  const totalSecrets = levels.reduce((n, l) => n + l.secretWords.length, 0)
  return { total: levels.length, done, secrets, totalSecrets }
}

function WorldCard({ world, p, badge, onOpen }: { world: World; p: Progress; badge?: string; onOpen(): void }) {
  const st = worldStats(world, p)
  return (
    <button
      className={`world-card${world.kind === 'mode' ? ' mode' : ''}`}
      style={{ '--from': world.theme.from, '--to': world.theme.to, '--accent': world.theme.accent } as CSSProperties}
      onClick={onOpen}
    >
      <span className="deco d1">{world.theme.deco[0]}</span>
      <span className="deco d2">{world.theme.deco[1]}</span>
      <span className="deco d3">{world.theme.deco[2]}</span>
      <div className="world-icon">{world.icon}</div>
      <div className="world-info">
        <h3>{world.title}</h3>
        <p>{world.description}</p>
        <div className="bar">
          <i style={{ width: `${(st.done / st.total) * 100}%` }} />
        </div>
        <small>
          {st.done}/{st.total} levels · 🗝️ {st.secrets}/{st.totalSecrets}
        </small>
      </div>
      {badge && <span className="badge">{badge}</span>}
    </button>
  )
}

export function Home({ onWorld }: { onWorld(id: string): void }) {
  const p = useProgress()
  const [editing, setEditing] = useState(false)

  if (!p.onboarded) return <Onboarding onClose={() => {}} />
  if (editing) return <Onboarding editing onClose={() => setEditing(false)} />

  const mine = INTEREST_WORLDS.filter((w) => p.interests.includes(w.id))
  const others = INTEREST_WORLDS.filter((w) => !p.interests.includes(w.id))

  return (
    <div className="screen home">
      <header className="topbar">
        <div className="logo">
          Word<span>Quest</span>
        </div>
        <button className="icon-btn" aria-label="Edit interests" onClick={() => setEditing(true)}>
          ✏️
        </button>
        <SoundToggle />
        <CoinBadge />
      </header>

      <section className="level-pick">
        <p>Your English level</p>
        <div className="seg">
          {(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => (
            <button key={d} className={p.playerLevel === d ? 'on' : ''} onClick={() => actions.setPlayerLevel(d)}>
              {DIFF_LABEL[d].icon} {DIFF_LABEL[d].name}
            </button>
          ))}
        </div>
      </section>

      <h2 className="section-title">Your worlds</h2>
      <div className="world-grid">
        {mine.map((w) => (
          <WorldCard key={w.id} world={w} p={p} badge="★ Interest" onOpen={() => onWorld(w.id)} />
        ))}
      </div>

      <h2 className="section-title">Special modes</h2>
      <div className="world-grid">
        {MODES.map((w) => (
          <WorldCard key={w.id} world={w} p={p} badge="Special" onOpen={() => onWorld(w.id)} />
        ))}
      </div>

      {others.length > 0 && (
        <>
          <h2 className="section-title">More worlds</h2>
          <div className="world-grid">
            {others.map((w) => (
              <WorldCard key={w.id} world={w} p={p} onOpen={() => onWorld(w.id)} />
            ))}
          </div>
        </>
      )}
      <p className="footnote">
        {LEVELS.length} levels · progress is saved on this device.
      </p>
    </div>
  )
}
