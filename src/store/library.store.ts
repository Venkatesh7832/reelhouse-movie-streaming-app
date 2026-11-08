import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry, Media } from '../types/media.types'
// Watchlist + history. localStorage is confined to this persist layer.
const key = (m: Media) => `${m.mediaType}-${m.id}`
interface LibState { watchlist: Media[]; history: HistoryEntry[]; toggleWatchlist: (m: Media) => boolean; inWatchlist: (m: Media) => boolean; setProgress: (m: Media, p: number) => void; markWatched: (m: Media) => void; removeHistory: (m: Media) => void; clearHistory: () => void; isWatched: (m: Media) => boolean }
export const useLibrary = create<LibState>()(persist((set, get) => ({ watchlist: [], history: [],
  inWatchlist: (m) => get().watchlist.some((x) => key(x) === key(m)),
  toggleWatchlist: (m) => { const has = get().inWatchlist(m); set({ watchlist: has ? get().watchlist.filter((x) => key(x) !== key(m)) : [m, ...get().watchlist] }); return !has },
  setProgress: (m, p) => set({ history: [{ media: m, progress: Math.max(0, Math.min(100, p)), watchedAt: new Date().toISOString() }, ...get().history.filter((h) => key(h.media) !== key(m))] }),
  markWatched: (m) => get().setProgress(m, 100),
  removeHistory: (m) => set({ history: get().history.filter((h) => key(h.media) !== key(m)) }),
  clearHistory: () => set({ history: [] }),
  isWatched: (m) => get().history.some((h) => key(h.media) === key(m) && h.progress >= 100) }), { name: 'rh-library' }))
interface SearchState { items: string[]; add: (q: string) => void; clear: () => void }
export const useSearchHistory = create<SearchState>()(persist((set, get) => ({ items: [], add: (q) => set({ items: [q, ...get().items.filter((x) => x !== q)].slice(0, 8) }), clear: () => set({ items: [] }) }), { name: 'rh-search' }))
