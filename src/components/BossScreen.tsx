import { useMemo, useState, type CSSProperties } from 'react'
import { LEVELS } from '../data/levels'
import type { Level, SentenceChallenge } from '../data/types'
import { levelsOfWorld, worldById } from '../data/worlds'
import { BOSS_REWARD, bossMedal, buildBossPool } from '../engine/boss'
import { buildListenFromPairs, buildMatchFromPairs, type ListenQuestion, type Pair } from '../engine/challenges'
import { shuffle } from '../engine/letters'
import { sfx } from '../lib/sfx'
import { actions, getState } from '../state/store'
import { ListenChallenge, MatchChallenge } from './MiniChallenge'
import { ReviewCard } from './ReviewCard'
import { SentenceBuilder } from './SentenceBuilder'
import { CoinBadge, Confetti, SoundToggle } from './ui'

type Round =
  | { kind: 'listen'; qs: ListenQuestion[] }
  | { kind: 'match'; pairs: Pair[] }
  | { kind: 'cloze'; level: Level }
  | { kind: 'sentence'; s: SentenceChallenge }

const LABEL: Record<Round['kind'], string> = { listen: '🎧 Listen', match: '🔗 Match', cloze: '⚡ Flashback', sentence: '✍️ Sentence' }

/** Final Challenge: a short run of different exercises built ONLY from what the player has earned in this world. */
export function BossScreen({ worldId, onExit }: { worldId: string; onExit(): void }) {
  const world = worldById(worldId)
  const rounds = useMemo<Round[]>(() => {
    const pool = buildBossPool(levelsOfWorld(worldId), getState().levels)
    const out: Round[] = []
    const qs = buildListenFromPairs(pool.pairs, LEVELS, 4)
    if (qs.length) out.push({ kind: 'listen', qs })
    const pairs = buildMatchFromPairs(pool.pairs, 4)
    if (pairs) out.push({ kind: 'match', pairs })
    for (const level of shuffle(pool.cloze).slice(0, 2)) out.push({ kind: 'cloze', level })
    if (pool.sentences.length) out.push({ kind: 'sentence', s: shuffle(pool.sentences)[0] })
    return out
  }, [worldId])

  const [i, setI] = useState(0)
  const [imperfect, setImperfect] = useState(0)
  const [result, setResult] = useState<{ medal: number; first: boolean } | null>(null)

  const finishRound = (perfect: boolean) => {
    const slips = imperfect + (perfect ? 0 : 1)
    setImperfect(slips)
    if (i + 1 < rounds.length) return setI(i + 1)
    const medal = bossMedal(slips)
    const first = actions.finishBoss(worldId, medal, BOSS_REWARD)
    sfx('win')
    setResult({ medal, first })
  }

  const theme = { '--from': world.theme.from, '--to': world.theme.to, '--accent': world.theme.accent } as CSSProperties
  const r = rounds[i]

  return (
    <div className="screen boss-screen" style={theme}>
      <header className="topbar">
        <button className="icon-btn" onClick={onExit} aria-label="Back">
          ←
        </button>
        <div className="top-title">
          <small>
            {world.icon} {world.title}
          </small>
          <b>👑 Final Challenge</b>
        </div>
        <SoundToggle />
        <CoinBadge />
      </header>

      {!result && r && (
        <>
          <div className="boss-progress">
            <div className="bar">
              <i style={{ width: `${(i / rounds.length) * 100}%` }} />
            </div>
            <small>
              Round {i + 1} of {rounds.length} · {LABEL[r.kind]}
            </small>
          </div>
          {r.kind === 'listen' && <ListenChallenge key={i} questions={r.qs} onDone={finishRound} />}
          {r.kind === 'match' && <MatchChallenge key={i} pairs={r.pairs} onDone={finishRound} />}
          {r.kind === 'cloze' && (
            <ReviewCard
              key={i}
              level={r.level}
              onDone={(firstTry) => {
                actions.reviewed(r.level.main.senseId)
                finishRound(firstTry)
              }}
            />
          )}
          {r.kind === 'sentence' && <SentenceBuilder key={i} challenge={r.s} onDone={(attempts) => finishRound(attempts === 1)} />}
        </>
      )}

      {result && (
        <div className="stage done-stage">
          <Confetti />
          <div className="trophy">👑</div>
          <h2>{world.title} conquered!</h2>
          <div className="stars-row" aria-label={`${result.medal} of 3 stars`}>
            {[1, 2, 3].map((n) => (
              <span key={n} className={`star${result.medal >= n ? ' on' : ''}`} style={{ animationDelay: `${n * 0.25}s` }}>
                ★
              </span>
            ))}
          </div>
          <p className="soft">
            {result.medal === 3 ? 'Flawless run!' : result.medal === 2 ? 'Almost flawless — one slip.' : 'Done! Try again for a better medal.'}
            {result.first ? ` +${BOSS_REWARD} 🪙` : ''}
          </p>
          <div className="stack">
            <button className="btn primary" onClick={onExit}>
              Back to {world.title}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
