import type { Media } from '../types/media.types'
import { MediaCard } from './MediaCard'
export function MediaRow({ title, items, loading, error }: { title: string; items?: Media[]; loading?: boolean; error?: boolean }) {
  if (!loading && !error && !items?.length) return null
  return (
    <section className="mt-8" aria-label={title}>
      <h2 className="mb-3 px-4 font-display text-xl md:px-10">{title}</h2>
      {error ? <p className="px-4 text-sm text-muted md:px-10">Couldn't load this row. Check your TMDB token in .env and reload.</p> :
      <div className="no-sb flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:gap-4 md:px-10">
        {loading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[2/3] w-36 shrink-0 animate-pulse rounded-xl bg-surface2 md:w-44" />) :
          items?.map((m) => <div key={`${m.mediaType}${m.id}`} className="w-36 shrink-0 snap-start md:w-44"><MediaCard media={m} /></div>)}
      </div>}
    </section>)
}
export function MediaGrid({ items }: { items: Media[] }) {
  return <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 md:grid-cols-4 md:px-10 lg:grid-cols-6">{items.map((m) => <MediaCard key={`${m.mediaType}${m.id}`} media={m} />)}</div>
}
