import type { CSSProperties } from 'react'
import { levelsOfWorld, worldById } from '../data/worlds'
import { bossStatus } from '../engine/boss'
import { starsFor } from '../engine/stars'
import { levelProgress, useProgress } from '../state/store'
import { DIFF_LABEL } from './Home'
import { CoinBadge, SoundToggle } from './ui'

export function WorldScreen({ worldId, onBack, onLevel, onBoss }: { worldId: string; onBack(): void; onLevel(id: string): void; onBoss(): void }) {
  const p = useProgress()
  const world = worldById(worldId)
  const levels = levelsOfWorld(worldId)
  const boss = bossStatus(levels, p.levels, p.bosses[worldId])
  return (
    <div className="screen world-screen" style={{ '--from': world.theme.from, '--to': world.theme.to, '--accent': world.theme.accent } as CSSProperties}>
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="top-title">
          <small>{world.kind === 'mode' ? 'Special mode' : 'World'}</small>
          <b>
            {world.icon} {world.title}
          </b>
        </div>
        <SoundToggle />
        <CoinBadge />
      </header>
      <p className="world-desc">{world.description}</p>
      <div className="path">
        {levels.map((l, i) => {
          const lp = levelProgress(p, l.id)
          const stars = starsFor(l.secretWords.length, lp)
          const rec = l.difficulty === p.playerLevel
          return (
            <button key={l.id} className={`node ${i % 2 ? 'right' : 'left'}${lp.completed ? ' done' : ''}${rec ? ' rec' : ''}`} onClick={() => onLevel(l.id)}>
              <span className="node-circle">{lp.completed ? '✔' : i + 1}</span>
              <span className="node-info">
                <b>{lp.completed ? l.main.text.toUpperCase() : `${l.main.text.length}-letter word`}</b>
                <span className="node-stars" aria-label={`${stars} of 3 stars`}>
                  {[1, 2, 3].map((n) => (
                    <i key={n} className={stars >= n ? 'on' : ''}>
                      ★
                    </i>
                  ))}
                </span>
                <small>
                  {DIFF_LABEL[l.difficulty].icon} {DIFF_LABEL[l.difficulty].name} · {l.category}
                </small>
                <small>
                  🗝️ {lp.secrets.length}/{l.secretWords.length}
                  {rec && !lp.completed ? ' · ★ recommended' : ''}
                  {lp.completed && lp.secrets.length < l.secretWords.length ? ' · secrets left' : ''}
                </small>
              </span>
            </button>
          )
        })}
        <button className={`boss-node${boss.unlocked ? ' open' : ''}${boss.medal ? ' won' : ''}`} disabled={!boss.unlocked} onClick={onBoss}>
          <span className="boss-crown">{boss.medal ? '👑' : boss.unlocked ? '⚔️' : '🔒'}</span>
          <span className="node-info">
            <b>Final Challenge</b>
            {boss.unlocked ? (
              <>
                <span className="node-stars" aria-label={`medal ${boss.medal} of 3`}>
                  {[1, 2, 3].map((n) => (
                    <i key={n} className={boss.medal >= n ? 'on' : ''}>
                      ★
                    </i>
                  ))}
                </span>
                <small>{boss.medal ? 'Beat it again for a better medal' : 'Ready! Mixed exercises from this world'}</small>
              </>
            ) : (
              <small>
                Earn {boss.needed - boss.stars} more ⭐ to unlock ({boss.stars}/{boss.needed})
              </small>
            )}
          </span>
        </button>
      </div>
    </div>
  )
}
