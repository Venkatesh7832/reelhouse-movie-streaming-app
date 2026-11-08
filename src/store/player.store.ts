import { create } from 'zustand'
import type { Media } from '../types/media.types'
interface PlayerState { media: Media | null; open: (m: Media) => void; close: () => void }
export const usePlayer = create<PlayerState>((set) => ({ media: null, open: (media) => set({ media }), close: () => set({ media: null }) }))
