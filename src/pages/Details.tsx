import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Play, Plus, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { MediaService } from '../services/api/media.service'
import { MediaRow } from '../components/MediaRow'
import { img, onImgError } from '../utils/image'
import { usePlayer } from '../store/player.store'
import { useLibrary } from '../store/library.store'
import type { MediaType } from '../types/media.types'
export default function Details({ type }: { type: MediaType }) {
  const id = Number(useParams().id); const nav = useNavigate(); const open = usePlayer((s) => s.open)
  const lib = useLibrary()
  const { data: d, isLoading, isError } = useQuery({ queryKey: ['details', type, id], queryFn: () => MediaService.getDetails(type, id), staleTime: 10 * 60_000, retry: 1 })
  if (isLoading) return <div className="grid h-screen place-items-center text-muted">Loading…</div>
  if (isError || !d) return <div className="grid h-screen place-items-center px-4 text-center text-muted">Couldn't load this title. <Link to="/" className="ml-2 text-accent">Go home</Link></div>
  const saved = lib.inWatchlist(d); const prog = lib.history.find((h) => h.media.id === d.id && h.media.mediaType === d.mediaType)?.progress ?? 0
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-16">
    <div className="relative h-[55vh]"><img src={img(d.backdropPath, 'original')} onError={onImgError} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-bg to-bg/30" />
      <button onClick={() => nav(-1)} className="btn glass absolute left-4 top-20 md:left-10"><ArrowLeft size={16} />Back</button></div>
    <div className="-mt-40 relative flex flex-col gap-6 px-4 md:flex-row md:px-10">
      <motion.img layoutId={`poster-${d.mediaType}-${d.id}`} src={img(d.posterPath, 'w780')} onError={onImgError} alt={d.title} className="w-48 self-start rounded-2xl shadow-2xl md:w-64" />
      <div className="max-w-3xl"><h1 className="font-display text-4xl font-extrabold md:text-5xl">{d.title}</h1>{d.tagline && <p className="mt-1 italic text-muted">{d.tagline}</p>}
        <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">{d.year}<span className="flex items-center gap-1"><Star size={14} className="fill-accent text-accent" />{d.rating}</span>{d.runtime ? `${d.runtime} min` : null}{d.genres.join(', ')}</p>
        <p className="mt-4 leading-relaxed text-zinc-200">{d.overview}</p>
        <div className="mt-5 flex flex-wrap gap-3"><button className="btn bg-accent" onClick={() => open(d)}><Play size={16} />Play trailer</button>
          <button className="btn glass" onClick={() => toast(lib.toggleWatchlist(d) ? 'Added to watchlist' : 'Removed from watchlist')}>{saved ? <Check size={16} /> : <Plus size={16} />}{saved ? 'In watchlist' : 'Add to watchlist'}</button>
          <button className="btn glass" onClick={() => { lib.markWatched(d); toast('Marked as watched') }}><Check size={16} />Mark as watched</button></div>
        <label className="mt-5 block text-sm text-muted">Progress: {prog}%<input type="range" min={0} max={100} value={prog} onChange={(e) => lib.setProgress(d, Number(e.target.value))} className="mt-1 w-full accent-accent" /></label>
        {d.companies.length > 0 && <p className="mt-4 text-sm text-muted">Produced by {d.companies.join(', ')}</p>}</div></div>
    {d.cast.length > 0 && <section className="mt-10"><h2 className="mb-3 px-4 font-display text-xl md:px-10">Cast</h2><div className="no-sb flex gap-4 overflow-x-auto px-4 md:px-10">{d.cast.map((p) => <div key={p.id} className="w-24 shrink-0 text-center"><img src={img(p.profilePath)} onError={onImgError} alt={p.name} className="aspect-square w-24 rounded-full object-cover" /><p className="mt-1 truncate text-xs font-semibold">{p.name}</p><p className="truncate text-xs text-muted">{p.role}</p></div>)}</div></section>}
    <MediaRow title="Recommendations" items={d.recommendations} /><MediaRow title="Similar titles" items={d.similar} /></motion.div>
}
