import { Link } from 'react-router-dom'
import { Trash2, History as HistoryIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLibrary } from '../store/library.store'
import { img, onImgError } from '../utils/image'

export default function WatchHistory() {
  const history = useLibrary((s) => s.history)
  const removeHistory = useLibrary((s) => s.removeHistory)
  const clearHistory = useLibrary((s) => s.clearHistory)

  return (
    <section className="min-h-screen px-4 pb-20 pt-28 md:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-accent"><HistoryIcon size={16} /> YOUR ACTIVITY</p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Watch history</h1>
          <p className="mt-2 text-sm text-muted">Titles you've watched or started watching.</p>
        </div>
        {history.length > 0 && <button className="btn glass" onClick={() => { clearHistory(); toast.success('Watch history cleared') }}><Trash2 size={16} />Clear history</button>}
      </div>
      {history.length === 0 ? (
        <div className="glass grid min-h-64 place-items-center rounded-2xl p-8 text-center">
          <div><HistoryIcon className="mx-auto mb-3 text-muted" size={32} /><h2 className="font-display text-xl">Your history is empty</h2><p className="mt-2 text-sm text-muted">Start exploring movies and shows to build your history.</p><Link to="/" className="btn mt-5 bg-accent">Explore titles</Link></div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <article key={`${entry.media.mediaType}-${entry.media.id}`} className="glass flex items-center gap-4 rounded-2xl p-3">
              <Link to={`/${entry.media.mediaType}/${entry.media.id}`} className="w-16 shrink-0 overflow-hidden rounded-lg sm:w-20">
                <img src={img(entry.media.posterPath)} onError={onImgError} alt={entry.media.title} className="aspect-[2/3] w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/${entry.media.mediaType}/${entry.media.id}`} className="truncate font-semibold hover:text-accent">{entry.media.title}</Link>
                <p className="mt-1 text-xs text-muted">{entry.media.mediaType === 'tv' ? 'TV show' : 'Movie'} · {new Date(entry.watchedAt).toLocaleDateString()}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-accent" style={{ width: `${entry.progress}%` }} /></div>
                <p className="mt-1 text-xs text-muted">{entry.progress}% watched</p>
              </div>
              <button aria-label={`Remove ${entry.media.title} from history`} className="rounded-full p-2 text-muted hover:bg-white/10 hover:text-white" onClick={() => { removeHistory(entry.media); toast.success('Removed from history') }}><Trash2 size={17} /></button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
