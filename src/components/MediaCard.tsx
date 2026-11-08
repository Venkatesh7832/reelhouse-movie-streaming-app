import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Plus, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Media } from '../types/media.types'
import { img, onImgError } from '../utils/image'
import { useLibrary } from '../store/library.store'
export function MediaCard({ media }: { media: Media }) {
  const saved = useLibrary((s) => s.watchlist.some((x) => x.id === media.id && x.mediaType === media.mediaType))
  const watched = useLibrary((s) => s.history.some((h) => h.media.id === media.id && h.media.mediaType === media.mediaType && h.progress >= 100))
  const { toggleWatchlist, markWatched } = useLibrary()
  return (
    <motion.article whileHover={{ y: -6 }} className="group relative w-full shrink-0 focus-within:ring-2 focus-within:ring-accent rounded-xl">
      <Link to={`/${media.mediaType}/${media.id}`} aria-label={`View details for ${media.title}`}>
        <motion.img layoutId={`poster-${media.mediaType}-${media.id}`} src={img(media.posterPath)} onError={onImgError} alt={media.title} loading="lazy" className="aspect-[2/3] w-full rounded-xl bg-surface2 object-cover shadow-lg" />
      </Link>
      <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 rounded-b-xl bg-gradient-to-t from-black/90 to-transparent p-2 pt-10 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100">
        <button className="btn glass !p-2" aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'} onClick={() => toast(toggleWatchlist(media) ? 'Added to watchlist' : 'Removed from watchlist')}>{saved ? <Check size={16} /> : <Plus size={16} />}</button>
        <button className={`btn !p-2 ${watched ? 'bg-accent' : 'glass'}`} aria-label="Mark as watched" onClick={() => { markWatched(media); toast('Marked as watched') }}><Check size={16} /></button>
      </div>
      <h3 className="mt-2 truncate text-sm font-semibold">{media.title}</h3>
      <p className="flex items-center gap-2 text-xs text-muted">{media.year} <span className="flex items-center gap-0.5"><Star size={11} className="fill-accent text-accent" />{media.rating}</span> {media.mediaType === 'tv' ? 'TV' : 'Movie'}</p>
    </motion.article>)
}
