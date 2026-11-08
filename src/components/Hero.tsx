import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Info, Play, Star } from 'lucide-react'
import type { Media } from '../types/media.types'
import { img, onImgError } from '../utils/image'
import { usePlayer } from '../store/player.store'
export function Hero({ items }: { items: Media[] }) {
  const [i, setI] = useState(0); const open = usePlayer((s) => s.open)
  const list = items.filter((m) => m.backdropPath).slice(0, 6)
  useEffect(() => { if (list.length < 2) return; const t = setInterval(() => setI((x) => (x + 1) % list.length), 9000); return () => clearInterval(t) }, [list.length])
  const m = list[i]; if (!m) return <div className="h-[70vh] animate-pulse bg-surface" />
  const step = (d: number) => setI((i + d + list.length) % list.length)
  return (
    <section className="relative h-[75vh] min-h-[480px] overflow-hidden" aria-label="Featured">
      <AnimatePresence mode="wait"><motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
        <img src={img(m.backdropPath, 'original')} onError={onImgError} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" /><div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/30 to-transparent" />
        <div className="absolute bottom-16 left-4 max-w-xl md:left-10"><h1 className="font-display text-4xl font-extrabold md:text-6xl">{m.title}</h1>
          <p className="mt-3 flex items-center gap-3 text-sm text-muted">{m.year}<span className="flex items-center gap-1"><Star size={14} className="fill-accent text-accent" />{m.rating}</span>{m.mediaType === 'tv' ? 'TV Show' : 'Movie'}</p>
          <p className="mt-3 line-clamp-3 text-sm text-zinc-200 md:text-base">{m.overview}</p>
          <div className="mt-5 flex gap-3"><button className="btn bg-accent" onClick={() => open(m)}><Play size={16} />Watch trailer</button><Link to={`/${m.mediaType}/${m.id}`} className="btn glass"><Info size={16} />More details</Link></div></div>
      </motion.div></AnimatePresence>
      <div className="absolute bottom-6 right-4 flex gap-2 md:right-10"><button className="btn glass !p-2" aria-label="Previous" onClick={() => step(-1)}><ChevronLeft /></button><button className="btn glass !p-2" aria-label="Next" onClick={() => step(1)}><ChevronRight /></button></div>
    </section>)
}
