import type { World } from './types'
import { LEVELS } from './levels'

const ids = (worldId: string) => LEVELS.filter((l) => l.worldId === worldId).map((l) => l.id)

// Worlds = player interests (any difficulty inside). Modes = special challenge sets.
// Adding a world = adding an entry here + levels (worldId) in levels.ts. No engine changes.
export const WORLDS: World[] = [
  {
    id: 'travel',
    kind: 'interest',
    title: 'Travel World',
    description: 'Trips, airports and tourism.',
    icon: '✈️',
    theme: { from: '#38c6d9', to: '#1d7bd8', accent: '#bdf0ff', deco: ['☁️', '🧳', '🗺️', '🌴'] },
    categories: ['Transport', 'Places', 'Documents'],
    levelIds: ids('travel'),
  },
  {
    id: 'business',
    kind: 'interest',
    title: 'Business World',
    description: 'Professional English for work.',
    icon: '💼',
    theme: { from: '#2f9e8f', to: '#1b4f72', accent: '#b6f2e6', deco: ['📈', '💻', '☕', '📅'] },
    categories: ['Workplace'],
    levelIds: ids('business'),
  },
  {
    id: 'music',
    kind: 'interest',
    title: 'Music World',
    description: 'Instruments, sounds and musical expressions.',
    icon: '🎸',
    theme: { from: '#8e54e9', to: '#4776e6', accent: '#d6b3ff', deco: ['🎵', '🎹', '🎤', '✨'] },
    categories: ['Instruments', 'Sounds', 'Concerts'],
    levelIds: ids('music'),
  },
  {
    id: 'movies',
    kind: 'interest',
    title: 'Movies & Series',
    description: 'Films, shows and dialogue.',
    icon: '🎬',
    theme: { from: '#e5484d', to: '#7b2cbf', accent: '#ffd9a0', deco: ['🍿', '🎥', '⭐', '📺'] },
    categories: ['TV'],
    levelIds: ids('movies'),
  },
  {
    id: 'everyday',
    kind: 'interest',
    title: 'Everyday Life',
    description: 'Shops, streets and daily situations.',
    icon: '🏙️',
    theme: { from: '#ffb347', to: '#ff6f61', accent: '#ffe08a', deco: ['🚌', '🥖', '🏪', '☀️'] },
    categories: ['Food', 'Places', 'Services'],
    levelIds: ids('everyday'),
  },
  {
    id: 'slang',
    kind: 'interest',
    title: 'Slang & Culture',
    description: 'Slang, idioms and how people really talk.',
    icon: '🗣️',
    theme: { from: '#ff4d94', to: '#ff8f00', accent: '#ffe3f0', deco: ['😎', '💬', '🔥', '🌎'] },
    categories: ['Casual talk'],
    levelIds: ids('slang'),
  },
  {
    id: 'mystery',
    kind: 'mode',
    title: 'Mystery Words',
    description: 'Special mode: secrets, clues and hidden things.',
    icon: '🕵️',
    theme: { from: '#2c3e6b', to: '#10131f', accent: '#9fb4ff', deco: ['🔍', '🌙', '🗝️', '👣'] },
    categories: ['Ideas', 'Stories', 'Adventure'],
    levelIds: ids('mystery'),
  },
]

export const INTEREST_WORLDS = WORLDS.filter((w) => w.kind === 'interest')
export const MODES = WORLDS.filter((w) => w.kind === 'mode')
export const worldById = (id: string) => WORLDS.find((w) => w.id === id)!
export const isInterestId = (id: string) => INTEREST_WORLDS.some((w) => w.id === id)
export const levelsOfWorld = (worldId: string) => LEVELS.filter((l) => l.worldId === worldId)
