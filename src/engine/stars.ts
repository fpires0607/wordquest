export interface StarInput {
  completed: boolean
  sentenceDone: boolean
  secrets: string[]
}

/**
 * Stars are derived from progress (never stored), so they stay correct for old saves.
 *  ★1  main word solved
 *  ★2  + sentence finished + at least half of the secret words found
 *  ★3  + every secret word found
 */
export function starsFor(totalSecrets: number, p: StarInput): 0 | 1 | 2 | 3 {
  if (!p.completed) return 0
  const found = p.secrets.length
  const two = p.sentenceDone && found * 2 >= totalSecrets
  if (!two) return 1
  return found >= totalSecrets ? 3 : 2
}

/** What the player should do to earn the next star (null when maxed). */
export function nextStarGoal(totalSecrets: number, p: StarInput): string | null {
  const stars = starsFor(totalSecrets, p)
  if (stars === 3) return null
  if (stars === 0) return 'Solve the main word to earn your first star'
  const found = p.secrets.length
  if (stars === 1) {
    const need = Math.max(0, Math.ceil(totalSecrets / 2) - found)
    const parts = []
    if (!p.sentenceDone) parts.push('finish the sentence')
    if (need > 0) parts.push(`find ${need} more secret word${need > 1 ? 's' : ''}`)
    return `Next star: ${parts.join(' and ')}`
  }
  const left = totalSecrets - found
  return `Last star: find the ${left} remaining secret word${left > 1 ? 's' : ''}`
}
