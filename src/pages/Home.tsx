import { useQuery } from '@tanstack/react-query'
import { Hero } from '../components/Hero'
import { MediaRow } from '../components/MediaRow'
import { MediaService, type Category } from '../services/api/media.service'
import type { MediaType } from '../types/media.types'
import { useLibrary } from '../store/library.store'
export const useList = (t: MediaType, c: Category) => useQuery({ queryKey: ['list', t, c], queryFn: () => MediaService.getList(t, c), staleTime: 5 * 60_000, retry: 1 })
const rows: [string, MediaType, Category][] = [['Trending movies', 'movie', 'trending'], ['Popular movies', 'movie', 'popular'], ['Top rated movies', 'movie', 'top_rated'], ['Upcoming movies', 'movie', 'upcoming'], ['Trending TV shows', 'tv', 'trending'], ['Popular TV shows', 'tv', 'popular'], ['Top rated TV shows', 'tv', 'top_rated']]
function Row({ r }: { r: (typeof rows)[number] }) { const q = useList(r[1], r[2]); return <MediaRow title={r[0]} items={q.data} loading={q.isLoading} error={q.isError} /> }
export default function Home() {
  const trending = useList('movie', 'trending'); const history = useLibrary((s) => s.history); const watchlist = useLibrary((s) => s.watchlist)
  const cont = history.filter((h) => h.progress < 100).map((h) => h.media)
  const seed = watchlist[0] ?? history[0]?.media
  const rec = useQuery({ queryKey: ['recs', seed?.mediaType, seed?.id], queryFn: async () => (await import('../services/api/media.service')).MediaService.getDetails(seed!.mediaType, seed!.id).then((d) => d.recommendations), enabled: !!seed })
  return <>
    {trending.isError ? <div className="grid h-[50vh] place-items-center px-4 text-center text-muted">Couldn't reach TMDB. Add your read access token to .env (VITE_TMDB_ACCESS_TOKEN) and restart the dev server.</div> : <Hero items={trending.data ?? []} />}
    <div className="-mt-10 relative z-10 pb-16"><MediaRow title="Continue watching" items={cont} /><MediaRow title="Recommended for you" items={rec.data} />{rows.map((r) => <Row key={r[0]} r={r} />)}</div></>
}
