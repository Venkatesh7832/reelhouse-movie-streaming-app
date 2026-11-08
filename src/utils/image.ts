import type { SyntheticEvent } from 'react'

const BASE = 'https://image.tmdb.org/t/p/'
export type ImgSize = 'w500' | 'w780' | 'original'
export const img = (p: string | null, s: ImgSize = 'w500') => (p ? `${BASE}${s}${p}` : '/placeholder-poster.svg')
export const onImgError = (e: SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = '/placeholder-poster.svg' }
