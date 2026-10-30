import { useEffect, useState } from 'react'
import { ACHIEVEMENTS, achievementById, achievementProgress, metrics } from '../engine/achievements'
import { onAchievements, useProgress } from '../state/store'
import { CoinBadge, SoundToggle } from './ui'
import { sfx } from '../lib/sfx'

export function AchievementsScreen({ onBack }: { onBack(): void }) {
  const p = useProgress()
  const m = metrics(p)
  const earned = ACHIEVEMENTS.filter((a) => p.achievements[a.id]).length
  // earned first, then closest to completion
  const sorted = [...ACHIEVEMENTS].sort((a, b) => {
    const ea = p.achievements[a.id] ? 1 : 0
    const eb = p.achievements[b.id] ? 1 : 0
    if (ea !== eb) return eb - ea
    return achievementProgress(b, m).value / b.target - achievementProgress(a, m).value / a.target
  })
  return (
    <div className="screen achievements">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="top-title">
          <small>
            {earned} of {ACHIEVEMENTS.length} earned
          </small>
          <b>🏅 Achievements</b>
        </div>
        <SoundToggle />
        <CoinBadge />
      </header>
      <div className="bar big">
        <i style={{ width: `${(earned / ACHIEVEMENTS.length) * 100}%` }} />
      </div>
      <div className="ach-grid">
        {sorted.map((a) => {
          const pr = achievementProgress(a, m)
          const done = !!p.achievements[a.id]
          return (
            <div key={a.id} className={`ach${done ? ' done' : ''}`}>
              <div className="ach-icon">{a.icon}</div>
              <div className="ach-body">
                <b>{a.title}</b>
                <small>{a.desc}</small>
                {done ? (
                  <em>Earned {p.achievements[a.id]}</em>
                ) : (
                  <div className="ach-prog">
                    <div className="bar">
                      <i style={{ width: `${(pr.value / pr.target) * 100}%` }} />
                    </div>
                    <span>
                      {pr.value}/{pr.target}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Pops up when an achievement unlocks (one at a time). Mounted once at the app root. */
export function AchievementToast() {
  const [queue, setQueue] = useState<string[]>([])
  useEffect(
    () =>
      onAchievements((ids) => {
        sfx('win')
        setQueue((q) => [...q, ...ids])
      }),
    [],
  )
  const current = queue[0]
  useEffect(() => {
    if (!current) return
    const t = setTimeout(() => setQueue((q) => q.slice(1)), 3200)
    return () => clearTimeout(t)
  }, [current])
  const a = current ? achievementById(current) : undefined
  if (!a) return null
  return (
    <div className="ach-toast" role="status" key={current}>
      <span className="ach-toast-icon">{a.icon}</span>
      <span>
        <small>Achievement unlocked!</small>
        <b>{a.title}</b>
      </span>
    </div>
  )
}
