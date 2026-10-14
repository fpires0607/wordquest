import { useState } from 'react'
import type { Difficulty } from '../data/types'
import { INTEREST_WORLDS } from '../data/worlds'
import { actions, useProgress } from '../state/store'
import { DIFF_LABEL } from './Home'

/** First-run setup and later edits: proficiency level and (multiple) interests are independent choices. */
export function Onboarding({ editing, onClose }: { editing?: boolean; onClose(): void }) {
  const p = useProgress()
  const [level, setLevel] = useState<Difficulty>(p.playerLevel)
  const [picked, setPicked] = useState<string[]>(p.interests)

  const toggle = (id: string) => setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  return (
    <div className="screen onboarding">
      <header className="topbar">
        <div className="logo">
          {editing ? 'My ' : 'Welcome to '}
          <span>{editing ? 'interests' : 'WordQuest'}</span>
        </div>
      </header>

      <h2 className="section-title">What are you into?</h2>
      <p className="soft">Pick one or more. You can change this anytime — every world still has all levels.</p>
      <div className="interest-grid">
        {INTEREST_WORLDS.map((w) => (
          <button
            key={w.id}
            className={`interest${picked.includes(w.id) ? ' on' : ''}`}
            style={{ '--from': w.theme.from, '--to': w.theme.to } as React.CSSProperties}
            onClick={() => toggle(w.id)}
            aria-pressed={picked.includes(w.id)}
          >
            <span className="i-icon">{w.icon}</span>
            <b>{w.title}</b>
            {picked.includes(w.id) && <span className="check">✔</span>}
          </button>
        ))}
      </div>

      <h2 className="section-title">Your English level</h2>
      <div className="seg">
        {(Object.keys(DIFF_LABEL) as Difficulty[]).map((d) => (
          <button key={d} className={level === d ? 'on' : ''} onClick={() => setLevel(d)}>
            {DIFF_LABEL[d].icon} {DIFF_LABEL[d].name}
          </button>
        ))}
      </div>

      <div className="stack onboarding-actions">
        <button
          className="btn primary"
          disabled={!picked.length}
          onClick={() => {
            actions.completeOnboarding(level, picked)
            onClose()
          }}
        >
          {editing ? 'Save' : "Let's play!"}
        </button>
        {editing && (
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
