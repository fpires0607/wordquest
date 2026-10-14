import type { LicenseInfo } from '../data/types'

export type Feature = 'text' | 'translation' | 'audio'

/**
 * Gate for any content that is not our own. Content without a license is original.
 * Real song excerpts must be `licensed`/`public-domain` AND explicitly allow each feature;
 * `unverified` is always blocked. Nothing in the app fetches or generates lyrics.
 */
export function canUse(license: LicenseInfo | undefined, feature: Feature, today = new Date()): boolean {
  if (!license || license.status === 'original') return true
  if (license.status === 'unverified') return false
  if (license.expires && new Date(license.expires) < today) return false
  return license.allow?.[feature] === true
}
