import axios from 'axios'
import type { Media, MediaDetails, MediaType } from '../../types/media.types'

type ApiMode = 'tmdb' | 'backend'
const MODE: ApiMode = import.meta.env.VITE_API_MODE === 'backend' ? 'backend' : 'tmdb'

const http = axios.create(
  MODE === 'backend'
    ? { baseURL: import.meta.env.VITE_BACKEND_URL, timeout: 15_000, withCredentials: true }
    : {
        baseURL: 'https://api.themoviedb.org/3',
        timeout: 15_000,
        headers: import.meta.env.VITE_TMDB_ACCESS_TOKEN
          ? { Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}` }
          : {},
      },
)

interface RawMedia {
  id: number
  media_type?: string
  title?: string
  name?: string
  overview?: string
  poster_path?: string | null
  backdrop_path?: string | null
  release_date?: string
  first_air_date?: string
  vote_average?: number
}

interface TmdbListResponse { results: RawMedia[] }
interface ApiEnvelope<T> { success?: boolean; data?: T }
const unwrap = <T,>(payload: T | ApiEnvelope<T>): T =>
  payload && typeof payload === 'object' && 'data' in payload
    ? ((payload as ApiEnvelope<T>).data as T)
    : (payload as T)

const normalize = (raw: RawMedia, forcedType?: MediaType): Media => ({
  id: raw.id,
  mediaType: forcedType ?? (raw.media_type === 'tv' ? 'tv' : 'movie'),
  title: raw.title ?? raw.name ?? 'Untitled',
  overview: raw.overview ?? '',
  posterPath: raw.poster_path ?? null,
  backdropPath: raw.backdrop_path ?? null,
  year: (raw.release_date ?? raw.first_air_date ?? '').slice(0, 4),
  rating: Math.round((raw.vote_average ?? 0) * 10) / 10,
})

const tmdbList = async (path: string, type: MediaType): Promise<Media[]> => {
  const response = await http.get<TmdbListResponse>(path)
  return (response.data.results ?? []).map((item) => normalize(item, type))
}

const backendList = async (path: string): Promise<Media[]> => {
  const response = await http.get<Media[] | ApiEnvelope<Media[]>>(path)
  const data = unwrap(response.data)
  return Array.isArray(data) ? data : []
}

export type Category = 'trending' | 'popular' | 'top_rated' | 'upcoming'

const detailsPath = (type: MediaType, id: number) =>
  MODE === 'backend' ? `/${type === 'movie' ? 'movies' : 'tv'}/${id}/details` : `/${type}/${id}`

export const MediaService = {
  getList: (type: MediaType, category: Category): Promise<Media[]> => {
    if (MODE === 'backend') {
      return backendList(`/${type === 'movie' ? 'movies' : 'tv'}/${category}`)
    }
    if (category === 'trending') return tmdbList(`/trending/${type}/week`, type)
    const endpoint = category === 'upcoming' && type === 'tv' ? 'on_the_air' : category
    return tmdbList(`/${type}/${endpoint}`, type)
  },

  async getDetails(type: MediaType, id: number): Promise<MediaDetails> {
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid media ID.')

    if (MODE === 'backend') {
      const response = await http.get<MediaDetails | ApiEnvelope<MediaDetails>>(detailsPath(type, id))
      return unwrap(response.data)
    }

    const response = await http.get<
      RawMedia & {
        tagline?: string
        runtime?: number
        episode_run_time?: number[]
        genres?: { name: string }[]
        production_companies?: { name: string }[]
        credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] }
        videos?: { results: { key: string; site: string; type: string }[] }
        similar?: TmdbListResponse
        recommendations?: TmdbListResponse
      }
    >(`/${type}/${id}`, { params: { append_to_response: 'videos,credits,similar,recommendations' } })

    const data = response.data
    const youtubeVideos = data.videos?.results.filter((video) => video.site === 'YouTube') ?? []

    return {
      ...normalize(data, type),
      tagline: data.tagline ?? '',
      runtime: data.runtime ?? data.episode_run_time?.[0] ?? null,
      genres: data.genres?.map((genre) => genre.name) ?? [],
      companies: data.production_companies?.map((company) => company.name) ?? [],
      cast: (data.credits?.cast ?? []).slice(0, 12).map((person) => ({
        id: person.id,
        name: person.name,
        role: person.character,
        profilePath: person.profile_path,
      })),
      trailerKey: (youtubeVideos.find((video) => video.type === 'Trailer') ?? youtubeVideos[0])?.key ?? null,
      similar: (data.similar?.results ?? []).slice(0, 20).map((item) => normalize(item, type)),
      recommendations: (data.recommendations?.results ?? []).slice(0, 20).map((item) => normalize(item, type)),
    }
  },

  async search(query: string): Promise<Media[]> {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return []

    if (MODE === 'backend') {
      const response = await http.get<Media[] | ApiEnvelope<Media[]>>('/search', {
        params: { query: normalizedQuery },
      })
      const data = unwrap(response.data)
      return Array.isArray(data) ? data : []
    }

    const response = await http.get<TmdbListResponse>('/search/multi', {
      params: { query: normalizedQuery, include_adult: false },
    })

    return (response.data.results ?? [])
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item) => normalize(item))
  },
}
