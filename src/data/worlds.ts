import type { World } from './types'
import { LEVELS } from './levels'

const ids = (worldId: string) => LEVELS.filter((l) => l.worldId === worldId).map((l) => l.id)

// Adding a world = adding an entry here + levels in levels.ts. No engine changes.
export const WORLDS: World[] = [
  {
    id: 'city',
    title: 'Everyday City',
    description: 'Shops, streets and daily life.',
    icon: '🏙️',
    theme: { from: '#ffb347', to: '#ff6f61', accent: '#ffe08a', deco: ['🚌', '🥖', '🏪', '☀️'] },
    categories: ['Food', 'Places', 'Services'],
    levelIds: ids('city'),
  },
  {
    id: 'music',
    title: 'Music World',
    description: 'Instruments, sounds and concerts.',
    icon: '🎸',
    theme: { from: '#8e54e9', to: '#4776e6', accent: '#d6b3ff', deco: ['🎵', '🎹', '🎤', '✨'] },
    categories: ['Instruments', 'Sounds', 'Concerts'],
    levelIds: ids('music'),
  },
  {
    id: 'travel',
    title: 'Travel Quest',
    description: 'Airports, tickets and adventures.',
    icon: '✈️',
    theme: { from: '#38c6d9', to: '#1d7bd8', accent: '#bdf0ff', deco: ['☁️', '🧳', '🗺️', '🌴'] },
    categories: ['Transport', 'Places', 'Documents'],
    levelIds: ids('travel'),
  },
  {
    id: 'mystery',
    title: 'Mystery Words',
    description: 'Secrets, clues and hidden things.',
    icon: '🕵️',
    theme: { from: '#2c3e6b', to: '#10131f', accent: '#9fb4ff', deco: ['🔍', '🌙', '🗝️', '👣'] },
    categories: ['Ideas', 'Stories', 'Adventure'],
    levelIds: ids('mystery'),
  },
]

export const worldById = (id: string) => WORLDS.find((w) => w.id === id)!
