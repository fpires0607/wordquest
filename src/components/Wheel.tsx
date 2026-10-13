interface Props {
  letters: string[]
  selected: number[]
  dimmed: Set<string> // letters known to be absent from the main word
  onPick(i: number): void
  onShuffle(): void
}

/** Circular letter wheel (tap to pick). Positions computed from index. */
export function Wheel({ letters, selected, dimmed, onPick, onShuffle }: Props) {
  const n = letters.length
  const r = n > 8 ? 37 : 34 // % of wheel size
  return (
    <div className="wheel" role="group" aria-label="Letters">
      <div className="wheel-ring" />
      {letters.map((ch, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2
        const used = selected.includes(i)
        return (
          <button
            key={i}
            className={`wheel-tile${used ? ' used' : ''}${dimmed.has(ch.toLowerCase()) ? ' absent' : ''}`}
            style={{ left: `${50 + r * Math.cos(a)}%`, top: `${50 + r * Math.sin(a)}%` }}
            onClick={() => onPick(i)}
            aria-pressed={used}
          >
            {ch}
          </button>
        )
      })}
      <button className="wheel-center" onClick={onShuffle} aria-label="Shuffle letters">
        🔀
      </button>
    </div>
  )
}
