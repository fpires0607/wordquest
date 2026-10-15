export interface Streak {
  count: number
  best: number
  lastDay: string | null // local date, YYYY-MM-DD
}
export const emptyStreak = (): Streak => ({ count: 0, best: 0, lastDay: null })

/** Local calendar day (not UTC), so "today" matches the player's clock. */
export function dayKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

const dayNumber = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return Math.round(Date.UTC(y, m - 1, d) / 86400000) // pure calendar arithmetic, immune to DST
}

/** Registers an activity on `today`: same day = no change, next day = +1, any gap = restart at 1. */
export function bumpStreak(s: Streak, today: string): Streak {
  if (s.lastDay === today) return s
  const consecutive = s.lastDay !== null && dayNumber(today) - dayNumber(s.lastDay) === 1
  const count = consecutive ? s.count + 1 : 1
  return { count, best: Math.max(s.best, count), lastDay: today }
}

/** What to display today: a streak survives until the end of the day after the last activity. */
export function currentStreak(s: Streak, today: string): { count: number; doneToday: boolean } {
  if (s.lastDay === null) return { count: 0, doneToday: false }
  const gap = dayNumber(today) - dayNumber(s.lastDay)
  if (gap === 0) return { count: s.count, doneToday: true }
  if (gap === 1) return { count: s.count, doneToday: false } // still alive, do something today to keep it
  return { count: 0, doneToday: false }
}
