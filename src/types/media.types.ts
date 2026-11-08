export type MediaType = 'movie' | 'tv'
export interface Media { id: number; mediaType: MediaType; title: string; overview: string; posterPath: string | null; backdropPath: string | null; year: string; rating: number }
export interface Person { id: number; name: string; role: string; profilePath: string | null }
export interface MediaDetails extends Media { tagline: string; runtime: number | null; genres: string[]; companies: string[]; cast: Person[]; trailerKey: string | null; similar: Media[]; recommendations: Media[] }
export interface User { id: string; name: string; email: string }
export interface HistoryEntry { media: Media; progress: number; watchedAt: string }
