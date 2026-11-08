import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MediaService } from '../services/api/media.service'
import { MediaGrid } from '../components/MediaRow'
import { useSearchHistory } from '../store/library.store'
const filters = [['all', 'All'], ['movie', 'Movies'], ['tv', 'TV shows']] as const
export default function Search() {
  const [q, setQ] = useState(''); const [dq, setDq] = useState(''); const [f, setF] = useState<(typeof filters)[number][0]>('all'); const h = useSearchHistory()
  useEffect(() => { const t = setTimeout(() => { setDq(q.trim()); if (q.trim().length > 2) h.add(q.trim()) }, 400); return () => clearTimeout(t) }, [q]) // eslint-disable-line
  const { data, isFetching, isError } = useQuery({ queryKey: ['search', dq], queryFn: () => MediaService.search(dq), enabled: dq.length > 1, staleTime: 5 * 60_000 })
  const items = (data ?? []).filter((m) => f === 'all' || m.mediaType === f)
  return <div className="pb-16 pt-24"><div className="px-4 md:px-10"><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search movies and TV shows" aria-label="Search" className="glass w-full max-w-2xl rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-accent" />
    <div className="mt-3 flex flex-wrap gap-2">{filters.map(([k, l]) => <button key={k} onClick={() => setF(k)} aria-pressed={f === k} className={`btn ${f === k ? 'bg-accent' : 'glass'}`}>{l}</button>)}</div>
    {!dq && h.items.length > 0 && <div className="mt-4 text-sm text-muted">Recent: {h.items.map((s) => <button key={s} onClick={() => setQ(s)} className="mr-3 underline">{s}</button>)}<button onClick={h.clear} className="text-accent">Clear history</button></div>}</div>
    <div className="mt-6">{isFetching ? <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:px-10 lg:grid-cols-6">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-surface2" />)}</div>
      : isError ? <p className="px-4 text-muted md:px-10">Search failed. Check your TMDB token.</p> : dq && !items.length ? <p className="px-4 text-muted md:px-10">No results for “{dq}”. Try a different title.</p> : <MediaGrid items={items} />}</div></div>
}
