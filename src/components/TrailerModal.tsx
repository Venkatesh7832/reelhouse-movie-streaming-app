import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePlayer } from '../store/player.store'
import { MediaService } from '../services/api/media.service'
export function TrailerModal() {
  const { media, close } = usePlayer()
  const { data, isLoading } = useQuery({ queryKey: ['details', media?.mediaType, media?.id], queryFn: () => MediaService.getDetails(media!.mediaType, media!.id), enabled: !!media })
  return (
    <AnimatePresence>{media && (
      <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} role="dialog" aria-modal="true" aria-label={`${media.title} trailer`}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-surface" onClick={(e) => e.stopPropagation()}>
          <button onClick={close} aria-label="Close trailer" className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2"><X size={18} /></button>
          {isLoading ? <p className="grid h-full place-items-center text-muted">Loading trailer…</p> : data?.trailerKey ? <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${data.trailerKey}?autoplay=1`} title={`${media.title} trailer`} allow="autoplay; encrypted-media; fullscreen" /> : <p className="grid h-full place-items-center text-muted">No trailer available for this title.</p>}
        </motion.div></motion.div>)}</AnimatePresence>)
}
