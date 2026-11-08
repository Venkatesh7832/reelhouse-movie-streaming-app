import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { MediaGrid } from '../components/MediaRow'
import { useLibrary } from '../store/library.store'
export default function Library() {
  const { watchlist, history, removeHistory } = useLibrary(); const [f, setF] = useState<'all' | 'movie' | 'tv'>('all')
  const items = watchlist.filter((m) => f === 'all' || m.mediaType === f)
  return <div className="pb-16 pt-24"><h1 className="px-4 font-display text-3xl md:px-10">My watchlist</h1>
    <div className="my-4 flex gap-2 px-4 md:px-10">{(['all', 'movie', 'tv'] as const).map((k) => <button key={k} onClick={() => setF(k)} className={`btn ${f === k ? 'bg-accent' : 'glass'}`}>{k === 'all' ? 'All' : k === 'movie' ? 'Movies' : 'TV shows'}</button>)}</div>
    {items.length ? <MediaGrid items={items} /> : <p className="px-4 text-muted md:px-10">Nothing saved yet. <Link className="text-accent" to="/">Browse titles</Link> and tap + to add them here.</p>}
    <h2 className="mt-12 px-4 font-display text-2xl md:px-10">Watch history</h2>
    <ul className="mt-3 space-y-2 px-4 md:px-10">{history.length ? history.map((h) => <li key={`${h.media.mediaType}${h.media.id}`} className="glass flex items-center gap-3 rounded-xl p-3"><Link className="flex-1 truncate" to={`/${h.media.mediaType}/${h.media.id}`}>{h.media.title}</Link><span className="text-sm text-muted">{h.progress}% · {new Date(h.watchedAt).toLocaleDateString()}</span><button aria-label={`Remove ${h.media.title} from history`} onClick={() => removeHistory(h.media)}><Trash2 size={16} /></button></li>) : <li className="text-muted">No history yet. Mark a title as watched to see it here.</li>}</ul></div>
}
