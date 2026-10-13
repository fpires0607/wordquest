import type { ReactNode } from 'react'
import { canSpeak, speak } from '../lib/speech'
import { actions, useProgress } from '../state/store'

export function CoinBadge() {
  const p = useProgress()
  return (
    <div className="coin-badge" title="Coins">
      <span>🪙</span>
      <b>{p.coins}</b>
    </div>
  )
}

export function SoundToggle() {
  const p = useProgress()
  return (
    <button className="icon-btn" aria-label="Toggle sound" onClick={() => actions.toggleSound()}>
      {p.sound ? '🔊' : '🔇'}
    </button>
  )
}

export function SpeakButton({ text, label, big }: { text: string; label?: string; big?: boolean }) {
  if (!canSpeak()) return null
  return (
    <button
      className={`speak-btn${big ? ' big' : ''}`}
      aria-label={`Listen: ${text}`}
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
    >
      🔊{label ? <span>{label}</span> : null}
    </button>
  )
}

export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="sheet-backdrop">
      <div className="sheet">{children}</div>
    </div>
  )
}

export function Highlight({ text, word }: { text: string; word: string }) {
  const parts = text.split(new RegExp(`(\\b${word}\\w*)`, 'i'))
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}
    </>
  )
}

export function Confetti() {
  const bits = ['🎉', '⭐', '✨', '🪙', '🎈', '💫']
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i % 7) * 0.12}s`,
            animationDuration: `${1.8 + (i % 5) * 0.3}s`,
          }}
        >
          {bits[i % bits.length]}
        </span>
      ))}
    </div>
  )
}
