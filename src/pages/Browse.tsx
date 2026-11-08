import { useState } from 'react'
import { MediaGrid } from '../components/MediaRow'
import { useList } from './Home'
import type { MediaType } from '../types/media.types'
import type { Category } from '../services/api/media.service'
const tabs: [Category, string][] = [['popular', 'Popular'], ['top_rated', 'Top rated'], ['trending', 'Trending']]
export default function Browse({ type }: { type: MediaType }) {
  const [c, setC] = useState<Category>('popular'); const q = useList(type, c)
  return <div className="pb-16 pt-24"><h1 className="px-4 font-display text-3xl md:px-10">{type === 'movie' ? 'Movies' : 'TV shows'}</h1>
    <div className="my-4 flex gap-2 px-4 md:px-10" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={c === k} onClick={() => setC(k)} className={`btn ${c === k ? 'bg-accent' : 'glass'}`}>{l}</button>)}</div>
    {q.isLoading ? <p className="px-4 text-muted md:px-10">Loading…</p> : q.isError ? <p className="px-4 text-muted md:px-10">Couldn't load titles. Check your TMDB token.</p> : <MediaGrid items={q.data ?? []} />}</div>
}
