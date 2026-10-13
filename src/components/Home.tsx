import { LEVELS } from '../data/levels'
import { WORLDS } from '../data/worlds'
import type { Difficulty, World } from '../data/types'
import { actions, levelProgress, useProgress, type Progress } from '../state/store'
import { CoinBadge, SoundToggle } from './ui'
import type { CSSProperties } from 'react'

export const DIFF_LABEL: Record<Difficulty, { icon: string; name: string }> = {
  beginner: { icon: '🌱', name: 'Beginner' },
  intermediate: { icon: '🌿', name: 'Intermediate' },
  advanced: { icon: '🌳', name: 'Advanced' },
}

export function worldStats(world: World, p: Progress) {
  const levels = LEVELS.filter((l) => l.worldId === world.id)
  const done = levels.filter((l) => levelProgress(p, l.id).completed).length
  const secrets = levels.reduce((n, l) => n + levelProgress(p, l.id).secrets.length, 0)
  const totalSecrets = levels.reduce((n, l) => n + l.secretWords.length, 0)
  return { total: levels.length, done, secrets, totalSecrets }
}

export function Home({ onWorld }: { onWorld(id: string): void }) {
  const p = useProgress()
  return (
    <div className="screen home">
      <header className="topbar">
        <div className="logo">
          Word<span>Quest</span>
        </div>
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

      <h2 className="section-title">Choose your world</h2>
      <div className="world-grid">
        {WORLDS.map((w) => {
          const st = worldStats(w, p)
          const fits = LEVELS.some((l) => l.worldId === w.id && l.difficulty === p.playerLevel && !levelProgress(p, l.id).completed)
          return (
            <button
              key={w.id}
              className="world-card"
              style={{ '--from': w.theme.from, '--to': w.theme.to, '--accent': w.theme.accent } as CSSProperties}
              onClick={() => onWorld(w.id)}
            >
              <span className="deco d1">{w.theme.deco[0]}</span>
              <span className="deco d2">{w.theme.deco[1]}</span>
              <span className="deco d3">{w.theme.deco[2]}</span>
              <div className="world-icon">{w.icon}</div>
              <div className="world-info">
                <h3>{w.title}</h3>
                <p>{w.description}</p>
                <div className="bar">
                  <i style={{ width: `${(st.done / st.total) * 100}%` }} />
                </div>
                <small>
                  {st.done}/{st.total} levels · 🗝️ {st.secrets}/{st.totalSecrets}
                </small>
              </div>
              {fits && <span className="badge">★ For you</span>}
            </button>
          )
        })}
      </div>
      <p className="footnote">Progress is saved on this device.</p>
    </div>
  )
}
